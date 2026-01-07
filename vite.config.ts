import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    // 允许阿里云的域名访问
    allowedHosts: [
      'lingo.console.aliyun.com',
      '.aliyun.com',
      'localhost'
    ],
    
    // 👇👇👇 关键修复：解决 WebSocket (wss) 连接报错 👇👇👇
    hmr: {
      // 云端 IDE 通常通过 HTTPS (443) 转发，这里强制指定客户端端口为 443
      clientPort: 443, 
    },

    // API 代理配置
    proxy: {
      '/coze-api': {
        target: 'https://7kf89hm5y6.coze.site',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/coze-api/, '')
      }
    }
  }
});
