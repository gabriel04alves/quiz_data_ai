import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/components/**/*.{vue,js,ts}',
    './app/layouts/**/*.vue',
    './app/pages/**/*.vue',
    './app/app.vue',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00754a',
        'primary-strong': '#006241',
        accent: '#ef8943',
        ink: '#17392f',
        surface: '#ffffff',
        // Verde principal a 5% sobre branco: superfície sutil sem criar nova família de cor.
        'surface-muted': '#f2f8f6',
        // Verde principal a 20% sobre branco: divisórias coerentes com a paleta da marca.
        border: '#cce3db',
        // Estados do quiz derivados diretamente da paleta oficial da Selbetti.
        correct: '#00754a',
        incorrect: '#ef8943',
        timeout: '#17392f',
        difficulty: {
          // Fácil usa o verde principal para comunicar um ponto de entrada acessível.
          easy: '#00754a',
          // Médio usa o laranja de destaque para indicar atenção crescente.
          medium: '#ef8943',
          // Difícil usa o verde mais profundo para comunicar maior densidade.
          hard: '#17392f',
        },
      },
      fontFamily: {
        brand: ['Segoe UI', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        display: ['clamp(2.5rem, 8vw, 4.5rem)', { lineHeight: '0.95', letterSpacing: '-0.035em', fontWeight: '700' }],
        title: ['clamp(1.75rem, 4vw, 2.5rem)', { lineHeight: '1.1', letterSpacing: '-0.025em', fontWeight: '700' }],
        heading: ['1.25rem', { lineHeight: '1.35', fontWeight: '700' }],
        body: ['1rem', { lineHeight: '1.6' }],
        small: ['0.875rem', { lineHeight: '1.5' }],
        label: ['0.75rem', { lineHeight: '1.25', letterSpacing: '0.08em', fontWeight: '700' }],
      },
    },
  },
  plugins: [],
} satisfies Config
