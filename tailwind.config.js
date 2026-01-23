/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        'void': '#0a0a0b',
        'surface': '#141416',
        'surface-raised': '#1c1c1f',
        'border': '#2a2a2e',
        'accent': '#3b82f6',
        'accent-bright': '#60a5fa',
        'approved': '#22c55e',
        'denied': '#ef4444',
        'pending': '#f59e0b',
        'text-primary': '#fafafa',
        'text-secondary': '#a1a1aa',
        'text-muted': '#71717a',
      },
      fontFamily: {
        'display': ['IBM Plex Mono', 'monospace'],
        'body': ['IBM Plex Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
