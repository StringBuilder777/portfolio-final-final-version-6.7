# Estado y continuidad del portafolio

Actualizado: 2026-11-02 (America/Monterrey).

## Antes de la siguiente actualización

Leer este archivo, `AGENTS.md` y `docs/certificaciones-y-deploy.md`. Revisar `git status` antes de editar: esta nota describe el estado de esta entrega, no garantiza que el checkout siga igual.

## Decisiones del usuario

- Mantener Astro estático y TypeScript estricto. Hacer cambios mínimos y ejecutar los tests y el build antes de terminar.
- Inicio: `Hero.astro` presenta el nombre real como `h1` sobre la animación `wired-intelligence`, copiada del archivo local del usuario. Primer fotograma generado en build, animación diferida al entrar en pantalla y detenida con movimiento reducido o fuera de pantalla. No sustituir el nombre por texto dentro del canvas.
- Los diagramas aparecen en Inicio y también en `/stack/`. Al pulsarlos, se amplían hacia una ventana grande, centrada en la pantalla incluso después de hacer scroll.
- Conservar los diagramas SVG originales. El usuario descartó el visor 3D separado y el giro de la imagen plana. No reintroducirlos sin una nueva solicitud.
- Al pulsar Cisco IOS o Packet Tracer, los equipos se extraen y regresan suavemente dentro del mismo diagrama. No abrir otra ventana, cambiar títulos, sustituir la vista ni mover su distribución. Pulsar de nuevo revierte la animación.
- Fondos: Frontend `earthrise`, Redes `edge-orbit`, Backend `green-storm` y Sistemas `salt-flat` con Tux. Se cargan solo al abrir la ventana, se destruyen al cerrar y respetan movimiento reducido.
- Stack en escritorio: tres tarjetas arriba y dos centradas abajo; títulos arriba y centrados. Las miniaturas muestran solo el diagrama, conservando las leyendas en la ventana ampliada. No tomar capturas salvo nueva indicación del usuario.
- Logos ASCII animados alrededor de Frontend (TypeScript, JavaScript, HTML, CSS, PHP) y Backend (Java, Rust, Lua, C, Python). Se cargan al entrar en pantalla.
- Ciberseguridad se integra en **Redes y seguridad** (`redes`). La cuarta tarjeta es **Sistemas y servidores** (`sistemas`), con una fábrica isométrica de peluches. El rack conserva la simulación ACL e incorpora un FortiGate ilustrativo en la unidad 6, sin puertos conectados.
- Sistemas: el usuario sustituyó la idea de garra por una fábrica. Entran piezas por arriba, bajan a una cámara con fuego/vapor, pasan por una prensa de confección y salen como peluches por una banda. Tux sigue la referencia suministrada: negro, barriga blanca, sonrisa y patas amarillas grandes. Secuencia: Linux, macOS una sola vez y luego solo Linux; se repite macOS únicamente al reiniciar.
- Redes usa cuatro logos ASCII locales: Cisco, Fortinet, Palo Alto y Snort. Copiados de `/Users/stringbuilder/ascii/src/pieces/` a `src/lib/ascii/logos/`, conservando sus paletas y `shine`; solo se adaptó el import de tipos a `ascii.rest`. El renderizador instalado comparte el mismo contrato de `Frame`, `Meta` y paletas.
- Sistemas tiene Debian, Fedora, Kali Linux, Red Hat y Tux alrededor de la tarjeta, con sus paletas y `scan: 5`. Los módulos instalados se compararon con las fuentes locales suministradas: coinciden sus fotogramas e índices de color. El arranque de logos utiliza las opciones de cada pieza (`shine` o `scan`).
- Posiciones de Sistemas: Kali arriba a la derecha, Fedora abajo al centro; conservan tamaños y animaciones.
- Publicar en **Vercel**, no Cloudflare. Supabase gestiona acceso, datos y archivos de certificaciones. Prioridad: planes gratuitos y revisar sus límites al configurar.
- Usar la identidad de Git ya configurada. Solo hacer commit o push si se solicita; no se ha pedido push en esta entrega.

## Implementado y archivos clave

