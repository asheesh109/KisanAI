/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',

  // Define runtime caching strategies
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/api\./i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
        cacheableResponse: {
          statuses: [200],
        },
      },
    },
    {
      urlPattern: /^https:\/\/.*\.(css|js|png|jpg|jpeg|gif|svg|webp)$/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'static-assets',
        expiration: {
          maxEntries: 60,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        },
      },
    },
    {
      urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\//i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts',
        expiration: {
          maxEntries: 20,
          maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
        },
        cacheableResponse: {
          statuses: [200],
        },
      },
    },
    {
      urlPattern: /^https:\/\/(?:www\.)?mymemory\.translated\.net\//i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'translation-cache',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
        },
        cacheableResponse: {
          statuses: [200],
        },
      },
    },
  ],

  // Manifest settings
  manifestOptions: {
    name: 'KisanAI - Farmer Assistant',
    short_name: 'KisanAI',
    description: 'AI-powered farming assistant for Indian farmers',
    start_url: '/',
    display: 'standalone',
    scope: '/',
    theme_color: '#10b981',
    background_color: '#ffffff',
    screenshots: [
      {
        src: '/screenshot-540x720.png',
        sizes: '540x720',
        type: 'image/png',
        form_factor: 'narrow',
      },
      {
        src: '/screenshot-1280x720.png',
        sizes: '1280x720',
        type: 'image/png',
        form_factor: 'wide',
      },
    ],
  },

  // Workbox configuration
  workboxOptions: {
    disableDevLogs: true,
    clientsClaim: true,
    skipWaiting: true,
  },
});

const nextConfig = {
  /* config options here */
  reactStrictMode: true,
  turbopack: {},
};

module.exports = withPWA(nextConfig);