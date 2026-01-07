// vite.config.js
export default defineConfig({
  plugins: [react()],
  base: './', 
  server: {
    host: '0.0.0.0',
    port: 5173,
    hmr: false, 
    allowedHosts: [
      'lingo.console.aliyun.com', 
      '.aliyun.com', 
      'localhost'
    ],
    
    // 👇👇 修改代理配置，使用标准前缀
    proxy: {
      '/api/coze': { // 👈 1. 改为以 / 开头的标准前缀
        target: 'https://api.coze.cn',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/coze/, '') // 👈 2. 去掉前缀
      }
    }
  }
});

