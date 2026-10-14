// Geometría del rack de red. Se ejecuta en build (frontmatter de Figure.astro): devuelve el SVG
// trasero (lo que cubre el brillo WebGL), el delantero (paquetes y piezas que tapan los cordones)
// y los recorridos que usa el script en vivo. Mundo: x a lo ancho del rack, y hacia el espectador,
// z arriba; 1 unidad = 2,5 mm (1U = 17,78).
import * as k from '@/lib/iso/iso-kit';
import type { Flat, Plan, Point3, Projection } from '@/lib/iso/iso-kit';
import { bolt, cisco, router, rust, vlanTag, wall } from './logos';
import { LAN_PORTS, STILL_T, flightsAt, readoutAt } from './model';
import { activeLeds, ledOn, packetPose, type Track, type TrackData } from './track';

export const W = 640;
export const H = 420;

export const RU = 17.78;
const Z0 = 14;
const TOP = Z0 + 11 * RU;
/** Cara frontal de los equipos y plano por el que cuelgan los cordones. */
const FY = 1.6;
const CY = FY + 7.2;
const uz = (u: number) => Z0 + (u - 1) * RU;

const PLATE: Plan = { x: -182, y: -140, w: 336, d: 172, r: 8 };
const PLATE_H = 10;
const FOOT_H = 5;
const ONT: Plan = { x: -172, y: -46, w: 32, d: 30, r: 1.5 };
const ONT_H = 20;
const TRAY = { x0: -136, x1: 136, back: -113, front: -61, z: TOP + 30 };

export const P: Projection = k.fitProjection(
	[
		...k.boxCorners(PLATE, -PLATE_H - FOOT_H, 0),
		...k.boxCorners({ x: TRAY.x0, y: TRAY.back, w: TRAY.x1 - TRAY.x0, d: TRAY.front - TRAY.back, r: 0 }, TRAY.z, TRAY.z + 7),
	],
	W,
	H,
	{ pad: 14, azimuth: 64, elevation: 24 },
);

const KPX = k.cameraOf(P).k;
const at = (point: Point3) => k.iso(point, P);
const S = k.solidSvg;
const L = k.lineSvg;
const D = k.dotsSvg;
const depth = (point: Point3) => k.depthOf(point, P);
const rect = (x: number, y: number, w: number, d: number, r = 0.3): Plan => ({ x, y, w, d, r });
/** Caja alineada con los ejes, de (x0,y0,z0) a (x1,y1,z1). Sin radio, con 4 vértices: pesa menos en el HTML. */
const box = (x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, style: k.SolidStyle = { tone: 'mid' }, bevel = 0, r = 0) =>
	S(
		r > 0
			? k.slabOf(rect(x0, y0, x1 - x0, y1 - y0, r), z0, z1 - z0, P, 2, bevel)
			: k.extrude(
					[
						[x0, y0],
						[x1, y0],
						[x1, y1],
						[x0, y1],
					],
					z0,
					z1 - z0,
					P,
					{ bevel },
				),
		style,
	);
const tint = (color: string, body: string) => `<g class="rd-t" style="--c:var(--rd-${color})">${body}</g>`;

// ——— Dibujo en el plano frontal: coordenadas locales (x, −z) sobre el plano y = cara ———
const n2 = (v: number) => Math.round(v * 100) / 100;
const onFace = (body: string, y = FY) => `<g transform="${k.sideMatrix([0, y], 0, P, 'left')}">${body}</g>`;
const lrect = (x0: number, z0: number, x1: number, z1: number, cls: string, rx = 0.3) =>
	`<rect x="${n2(x0)}" y="${n2(-z1)}" width="${n2(x1 - x0)}" height="${n2(z1 - z0)}" rx="${rx}" class="${cls}"/>`;
const lpath = (points: Flat[], tone = 'lo') => `<path class="iso-line" data-tone="${tone}" d="M${points.map(([x, z]) => `${n2(x)} ${n2(-z)}`).join('L')}"/>`;
const ltext = (x: number, z: number, size: number, text: string, anchor = 'start', tone = 'mid') =>
	`<text class="iso-face-text" data-tone="${tone}" x="${n2(x)}" y="${n2(-z)}" font-size="${size}" text-anchor="${anchor}">${text}</text>`;
const ldot = (x: number, z: number, r: number, cls: string) => `<circle cx="${n2(x)}" cy="${n2(-z)}" r="${r}" class="${cls}"/>`;
/** LED: con `key` lo gobierna el script (`kind`: link | act | alert); sin clave queda encendido fijo. */
const led = (x: number, z: number, color: string, key = '', kind = 'link', r = 0.7) =>
	`<circle class="rd-led" data-c="${color}"${key ? ` data-led="${key}" data-k="${kind}"` : ' data-on=""'} cx="${n2(x)}" cy="${n2(-z)}" r="${r}"/>`;
/** LED de un puerto sin enlace: apagado siempre. */
const ledOff = (x: number, z: number, color: string, r = 0.5) => `<circle class="rd-led" data-c="${color}" cx="${n2(x)}" cy="${n2(-z)}" r="${r}"/>`;
const logo = (x: number, zTop: number, h: number, draw: (box: { x: number; y: number; h: number }) => string) => draw({ x, y: -zTop, h });

/** Tornillo de cabeza cruzada en la oreja del rack. */
const screw = (x: number, z: number) =>
	ldot(x, z, 1.35, 'rd-screw-head') +
	lpath(
		[
			[x - 0.75, z],
			[x + 0.75, z],
		],
		'lo',
	) +
	lpath(
		[
			[x, z - 0.75],
			[x, z + 0.75],
		],
		'lo',
	);

