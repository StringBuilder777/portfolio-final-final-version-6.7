// Disco de tinta (CSS) sobre la corona de la prensa. Lo comparten el build y el script en vivo,
// que reconstruye las rayas de tinta en cada fotograma mientras el disco gira.
import { onTop } from '@/lib/iso/iso-kit';
import type { Plane, Projection } from '@/lib/iso/iso-kit';
import { AT } from './model';

export const DISC = { x: AT.press, y: 0, r: 17, z: 98, h: 2.5 };

/** Tres rayas de tinta sobre la cara del disco, giradas `turn` radianes. */
export function streaks(turn: number, projection: Projection) {
	const z = DISC.z + DISC.h;
	return [0, 1, 2]
		.map((i) => {
			const a0 = turn + (i * Math.PI * 2) / 3;
			const r = 6 + i * 3.4;
			const points: Plane[] = Array.from({ length: 12 }, (_, s) => {
				const a = a0 + (s / 11) * 1.4;
				return [DISC.x + Math.cos(a) * r, DISC.y + Math.sin(a) * r];
			});
			return onTop(points, z, projection);
		})
		.join('');
}
