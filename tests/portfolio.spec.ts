import { test, expect, type Page } from '@playwright/test';
import type { Certification } from '../src/lib/certifications/client';
const user = { id: '00000000-0000-4000-8000-000000000001', aud: 'authenticated', role: 'authenticated', email: 'admin@example.test', app_metadata: {}, user_metadata: {}, created_at: '2026-01-01T00:00:00Z' };
async function service(page: Page, admin = true) {
 let rows: Certification[] = [];
 const removed: string[] = [];
 let failSave = false;
 let uploads = 0;
 await page.route('https://portfolio-test.supabase.co/**', async (route) => {
  const request = route.request(); const url = new URL(request.url());
  const reply = (data: unknown, status = 200) => route.fulfill({ status, json: data });
  if (url.pathname.endsWith('/token')) return reply({ access_token: 'test-session-token', refresh_token: 'test-refresh-token', expires_in: 3600, token_type: 'bearer', user });
  if (url.pathname.endsWith('/user')) return reply(user);
  if (url.pathname.endsWith('/logout')) return reply({});
  if (url.pathname.endsWith('/portfolio_admins')) return reply(admin ? { user_id: user.id } : null);
  if (url.pathname.endsWith('/certifications') && url.pathname.includes('/rest/')) {
   if (request.method() === 'GET') return reply(url.searchParams.has('published') ? rows.filter(row => row.published) : rows);
   if (failSave) return reply({ message: 'Test denied', code: '42501' }, 403);
   if (request.method() === 'POST') { const row = { ...request.postDataJSON(), id: crypto.randomUUID(), created_at: '2026-01-01T00:00:00Z' } as Certification; rows.push(row); return reply([{ id: row.id }]); }
   const id = url.searchParams.get('id')?.slice(3);
   if (request.method() === 'PATCH') rows = rows.map(row => row.id === id ? { ...row, ...request.postDataJSON() } : row);
   if (request.method() === 'DELETE') rows = rows.filter(row => row.id !== id);
   return reply([{ id }]);
  }
  if (url.pathname.includes('/storage/v1/object/')) {
   if (request.method() === 'DELETE') { removed.push(...request.postDataJSON().prefixes); return reply([]); }
   uploads++; return reply({ Key: 'certifications/test.pdf' });
  }
  return reply({ message: 'Unexpected request' }, 500);
 });
 return { rows: () => rows, removed, uploads: () => uploads, failSave: () => { failSave = true; } };
}
async function login(page: Page) {
 await page.goto('/admin/');
 await page.getByLabel('Correo electrónico').fill(user.email);
 await page.getByLabel('Contraseña', { exact: true }).fill('test-password');
 await page.getByRole('button', { name: 'Entrar', exact: true }).click();
}
test('compact navigation, mobile layout and dark theme', async ({ page }) => {
 await page.setViewportSize({ width: 1280, height: 900 });
 await page.goto('/');
 await page.screenshot({ path: '/private/tmp/portfolio-home.png' });
 await expect(page.locator('main h1')).toHaveText('Luis Emilaino Garcia Sifuentes');
 await expect(page.locator('main #stack')).toHaveCount(1);
 await page.getByRole('link', { name: 'Ver proyectos', exact: true }).click();
 await expect(page).toHaveURL(/\/proyectos\//);
 for (const width of [390, 1280]) {
  await page.setViewportSize({ width, height: 900 });
  await page.goto('/');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
 }
 await page.evaluate(() => localStorage.setItem('theme', 'dark'));
 await page.reload();
 await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});
test('non-admin cannot see the editor', async ({ page }) => {
 await service(page, false); await login(page);
 await expect(page.getByRole('status')).toContainText('no tiene permiso');
 await expect(page.locator('#workspace')).toBeHidden();
});
test('create draft with upload, publish, read, delete and logout', async ({ page }) => {
 const api = await service(page); await login(page);
 await expect(page.locator('#workspace')).toBeVisible();
 await page.screenshot({ path: '/private/tmp/portfolio-admin.png' });
 await page.getByLabel('Nombre', { exact: true }).fill('Certificación de prueba');
 await page.getByLabel('Emisor', { exact: true }).fill('Emisor de prueba');
 await page.getByLabel('Documento (PDF o imagen)', { exact: true }).setInputFiles({ name: 'test.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-1.4 test') });
 await page.getByRole('button', { name: 'Guardar certificación' }).click();
 await expect(page.getByRole('status')).toHaveText('Certificación guardada.');
 expect(api.rows()[0].published).toBe(false);
 await page.goto('/certificaciones/');
 await expect(page.getByRole('status')).toHaveText('Todavía no hay certificaciones publicadas.');
 await page.goto('/admin/');
 await page.getByRole('button', { name: 'Editar', exact: true }).click();
 await page.getByLabel('Publicada', { exact: true }).check();
 await page.getByRole('button', { name: 'Guardar certificación' }).click();
 await expect(page.getByRole('status')).toHaveText('Certificación guardada.');
 await page.goto('/certificaciones/');
 await expect(page.getByRole('heading', { name: 'Certificación de prueba' })).toBeVisible();
 await page.goto('/admin/');
 page.once('dialog', dialog => dialog.accept());
 await page.getByRole('button', { name: 'Eliminar', exact: true }).click();
 await expect(page.getByRole('status')).toHaveText('Certificación eliminada.');
 expect(api.removed).toHaveLength(1);
 await page.getByRole('button', { name: 'Cerrar sesión' }).click();
 await expect(page.locator('#workspace')).toBeHidden();
});
test('unsafe links and failed writes do not leave an uploaded file', async ({ page }) => {
 const api = await service(page); await login(page);
 await page.getByLabel('Nombre', { exact: true }).fill('Prueba');
 await page.getByLabel('Emisor', { exact: true }).fill('Prueba');
 await page.getByLabel('Enlace de verificación').fill('http://example.com');
 await page.getByRole('button', { name: 'Guardar certificación' }).click();
 await expect(page.getByRole('status')).toContainText('https://');
 expect(api.uploads()).toBe(0);
 await page.getByLabel('Enlace de verificación').fill('https://example.com');
 await page.getByLabel('Documento (PDF o imagen)', { exact: true }).setInputFiles({ name: 'test.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-1.4 test') });
 api.failSave();
 await page.getByRole('button', { name: 'Guardar certificación' }).click();
 await expect(page.getByRole('status')).toContainText('No se pudo guardar');
 expect(api.removed).toHaveLength(1);
 expect(api.rows()).toHaveLength(0);
});
test('stack opens a diagram, exposes technologies and restores focus', async ({ page }) => {
 await page.goto('/');
 const open = page.getByRole('button', { name: 'Explorar Redes', exact: true });
 await open.click();
 const dialog = page.locator('#dialog-redes');
 await expect(dialog).toBeVisible();
 await expect(dialog.getByRole('button', { name: 'Cisco IOS', exact: true })).toBeVisible();
 const stage = dialog.locator('.rd-stage');
 await dialog.evaluate(element => Promise.all(element.getAnimations({ subtree: true }).filter(animation => animation.effect?.getComputedTiming().iterations !== Infinity).map(animation => animation.finished)));
 const bounds = await stage.boundingBox();
 await dialog.getByRole('button', { name: 'Cisco IOS', exact: true }).click();
 await expect(dialog.locator('[data-figure="redes"]')).toHaveAttribute('data-detail', 'open');
 await expect(stage).toBeVisible();
 expect(await stage.boundingBox()).toEqual(bounds);
 await expect(page.locator('dialog:modal')).toHaveCount(1);
 await dialog.getByRole('button', { name: 'Cisco IOS', exact: true }).click();
 await expect(dialog.locator('[data-figure="redes"]')).not.toHaveAttribute('data-detail', 'open');
 await dialog.getByRole('button', { name: 'Packet Tracer', exact: true }).click();
 await expect(dialog.locator('[data-figure="redes"]')).toHaveAttribute('data-detail', 'open');
 await expect(dialog.getByRole('heading', { name: 'Redes', exact: true })).toBeVisible();
 expect(await stage.boundingBox()).toEqual(bounds);
 await expect(page.locator('dialog:modal')).toHaveCount(1);
 await page.screenshot({ path: '/private/tmp/portfolio-packet-inline.png' });
 await page.keyboard.press('Escape');
 await expect(dialog).toBeHidden();
 await expect(open).toBeFocused();
});

