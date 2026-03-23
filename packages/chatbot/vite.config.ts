import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  return {
    plugins: [react()],
    server: {
      port: parseInt(env.VITE_PORT || '3000', 10),
      // allowedHosts: ['']
    },
    build: {
      lib: {
        entry: resolve(__dirname, 'src/main.tsx'),
        name: 'ChatbotOQA',
        fileName: (format) => `index.min.${format === 'iife' ? 'mjs' : 'js'}`
      },
      rollupOptions: {
        output: {
          manualChunks: undefined,
          sourcemap: false,
          format: 'iife'
        }
      }
    },
  }
})
