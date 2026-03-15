import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Allow overriding the base path at build time via the BASE_PATH env var.
// Useful for deploying to GitHub Pages under a repository subpath.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')

  return {
    base: env.BASE_PATH || '/',
    plugins: [react()],
  }
})
