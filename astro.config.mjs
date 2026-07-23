// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // El sitio sigue prerenderizado (SSG) por defecto; solo las páginas que
  // declaren `export const prerender = false` (como clickup-plantilla-landing)
  // se renderizan on-demand para poder hacer fetch en vivo a ClickUp.
  output: 'static',
  adapter: vercel({
    // ISR: la página se sirve cacheada y se regenera en segundo plano cada
    // 60s, en vez de golpear la API de ClickUp en cada visita.
    isr: {
      expiration: 60,
      // El botón "Revisar cambios" (y el polling en vivo de la línea del
      // tiempo de Amatza) pegan directo a estos endpoints: deben traer datos
      // frescos de ClickUp en cada llamada, no servir el caché de ISR.
      exclude: [/^\/api\/clickup\/(template|amatza-timeline)\/?$/],
    },
  }),

  integrations: [react()],

  vite: {
    plugins: [tailwindcss()]
  }
});