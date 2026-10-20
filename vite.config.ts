import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'pwa-192x192.svg', 'pwa-512x512.svg'],
      manifest: {
        name: 'HomeServer Microservices Hub',
        short_name: 'ServerHub',
        description: 'Dashboard e pannello di controllo per tutti i microservizi del server',
        theme_color: '#090d16',
        background_color: '#090d16',
        display: 'standalone',
        display_override: ['window-controls-overlay', 'standalone'],
        start_url: '/',
        icons: [
          {
            src: '/pwa-192x192.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any'
          },
          {
            src: '/pwa-512x512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ],
        shortcuts: [
          {
            name: 'Home Assistant',
            short_name: 'HomeAssistant',
            description: 'Apri pannello domotica',
            url: '/?open=homeassistant',
            icons: [{ src: '/pwa-192x192.svg', sizes: '192x192' }]
          },
          {
            name: 'Portainer',
            short_name: 'Portainer',
            description: 'Gestione container Docker',
            url: '/?open=portainer',
            icons: [{ src: '/pwa-192x192.svg', sizes: '192x192' }]
          },
          {
            name: 'Navidrome',
            short_name: 'Navidrome',
            description: 'Streaming musicale personale',
            url: '/?open=navidrome',
            icons: [{ src: '/pwa-192x192.svg', sizes: '192x192' }]
          },
          {
            name: 'MeTube Downloader',
            short_name: 'MeTube',
            description: 'Scarica video sul server',
            url: '/?open=metube',
            icons: [{ src: '/pwa-192x192.svg', sizes: '192x192' }]
          },
          {
            name: 'n8n Automations',
            short_name: 'n8n',
            description: 'Workflow automation',
            url: '/?open=n8n',
            icons: [{ src: '/pwa-192x192.svg', sizes: '192x192' }]
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}']
      }
    })
  ]
})
