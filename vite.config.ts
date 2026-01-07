import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',
  
  server: {
    host: '0.0.0.0',
    port: 5173,
    hmr: false, // 关闭 HMR，解决 WebSocket 错误
    cors: true,
    
    proxy: {
      '/api/coze': {
        target: 'https://api.coze.cn',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/coze/, '')
      }
    }
  }
});
