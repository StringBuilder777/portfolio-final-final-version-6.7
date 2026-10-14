// Geometría de la imprenta de islas. Se ejecuta en build (frontmatter de Figure.astro):
// devuelve el SVG trasero (lo que el brillo WebGL cubre), el delantero (lo que tapa el brillo)
// y los datos que necesita el script en vivo. Mundo: x a lo largo de la línea, y hacia el
// espectador, z arriba; 1 unidad ≈ 1 px del objeto.
import * as k from '@/lib/iso/iso-kit';
import type { Flat, Plan, Plane, Point3, Projection } from '@/lib/iso/iso-kit';
import { DISC, streaks } from './disc';
import { LOGO_DEFS, logoSvg } from './logos';
import { AT, BLOCKS, HEAD_TRAVEL, LOGOS, PLATEN_TRAVEL, SHEET, STILL_T, poseAt } from './model';

export const W = 640;
export const H = 420;

const BASE: Plan = { x: -186, y: -76, w: 372, d: 136, r: 8 };
const BASE_H = 12;
const FOOT_H = 5;

const SHUTTLE: Plan = { x: -25, y: -22, w: 50, d: 44, r: 2.5 };
const SHUTTLE_Z = 3;
const SHUTTLE_TOP = 7;
const SHEET_Z = 7.6;
const SHEET_PLAN: Plan = { x: -SHEET.w / 2, y: -SHEET.d / 2, w: SHEET.w, d: SHEET.d, r: 0.6 };

const RAIL_X = 112;
const COLUMN_Y = 31;
const PRESS_COLUMNS: Plane[] = [-20, 20].flatMap((dx) => [-COLUMN_Y, COLUMN_Y].map((y): Plane => [AT.press + dx, y]));
const CROWN: Plan = { x: AT.press - 28, y: -38, w: 56, d: 76, r: 3 };
const CROWN_Z = 84;
const CROWN_TOP = 94;
const PLATEN: Plan = { x: AT.press - 22, y: -19, w: 44, d: 38, r: 1.5 };
const PLATEN_Z = SHEET_Z + PLATEN_TRAVEL;
const CAN: Plane = [AT.press + 20, 22];

const POST_TOP = 60;
// Pórtico en voladizo desde el poste trasero: nada tapa la hoja mientras se hidrata.
const BEAM: Plan = { x: AT.hydrate - 6, y: -37, w: 12, d: 47, r: 2 };
const HEAD = { r: 10, z: 34, h: 10 };

const BOX: Plan = { x: 54, y: -72, w: 40, d: 22, r: 2 };
const BOX_H = 16;
const CASE: Plan = { x: -152, y: -72, w: 92, d: 28, r: 1.5 };

export const P: Projection = k.fitProjection(
	[
		...k.boxCorners(BASE, -BASE_H - FOOT_H, 0),
		...k.boxCorners(CROWN, CROWN_Z, CROWN_TOP + 3),
		[DISC.x - DISC.r, DISC.y, DISC.z + DISC.h],
		[DISC.x + DISC.r, DISC.y, DISC.z + DISC.h],
		[CAN[0], CAN[1], CROWN_TOP + 9],
	],
	W,
	H,
	{ pad: 16, azimuth: 58 },
);

const at = (point: Point3) => k.iso(point, P);
const S = k.solidSvg;
const L = k.lineSvg;
const D = k.dotsSvg;
const depth = ([x, y]: Plane) => k.depthOf([x, y, 0], P);
const byDepth = <T extends { at: Plane }>(list: T[]) => [...list].sort((a, b) => depth(a.at) - depth(b.at));
const rect = (x: number, y: number, w: number, d: number, r = 0.4): Plan => ({ x, y, w, d, r });

/** Grupo teñido con un color de marca (Astro, TypeScript, CSS, React): reescala los tonos del kit. */
const tint = (brand: 'astro' | 'ts' | 'css' | 'react', body: string) => `<g class="fe-t" data-brand="${brand}">${body}</g>`;

