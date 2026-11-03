import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	// TODO: cambiar por el dominio real (necesario para sitemap y URLs canónicas)
	site: 'https://example.com',
	output: 'static',
	integrations: [react(), sitemap({ filter: (page) => !page.endsWith('/admin/') && !page.endsWith('/admin') })],
	// Prefetch desactivado para mantener ligera la navegación:
	// prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
});
