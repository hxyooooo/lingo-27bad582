import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    host: '0.0.0.0',
    port: 5173,
    hmr: false, // 关闭热更新，消除 WebSocket 报错干扰
    allowedHosts: true,
    proxy: {
      // 只要看到 /api 开头的请求，就转发给 8000 端口
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        // 这里很关键：把 '/api/run' 重写为 '/run' 发给 Python
        rewrite: (path) => path.replace(/^\/api/, '') 
      }
    }
  }
});