test('frontend opens its original diagram over earthrise and clears it on close', async ({ page }) => {
 await page.goto('/');
 await expect(page.locator('[data-earthrise] canvas')).toHaveCount(0);
 await page.getByRole('button', { name: 'Explorar Frontend', exact: true }).click();
 const dialog = page.locator('#dialog-frontend');
 await expect(dialog.locator('[data-figure="frontend"]')).toBeVisible();
 await expect(dialog.locator('[data-earthrise] canvas')).toBeVisible();
 await expect(dialog.getByRole('button', { name: 'Vista 3D' })).toHaveCount(0);
 await page.screenshot({ path: '/private/tmp/portfolio-earthrise.png' });
 await page.keyboard.press('Escape');
 await expect(page.locator('[data-earthrise] canvas')).toHaveCount(0);
 await expect(page.locator('[data-figure-home="frontend"] [data-figure="frontend"]')).toBeVisible();
});

test('enlarged dialogs stay inside the viewport after scrolling to Redes', async ({ page }) => {
 for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
  await page.setViewportSize(viewport);
  await page.goto('/');
  const open = page.getByRole('button', { name: 'Explorar Redes', exact: true });
  await open.evaluate(element => element.scrollIntoView({ block: 'start', behavior: 'instant' }));
  const scrollBefore = await page.evaluate(() => scrollY);
  expect(scrollBefore).toBeGreaterThan(0);
  await open.click();
  const dialog = page.locator('#dialog-redes');
  await expect(dialog).toBeVisible();
  const bounds = await dialog.boundingBox();
  if (!bounds) throw new Error('Missing dialog bounds');
  expect(bounds.y).toBeGreaterThanOrEqual(0);
  expect(bounds.y + bounds.height).toBeLessThanOrEqual(viewport.height);
  expect(Math.abs(bounds.y + bounds.height / 2 - viewport.height / 2)).toBeLessThan(2);
  expect(bounds.width).toBeGreaterThan(viewport.width * 0.9);
  await dialog.hover();
  await page.mouse.wheel(0, 500);
  expect(await page.evaluate(() => scrollY)).toBe(scrollBefore);
  await expect(dialog.getByRole('button', { name: 'Cerrar Redes', exact: true })).toBeInViewport();
  await page.screenshot({ path: `/private/tmp/portfolio-redes-${viewport.width}.png` });
  await page.keyboard.press('Escape');
  await expect(open).toBeFocused();
  expect(await page.evaluate(() => scrollY)).toBe(scrollBefore);
  await open.click();
  expect(await dialog.evaluate(element => element.scrollTop)).toBe(0);
  await page.keyboard.press('Escape');
 }
});

