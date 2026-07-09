import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // En desarrollo, las peticiones a /api se reenvían al backend local (puerto 3001).
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Separa las librerías grandes en su propio archivo para que se descarguen
        // en paralelo y se aprovechen mejor en la caché del navegador.
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.includes('firebase') ? 'firebase' : 'vendor'
          }
        },
      },
    },
  },
})
