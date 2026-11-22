/**
 * Tailwind preset shared by all three apps. Colors point at the CSS variables in tokens.css,
 * so light and dark mode switch without any `dark:` classes.
 *
 * Use it like:  bg-surface  text-fg  border-line  bg-brand text-on-brand  text-fg-muted
 *               bg-success-soft text-success  (and warning / danger / info the same way)
 */
/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: { DEFAULT: 'var(--surface)', 2: 'var(--surface-2)' },
        line: { DEFAULT: 'var(--line)', strong: 'var(--line-strong)' },
        fg: { DEFAULT: 'var(--fg)', 2: 'var(--fg-2)', muted: 'var(--fg-muted)' },
        brand: { DEFAULT: 'var(--brand)', ink: 'var(--brand-ink)', soft: 'var(--brand-soft)' },
        'on-brand': 'var(--on-brand)',
        accent: { DEFAULT: 'var(--accent)', ink: 'var(--accent-ink)', soft: 'var(--accent-soft)' },
        'on-accent': 'var(--on-accent)',
        success: { DEFAULT: 'var(--success)', fill: 'var(--success-fill)', soft: 'var(--success-soft)' },
        warning: { DEFAULT: 'var(--warning)', fill: 'var(--warning-fill)', soft: 'var(--warning-soft)' },
        danger: { DEFAULT: 'var(--danger)', fill: 'var(--danger-fill)', soft: 'var(--danger-soft)' },
        info: { DEFAULT: 'var(--info)', soft: 'var(--info-soft)' },
        // Industry colors (same in light and dark)
        industrial: '#7C3AED',
        automobile: '#2563EB',
        electronics: '#0891B2',
        // Job status colors
        status: {
          posted: '#64748B',
          matched: '#2563EB',
          enroute: '#D97706',
          progress: '#7C3AED',
          completed: '#16A34A',
          cancelled: '#DC2626',
          disputed: '#EA580C',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Space Grotesk', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
      },
      minHeight: { tap: '48px' },
      minWidth: { tap: '48px' },
    },
  },
};