/** Toma RJ45: hueco con la muesca del pestillo y los contactos. `up`: pestillo arriba. */
function jack(x: number, z: number, w = 4.6, h = 4.4, up = true) {
	const notch = up ? lrect(x - w * 0.2, z + h / 2 - 0.2, x + w * 0.2, z + h / 2 + 0.9, 'rd-port', 0.2) : lrect(x - w * 0.2, z - h / 2 - 0.9, x + w * 0.2, z - h / 2 + 0.2, 'rd-port', 0.2);
	const pinZ = up ? z - h / 2 + 0.7 : z + h / 2 - 0.7;
	const pins = Array.from({ length: 4 }, (_, i) => x - w * 0.3 + (i * w * 0.6) / 3)
		.map((px) =>
			lpath(
				[
					[px, pinZ],
					[px, pinZ + (up ? 0.9 : -0.9)],
				],
				'mid',
			),
		)
		.join('');
	return lrect(x - w / 2, z - h / 2, x + w / 2, z + h / 2, 'rd-port') + notch + pins;
}

/** Rejilla de ventilación: ranuras cerradas en filas al tresbolillo. */
function vents(x0: number, x1: number, z0: number, z1: number, rows: number, pitch = 3.2, slot = 2.2) {
	const out: string[] = [];
	const rh = (z1 - z0) / rows;
	for (let r = 0; r < rows; r++) {
		const shift = r % 2 ? pitch / 2 : 0;
		for (let x = x0 + shift; x + slot <= x1; x += pitch) out.push(lrect(x, z0 + r * rh + rh * 0.18, x + slot * 0.42, z0 + (r + 1) * rh - rh * 0.18, 'rd-slot', 0.2));
	}
	return out.join('');
}

// ——— Puertos (x, z) de cada equipo ———
const PATCH_Z = uz(11) + 8.2;
const patchX = (i: number) => -60 + (i - 1) * 5.6 + Math.floor((i - 1) / 6) * 3 + 2.3;
const swCol = (p: number) => Math.floor((p - 1) / 2);
const swX = (p: number) => -50 + swCol(p) * 5.6 + Math.floor(swCol(p) / 6) * 3 + 2.6;
const swZ = (p: number) => uz(9) + (p % 2 ? 11.8 : 6.2);
const SW_UP: Flat = [31, uz(9) + 9];
const RT_Z = uz(8) + 8.4;
const RT_PORTS = [2, 12, 22];
const FW_Z = uz(7) + 8.4;
const FW_OUT = -40;
const FW_IN = -30;
const SRV_NIC: Flat = [52, uz(4) + 10];
/** Cordones patch → switch: los de LAN_PORTS llevan paquetes; el resto, tráfico de fondo. */
const CORDED = [...new Set([2, 3, 7, 9, 16, 18, ...LAN_PORTS])].sort((a, b) => a - b);
const RINGS = [-64, -32, 0, 32, 64];
const RING_Z: [number, number] = [uz(10) + 6, uz(10) + 11.5];

// ——— Base ———
function plate() {
	const out = [`<path class="iso-halo" d="${k.haloOf(PLATE, -PLATE_H - FOOT_H, PLATE_H, P)}"/>`];
	for (const [x, y] of [...k.corners(PLATE, 22)].sort((a, b) => depth([a[0], a[1], 0]) - depth([b[0], b[1], 0]))) {
		out.push(S(k.cylinder(x, y, 7, -PLATE_H - FOOT_H, 1.6, P, 28), { tone: 'lo' }));
		out.push(S(k.cylinder(x, y, 5.4, -PLATE_H - FOOT_H + 1.6, FOOT_H - 1.6, P, 28), { tone: 'mid' }));
	}
	out.push(S(k.slabOf(PLATE, -PLATE_H, PLATE_H, P, 8, 1.6), { tone: 'mid', inner: L(k.sideSeam(PLATE, -4, P, 8), { tone: 'faint' }) }));
	out.push(L(k.planOutline(k.insetPlan(PLATE, 5), 0, P), { tone: 'lo' }));
	const screws = k.corners(PLATE, 10);
	out.push(L(screws.map(([x, y]) => k.ring(x, y, 2.2, 0, P, 16)).join(''), { tone: 'lo' }));
	out.push(D(screws.map(([x, y]) => at([x, y, 0])), { size: 0.5 }));
	// Junta entre baldosas del suelo técnico, de borde a borde.
	out.push(L(k.lineOnTop([PLATE.x + 5, -60], [PLATE.x + PLATE.w - 5, -60], 0, P), { tone: 'faint' }));
	// Regla frontal graduada en U (4,445 = cuarto de U) y placa de características.
	const strip = rect(-110, 22, 220, 5, 1);
	out.push(S(k.slabOf(strip, 0, 0.6, P, 3), { tone: 'lo', crease: 'none' }));
	const ticks = k.topTicks(strip.x + 4, strip.x + strip.w - 4, 4.445, 4, strip.y + 0.8, 0.6, [1.8, 3.4], P);
	out.push(L(ticks.minor, { tone: 'lo' }), L(ticks.major, { tone: 'mid' }));
	out.push(D([at([strip.x + 2, strip.y + 3, 0.6]), at([strip.x + strip.w - 2, strip.y + 3, 0.6])], { size: 0.45 }));
	const label = rect(116, 2, 32, 18, 1.2);
	out.push(S(k.slabOf(label, 0, 0.8, P, 4), { tone: 'mid' }));
	out.push(L(k.planOutline(k.insetPlan(label, 1.6), 0.8, P, 4), { tone: 'faint' }));
	out.push([14, 20, 10].map((w, i) => L(k.lineOnTop([label.x + 5, label.y + 5 + i * 3.4], [label.x + 5 + w, label.y + 5 + i * 3.4], 0.8, P), { tone: 'lo', free: true })).join(''));
	out.push(D([at([label.x + 2.4, label.y + 2.4, 0.8]), at([label.x + label.w - 2.4, label.y + label.d - 2.4, 0.8])], { size: 0.4 }));
	return out.join('');
}

