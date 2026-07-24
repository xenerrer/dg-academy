import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      /**
       * Cores referenciam as CSS vars de src/index.css (canais rgb) para os
       * modificadores de alpha do Tailwind funcionarem. Fonte única de verdade:
       * o valor mora no :root, aqui só se dá nome. Ver docs/10-TOKENS.md.
       */
      colors: {
        dg: {
          yellow: 'rgb(var(--dg-yellow) / <alpha-value>)',
          yellowSoft: 'rgb(var(--dg-yellow-soft) / <alpha-value>)',
          bg: 'rgb(var(--dg-bg) / <alpha-value>)',
          card: 'rgb(var(--dg-card) / <alpha-value>)',
          card2: 'rgb(var(--dg-card2) / <alpha-value>)',
          line: 'rgb(var(--dg-line) / <alpha-value>)',
          text: 'rgb(var(--dg-text) / <alpha-value>)',
          muted: 'rgb(var(--dg-muted) / <alpha-value>)',
          success: 'rgb(var(--dg-success) / <alpha-value>)',
          danger: 'rgb(var(--dg-danger) / <alpha-value>)',
          info: 'rgb(var(--dg-info) / <alpha-value>)',
        },
        /**
         * Cores de gráfico. Validadas com o validador do skill de dataviz — não
         * trocar no olho. mark/mark2/mark3 = ramp ORDINAL de um hue (amarelo DG),
         * usado onde a ordem importa (pódio). Ver docs/05 §8.
         */
        chart: {
          mark: 'rgb(var(--chart-mark) / <alpha-value>)',
          mark2: 'rgb(var(--chart-mark-2) / <alpha-value>)',
          mark3: 'rgb(var(--chart-mark-3) / <alpha-value>)',
          muted: 'rgb(var(--chart-muted) / <alpha-value>)',
          grid: 'rgb(var(--chart-grid) / <alpha-value>)',
        },
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        cover: ['Montserrat', 'sans-serif'],
      },
      /**
       * Escala tipográfica semântica. Use estes nomes no lugar de text-[Npx]
       * solto — é o que mantém tipografia consistente entre páginas.
       * [tamanho, line-height]
       */
      fontSize: {
        eyebrow: ['10.5px', { lineHeight: '1.4' }],
        caption: ['11.5px', { lineHeight: '1.5' }],
        label: ['12.5px', { lineHeight: '1.4' }],
        body: ['14px', { lineHeight: '1.6' }],
        'body-lg': ['15px', { lineHeight: '1.6' }],
        subtitle: ['17px', { lineHeight: '1.35' }],
        title: ['21px', { lineHeight: '1.2' }],
        heading: ['26px', { lineHeight: '1.15' }],
        display: ['30px', { lineHeight: '1.05' }],
      },
      /**
       * Raios SEMÂNTICOS (nomes novos, não colidem com rounded-lg/2xl do
       * Tailwind — por isso não quebram o que já existe). Use pela intenção:
       * rounded-control em botões/inputs, rounded-surface em cards, etc.
       */
      borderRadius: {
        control: 'var(--radius-control)',
        poster: 'var(--radius-poster)',
        surface: 'var(--radius-surface)',
        modal: 'var(--radius-modal)',
      },
      transitionTimingFunction: {
        'out-dg': 'var(--ease-out-dg)',
        'spring-dg': 'var(--ease-spring-dg)',
      },
      transitionDuration: {
        fast: '180ms',
        base: '280ms',
        slow: '500ms',
        slower: '900ms',
      },
      keyframes: {
        bump: { '40%': { transform: 'scale(1.2)' } },
        shake: {
          '20%': { transform: 'translateX(-6px) rotate(-0.6deg)' },
          '45%': { transform: 'translateX(6px) rotate(0.6deg)' },
          '70%': { transform: 'translateX(-3px)' },
        },
        fadeUp: { from: { opacity: '0', transform: 'translateY(20px)' } },
        seloIn: { from: { opacity: '0', transform: 'scale(0.2) rotate(-16deg)' } },
        kenburns: {
          from: { transform: 'scale(1.08)' },
          to: { transform: 'scale(1.16) translate3d(-1.4%, -1%, 0)' },
        },
        // anel do avatar vazio: respira, chamando o toque
        respira: {
          '0%, 100%': { opacity: '0.35', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.04)' },
        },
        gira: { to: { transform: 'rotate(360deg)' } },
        entraDaDireita: { from: { opacity: '0', transform: 'translateX(24px)' } },
      },
      animation: {
        bump: 'bump 0.5s',
        shake: 'shake 0.4s',
        fadeUp: 'fadeUp 0.35s ease-out',
        seloIn: 'seloIn 0.7s cubic-bezier(0.3, 1.7, 0.5, 1)',
        kenburns: 'kenburns 34s ease-in-out infinite alternate',
        respira: 'respira 2.4s ease-in-out infinite',
        gira: 'gira 4s linear infinite',
        entraDaDireita: 'entraDaDireita 0.35s cubic-bezier(0.2, 0.7, 0.2, 1)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config
