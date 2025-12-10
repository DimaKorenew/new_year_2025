import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    ssr: true,
    rollupOptions: {
      input: {
        server: resolve(__dirname, 'src/entry-server.tsx'),
        'utils/crawlerDetection': resolve(__dirname, 'src/utils/crawlerDetection.ts'),
      },
      output: {
        dir: 'dist/server',
        format: 'es',
        entryFileNames: '[name].js',
      },
    },
  },
  ssr: {
    noExternal: true,
  },
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
})

