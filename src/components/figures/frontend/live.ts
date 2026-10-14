// Movimiento de la imprenta de islas. Lo carga el <script> de Figure.astro con import() dinámico
// solo cuando la figura entra en pantalla, así que no pesa en el primer pintado.
import type { LiveData } from './geometry';
import { streaks } from './disc';
import { BLOCKS, CYCLE, STILL_T, logoOf, poseAt, shipped, type Mode, type Pose } from './model';

// uLevel/uBox se envían como arrays: glLayer solo usa uniform1fv/4fv cuando el array tiene más de 4 valores,
// así que BLOCKS debe tener al menos 5 bloques.
const FRAGMENT = `
uniform vec3 uSheet;
uniform float uLevel[${BLOCKS.length}];
uniform vec4 uBox[${BLOCKS.length}];
uniform vec2 uHalf;
uniform float uLight;
float sdBox(vec2 p,vec2 b,float r){vec2 q=abs(p)-b+r;return length(max(q,0.))+min(max(q.x,q.y),0.)-r;}
void main(){
  vec2 vb=viewOf(gl_FragCoord.xy);
  vec3 p=onFloor(vb,uSheet.z);
  vec2 l=p.xy-uSheet.xy;
  float px=pixelOf()/uCam.z;
  float onSheet=1.-smoothstep(-2.6,-.5,sdBox(l,uHalf,.6));
  float core=0.;float rim=0.;float halo=0.;
  for(int i=0;i<${BLOCKS.length};i++){
    float lv=uLevel[i];
    float d=sdBox(l-uBox[i].xy,uBox[i].zw,.5);
    float inside=1.-smoothstep(-.3-.7*px,-.3+.7*px,d);
    core+=lv*inside;
    rim+=lv*inside*smoothstep(-1.6,-.3,d);
    halo+=lv*exp(-max(d,0.)/2.2);
  }
  core=min(core,1.);rim=min(rim,1.);
  halo=min(halo,1.3)*onSheet*(1.-core);
  vec3 cyan=vec3(.38,.85,.98);
  vec3 glow=cyan*(core*(.06+.55*rim)+halo*.5);
  vec3 col=tonemap(glow,1.3);
  float a=max(col.r,max(col.g,col.b));
  vec4 dark=vec4(col,a);
  float aCore=core*(.04+.4*rim);
  float aHalo=halo*.3;
  vec3 seenCore=mix(vec3(.88,.98,1.),vec3(.04,.6,.8),rim);
  vec3 ink=seenCore*aCore+vec3(.56,.88,.97)*aHalo*(1.-aCore);
  vec4 light=vec4(ink,aCore+aHalo*(1.-aCore));
  vec4 o=mix(dark,light,uLight);
  float n=(hash12(gl_FragCoord.xy+fract(uTime*.61)*91.)+hash12(gl_FragCoord.yx*1.37+fract(uTime*.37)*57.)-1.)/255.;
  o+=vec4(n)*smoothstep(0.,1.5/255.,o.a);
  gl_FragColor=max(o,0.);
}`;

const isLight = () => {
	const theme = document.documentElement.dataset.theme;
	return theme ? theme === 'light' : matchMedia('(prefers-color-scheme: light)').matches;
};

