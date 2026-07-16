/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        'bg-primary': 'var(--color-bg-primary)',
        'bg-secondary': 'var(--color-bg-secondary)',
        'bg-card': 'var(--color-bg-card)',
        'accent-cyan': 'var(--color-accent-primary)',
        'accent-purple': 'var(--color-accent-secondary)',
        'accent-pink': 'var(--color-accent-pink)',
        'accent-green': 'var(--color-accent-green)',
        'accent-yellow': 'var(--color-accent-yellow)',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'border-glow': 'var(--color-border-glow)',
      },
      boxShadow: {
        'glow-cyan': '0 0 20px var(--color-accent-primary)',
        'glow-purple': '0 0 20px var(--color-accent-secondary)',
        'glow-green': '0 0 20px var(--color-accent-green)',
        'glow-pink': '0 0 20px var(--color-accent-pink)',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'circuit-flow': 'circuit-flow 8s linear infinite',
        'typing': 'typing 3.5s steps(40, end)',
        'blink': 'blink 1s step-end infinite',
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'scan-line': 'scan-line 4s linear infinite',
        'pulse-border': 'pulse-border 1.5s ease-in-out infinite',
        'progress': 'progress 1s ease-out forwards',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 5px var(--color-accent-primary)' },
          '50%': { boxShadow: '0 0 20px var(--color-accent-primary)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'circuit-flow': {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' },
        },
        'typing': {
          'from': { width: '0' },
          'to': { width: '100%' },
        },
        'blink': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-border': {
          '0%, 100%': { borderColor: 'var(--color-border)' },
          '50%': { borderColor: 'var(--color-accent-primary)' },
        },
        'progress': {
          '0%': { width: '0%' },
          '100%': { width: 'var(--progress-width, 100%)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
        'scan-line': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};