function base() {
	const out = [`<path class="iso-halo" d="${k.haloOf(BASE, -BASE_H - FOOT_H, BASE_H, P)}"/>`];
	for (const [x, y] of [...k.corners(BASE, 24)].sort((a, b) => depth(a) - depth(b))) {
		out.push(S(k.cylinder(x, y, 7, -BASE_H - FOOT_H, 1.6, P, 28), { tone: 'lo' }));
		out.push(S(k.cylinder(x, y, 5.4, -BASE_H - FOOT_H + 1.6, FOOT_H - 1.6, P, 28), { tone: 'mid' }));
	}
	out.push(S(k.slabOf(BASE, -BASE_H, BASE_H, P, 8, 1.6), { tone: 'mid', inner: L(k.sideSeam(BASE, -4, P, 8), { tone: 'faint' }) }));
	out.push(L(k.planOutline(k.insetPlan(BASE, 5), 0, P), { tone: 'lo' }));
	const screws = k.corners(BASE, 10);
	out.push(L(screws.map(([x, y]) => k.ring(x, y, 2.2, 0, P, 16)).join(''), { tone: 'lo' }));
	out.push(D(screws.map(([x, y]) => at([x, y, 0])), { size: 0.5 }));

	// Regla en el borde delantero y placa de características.
	const strip = rect(-150, 51, 300, 6, 1);
	out.push(S(k.slabOf(strip, 0, 0.6, P, 3), { tone: 'lo', crease: 'none' }));
	const ticks = k.topTicks(strip.x + 4, strip.x + strip.w - 4, 4, 5, strip.y + 0.8, 0.6, [1.8, 3.4], P);
	out.push(L(ticks.minor, { tone: 'lo' }), L(ticks.major, { tone: 'mid' }));
	out.push(D([at([strip.x + 2, strip.y + 3, 0.6]), at([strip.x + strip.w - 2, strip.y + 3, 0.6])], { size: 0.45 }));

	const label = rect(-178, 30, 34, 16, 1.2);
	out.push(S(k.slabOf(label, 0, 0.8, P, 4), { tone: 'mid' }));
	out.push(L(k.planOutline(k.insetPlan(label, 1.6), 0.8, P, 4), { tone: 'faint' }));
	out.push(
		[14, 20, 10].map((w, i) => L(k.lineOnTop([label.x + 5, label.y + 5 + i * 3], [label.x + 5 + w, label.y + 5 + i * 3], 0.8, P), { tone: 'lo', free: true })).join(''),
	);
	out.push(D([at([label.x + 2.4, label.y + 2.4, 0.8]), at([label.x + label.w - 2.4, label.y + label.d - 2.4, 0.8])], { size: 0.4 }));
	return out.join('');
}

