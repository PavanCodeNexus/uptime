/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('@uptime/shared/tailwind-preset')],
  // The shared package contains components too, so Tailwind must scan it as well.
  content: ['./index.html', './src/**/*.{ts,tsx}', '../../packages/shared/src/**/*.{ts,tsx}'],
};
