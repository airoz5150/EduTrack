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
})
