import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // 允许外部访问
    // 👇 关键修改：将报错提示的域名加入允许列表
    allowedHosts: ['lingo.console.aliyun.com'],
    
    // 👇 之前的代理配置必须保留，否则 API 还是会报错
    proxy: {
      '/coze-api': {
        target: 'https://7kf89hm5y6.coze.site',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/coze-api/, '')
      }
    }
  }
});
