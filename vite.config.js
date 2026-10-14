import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ command }) => ({
  // 'serve' correspond au mode dev local (npm run dev), '/' fonctionne parfaitement
  // 'build' correspond à la production (Vercel), './' reste en place pour les chemins relatifs
  base: command === 'serve' ? '/' : './',
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-router')) {
              return 'vendor-react';
            }
            return 'vendor';
          }
        },
      },
    },
  },
}));