/** Caja de tipos (TypeScript): bandeja con compartimentos y tipos móviles azules. */
function typeCase() {
	const out: string[] = [];
	const { x, y, w, d } = CASE;
	const wall = 1.5;
	const floorTop = 2;
	const top = 7;
	out.push(`<path class="iso-halo" d="${k.haloOf(CASE, 0, 0.1, P)}" style="filter:blur(3px)"/>`);
	out.push(S(k.slabOf(CASE, 0, floorTop, P, 3, 0.4), { tone: 'mid' }));
	out.push(S(k.slabOf(rect(x, y, w, wall, 0.5), floorTop, top - floorTop, P, 2), { tone: 'mid' }));
	out.push(S(k.slabOf(rect(x, y + wall, wall, d - wall * 2, 0.5), floorTop, top - floorTop, P, 2), { tone: 'mid' }));

	const columns = 6;
	const cell = (w - wall * 2) / columns;
	const midY = y + d / 2;
	const rows = [
		{ y0: y + wall, y1: midY - 0.5 },
		{ y0: midY + 0.5, y1: y + d - wall },
	];
	// Cuántos tipos hay en cada compartimento (fila, columna): fijo para que el dibujo sea estable.
	const fill = [
		[3, 2, 0, 3, 1, 2],
		[2, 3, 1, 0, 3, 2],
	];
	const sortPlan = (cx: number, cy: number) => rect(cx - 1.6, cy - 1.6, 3.2, 3.2, 0.3);
	const drawRow = (row: number) => {
		const { y0, y1 } = rows[row];
		for (let c = 0; c < columns; c++) {
			const x0 = x + wall + c * cell;
			if (c > 0) out.push(S(k.slabOf(rect(x0 - 0.5, y0, 1, y1 - y0, 0.2), floorTop, top - 1 - floorTop, P, 2), { tone: 'mid' }));
			const sorts = Array.from({ length: fill[row][c] }, (_, i) => {
				const cx = x0 + 3.4 + ((i * 4.1 + c * 1.3) % (cell - 6.8));
				const cy = y0 + 3 + ((i * 3.7 + row * 2.2) % (y1 - y0 - 6));
				return { at: [cx, cy] as Plane };
			});
			const body = byDepth(sorts)
				.map(({ at: [cx, cy] }) => {
					const plan = sortPlan(cx, cy);
					const h = 3.4 + ((cx * 7 + cy * 3) % 1) * 0.6;
					return (
						S(k.slabOf(plan, floorTop, h, P, 2, 0.3), { tone: 'hi', inner: L(k.sideSeam(plan, floorTop + h * 0.45, P, 2), { tone: 'lo' }) }) +
						L(k.planOutline(k.insetPlan(plan, 0.8), floorTop + h, P, 2), { tone: 'mid' })
					);
				})
				.join('');
			if (body) out.push(tint('ts', body));
		}
	};
	drawRow(0);
	out.push(S(k.slabOf(rect(x + wall, midY - 0.5, w - wall * 2, 1, 0.2), floorTop, top - 1 - floorTop, P, 2), { tone: 'mid' }));
	drawRow(1);
	out.push(S(k.slabOf(rect(x + w - wall, y + wall, wall, d - wall * 2, 0.5), floorTop, top - floorTop, P, 2), { tone: 'mid' }));
	out.push(S(k.slabOf(rect(x, y + d - wall, w, wall, 0.5), floorTop, top - floorTop, P, 2), { tone: 'mid' }));
	out.push(D([at([x + 4, y + d - wall / 2, top]), at([x + w - 4, y + d - wall / 2, top])], { size: 0.4 }));
	return out.join('');
}

/** Caja del bundle de cliente (React): de aquí sale el cable al cabezal de hidratación. */
function bundleBox() {
	const out: string[] = [];
	out.push(`<path class="iso-halo" d="${k.haloOf(BOX, 0, 0.1, P)}" style="filter:blur(3px)"/>`);
	out.push(S(k.slabOf(BOX, 0, 3, P, 4, 0.4), { tone: 'mid' }));
	out.push(S(k.slabOf(k.insetPlan(BOX, 1), 3, BOX_H - 3, P, 4, 0.6), { tone: 'mid', inner: L(k.sideSeam(k.insetPlan(BOX, 1), BOX_H - 3, P, 4), { tone: 'faint' }) }));
	for (let i = 0; i < 5; i++) out.push(L(k.planOutline(rect(BOX.x + 5 + i * 4, BOX.y + 5, 1.8, 11, 0.9), BOX_H, P, 3), { tone: 'lo' }));
	out.push(S(k.cylinder(BOX.x + 32, BOX.y + 8, 1.6, BOX_H, 0.8, P, 16), { tone: 'mid' }));
	out.push(`<g class="fe-led" data-part="bundle-led">${D([at([BOX.x + 32, BOX.y + 8, BOX_H + 0.8])], { size: 1.1, tone: 'hi' })}</g>`);
	out.push(D(k.corners(k.insetPlan(BOX, 1), 2.4).map(([x, y]) => at([x, y, BOX_H])), { size: 0.4 }));
	// Cable: sube de la caja y llega a la cara trasera de la viga del cabezal.
	const from: Point3 = [BOX.x + 32, BOX.y + 15, BOX_H];
	const to: Point3 = [AT.hydrate, BEAM.y, POST_TOP + 3];
	out.push(k.wireSvg(at(from), at(to), { via: [at([from[0], from[1], POST_TOP + 3]), at([AT.hydrate + 8, BEAM.y - 2, POST_TOP + 3])], tone: 'mid', size: 1 }));
	return out.join('');
}

