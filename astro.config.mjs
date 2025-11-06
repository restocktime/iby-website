// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://isaacbenyakar.com',
  output: 'hybrid',
  integrations: [
    tailwind(),
    sitemap(),
  ],
  build: {
    inlineStylesheets: 'auto',
    format: 'directory'
  },
  compressHTML: true,
  scopedStyleStrategy: 'class',
  trailingSlash: 'never'
});
