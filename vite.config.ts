import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    // allowedHosts: true, // 如果报错可以先把这行注释掉，通常不需要
    
    // 👇 注意：proxy 必须在 server 内部，并且前面要有逗号
    proxy: {
      '/coze-api': {
        target: 'https://7kf89hm5y6.coze.site',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/coze-api/, '')
      }
    }
  }
});
