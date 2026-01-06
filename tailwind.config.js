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
          DEFAULT: '#4A90E2', // 浅青花蓝主色
          light: '#85B8F0',   // 浅青花蓝亮色
          dark: '#2A5A99',    // 浅青花蓝暗色
        },
        secondary: {
          DEFAULT: '#F5A623', // 深赭石色
          light: '#F8C466',   // 浅赭石色
          dark: '#D98B0D',    // 深赭石暗色
        },
        success: {
          DEFAULT: '#50C878', // 浅松绿
          light: '#81D8A3',   // 浅松绿亮色
          dark: '#38A85A',    // 浅松绿暗色
        },
        warning: {
          DEFAULT: '#FFD700', // 浅铬黄
          light: '#FFE566',   // 浅铬黄亮色
          dark: '#D9B800',    // 浅铬黄暗色
        },
        error: {
          DEFAULT: '#FF4757', // 珊瑚红
          light: '#FF7A85',   // 珊瑚红亮色
          dark: '#D93A49',    // 珊瑚红暗色
        },
        info: {
          DEFAULT: '#2E86AB', // 浅青蓝
          light: '#5BA1C3',   // 浅青蓝亮色
          dark: '#246A88',    // 浅青蓝暗色
        },
        background: {
          DEFAULT: '#F8F9FA', // 背景色
        },
        text: {
          DEFAULT: '#212529', // 文本色
          secondary: '#495057', // 次要文本色
        },
        light: {
          blue: '#E6F7FF',    // 浅蓝色背景
          orange: '#FFF2E8',  // 浅橙色背景
          green: '#F6FFED',   // 浅绿色背景
          red: '#FFF1F0',     // 浅红色背景
          yellow: '#FEFCE8',  // 浅黄色背景
        }
      }
    },
  },
  plugins: [],
}