import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    host: '0.0.0.0',
    port: 5173,
    hmr: false,
    allowedHosts: ['all'], // 允许阿里云访问
    proxy: {
      // 🟢 关键：把 /api 开头的请求转发给本地 Python 后端 (8000端口)
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '') 
      }
    }
  }
});