// ——— ONT del ISP: la fibra sube por un pasacables del suelo; el Ethernet sale hacia la bandeja ———
const ONT_RJ: Point3 = [ONT.x + ONT.w - 7, ONT.y + 12, ONT_H + 3.4];
function ont() {
	const out: string[] = [];
	const grommet: Point3 = [ONT.x + 6, ONT.y - 16, 0];
	out.push(S(k.cylinder(grommet[0], grommet[1], 5, 0, 0.8, P, 28), { tone: 'mid' }));
	out.push(L(k.ring(grommet[0], grommet[1], 3.4, 0.8, P, 24), { tone: 'lo' }));
	out.push(`<path class="iso-halo" d="${k.haloOf(ONT, 0, 0.1, P)}" style="filter:blur(3px)"/>`);
	for (const [x, y] of k.corners(ONT, 3)) out.push(S(k.cylinder(x, y, 1.6, 0, 1.4, P, 12), { tone: 'lo' }));
	out.push(S(k.slabOf(ONT, 1.4, ONT_H - 1.4, P, 4, 0.8), { tone: 'mid', inner: L(k.sideSeam(ONT, ONT_H - 4, P, 4), { tone: 'faint' }) }));
	for (let i = 0; i < 5; i++) out.push(L(k.planOutline(rect(ONT.x + 4 + i * 3.4, ONT.y + 4, 1.6, 12, 0.8), ONT_H, P, 3), { tone: 'lo' }));
	const leds = [led(ONT.x + 5, 13, 'green'), led(ONT.x + 10, 13, 'green'), led(ONT.x + 15, 13, 'red', 'ont-los', 'alert'), led(ONT.x + 20, 13, 'green', 'ont-lan', 'act')];
	out.push(
		onFace(
			leds.join('') +
				ltext(ONT.x + 4, 6.2, 3, 'ONT', 'start', 'lo') +
				lpath(
					[
						[ONT.x + 3, 9.4],
						[ONT.x + ONT.w - 3, 9.4],
					],
					'faint',
				),
			ONT.y + ONT.d,
		),
	);
	const sc: Point3 = [ONT.x + 6, ONT.y + 6, ONT_H];
	out.push(cordSvg([grommet, [grommet[0], grommet[1], 6], [sc[0], sc[1] - 6, ONT_H + 10], [sc[0], sc[1], ONT_H + 4]], 'fiber', 1.4));
	out.push(tint('fiber', box(sc[0] - 1.6, sc[0] + 1.6, sc[1] - 1.6, sc[1] + 1.6, ONT_H, ONT_H + 4, { tone: 'mid' })));
	out.push(box(ONT_RJ[0] - 2.2, ONT_RJ[0] + 2.2, ONT_RJ[1] - 2, ONT_RJ[1] + 2, ONT_H, ONT_RJ[2], { tone: 'hi' }));
	return out.join('');
}

// ——— Bastidor ———
const FRONT_POST = { y0: -14, y1: 0 };
const REAR_POST = { y0: -116, y1: -102 };
const postX = (side: -1 | 1): [number, number] => (side > 0 ? [89, 101] : [-101, -89]);

function post(side: -1 | 1, { y0, y1 }: { y0: number; y1: number }, front: boolean) {
	const [x0, x1] = postX(side);
	const plan = rect(x0, y0, x1 - x0, y1 - y0);
	const body = box(x0, x1, y0, y1, Z0, TOP + 6, { tone: 'mid', inner: L([uz(4), uz(8)].map((z) => k.sideSeam(plan, z, P, 2)).join(''), { tone: 'faint' }) });
	if (!front) return body;
	// Franja visible de la cara: numeración de unidades y agujeros cuadrados, como en los postes reales.
	const sx0 = side > 0 ? 96.6 : x0 + 0.2;
	const sx1 = side > 0 ? x1 - 0.2 : -96.6;
	const cx = (sx0 + sx1) / 2;
	const marks: string[] = [];
	for (let u = 1; u <= 11; u++) {
		marks.push(
			lpath(
				[
					[sx0, uz(u)],
					[sx1, uz(u)],
				],
				'lo',
			),
		);
		marks.push(ltext(cx, uz(u) + RU / 2 - 1, 2.6, String(u), 'middle', 'lo'));
		for (const z of [uz(u) + 2.6, uz(u) + RU - 2.6]) marks.push(lrect(cx - 0.9, z - 0.9, cx + 0.9, z + 0.9, 'rd-port', 0.2));
	}
	marks.push(
		lpath(
			[
				[sx0, TOP],
				[sx1, TOP],
			],
			'lo',
		),
	);
	return body + onFace(marks.join(''), 0);
}

function plinth() {
	const out: string[] = [];
	const plan = rect(-121, -120, 242, 136, 1.5);
	out.push(`<path class="iso-halo" d="${k.haloOf(plan, 0, 0.1, P)}" style="filter:blur(5px)"/>`);
	for (const [x, y] of k.corners(plan, 6).sort((a, b) => depth([a[0], a[1], 0]) - depth([b[0], b[1], 0]))) {
		out.push(S(k.cylinder(x, y, 4.4, 0, 1.2, P, 6, 0.3), { tone: 'mid' }));
		out.push(S(k.cylinder(x, y, 1.6, 1.2, 2.8, P, 16), { tone: 'mid', crease: 'none' }));
	}
	out.push(S(k.slabOf(plan, 4, Z0 - 4, P, 3, 0.6), { tone: 'mid', inner: L(k.sideSeam(plan, 8, P, 3), { tone: 'faint' }) }));
	out.push(L(k.planOutline(k.insetPlan(plan, 3), Z0, P, 3), { tone: 'faint' }));
	out.push(D(k.corners(plan, 3).map(([x, y]) => at([x, y, Z0])), { size: 0.45 }));
	return out.join('');
}

/** Organizador vertical de dedos. Separa lo de atrás de los dedos exteriores, que tapan los cordones. */
function duct(side: -1 | 1) {
	const [x0, x1] = side > 0 ? [101, 121] : [-121, -101];
	const back = box(x0, x1, -14, -12, Z0, TOP + 4);
	const spine = (x: number) => box(x - 0.6, x + 0.6, -12, 4, Z0, TOP + 4, { tone: 'mid' }, 0, 0.2);
	const fingers = (x: number) => {
		const out: string[] = [];
		// Un dedo por U, con el hueco a media altura de cada unidad.
		for (let u = 0; u <= 11; u++) out.push(box(x - 0.6, x + 0.6, 4, 16, Math.max(Z0, uz(u) + RU / 2 + 1.5), Math.min(TOP + 4, uz(u + 1) + RU / 2 - 1.5), { tone: 'mid' }, 0.2));
		return out.join('');
	};
	const xIn = side * 101.6;
	const xOut = side * 120.4;
	const cap = box(x0, x1, -14, 16, TOP + 4, TOP + 5.2, { tone: 'mid' }, 0.3);
	if (side < 0) return { back: back + spine(xOut) + fingers(xOut), front: spine(xIn) + fingers(xIn) + cap };
	return { back: back + spine(xIn) + fingers(xIn) + spine(xOut), front: fingers(xOut) + cap };
}

