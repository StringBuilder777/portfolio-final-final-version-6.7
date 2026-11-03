import { BELT_Z, DROP_X, PERIOD, RELEASE, STILL_T, TOY_Y, mascotAt, stateAt, type Mascot } from './model';
type Vec = [number, number];
interface ProjectionData { origin: Vec; axes: [Vec, Vec, Vec] }

export function mount(root: HTMLElement) {
 const data: ProjectionData = JSON.parse(root.dataset.systems ?? '{}');
 const product = root.querySelector<SVGGElement>('[data-sy-product]');
 const materials = root.querySelector<SVGGElement>('[data-sy-materials]');
 const press = root.querySelector<SVGGElement>('[data-sy-press]');
 const rod = root.querySelector<SVGPathElement>('[data-sy-rod]');
 const heat = root.querySelector<SVGGElement>('[data-sy-heat]');
 const steam = root.querySelector<SVGGElement>('[data-sy-steam]');
 const flames = [...root.querySelectorAll<SVGPathElement>('[data-sy-flame]')];
 const tread = root.querySelector<SVGGElement>('[data-sy-tread]');
 const outputs = [...root.querySelectorAll<SVGGElement>('[data-sy-output]')];
 const readout = root.querySelector<HTMLOutputElement>('[data-sy-readout]');
 const hint = root.querySelector<HTMLElement>('[data-sy-hint]');
 const button = root.querySelector<HTMLButtonElement>('.sy-hit');
 const reduced = matchMedia('(prefers-reduced-motion: reduce)');
 let seconds = STILL_T, frame = 0, last = 0, visible = false, paused = false;
 const vector = (x: number, y: number, z: number): Vec => [data.axes[0][0] * x + data.axes[1][0] * y + data.axes[2][0] * z, data.axes[0][1] * x + data.axes[1][1] * y + data.axes[2][1] * z];
 const move = (element: Element | null, x: number, y: number, z: number) => { const [u, v] = vector(x, y, z); element?.setAttribute('transform', `translate(${u} ${v})`); };
 function showMascot(element: Element | null, mascot: Mascot) {
  for (const toy of element?.querySelectorAll<SVGGElement>('[data-mascot]') ?? []) toy.setAttribute('visibility', toy.dataset.mascot === mascot ? 'visible' : 'hidden');
 }
 function draw() {
  const state = stateAt(seconds);
  move(materials, state.materialX, TOY_Y, state.materialZ);
  materials?.setAttribute('opacity', String(state.materialOpacity));
  move(press, 0, 0, state.pressZ);
  const from = vector(DROP_X, TOY_Y, state.pressZ + 5), to = vector(DROP_X, TOY_Y, 115);
  rod?.setAttribute('d', `M${data.origin[0] + from[0]} ${data.origin[1] + from[1]}L${data.origin[0] + to[0]} ${data.origin[1] + to[1]}`);
  heat?.setAttribute('opacity', String(state.heat));
  steam?.setAttribute('opacity', String(state.steam));
  for (const flame of flames) {
   const seed = Number(flame.dataset.syFlame);
   const sway = Math.sin(seconds * 3.2 + seed * 1.8) * 3;
   const h = 25 + Math.sin(seconds * 2.7 + seed) * 4;
   flame.setAttribute('d', `M-6 0Q-11 -10 ${sway} ${-h}Q${sway - 2} -16 6 -12Q12 -2 6 0Z`);
  }
  if (product) product.style.display = state.productVisible ? '' : 'none';
  product?.setAttribute('opacity', String(state.productOpacity));
  showMascot(product, state.mascot);
  move(tread, state.beltOffset, 0, 0);
  for (const [i, slot] of outputs.entries()) {
   const toy = state.toys[i];
   slot.style.display = toy ? '' : 'none';
   if (!toy) continue;
   slot.setAttribute('opacity', String(toy.opacity));
   slot.dataset.index = String(toy.index); slot.dataset.kind = toy.mascot;
   move(slot, toy.x, TOY_Y, BELT_Z);
   showMascot(slot, toy.mascot);
  }
  root.dataset.delivered = String(state.delivered);
  root.dataset.lastMascot = state.delivered ? mascotAt(state.delivered - 1) : '';
  if (readout && readout.textContent !== state.readout) readout.textContent = state.readout;
 }
 function tick(now: number) {
  if (last) seconds += Math.min((now - last) / 1000, 0.05);
  last = now; draw(); frame = requestAnimationFrame(tick);
 }
 function run() {
  cancelAnimationFrame(frame); frame = 0; last = 0;
  const play = visible && !document.hidden && !paused && !reduced.matches;
  root.dataset.playing = String(play);
  button?.setAttribute('aria-label', reduced.matches ? 'Sacar el siguiente peluche' : paused ? 'Continuar fábrica de peluches' : 'Pausar fábrica de peluches');
  if (reduced.matches) button?.removeAttribute('aria-pressed');
  else button?.setAttribute('aria-pressed', String(paused));
  if (hint) hint.textContent = reduced.matches ? 'Clic: sacar el siguiente peluche' : 'Clic: pausar / continuar';
  draw(); if (play) frame = requestAnimationFrame(tick);
 }
 const observer = new IntersectionObserver(entries => { visible = entries[entries.length - 1].isIntersecting; run(); });
 observer.observe(root);
 document.addEventListener('visibilitychange', run);
 reduced.addEventListener('change', run);
 button?.addEventListener('click', () => {
  if (reduced.matches) seconds = stateAt(seconds).delivered * PERIOD + RELEASE + 2;
  else paused = !paused;
  run();
 });
 root.querySelector<HTMLButtonElement>('.sy-reset')?.addEventListener('click', () => { seconds = 0; paused = false; run(); });
 run(); root.dataset.ready = 'true';
}
