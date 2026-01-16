import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary brand colors - warm and appetizing
        primary: {
          50: '#FFF5F0',
          100: '#FFEBE0',
          200: '#FFD4BD',
          300: '#FFB899',
          400: '#FF9466',
          500: '#FF6B35', // Main primary
          600: '#E55A2B',
          700: '#CC4A22',
          800: '#993818',
          900: '#66250F',
        },
        // Secondary - deep trust blue
        secondary: {
          50: '#E8ECF0',
          100: '#D1D9E1',
          200: '#A3B3C3',
          300: '#758DA5',
          400: '#476787',
          500: '#2E4057', // Main secondary
          600: '#253346',
          700: '#1C2634',
          800: '#131A23',
          900: '#0A0D11',
        },
        // Accent - fresh teal
        accent: {
          50: '#E6F5F4',
          100: '#CCEBE9',
          200: '#99D7D4',
          300: '#66C3BE',
          400: '#48A9A6', // Main accent
          500: '#3A8A87',
          600: '#2D6B69',
          700: '#1F4C4A',
          800: '#122D2C',
          900: '#050F0E',
        },
        // Semantic colors
        success: {
          50: '#ECFDF5',
          500: '#10B981',
          600: '#059669',
        },
        warning: {
          50: '#FFFBEB',
          500: '#F59E0B',
          600: '#D97706',
        },
        error: {
          50: '#FEF2F2',
          500: '#EF4444',
          600: '#DC2626',
        },
        // Surface colors
        surface: {
          light: '#FFFFFF',
          dark: '#1F2937',
        },
        background: {
          light: '#FAFAFA',
          dark: '#111827',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Typography scale from design system
        'display': ['3rem', { lineHeight: '3.5rem', fontWeight: '700' }],
        'h1': ['2rem', { lineHeight: '2.5rem', fontWeight: '700' }],
        'h2': ['1.5rem', { lineHeight: '2rem', fontWeight: '600' }],
        'h3': ['1.25rem', { lineHeight: '1.75rem', fontWeight: '600' }],
        'body': ['1rem', { lineHeight: '1.5rem', fontWeight: '400' }],
        'caption': ['0.875rem', { lineHeight: '1.25rem', fontWeight: '400' }],
        'small': ['0.75rem', { lineHeight: '1rem', fontWeight: '400' }],
      },
      spacing: {
        // Spacing scale (4px base)
        'xs': '0.25rem',   // 4px
        'sm': '0.5rem',    // 8px
        'md': '1rem',      // 16px
        'lg': '1.5rem',    // 24px
        'xl': '2rem',      // 32px
        '2xl': '3rem',     // 48px
        '3xl': '4rem',     // 64px
      },
      borderRadius: {
        'soft': '0.75rem',
        'card': '1rem',
        'button': '0.5rem',
      },
      boxShadow: {
        // Neumorphism / Soft UI shadows
        'soft': '8px 8px 16px rgba(0, 0, 0, 0.1), -8px -8px 16px rgba(255, 255, 255, 0.8)',
        'soft-dark': '8px 8px 16px rgba(0, 0, 0, 0.3), -8px -8px 16px rgba(255, 255, 255, 0.05)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.1)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 10px 25px -3px rgba(0, 0, 0, 0.15), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
      },
      backdropBlur: {
        'glass': '16px',
      },
      animation: {
        'skeleton': 'skeleton 1.5s ease-in-out infinite',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        skeleton: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.7' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