// ——— Equipos ———
interface Device {
	u: number;
	h: number;
	depth: number;
	color?: string;
	face: string;
}

function faceplate({ u, h, color, face }: Device) {
	const zb = uz(u);
	const zt = zb + h * RU;
	const plate = box(-96.5, 96.5, 0, FY, zb + 0.25, zt - 0.25, { tone: 'mid' }, 0.25);
	const ears = [-93.25, 93.25].flatMap((x) => [zb + 2.54, zt - 2.54].map((z) => screw(x, z))).join('');
	const seams = [-88, 88]
		.map((x) =>
			lpath(
				[
					[x, zb + 0.9],
					[x, zt - 0.9],
				],
				'faint',
			),
		)
		.join('');
	return (color ? tint(color, plate) : plate) + onFace(seams + ears + face);
}

function body({ u, h, depth: d }: Device) {
	const zb = uz(u);
	const plan = rect(-88, -d, 176, d, 0.5);
	return S(k.slabOf(plan, zb + 0.5, h * RU - 1, P, 2), { tone: 'mid', inner: h > 1 ? L(k.sideSeam(plan, zb + RU, P, 2), { tone: 'faint' }) : '' });
}

function patchPanel(): Device {
	const zb = uz(11);
	const out: string[] = [logo(-86, zb + 12.6, 7.4, vlanTag), ltext(-86, zb + 2.6, 2.4, 'CAT6', 'start', 'lo')];
	for (let i = 1; i <= 24; i++) {
		out.push(jack(patchX(i), PATCH_Z, 4.4, 4.6, false));
		out.push(ltext(patchX(i), PATCH_Z + 3.6, 1.9, String(i), 'middle', 'lo'));
	}
	// Bandas de color por VLAN bajo los puertos; la del 1 marca el enlace del ISP.
	const band = (from: number, to: number, cls: string) => lrect(patchX(from) - 2.2, zb + 2.2, patchX(to) + 2.2, zb + 3.6, cls, 0.3);
	out.push(band(2, 12, 'rd-band-v10'), band(13, 24, 'rd-band-v20'), band(1, 1, 'rd-band-isp'));
	return { u: 11, h: 1, depth: 28, face: out.join('') };
}

function manager(): Device {
	const zb = uz(10);
	const out: string[] = [];
	for (const x of RINGS) out.push(screw(x - 7.6, zb + RU / 2), lrect(x - 4.2, RING_Z[0] + 0.6, x + 4.2, RING_Z[1] - 0.6, 'rd-port', 0.8));
	for (const z of [zb + 2.2, zb + RU - 2.2])
		out.push(
			lpath(
				[
					[-86, z],
					[86, z],
				],
				'faint',
			),
		);
	return { u: 10, h: 1, depth: 8, face: out.join('') };
}

/** Anillos D del organizador: brazos (atrás de los cordones) y frente (delante). */
function rings() {
	let back = '';
	let front = '';
	// Anillo de varilla: dos brazos que salen de la cara y un travesaño delante, a media altura.
	const z0 = (RING_Z[0] + RING_Z[1]) / 2 - 0.8;
	for (const x of RINGS) {
		for (const side of [-1, 1]) back += box(x + side * 5.2 - 0.7, x + side * 5.2 + 0.7, FY, FY + 10.4, z0, z0 + 1.6, { tone: 'mid' });
		front += box(x - 5.9, x + 5.9, FY + 9.2, FY + 10.6, z0, z0 + 1.6, { tone: 'mid' }) + D([at([x - 5.2, FY + 10.6, z0 + 0.8]), at([x + 5.2, FY + 10.6, z0 + 0.8])], { size: 0.4 });
	}
	return { back, front };
}

function catalyst(): Device {
	const zb = uz(9);
	const out: string[] = [logo(-86, zb + 13.6, 9, cisco), ltext(-86, zb + 2.4, 2.2, 'Catalyst 2960', 'start', 'lo')];
	out.push(led(-62, zb + 13.4, 'green', '', 'link', 0.6), ltext(-60.4, zb + 12.6, 1.7, 'SYST', 'start', 'lo'));
	out.push(led(-62, zb + 9, 'green', 'sw-stat', 'act', 0.6), ltext(-60.4, zb + 8.2, 1.7, 'STAT', 'start', 'lo'));
	out.push(ledOff(-62, zb + 4.6, 'amber', 0.6), ltext(-60.4, zb + 3.8, 1.7, 'SPD', 'start', 'lo'));
	out.push(ldot(-55, zb + 4.6, 1.3, 'rd-button'));
	for (let p = 1; p <= 24; p++) {
		const [x, z] = [swX(p), swZ(p)];
		out.push(jack(x, z, 4.6, 4.2, p % 2 === 1));
		const lz = p % 2 ? z + 3.6 : z - 3.6;
		out.push(CORDED.includes(p) ? led(x, lz, 'green', `sw-${p}`, 'link', 0.55) : ledOff(x, lz, 'green', 0.55));
	}
	// Uplinks SFP: el 25 lleva el troncal 802.1Q al router.
	[SW_UP[0], SW_UP[0] + 10].forEach((x, i) => {
		out.push(lrect(x - 3.8, SW_UP[1] - 2.2, x + 3.8, SW_UP[1] + 2.2, 'rd-port', 0.4), lrect(x - 3, SW_UP[1] - 1.2, x + 3, SW_UP[1] + 1.2, 'rd-slot', 0.2));
		out.push(i === 0 ? led(x, SW_UP[1] + 4.2, 'green', 'sw-25', 'link', 0.55) : ledOff(x, SW_UP[1] + 4.2, 'green', 0.55));
		out.push(ltext(x, SW_UP[1] - 5.4, 1.7, String(25 + i), 'middle', 'lo'));
	});
	out.push(jack(58, zb + 9, 4.6, 4.2), lrect(55.7, zb + 5.8, 60.3, zb + 6.6, 'rd-band-con', 0.2), ltext(58, zb + 2.6, 1.7, 'CON', 'middle', 'lo'));
	out.push(vents(66, 86, zb + 3, zb + RU - 3, 3));
	return { u: 9, h: 1, depth: 82, color: 'cisco', face: out.join('') };
}

