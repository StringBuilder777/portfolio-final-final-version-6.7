import { bucket, configured, getClient, safeUrl, textElement, validateFile, type Certification } from '@/lib/certifications/client';

const status = document.querySelector<HTMLElement>('#admin-status')!;
const login = document.querySelector<HTMLFormElement>('#login')!;
const editor = document.querySelector<HTMLFormElement>('#editor')!;
const workspace = document.querySelector<HTMLElement>('#workspace')!;
const logout = document.querySelector<HTMLButtonElement>('#logout')!;
const list = document.querySelector<HTMLElement>('#admin-list')!;
const heading = document.querySelector<HTMLElement>('#editor-title')!;
const currentDocument = document.querySelector<HTMLElement>('#current-document')!;
const refresh = document.querySelector<HTMLButtonElement>('#refresh')!;
const field = (name: string) => editor.elements.namedItem(name) as HTMLInputElement;
let selected: Certification | null = null;
let busy = false;

function report(message: string) { status.textContent = message; }
function clear() { selected = null; heading.textContent = 'Nueva certificación'; currentDocument.textContent = ''; }
function lock(value: boolean) {
 busy = value;
 for (const input of document.querySelectorAll<HTMLButtonElement | HTMLInputElement>('#workspace button, #workspace input, #logout')) input.disabled = value;
 editor.setAttribute('aria-busy', String(value));
}
if (!configured) report('El administrador todavía no está conectado. Configura Supabase para habilitar el acceso.');
else {
 const client = getClient(true);
 async function loadList() {
  const { data, error } = await client.from('certifications').select('*').order('created_at', { ascending: false }).order('id');
  if (error) throw error;
  list.replaceChildren();
  if (!data.length) list.append(textElement('p', 'Todavía no hay certificaciones.'));
  for (const item of data) {
   const row = textElement('article', '');
   row.append(textElement('h3', item.title), textElement('p', `${item.issuer} · ${item.published ? 'Publicada' : 'Borrador'}`));
   const actions = textElement('div', ''); actions.className = 'cert-actions';
   const edit = textElement('button', 'Editar'); edit.type = 'button';
   edit.addEventListener('click', () => {
    if (busy) return;
    editor.reset(); selected = item;
    for (const name of ['id', 'title', 'issuer', 'issued_on', 'verification_url'] as const) field(name).value = item[name] ?? '';
    field('published').checked = item.published;
    heading.textContent = 'Editar certificación';
    currentDocument.textContent = item.document_path ? 'Documento adjunto guardado.' : '';
    field('title').focus();
   });
   const remove = textElement('button', 'Eliminar'); remove.type = 'button';
   remove.addEventListener('click', async () => {
    if (busy || !confirm(`¿Eliminar “${item.title}”? Esta acción no se puede deshacer.`)) return;
    lock(true);
    try {
     const { data, error } = await client.from('certifications').delete().eq('id', item.id).select('id');
     if (error || !data?.length) throw error ?? new Error('Sin permiso');
     let cleanupFailed = false;
     if (item.document_path) { const { error } = await client.storage.from(bucket).remove([item.document_path]); cleanupFailed = Boolean(error); }
     if (selected?.id === item.id) editor.reset();
     report(cleanupFailed ? 'Certificación eliminada. No se pudo borrar el archivo; retíralo desde Storage para liberar espacio.' : 'Certificación eliminada.');
     try { await loadList(); } catch { report('Certificación eliminada. No se pudo actualizar la lista; pulsa Actualizar lista.'); }
    } catch { report('No se pudo eliminar. Comprueba la conexión y tu acceso.'); }
    finally { lock(false); }
   });
   actions.append(edit, remove); row.append(actions); list.append(row);
  }
 }
 async function checkAccess() {
  workspace.hidden = true; login.hidden = true; logout.hidden = true;
  try {
   const { data: { user }, error } = await client.auth.getUser();
   if (error || !user) { login.hidden = false; report('Inicia sesión con tu cuenta de administrador.'); return; }
   logout.hidden = false;
   const { data, error: accessError } = await client.from('portfolio_admins').select('user_id').eq('user_id', user.id).maybeSingle();
   if (accessError) throw accessError;
   if (!data) { report('Esta cuenta no tiene permiso para administrar el portafolio.'); return; }
   workspace.hidden = false;
   await loadList(); report('');
  } catch { report('No se pudo comprobar el acceso o cargar la lista. Recarga la página para reintentar.'); }
 }
 login.addEventListener('submit', async (event) => {
  event.preventDefault();
  const submit = login.querySelector<HTMLButtonElement>('button')!; submit.disabled = true;
  const values = new FormData(login);
  try {
   const { error } = await client.auth.signInWithPassword({ email: String(values.get('email')).trim(), password: String(values.get('password')) });
   if (error) throw error;
   login.reset(); await checkAccess();
  } catch { report('No se pudo iniciar sesión. Revisa tus credenciales y tu conexión.'); }
  finally { submit.disabled = false; }
 });
 logout.addEventListener('click', async () => {
  if (busy) return;
  logout.disabled = true;
  try {
   const { error } = await client.auth.signOut({ scope: 'local' });
   if (error) throw error;
   editor.reset(); list.replaceChildren(); await checkAccess();
  } catch { report('No se pudo cerrar sesión. Inténtalo de nuevo.'); }
  finally { logout.disabled = false; }
 });
 editor.addEventListener('reset', clear);
 editor.addEventListener('submit', async (event) => {
  event.preventDefault(); if (busy) return;
  const values = new FormData(editor);
  const title = String(values.get('title') ?? '').trim();
  const issuer = String(values.get('issuer') ?? '').trim();
  const verification = String(values.get('verification_url') ?? '').trim();
  if (!title || !issuer) { report('Escribe el nombre y el emisor.'); return; }
  if (verification && !safeUrl(verification)) { report('El enlace de verificación debe comenzar con https:// y no incluir credenciales.'); return; }
  const file = values.get('document');
  const hasFile = file instanceof File && file.name !== '';
  if (hasFile && values.has('remove_document')) { report('Elige entre reemplazar el documento o quitarlo.'); return; }
  lock(true); report('Guardando…');
  let uploaded: string | null = null;
  let committed = false;
  try {
   const oldPath = selected?.document_path ?? null;
   let documentPath = values.has('remove_document') ? null : oldPath;
   if (hasFile) {
    const extension = validateFile(file);
    const path = `${crypto.randomUUID()}.${extension}`;
    const { error } = await client.storage.from(bucket).upload(path, file, { contentType: file.type, upsert: false });
    if (error) throw error;
    uploaded = path; documentPath = path;
   }
   const payload = { title, issuer, issued_on: String(values.get('issued_on') ?? '') || null,
    verification_url: verification || null, document_path: documentPath, published: values.has('published') };
   const query = selected ? client.from('certifications').update(payload).eq('id', selected.id) : client.from('certifications').insert(payload);
   const { data, error } = await query.select('id');
   if (error || !data?.length) throw error ?? new Error('Sin permiso');
   committed = true;
   let cleanupFailed = false;
   if (oldPath && oldPath !== documentPath) { const { error } = await client.storage.from(bucket).remove([oldPath]); cleanupFailed = Boolean(error); }
   editor.reset();
   report(cleanupFailed ? 'Guardada. No se pudo borrar el archivo anterior; retíralo desde Storage para liberar espacio.' : 'Certificación guardada.');
   try { await loadList(); } catch { report('Certificación guardada. No se pudo actualizar la lista; pulsa Actualizar lista.'); }
  } catch (error) {
   let cleanupFailed = false;
   if (uploaded && !committed) { const { error } = await client.storage.from(bucket).remove([uploaded]); cleanupFailed = Boolean(error); }
   report(committed ? 'La certificación se guardó, pero falló la limpieza del archivo anterior. Revisa Storage.' :
    `${error instanceof Error && error.message.startsWith('Usa PDF') ? error.message : 'No se pudo guardar. Revisa la conexión y tus permisos.'}${cleanupFailed ? ' Quedó un archivo sin asociar en Storage; elimínalo para liberar espacio.' : ''}`);
  } finally { lock(false); }
 });
 refresh.addEventListener('click', async () => {
  if (busy) return; lock(true);
  try { await loadList(); report('Lista actualizada.'); } catch { report('No se pudo cargar la lista. Inténtalo de nuevo.'); } finally { lock(false); }
 });
 client.auth.onAuthStateChange((event) => {
  if (event === 'SIGNED_OUT') { workspace.hidden = true; logout.hidden = true; login.hidden = false; editor.reset(); list.replaceChildren(); report('La sesión terminó. Inicia sesión de nuevo.'); }
 });
 void checkAccess();
}
