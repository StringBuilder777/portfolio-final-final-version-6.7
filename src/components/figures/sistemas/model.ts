export type Mascot = 'linux' | 'macos';
export const PERIOD = 7;
export const RELEASE = 4.8;
export const STILL_T = 4.2;
export const FEED_X = -105;
export const DROP_X = -34;
export const BELT_END = 169;
export const BELT_SPEED = 16;
export const BELT_Z = 41.5;
export const TOY_Y = 14;
export const mascotAt = (index: number): Mascot => index === 1 ? 'macos' : 'linux';
const clamp = (value: number) => Math.max(0, Math.min(1, value));
const ease = (a: number, b: number, time: number) => { const t = clamp((time - a) / (b - a)); return t * t * (3 - 2 * t); };
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
export interface BeltToy { index: number; mascot: Mascot; x: number; opacity: number }

export function stateAt(seconds: number) {
 const time = Math.max(0, seconds);
 const index = Math.floor(time / PERIOD);
 const phase = time - index * PERIOD;
 const feed = ease(0, 1.5, phase), transfer = ease(2.6, 3.5, phase);
 const materialX = mix(FEED_X, DROP_X, transfer);
 const materialZ = phase < 1.5 ? mix(232, 128, feed) : mix(128, 96, transfer);
 const materialOpacity = ease(0, 0.18, phase) * (1 - ease(3.3, 3.7, phase));
 const heat = ease(0.7, 1.4, phase) * (1 - ease(2.8, 3.5, phase));
 const pressZ = mix(mix(104, 85.5, ease(3.3, 4.05, phase)), 104, ease(4.1, 4.7, phase));
 const productOpacity = ease(3.5, 4.25, phase);
 const delivered = time < RELEASE ? 0 : Math.floor((time - RELEASE) / PERIOD) + 1;
 const toys: BeltToy[] = [];
 for (let n = Math.max(0, delivered - 3); n < delivered; n++) {
  const x = DROP_X + (time - (n * PERIOD + RELEASE)) * BELT_SPEED;
  if (x <= BELT_END + 20) toys.push({ index: n, mascot: mascotAt(n), x, opacity: clamp((BELT_END + 16 - x) / 16) });
 }
 const stage = phase < 1.5 ? 'entrando las piezas' : phase < 2.8 ? 'cámara de calor' : phase < 3.5 ? 'pasando a confección' : phase < RELEASE ? 'prensado y costura' : 'salida a la cinta';
 const name = mascotAt(index) === 'linux' ? 'Linux' : 'macOS';
 return { index, mascot: mascotAt(index), phase, materialX, materialZ, materialOpacity, heat, steam: heat * (0.15 + 0.45 * ease(2.3, 2.8, phase)), pressZ, productOpacity, productVisible: phase >= 3.5 && phase < RELEASE, delivered, toys, beltOffset: (time * BELT_SPEED) % 8,
  readout: `${name} · ${stage} · ${delivered} ${delivered === 1 ? 'peluche terminado' : 'peluches terminados'}` };
}
