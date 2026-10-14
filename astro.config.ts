import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	// TODO: cambiar por el dominio real (necesario para sitemap y URLs canónicas)
	site: 'https://example.com',
	output: 'static',
	integrations: [react(), sitemap()],
	// Prefetch desactivado: con una sola página solo añade JS. Actívalo cuando haya más rutas:
	// prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
});
