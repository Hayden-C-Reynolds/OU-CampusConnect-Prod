/// <reference types="vitest" />

import legacy from '@vitejs/plugin-legacy'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    //legacy(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['favicon.png', 'pwa-icons/*.png'],
      manifest: {
        id: '/',
        name: 'OU Campus Connect',
        short_name: 'Campus Connect',
        description:
          'Your pocket guide to Oakwood University — interactive campus map, events, and favorites.',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#05060a',
        theme_color: '#05060a',
        icons: [
          { src: '/pwa-icons/icon-64.png', sizes: '64x64', type: 'image/png' },
          { src: '/pwa-icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/pwa-icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: '/pwa-icons/icon-512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // App shell (JS/CSS/HTML/icons) is precached automatically by
        // vite-plugin-pwa. These runtime rules cover everything else.
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest}'],
        globIgnores: ['**/assets/CampusCompanionLogo.png'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5 MiB — covers the main JS bundle
        navigateFallback: '/index.html',
        runtimeCaching: [
          {
            // Mapbox map tiles/styles — cache what's been viewed so the
            // map still shows previously-seen areas while offline.
            urlPattern: /^https:\/\/api\.mapbox\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'mapbox-tiles-cache',
              expiration: { maxEntries: 500, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/events\.mapbox\.com\/.*/i,
            handler: 'NetworkOnly',
          },
          {
            // Firebase Auth/Realtime Database — always go to the network;
            // favorites/report data should never be served stale.
            urlPattern: /^https:\/\/.*\.(firebaseio|firebaseapp|googleapis)\.com\/.*/i,
            handler: 'NetworkOnly',
          },
        ],
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
  assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.svg'],
  build: {
    chunkSizeWarningLimit: 3000, // Aumenta el límite a 1000 kB
    target: 'esnext', 
    assetsDir: 'assets'
  },
  esbuild: {
    target: 'esnext'
  }
})
