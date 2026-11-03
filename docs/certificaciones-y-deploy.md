# Certificaciones y publicación

El sitio sigue siendo estático. `/admin/` usa Supabase Auth, Postgres y Storage desde el navegador; la autorización se aplica mediante RLS. No se necesita un servidor de pago ni un nuevo deploy al cambiar certificaciones.

## Configuración inicial de Supabase

1. Crea un proyecto en una organización **Free**.
2. Ejecuta `supabase/migrations/202611020001_certifications.sql` desde SQL Editor, una sola vez.
3. En Authentication crea tu usuario administrador con correo y contraseña. Deshabilita el registro público en Authentication > Providers > Email > Allow new users to sign up.
4. Copia su UUID desde Authentication > Users. Autorízalo desde SQL Editor:

```sql
insert into public.portfolio_admins (user_id) values ('UUID-DE-TU-USUARIO');
```

5. Copia `.env.example` a `.env` y completa la URL del proyecto y su clave **publishable**. Nunca uses una clave secret ni service_role en variables `PUBLIC_*`.
6. Ejecuta `pnpm build` y `pnpm preview`. Abre `/admin/` e inicia sesión.

Los documentos se guardan en un bucket privado, con límite de 5 MB y tipos PDF/JPEG/PNG/WebP. Solo las certificaciones publicadas permiten leer su archivo. Los enlaces firmados caducan en 60 segundos; al retirar una publicación, un enlace ya emitido puede seguir funcionando hasta caducar. Editar permite reemplazar o quitar el documento. Si falla la limpieza de un archivo, el panel lo informa para eliminarlo desde Storage.

## Vercel Hobby

- Importa el repositorio en Vercel y selecciona el preset Astro y la rama que quieras publicar.
- Build command: `pnpm build`.
- Output directory: `dist`.
- Node.js: 22.12 o posterior compatible con Astro.
- Añade `PUBLIC_SUPABASE_URL` y `PUBLIC_SUPABASE_PUBLISHABLE_KEY` a las variables de build de producción y preview.
- Antes de publicar, configura el dominio real en `astro.config.ts` y `public/robots.txt`.
- El build usa el kit Anatomy ya copiado. Si falla la clonación del submódulo opcional, revisa los ajustes de Git del proyecto.

No se ha publicado ni creado ningún recurso remoto con este cambio. Hace falta conectar Supabase y Vercel y ejecutar la migración.

## Coste y límites

Consulta los límites vigentes antes de activar servicios:
- [Supabase Free](https://supabase.com/pricing): 500 MB de base de datos, 1 GB de archivos, 5 GB de salida; pausa tras una semana de inactividad.
- [Vercel Hobby](https://vercel.com/docs/plans/hobby): plan gratuito para uso personal no comercial, sujeto a límites.
- [R2](https://developers.cloudflare.com/r2/pricing/): cuota gratuita y cargos por excedentes. Esta implementación usa Storage de Supabase para mantener la configuración sencilla.

## Verificación

`pnpm build` comprueba tipos y genera las páginas. `pnpm test` compila un sitio aislado en `.test-dist` con credenciales ficticias y prueba la interfaz mediante un servicio interceptado. No valida las políticas de un proyecto remoto. Antes de publicar, comprobar con Supabase real: visitante no puede escribir ni leer borradores/archivos privados; un usuario sin membresía no puede administrar; el administrador puede crear, editar, publicar y eliminar.

## Revisión visual de esta entrega

Concepto generado con Image Gen: `/Users/stringbuilder/.codex/generated_images/01a19e8c-c3b8-7741-9e5c-1f9422a29870/exec-f5c6ea0d-4ff6-47ca-9c13-c43f47a61c44.png`.
Se comparó visualmente con capturas de Chromium mediante `view_image`: portada, formulario y ventana de Redes. Se revisaron texto, jerarquía, colores, filas con divisores, espaciado y distribución. La portada conserva el texto original; se mantuvieron deliberadamente su botón negro, tipografía y footer existentes. El administrador añade título de edición, actualización de lista y controles de archivo necesarios para el flujo completo. El Stack sigue la corrección posterior del usuario: diagramas seleccionables y detalle animado. No se afirma una reproducción literal del concepto. Vista de escritorio 1280 px y comprobación de desbordamiento a 390 px.

Resultado: `pnpm build`, 0 errores, 0 advertencias y 0 hints; `pnpm test`, 5 pruebas aprobadas con servicio simulado. Las políticas SQL aún requieren validación contra el proyecto real.

## Fondo de Frontend

Frontend conserva su diagrama SVG original. `earthrise` de `ascii.rest` se carga desde el paquete local al abrir la ventana, como fondo decorativo sobre canvas. La animación respeta movimiento reducido y su reproducción se destruye al cerrar. Se retiró el visor Three.js. Licencia MIT disponible en `public/licenses/ascii-rest.txt`. Vercel continúa como destino de publicación.