const column = ([x, y]: Plane, r: number, top: number) =>
	S(k.cylinder(x, y, r + 2.2, 0, 3, P, 28, 0.4), { tone: 'mid' }) +
	S(k.cylinder(x, y, r, 3, top - 3, P, 28), { tone: 'mid', crease: 'none', inner: L([top * 0.35, top * 0.7].map((z) => k.sideArc(x, y, r, z, P, 16)).join(''), { tone: 'faint' }) });

function rails() {
	const out: string[] = [];
	for (const y of [-14, 14]) {
		out.push(S(k.slabOf(rect(-RAIL_X, y - 2.5, RAIL_X * 2, 5, 1), 0, SHUTTLE_Z, P, 3, 0.4), { tone: 'mid' }));
		out.push(D([-RAIL_X + 6, -40, 40, RAIL_X - 6].map((x) => at([x, y, SHUTTLE_Z])), { size: 0.4 }));
	}
	for (const x of [-RAIL_X - 5, RAIL_X + 1]) {
		out.push(S(k.slabOf(rect(x, -20, 4, 40, 1), 0, 6, P, 3, 0.5), { tone: 'mid' }));
		out.push(D([at([x + 2, -16, 6]), at([x + 2, 16, 6])], { size: 0.45 }));
	}
	return out.join('');
}

/** Bandeja con pila de hojas. `top`: altura de la hoja superior. */
function tray(cx: number, top: number, printedTop: boolean) {
	const out: string[] = [];
	const plan = rect(cx - 27, -23, 54, 46, 2);
	out.push(`<path class="iso-halo" d="${k.haloOf(plan, 0, 0.1, P)}" style="filter:blur(3px)"/>`);
	out.push(S(k.slabOf(plan, 0, 2.6, P, 4, 0.5), { tone: 'mid' }));
	for (const x of [plan.x + 2.2, plan.x + plan.w - 2.2]) out.push(S(k.cylinder(x, plan.y + 2.2, 1.3, 2.6, 10, P, 16), { tone: 'mid' }));
	const stack = { ...SHEET_PLAN, x: cx - SHEET.w / 2 };
	const seams: string[] = [];
	for (let z = 2.6 + 0.8; z < top - 0.4; z += 0.8) seams.push(k.sideSeam(stack, z, P, 3));
	out.push(S(k.slabOf(stack, 2.6, top - 2.6, P, 3), { tone: 'lo', inner: L(seams.join(''), { tone: 'faint' }) }));
	if (printedTop) out.push(printed(cx, top, false, 'tray'));
	return out.join('');
}

/**
 * Lo que la prensa estampa: el logo de la tecnología de turno (isla) junto a HTML estático en tinta neutra.
 * Se dibujan los cuatro logos y el CSS muestra el que toca (`data-sheet` / `data-tray` en la figura).
 */
function printed(cx: number, z: number, live: boolean, set: 'sheet' | 'tray') {
	const out: string[] = [];
	const top = (plan: Plan) => k.planOutline({ ...plan, x: plan.x + cx }, z, P, 3);
	const line = (x0: number, y: number, x1: number) => L(k.lineOnTop([cx + x0, y], [cx + x1, y], z, P), { tone: 'mid', free: true });
	BLOCKS.forEach((block, index) => {
		const at = live ? ` data-i="${index}"` : '';
		if (block.name === 'logo') {
			const tile = { x: block.x, y: block.y, s: block.w };
			const all = (look: 'mono' | 'color') => LOGOS.map((logo) => `<g data-logo="${logo.id}">${logoSvg(logo.id, tile, look)}</g>`).join('');
			out.push(`<g class="fe-logos" data-set="${set}" transform="${k.topMatrix([cx, 0], z, P, 'x')}"><g>${all('mono')}</g><g class="fe-lit"${at}>${all('color')}</g></g>`);
			return;
		}
		const plan = rect(block.x, block.y, block.w, block.d, block.name === 'boton' ? 2.1 : 0.5);
		// Relleno cian de hidratación: en modo islas solo en las islas; en SPA, en todos los bloques.
		const glow = `<path class="fe-island${live || block.island ? '' : ' fe-spa-only'}"${at} d="${top(plan)}"/>`;
		if (block.name === 'boton') {
			out.push(glow, L(top(plan), { tone: 'mid' }), line(block.x + 2.6, block.y + block.d / 2, block.x + block.w - 2.6));
			return;
		}
		if (block.name === 'texto') {
			out.push(glow);
			for (let r = 0; r < 4; r++) out.push(line(block.x, block.y + 0.8 + r * 1.8, block.x + block.w - (r === 3 ? 4 : 0)));
			return;
		}
		out.push(`<path class="fe-ink${block.css ? ' fe-ink-css' : ''}" d="${top(plan)}"/>`, glow);
	});
	return out.join('');
}

