import * as k from '@/lib/iso/iso-kit';
import type { Flat, Plan, Point3, Tone } from '@/lib/iso/iso-kit';
import order from './order.json';

export const W = 640;
export const H = 420;
const BASE: Plan = { x: -170, y: -95, w: 340, d: 196, r: 9 };
const SERVERS = [
 { x: -139, y: -70, w: 52, d: 56, h: 101, brand: 'rust', label: 'Rust', sub: 'REST' },
 { x: -63, y: -70, w: 52, d: 56, h: 119, brand: 'java', label: 'Java', sub: 'Quarkus' },
 { x: 13, y: -70, w: 52, d: 56, h: 97, brand: 'php', label: 'PHP', sub: 'Laravel' },
] as const;
const STORES = [
 { x: 119, y: -26, r: 28, h: 76, brand: 'mysql', label: 'MySQL' },
 { x: 64, y: 62, r: 27, h: 59, brand: 'postgres', label: 'PostgreSQL' },
] as const;
const AUTH: Plan = { x: -60, y: 45, w: 60, d: 36, r: 3 };
export const P = k.fitProjection([
 ...k.boxCorners(BASE, -17, 0),
 ...SERVERS.flatMap(s => k.boxCorners({ ...s, r: 2 }, 0, s.h + 10)),
 ...STORES.flatMap(s => k.boxCorners({ x: s.x - s.r, y: s.y - s.r, w: s.r * 2, d: s.r * 2, r: s.r }, 0, s.h + 9)),
], W, H, { pad: 16, azimuth: 53, elevation: 30 });

export type Shape =
 | { kind: 'slab'; plan: Plan; z: number; h: number }
 | { kind: 'cylinder'; x: number; y: number; r: number; z: number; h: number };
export interface Part { name: string; owner: string; at: Point3; shape: Shape; svg: string }
export interface Route { name: string; points: Flat[] }
const L = k.lineSvg;
const at = (point: Point3) => k.iso(point, P);
const rect = (x: number, y: number, w: number, d: number, r = 0.6): Plan => ({ x, y, w, d, r });
const tint = (brand: string, svg: string) => `<g class="be-tint" data-brand="${brand}">${svg}</g>`;
const face = (x: number, y: number, z: number, svg: string) => `<g transform="${k.sideMatrix([x, y], z, P, 'left')}">${svg}</g>`;
const text = (x: number, y: number, z: number, label: string, size: number, tone: k.LineTone = 'hi') => k.faceTextSvg(k.sideMatrix([x, y], z, P, 'left'), label, { size, tone: tone === 'lit' ? 'hi' : tone === 'red' || tone === 'green' || tone === 'blue' ? 'hi' : tone });

function badge(brand: string) {
 if (brand === 'rust') {
  const gear = Array.from({ length: 48 }, (_, i) => { const a = i * Math.PI / 24; const r = i % 3 ? 6.3 : 7.5; return `${7.5 + Math.cos(a) * r},${7.5 + Math.sin(a) * r}`; }).join(' ');
  return `<polygon class="be-brand-ink" points="${gear}"/><circle class="be-brand-hole" cx="7.5" cy="7.5" r="4.8"/><text class="be-brand-ink" x="7.5" y="10.4" text-anchor="middle" font-size="8.2" font-weight="800" font-family="monospace">R</text>`;
 }
 if (brand === 'java') return '<g class="be-brand-stroke"><path d="M3 9h9v3q-4.5 4-9 0zM12 10h2q3 3-2 4M2 16q6 2 12 0M5 7q-4-3 2-5M9 7q-3-2 2-5"/></g>';
 return '<ellipse class="be-brand-ink" cx="8" cy="8" rx="9" ry="5.5"/><text class="be-brand-hole" x="8" y="10" text-anchor="middle" font-size="5.8" font-style="italic" font-weight="700">php</text>';
}
const supabaseMark = '<path class="be-brand-ink" d="M7 0 0 10h7zM8 6h7l-7 10z"/>';

