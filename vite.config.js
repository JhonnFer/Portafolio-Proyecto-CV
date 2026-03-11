import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  // Resuelve rutas relativas desde la raíz del proyecto
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main:  resolve(__dirname, 'index.html'),
        admin: resolve(__dirname, 'admin/index.html'),
      },
    },
  },
})