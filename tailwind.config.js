/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#5B8DEF',      // 浅青花蓝
        'primary-light': '#E6F0FF',
        'primary-dark': '#2E66E0',
        secondary: '#8B5FBF',    // 淡紫罗兰
        'secondary-light': '#F5EEFF',
        'secondary-dark': '#6D4C9A',
        success: '#52C41A',      // 浅松绿
        'success-light': '#E6FFE6',
        'success-dark': '#3D8C13',
        warning: '#FAAD14',      // 淡赭石
        'warning-light': '#FFF7E6',
        'warning-dark': '#D48800',
        error: '#F5222D',        // 薄朱砂
        'error-light': '#FFE6E6',
        'error-dark': '#D9363E',
        info: '#177DDC',         // 深天青
        'info-light': '#E6F7FF',
        'info-dark': '#095CB5',
        background: '#F8FAFC',   // 浅米白
        surface: '#FFFFFF',      // 洁白
        text: '#262626',         // 深灰
        'text-secondary': '#595959',
        'text-tertiary': '#8C8C8C',
        border: '#D9D9D9',       // 浅灰
        'border-light': '#F0F0F0'
      }
    },
  },
  plugins: [],
}