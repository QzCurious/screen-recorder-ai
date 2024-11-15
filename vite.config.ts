import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['screen-recorder.svg'],
      manifest: {
        name: 'Screen Recorder Pro',
        short_name: 'Screen Recorder',
        description: 'Professional Screen Recording Web Application',
        theme_color: '#18181b',
        background_color: '#18181b',
        display: 'standalone',
        icons: [
          {
            src: 'screen-recorder.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});