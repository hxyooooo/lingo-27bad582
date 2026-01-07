import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    host: '0.0.0.0',
    port: 5173,
    hmr: false, // 关闭热更新（WebSocket）以避免连接报错
    
    // 👇👇👇 重点修改这里 👇👇👇
    // 允许阿里云的这个特定域名访问
    allowedHosts: ['lingo.console.aliyun.com'], 
    
    proxy: {
      // 保持之前的代理配置，用于转发给 Python 后端
      '/api': {
        target: 'http://127.0.0.1:8000', // 确保这里是你 Python 运行的端口
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
});
