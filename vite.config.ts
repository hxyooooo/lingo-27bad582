import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // 保证资源使用相对路径加载
  server: {
    host: '0.0.0.0',
    port: 5173,
    // 🔴 彻底关闭热更新（HMR），解决 WebSocket 报错
    hmr: false, 
    // 🔴 允许所有域名访问，解决 Blocked host 报错
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

