import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

const monorepoRoot = fileURLToPath(new URL('..', import.meta.url))

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@ui': fileURLToPath(new URL('../packages/ui/src', import.meta.url)),
      '@shared': fileURLToPath(new URL('../packages/shared/src', import.meta.url)),
    },
  },
  server: {
    port: 5174,
    fs: {
      allow: [monorepoRoot],
    },
  },
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules/vue/') || id.includes('node_modules/@vue/') || id.includes('node_modules/vue-router/') || id.includes('node_modules/pinia/')) {
            return 'vue-vendor'
          }
        },
      },
    },
  },
})
