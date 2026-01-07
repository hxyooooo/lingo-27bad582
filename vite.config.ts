import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // 相对路径
  server: {
    host: '0.0.0.0',
    port: 5173,
    hmr: false, // 彻底关闭 WebSocket，不再报错
    allowedHosts: ['all'], // 允许所有
    proxy: {
      // 只要路径里包含 coze-api，就走代理
      '^.*/coze-api': {
        target: 'https://api.coze.cn', // 目标地址
        changeOrigin: true,            // 必须为 true，欺骗后端
        secure: false,                 // 接受无效证书
        // 把路径中的 /.../coze-api 替换为空，只保留后面的 API 路径
        rewrite: (path) => path.replace(/^.*\/coze-api/, '')
      }
    }
  }
});


