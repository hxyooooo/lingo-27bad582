import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // 确保相对路径加载资源，防止白屏
  base: './', 
  server: {
    host: '0.0.0.0', // 允许阿里云外部访问
    port: 5173,
    
    // 🟢 关键：关闭热更新。
    // 在Workbench这种复杂代理环境下，WebSocket极易失败。
    // 关闭后，修改代码需要手动刷新浏览器，但能保证控制台干干净净，不报错。
    hmr: false, 
    
    // 解决 "Invalid Host header" 问题（部分Vite版本需要）
    cors: true,

    proxy: {
      // 🟢 代理配置
      // 拦截所有以 /api 开头的请求
      '/api': {
        target: 'http://127.0.0.1:8000', // 转发给后端 Python 服务
        changeOrigin: true,
        secure: false,
        // 🟢 路径重写：
        // 前端请求: /api/run
        // 后端收到: /run
        rewrite: (path) => path.replace(/^\/api/, '') 
      }
    }
  }
});


