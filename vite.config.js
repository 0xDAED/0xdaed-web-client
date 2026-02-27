import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import Components from 'unplugin-vue-components/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
    vue(),
    vueDevTools(),
    Components({
      dirs: ['src/components'],
      extensions: ['vue'],
      deep: true,
      dts: true,
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      icons: fileURLToPath(new URL('./src/assets/icons', import.meta.url)),
      images: fileURLToPath(new URL('./src/assets/images', import.meta.url)),
      styles: fileURLToPath(new URL('./src/assets/styles', import.meta.url)),
      fonts: fileURLToPath(new URL('./src/assets/fonts', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
  },
  server: {
    host: '0.0.0.0',
    allowedHosts: ['void-rp.ru'],
  },
})
