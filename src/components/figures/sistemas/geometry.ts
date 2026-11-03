import * as k from '@/lib/iso/iso-kit';
import type { Flat, Plan, Plane, Point3, Tone } from '@/lib/iso/iso-kit';
import { BELT_Z, DROP_X, FEED_X, STILL_T, TOY_Y, stateAt, type Mascot } from './model';
import order from './order.json';

export const W = 640, H = 420;
const BASE: Plan = { x: -177, y: -88, w: 359, d: 180, r: 8 };
const CABINET: Plan = { x: -148, y: -62, w: 138, d: 118, r: 3 };
const BELT: Plan = { x: -48, y: -4, w: 217, d: 37, r: 1 };
export const P = k.fitProjection([
 ...k.boxCorners(BASE, -17, 0),
 ...k.boxCorners({ x: -152, y: -66, w: 146, d: 126, r: 3 }, 0, 187),
 ...k.boxCorners({ x: -133, y: -13, w: 56, d: 54, r: 1 }, 182, 245),
], W, H, { pad: 16, azimuth: 53, elevation: 28 });
const at = (point: Point3) => k.iso(point, P);
const L = k.lineSvg, S = k.solidSvg;
const rect = (x: number, y: number, w: number, d: number, r = 0.5): Plan => ({ x, y, w, d, r });
type Layer = 'back' | 'front' | 'press' | 'materials';
export type Shape =
 | { kind: 'slab'; plan: Plan; z: number; h: number }
 | { kind: 'cylinder'; x: number; y: number; r: number; z: number; h: number }
 | { kind: 'prism'; ring: Plane[]; x: number; y: number; z: number; depth: number };
export interface Part { name: string; owner: string; at: Point3; shape: Shape; svg: string; layer: Layer }
const face = (x: number, y: number, z: number, svg: string) => `<g transform="${k.sideMatrix([x, y], z, P, 'left')}">${svg}</g>`;
const screws = (plan: Plan, z: number, inset = 3) => L(k.corners(plan, inset).map(([x, y]) => k.ring(x, y, 0.9, z, P, 12)).join(''), { tone: 'lo' }) + k.dotsSvg(k.corners(plan, inset).map(([x, y]) => at([x, y, z])), { size: 0.35 });

/** Muestras de curvas cúbicas: el relleno y la forma física usan exactamente el mismo contorno. */
function contour(start: Plane, curves: [Plane, Plane, Plane][]): Plane[] {
 const points: Plane[] = [start];
 let from = start;
 for (const [a, b, end] of curves) {
  for (let i = 1; i <= 9; i++) {
   const t = i / 9, u = 1 - t;
   points.push([u ** 3 * from[0] + 3 * u * u * t * a[0] + 3 * u * t * t * b[0] + t ** 3 * end[0], u ** 3 * from[1] + 3 * u * u * t * a[1] + 3 * u * t * t * b[1] + t ** 3 * end[1]]);
  }
  from = end;
 }
 return points;
}
const TUX = contour([0, 42], [
 [[-9, 42], [-10, 36], [-10, 30]], [[-11, 24], [-18, 19], [-16, 10]],
 [[-18, 11], [-19, 7], [-21, 5]], [[-23, 1], [-18, 0], [-11, 0]],
 [[-7, 0], [-5, 1], [0, 1]], [[5, 1], [7, 0], [11, 0]],
 [[18, 0], [23, 1], [21, 5]], [[19, 7], [18, 11], [16, 10]],
 [[18, 19], [11, 24], [10, 30]], [[10, 36], [9, 42], [0, 42]],
]);
const APPLE = contour([0, 34], [
 [[3, 42], [9, 43], [10, 43]], [[10, 38], [5, 35], [1, 35]],
 [[7, 37], [14, 35], [15, 30]], [[8, 27], [9, 21], [15, 20]],
 [[14, 14], [10, 3], [6, 2]], [[3, 1], [2, 3], [0, 3]],
 [[-2, 3], [-3, 1], [-6, 2]], [[-14, 4], [-18, 19], [-16, 27]],
 [[-15, 34], [-7, 39], [0, 34]],
]);

