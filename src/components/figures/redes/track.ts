// Dónde está cada paquete y qué LED está encendido en un instante. Puro y sin DOM: lo usan el build
// (pose inicial del SVG) y el script en vivo, a partir de los recorridos que calcula geometry.
import { aclOf, lookup, type Flight } from './model';

export type Flat = [number, number];

/** Un cordón proyectado: puntos de pantalla aplanados [x0, y0, x1, y1…] y longitud acumulada. */
export interface Track {
	pts: number[];
	len: number[];
}

export interface TrackData {
	cords: Record<string, Track>;
	/** Punto de pantalla donde el router «tira» a Null0. */
	nullSpot: Flat;
	/** Tramo (0–1) del cable del ISP que va por dentro del organizador, tras los dedos. */
	ispDuct: [number, number];
}

/** Color del paquete: 0 sin inspeccionar, 1 inspección, 2 bloqueado, 3 permitido, 4 Null0, 5 dañino sin ACL. */
export type Code = 0 | 1 | 2 | 3 | 4 | 5;

export interface PacketPose {
	x: number;
	y: number;
	a: number;
	code: Code;
}

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const smooth = (a: number, b: number, x: number) => {
	const t = clamp01((x - a) / (b - a));
	return t * t * (3 - 2 * t);
};
const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const lerp = (a: Flat, b: Flat, t: number): Flat => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

export function pointAt({ pts, len }: Track, s: number): Flat {
	const want = clamp01(s) * len[len.length - 1];
	let i = 1;
	while (i < len.length - 1 && len[i] < want) i++;
	const t = (want - len[i - 1]) / (len[i] - len[i - 1] || 1);
	return [pts[(i - 1) * 2] + (pts[i * 2] - pts[(i - 1) * 2]) * t, pts[(i - 1) * 2 + 1] + (pts[i * 2 + 1] - pts[(i - 1) * 2 + 1]) * t];
}

const first = (track: Track): Flat => [track.pts[0], track.pts[1]];
const last = (track: Track): Flat => [track.pts[track.pts.length - 2], track.pts[track.pts.length - 1]];

/** Un paquete que la ACL bloquearía: rojo mientras lo inspeccionan y, sin ACL, también al cruzar. */
export const harmful = (f: Flight) => aclOf(f.packet).action === 'deny';

/** Puerto de salida que eligió el router: el inicio del cordón del siguiente salto, o Null0. */
function lookupExit(f: Flight, data: TrackData): Flat {
	const via = lookup(f.packet.dst)?.via;
	if (via === 'Gi0/2') return first(data.cords.srv);
	if (via === 'Gi0/1.10' || via === 'Gi0/1.20') return first(data.cords.trunk);
	return data.nullSpot;
}

export function packetPose(f: Flight, data: TrackData): PacketPose {
	const { cords } = data;
	const { leg, s } = f;
	const bad = harmful(f);
	const after: Code = bad ? 5 : 3;
	if (leg.kind === 'cord') {
		const [x, y] = pointAt(cords[leg.cord], leg.reverse ? 1 - ease(s) : ease(s));
		let a = 1;
		if (leg.cord === 'isp') {
			// Dentro del organizador se atenúa: lo tapan los dedos (el paquete se pinta por encima).
			const [d0, d1] = data.ispDuct;
			const e = ease(s);
			a = smooth(0, 0.08, s) * (1 - smooth(0.9, 1, s)) * (1 - 0.75 * smooth(d0 - 0.02, d0 + 0.02, e) * (1 - smooth(d1 - 0.02, d1 + 0.02, e)));
		}
		if (leg.cord === 'wan') a = smooth(0, 0.12, s);
		return { x, y, a, code: leg.cord === 'isp' || leg.cord === 'wan' ? 0 : after };
	}
	switch (leg.verdict) {
		case 'inspect': {
			// Cruza el firewall de OUT a IN; si la ACL lo va a bloquear, se queda a mitad.
			const stop = bad && f.mode === 'acl' ? 0.5 : 1;
			const [x, y] = lerp(last(cords.wan), first(cords['fw-rt']), ease(s) * stop);
			return { x, y, a: 1, code: 1 };
		}
		case 'deny': {
			const [x, y] = lerp(last(cords.wan), first(cords['fw-rt']), 0.5);
			return { x, y, a: 1 - smooth(0.35, 1, s), code: 2 };
		}
		case 'lookup': {
			const [x, y] = lerp(last(cords['fw-rt']), lookupExit(f, data), ease(s));
			return { x, y, a: 1, code: after };
		}
		case 'null':
			return { x: data.nullSpot[0], y: data.nullSpot[1], a: 1 - smooth(0.2, 1, s), code: 4 };
		case 'switch': {
			const [x, y] = lerp(last(cords.trunk), last(cords[`lan-${leg.port}`]), ease(s));
			return { x, y, a: 1, code: after };
		}
		case 'deliver': {
			const [x, y] = last(cords.srv);
			return { x, y, a: 1 - smooth(0.3, 1, s), code: after };
		}
		case 'exit': {
			const [x, y] = first(cords[`lan-${leg.port}`]);
			return { x, y, a: 1 - smooth(0.15, 1, s), code: after };
		}
	}
}

/** LEDs con tráfico de un paquete en este instante. */
export function activeLeds(flights: Flight[]) {
	const on = new Set<string>();
	for (const { leg, s } of flights) {
		if (leg.kind === 'cord') {
			const c = leg.cord;
			if (c === 'isp' && s < 0.4) on.add('ont-lan');
			else if (c === 'wan' && s > 0.6) on.add('fw-out');
			else if (c === 'fw-rt') on.add(s < 0.4 ? 'fw-in' : s > 0.6 ? 'rt-0' : '');
			else if (c === 'trunk') on.add(s < 0.4 ? 'rt-1' : s > 0.6 ? 'sw-25' : '');
			else if (c === 'srv') on.add(s < 0.3 ? 'rt-2' : s > 0.7 ? 'srv-nic' : '');
			else if (c.startsWith('lan-') && s < 0.45) on.add(`sw-${c.slice(4)}`);
			continue;
		}
		switch (leg.verdict) {
			case 'inspect':
				on.add('fw-out').add('fw-stat');
				if (s > 0.5) on.add('fw-in');
				break;
			case 'deny':
				on.add('fw-alert');
				break;
			case 'lookup':
				on.add('rt-0').add('rt-act');
				break;
			case 'null':
				on.add('rt-act');
				break;
			case 'switch':
				on.add('sw-25').add(`sw-${leg.port}`);
				break;
			case 'deliver':
				on.add('srv-nic').add('srv-d2').add('srv-d5');
				break;
		}
	}
	on.delete('');
	return on;
}

/** Ruido determinista (0–1) para el tráfico de fondo. */
const hash = (a: number, b: number) => {
	const x = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
	return x - Math.floor(x);
};

/**
 * Estado de un LED. `kind`: link (encendido con microcortes por tráfico de fondo), act (apagado con
 * destellos sueltos) o alert (solo con un bloqueo). Con tráfico de un paquete parpadea a 8 Hz.
 */
export function ledOn(key: string, kind: string, active: Set<string>, time: number, index: number, blink = true) {
	// En la pose fija (sin JS o con movimiento reducido) un LED con tráfico se queda encendido.
	if (active.has(key)) return !blink || Math.floor(time * 16) % 2 === 0;
	if (kind === 'alert') return false;
	const n = hash(index + 1, Math.floor(time * 7));
	return kind === 'link' ? n > 0.14 : n > 0.86;
}
