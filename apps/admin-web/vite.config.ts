import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// The backend only allows browser calls from ports 3000, 3001, 3002 and 5173 (CorsConfig.java),
// so each app has its own fixed port. strictPort makes Vite fail loudly instead of picking another one.
export default defineConfig({
  plugins: [react()],
  server: { port: 3002, strictPort: true },
  preview: { port: 3002, strictPort: true },
});
