// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // --- ¡AÑADE ESTA SECCIÓN COMPLETA! ---
  server: {
    proxy: {
    '/api/v1': { // <-- Que coincida con la baseURL
        target: 'http://54.197.208.230:31338',
        changeOrigin: true,
        // Ahora la reescritura es diferente
        rewrite: (path) => path.replace(/^\/api\/v1/, '/api/v1'), // Mantenemos /api/v1
    },

    },
  },
})