| Área | Estado y ubicación |
| --- | --- |
| Navegación | Portada breve y rutas `/stack/`, `/proyectos/`, `/certificaciones/`, `/sobre-mi/`, `/contacto/` |
| Portada animada | `src/components/Hero.astro` y `src/lib/ascii/wired-intelligence.ts`: rack grabado y señales ámbar, fondo exclusivo de Inicio; nombre, presentación y enlaces permanecen en HTML |
| Ventanas del Stack | `src/components/Stack.astro`: posición fija, scroll interno, retorno de foco sin desplazar la página y ampliación animada |
| Frontend | Figura en `src/components/figures/frontend/`, imprenta de islas con su simulación original |
| Backend | Figura en `src/components/figures/backend/`: servidores Rust, Java/Quarkus y PHP/Laravel; discos MySQL/PostgreSQL y módulo Supabase; simulación de lectura/escritura |
| Redes y seguridad | Figura en `src/components/figures/redes/`, rack con ACL, VLAN, FortiGate adicional, paquetes y detalle Cisco en el mismo SVG |
| Sistemas y servidores | Figura en `src/components/figures/sistemas/`, fábrica de peluches con alimentación superior, cámara de calor, prensa y cinta. SVG, sin WebGL ni imágenes raster |
| Fondos ASCII | Montaje bajo demanda en `Stack.astro`; earthrise del paquete `ascii.rest` |
| Edge orbit | `src/lib/ascii/edge-orbit.ts`: copia MIT del repositorio oficial bas3line/ascii; la versión instalada 0.4.0 no la incluye. Solo se adaptó el import de tipos |
| Green storm | `src/lib/ascii/green-storm.ts`: copia MIT de bas3line/ascii; solo se adaptó el import de tipos. Fondo exclusivo de la ventana Backend |
| Salt flat con Tux | `src/lib/ascii/salt-flat.ts`: copia de `/Users/stringbuilder/ascii/src/pieces/salt-flat.ts`, con el Tux personalizado por el usuario, colores, reflejo, destello y paisaje animado. Solo se adaptó el import de tipos; se carga únicamente al abrir Sistemas |
| Licencias | `public/licenses/ascii-rest.txt` y `public/licenses/anatomy.txt` |
| Administración | `/admin/`, `src/scripts/certifications-admin.ts`, `src/lib/certifications/client.ts` |
| Base de datos | `supabase/migrations/202611020001_certifications.sql`: certificaciones, miembros admin, RLS y bucket privado |
| Deploy | `vercel.json`, Astro estático, comando `pnpm build`, salida `dist` |
| Pruebas | `tests/portfolio.spec.ts`, `playwright.config.ts`, build aislado `.test-dist` con servicio simulado |

## Módulos y trabajo pendiente

1. **Backend implementado**: banco de 61 piezas, sin WebGL. `audit.mjs --audit` usa el submódulo opcional y genera `order.json`; el build usa el orden generado y el kit local. La simulación no representa una topología real de los repositorios.
2. **Sistemas y servidores implementado**: modelo de fabricación y secuencia en `model.ts`, geometría y controles en su carpeta. `audit.mjs --audit` verifica la estructura fija (74 sólidos) y genera `order.json`; las fases de materiales/prensa y las entregas se comprueban por separado. La auditoría fija no certifica todas las fases móviles.
3. **Cloud**: falta su figura, misma estructura con id `cloud`.
4. Hacer una figura por sesión, framework-free, con el kit Anatomy existente. No crear figuras adicionales ni fondos para otras áreas por iniciativa propia. Mantener carga diferida y temas claro/oscuro.
5. **Supabase real**: conectar proyecto Free, ejecutar migración, crear usuario admin, deshabilitar registro público y asignar membresía desde SQL Editor. Completar `.env` con URL y clave publishable; nunca service_role/secret en variables públicas.
6. Validar permisos reales: visitantes y usuarios sin membresía no pueden escribir ni leer borradores o archivos privados; admin puede crear, editar, publicar y eliminar. Las pruebas actuales usan respuestas simuladas y no prueban RLS remoto.
7. **Vercel real**: conectar cuenta y repositorio, configurar variables públicas para producción/preview, dominio y despliegue. No se han creado recursos remotos ni publicado el sitio en esta sesión.
8. Cambiar `https://example.com` en `astro.config.ts` y `public/robots.txt` por el dominio real. Revisar contenido de ejemplo en `src/config/site.ts` (correo, proyectos y enlaces) con datos del usuario antes de publicar.

## Verificación y problemas que no deben reaparecer

- `pnpm build`: verificación de Astro/TypeScript y generación estática.
- `pnpm test`: pruebas Chromium de navegación, administración simulada, limpieza de archivos, diagramas, fondos y scroll de ventanas en escritorio/móvil.
- Última ejecución: build sin errores/advertencias/hints y 12 pruebas aprobadas. Para respetar la indicación de no tomar capturas, se ejecutó una copia temporal de los tests omitiendo únicamente las llamadas `page.screenshot`; no se cambiaron las comprobaciones. Repetir después de cambios.
- Portada: nombre y botones visibles en 1280 y 390 px, sin desbordamiento horizontal; nombre y primer fotograma presentes sin JavaScript. El generador conserva paleta, animación y `speed: 0`.
- Fábrica: secuencia comprobada sobre 60 entregas; teclado, pausa, reinicio, calor, movimiento reducido y ventana móvil verificados. El reloj se detiene fuera de pantalla y con la pestaña oculta.
- Los cuatro logos nuevos se verificaron en ambos temas y tamaños de pantalla, además de comprobar dimensiones de fotogramas, índices de paleta, brillo y `shine: 0` en sus generadores.
- Backend: auditoría de 61 sólidos y comprobación de extremos de líneas sin problemas. Prueba de teclado, cambio de operación, movimiento reducido, ventana móvil y limpieza del fondo al cerrar.
- `position: relative` en el dialog provocaba desplazamiento incorrecto al abrir Redes tras hacer scroll. Mantenerlo fijo y centrado; conservar scroll de página al cerrar.
- El detalle Cisco no debe duplicar paquetes en el buffer de animación. `redes/live.ts` limita la selección a `.rd-stage`; mantener el número de slots consistente con el shader.
- La extracción usa transformaciones y opacidad con transiciones reversibles, sin reemplazar el SVG ni recalcular la posición de toda la figura.
- Evitar introducir cambios de layout al cargar ASCII; son fondos decorativos que no reciben eventos de puntero.

## Historial útil

- `dc8bc9d`: detalle Cisco inicial.
- `0c825e0`: secciones, administración de certificaciones y configuración de Vercel.
- Esta entrega posterior registra los fondos ASCII, la extracción dentro del mismo diagrama y este documento de continuidad.