/** Peluche acolchado en relieve: volumen extruido y cara cosida en el plano frontal. */
export function plush(kind: Mascot, x = 0, y = 0, z = 0, scale = 1): { svg: string; shape: Shape } {
 const ring: Plane[] = (kind === 'linux' ? TUX : APPLE).map(([u, v]) => [u * scale, v * scale]);
 const half = 5 * scale;
 const front = ring.map(([u, v]) => at([x + u, y + half, z + v]));
 const back = ring.map(([u, v]) => at([x + u, y - half, z + v]));
 const sides = ring.map((_, i) => {
  const j = (i + 1) % ring.length;
  const dx = ring[j][0] - ring[i][0], dz = ring[j][1] - ring[i][1];
  return { depth: k.depthOf([x + (ring[i][0] + ring[j][0]) / 2, y, z + (ring[i][1] + ring[j][1]) / 2], P), svg: `<path class="sy-plush-side" data-kind="${kind}" d="${k.pathOf([back[i], back[j], front[j], front[i]], true)}" style="--edge-light:${0.16 + 0.18 * Math.abs(dx) / (Math.hypot(dx, dz) || 1)}"/>` };
 }).sort((a, b) => a.depth - b.depth).map(side => side.svg).join('');
 const tux = '<path class="sy-belly" d="M-6-29Q-10-26-12-17Q-15-5-3-4Q11-3 12-13Q11-24 6-29Z"/><ellipse class="sy-face-white" cx="-4" cy="-33" rx="3.1" ry="5"/><ellipse class="sy-face-white" cx="4" cy="-33" rx="3.1" ry="5"/><ellipse class="sy-eye" cx="-3.3" cy="-32.3" rx="1.5" ry="2.7"/><ellipse class="sy-eye" cx="3.3" cy="-32.3" rx="1.5" ry="2.7"/><circle class="sy-eye-glint" cx="-3.7" cy="-33.2" r="0.6"/><circle class="sy-eye-glint" cx="2.8" cy="-33.2" r="0.6"/><path class="sy-orange" d="M-8-29Q0-35 8-29Q8-25 1-23Q-5-23-8-29Z"/><path class="sy-smile" d="M-6.8-27.8Q-1-24.2 6.5-28"/><path class="sy-orange" d="M-14-11Q-17-12-18-8L-21-5Q-24-1-16 0L-8-.5Q-5-1-7-5Z"/><path class="sy-orange" d="M14-11Q17-12 18-8L21-5Q24-1 16 0L8-.5Q5-1 7-5Z"/><path class="sy-toy-shine" d="M-5-40Q1-42 5-39L2-37ZM-14-21Q-17-16-14-13L-12-16ZM12-22Q15-20 15-18L13-18Z"/><path class="sy-stitch" d="M0-8Q-1-15 0-20"/>';
 const apple = '<path class="sy-apple-shine" d="M-10-28Q-14-21-9-12Q-11-22-6-30Z"/><path class="sy-stitch" d="M-5-32Q-12-21-5-8M3-36l4-4"/><path class="sy-apple-leaf" d="M1-36Q4-42 9-42Q8-38 1-36Z"/>';
 const art = `<g transform="${k.sideMatrix([x, y + half], z, P, 'left')}"><g transform="scale(${scale})"><path class="sy-plush-face" data-kind="${kind}" d="${k.pathOf((kind === 'linux' ? TUX : APPLE).map(([u, v]): Flat => [u, -v]), true)}"/>${kind === 'linux' ? tux : apple}</g></g>`;
 return { svg: `<g class="sy-plush" data-mascot="${kind}"><path class="sy-plush-back" data-kind="${kind}" d="${k.pathOf(back, true)}"/>${sides}${art}</g>`, shape: { kind: 'prism', ring, x, y, z, depth: half * 2 } };
}

