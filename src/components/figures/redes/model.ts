// Modelo puro del rack: tabla de rutas, ACL del firewall y el recorrido de cada paquete en el tiempo.
// Lo usan el build (pose inicial) y el script en vivo, así que el dibujo, el movimiento y la lectura
// salen de las mismas reglas: coincidencia del prefijo más largo y ACL evaluada en orden.

export type Mode = 'acl' | 'abierto';
export type Proto = 'tcp' | 'udp';
export type Iface = 'Gi0/1.10' | 'Gi0/1.20' | 'Gi0/2' | 'Null0';

export interface Route {
	code: 'C' | 'S';
	net: string;
	len: number;
	via: Iface;
}

/** `show ip route` del router (resumida). El /8 a Null0 descarta lo que no tiene red concreta. */
export const ROUTES: Route[] = [
	{ code: 'C', net: '10.10.10.0', len: 24, via: 'Gi0/1.10' },
	{ code: 'C', net: '10.10.20.0', len: 24, via: 'Gi0/1.20' },
	{ code: 'C', net: '10.10.30.0', len: 24, via: 'Gi0/2' },
	{ code: 'S', net: '10.0.0.0', len: 8, via: 'Null0' },
];

export interface Packet {
	src: string;
	dst: string;
	proto: Proto;
	port: number;
	/** Respuesta de una conexión TCP abierta desde dentro (bit ACK). */
	est?: boolean;
}

export interface Ace {
	seq: number;
	action: 'permit' | 'deny';
	text: string;
	match: (packet: Packet) => boolean;
}

const ip = (text: string) => text.split('.').reduce((n, octet) => n * 256 + Number(octet), 0);
const inNet = (addr: string, net: string, len: number) => {
	const size = 2 ** (32 - len);
	return Math.floor(ip(addr) / size) === Math.floor(ip(net) / size);
};

/** ACL OUTSIDE_IN del firewall, en el orden en que la evalúa (gana la primera coincidencia). */
export const ACL: Ace[] = [
	{ seq: 10, action: 'permit', text: 'tcp any host 10.10.30.10 eq 443', match: (p) => p.proto === 'tcp' && p.dst === '10.10.30.10' && p.port === 443 },
	{ seq: 20, action: 'permit', text: 'udp any host 10.10.30.10 eq 53', match: (p) => p.proto === 'udp' && p.dst === '10.10.30.10' && p.port === 53 },
	{ seq: 30, action: 'permit', text: 'tcp any 10.10.0.0 0.0.255.255 established', match: (p) => p.proto === 'tcp' && !!p.est && inNet(p.dst, '10.10.0.0', 16) },
	{ seq: 40, action: 'deny', text: 'ip any any log', match: () => true },
];

export const aclOf = (packet: Packet) => ACL.find((ace) => ace.match(packet))!;

/** Coincidencia del prefijo más largo; sin ruta, el router lo descarta igual que Null0. */
export function lookup(dst: string): Route | null {
	let best: Route | null = null;
	for (const route of ROUTES) if (inNet(dst, route.net, route.len) && (!best || route.len > best.len)) best = route;
	return best;
}

/** Puerto del switch donde aprendió la MAC del host: VLAN 10 en 2–12 (el 1 es el del ISP), VLAN 20 en 13–24. */
export function switchPort(dst: string) {
	const host = ip(dst) % 256;
	return inNet(dst, '10.10.20.0', 24) ? 12 + (host % 12 || 12) : 2 + (host % 11);
}

/** Tráfico que entra desde el ISP, en orden. Mezcla servicios publicados, respuestas y ataques. */
export const PACKETS: Packet[] = [
	{ src: '203.0.113.24', dst: '10.10.30.10', proto: 'tcp', port: 443 },
	{ src: '198.51.100.7', dst: '10.10.20.14', proto: 'tcp', port: 51544, est: true },
	{ src: '45.155.205.9', dst: '10.10.10.23', proto: 'tcp', port: 23 },
	{ src: '192.0.2.80', dst: '10.10.30.10', proto: 'udp', port: 53 },
	{ src: '198.51.100.7', dst: '10.10.10.5', proto: 'tcp', port: 50112, est: true },
	{ src: '203.0.113.24', dst: '10.10.99.7', proto: 'tcp', port: 49822, est: true },
	{ src: '45.155.205.9', dst: '10.10.30.10', proto: 'tcp', port: 445 },
	{ src: '192.0.2.80', dst: '10.10.20.9', proto: 'tcp', port: 50020, est: true },
];

/** Puertos del switch con destino LAN (con ACL o sin ella): cada uno lleva su cordón al patch panel. */
export const LAN_PORTS = [...new Set(PACKETS.filter((p) => lookup(p.dst)?.via.startsWith('Gi0/1')).map((p) => switchPort(p.dst)))].sort((a, b) => a - b);

/** Dónde se detiene un paquete: firewall, router, switch, servidor o un puerto del patch panel. */
export type Spot = 'fw' | 'rt' | 'sw' | 'srv' | 'exit';

export type Verdict = 'inspect' | 'deny' | 'lookup' | 'null' | 'deliver' | 'exit' | 'switch';

