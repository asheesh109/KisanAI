# 🚀 KisanAI Performance Budgets

> **Issue:** [#25 – Add Lighthouse performance check to CI](https://github.com/asheesh109/KisanAI/issues/25)

This document explains the performance budgets enforced by the Lighthouse CI pipeline for the KisanAI project.
Every Pull Request is audited automatically against these budgets. Regressions **block merging** unless explicitly waived by a maintainer.

---

## 📋 Table of Contents

1. [Why Performance Matters for KisanAI](#-why-performance-matters-for-kisanai)
2. [How the CI Audit Works](#-how-the-ci-audit-works)
3. [Lighthouse Score Thresholds](#-lighthouse-score-thresholds)
4. [Core Web Vitals Budgets](#-core-web-vitals-budgets)
5. [Resource Size Budgets](#-resource-size-budgets)
6. [Pages Under Audit](#-pages-under-audit)
7. [Local Audit Guide](#-local-audit-guide)
8. [Interpreting the PR Comment](#-interpreting-the-pr-comment)
9. [Fixing Performance Regressions](#-fixing-performance-regressions)
10. [Raising or Lowering a Budget](#-raising-or-lowering-a-budget)

---

## 🌾 Why Performance Matters for KisanAI

KisanAI is designed for **Indian farmers**, a significant proportion of whom:

- Use **entry-level Android smartphones** (512 MB – 2 GB RAM, low-end Qualcomm chips)
- Access the internet on **2G/3G/slow 4G connections** (rural broadband penetration is still growing)
- Pay **per-MB data plans** where large JavaScript bundles translate directly to money

A 1-second improvement in LCP can meaningfully increase task-completion rates for farmers trying to get disease diagnoses or market prices. **Performance is an equity issue here — not just a technical metric.**

---

## ⚙️ How the CI Audit Works

```
┌──────────────────────────────────────────────────────────────────┐
│                    GitHub Actions – PR Trigger                   │
│                                                                  │
│  1. Build Next.js app  →  2. @lhci/cli audit (3 runs × 5 pages) │
│  3. Average scores     →  4. Assert against budgets              │
│  5. Upload HTML reports (Artifacts)  →  6. Post PR comment       │
└──────────────────────────────────────────────────────────────────┘
```

Configuration files:
| File | Purpose |
|------|---------|
| [`.github/workflows/lighthouse.yml`](../.github/workflows/lighthouse.yml) | GitHub Actions workflow |
| [`lighthouserc.js`](../lighthouserc.js) | Thresholds & audit settings |
| This document | Human-readable budget explanation |

The audit simulates:
- **Device:** Mid-range Android (Moto G4 class)
- **Network:** Slow 4G (1.6 Mbps, 150 ms RTT) – representing rural India connectivity
- **CPU:** 4× slowdown multiplier

---

## 📊 Lighthouse Score Thresholds

Scores are on a 0–100 scale. The traffic-light system applies:

| Category | 🟢 Good (target) | 🟡 Needs Work | 🔴 Fails CI |
|----------|:---:|:---:|:---:|
| **Performance** | ≥ 90 | 70–89 | **< 70** |
| **Accessibility** | ≥ 90 | 85–89 | **< 85** |
| **Best Practices** | ≥ 90 | 80–89 | **< 80** |
| **SEO** | ≥ 90 | 80–89 | **< 80** |
| **PWA** | ≥ 90 | Any | ⚠️ Warn only |

> **Fail CI** means the check marks the PR as failed and blocks merging (subject to branch protection rules).
> **Warn only** means a warning is posted but the check passes.

---

## ⏱️ Core Web Vitals Budgets

[Core Web Vitals](https://web.dev/vitals/) are Google's user-centric metrics. These are the **most important** budgets to pay attention to.

### Largest Contentful Paint (LCP)
Measures how fast the **main content** of a page loads.

| Rating | Value | KisanAI Budget |
|--------|-------|:---:|
| 🟢 Good | ≤ 2.5 s | — |
| 🟡 Needs Work | 2.5 – 4.0 s | — |
| 🔴 Poor → **Fails CI** | > 4.0 s | **≤ 4.0 s** |

> **Why 4 s and not 2.5 s?** Given the slow 4G throttling representing our primary users, we set a realistic budget. The **aspiration target** is ≤ 2.5 s — PRs that achieve this receive a 🟢 in the report.

### Cumulative Layout Shift (CLS)
Measures visual **stability** — elements jumping around as the page loads.

| Rating | Value | KisanAI Budget |
|--------|-------|:---:|
| 🟢 Good | ≤ 0.1 | — |
| 🟡 Needs Work | 0.1 – 0.25 | — |
| 🔴 Poor → **Fails CI** | > 0.25 | **≤ 0.1** |

> **Common causes:** Images without explicit `width`/`height`, dynamically injected content, web fonts with FOUT.

### Total Blocking Time (TBT) / First Input Delay (FID)
Measures **interactivity** — how responsive the page is to user input.

| Metric | KisanAI Budget | Severity |
|--------|:---:|:---:|
| TBT | ≤ 600 ms | ⚠️ Warn |
| Max Potential FID | ≤ 300 ms | ⚠️ Warn |
| Time to Interactive (TTI) | ≤ 5 s | ⚠️ Warn |

### First Contentful Paint (FCP)
When the **first pixel** of content appears on screen.

| KisanAI Budget | Severity |
|:---:|:---:|
| ≤ 3 s | ⚠️ Warn |

### Speed Index
How quickly the visible page area is visually complete.

| KisanAI Budget | Severity |
|:---:|:---:|
| ≤ 4.5 s | ⚠️ Warn |

---

## 📦 Resource Size Budgets

Large assets are the primary cause of slow load times on mobile networks.

| Resource | Budget | Severity |
|----------|:---:|:---:|
| **Total page weight** | ≤ 2 MB | 🔴 Fails CI |
| **Unused JavaScript** | ≤ 100 KB | ⚠️ Warn |
| **Unused CSS** | ≤ 50 KB | ⚠️ Warn |
| Render-blocking resources | ≤ 3 | ⚠️ Warn |
| Unoptimized images | Any | ⚠️ Warn |
| Non-WebP images | Any | ⚠️ Warn |
| Non-responsive images | Any | ⚠️ Warn |

---

## 🗂️ Pages Under Audit

Each PR audits the following routes. All must pass budgets.

| Route | Label | Notes |
|-------|-------|-------|
| `/` | Home | Landing page, most critical |
| `/crop-analysis` | Crop Analysis | Heavy AI interaction |
| `/weather` | Weather | Real-time data |
| `/schemes` | Government Schemes | Content-heavy |
| `/market-prices` | Market Prices | Data tables |

To add more routes, update the `strategy.matrix.route` list in [`.github/workflows/lighthouse.yml`](../.github/workflows/lighthouse.yml).

---

## 🧪 Local Audit Guide

Run Lighthouse audits locally before pushing to catch regressions early.

### Prerequisites

```bash
# Install @lhci/cli globally
npm install -g @lhci/cli

# Or locally (preferred)
npm install --save-dev @lhci/cli
```

### Quick audit against staging

```bash
# Audit a single URL
lhci autorun \
  --collect.url="https://kisan-ai.vercel.app" \
  --collect.numberOfRuns=1 \
  --upload.target=filesystem \
  --upload.outputDir=./lhci-reports
```

### Full local audit (matches CI)

```bash
# 1. Build the app
npm run build

# 2. Run the full LHCI autorun using lighthouserc.js
STAGING_URL=https://kisan-ai.vercel.app lhci autorun

# OR – start the Next.js server locally and audit that
npm start &
lhci autorun --collect.url=http://localhost:3000
```

### View HTML report

```bash
# Open the report in your browser
npx serve ./lhci-reports
# → Navigate to the displayed URL
```

### One-liner per-page audit with Chrome DevTools Protocol

```bash
# Install Chrome if needed
npx playwright install chromium

# Single-page audit
npx lighthouse http://localhost:3000 \
  --output=html \
  --output-path=./lighthouse-home.html \
  --chrome-flags="--headless --no-sandbox" \
  --throttling-method=simulate \
  --emulated-form-factor=mobile
open ./lighthouse-home.html
```

---

## 💬 Interpreting the PR Comment

After every PR the bot posts a table like this:

| Page | 🚀 Performance | ♿ Accessibility | ✅ Best Practices | 🔍 SEO |
|------|:---:|:---:|:---:|:---:|
| **Home** | 🟢 92 | 🟢 97 | 🟢 91 | 🟢 95 |
| **Crop Analysis** | 🟡 74 | 🟢 89 | 🟢 83 | 🟢 88 |
| **Weather** | 🔴 61 | 🟡 86 | 🟢 90 | 🟢 90 |

**Legend:**
- 🟢 ≥ 90 – Great
- 🟡 70–89 – Acceptable (some categories block CI if below threshold)
- 🔴 < 70 – Needs fixing (blocks merge for Performance category)
- ⚪ – Audit did not run / no data

Full HTML reports with per-audit breakdowns are in the **Actions → Artifacts** tab of the workflow run.

---

## 🔧 Fixing Performance Regressions

### Performance score below 70

| Common cause | Fix |
|---|---|
| Large JavaScript bundle | Code-split with `next/dynamic`. Remove unused packages. |
| Render-blocking scripts | Move `<script>` to end of `<body>`, use `defer`/`async`. |
| Large images | Use `next/image` with proper `width`/`height`. Convert to WebP. |
| No caching headers | Configure `Cache-Control` in `next.config.js`. |
| Too many third-party scripts | Lazy-load analytics/chat widgets. |

### CLS > 0.1

```tsx
// ✅ Always set explicit dimensions on images
<Image src="/farm.webp" width={800} height={450} alt="Farm field" />

// ✅ Reserve space for dynamic content
<div style={{ minHeight: '200px' }}>
  {isLoaded ? <DynamicWidget /> : <Skeleton />}
</div>
```

### LCP > 4 s

```tsx
// ✅ Preload the LCP image
// In next.config.js:
// headers: [{ key: 'Link', value: '</hero.webp>; rel=preload; as=image' }]

// ✅ Mark hero images as high priority
<Image src="/hero.webp" alt="Hero" fill priority />
```

### Unused JavaScript > 100 KB

```tsx
// ✅ Lazy-load heavy components
const HeavyChart = dynamic(() => import('@/components/HeavyChart'), {
  ssr: false,
  loading: () => <Spinner />,
});
```

---

## 📈 Raising or Lowering a Budget

Budgets should become **stricter** over time as the codebase matures. If you need to adjust a threshold:

1. **Open a discussion** in the issue tracker explaining the trade-off.
2. Get approval from a **maintainer** (`@asheesh109`).
3. Update the relevant assertion in [`lighthouserc.js`](../lighthouserc.js).
4. Update this document to reflect the new value.
5. Mention the change in `CHANGELOG.md`.

> ⚠️ **Loosening a budget requires explicit maintainer sign-off.** Don't just bump numbers to make CI green — fix the underlying issue.

---

## 🔗 References

- [Lighthouse CI Documentation](https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/getting-started.md)
- [Web Vitals](https://web.dev/vitals/)
- [Next.js Performance](https://nextjs.org/docs/pages/building-your-application/optimizing/performance)
- [Image Optimization in Next.js](https://nextjs.org/docs/pages/building-your-application/optimizing/images)
- [Lighthouse Scoring Calculator](https://googlechrome.github.io/lighthouse/scorecalc/)
- [PageSpeed Insights](https://pagespeed.web.dev/)

---

*Last updated: July 2026 · Maintainer: [@asheesh109](https://github.com/asheesh109)*
