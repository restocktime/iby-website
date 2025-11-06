// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sanity from '@sanity/astro';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://isaacbenyakar.com',
  integrations: [
    tailwind(),
    sanity({
      projectId: 'your-project-id', // Replace with actual Sanity project ID
      dataset: 'production',
      useCdn: true,
      apiVersion: '2023-05-03',
    }),
    sitemap(),
  ],
  image: {
    domains: ['cdn.sanity.io'],
  },
  build: {
    inlineStylesheets: 'auto',
  },
  compressHTML: true,
  scopedStyleStrategy: 'class',
});