function isr(): Device {
	const zb = uz(8);
	const out: string[] = [logo(-86, zb + 13.6, 9, cisco), logo(-63, zb + 13.4, 9, router), ltext(-86, zb + 2.4, 2.2, 'ISR 1100', 'start', 'lo')];
	out.push(led(-50, zb + 12, 'green'), ltext(-48.4, zb + 11.2, 1.7, 'SYS', 'start', 'lo'));
	out.push(led(-50, zb + 8, 'green', 'rt-act', 'act'), ltext(-48.4, zb + 7.2, 1.7, 'ACT', 'start', 'lo'));
	out.push(jack(-34, RT_Z, 4.6, 4.2), lrect(-36.3, RT_Z - 3.2, -31.7, RT_Z - 2.4, 'rd-band-con', 0.2), ltext(-34, RT_Z + 4.4, 1.7, 'CON', 'middle', 'lo'));
	out.push(lrect(-26, RT_Z - 1, -21, RT_Z + 1, 'rd-port', 0.3), ltext(-23.5, RT_Z + 4.4, 1.7, 'USB', 'middle', 'lo'));
	RT_PORTS.forEach((x, i) => {
		out.push(jack(x, RT_Z, 4.6, 4.2), ltext(x, RT_Z + 4.4, 1.7, `0/${i}`, 'middle', 'lo'), led(x + 3.4, RT_Z + 2.6, 'green', `rt-${i}`, 'link', 0.5));
	});
	out.push(vents(40, 86, zb + 3, zb + RU - 3, 3));
	return { u: 8, h: 1, depth: 92, color: 'cisco', face: out.join('') };
}

function firewall(): Device {
	const zb = uz(7);
	const out: string[] = [logo(-86, zb + 13.4, 9, wall), ltext(-71.4, zb + 9.6, 3.4, 'ACL', 'start', 'mid'), ltext(-86, zb + 2.4, 2.2, 'OUTSIDE_IN', 'start', 'lo')];
	out.push(led(-58, zb + 11.6, 'green'), ltext(-58, zb + 7.4, 1.6, 'PWR', 'middle', 'lo'));
	out.push(led(-52, zb + 11.6, 'amber', 'fw-stat', 'act'), ltext(-52, zb + 7.4, 1.6, 'STAT', 'middle', 'lo'));
	out.push(led(-46, zb + 11.6, 'red', 'fw-alert', 'alert'), ltext(-46, zb + 7.4, 1.6, 'ALRT', 'middle', 'lo'));
	const ports: [number, string, string][] = [
		[FW_OUT, 'OUT', 'fw-out'],
		[FW_IN, 'IN', 'fw-in'],
		[-18, 'MGMT', ''],
	];
	for (const [x, name, key] of ports) {
		out.push(jack(x, FW_Z, 4.6, 4.2), ltext(x, FW_Z + 4.4, 1.7, name, 'middle', 'lo'));
		out.push(key ? led(x + 3.4, FW_Z + 2.6, 'green', key, 'link', 0.5) : ledOff(x + 3.4, FW_Z + 2.6, 'green'));
	}
	out.push(vents(30, 86, zb + 3, zb + RU - 3, 3));
	return { u: 7, h: 1, depth: 88, color: 'fw', face: out.join('') };
}

function blank(): Device {
	const zb = uz(6);
	return { u: 6, h: 1, depth: 3, face: vents(-82, 82, zb + 3.2, zb + RU - 3.2, 4, 4, 2.4) };
}

function server(): Device {
	const zb = uz(4);
	const zt = zb + 2 * RU;
	const out: string[] = [];
	// Ocho bahías de 2,5": bandeja, tirador, rejilla y LEDs de actividad y estado.
	for (let i = 0; i < 8; i++) {
		const x0 = -86 + i * 6.6;
		out.push(lrect(x0, zb + 2.4, x0 + 6, zt - 2.4, 'rd-bay', 0.4));
		out.push(
			lpath(
				[
					[x0 + 1.2, zb + 6],
					[x0 + 4.8, zb + 6],
				],
				'mid',
			),
		);
		out.push(vents(x0 + 1, x0 + 5.2, zb + 9, zb + 22, 4, 1.4, 1.1));
		out.push(led(x0 + 1.8, zt - 5, 'green', `srv-d${i}`, 'act', 0.5), led(x0 + 4.2, zt - 5, 'blue', '', 'link', 0.5));
	}
	out.push(logo(-28, zt - 4, 12, rust), ltext(-22, zb + 12.6, 2.6, 'NetCli', 'middle', 'mid'), ltext(-22, zb + 8.8, 2.1, 'BuilderNet', 'middle', 'lo'));
	out.push(ldot(-6, zb + 26, 2, 'rd-button'), led(-6, zb + 20, 'green'), led(-6, zb + 16.6, 'amber', 'srv-hd', 'act'));
	out.push(vents(4, 86, zb + 20, zt - 3, 4));
	out.push(lrect(30, SRV_NIC[1] - 1.1, 36, SRV_NIC[1] + 1.1, 'rd-port', 0.3), ltext(33, SRV_NIC[1] + 4.4, 1.7, 'USB', 'middle', 'lo'));
	[SRV_NIC[0], SRV_NIC[0] + 8].forEach((x, i) => {
		out.push(jack(x, SRV_NIC[1], 4.6, 4.2), ltext(x, SRV_NIC[1] + 4.4, 1.7, `NIC${i + 1}`, 'middle', 'lo'));
		out.push(i === 0 ? led(x + 3.4, SRV_NIC[1] + 2.6, 'green', 'srv-nic', 'link', 0.5) : ledOff(x + 3.4, SRV_NIC[1] + 2.6, 'green'));
	});
	out.push(ltext(4, zb + 2.4, 1.9, '10.10.30.10', 'start', 'lo'));
	return { u: 4, h: 2, depth: 98, color: 'rust', face: out.join('') };
}