export function scene() {
 const parts: Part[] = [];
 const routes: Route[] = [];
 function put(name: string, owner: string, shape: Shape, tone: Tone = 'mid', detail = '', brand?: string) {
  const solid = shape.kind === 'slab'
   ? k.slabOf(shape.plan, shape.z, shape.h, P, 5, Math.min(0.8, shape.h / 4))
   : k.cylinder(shape.x, shape.y, shape.r, shape.z, shape.h, P, 72, Math.min(0.6, shape.h / 4));
  const svg = k.solidSvg(solid, { tone, inner: detail });
  const center: Point3 = shape.kind === 'slab'
   ? [shape.plan.x + shape.plan.w / 2, shape.plan.y + shape.plan.d / 2, shape.z + shape.h / 2]
   : [shape.x, shape.y, shape.z + shape.h / 2];
  parts.push({ name, owner, at: center, shape, svg: brand ? tint(brand, svg) : svg });
 }
 const slab = (name: string, owner: string, plan: Plan, z: number, h: number, tone: Tone = 'mid', detail = '', brand?: string) => put(name, owner, { kind: 'slab', plan, z, h }, tone, detail, brand);
 const cylinder = (name: string, owner: string, x: number, y: number, r: number, z: number, h: number, tone: Tone = 'mid', detail = '', brand?: string) => put(name, owner, { kind: 'cylinder', x, y, r, z, h }, tone, detail, brand);
 const screws = (plan: Plan, z: number, inset = 4) => L(k.corners(plan, inset).map(([x, y]) => k.ring(x, y, 1.2, z, P, 12)).join(''), { tone: 'lo' }) + k.dotsSvg(k.corners(plan, inset).map(([x, y]) => at([x, y, z])), { size: 0.35 });

 for (const [i, [x, y]] of k.corners(BASE, 23).entries()) cylinder(`stand.foot-${i}`, 'stand', x, y, 7, -17, 5, 'lo');
 let deck = L(k.planOutline(k.insetPlan(BASE, 4), 0, P), { tone: 'lo' }) + screws(BASE, 0, 10);
 // Pistas grabadas sobre el tablero; sus extremos llegan a las bancadas.
 const tracks: { name: string; pts: Point3[] }[] = [
  { name: 'auth', pts: [[-156, 37, 0], [-146, 37, 0], [-146, 60, 0], [-63, 60, 0]] },
  { name: 'request', pts: [[-63, 60, 0], [-85, 60, 0], [-85, 12, 0], [-113, 12, 0], [-113, -11, 0]] },
  { name: 'service', pts: [[-113, -11, 0], [-113, 18, 0], [-37, 18, 0], [-37, -11, 0]] },
  { name: 'mysql', pts: [[-37, -11, 0], [-37, 18, 0], [119, 18, 0], [119, 4, 0]] },
  { name: 'php', pts: [[-37, -11, 0], [-37, 18, 0], [39, 18, 0], [39, -11, 0]] },
  { name: 'postgres', pts: [[39, -11, 0], [39, 27, 0], [64, 27, 0], [64, 33, 0]] },
 ];
 for (const route of tracks) {
  const points = route.pts.map(at);
  const d = k.pathOf(points);
  deck += `<path class="be-track-seat" d="${d}"/><path class="be-track" data-track="${route.name}" d="${d}"/>`;
  deck += k.dotsSvg([points[0], points[points.length - 1]], { size: 1.1, tone: 'hi' });
  routes.push({ name: route.name, points });
 }
 for (let i = 0; i < 14; i++) deck += L(k.lineOnTop([-153 + i * 4, 86], [-153 + i * 4, 92], 0, P), { tone: 'faint', free: true });
 slab('stand.deck', 'stand', BASE, -12, 12, 'mid', deck);

 for (const [index, s] of SERVERS.entries()) {
  const owner = `server-${index}`;
  const front = s.y + s.d;
  const pedestal = rect(s.x - 3, s.y - 3, s.w + 6, s.d + 6, 3);
  slab(`${owner}.pedestal`, owner, pedestal, 0, 4, 'mid', screws(pedestal, 4, 4));
  const chassis = rect(s.x, s.y, s.w, s.d, 2);
  let detail = tint(s.brand, face(s.x + 7, front + 0.1, s.h, badge(s.brand)));
  detail += text(s.x + 25, front + 0.1, s.h - 7, s.label, 5);
  detail += text(s.x + 25, front + 0.1, s.h - 15, s.sub, 3.1, 'lo');
  detail += face(s.x + 7, front + 0.1, 35, '<path class="be-brand-stroke" d="M0 0H37"/>');
  // Fan, closed vent slots, sockets and power switch are printed/recessed into the front face.
  let fan = '<circle class="be-fan-rim" r="9"/><circle class="be-fan-rim" r="7"/><circle class="be-fan-hub" r="2"/>';
  for (let blade = 0; blade < 7; blade++) fan += `<path class="be-fan-blade" transform="rotate(${blade * 360 / 7})" d="M2 0Q5 -5 7 -1Q7 2 3 2Z"/>`;
  detail += face(s.x + 28, front + 0.1, 23, `<g class="be-fan" data-fan="${index}">${fan}</g>`);
  detail += face(s.x + 6, front + 0.1, 15, '<rect class="be-window" width="7" height="4" y="-4" rx="0.5"/><circle class="be-power" cx="3.5" cy="-10" r="2"/>');
  for (let row = 0; row < 6; row++) for (let col = 0; col < 5; col++) {
   detail += `<g transform="${k.sideMatrix([s.x + s.w + 0.05, s.y + 7 + col * 8], 15 + row * 5, P, 'right')}"><rect class="be-vent" x="0" y="-2.6" width="2" height="2.6" rx="0.45"/></g>`;
  }
  let board = '<rect class="be-inspection" width="43" height="43" rx="2"/><rect class="be-circuit-board" x="3" y="3" width="37" height="37" rx="1"/><rect class="be-chip" x="13" y="13" width="13" height="13" rx="1"/>';
  for (let pin = 0; pin < 6; pin++) board += `<path class="be-circuit" d="M${14 + pin * 2} 8v5M${14 + pin * 2} 26v6M8 ${14 + pin * 2}h5M26 ${14 + pin * 2}h7"/>`;
  for (let dimm = 0; dimm < 3; dimm++) board += `<rect class="be-memory" x="${6 + dimm * 10}" y="35" width="7" height="2"/>`;
  for (const [x, y] of [[2, 2], [41, 2], [2, 41], [41, 41]]) board += `<circle class="be-panel-screw" cx="${x}" cy="${y}" r="0.7"/>`;
  detail += tint(s.brand, `<g transform="${k.sideMatrix([s.x + s.w + 0.1, front - 6], s.h - 7, P, 'right')}">${board}</g>`);
  slab(`${owner}.chassis`, owner, chassis, 4, s.h, 'hi', detail);
  for (const [rail, x] of [s.x + 1, s.x + s.w - 2.5].entries()) slab(`${owner}.rail-${rail}`, owner, rect(x, front, 1.5, 1.5, 0.2), 4, s.h, 'mid');
  for (let tray = 0; tray < 4; tray++) {
   const z = 39 + tray * 9;
   const trayDetail = face(s.x + 6, front + 2.2, z + 4, `<path class="be-drive-rule" d="M2 -1H21M2 1H21"/><circle class="be-led" data-led="${index}" cx="30" cy="0" r="0.75"/>`);
   slab(`${owner}.drive-${tray}`, owner, rect(s.x + 5, front, 42, 2.2, 0.5), z, 7, 'mid', trayDetail);
  }
  for (let handle = 0; handle < 2; handle++) slab(`${owner}.handle-${handle}`, owner, rect(s.x + 7 + handle * 31, front + 2.2, 4, 1.5, 0.5), 42, 3, 'hi');
  let lid = L(k.planOutline(k.insetPlan(chassis, 3), s.h + 7, P), { tone: 'lo' }) + screws(chassis, s.h + 7, 5);
  for (let slot = 0; slot < 9; slot++) lid += L(k.planOutline(rect(s.x + 10 + slot * 3.5, s.y + 10, 1.2, 25, 0.5), s.h + 7, P, 3), { tone: 'lo' });
  slab(`${owner}.lid`, owner, chassis, s.h + 4, 3, 'hi', lid, s.brand);
 }

 const authBase = k.insetPlan(AUTH, -3);
 slab('auth.pedestal', 'auth', authBase, 0, 4, 'mid', screws(authBase, 4, 4));
 let authFace = tint('supabase', face(-54, 81.1, 23, '<rect class="be-window" width="47" height="12" rx="1.2"/><path class="be-screen-rule" d="M4 4h12M4 8h20"/><circle class="be-led" cx="40" cy="6" r="1.3"/>'));
 authFace += text(-53, 81.1, 7, 'AUTH / JWT', 3.4);
 slab('auth.chassis', 'auth', AUTH, 4, 27, 'hi', authFace);
 const authTop = 33;
 let authLid = screws(AUTH, authTop, 4);
 authLid += tint('supabase', `<g transform="${k.topMatrix([-51, 53], authTop, P)}">${supabaseMark}</g>`);
 authLid += k.faceTextSvg(k.topMatrix([-17, 66], authTop, P), 'Supabase', { anchor: 'middle', size: 4.8, tone: 'hi' });
 slab('auth.lid', 'auth', AUTH, 31, 2, 'hi', authLid, 'supabase');

 for (const [index, s] of STORES.entries()) {
  const owner = `store-${index}`;
  cylinder(`${owner}.pedestal`, owner, s.x, s.y, s.r + 2, 0, 4, 'mid');
  const slice = s.h / 4;
  for (let disc = 0; disc < 4; disc++) {
   const z = 4 + disc * slice;
   let detail = L(k.ring(s.x, s.y, s.r - 2, z + slice - 1, P, 72), { tone: 'lo' });
   detail += L(k.sideArc(s.x, s.y, s.r, z + 2, P, 48), { tone: 'lo' });
   const led = at([s.x + s.r * 0.64, s.y + s.r * 0.77, z + slice / 2]);
   detail += `<circle class="be-led" data-store-led="${index}" cx="${led[0]}" cy="${led[1]}" r="1.1"/>`;
   cylinder(`${owner}.disc-${disc}`, owner, s.x, s.y, s.r, z, slice - 1, 'hi', detail, s.brand);
   cylinder(`${owner}.spacer-${disc}`, owner, s.x, s.y, s.r - 1.2, z + slice - 1, 1, 'lo');
  }
  const top = s.h + 6;
  let lid = L(k.ring(s.x, s.y, s.r - 3, top, P, 72), { tone: 'mid' });
  lid += k.faceTextSvg(k.topMatrix([s.x, s.y + 3], top, P), s.label, { anchor: 'middle', size: 5, tone: 'hi' });
  for (let bolt = 0; bolt < 8; bolt++) {
   const angle = bolt * Math.PI / 4;
   lid += L(k.ring(s.x + Math.cos(angle) * (s.r - 5), s.y + Math.sin(angle) * (s.r - 5), 0.6, top, P, 10), { tone: 'lo' });
  }
  cylinder(`${owner}.lid`, owner, s.x, s.y, s.r + 0.7, s.h + 4, 2, 'hi', lid, s.brand);
 }
 const ranks = new Map<string, number>(order.map((name, index) => [name, index]));
 parts.sort((a, b) => (ranks.get(a.name) ?? k.depthOf(a.at, P)) - (ranks.get(b.name) ?? k.depthOf(b.at, P)));
 return { parts, routes };
}

export function build() {
 const { parts, routes } = scene();
 const shadow = `<path class="iso-halo" d="${k.haloOf(BASE, -17, 12, P)}"/>`;
 const mask = `<defs><mask id="be-floor-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="white"/>${parts.filter(part => part.owner !== 'stand').map(part => {
  const s = part.shape;
  const solid = s.kind === 'slab' ? k.slabOf(s.plan, s.z, s.h, P, 5) : k.cylinder(s.x, s.y, s.r, s.z, s.h, P, 72);
  return `<path d="${solid.fill}" fill="black"/>`;
 }).join('')}</mask></defs>`;
 const packets = routes.map((route, index) => `<circle class="be-packet" data-packet="${route.name}" cx="${route.points[0][0]}" cy="${route.points[0][1]}" r="2.2" opacity="${index === 0 ? 1 : 0}"/>`).join('');
 return { body: mask + shadow + parts.map(part => `<g data-part="${part.name}">${part.svg}</g>`).join('') + `<g mask="url(#be-floor-mask)">${packets}</g>`, routes };
}
