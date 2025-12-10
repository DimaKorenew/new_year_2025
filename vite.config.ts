import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/new-year-2025/',
  build: {
    outDir: 'dist/client',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
  },
  server: {
    middlewareMode: false,
  },
  ssr: {
    noExternal: ['react', 'react-dom', 'react-router-dom'],
    resolve: {
      conditions: ['node'],
    },
  },
  optimizeDeps: {
    include: ['react-router-dom'],
  },
})