function pdu(): Device {
	const zb = uz(3);
	const out: string[] = [lrect(-86, zb + 4, -78, zb + RU - 4, 'rd-port', 0.6), lrect(-83.4, zb + 7, -80.6, zb + RU - 7, 'rd-bay', 0.4)];
	out.push(lrect(-74, zb + 5.4, -58, zb + RU - 5.4, 'rd-lcd', 0.5), `<text class="rd-lcd-text" x="-66" y="${n2(-(zb + 7.3))}" font-size="4.2" text-anchor="middle">3.2A</text>`);
	for (let i = 0; i < 8; i++) {
		const x = -46 + i * 16;
		out.push(lrect(x - 5, zb + 4.2, x + 5, zb + RU - 4.2, 'rd-port', 1.2));
		out.push(lrect(x - 3, zb + 9.6, x - 2, zb + 12, 'rd-slot', 0.2), lrect(x + 2, zb + 9.6, x + 3, zb + 12, 'rd-slot', 0.2), lrect(x - 0.5, zb + 5.8, x + 0.5, zb + 8.2, 'rd-slot', 0.2));
	}
	out.push(led(84, zb + 9, 'green'));
	return { u: 3, h: 1, depth: 44, face: out.join('') };
}

function ups(): Device {
	const zb = uz(1);
	const zt = zb + 2 * RU;
	const out: string[] = [logo(-84, zt - 7, 13, bolt), ltext(-74, zb + 23, 3, 'SAI 1500', 'start', 'mid'), vents(-86, -38, zb + 3, zb + 15, 4)];
	out.push(lrect(-30, zb + 14, 14, zb + 29, 'rd-lcd', 0.8));
	out.push(`<text class="rd-lcd-text" x="-26.6" y="${n2(-(zb + 22.4))}" font-size="4.4">230V</text>`, `<text class="rd-lcd-text" x="10.6" y="${n2(-(zb + 22.4))}" font-size="4.4" text-anchor="end">64%</text>`);
	for (let i = 0; i < 5; i++) out.push(lrect(-26.6 + i * 7.6, zb + 16.4, -21.4 + i * 7.6, zb + 18.6, i < 3 ? 'rd-lcd-bar' : 'rd-slot', 0.2));
	for (const x of [22, 29, 36]) out.push(ldot(x, zb + 21.5, 2, 'rd-button'));
	out.push(led(46, zb + 25, 'green'), led(46, zb + 18, 'amber', 'ups-bat', 'act'), vents(56, 86, zb + 3, zt - 3, 8));
	return { u: 1, h: 2, depth: 96, face: out.join('') };
}

// ——— Bandeja portacables (escalerilla) sobre el rack, sujeta a los postes traseros ———
function tray(onTray: string, drop: string) {
	const out: string[] = [];
	for (const x of [-95, 95]) out.push(box(x - 2, x + 2, TRAY.back + 1, TRAY.back + 5, TOP + 6, TRAY.z, { tone: 'mid' }, 0.3));
	const rail = (y0: number) =>
		box(TRAY.x0, TRAY.x1, y0, y0 + 4, TRAY.z, TRAY.z + 6, { tone: 'mid', inner: L(k.sideSeam(rect(TRAY.x0, y0, TRAY.x1 - TRAY.x0, 4), TRAY.z + 3, P, 2), { tone: 'faint' }) }, 0.3);
	out.push(rail(TRAY.back));
	for (let x = TRAY.x0 + 8; x < TRAY.x1 - 4; x += 22.6) out.push(box(x - 1.6, x + 1.6, TRAY.back + 4, TRAY.front - 4, TRAY.z + 1, TRAY.z + 3, { tone: 'mid' }, 0, 0.4));
	out.push(onTray, rail(TRAY.front - 4));
	for (const x of [TRAY.x0, TRAY.x1 - 2]) out.push(box(x, x + 2, TRAY.back, TRAY.front, TRAY.z - 0.5, TRAY.z + 6.5, { tone: 'mid' }, 0.3));
	out.push(D([-95, 95].map((x) => at([x, TRAY.back + 3, TRAY.z + 6])), { size: 0.45 }));
	out.push(drop);
	return out.join('');
}

// ——— Cordones ———
/** Redondea las esquinas de una polilínea 3D con cuadráticas (radio r) y la muestrea. */
function fillet(points: Point3[], r = 3.2): Point3[] {
	const out: Point3[] = [points[0]];
	for (let i = 1; i < points.length - 1; i++) {
		const [a, b, c] = [points[i - 1], points[i], points[i + 1]];
		const da = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]) || 1;
		const dc = Math.hypot(c[0] - b[0], c[1] - b[1], c[2] - b[2]) || 1;
		const rr = Math.min(r, da / 2, dc / 2);
		const p0 = b.map((v, j) => v + ((a[j] - v) * rr) / da) as Point3;
		const p1 = b.map((v, j) => v + ((c[j] - v) * rr) / dc) as Point3;
		for (let s = 0; s <= 5; s++) {
			const t = s / 5;
			out.push(p0.map((v, j) => (1 - t) * (1 - t) * v + 2 * (1 - t) * t * b[j] + t * t * p1[j]) as Point3);
		}
	}
	out.push(points[points.length - 1]);
	return out;
}

function cordSvg(points: Point3[], color: string, thick = 2.2) {
	const d = k.pathOf(fillet(points).map(at));
	const w = thick * KPX;
	return (
		`<g class="rd-cord" style="--c:var(--rd-${color})">` +
		`<path class="rd-cord-edge" style="stroke-width:${n2(w + 1.1)}" d="${d}"/>` +
		`<path class="rd-cord-body" style="stroke-width:${n2(w)}" d="${d}"/>` +
		`<path class="rd-cord-shine" style="stroke-width:${n2(w * 0.28)}" d="${d}"/></g>`
	);
}

