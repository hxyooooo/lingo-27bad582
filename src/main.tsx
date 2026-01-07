import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

window.addEventListener('unhandledrejection', (event) => {
  // 1. 阻止错误向上冒泡，防止触发 DataCloneError
  event.preventDefault();
  
  // 2. 打印出真正的“幕后黑手”
  console.log('%c >>> 捕获到真实错误: ', 'background: #ff0000; color: #fff', event.reason);
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