function shuttle() {
	const out: string[] = [];
	out.push(`<path class="iso-halo" d="${k.haloOf(k.insetPlan(SHUTTLE, 3), SHUTTLE_Z, 0.1, P)}" style="filter:blur(4px)"/>`);
	out.push(S(k.slabOf(SHUTTLE, SHUTTLE_Z, SHUTTLE_TOP - SHUTTLE_Z, P, 4, 0.6), { tone: 'mid', inner: L(k.sideSeam(SHUTTLE, SHUTTLE_Z + 1.6, P, 4), { tone: 'faint' }) }));
	out.push(L(k.planOutline(k.insetPlan(SHUTTLE, 1.6), SHUTTLE_TOP, P, 4), { tone: 'faint' }));
	out.push(D([-20, -7, 7, 20].map((x) => at([x, SHUTTLE.y + SHUTTLE.d - 0.9, SHUTTLE_TOP])), { size: 0.4, tone: 'lo' }));
	for (const x of [-10, 10]) out.push(S(k.cylinder(x, -19.8, 0.9, SHUTTLE_TOP, 2, P, 12), { tone: 'mid' }));
	const neck = rect(-1.4, SHUTTLE.y + SHUTTLE.d - 0.5, 2.8, 2.6, 0.6);
	out.push(S(k.slabOf(neck, SHUTTLE_Z + 0.8, 2.4, P, 2), { tone: 'mid', crease: 'none' }));
	out.push(S(k.cylinder(0, SHUTTLE.y + SHUTTLE.d + 4.4, 2.6, SHUTTLE_Z, 4.6, P, 20), { tone: 'mid' }));
	out.push(L(k.knurl(0, SHUTTLE.y + SHUTTLE.d + 4.4, 2.6, SHUTTLE_Z, SHUTTLE_Z + 4.6, 18, P), { tone: 'lo' }));
	return out.join('');
}

function sheet() {
	return S(k.slabOf(SHEET_PLAN, SHUTTLE_TOP, SHEET_Z - SHUTTLE_TOP, P, 2), { tone: 'hi', lit: true });
}

/** Platina de la prensa (Astro) con su vástago: se mueve en z como una sola pieza. */
function platen() {
	const rod = S(k.cylinder(AT.press, 0, 2.4, PLATEN_Z + 9, 42, P, 20), { tone: 'mid', crease: 'none' });
	const plate = S(k.slabOf(PLATEN, PLATEN_Z, 6, P, 3, 0.6), { tone: 'hi', inner: L(k.sideSeam(PLATEN, PLATEN_Z + 2.2, P, 3), { tone: 'mid' }) });
	const boss = S(k.cylinder(AT.press, 0, 7, PLATEN_Z + 6, 3, P, 32, 0.4), { tone: 'mid' });
	const bolts = D([0, 1, 2, 3].map((i) => at([AT.press + Math.cos(i * Math.PI / 2 + 0.6) * 5, Math.sin(i * Math.PI / 2 + 0.6) * 5, PLATEN_Z + 9])), { size: 0.45 });
	return rod + tint('astro', plate) + boss + bolts;
}

