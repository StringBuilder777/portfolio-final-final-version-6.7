import type { Flat } from '@/lib/iso/iso-kit';
import type { Route } from './geometry';

export type Operation = 'read' | 'write';
export const CYCLE = 12;
const READ = ['auth', 'request', 'service', 'mysql', 'mysql', 'service', 'request', 'auth'];
const WRITE = ['auth', 'request', 'service', 'php', 'postgres', 'postgres', 'php', 'service', 'request', 'auth'];

export function stateAt(seconds: number, operation: Operation) {
 const route = operation === 'read' ? READ : WRITE;
 const position = ((seconds % CYCLE + CYCLE) % CYCLE) / CYCLE * route.length;
 const index = Math.floor(position);
 const returning = index >= route.length / 2;
 const t = position - index;
 const progress = returning ? 1 - t : t;
 const store = operation === 'read' ? 'MySQL' : 'PostgreSQL';
 const names: Record<string, string> = { auth: 'Supabase · autenticación JWT', request: 'servicio Rust / REST', service: 'servicio Java / Quarkus', php: 'servicio PHP / Laravel', mysql: returning ? 'respuesta MySQL' : 'consulta MySQL', postgres: returning ? 'confirmación PostgreSQL' : 'escritura PostgreSQL' };
 return { route: route[index], progress, returning, store, readout: `Simulación · ${operation === 'read' ? 'lectura' : 'escritura'} · ${names[route[index]]}${returning ? ' · retorno' : ''}` };
}

export function pointAt(route: Route, progress: number): Flat {
 const lengths = route.points.slice(1).map((p, i) => Math.hypot(p[0] - route.points[i][0], p[1] - route.points[i][1]));
 let distance = Math.max(0, Math.min(1, progress)) * lengths.reduce((sum, length) => sum + length, 0);
 for (let i = 0; i < lengths.length; i++) {
  if (distance <= lengths[i] || i === lengths.length - 1) {
   const t = lengths[i] ? distance / lengths[i] : 0;
   const a = route.points[i], b = route.points[i + 1];
   return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  }
  distance -= lengths[i];
 }
 return route.points[0];
}
