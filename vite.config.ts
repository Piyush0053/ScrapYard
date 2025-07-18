import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': { // Updated proxy to match the new API prefix
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
