import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss() ],
  server: {
    proxy: {
      '/api': {
        target: 'https://shortner-azure.vercel.app/',
        changeOrigin: true,
        rewrite: (path) => {
          // Remove /api prefix and forward the rest
          const newPath = path.replace(/^\/api/, '');
          console.log(`Proxying ${path} -> ${newPath}`);
          return newPath;
        },
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request:', req.method, req.url, '->', proxyReq.path);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response:', proxyRes.statusCode, req.url);
          });
        },
      },
    },
  },
})
