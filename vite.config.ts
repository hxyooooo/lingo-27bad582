import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // 保持相对路径
  server: {
    host: '0.0.0.0',
    port: 5173,
    
    // 🟢 保持关闭热更新，避免 WebSocket 报错
    hmr: false,

    // 🔥🔥🔥 新增配置：允许阿里云的域名访问 🔥🔥🔥
    allowedHosts: [
      'lingo.console.aliyun.com', // 允许特定的阿里云域名
      '.aliyun.com'               // 或者允许所有阿里云子域名（更保险）
    ],
    // 如果上面写域名还是报错，可以直接用：
    // allowedHosts: true,

    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
});



