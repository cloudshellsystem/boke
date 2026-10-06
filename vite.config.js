import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Tailwind CSS v4 se pilote via son plugin Vite (plus besoin de tailwind.config.js 
// ni de postcss.config.js séparés : le thème se définit directement en CSS, voir src/index.css).
export default defineConfig({
  plugins: [react(), tailwindcss()],
  root: path.resolve(__dirname),
  resolve: {
    preserveSymlinks: true,
  },
  build: {
    rollupOptions: {
      input: path.resolve(__dirname, 'index.html'),
    },
  },
})