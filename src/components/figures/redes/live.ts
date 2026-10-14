// Movimiento del rack. Lo carga el <script> de Figure.astro con import() dinámico solo cuando
// la figura entra en pantalla, así que no pesa en el primer pintado.
import type { LiveData } from './geometry';
import { IDLE, SPACING, STILL_T, flightsAt, readoutAt, type Flight, type Mode } from './model';
import { activeLeds, ledOn, packetPose } from './track';

const SLOTS = 6;

// uPos/uCol van como arrays de vec4 (24 valores): glLayer usa uniform4fv para arrays de más de 4.
const FRAGMENT = `
uniform vec4 uPos[${SLOTS}];
uniform vec4 uCol[${SLOTS}];
uniform float uR;
uniform float uLight;
void main(){
  vec2 vb=viewOf(gl_FragCoord.xy);
  vec3 glow=vec3(0.);float body=0.;
  for(int i=0;i<${SLOTS};i++){
    vec4 p=uPos[i];
    float d=length(vb-p.xy)/uR;
    float halo=p.z*exp(-d*d*.09);
    float core=p.z*exp(-d*d*.9);
    glow+=uCol[i].rgb*(halo*.55+core*.9);
    body+=halo*.55+core*.9;
  }
  vec3 col=tonemap(glow,1.4);
  vec4 dark=vec4(col,max(col.r,max(col.g,col.b)));
  float a=clamp(body*.4,0.,.55);
  vec3 ink=glow/max(body,1e-3);
  vec4 light=vec4(ink*a,a);
  vec4 o=mix(dark,light,uLight);
  float n=(hash12(gl_FragCoord.xy+fract(uTime*.61)*91.)+hash12(gl_FragCoord.yx*1.37+fract(uTime*.37)*57.)-1.)/255.;
  o+=vec4(n)*smoothstep(0.,1.5/255.,o.a);
  gl_FragColor=max(o,0.);
}`;

type Rgb = [number, number, number];

/** Color de cada estado del paquete (Code en track.ts), en tema oscuro y claro. Igual que --rd-pk-* en Figure.astro. */
const PALETTE: Record<'dark' | 'light', Rgb[]> = {
	dark: [
		[1, 0.86, 0.6],
		[1, 0.72, 0.28],
		[1, 0.3, 0.25],
		[0.42, 1, 0.64],
		[0.6, 0.6, 0.62],
		[1, 0.48, 0.22],
	],
	light: [
		[0.78, 0.55, 0.1],
		[0.85, 0.5, 0.05],
		[0.85, 0.15, 0.15],
		[0.1, 0.6, 0.32],
		[0.45, 0.45, 0.48],
		[0.88, 0.35, 0.08],
	],
};

const isLight = () => {
	const theme = document.documentElement.dataset.theme;
	return theme ? theme === 'light' : matchMedia('(prefers-color-scheme: light)').matches;
};

interface Slot {
	el: SVGGElement;
	cores: SVGCircleElement[];
	n: number;
	rgb: Rgb;
	x: number;
	y: number;
	a: number;
}

