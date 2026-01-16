import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { writeFileSync } from 'fs';
import { resolve } from 'path';
import crypto from 'node:crypto'; 

// Parche de seguridad
if (!globalThis.crypto) {
  // @ts-ignore
  globalThis.crypto = crypto.webcrypto;
}

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-htaccess',
      closeBundle() {
         // (Aquí iría lo de htaccess, lo dejamos simple para que no estorbe)
      }
    }
  ],
  base: './', 
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    port: 5173,
    host: true, 
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8080', // El puente hacia el backend
        changeOrigin: true,
        secure: false
      }
    }
  }
});