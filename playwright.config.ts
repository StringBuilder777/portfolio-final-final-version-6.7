import { defineConfig } from '@playwright/test';
export default defineConfig({
 testDir: './tests',
 fullyParallel: true,
 use: { baseURL: 'http://127.0.0.1:4322', headless: true },
 webServer: {
  command: 'pnpm exec astro build --config tests/astro.config.ts && pnpm exec astro preview --config tests/astro.config.ts --port 4322 --host 127.0.0.1 --ignore-lock',
  url: 'http://127.0.0.1:4322',
  reuseExistingServer: false,
  env: { PUBLIC_SUPABASE_URL: 'https://portfolio-test.supabase.co', PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_test_only' },
 },
});
