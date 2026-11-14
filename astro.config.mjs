import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { fileURLToPath } from 'node:url';

// 도메인을 연결하면 SITE_URL 환경변수(Vercel 설정)만 바꾸면 됩니다.
const site = process.env.SITE_URL || 'https://kkomi-tools.vercel.app';

export default defineConfig({
  site,
  trailingSlash: 'always',
  integrations: [react(), sitemap()],
  vite: {
    resolve: {
      alias: {
        '@apps-in-toss/web-framework': fileURLToPath(new URL('./src/shims/toss.ts', import.meta.url)),
      },
    },
  },
});