export type Leg = { kind: 'cord'; cord: string; dur: number; reverse?: boolean } | { kind: 'hold'; at: Spot; dur: number; port?: number; verdict: Verdict };

/** Segundos entre paquetes. Con 8 paquetes, el ciclo completo dura 8 × SPACING. */
export const SPACING = 1.75;
export const CYCLE = SPACING * PACKETS.length;
/** Pose fija para movimiento reducido y para el primer pintado: el firewall acaba de bloquear el telnet. */
export const STILL_T = SPACING * 2 + 2.45;

/** Recorrido de un paquete según la ACL (si está activa) y la tabla de rutas. */
export function journey(packet: Packet, mode: Mode): Leg[] {
	const legs: Leg[] = [
		{ kind: 'cord', cord: 'isp', dur: 1.0 },
		{ kind: 'cord', cord: 'wan', dur: 0.8 },
		{ kind: 'hold', at: 'fw', dur: 0.45, verdict: 'inspect' },
	];
	if (aclOf(packet).action === 'deny' && mode === 'acl') {
		legs.push({ kind: 'hold', at: 'fw', dur: 0.9, verdict: 'deny' });
		return legs;
	}
	legs.push({ kind: 'cord', cord: 'fw-rt', dur: 0.5 }, { kind: 'hold', at: 'rt', dur: 0.4, verdict: 'lookup' });
	const route = lookup(packet.dst);
	if (!route || route.via === 'Null0') {
		legs.push({ kind: 'hold', at: 'rt', dur: 0.8, verdict: 'null' });
		return legs;
	}
	if (route.via === 'Gi0/2') {
		legs.push({ kind: 'cord', cord: 'srv', dur: 0.85 }, { kind: 'hold', at: 'srv', dur: 0.5, verdict: 'deliver' });
		return legs;
	}
	const port = switchPort(packet.dst);
	legs.push(
		{ kind: 'cord', cord: 'trunk', dur: 0.55 },
		{ kind: 'hold', at: 'sw', dur: 0.15, port, verdict: 'switch' },
		{ kind: 'cord', cord: `lan-${port}`, dur: 0.5, reverse: true },
		{ kind: 'hold', at: 'exit', dur: 0.4, port, verdict: 'exit' },
	);
	return legs;
}

export interface Flight {
	/** Número de paquete desde el arranque (n-ésimo lanzado). */
	n: number;
	packet: Packet;
	mode: Mode;
	leg: Leg;
	/** Índice del tramo y avance (0–1) dentro de él. */
	index: number;
	s: number;
}

export const packetOf = (n: number) => PACKETS[((n % PACKETS.length) + PACKETS.length) % PACKETS.length];

/** Paquetes en vuelo en el instante `time`. `modeOf(n)` da el modo con que salió cada paquete. */
export function flightsAt(time: number, modeOf: (n: number) => Mode): Flight[] {
	const out: Flight[] = [];
	const newest = Math.floor(time / SPACING);
	for (let n = newest; n >= newest - 5; n--) {
		const age = time - n * SPACING;
		const packet = packetOf(n);
		const mode = modeOf(n);
		const legs = journey(packet, mode);
		let start = 0;
		for (let index = 0; index < legs.length; index++) {
			const leg = legs[index];
			if (age < start + leg.dur) {
				out.push({ n, packet, mode, leg, index, s: (age - start) / leg.dur });
				break;
			}
			start += leg.dur;
		}
	}
	return out;
}

/** Lectura de la decisión que tomó la red con un paquete. */
export function verdictOf(packet: Packet, mode: Mode) {
	const ace = aclOf(packet);
	const target = `${packet.dst}:${packet.port}`;
	if (ace.action === 'deny') return mode === 'acl' ? `${target} · deny ${ace.seq}` : `${target} · sin ACL, entra`;
	const route = lookup(packet.dst);
	if (!route || route.via === 'Null0') return `${packet.dst} · /${route?.len ?? 0} → Null0`;
	if (route.via === 'Gi0/2') return `${target} · permit ${ace.seq} → Gi0/2`;
	return `${packet.dst} · ${route.via} → p${switchPort(packet.dst)}`;
}

export const IDLE = 'esperando tráfico';

/** La lectura muestra el último paquete que ya pasó por el firewall (o el que está siendo inspeccionado). */
export function readoutAt(flights: Flight[]) {
	const decided = flights.filter((f) => f.index >= 2).sort((a, b) => b.n - a.n)[0];
	if (!decided) return IDLE;
	const { packet, leg, mode } = decided;
	const target = `${packet.dst}:${packet.port}`;
	if (leg.kind === 'hold' && leg.verdict === 'inspect') return `${target} · inspeccionando`;
	// Camino del router: el firewall ya decidió, pero la ruta aún no se ha consultado.
	if (leg.kind === 'cord' && leg.cord === 'fw-rt') {
		const ace = aclOf(packet);
		return ace.action === 'deny' ? `${target} · sin ACL, entra` : `${target} · permit ${ace.seq}`;
	}
	return verdictOf(packet, mode);
}
