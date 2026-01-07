import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // 1. 设置相对路径
  base: './', 
  
  server: {
    host: '0.0.0.0',
    port: 5173,
    // 2. 彻底关闭热更新 WebSocket，消除红色报错噪音
    hmr: false, 

    // 3. 允许阿里云 IDE 的域名访问 (解决 Blocked request 报错)
    allowedHosts: [
      'lingo.console.aliyun.com',
      '.aliyun.com',
      'localhost',
      '.console.aliyun.com'
    ],

    // 4. 代理配置 (解决 CORS 跨域)
    proxy: {
      // 匹配所有以 /coze-api 开头的请求
      '/coze-api': {
        target: 'https://api.coze.cn', // 转发目标
        changeOrigin: true,            // 欺骗后端
        secure: false,                 // 忽略证书问题
        // 把路径里的 /coze-api 替换为空字符串，只发后面的部分
        rewrite: (path) => path.replace(/^\/coze-api/, '')
      }
    }
  }
});

