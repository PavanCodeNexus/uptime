/** Settings read from the .env.local file (see .env.example). Defaults suit local development. */
const clean = (v: unknown): string => (typeof v === 'string' ? v.trim() : '');

export const env = {
  /** True under `npm run dev`. Used to show the demo-code hints. */
  isDev: import.meta.env.DEV === true,
  apiBaseUrl: clean(import.meta.env.VITE_API_BASE_URL) || 'http://localhost:8080',
  wsUrl: clean(import.meta.env.VITE_WS_URL) || 'http://localhost:8080/ws',
  googleMapsKey: clean(import.meta.env.VITE_GOOGLE_MAPS_API_KEY),
};
