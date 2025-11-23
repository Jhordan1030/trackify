import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true
  },
  // ✅ CONFIGURACIÓN PARA VERCEL
  build: {
    outDir: 'dist',
    sourcemap: false,
    // Optimizaciones para producción
    minify: 'esbuild',
    target: 'esnext',
    // Configuración para SPA
    rollupOptions: {
      input: './index.html'
    }
  },
  // ✅ IMPORTANTE: Configuración base para rutas
  base: '/',
  // ✅ Precargar recursos
  preview: {
    port: 4173,
    host: true
  }
})