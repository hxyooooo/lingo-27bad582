import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // 关键 1: 设置基础路径为相对路径，适应云端子目录
  base: './', 
  
  server: {
    host: '0.0.0.0',
    port: 5173,
    // 关键 2: 彻底关闭 HMR，根除 WebSocket 报错
    hmr: false, 
    
    // 允许所有域名
    allowedHosts: [
      'lingo.console.aliyun.com',
      '.aliyun.com',
      'localhost',
      '127.0.0.1'
    ],

    proxy: {
      '^.*/coze-api': {
        target: 'https://api.coze.cn', // 代理要把请求转给这里
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^.*\/coze-api/, '')
      }
		}
  }
});