test('Redes loads edge-orbit only on open and preserves packet interaction', async ({ page }) => {
 await page.goto('/');
 const background = page.locator('#dialog-redes [data-ascii-background]');
 await expect(background.locator('canvas')).toHaveCount(0);
 await page.getByRole('button', { name: 'Explorar Redes', exact: true }).click();
 await expect(background).toHaveAttribute('data-piece', 'edge-orbit');
 await expect(background.locator('canvas')).toBeVisible();
 await page.getByRole('button', { name: 'Packet Tracer', exact: true }).click();
 await expect(page.locator('#dialog-redes [data-figure="redes"]')).toHaveAttribute('data-detail', 'open');
 await page.screenshot({ path: '/private/tmp/portfolio-edge-orbit.png' });
 await page.keyboard.press('Escape');
 await expect(background.locator('canvas')).toHaveCount(0);
});

test('Backend shows its servers and databases, switches operations and respects reduced motion', async ({ page }) => {
 await page.emulateMedia({ reducedMotion: 'reduce' });
 await page.goto('/stack/');
 const preview = page.locator('[data-figure-home="backend"]');
 const background = page.locator('#dialog-backend [data-ascii-background]');
 await expect(page.locator('#stack-backend [data-preview-logo]')).toHaveCount(4);
 await expect(background.locator('canvas')).toHaveCount(0);
 await expect(preview.locator('[data-figure="backend"]')).toBeVisible();
 await expect(preview.locator('figcaption')).toBeHidden();
 await page.getByRole('button', { name: 'Explorar Backend', exact: true }).click();
 const dialog = page.locator('#dialog-backend');
 await expect(background).toHaveAttribute('data-piece', 'green-storm');
 await expect(background.locator('canvas')).toBeVisible();
 const figure = dialog.locator('[data-figure="backend"]');
 await expect(figure).toHaveAttribute('data-ready', 'true');
 await expect(figure.locator('svg[role="img"]')).toHaveAttribute('aria-label', /MySQL y PostgreSQL/);
 await expect(figure.locator('svg[role="img"]')).toHaveAttribute('aria-label', /Rust.*Supabase/);
 await expect(figure.getByText('Node.js', { exact: true })).toHaveCount(0);
 await expect(figure.locator('[data-part="auth.chassis"]')).toHaveCount(1);
 await expect(figure.locator('[data-part^="server-"][data-part$=".chassis"]')).toHaveCount(3);
 await expect(figure.locator('[data-part^="store-"][data-part$=".lid"]')).toHaveCount(2);
 const toggle = figure.getByRole('button');
 await expect(toggle).toHaveAccessibleName('Simulación: cambiar de lectura a escritura');
 await toggle.focus();
 await page.keyboard.press('Enter');
 await expect(figure).toHaveAttribute('data-operation', 'write');
 await expect(toggle).toHaveAttribute('aria-pressed', 'true');
 await expect(figure.locator('[data-backend-readout]')).toContainText('Simulación · escritura');
 const packet = figure.locator('[data-packet="request"]');
 const position = await packet.getAttribute('cx');
 await page.waitForTimeout(200);
 await expect(packet).toHaveAttribute('cx', position!);
 await toggle.click();
 await expect(figure).toHaveAttribute('data-operation', 'read');
 await page.keyboard.press('Escape');
 await page.setViewportSize({ width: 390, height: 844 });
 await page.getByRole('button', { name: 'Explorar Backend', exact: true }).click();
 await expect(dialog).toBeVisible();
 expect(await dialog.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
 await page.keyboard.press('Escape');
 await expect(preview.locator('[data-figure="backend"]')).toBeVisible();
 await expect(background.locator('canvas')).toHaveCount(0);
});
