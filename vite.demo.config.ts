import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import sveltePreprocess from 'svelte-preprocess'


// https://vitejs.dev/config/
export default defineConfig({
  root: './packages/demo/',
  resolve: {
    dedupe: ['svelte']
  },
  build: {
    outDir: '../../dist/demo',
    emptyOutDir: true
  },
  plugins: [
    svelte({
      exclude: /\.wc\.svelte$/ as any,
      hot: false,
      preprocess: sveltePreprocess(),
      emitCss: false,
      compilerOptions: {
        customElement: false
      }
    }),
    svelte({
      include: /\.wc\.svelte$/ as any,
      hot: false,
      preprocess: sveltePreprocess(),
      emitCss: false,
      compilerOptions: {
        customElement: true
      }
    })
  ]
});
