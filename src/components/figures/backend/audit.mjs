// Verificación opcional: necesita el submódulo Anatomy, nunca participa en el build del sitio.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
import * as A from '../../../../.claude/skills/anatomy/kit/audit.mjs';

const core = new URL('../../../../.claude/skills/anatomy/kit/iso-kit.mjs', import.meta.url).href;
const source = readFileSync(new URL('./geometry.ts', import.meta.url), 'utf8')
 .replaceAll("'@/lib/iso/iso-kit'", JSON.stringify(core))
 .replace("import order from './order.json';", 'const order: string[] = [];');
const compiled = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } }).outputText;
const { scene, P } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
const { parts } = scene();
const recorder = A.recorder(P);
for (const part of parts) {
 const s = part.shape;
 const meta = { name: part.name, owner: part.owner, ground: part.name.startsWith('stand.') };
 const shape = s.kind === 'slab' ? A.slab(s.plan, s.z, s.h, meta, 5) : A.cylinder(s.x, s.y, s.r, s.z, s.h, meta);
 recorder.solids.push(shape);
 recorder.put({ name: part.name, at: part.at, svg: part.svg, shapes: [shape] });
}
A.settle(recorder, P);
const result = A.auditOrExit(recorder, P);
if (result && !A.failures(result)) {
 const names = [...recorder.items].sort((a, b) => a.key - b.key).map(item => item.name);
 const output = new URL('./order.json', import.meta.url);
 writeFileSync(output, JSON.stringify(names, null, 2) + '\n');
 console.log(`Orden de ${names.length} piezas guardado en ${fileURLToPath(output)}`);
}
