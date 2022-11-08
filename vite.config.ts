import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
  plugins: [solidPlugin()],
  build: {
    target: 'esnext',
  },
  server: {
    host: "localhost",
    open: true,
    port: 8000,
  },
  root: './',
  base: './',
  publicDir: 'public',
});
