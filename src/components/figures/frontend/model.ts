// Modelo puro de la imprenta de islas: qué bloques tiene la página, cuáles son islas
// y dónde está cada pieza en cada instante del ciclo. Lo usan el build (pose inicial)
// y el script en vivo, así que el dibujo, el movimiento y la lectura no pueden divergir.

export type Mode = 'islas' | 'spa';

/** Un bloque de la página impresa, en coordenadas locales de la hoja (centro en 0,0). */
export interface Block {
	name: string;
	x: number;
	y: number;
	w: number;
	d: number;
	/** Isla interactiva (`client:*` en Astro): la única que React hidrata en modo islas. */
	island?: boolean;
	/** Bloque entintado con el color de CSS en vez de la tinta neutra. */
	css?: boolean;
}

export const SHEET = { w: 44, d: 34 };

export const BLOCKS: Block[] = [
	{ name: 'logo', x: -20, y: -13, w: 26, d: 26, island: true },
	{ name: 'titulo', x: 9, y: -13, w: 11, d: 3, css: true },
	{ name: 'texto', x: 9, y: -7.6, w: 11, d: 7 },
	{ name: 'boton', x: 9, y: 2.4, w: 9, d: 4.2, island: true },
	{ name: 'pie', x: -20, y: 14.2, w: 40, d: 1.6 },
]

/** Lo que imprime cada hoja, en orden: una tecnología por ciclo. */
export const LOGOS = [
	{ id: 'ts', name: 'TypeScript' },
	{ id: 'astro', name: 'Astro' },
	{ id: 'js', name: 'JavaScript' },
	{ id: 'react', name: 'React' },
] as const;
export type LogoId = (typeof LOGOS)[number]['id'];

/** Logo que lleva la hoja del ciclo `n` (contando desde 0). */
export const logoOf = (cycle: number) => LOGOS[((cycle % LOGOS.length) + LOGOS.length) % LOGOS.length];

export const ISLANDS = BLOCKS.filter((block) => block.island).length;

/** Centros (x) de la lanzadera en cada estación y de las pilas de papel. */
export const AT = { feed: -148, load: -86, press: -30, hydrate: 32, out: 86, tray: 148 };

export const CYCLE = 8;
/** Recorrido de la platina: de reposo (0) a apoyada sobre la hoja (1). */
export const PLATEN_TRAVEL = 22.4;
/** Recorrido del cabezal de hidratación al bajar. */
export const HEAD_TRAVEL = 8;
/** Pose fija para movimiento reducido y para el primer pintado sin JS: toda la hidratación ya terminó en ambos modos. */
export const STILL_T = 5.25;

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
export const smoothstep = (a: number, b: number, x: number) => {
	const t = clamp01((x - a) / (b - a));
	return t * t * (3 - 2 * t);
};
const ease = (a: number, b: number, t: number) => {
	const u = clamp01((t - a) / (b - a));
	return u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Momento en que React hidrata cada bloque (null: se queda como HTML estático). */
export function hydrationTimes(mode: Mode): (number | null)[] {
	// Las islas se hidratan a la misma hora en ambos modos: alternar nunca apaga una isla encendida.
	let island = 0;
	let rest = 0;
	return BLOCKS.map((block) => {
		if (block.island) return 4.35 + 0.42 * island++;
		// SPA: además se hidrata el resto de la página, bloque a bloque; todo acaba con JS.
		return mode === 'spa' ? 4.25 + 0.12 * rest++ : null;
	});
}

export interface Pose {
	/** x del centro de la lanzadera. */
	shuttle: number;
	/** x del centro de la hoja que viaja. */
	sheet: number;
	/** Opacidad de la hoja: 0 cuando ya se asentó en la pila de salida. */
	sheetAlpha: number;
	/** 0 en reposo, 1 apoyada. */
	platen: number;
	/** Tinta estampada en la hoja. */
	printed: number;
	/** 0 arriba, 1 abajo. */
	head: number;
	/** Nivel objetivo de cada bloque (0 estático, 1 hidratado). */
	levels: number[];
	phase: string;
	/** Velocidad relativa del disco de tinta (entinta al subir la platina). */
	ink: number;
}

export function poseAt(time: number, mode: Mode): Pose {
	const t = ((time % CYCLE) + CYCLE) % CYCLE;

	let shuttle: number = AT.load;
	if (t < 0.7) shuttle = AT.load;
	else if (t < 1.7) shuttle = lerp(AT.load, AT.press, ease(0.7, 1.7, t));
	else if (t < 3.1) shuttle = AT.press;
	else if (t < 4.0) shuttle = lerp(AT.press, AT.hydrate, ease(3.1, 4.0, t));
	else if (t < 5.9) shuttle = AT.hydrate;
	else if (t < 6.7) shuttle = lerp(AT.hydrate, AT.out, ease(5.9, 6.7, t));
	else if (t < 7.1) shuttle = AT.out;
	else shuttle = lerp(AT.out, AT.load, ease(7.1, 8.0, t));

	let sheet = shuttle;
	if (t < 0.7) sheet = lerp(AT.feed, AT.load, ease(0, 0.7, t));
	else if (t >= 6.7) sheet = lerp(AT.out, AT.tray, ease(6.7, 7.3, t));

	const sheetAlpha = 1 - smoothstep(7.35, 7.75, t);

	// La platina baja acelerando, se apoya y sube con calma.
	const platen = t < 1.8 ? 0 : t < 2.3 ? Math.pow(clamp01((t - 1.8) / 0.5), 2) : 1 - ease(2.5, 3.1, t);
	const printed = smoothstep(2.22, 2.34, t);

	const head = smoothstep(4.0, 4.3, t) * (1 - smoothstep(5.45, 5.9, t));
	const times = hydrationTimes(mode);
	const levels = times.map((at) => (at === null ? 0 : smoothstep(at, at + 0.3, t) * sheetAlpha));

	const ink = 1 + 2.4 * smoothstep(2.5, 2.7, t) * (1 - smoothstep(3.0, 3.6, t));

	let phase = 'alimentando hoja';
	if (t >= 0.7 && t < 1.8) phase = 'a la prensa';
	else if (t >= 1.8 && t < 3.1) phase = 'estampando HTML';
	else if (t >= 3.1 && t < 4.0) phase = 'a hidratación';
	else if (t >= 4.0 && t < 5.9) {
		const due = times.filter((at): at is number => at !== null);
		phase = `hidratando ${due.filter((at) => t >= at + 0.15).length}/${due.length}`;
	} else if (t >= 5.9) phase = 'entregando';

	return { shuttle, sheet, sheetAlpha, platen, printed, head, levels, phase, ink };
}

/** Bloques que acaban con JS en el navegador en cada modo. */
export const shipped = (mode: Mode) => (mode === 'islas' ? ISLANDS : BLOCKS.length);