function trackOf(points: Point3[]): Track {
	const flat = fillet(points).map(at);
	const pts: number[] = [];
	const len: number[] = [];
	let total = 0;
	flat.forEach(([x, y], i) => {
		if (i) total += Math.hypot(x - flat[i - 1][0], y - flat[i - 1][1]);
		pts.push(n2(x), n2(y));
		len.push(n2(total));
	});
	return { pts, len };
}

/** Clavija RJ45 con su capuchón del color del cordón, enchufada en la cara (x, z). */
const plug = (x: number, z: number, color: string) =>
	box(x - 2.2, x + 2.2, FY, FY + 3.6, z - 2, z + 2, { tone: 'hi' }, 0.2) + tint(color, box(x - 1.6, x + 1.6, FY + 3.6, FY + 6.4, z - 1.6, z + 1.6, { tone: 'mid' }, 0.3, 0.6));

/** Salida de un cordón desde su clavija, hacia abajo (−1) o hacia arriba (+1). */
const leave = (x: number, z: number, dir: -1 | 1): Point3[] => [
	[x, FY + 6.4, z],
	[x, CY, z + dir * 3.4],
];
const arrive = (x: number, z: number, dir: -1 | 1): Point3[] => leave(x, z, dir).reverse();

/** Hueco entre dedos de los organizadores verticales a la altura de la unidad u. */
const gap = (u: number) => uz(u) + RU / 2;

interface Cord {
	id: string;
	color: string;
	points: Point3[];
	ends: [number, number, string][];
}

function cords(): Cord[] {
	const list: Cord[] = [];
	const p1 = patchX(1);
	const [inL, outL] = [gap(10), gap(6)];
	list.push({
		id: 'wan',
		color: 'wan',
		points: [...leave(p1, PATCH_Z, -1), [p1, CY, uz(10) + 15], [-96, CY, inL], [-111, 0, inL], [-111, 0, outL], [-96, CY, outL], [FW_OUT, CY, outL], ...arrive(FW_OUT, FW_Z, -1)],
		ends: [
			[p1, PATCH_Z, 'wan'],
			[FW_OUT, FW_Z, 'wan'],
		],
	});
	list.push({
		id: 'fw-rt',
		color: 'sec',
		points: [...leave(FW_IN, FW_Z, -1), [FW_IN, CY, uz(7) - 2.6], [RT_PORTS[0], CY, uz(7) - 2.6], ...arrive(RT_PORTS[0], RT_Z, -1)],
		ends: [
			[FW_IN, FW_Z, 'sec'],
			[RT_PORTS[0], RT_Z, 'sec'],
		],
	});
	list.push({
		id: 'trunk',
		color: 'trunk',
		points: [...leave(RT_PORTS[1], RT_Z, 1), [RT_PORTS[1], CY, uz(9) - 1.4], [SW_UP[0], CY, uz(9) - 1.4], ...arrive(SW_UP[0], SW_UP[1], -1)],
		ends: [
			[RT_PORTS[1], RT_Z, 'trunk'],
			[SW_UP[0], SW_UP[1], 'trunk'],
		],
	});
	const [inR, outR] = [gap(8), gap(4)];
	list.push({
		id: 'srv',
		color: 'srv',
		points: [
			...leave(RT_PORTS[2], RT_Z, -1),
			[RT_PORTS[2], CY, uz(8) + 2.4],
			[90, CY, uz(8) + 2.4],
			[111, 0, inR],
			[111, 0, outR],
			[96, CY, uz(4) + 4.4],
			[SRV_NIC[0], CY, uz(4) + 4.4],
			...arrive(SRV_NIC[0], SRV_NIC[1], -1),
		],
		ends: [
			[RT_PORTS[2], RT_Z, 'srv'],
			[SRV_NIC[0], SRV_NIC[1], 'srv'],
		],
	});
	// Patch → switch, cada uno por el anillo D más cercano (varios por anillo, abiertos en abanico).
	const perRing = new Map<number, number>();
	for (const p of CORDED) {
		const [xp, xs, zs] = [patchX(p), swX(p), swZ(p)];
		const mid = (xp + xs) / 2;
		const ring = RINGS.reduce((best, x) => (Math.abs(x - mid) < Math.abs(best - mid) ? x : best));
		const slot = perRing.get(ring) ?? 0;
		perRing.set(ring, slot + 1);
		const xr = ring - 2.4 + (slot % 3) * 2.4;
		const color = p > 12 ? 'v20' : 'v10';
		list.push({
			id: `lan-${p}`,
			color,
			points: [...leave(xp, PATCH_Z, -1), [xp, CY, RING_Z[1] + 4], [xr, CY, RING_Z[1]], [xr, CY, RING_Z[0]], [xs, CY, zs + 6], ...arrive(xs, zs, 1)],
			ends: [
				[xp, PATCH_Z, color],
				[xs, zs, color],
			],
		});
	}
	return list;
}

/** Cable del ISP: ONT → sube → bandeja → cae por detrás del rack hasta la barra de amarre del patch panel. */
const LACING: Point3 = [-62, -40, TOP + 2];
const TRAY_MID = (TRAY.back + TRAY.front) / 2;
/** Sube por dentro del organizador izquierdo (entra por delante, entre los dedos) y pasa a la bandeja. */
const ISP_RISE: Point3[] = [
	ONT_RJ,
	[ONT_RJ[0], ONT_RJ[1], ONT_RJ[2] + 5],
	[-126, 20, 30],
	[-111, 6, 31],
	[-111, -8, 36],
	[-111, -8, TOP + 8],
	[-111, -40, TRAY.z + 9],
	[-111, TRAY_MID, TRAY.z + 4.2],
];
const ISP_TRAY: Point3[] = [ISP_RISE[ISP_RISE.length - 1], [-62, TRAY_MID, TRAY.z + 4.2]];
const ISP_DROP: Point3[] = [ISP_TRAY[1], [-62, TRAY.front + 4, TRAY.z + 9], [-62, -48, TOP + 10], LACING];

