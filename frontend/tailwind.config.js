/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#F6F3FB',
          surface: '#FFFFFF',
          border: '#EAE4F5',
          'border-light': '#F3EEFB',
          primary: '#6B35D9',
          'primary-hover': '#5B29C5',
          'primary-light': '#F3EEFF',
          secondary: '#8B5CF6',
          dark: '#1E1B2E',
          muted: '#6B7280',
          heading: '#1E1B2E',
        },
        zorevi: {
          purple: '#6B35D9',
          violet: '#8B5CF6',
          lavender: '#EDE8F8',
          'lavender-light': '#F8F6FD',
          mint: '#10B981',
          'mint-bg': '#ECFDF5',
          amber: '#F59E0B',
          'amber-bg': '#FEF3C7',
          blue: '#3B82F6',
          'blue-bg': '#DBEAFE',
          slate: '#1E1B2E',
          gray: '#6B7280',
          card: '#FFFFFF',
          border: '#EAE4F5',
        }
      },
      boxShadow: {
        'zorevi': '0 4px 20px rgba(108, 43, 217, 0.05)',
        'zorevi-sm': '0 2px 10px rgba(108, 43, 217, 0.04)',
        'zorevi-md': '0 8px 30px rgba(108, 43, 217, 0.08)',
        'zorevi-lg': '0 12px 40px rgba(108, 43, 217, 0.12)',
        'purple-glow': '0 8px 24px rgba(107, 53, 217, 0.28)',
      },
      borderRadius: {
        'card': '18px',
        'btn': '12px',
        'pill': '9999px',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
