## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## Figuras isométricas del Stack (skill Anatomy)

La skill está en `.claude/skills/anatomy` (submódulo git; tras clonar: `git submodule update --init`). El build **no** depende de él (el kit está copiado en `src/lib/iso/`), pero Netlify/Cloudflare Pages intentan clonar submódulos y fallan si el repo de origen desaparece: en ese caso, desactiva el clonado de submódulos en el host. Se hace **una figura por sesión**: `/anatomy` + el `concept` del área en `src/config/site.ts`.

Contrato para que el portafolio siga ligero:

- **Ubicación**: `src/components/figures/<id>/Figure.astro`, con `<id>` ∈ `frontend | backend | redes | ciberseguridad | cloud`. `Stack.astro` la detecta sola con `import.meta.glob` y sustituye el placeholder.
- **Ruta framework-free, no la de React.** Las islas de Astro solo aceptan props serializables, así que el patrón de Anatomy de pasar arte JSX del servidor a un componente `"use client"` no aplica, y además cargaría ~65 KB de runtime de React. En su lugar:
  - Geometría en `.ts` dentro de la carpeta de la figura, usando `@/lib/iso/iso-kit` (copia de `kit/iso-kit.ts`). Se ejecuta **en build**, en el frontmatter de `Figure.astro`, y el SVG se inserta con `set:html`.
  - Movimiento en un `<script>` de Astro (TS nativo, lo empaqueta y difiere Astro). Arranca solo con `IntersectionObserver` y se detiene fuera de pantalla. Respeta `prefers-reduced-motion`. Mira `examples/dial-indicator/build.mjs` de la skill.
  - Estilos: importa `@/lib/iso/iso.css` y **después** `@/lib/iso/theme.css` desde la figura (no globalmente); pon `class="iso"` en el contenedor y limita los tokens propios a la clase de la figura. No edites `iso.css`: es copia literal.
  - Tamaño: el SVG debe llevar `viewBox` y llenar `.figure-slot` (proporción 4/3, fijada en `Stack.astro`) para que no haya saltos de layout.
  - Accesibilidad: el SVG lleva `role="img"` + `<title>`/`aria-label` que describa lo que muestra; la lectura en vivo (readout) en texto real.
- **WebGL** solo donde aporte (brillo, flujo, luz), con `@/lib/iso/gl.mjs` (usa `gl-shared.mjs` solo si necesitas la opción `untransformed` de `glLayer`; nunca los dos). Inicialízalo **perezosamente** con `import()` dinámico cuando la figura sea visible. El `<canvas>` va `position:absolute; inset:0` sobre el SVG y con `aria-hidden="true"`. El SVG tiene que leerse sin WebGL.
- **Tema**: el sitio usa `data-theme="light|dark"` en `<html>`; la figura debe verse bien en ambos.
- **Presupuesto**: la carga inicial de la página no debe crecer. Nada de JS de figuras en el primer pintado.
- **Verificación**: además de `pnpm build`, usa los scripts de la skill (`scripts/capture.mjs`, `--audit`) sobre `pnpm preview`.
- **Verifica con la primera figura** que el CSS de `iso.css` aparece en `dist/` (componentes cargados vía `import.meta.glob`).
- **Licencia**: el kit copiado en `src/lib/iso/` es MIT (ver `src/lib/iso/LICENSE`). Cuando se envíe código del kit al navegador (p. ej. `gl.mjs`), publica el aviso en `public/licenses/anatomy.txt` y enlázalo desde el footer.
- Si actualizas el submódulo, vuelve a copiar `iso-kit.ts`, `iso.css`, `gl.mjs` y `gl-shared.mjs`, y regenera los tokens de `theme.css`.
