// lighthouserc.js
// Lighthouse CI configuration for KisanAI
// Docs: https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md

'use strict';

/** @type {import('@lhci/cli').LighthouseRcConfig} */
module.exports = {
  ci: {
    // ─────────────────────────────────────────────────────────────────────
    // COLLECT  – how to run Lighthouse
    // ─────────────────────────────────────────────────────────────────────
    collect: {
      // Number of audit runs per URL (averaged to reduce variance)
      numberOfRuns: 3,

      // Chrome flags for CI environment (headless, no sandbox)
      chromePath: process.env.CHROME_PATH || undefined,
      chromeFlags: [
        '--headless=new',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-extensions',
        '--disable-background-networking',
        '--disable-default-apps',
        '--no-first-run',
        '--disable-client-side-phishing-detection',
      ],

      // Lighthouse audit settings
      settings: {
        // Simulate a mid-range Android device on a slow 4G connection
        // This is closer to the actual KisanAI target audience (rural India)
        emulatedFormFactor: 'mobile',
        throttlingMethod: 'simulate',
        throttling: {
          // Slow 4G – typical network in rural India
          rttMs: 150,
          throughputKbps: 1.6 * 1024,
          cpuSlowdownMultiplier: 4,
        },

        // Categories to audit
        onlyCategories: [
          'performance',
          'accessibility',
          'best-practices',
          'seo',
          'pwa',
        ],

        // Skip audits that are irrelevant in CI
        skipAudits: [
          'uses-http2',           // May not apply to Vercel preview URLs
          'redirects-http',       // Handled by hosting platform
        ],
      },
    },

    // ─────────────────────────────────────────────────────────────────────
    // ASSERT  – performance budgets that must pass
    // ─────────────────────────────────────────────────────────────────────
    assert: {
      // Preset: none – we define everything explicitly below
      preset: 'lighthouse:no-pwa',

      assertions: {
        // ── Category score thresholds ──────────────────────────────────
        // error  → fail CI (red)
        // warn   → display warning but don't fail (yellow)
        'categories:performance': ['error', { minScore: 0.70 }],
        'categories:accessibility': ['error', { minScore: 0.85 }],
        'categories:best-practices': ['error', { minScore: 0.80 }],
        'categories:seo': ['error', { minScore: 0.80 }],

        // ── Core Web Vitals ────────────────────────────────────────────
        // LCP – Largest Contentful Paint (paint time for main content)
        'largest-contentful-paint': ['error', { maxNumericValue: 4000 }],    // 4 s max (mobile 4G budget)
        // FID/INP – Interaction to Next Paint (responsiveness)
        'interactive': ['warn', { maxNumericValue: 5000 }],                  // TTI ≤ 5 s
        'max-potential-fid': ['warn', { maxNumericValue: 300 }],             // FID ≤ 300 ms
        // CLS – Cumulative Layout Shift (visual stability)
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],      // CLS ≤ 0.1
        // FCP – First Contentful Paint
        'first-contentful-paint': ['warn', { maxNumericValue: 3000 }],       // FCP ≤ 3 s
        // TBT – Total Blocking Time
        'total-blocking-time': ['warn', { maxNumericValue: 600 }],           // TBT ≤ 600 ms
        // Speed Index
        'speed-index': ['warn', { maxNumericValue: 4500 }],

        // ── Resource Size Budgets ──────────────────────────────────────
        // Keep bundles lean for low-bandwidth users
        'total-byte-weight': ['error', { maxNumericValue: 2 * 1024 * 1024 }],   // ≤ 2 MB total
        'render-blocking-resources': ['warn', { maxLength: 3 }],
        'unused-javascript': ['warn', { maxNumericValue: 100 * 1024 }],          // ≤ 100 KB unused JS
        'unused-css-rules': ['warn', { maxNumericValue: 50 * 1024 }],            // ≤ 50 KB unused CSS
        'uses-optimized-images': ['warn', {}],
        'uses-webp-images': ['warn', {}],
        'uses-responsive-images': ['warn', {}],

        // ── Accessibility checks ───────────────────────────────────────
        'color-contrast': ['error', {}],
        'image-alt': ['error', {}],
        'label': ['error', {}],
        'link-name': ['error', {}],
        'button-name': ['error', {}],
        'html-has-lang': ['error', {}],
        'valid-lang': ['warn', {}],

        // ── SEO basics ─────────────────────────────────────────────────
        'document-title': ['error', {}],
        'meta-description': ['error', {}],
        'robots-txt': ['warn', {}],
        'canonical': ['warn', {}],

        // ── Security & best-practices ──────────────────────────────────
        'is-on-https': ['error', {}],
        'no-vulnerable-libraries': ['error', {}],
        'csp-xss': ['warn', {}],
        'deprecations': ['warn', {}],

        // ── PWA (optional, warn only for now) ─────────────────────────
        'service-worker': ['warn', {}],
        'installable-manifest': ['warn', {}],
        'themed-omnibox': ['warn', {}],
      },
    },

    // ─────────────────────────────────────────────────────────────────────
    // UPLOAD  – where to store results
    // ─────────────────────────────────────────────────────────────────────
    upload: {
      // Default: save to filesystem (CI artifacts).
      // Switch to 'lhci' if you set up a Lighthouse CI server.
      target: process.env.LHCI_SERVER_URL ? 'lhci' : 'filesystem',
      serverBaseUrl: process.env.LHCI_SERVER_URL || '',
      token: process.env.LHCI_BUILD_TOKEN || '',
      outputDir: './lhci-reports',

      // GitHub status checks (requires LHCI_GITHUB_APP_TOKEN secret)
      githubAppToken: process.env.LHCI_GITHUB_APP_TOKEN || '',

      // Useful metadata attached to each run
      extraHeaders: {
        'X-Project': 'KisanAI',
      },
    },
  },
};
