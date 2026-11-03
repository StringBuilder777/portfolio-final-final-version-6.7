// Auditoría opcional de la estructura fija. No participa en el build.
// La cinemática de la prensa y la banda se comprueba por separado contra el modelo puro.
import { readFileSync, writeFileSync } from 'node:fs';
import ts from 'typescript';
import * as A from '../../../../.claude/skills/anatomy/kit/audit.mjs';

const compile = source => 'data:text/javascript;base64,' + Buffer.from(ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } }).outputText).toString('base64');
const modelUrl = compile(readFileSync(new URL('./model.ts', import.meta.url), 'utf8'));
const core = new URL('../../../../.claude/skills/anatomy/kit/iso-kit.mjs', import.meta.url).href;
const source = readFileSync(new URL('./geometry.ts', import.meta.url), 'utf8')
 .replaceAll("'@/lib/iso/iso-kit'", JSON.stringify(core))
 .replaceAll("'./model'", JSON.stringify(modelUrl))
 .replace("import order from './order.json';", 'const order: string[] = [];');
const { scene, P } = await import(compile(source));
const { parts } = scene();
const R = A.recorder(P);
for (const part of parts.filter(part => part.layer === 'back' || part.layer === 'front')) {
 const s = part.shape;
 const meta = { name: part.name, owner: part.owner, ground: part.name.startsWith('stand.') };
 const shape = s.kind === 'slab' ? A.slab(s.plan, s.z, s.h, meta, 5)
  : s.kind === 'cylinder' ? A.cylinder(s.x, s.y, s.r, s.z, s.h, meta)
  : A.prism({ o: [s.x, s.y, s.z], a: [0, 1, 0], u: [1, 0, 0], v: [0, 0, 1] }, s.ring, -s.depth / 2, s.depth / 2, meta);
 R.solids.push(shape);
 R.put({ name: part.name, at: part.at, svg: part.svg, shapes: [shape] });
}
A.settle(R, P);
const result = A.auditOrExit(R, P);
if (result && !A.failures(result)) {
 const names = [...R.items].sort((a, b) => a.key - b.key).map(item => item.name);
 writeFileSync(new URL('./order.json', import.meta.url), JSON.stringify(names, null, 2) + '\n');
 console.log(`Orden guardado: ${names.length} piezas fijas. La auditoría no certifica todas las fases móviles.`);
}
const { stateAt, mascotAt, PERIOD, RELEASE, DROP_X, BELT_END } = await import(modelUrl);
for (let n = 0; n < 60; n++) {
 if (mascotAt(n) !== (n === 1 ? 'macos' : 'linux')) throw Error('Secuencia incorrecta');
 const t = n * PERIOD + RELEASE;
 const before = stateAt(t - 1e-6), after = stateAt(t + 1e-6);
 if (before.delivered !== n || after.delivered !== n + 1) throw Error('Entrega fuera de fase');
 if (!before.productVisible || before.productOpacity < 0.999 || Math.abs(DROP_X - after.toys.at(-1).x) > 0.001) throw Error('Salto al entregar');
}
for (let t = 0; t <= PERIOD * 5; t += 1 / 60) {
 const s = stateAt(t);
 if (s.pressZ < 85.49 || s.pressZ > 104.01 || s.materialZ < 95.99 || s.materialZ > 232.01) throw Error('Prensa o piezas fuera del recorrido');
 if (s.toys.some(toy => toy.x < DROP_X - 0.001 || toy.x > BELT_END + 20.001)) throw Error('Premio fuera de cinta');
}
console.log('Modelo: 60 entregas Linux/macOS/Linux y continuidad de fabricación/banda correctas.');
