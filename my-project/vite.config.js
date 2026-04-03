import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  base: "/B3dev-TP_VUE/",
  plugins: [
    vue(),
    vueDevTools(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'icons/icon.svg'],
      manifest: {
        name: 'B3dev Chat',
        short_name: 'B3dev',
        description: 'Application de tchat temps réel et gestion de données',
        theme_color: '#111827',
        background_color: '#f9fafb',
        display: 'standalone',
        start_url: '/B3dev-TP_VUE/',
        scope: '/B3dev-TP_VUE/',
        lang: 'fr',
        icons: [
          {
            src: 'icons/icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any'
          },
          {
            src: 'icons/icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,svg,woff2}'],
        navigateFallback: '/B3dev-TP_VUE/index.html',
        navigateFallbackDenylist: [
          /^\/B3dev-TP_VUE\/api\//,
          /^\/B3dev-TP_VUE\/socket\.io\//
        ],
        runtimeCaching: [
          {
            urlPattern: /^\/B3dev-TP_VUE\/api\//,
            handler: 'NetworkOnly'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
