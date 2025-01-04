import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    hmr: {
      clientPort: 4367,
    },
    watch: {
      usePolling: true,
    },
    host: true,
    strictPort: true,
    port: 4367,
  }
})
