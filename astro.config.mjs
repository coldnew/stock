import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://coldnew.github.io/stock/',
  base: '/stock',
  integrations: [mdx(), react()],
  output: 'static',
});
