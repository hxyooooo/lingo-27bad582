import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    
    // 👇👇👇 关键修改：彻底关闭热更新 (HMR) 👇👇👇
    // 这会停止浏览器尝试建立 WebSocket 连接，彻底消除报错
    hmr: false,

    // 允许所有域名访问（防止 invalid host header 报错）
    allowedHosts: [
      'lingo.console.aliyun.com',
      '.aliyun.com',
      'localhost',
      '127.0.0.1'
    ],

    // API 代理配置（保持不变，这才是 AI 能用的关键）
    proxy: {
      '/coze-api': {
        target: 'https://api.coze.cn', // 如果你是用 coze.com 请改为 coze.com
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/coze-api/, '')
      }
    }
  }
});

