import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://cfrigeri.github.io',
  integrations: [sitemap()],
  vite: {
    css: {
      preprocessorOptions: {
        // Bootstrap 5 todavía usa @import y funciones globales de Sass.
        scss: { quietDeps: true, silenceDeprecations: ['import', 'global-builtin', 'color-functions', 'if-function'] },
      },
    },
  },
  markdown: { shikiConfig: { theme: 'github-light' } },
});
