# Estado y continuidad del portafolio

Actualizado: 2026-11-02 (America/Monterrey).

## Antes de la siguiente actualización

Leer este archivo, `AGENTS.md` y `docs/certificaciones-y-deploy.md`. Revisar `git status` antes de editar: esta nota describe el estado de esta entrega, no garantiza que el checkout siga igual.

## Decisiones del usuario

- Mantener Astro estático y TypeScript estricto. Hacer cambios mínimos y ejecutar los tests y el build antes de terminar.
- Los diagramas aparecen en Inicio y también en `/stack/`. Al pulsarlos, se amplían hacia una ventana grande, centrada en la pantalla incluso después de hacer scroll.
- Conservar los diagramas SVG originales. El usuario descartó el visor 3D separado y el giro de la imagen plana. No reintroducirlos sin una nueva solicitud.
- Al pulsar Cisco IOS o Packet Tracer, los equipos se extraen y regresan suavemente dentro del mismo diagrama. No abrir otra ventana, cambiar títulos, sustituir la vista ni mover su distribución. Pulsar de nuevo revierte la animación.
- Fondo de Frontend: `earthrise`. Fondo de Redes: `edge-orbit`. Se cargan solo al abrir la ventana, se destruyen al cerrar y respetan movimiento reducido.
- Publicar en **Vercel**, no Cloudflare. Supabase gestiona acceso, datos y archivos de certificaciones. Prioridad: planes gratuitos y revisar sus límites al configurar.
- Usar la identidad de Git ya configurada. Solo hacer commit o push si se solicita; no se ha pedido push en esta entrega.

## Implementado y archivos clave

| Área | Estado y ubicación |
| --- | --- |
| Navegación | Portada breve y rutas `/stack/`, `/proyectos/`, `/certificaciones/`, `/sobre-mi/`, `/contacto/` |
| Ventanas del Stack | `src/components/Stack.astro`: posición fija, scroll interno, retorno de foco sin desplazar la página y ampliación animada |
| Frontend | Figura en `src/components/figures/frontend/`, imprenta de islas con su simulación original |
| Redes | Figura en `src/components/figures/redes/`, rack con ACL, VLAN, paquetes y detalle Cisco en el mismo SVG |
| Fondos ASCII | Montaje bajo demanda en `Stack.astro`; earthrise del paquete `ascii.rest` |
| Edge orbit | `src/lib/ascii/edge-orbit.ts`: copia MIT del repositorio oficial bas3line/ascii; la versión instalada 0.4.0 no la incluye. Solo se adaptó el import de tipos |
| Licencias | `public/licenses/ascii-rest.txt` y `public/licenses/anatomy.txt` |
| Administración | `/admin/`, `src/scripts/certifications-admin.ts`, `src/lib/certifications/client.ts` |
| Base de datos | `supabase/migrations/202611020001_certifications.sql`: certificaciones, miembros admin, RLS y bucket privado |
| Deploy | `vercel.json`, Astro estático, comando `pnpm build`, salida `dist` |
| Pruebas | `tests/portfolio.spec.ts`, `playwright.config.ts`, build aislado `.test-dist` con servicio simulado |

## Módulos y trabajo pendiente

1. **Backend**: falta su figura. Concepto y tecnologías en `src/config/site.ts`; crear `src/components/figures/backend/Figure.astro` siguiendo `AGENTS.md`.
2. **Ciberseguridad**: falta su figura, misma estructura con id `ciberseguridad`.
3. **Cloud**: falta su figura, misma estructura con id `cloud`.
4. Hacer una figura por sesión, framework-free, con el kit Anatomy existente. No crear figuras adicionales ni fondos para otras áreas por iniciativa propia. Mantener carga diferida y temas claro/oscuro.
5. **Supabase real**: conectar proyecto Free, ejecutar migración, crear usuario admin, deshabilitar registro público y asignar membresía desde SQL Editor. Completar `.env` con URL y clave publishable; nunca service_role/secret en variables públicas.
6. Validar permisos reales: visitantes y usuarios sin membresía no pueden escribir ni leer borradores o archivos privados; admin puede crear, editar, publicar y eliminar. Las pruebas actuales usan respuestas simuladas y no prueban RLS remoto.
7. **Vercel real**: conectar cuenta y repositorio, configurar variables públicas para producción/preview, dominio y despliegue. No se han creado recursos remotos ni publicado el sitio en esta sesión.
8. Cambiar `https://example.com` en `astro.config.ts` y `public/robots.txt` por el dominio real. Revisar contenido de ejemplo en `src/config/site.ts` (correo, proyectos y enlaces) con datos del usuario antes de publicar.

## Verificación y problemas que no deben reaparecer

- `pnpm build`: verificación de Astro/TypeScript y generación estática.
- `pnpm test`: pruebas Chromium de navegación, administración simulada, limpieza de archivos, diagramas, fondos y scroll de ventanas en escritorio/móvil.
- Última ejecución antes de documentar: build sin errores/advertencias y 8 pruebas aprobadas. Repetir después de cambios.
- `position: relative` en el dialog provocaba desplazamiento incorrecto al abrir Redes tras hacer scroll. Mantenerlo fijo y centrado; conservar scroll de página al cerrar.
- El detalle Cisco no debe duplicar paquetes en el buffer de animación. `redes/live.ts` limita la selección a `.rd-stage`; mantener el número de slots consistente con el shader.
- La extracción usa transformaciones y opacidad con transiciones reversibles, sin reemplazar el SVG ni recalcular la posición de toda la figura.
- Evitar introducir cambios de layout al cargar ASCII; son fondos decorativos que no reciben eventos de puntero.

## Historial útil

- `dc8bc9d`: detalle Cisco inicial.
- `0c825e0`: secciones, administración de certificaciones y configuración de Vercel.
- Esta entrega posterior registra los fondos ASCII, la extracción dentro del mismo diagrama y este documento de continuidad.
