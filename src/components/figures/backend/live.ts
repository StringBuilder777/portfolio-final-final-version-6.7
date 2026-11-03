import { pointAt, stateAt, type Operation } from './model';
import type { Route } from './geometry';

export function mount(root: HTMLElement) {
 const routes: Route[] = JSON.parse(root.dataset.routes ?? '[]');
 const packets = [...root.querySelectorAll<SVGCircleElement>('[data-packet]')];
 const fans = [...root.querySelectorAll<SVGGElement>('[data-fan]')];
 const leds = [...root.querySelectorAll<SVGCircleElement>('[data-led], [data-store-led]')];
 const readout = root.querySelector<HTMLElement>('[data-backend-readout]');
 const button = root.querySelector<HTMLButtonElement>('.be-hit');
 const reduced = matchMedia('(prefers-reduced-motion: reduce)');
 let operation: Operation = 'read';
 let seconds = 0, last = 0, frame = 0, visible = false;
 function draw() {
  const state = stateAt(seconds, operation);
  for (const packet of packets) {
   const active = packet.dataset.packet === state.route;
   packet.setAttribute('opacity', active ? '1' : '0');
   if (!active) continue;
   const route = routes.find(route => route.name === state.route);
   if (!route) continue;
   const [x, y] = pointAt(route, state.progress);
   packet.setAttribute('cx', String(x)); packet.setAttribute('cy', String(y));
  }
  for (const fan of fans) fan.setAttribute('transform', `rotate(${reduced.matches ? 0 : seconds * 35})`);
  for (const led of leds) led.style.opacity = String(reduced.matches ? 0.7 : 0.55 + 0.35 * Math.sin(seconds * 2.3) ** 2);
  if (readout && readout.textContent !== state.readout) readout.textContent = state.readout;
 }
 function tick(now: number) {
  if (last) seconds += Math.min((now - last) / 1000, 0.05);
  last = now; draw();
  frame = requestAnimationFrame(tick);
 }
 function run() {
  cancelAnimationFrame(frame); frame = 0; last = 0;
  if (visible && !document.hidden && !reduced.matches) frame = requestAnimationFrame(tick);
  else draw();
 }
 const observer = new IntersectionObserver(entries => { visible = entries[entries.length - 1].isIntersecting; run(); });
 observer.observe(root);
 reduced.addEventListener('change', run);
 document.addEventListener('visibilitychange', run);
 button?.addEventListener('click', () => {
  operation = operation === 'read' ? 'write' : 'read'; seconds = 0; last = 0;
  root.dataset.operation = operation;
  button.setAttribute('aria-pressed', String(operation === 'write'));
  button.setAttribute('aria-label', `Simulación: cambiar de ${operation === 'read' ? 'lectura a escritura' : 'escritura a lectura'}`);
  draw();
 });
 draw();
 root.dataset.ready = 'true';
}