export function mount(root: HTMLElement) {
	const data = JSON.parse(root.dataset.live ?? '{}') as LiveData;
	const stage = root.querySelector<HTMLElement>('.fe-stage');
	const button = root.querySelector<HTMLButtonElement>('.fe-hit');
	const canvas = root.querySelector<HTMLCanvasElement>('.fe-gl');
	const readout = root.querySelector<HTMLElement>('[data-readout]');
	const part = (name: string) => root.querySelector<SVGGraphicsElement>(`[data-part="${name}"]`);
	const shuttle = part('shuttle');
	const sheet = part('sheet');
	const print = part('print');
	const platen = part('platen');
	const head = part('head');
	const ink = part('streaks');
	const leds = part('leds');
	const bundleLed = part('bundle-led');
	const glowPaths = [...root.querySelectorAll<SVGGraphicsElement>('[data-part="print"] [data-i]')];
	if (!stage || !shuttle || !sheet || !print || !platen || !head) return;

	const still = matchMedia('(prefers-reduced-motion: reduce)');
	const { ex, ez } = data;
	const move = (dx: number, dz: number) => `translate(${(ex[0] * dx + ez[0] * dz).toFixed(2)} ${(ex[1] * dx + ez[1] * dz).toFixed(2)})`;

	let mode: Mode = 'islas';
	let clock = STILL_T;
	let turn = 0;
	const levels = poseAt(STILL_T, mode).levels.slice();
	let frame = 0;
	let last = 0;
	let visible = false;

	let layer: import('@/lib/iso/gl.mjs').GlLayer | null = null;
	let glowing = false;

	function draw(pose: Pose) {
		shuttle!.setAttribute('transform', move(pose.shuttle, 0));
		sheet!.setAttribute('transform', move(pose.sheet, 0));
		sheet!.style.opacity = pose.sheetAlpha.toFixed(3);
		print!.style.opacity = pose.printed.toFixed(3);
		platen!.setAttribute('transform', move(0, -pose.platen * data.platenTravel));
		head!.setAttribute('transform', move(0, -pose.head * data.headTravel));
		ink?.setAttribute('d', streaks(turn, data.P));
		if (leds) leds.style.opacity = (0.15 + 0.85 * pose.head).toFixed(3);
		if (bundleLed) bundleLed.style.opacity = (0.35 + 0.65 * pose.head).toFixed(3);
		for (const path of glowPaths) path.style.opacity = levels[Number(path.dataset.i)].toFixed(3);

		// La hoja del ciclo actual lleva su logo; la pila de salida muestra el último entregado.
		const now = still.matches ? STILL_T : clock;
		const cycle = Math.floor(now / CYCLE);
		const logo = logoOf(cycle);
		root.dataset.sheet = logo.id;
		root.dataset.tray = (now % CYCLE >= 7.35 ? logo : logoOf(cycle - 1)).id;
		const text = `${logo.name} · ${pose.phase} · JS en ${shipped(mode)}/${BLOCKS.length} bloques`;
		if (readout && readout.textContent !== text) readout.textContent = text;

		if (layer) {
			if (Math.max(...levels) > 1e-3) {
				layer.draw({ uSheet: [pose.sheet, 0, data.sheetZ], uLevel: levels }, still.matches ? 0.8 : clock);
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
		const pose = poseAt(clock, mode);
		turn += dt * 0.55 * pose.ink;
		const follow = 1 - Math.exp(-dt / 0.1);
		pose.levels.forEach((target, i) => (levels[i] += (target - levels[i]) * follow));
		draw(pose);
		frame = visible ? requestAnimationFrame(tick) : 0;
	}

	const pose = () => poseAt(still.matches ? STILL_T : clock, mode);
	const run = () => {
		if (still.matches) {
			if (frame) cancelAnimationFrame(frame);
			frame = 0;
			const rest = pose();
			rest.levels.forEach((target, i) => (levels[i] = target));
			draw(rest);
			return;
		}
		if (!frame && visible) {
			last = 0;
			frame = requestAnimationFrame(tick);
		}
	};

	if (button) {
		button.hidden = false;
		button.addEventListener('click', () => {
			mode = mode === 'islas' ? 'spa' : 'islas';
			button.setAttribute('aria-pressed', String(mode === 'spa'));
			root.dataset.mode = mode;
			run();
		});
		// Una tecla mantenida no debe alternar el modo a ráfagas.
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

	if (canvas) {
		import('@/lib/iso/gl.mjs').then(({ glLayer, glCamera }) => {
			layer = glLayer({
				canvas,
				fragment: FRAGMENT,
				view: [data.W, data.H],
				camera: glCamera({ ...data.P, origin: [data.P.origin[0], data.P.origin[1]] }),
				uniforms: ['uSheet', 'uLevel', 'uLight'],
				fixed: {
					uBox: BLOCKS.flatMap((block) => [block.x + block.w / 2, block.y + block.d / 2, block.w / 2, block.d / 2]),
					uHalf: [22, 17],
					uLight: isLight() ? 1 : 0,
				},
			});
			if (!layer) return;
			root.setAttribute('data-gl', '');
			const redraw = () => {
				if (!frame) draw(pose());
			};
			new MutationObserver(() => {
				layer?.set({ uLight: isLight() ? 1 : 0 });
				redraw();
			}).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
			addEventListener('resize', redraw);
			redraw();
		});
	}
	run();
}
