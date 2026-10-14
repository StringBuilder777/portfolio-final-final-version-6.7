// Logos de los equipos del rack, dibujados en coordenadas locales de la cara frontal
// (u a la derecha, v hacia abajo, unidades de mundo). Geometry los coloca con la matriz del plano frontal.
// Los colores salen de variables de la figura (--rd-*), así siguen el tema claro/oscuro.

export interface Box {
	/** Esquina superior izquierda y alto; el ancho lo decide cada logo. */
	x: number;
	y: number;
	h: number;
}

const r2 = (n: number) => Math.round(n * 100) / 100;
const fill = (brand: string) => `style="fill:var(--rd-${brand})"`;
const FONT = `font-family="system-ui,-apple-system,'Segoe UI',sans-serif" font-weight="700"`;

/** Cisco: nueve barras alineadas abajo (corta, media, alta…) y el nombre debajo. Ancho ≈ 2.1·h. */
export function cisco({ x, y, h }: Box) {
	const bars = [0.38, 0.62, 1, 0.62, 0.38, 0.62, 1, 0.62, 0.38];
	const top = h * 0.62;
	const pitch = (h * 2.1) / 9;
	const w = pitch * 0.42;
	const body = bars
		.map((b, i) => {
			const bh = top * b;
			return `<rect x="${r2(x + i * pitch + (pitch - w) / 2)}" y="${r2(y + top - bh)}" width="${r2(w)}" height="${r2(bh)}" rx="${r2(w / 2)}" ${fill('cisco')}/>`;
		})
		.join('');
	return body + `<text x="${r2(x + h * 1.05)}" y="${r2(y + h)}" font-size="${r2(h * 0.34)}" text-anchor="middle" letter-spacing="0.12em" ${FONT} ${fill('cisco')}>CISCO</text>`;
}

/** Símbolo de router de los diagramas Cisco: disco con cuatro flechas (dos entran, dos salen). Ancho = h. */
export function router({ x, y, h }: Box) {
	const c = [x + h / 2, y + h / 2];
	const r = h / 2;
	const arrow = (angle: number, out: boolean) => {
		const a = (angle * Math.PI) / 180;
		const [ux, uy] = [Math.cos(a), Math.sin(a)];
		const [px, py] = [-uy, ux];
		const [r0, r1] = out ? [r * 0.22, r * 0.8] : [r * 0.8, r * 0.22];
		const tip = [c[0] + ux * r1, c[1] + uy * r1];
		const dir = out ? 1 : -1;
		const head = r * 0.24;
		const base = [tip[0] - ux * head * dir, tip[1] - uy * head * dir];
		return (
			`<path d="M${r2(c[0] + ux * r0)} ${r2(c[1] + uy * r0)}L${r2(base[0])} ${r2(base[1])}" class="rd-logo-line"/>` +
			`<path d="M${r2(tip[0])} ${r2(tip[1])}L${r2(base[0] + px * head * 0.7)} ${r2(base[1] + py * head * 0.7)}L${r2(base[0] - px * head * 0.7)} ${r2(base[1] - py * head * 0.7)}Z" class="rd-logo-ink"/>`
		);
	};
	return `<circle cx="${r2(c[0])}" cy="${r2(c[1])}" r="${r2(r)}" ${fill('route')}/>` + [arrow(-45, true), arrow(135, true), arrow(45, false), arrow(-135, false)].join('');
}

/** Firewall: muro de ladrillos en hiladas alternas. Ancho ≈ 1.5·h. */
export function wall({ x, y, h }: Box) {
	const w = h * 1.5;
	const rows = 3;
	const rh = h / rows;
	const brick = w / 3;
	const bricks: string[] = [];
	for (let r = 0; r < rows; r++) {
		const shift = r % 2 ? brick / 2 : 0;
		for (let b = -1; b < 3; b++) {
			const x0 = Math.max(0, b * brick + shift);
			const x1 = Math.min(w, (b + 1) * brick + shift);
			if (x1 - x0 < 0.6) continue;
			bricks.push(`<rect x="${r2(x + x0 + 0.25)}" y="${r2(y + r * rh + 0.25)}" width="${r2(x1 - x0 - 0.5)}" height="${r2(rh - 0.5)}" rx="0.2" ${fill('fw')}/>`);
		}
	}
	return bricks.join('');
}

/** Rust: engranaje con la R. Ancho = h. */
export function rust({ x, y, h }: Box) {
	const [cx, cy] = [x + h / 2, y + h / 2];
	const teeth = 16;
	const points: string[] = [];
	for (let i = 0; i < teeth * 2; i++) {
		const a = (i / (teeth * 2)) * Math.PI * 2;
		const r = (i % 2 ? 0.42 : 0.5) * h;
		points.push(`${r2(cx + Math.cos(a) * r)} ${r2(cy + Math.sin(a) * r)}`);
	}
	return (
		`<path d="M${points.join('L')}Z" ${fill('rust')}/>` +
		`<circle cx="${r2(cx)}" cy="${r2(cy)}" r="${r2(h * 0.33)}" class="rd-logo-hole"/>` +
		`<text x="${r2(cx)}" y="${r2(cy + h * 0.17)}" font-size="${r2(h * 0.48)}" text-anchor="middle" ${FONT} ${fill('rust')}>R</text>`
	);
}

/** Etiqueta 802.1Q: una etiqueta de equipaje con «VLAN». Ancho ≈ 2.2·h. */
export function vlanTag({ x, y, h }: Box) {
	const w = h * 2.2;
	const n = h * 0.45;
	const d = `M${r2(x)} ${r2(y + h / 2)}L${r2(x + n)} ${r2(y)}L${r2(x + w)} ${r2(y)}L${r2(x + w)} ${r2(y + h)}L${r2(x + n)} ${r2(y + h)}Z`;
	return (
		`<path d="${d}" ${fill('v10')}/>` +
		`<circle cx="${r2(x + n * 0.75)}" cy="${r2(y + h / 2)}" r="${r2(h * 0.12)}" class="rd-logo-hole"/>` +
		`<text x="${r2(x + n + (w - n) / 2)}" y="${r2(y + h * 0.72)}" font-size="${r2(h * 0.5)}" text-anchor="middle" ${FONT} class="rd-logo-hole">VLAN</text>`
	);
}

/** Rayo del SAI. Ancho ≈ 0.6·h. */
export function bolt({ x, y, h }: Box) {
	const u = h / 10;
	const p = (dx: number, dy: number) => `${r2(x + dx * u)} ${r2(y + dy * u)}`;
	return `<path d="M${p(3.8, 0)}L${p(0.4, 5.6)}L${p(2.8, 5.6)}L${p(1.6, 10)}L${p(5.6, 3.8)}L${p(3.2, 3.8)}L${p(4.6, 0)}Z" ${fill('power')}/>`;
}
