# Portafolio

Portafolio de desarrollador hecho con [Astro](https://astro.build) + TypeScript (strict), con soporte para islas de React.

## Por qué es ligero

- **HTML estático**: `output: 'static'`, sin servidor; se despliega en cualquier CDN.
- **Cero JS por defecto**: solo se envía el JS de los componentes que lo necesitan. El botón de tema es un script nativo de menos de 1 KB.
- **React bajo demanda**: la integración está instalada, pero el runtime (~65 KB gzip) solo se descarga en páginas con una isla `client:*`. Úsala solo cuando la interactividad lo justifique.
- **Fuentes del sistema**: no se descargan fuentes web.
- **CSS crítico en línea** (comportamiento por defecto de Astro). El prefetch está desactivado mientras haya una sola página (ver `astro.config.ts`).
- **SEO**: meta tags, Open Graph, URL canónica, `sitemap-index.xml` y `robots.txt`.

## Estructura

```
src/
├── config/site.ts      # Datos del portafolio (nombre, proyectos, enlaces…)
├── layouts/BaseLayout.astro
├── components/         # Secciones: Header, Hero, Stack, Projects, About, Contact, Footer
│   └── figures/<id>/   # Figuras isométricas del Stack (una por área, ver AGENTS.md)
├── lib/iso/            # Kit de la skill Anatomy (MIT) + puente de tema
├── pages/              # index.astro, 404.astro
└── styles/global.css   # Variables de tema claro/oscuro
```

## Comandos

| Comando        | Acción                                          |
| -------------- | ----------------------------------------------- |
| `pnpm install` | Instala dependencias                            |
| `pnpm dev`     | Servidor de desarrollo en `localhost:4321`      |
| `pnpm check`   | Verificación de tipos (`astro check`)           |
| `pnpm build`   | Verifica tipos y genera el sitio en `./dist/`   |
| `pnpm preview` | Sirve el build localmente                       |

## Antes de publicar

- Cambia `site` en `astro.config.ts` y la URL de `public/robots.txt` por tu dominio.
- Edita tu contenido en `src/config/site.ts`.

## Añadir una isla de React

```astro
---
import Contador from '@/components/Contador.tsx';
---
<Contador client:visible />  <!-- hidrata solo al entrar en pantalla -->
```