export function scene() {
 const parts: Part[] = [];
 function put(name: string, owner: string, shape: Shape, svg: string, center: Point3, layer: Layer = 'back') { parts.push({ name, owner, shape, svg, at: center, layer }); }
 function slab(name: string, owner: string, plan: Plan, z: number, h: number, tone: Tone = 'mid', detail = '', layer: Layer = 'back', accent = false) {
  const svg = S(k.slabOf(plan, z, h, P, 5, Math.min(0.8, h / 4)), { tone, inner: detail });
  put(name, owner, { kind: 'slab', plan, z, h }, accent ? `<g class="sy-accent">${svg}</g>` : svg, [plan.x + plan.w / 2, plan.y + plan.d / 2, z + h / 2], layer);
 }
 function cylinder(name: string, owner: string, x: number, y: number, r: number, z: number, h: number, tone: Tone = 'mid', layer: Layer = 'back', detail = '') {
  put(name, owner, { kind: 'cylinder', x, y, r, z, h }, S(k.cylinder(x, y, r, z, h, P, 40, 0.25), { tone, inner: detail }), [x, y, z + h / 2], layer);
 }
 for (const [i, [x, y]] of k.corners(BASE, 20).entries()) cylinder(`stand.foot-${i}`, 'stand', x, y, 6, -17, 5, 'lo');
 slab('stand.deck', 'stand', BASE, -12, 12, 'mid', screws(BASE, 0, 9) + L(k.planOutline(k.insetPlan(BASE, 4), 0, P), { tone: 'lo' }));
 slab('cabinet.plinth', 'cabinet', CABINET, 0, 12, 'hi', screws(CABINET, 12, 6));
 slab('cabinet.back', 'cabinet', rect(-144, -62, 130, 4), 12, 163, 'mid');
 slab('cabinet.left', 'cabinet', rect(-148, -58, 4, 110), 12, 163, 'mid');
 for (const x of [-148, -14]) for (const y of [-62, 52]) {
  const layer = y > 0 ? 'front' : 'back';
  slab(`cabinet.post-${x}-${y}`, 'cabinet', rect(x, y, 4, 4), 12, 163, 'hi', '', layer);
 }
 slab('cabinet.front-skirt', 'cabinet', rect(-144, 52, 130, 4), 12, 28, 'mid', face(-139, 56.1, 30, '<rect class="sy-inset" width="24" height="9" rx="1"/><path class="sy-display-line" d="M4 3h13M4 6h8"/>'), 'front');
 slab('cabinet.right-skirt', 'cabinet', rect(-14, -58, 4, 110), 12, 16, 'mid');
 slab('cabinet.right-header', 'cabinet', rect(-14, -58, 4, 110), 151, 24, 'mid');
 slab('cabinet.stock-floor', 'cabinet', rect(-144, -58, 90, 110), 40, 3, 'mid', screws(rect(-144, -58, 90, 110), 43, 4));
 slab('cabinet.exit-back', 'cabinet', rect(-54, -58, 40, 50), 40, 3, 'mid');
 slab('cabinet.exit-front', 'cabinet', rect(-54, 37, 40, 15), 40, 3, 'mid');
 // Techo abierto: la boca de alimentación atraviesa el hueco real entre estas cuatro placas.
 const roofs = [rect(-152, -66, 26, 126, 1), rect(-84, -66, 78, 126, 1), rect(-126, -66, 42, 59, 1), rect(-126, 35, 42, 25, 1)];
 roofs.forEach((plan, i) => slab(`cabinet.roof-${i}`, 'cabinet', plan, 175, 7, 'hi', screws(plan, 182, 4), 'back', true));
 slab('cabinet.marquee', 'cabinet', rect(-146, 60, 134, 4, 1), 164, 16, 'hi', face(-139, 64.1, 168, '<rect class="sy-marquee-screen" y="-9" width="120" height="12" rx="1.2"/><text class="sy-marquee-text" x="60" y="-1" text-anchor="middle" font-size="6" letter-spacing="2">LINUX FAB</text>'), 'front', true);
 const hopper = [rect(-128, -9, 2, 46), rect(-84, -9, 2, 46), rect(-126, -9, 42, 2), rect(-126, 35, 42, 2)];
 hopper.forEach((plan, i) => slab(`feed.throat-${i}`, 'cabinet', plan, 182, 32, 'mid', '', i === 3 ? 'front' : 'back'));
 const rim = [rect(-134, -15, 8, 58), rect(-84, -15, 8, 58), rect(-126, -15, 42, 8), rect(-126, 35, 42, 8)];
 rim.forEach((plan, i) => slab(`feed.rim-${i}`, 'cabinet', plan, 214, 3, 'hi', '', i === 3 ? 'front' : 'back', true));
 // Aletas de inspección y soldaduras del conducto.
 slab('feed.neck-band', 'cabinet', rect(-128, 37, 46, 1), 187, 3, 'mid', '', 'front');
 for (const x of [-127, -86]) slab(`heater.leg-${x}`, 'cabinet', rect(x, -9, 4, 46), 43, 62, 'mid');
 const burner = rect(-127, -9, 45, 46, 1.5);
 slab('heater.floor', 'cabinet', burner, 105, 5, 'hi', screws(burner, 110, 4));
 for (let i = 0; i < 5; i++) slab(`heater.burner-${i}`, 'cabinet', rect(-119 + i * 7, -3, 3, 32), 110, 1.5, 'mid');
 slab('heater.window-sill', 'cabinet', rect(-127, 36, 45, 3), 110, 4, 'hi', '', 'front');
 slab('heater.window-head', 'cabinet', rect(-127, 36, 45, 3), 150, 4, 'hi', '', 'front');
 for (const x of [-127, -85]) slab(`heater.window-post-${x}`, 'cabinet', rect(x, 36, 3, 3), 114, 36, 'hi', '', 'front');
 // Cuatro columnas sostienen la prensa de confección, con una salida libre sobre la banda.
 for (const x of [-56, -14]) for (const y of [-8, 33]) {
  if (x === -14) slab(`press.seat-${x}-${y}`, 'cabinet', rect(x, y, 4, 4), 40, 3, 'mid');
  slab(`press.post-${x}-${y}`, 'cabinet', rect(x, y, 4, 4), 43, 87, 'hi');
 }
 slab('press.crosshead', 'cabinet', rect(-56, -8, 46, 45, 1), 130, 5, 'hi', screws(rect(-56, -8, 46, 45), 135, 4), 'back', true);
 cylinder('press.gland', 'cabinet', DROP_X, TOY_Y, 4, 115, 15, 'hi');
 slab('press.platen', 'press', rect(-51, -1, 34, 31, 1.3), 0, 5, 'hi', screws(rect(-51, -1, 34, 31), 5, 3), 'press', true);
 const control = face(-129, 56.2, 27, '<rect class="sy-inset" width="72" height="10" rx="1"/><path class="sy-display-line" d="M7 3h18M7 7h10"/><circle class="sy-status-led" cx="48" cy="5" r="1.1"/><circle class="sy-status-led" cx="56" cy="5" r="1.1"/><circle class="sy-status-led" cx="64" cy="5" r="1.1"/>');
 slab('console.status', 'cabinet', rect(-133, 56, 80, 1.2, 0.8), 14, 18, 'mid', control, 'front');

 for (const x of [17, 146]) for (const y of [-8, 33]) {
  slab(`belt.leg-${x}-${y}`, 'belt', rect(x, y, 5, 4), 2, 26, 'mid');
  slab(`belt.pad-${x}-${y}`, 'belt', rect(x - 2, y - 1, 9, 6), 0, 2, 'lo');
 }
 for (const [i, y] of [-8, 33].entries()) slab(`belt.beam-${i}`, 'belt', rect(-54, y, 229, 4, 0.7), 28, 12, 'mid', L(k.sideSeam(rect(-54, y, 229, 4, 0.7), 33, P, 5), { tone: 'faint' }), i === 1 ? 'front' : 'back');
 for (const [i, x] of [17, 146].entries()) slab(`belt.cross-${i}`, 'belt', rect(x, -4, 5, 37), 25, 3, 'mid');
 // Los rodillos y sus cojinetes están cerrados por discos en los dos extremos.
 for (const [i, x] of [-48, 169].entries()) {
  const r = 6, z = 34;
  const ring: Plane[] = k.circleRing(x, z, r, 36);
  const shape: Shape = { kind: 'prism', ring, x: 0, y: 14.5, z: 0, depth: 37 };
  const a = ring.map(([u, v]) => at([u, -4, v])), b = ring.map(([u, v]) => at([u, 33, v]));
  const sleeve = k.pathOf([...a.slice(0, 19), ...b.slice(0, 19).reverse()], true);
  const svg = `<path class="sy-roller-fill" d="${sleeve}"/><path class="sy-roller-cap" d="${k.pathOf(b, true)}"/>`;
  put(`belt.roller-${i}`, 'belt', shape, svg, [x, 14.5, z]);
  for (const y of [-8, 33]) slab(`belt.bearing-${i}-${y}`, 'belt', rect(x - 7, y, 14, 4, 1), 28, 12, 'mid', L(k.sideRing([x, y + 4, z], 3, 'y', P, 24), { tone: 'lo' }), y > 0 ? 'front' : 'back');
 }
 slab('belt.bed', 'belt', BELT, 40, 1.5, 'lo', L(k.planOutline(k.insetPlan(BELT, 1.5), BELT_Z, P), { tone: 'faint' }));
 slab('belt.motor-mount', 'belt', rect(137, 37, 31, 8, 1), 21, 4, 'mid', '', 'front');
 slab('belt.motor', 'belt', rect(140, 37, 25, 8, 1), 25, 14, 'mid', face(144, 45.1, 36, '<circle class="sy-motor-rim" cx="8" cy="5" r="4"/><circle class="sy-motor-rim" cx="8" cy="5" r="1.8"/>'), 'front');

 // Elementos de entrada: tela oscura, relleno blanco y piezas amarillas de pico/patas.
 slab('material.felt', 'material', rect(-11, -6, 11, 10, 1.3), 0, 3, 'mid', '', 'materials');
 cylinder('material.filling', 'material', 5, -2, 5, 3, 5, 'hi', 'materials');
 slab('material.yellow', 'material', rect(-4, 6, 12, 5, 1.5), 5, 3, 'hi', '', 'materials');
 const ranks = new Map<string, number>(order.map((name, i) => [name, i]));
 parts.sort((a, b) => (ranks.get(a.name) ?? k.depthOf(a.at, P)) - (ranks.get(b.name) ?? k.depthOf(b.at, P)));
 return { parts };
}