const ISP_ALL = [...ISP_RISE, ...ISP_TRAY.slice(1), ...ISP_DROP.slice(1)];

/** Fracción del recorrido del ISP que va dentro del organizador izquierdo (de la entrada a la salida por arriba). */
function ispDuct(): [number, number] {
	const { pts, len } = trackOf(ISP_ALL);
	const total = len[len.length - 1];
	const near = (point: Point3) => {
		const [x, y] = at(point);
		let best = 0;
		for (let i = 1; i < len.length; i++) if (Math.hypot(pts[i * 2] - x, pts[i * 2 + 1] - y) < Math.hypot(pts[best * 2] - x, pts[best * 2 + 1] - y)) best = i;
		return n2(len[best] / total);
	};
	return [near(ISP_RISE[3]), near(ISP_RISE[5])];
}

function lacingBar() {
	return (
		box(-80, 80, -42, -38, TOP, TOP + 2, { tone: 'mid' }, 0.2, 0.6) +
		[-78, 78].map((x) => box(x - 1, x + 1, -38, -28, TOP, TOP + 1.4)).join('') +
		D([at([LACING[0] - 1.6, LACING[1], LACING[2] + 0.4]), at([LACING[0] + 1.6, LACING[1], LACING[2] + 0.4])], { size: 0.5 })
	);
}

export interface LiveData extends TrackData {
	W: number;
	H: number;
	P: Projection;
	/** Radio del paquete en el visor (para el brillo WebGL). */
	pk: number;
}

export interface Built {
	back: string;
	front: string;
	label: string;
	readout: string;
	data: LiveData;
}

export function build(): Built {
	const devices = [ups(), pdu(), server(), blank(), firewall(), isr(), catalyst(), manager(), patchPanel()];
	const left = duct(-1);
	const right = duct(1);
	const ring = rings();
	const cordList = cords();

	const data: LiveData = {
		W,
		H,
		P,
		pk: n2(KPX * 1.05),
		cords: Object.fromEntries([['isp', trackOf(ISP_ALL)], ...cordList.map((cord) => [cord.id, trackOf(cord.points)])]),
		nullSpot: at([-58.5, FY + 2, uz(8) + 9]),
		ispDuct: ispDuct(),
	};

	const plugs = cordList
		.flatMap((cord) => cord.ends)
		.sort((a, b) => depth([a[0], FY, a[1]]) - depth([b[0], FY, b[1]]))
		.map(([x, z, color]) => plug(x, z, color))
		.join('');

	const back = [
		plate(),
		ont(),
		plinth(),
		post(-1, REAR_POST, false),
		post(1, REAR_POST, false),
		box(-89, 89, REAR_POST.y0, REAR_POST.y1, TOP + 1, TOP + 6, { tone: 'mid' }, 0.3),
		left.back,
		cordSvg(ISP_RISE, 'isp', 2.6),
		D([60, 100, 140, 180].map((z) => at([-111, -8 + 1.6, z])), { size: 0.55 }),
		left.front,
		post(-1, FRONT_POST, true),
		box(-101, -89, REAR_POST.y1, FRONT_POST.y0, TOP, TOP + 6, { tone: 'mid' }, 0.3),
		...devices.map(body),
		lacingBar(),
		post(1, FRONT_POST, true),
		box(89, 101, REAR_POST.y1, FRONT_POST.y0, TOP, TOP + 6, { tone: 'mid' }, 0.3),
		box(-89, 89, -14, -8, TOP + 2, TOP + 6, { tone: 'mid' }, 0.3),
		...devices.map(faceplate),
		ring.back,
		right.back,
		tray(cordSvg(ISP_TRAY, 'isp', 2.6), cordSvg(ISP_DROP, 'isp', 2.6)),
		plugs,
		...cordList.map((cord) => cordSvg(cord.points, cord.color)),
	].join('');

	// Pose inicial (sin JS o con movimiento reducido): la misma que calcula el script en STILL_T.
	const flights = flightsAt(STILL_T, () => 'acl');
	// Mismo hueco que usa el script (n mod 6), para que al montar no cambie nada.
	const packets = Array.from({ length: 6 }, (_, i) => {
		const flight = flights.find((f) => ((f.n % 6) + 6) % 6 === i);
		const pose = flight ? packetPose(flight, data) : null;
		const attrs = pose ? ` transform="translate(${n2(pose.x)} ${n2(pose.y)})" style="opacity:${n2(pose.a)}" data-code="${pose.code}"` : ' style="opacity:0"';
		return `<g class="rd-pk" data-pk="${i}"${attrs}><circle r="${n2(KPX * 1.9)}" class="rd-pk-halo"/><circle r="${data.pk}" class="rd-pk-core"/></g>`;
	}).join('');
	const front = `<g data-part="packets">${packets}</g>` + right.front + ring.front;

	// LEDs en su estado de STILL_T, con el mismo índice que usa el script (orden en el documento).
	const active = activeLeds(flights);
	let index = 0;
	const lit = (svg: string) => svg.replace(/data-led="([^"]+)" data-k="([^"]+)"/g, (match, key: string, kind: string) => `${match}${ledOn(key, kind, active, STILL_T, index++, false) ? ' data-on=""' : ''}`);

	return {
		back: lit(back),
		front: lit(front),
		readout: readoutAt(flights),
		label:
			'Rack de red de 19 pulgadas y 11 unidades. Un cable del proveedor sube desde la ONT a la bandeja y baja al patch panel; ' +
			'de ahí un cordón lleva cada paquete al firewall, que aplica la ACL OUTSIDE_IN y bloquea en rojo lo que no está permitido, como telnet o SMB desde Internet. ' +
			'Lo permitido pasa al router Cisco, que elige el siguiente salto por el prefijo más largo: el servidor por Gi0/2, la LAN por el troncal al switch Cisco, ' +
			'que lo saca por el puerto de su VLAN de vuelta al patch panel, o Null0 si no hay una red concreta. Debajo, el servidor con las herramientas en Rust, la PDU y el SAI.',
		data,
	};
}
