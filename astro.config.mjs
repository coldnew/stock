import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://coldnew.github.io/stock/',
  base: '/stock',
  integrations: [mdx()],
  output: 'static',
});
