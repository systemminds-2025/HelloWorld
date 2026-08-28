import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Served from a folder of its own rather than a domain root, the way a project
// sits inside htdocs. The agent VM reads this `base` to decide where to mount
// the checkout, so the built asset paths and the served path agree.
export default defineConfig({
  base: '/react-ui-demo/',
  plugins: [react()],
  build: { outDir: 'dist' },
})
