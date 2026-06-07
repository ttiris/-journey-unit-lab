module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx}'
  ],
  theme: {
    extend: {
      colors: {
        // Y2K + makemepulse palette
        // Dark backgrounds
        'dark-bg': '#0A0A0A',
        'dark-surface': '#1A1A1A',
        
        // Neon/Strong colors (makemepulse style)
        'neon-pink': '#FF1493',
        'neon-blue': '#0066FF',
        'neon-yellow': '#FFFF00',
        'neon-magenta': '#FF00FF',
        'neon-cyan': '#00FFFF',
        
        // Y2K Candy colors (soft, low saturation)
        'candy-pink': '#F5CECE',
        'candy-purple': '#E8D5F2',
        'candy-blue': '#D5E8F7',
        'candy-yellow': '#FFF4E6',
        'candy-mint': '#D5F5E3',
        
        // Accents
        'accent-gold': '#FFD700',
        'accent-silver': '#E8E8E8'
      },
      backgroundColor: {
        'glass': 'rgba(255, 255, 255, 0.1)',
        'glass-dark': 'rgba(0, 0, 0, 0.4)'
      },
      backdropFilter: {
        'blur': 'blur(10px)'
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'blob-morph': 'blob-morph 7s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
        'ripple': 'ripple 0.6s ease-out',
        'scale-in': 'scale-in 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' }
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' }
        },
        'blob-morph': {
          '0%, 100%': { borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%' },
          '50%': { borderRadius: '70% 30% 46% 54% / 30% 30% 70% 70%' }
        },
        'shimmer': {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' }
        },
        'ripple': {
          '0%': {
            transform: 'scale(0)',
            opacity: '1'
          },
          '100%': {
            transform: 'scale(4)',
            opacity: '0'
          }
        },
        'scale-in': {
          '0%': {
            opacity: '0',
            transform: 'scale(0.95)'
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1)'
          }
        }
      },
      boxShadow: {
        'neon-pink': '0 0 10px rgba(255, 20, 147, 0.5)',
        'neon-blue': '0 0 10px rgba(0, 102, 255, 0.5)',
        'neon-purple': '0 0 10px rgba(232, 213, 242, 0.5)',
        'glow': '0 0 20px rgba(255, 255, 255, 0.1)',
        'glow-strong': '0 0 30px rgba(255, 255, 255, 0.2)'
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce-smooth': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
      }
    }
  },
  plugins: [
    // Custom backdrop filter plugin
    ({ addUtilities }) => {
      addUtilities({
        '.backdrop-blur-glass': {
          '@apply backdrop-blur-xl bg-opacity-80': {}
        }
      })
    }
  ]
}
