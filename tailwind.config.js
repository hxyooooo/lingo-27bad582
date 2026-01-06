/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#1890ff',
        'primary-light': '#e6f7ff',
        'secondary': '#52c41a',
        'accent': '#fa8c16',
        'background': '#f0f2f5',
        'text-primary': '#333',
        'text-secondary': '#666',
        'text-tertiary': '#999',
        'border': '#d9d9d9',
        'error': '#ff4d4f',
        'warning': '#fa8c16',
        'success': '#52c41a',
        'info': '#1890ff',
        'light-blue': '#e6f7ff',
        'light-green': '#f6ffed',
        'light-orange': '#fff7e6',
        'light-gray': '#f5f5f5',
        'dark-gray': '#ccc',
        'white': '#ffffff',
        'black': '#000000'
      },
      boxShadow: {
        'custom': '0 4px 12px rgba(0, 0, 0, 0.08)',
        'hover': '0 6px 16px rgba(0, 0, 0, 0.12)'
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 }
        },
        slideUp: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' }
        }
      }
    },
  },
  plugins: [],
}