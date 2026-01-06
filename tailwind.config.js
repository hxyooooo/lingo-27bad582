/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4A90E2', // 浅青花蓝
          light: '#D6E4F0',   // 浅青花蓝浅色
          dark: '#357ABD',    // 浅青花蓝深色
        },
        secondary: {
          DEFAULT: '#D2691E', // 淡赭石色
          light: '#E8C4A8',   // 淡赭石色浅色
          dark: '#A0522D',    // 淡赭石色深色
        },
        success: {
          DEFAULT: '#52C41A', // 浅松绿
          light: '#D9F7BE',   // 浅松绿浅色
          dark: '#389E0D',    // 浅松绿深色
        },
        warning: {
          DEFAULT: '#FAAD14', // 淡藤黄
          light: '#FFFBE6',   // 淡藤黄浅色
          dark: '#D48806',    // 淡藤黄深色
        },
        error: {
          DEFAULT: '#F5222D', // 铁红
          light: '#FFECE8',   // 铁红浅色
          dark: '#CF1322',    // 铁红深色
        },
        background: '#F5F7FA', // 淡月白
        info: '#177DDC',      // 浅天青
        light: '#FAFBFC',     // 淡云白
        dark: '#0A0A0A',      // 墨色
      },
    },
  },
  plugins: [],
}