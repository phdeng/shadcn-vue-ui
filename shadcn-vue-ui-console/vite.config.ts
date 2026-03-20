import { fileURLToPath, URL } from 'node:url'
import path from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

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
    // 确保 Vite 能从 monorepo 根的 node_modules 解析依赖
    modules: [
      path.resolve(monorepoRoot, 'node_modules'),
      'node_modules',
    ],
  },
  server: {
    fs: {
      allow: [monorepoRoot],
    },
  },
})