export function mount(root: HTMLElement) {
	const data = JSON.parse(root.dataset.live ?? '{}') as LiveData;
	const stage = root.querySelector<HTMLElement>('.rd-stage');
	const button = root.querySelector<HTMLButtonElement>('.rd-hit');
	const canvas = root.querySelector<HTMLCanvasElement>('.rd-gl');
	const readout = root.querySelector<HTMLElement>('[data-readout]');
	const slots: Slot[] = [...root.querySelectorAll<SVGGElement>('[data-pk]')].map((el) => ({ el, cores: [...el.querySelectorAll('circle')], n: -1, rgb: [1, 1, 1], x: 0, y: 0, a: 0 }));
	const pressed = () => button?.setAttribute('aria-pressed', String(mode === 'acl'));
	// Mismo índice que en el build (orden en el documento) para que el parpadeo de fondo coincida.
	const leds = [...root.querySelectorAll<SVGElement>('[data-led]')].map((el, index) => ({ el, key: el.dataset.led!, kind: el.dataset.k ?? 'link', index, on: el.hasAttribute('data-on') }));
	if (!stage || slots.length < SLOTS) return;

	const still = matchMedia('(prefers-reduced-motion: reduce)');
	let mode: Mode = 'acl';
	// Cada paquete conserva el modo con que salió: alternar la ACL no hace saltar a los que ya viajan.
	const launched = new Map<number, Mode>();
	const modeOf = (n: number) => {
		if (!launched.has(n)) launched.set(n, mode);
		return launched.get(n)!;
	};
	let clock = STILL_T;
	let frame = 0;
	let last = 0;
	let visible = false;
	let theme: 'dark' | 'light' = isLight() ? 'light' : 'dark';
	let layer: import('@/lib/iso/gl.mjs').GlLayer | null = null;
	let glowing = false;
	const pos = new Float32Array(SLOTS * 4);
	const col = new Float32Array(SLOTS * 4);

	function draw(time: number, flights: Flight[], dt: number) {
		// El color cambia por fundido (≈0,12 s), nunca de golpe, al pasar de un estado a otro.
		const follow = dt > 0 ? 1 - Math.exp(-dt / 0.12) : 1;
		const seen = new Set<number>();
		for (const f of flights) {
			const index = ((f.n % SLOTS) + SLOTS) % SLOTS;
			const slot = slots[index];
			const pose = packetPose(f, data);
			const target = PALETTE[theme][pose.code];
			slot.rgb = slot.n !== f.n ? [...target] : (slot.rgb.map((c, i) => c + (target[i] - c) * follow) as Rgb);
			Object.assign(slot, { n: f.n, x: pose.x, y: pose.y, a: pose.a });
			seen.add(index);
		}
		slots.forEach((slot, i) => {
			if (!seen.has(i)) slot.a = 0;
			slot.el.setAttribute('transform', `translate(${slot.x.toFixed(2)} ${slot.y.toFixed(2)})`);
			slot.el.style.opacity = slot.a.toFixed(3);
			const fill = `rgb(${slot.rgb.map((c) => Math.round(c * 255)).join(' ')})`;
			for (const core of slot.cores) core.style.fill = fill;
			pos.set([slot.x, slot.y, slot.a, 0], i * 4);
			col.set([...slot.rgb, 0], i * 4);
		});

		const active = activeLeds(flights);
		for (const led of leds) {
			const on = ledOn(led.key, led.kind, active, time, led.index, dt > 0);
			if (on !== led.on) {
				led.on = on;
				led.el.toggleAttribute('data-on', on);
			}
		}

		// Entre paquetes se queda la última decisión en vez de parpadear a «esperando tráfico».
		const text = readoutAt(flights);
		if (readout && readout.textContent !== text && (text !== IDLE || !readout.textContent)) readout.textContent = text;

		if (layer) {
			if (slots.some((slot) => slot.a > 1e-3)) {
				layer.draw({ uPos: pos, uCol: col }, time);
				glowing = true;
			} else if (glowing) {
				layer.clear();
				glowing = false;
			}
		}
	}

	function tick(now: number) {
		const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
		last = now;
		clock += dt;
		for (const n of launched.keys()) if (n < clock / SPACING - 12) launched.delete(n);
		draw(clock, flightsAt(clock, modeOf), dt);
		frame = visible ? requestAnimationFrame(tick) : 0;
	}

	const stillFrame = () => draw(STILL_T, flightsAt(STILL_T, () => mode), 0);
	const run = () => {
		if (still.matches) {
			if (frame) cancelAnimationFrame(frame);
			frame = 0;
			stillFrame();
			return;
		}
		if (!frame && visible) {
			last = 0;
			frame = requestAnimationFrame(tick);
		}
	};
	const redraw = () => {
		if (frame) return;
		if (still.matches) stillFrame();
		else draw(clock, flightsAt(clock, modeOf), 0);
	};

	if (button) {
		button.hidden = false;
		button.addEventListener('click', () => {
			mode = mode === 'acl' ? 'abierto' : 'acl';
			pressed();
			root.dataset.mode = mode;
			run();
		});
		// Una tecla mantenida no debe alternar la ACL a ráfagas.
		button.addEventListener('keydown', (event) => {
			if (event.repeat) event.preventDefault();
		});
	}

	new IntersectionObserver(
		(entries) => {
			visible = entries[entries.length - 1].isIntersecting;
			if (visible) run();
			else if (frame) {
				cancelAnimationFrame(frame);
				frame = 0;
			}
		},
		{ rootMargin: '120px 0px' },
	).observe(stage);
	still.addEventListener('change', run);
	new MutationObserver(() => {
		theme = isLight() ? 'light' : 'dark';
		layer?.set({ uLight: theme === 'light' ? 1 : 0 });
		redraw();
	}).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

	if (canvas) {
		import('@/lib/iso/gl.mjs').then(({ glLayer, glCamera }) => {
			layer = glLayer({
				canvas,
				fragment: FRAGMENT,
				view: [data.W, data.H],
				camera: glCamera({ ...data.P, origin: [data.P.origin[0], data.P.origin[1]] }),
				uniforms: ['uPos', 'uCol', 'uLight'],
				fixed: { uR: data.pk * 1.6, uLight: theme === 'light' ? 1 : 0 },
			});
			if (!layer) return;
			root.setAttribute('data-gl', '');
			addEventListener('resize', redraw);
			redraw();
		});
	}
	run();
}