export function build() {
 const { parts } = scene();
 const state = stateAt(STILL_T);
 const defs = `<defs><radialGradient id="sy-tux" cx="32%" cy="17%" r="85%"><stop stop-color="#42484f"/><stop offset=".4" stop-color="#14171c"/><stop offset="1" stop-color="#020406"/></radialGradient><radialGradient id="sy-apple" cx="30%" cy="25%" r="85%"><stop stop-color="#fff"/><stop offset=".58" stop-color="#dce2e8"/><stop offset="1" stop-color="#8b98a9"/></radialGradient><linearGradient id="sy-flame" x2="0" y2="1"><stop stop-color="#ffdb66"/><stop offset=".45" stop-color="#ffa83a"/><stop offset="1" stop-color="#d85c27"/></linearGradient><filter id="sy-heat-glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.2"/></filter><clipPath id="sy-belt-clip"><path d="${k.planOutline(BELT, BELT_Z + 0.02, P)}"/></clipPath></defs>`;
 const layer = (name: Layer) => parts.filter(part => part.layer === name).map(part => `<g data-part="${part.name}">${part.svg}</g>`).join('');
 const product = `<g data-sy-product transform="${k.translateAlong(P, [DROP_X, TOY_Y, BELT_Z])}" opacity="${state.productOpacity}">${plush('linux').svg}${plush('macos').svg.replace('class="sy-plush"', 'class="sy-plush" visibility="hidden"')}</g>`;
 const outputs = Array.from({ length: 4 }, (_, slot) => `<g data-sy-output="${slot}" style="display:none">${plush('linux').svg}${plush('macos').svg}</g>`).join('');
 const tread = Array.from({ length: 30 }, (_, i) => L(k.lineOnTop([-56 + i * 8, -4], [-56 + i * 8, 33], BELT_Z + 0.02, P), { tone: 'mid' })).join('');
 const fire = face(FEED_X, 18, 112, `<g data-sy-heat opacity="${state.heat}"><ellipse class="sy-heat-pool" cy="-7" rx="21" ry="9"/>${[-14, 0, 14].map((x, i) => `<g transform="translate(${x} 0)"><path class="sy-flame-glow" data-sy-flame="${i}" d="M-6 0Q-11-10 0-30Q-2-17 6-12Q12-2 6 0Z"/><path class="sy-flame" data-sy-flame="${i}" d="M-6 0Q-11-10 0-30Q-2-17 6-12Q12-2 6 0Z"/><path class="sy-flame-core" data-sy-flame="${i}" transform="scale(.5 .7)" d="M-6 0Q-11-10 0-30Q-2-17 6-12Q12-2 6 0Z"/></g>`).join('')}</g>`);
 const steam = face(-86, 18, 154, '<g data-sy-steam opacity="0"><path class="sy-steam" d="M0 0C-5-5 6-9 0-15S3-24 0-28"/><path class="sy-steam" d="M7 1C3-4 12-10 6-16S8-24 6-28"/></g>');
 const heaterGlass = face(-124, 39.1, 148, '<rect class="sy-hot-window" width="39" height="33" rx="1.2"/><path class="sy-window-shine" d="M3 1h2l8 30h-3Z"/>');
 const glass = face(-143, 56.2, 159, '<path class="sy-window-pane" d="M0 0H128V112H0Z"/><path class="sy-window-shine" d="M7 4h5l13 104h-3ZM108 4h2l13 104h-5Z"/>');
 const shadow = `<path class="iso-halo" d="${k.haloOf(BASE, -17, 12, P)}"/>`;
 const rod = k.segment([DROP_X, TOY_Y, state.pressZ + 5], [DROP_X, TOY_Y, 115], P);
 const body = defs + shadow + layer('back') + `<g clip-path="url(#sy-belt-clip)"><g data-sy-tread>${tread}</g></g>` + fire + steam +
  `<g data-sy-materials opacity="${state.materialOpacity}" transform="${k.translateAlong(P, [state.materialX, TOY_Y, state.materialZ])}">${layer('materials')}</g><path class="sy-press-rod" data-sy-rod d="${rod}"/><g data-sy-press transform="${k.translateAlong(P, [0, 0, state.pressZ])}">${layer('press')}</g>` + product + outputs + heaterGlass + glass + layer('front');
 return { body, readout: state.readout, data: { origin: at([0, 0, 0]), axes: [k.axisVector(P, [1, 0, 0]), k.axisVector(P, [0, 1, 0]), k.axisVector(P, [0, 0, 1])] } };
}
