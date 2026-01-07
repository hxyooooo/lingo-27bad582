import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    host: '0.0.0.0',
    port: 5173,
    hmr: false,
    
    // 🔥🔥 修改这里：设置为 true，允许任何域名访问，彻底解决 Blocked request 报错 🔥🔥
    allowedHosts: true, 
    
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
});