function pressTop() {
	const out: string[] = [];
	out.push(S(k.cylinder(AT.press, 0, 6.4, CROWN_Z - 31, 3, P, 28, 0.4), { tone: 'mid' }));
	out.push(L(k.ring(AT.press, 0, 2.9, CROWN_Z - 31, P, 20), { tone: 'lo' }));
	out.push(S(k.cylinder(AT.press, 0, 5, CROWN_Z - 28, 28, P, 28), { tone: 'mid', inner: L(k.sideArc(AT.press, 0, 5, CROWN_Z - 14, P, 16), { tone: 'faint' }) }));
	for (const point of PRESS_COLUMNS.filter(([, y]) => y > 0).sort((a, b) => depth(a) - depth(b))) out.push(column(point, 3.4, CROWN_Z));
	out.push(
		tint(
			'astro',
			S(k.slabOf(CROWN, CROWN_Z, CROWN_TOP - CROWN_Z, P, 4, 1), { tone: 'hi', inner: L(k.sideSeam(CROWN, CROWN_Z + 3.4, P, 4), { tone: 'mid' }) }) +
				L(k.planOutline(k.insetPlan(CROWN, 4), CROWN_TOP, P, 4), { tone: 'mid' }),
		),
	);
	const onCrown: { at: Plane; svg: string }[] = PRESS_COLUMNS.map(([x, y]) => ({
		at: [x, y],
		svg: S(k.cylinder(x, y, 4.4, CROWN_TOP, 2.6, P, 6, 0.3), { tone: 'mid' }) + D([at([x, y, CROWN_TOP + 2.6])], { size: 0.5 }),
	}));
	onCrown.push({
		at: [DISC.x, DISC.y],
		svg:
			S(k.cylinder(DISC.x, DISC.y, 2.6, CROWN_TOP, DISC.z - CROWN_TOP, P, 16), { tone: 'mid' }) +
			tint(
				'css',
				S(k.cylinder(DISC.x, DISC.y, DISC.r, DISC.z, DISC.h, P, 72, 0.8), { tone: 'hi', inner: L(k.sideArc(DISC.x, DISC.y, DISC.r, DISC.z + 1, P, 48), { tone: 'mid' }) }) +
					L(k.ring(DISC.x, DISC.y, DISC.r - 2, DISC.z + DISC.h, P, 72), { tone: 'mid' }) +
					`<path class="iso-line fe-streaks" data-tone="hi" data-part="streaks" data-free="" d="${streaks(0, P)}"/>`,
			) +
			L(k.ring(DISC.x, DISC.y, 2, DISC.z + DISC.h, P, 16), { tone: 'mid' }),
	});
	onCrown.push({
		at: CAN,
		svg:
			S(k.cylinder(CAN[0], CAN[1], 4.2, CROWN_TOP, 6.4, P, 28), { tone: 'mid', inner: L(k.sideArc(CAN[0], CAN[1], 4.2, CROWN_TOP + 2, P, 16), { tone: 'faint' }) }) +
			tint(
				'css',
				S(k.cylinder(CAN[0], CAN[1], 4.6, CROWN_TOP + 6.4, 2, P, 28, 0.4), { tone: 'hi' }) + L(k.knurl(CAN[0], CAN[1], 4.6, CROWN_TOP + 6.4, CROWN_TOP + 8.4, 30, P), { tone: 'mid' }),
			),
	});
	out.push(...byDepth(onCrown).map((item) => item.svg));
	return out.join('');
}

/** Cabezal de hidratación (React): carcasa con el átomo grabado y anillo de LEDs. */
function head() {
	const { r, z, h } = HEAD;
	const [x, y] = [AT.hydrate, 0];
	const rod = S(k.cylinder(x, y, 1.6, z + h, 14, P, 16), { tone: 'mid', crease: 'none' });
	const housing = S(k.cylinder(x, y, r, z, h, P, 56, 0.6), { tone: 'hi', inner: L(k.sideArc(x, y, r, z + 3, P, 40), { tone: 'mid' }) });
	const atom = [0, 60, 120]
		.map((deg) => {
			const f = (deg * Math.PI) / 180;
			const points: Plane[] = Array.from({ length: 40 }, (_, i) => {
				const t = (i / 40) * Math.PI * 2;
				const [ex, ey] = [6.6 * Math.cos(t), 2.5 * Math.sin(t)];
				return [x + ex * Math.cos(f) - ey * Math.sin(f), y + ex * Math.sin(f) + ey * Math.cos(f)];
			});
			return k.onTop(points, z + h, P, true);
		})
		.join('');
	const face = ((P.azimuth ?? 45) * Math.PI) / 180;
	const leds = Array.from({ length: 7 }, (_, i) => {
		const a = face + ((i - 3) * Math.PI) / 9;
		return at([x + Math.cos(a) * r, y + Math.sin(a) * r, z + 1.5]);
	});
	return (
		rod +
		tint('react', housing + L(atom, { tone: 'mid' }) + D([at([x, y, z + h])], { size: 0.8, tone: 'hi' })) +
		`<g class="fe-led" data-part="leds">${D(leds, { size: 0.75, tone: 'hi' })}</g>`
	);
}

