import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // 允许局域网/云环境访问
    host: '0.0.0.0', 
    port: 5173,
    
    // 👇 关键修复：允许阿里云的所有子域名访问，不再拦截
    allowedHosts: [
      'lingo.console.aliyun.com',
      '.aliyun.com',
      'localhost',
      '127.0.0.1'
    ],
    
    // 👇 关键修复：解决 WebSocket 连接失败
    hmr: {
      protocol: 'wss', // 强制使用加密 WebSocket
      clientPort: 443, // 强制浏览器通过 443 端口连接（云 IDE 都是通过 HTTPS 转发的）
    },

    // 你的 API 代理配置（保持不变）
    proxy: {
      '/coze-api': {
        target: 'https://api.coze.cn', // 注意：如果是国内版用 .cn，国际版用 .com
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/coze-api/, '')
      }
    }
  }
});
