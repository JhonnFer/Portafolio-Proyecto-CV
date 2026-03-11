import { defineConfig } from 'vite'

export default defineConfig({
  // Permite que el admin tenga su propio entry point
  build: {
    rollupOptions: {
      input: {
        main:  'index.html',
        admin: 'admin/index.html',
      },
    },
  },
})