function hydrationFrame() {
	const out: string[] = [];
	out.push(S(k.slabOf(rect(AT.hydrate - 4, -5, 8, 10, 1), POST_TOP - 10, 10, P, 3, 0.4), { tone: 'mid' }));
	out.push(S(k.slabOf(BEAM, POST_TOP - 2, 8, P, 3, 0.5), { tone: 'mid', inner: L(k.sideSeam(BEAM, POST_TOP + 2, P, 3), { tone: 'faint' }) }));
	out.push(S(k.cylinder(AT.hydrate, -COLUMN_Y, 3.6, POST_TOP + 6, 2, P, 6, 0.3), { tone: 'mid' }));
	out.push(D([-16, 3].map((y) => at([AT.hydrate, y, POST_TOP + 6])), { size: 0.45 }));
	return out.join('');
}

export interface LiveData {
	P: Projection;
	W: number;
	H: number;
	/** Vectores de pantalla de una unidad de mundo en x y en z. */
	ex: Flat;
	ez: Flat;
	sheetZ: number;
	platenTravel: number;
	headTravel: number;
}

export interface Built {
	back: string;
	front: string;
	label: string;
	data: LiveData;
}

export function build(): Built {
	const pose = poseAt(STILL_T, 'islas');
	const move = (dx: number, dz: number) => k.translateAlong(P, [dx, 0, dz]);
	const backColumns = [...PRESS_COLUMNS.filter(([, y]) => y < 0), [AT.hydrate, -COLUMN_Y] as Plane]
		.sort((a, b) => depth(a) - depth(b))
		.map((point) => (point[0] === AT.hydrate ? column(point, 4, POST_TOP - 2) : column(point, 3.4, CROWN_Z)));

	const print = printed(0, SHEET_Z, true, 'sheet').replace(/data-i="(\d+)"/g, (match, i: string) => `${match} style="opacity:${pose.levels[Number(i)].toFixed(3)}"`);
	const sheetGroup = `<g data-part="sheet" transform="${move(pose.sheet, 0)}" style="opacity:${pose.sheetAlpha}">${sheet()}<g data-part="print" style="opacity:${pose.printed}">${print}</g></g>`;

	const back = [
		LOGO_DEFS,
		base(),
		typeCase(),
		bundleBox(),
		...backColumns,
		tray(AT.feed, SHEET_Z, false),
		rails(),
		`<g data-part="shuttle" transform="${move(pose.shuttle, 0)}">${shuttle()}</g>`,
		tray(AT.tray, SHUTTLE_TOP, true),
		sheetGroup,
	].join('');

	const front = [
		`<g data-part="platen" transform="${move(0, -pose.platen * PLATEN_TRAVEL)}">${platen()}</g>`,
		pressTop(),
		`<g data-part="head" transform="${move(0, -pose.head * HEAD_TRAVEL)}">${head()}</g>`,
		hydrationFrame(),
	].join('');

	return {
		back,
		front,
		label:
			'Imprenta de islas sobre un banco. Cada hoja sale con el logo de una tecnología, por turnos: TypeScript, Astro, JavaScript y React. ' +
			'La prensa naranja de Astro la estampa en gris como HTML estático, con tipos azules de TypeScript y tinta púrpura de CSS; ' +
			'después la estación cian de React baja y enciende solo las piezas interactivas, el logo y un botón, que toman sus colores, mientras el resto de la página sigue sin JavaScript.',
		data: { P, W, H, ex: k.axisVector(P, [1, 0, 0]), ez: k.axisVector(P, [0, 0, 1]), sheetZ: SHEET_Z, platenTravel: PLATEN_TRAVEL, headTravel: HEAD_TRAVEL },
	};
}
