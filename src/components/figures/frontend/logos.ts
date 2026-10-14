// Logos que imprime la imprenta, dibujados en coordenadas locales de la hoja (unidades de mundo).
// `mono`: lo que estampa la prensa (HTML estático, tinta neutra). `color`: la misma pieza ya
// hidratada, con los colores de marca; el script en vivo la funde encima según el nivel de hidratación.
import type { LogoId } from './model';

export interface Tile {
	x: number;
	y: number;
	s: number;
}

const r1 = (n: number) => Math.round(n * 100) / 100;
const square = ({ x, y, s }: Tile, attrs: string) => `<rect x="${r1(x)}" y="${r1(y)}" width="${r1(s)}" height="${r1(s)}" rx="${r1(s * 0.08)}" ${attrs}/>`;
const letters = ({ x, y, s }: Tile, text: string, attrs: string) =>
	`<text x="${r1(x + s * 0.92)}" y="${r1(y + s * 0.9)}" font-size="${r1(s * 0.42)}" font-weight="700" text-anchor="end" font-family="system-ui,-apple-system,'Segoe UI',sans-serif" letter-spacing="-0.02em" ${attrs}>${text}</text>`;

/** Silueta de la "A" de Astro y su llama, centradas en el cuadro. */
function astroMark({ x, y, s }: Tile) {
	const cx = x + s / 2;
	const cy = y + s * 0.46;
	const u = s / 20;
	const a = (dx: number, dy: number) => `${r1(cx + dx * u)} ${r1(cy + dy * u)}`;
	const body = `M${a(-5.6, 5.4)}L${a(-1.9, -6.2)}Q${a(0, -7.6)} ${a(1.9, -6.2)}L${a(5.6, 5.4)}Q${a(3.2, 3.6)} ${a(1.9, 3.7)}L${a(0.9, 0.4)}Q${a(0, -0.4)} ${a(-0.9, 0.4)}L${a(-1.9, 3.7)}Q${a(-3.2, 3.6)} ${a(-5.6, 5.4)}Z`;
	const flame = `M${a(-2.3, 5.2)}Q${a(0, 4.2)} ${a(2.3, 5.2)}Q${a(1.6, 6.8)} ${a(0, 9.2)}Q${a(-1.6, 6.8)} ${a(-2.3, 5.2)}Z`;
	return { body, flame };
}

/** Átomo de React: tres órbitas y el núcleo. */
function atom({ x, y, s }: Tile, attrs: string, core: string) {
	const cx = r1(x + s / 2);
	const cy = r1(y + s / 2);
	const orbits = [0, 60, 120].map((deg) => `<ellipse cx="${cx}" cy="${cy}" rx="${r1(s * 0.4)}" ry="${r1(s * 0.15)}" transform="rotate(${deg} ${cx} ${cy})" ${attrs}/>`).join('');
	return orbits + `<circle cx="${cx}" cy="${cy}" r="${r1(s * 0.08)}" ${core}/>`;
}

const INK_LINE = 'class="fe-mono-line"';
const INK_FILL = 'class="fe-mono-fill"';

export function logoSvg(id: LogoId, tile: Tile, look: 'mono' | 'color') {
	const mono = look === 'mono';
	switch (id) {
		case 'ts':
		case 'js': {
			const text = id === 'ts' ? 'TS' : 'JS';
			if (mono) return square(tile, INK_LINE) + letters(tile, text, INK_FILL);
			const [bg, fg] = id === 'ts' ? ['#3178c6', '#ffffff'] : ['#f7df1e', '#1a1a1a'];
			return square(tile, `fill="${bg}"`) + letters(tile, text, `fill="${fg}"`);
		}
		case 'astro': {
			const { body, flame } = astroMark(tile);
			if (mono) return square(tile, INK_LINE) + `<path d="${body}" ${INK_FILL}/><path d="${flame}" ${INK_LINE}/>`;
			return square(tile, 'fill="#17191e"') + `<path d="${body}" fill="#ffffff"/><path d="${flame}" fill="url(#fe-astro-flame)"/>`;
		}
		case 'react':
			if (mono) return square(tile, INK_LINE) + atom(tile, `fill="none" ${INK_LINE}`, INK_FILL);
			return square(tile, 'fill="#20232a"') + atom(tile, 'fill="none" stroke="#61dafb" stroke-width="1.1" vector-effect="non-scaling-stroke"', 'fill="#61dafb"');
	}
}

/** Degradado de la llama de Astro; va una vez en el SVG trasero. */
export const LOGO_DEFS =
	'<defs><linearGradient id="fe-astro-flame" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff5d01"/><stop offset="1" stop-color="#bc52ee"/></linearGradient></defs>';
