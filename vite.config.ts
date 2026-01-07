import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // 1. 确保资源加载使用相对路径
  base: './', 
  
  server: {
    // 允许局域网访问
    host: '0.0.0.0',
    port: 5173,
    
    // 2. 彻底关闭热更新，根除 WebSocket 报错
    hmr: false, 

    // 3. 👇👇👇 这里就是解决你刚才那个报错的关键 👇👇👇
    allowedHosts: [
      'lingo.console.aliyun.com', // 明确允许阿里云 IDE 域名
      '.aliyun.com',              // 允许所有阿里云子域名
      'localhost'
    ],

    // 4. 代理配置，解决 API 跨域
    proxy: {
      '^.*/coze-api': {
        target: 'https://api.coze.cn',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^.*\/coze-api/, '')
      }
    }
  }
});
