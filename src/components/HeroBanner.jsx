'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { ChevronRight, Mic, Sparkles, Check, Leaf, CloudSun, TrendingUp, FileText, Bot } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

/* ---------- small sub-components ---------- */

function MetricCard({ value, label, icon, delay = 0 }) {
  return (
    <div
      className="hero-metric-card"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="hero-metric-icon">{icon}</div>
      <div className="hero-metric-value">{value}</div>
      <div className="hero-metric-label">{label}</div>
    </div>
  )
}

function FeaturePill({ icon: Icon, label }) {
  return (
    <span className="hero-pill">
      <Icon className="h-3.5 w-3.5 flex-shrink-0" />
      {label}
    </span>
  )
}

/* ---------- main component ---------- */

export default function HeroBanner() {
  const { t } = useLanguage()

  const featurePills = [
    { icon: Bot,       label: 'Voice AI' },
    { icon: Leaf,      label: 'Crop Analysis' },
    { icon: CloudSun,  label: 'Weather' },
    { icon: TrendingUp,label: 'Market Prices' },
    { icon: FileText,  label: 'Govt. Schemes' },
  ]

  const trustItems = [
    'Free to Use',
    'No Login Required',
    '5 Languages',
  ]

  return (
    <div className="hero-root">
      {/* ── decorative blobs ── */}
      <div className="hero-blob hero-blob-1" />
      <div className="hero-blob hero-blob-2" />
      <div className="hero-blob hero-blob-3" />

      {/* ── grid ── */}
      <div className="hero-grid">

        {/* ══ LEFT — text content ══ */}
        <div className="hero-left">

          {/* eyebrow badge */}
          <div className="hero-badge hero-anim-1">
            <Sparkles className="h-4 w-4 hero-badge-icon" />
            <span>{t('transformingAgriculture')}</span>
          </div>

          {/* headline */}
          <h1 className="hero-headline hero-anim-2">
            {t('heroWelcome') || 'Empowering'}{' '}
            <span className="hero-headline-accent">Farmers</span>
          </h1>

          {/* tagline */}
          <p className="hero-tagline hero-anim-3">
            {t('heroTagline') || 'Access government schemes, market insights, and AI-powered resources to grow your agricultural success.'}
          </p>

          {/* feature pills */}
          <div className="hero-pills hero-anim-3">
            {featurePills.map((p) => (
              <FeaturePill key={p.label} icon={p.icon} label={p.label} />
            ))}
          </div>

          {/* CTA buttons */}
          <div className="hero-ctas hero-anim-4">
            <Link href="/schemes">
              <Button size="lg" className="hero-btn-primary" id="hero-cta-schemes">
                <span>{t('exploreSchemes') || 'Explore Schemes'}</span>
                <ChevronRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/voice-assistant">
              <Button variant="outline" size="lg" className="hero-btn-secondary" id="hero-cta-voice">
                <Mic className="h-5 w-5" />
                <span>{t('voiceAssistant') || 'Voice Assistant'}</span>
              </Button>
            </Link>
          </div>

          {/* trust indicators */}
          <div className="hero-trust hero-anim-4">
            {trustItems.map((item) => (
              <span key={item} className="hero-trust-item">
                <Check className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* ══ RIGHT — illustrated metric panel ══ */}
        <div className="hero-right hero-anim-right">
          {/* decorative ring */}
          <div className="hero-ring" />

          {/* metric cards */}
          <div className="hero-metrics">
            <MetricCard value="50K+" label="Active Farmers"   icon="🧑‍🌾" delay={200} />
            <MetricCard value="95%"  label="AI Accuracy"      icon="🤖" delay={350} />
            <MetricCard value="200+" label="Govt. Schemes"    icon="📋" delay={500} />
            <MetricCard value="24/7" label="Support Available" icon="⏰" delay={650} />
          </div>

          {/* floating accent card */}
          <div className="hero-accent-card">
            <span className="hero-accent-card-icon">🌾</span>
            <div>
              <div className="hero-accent-card-title">Crop Health Alert</div>
              <div className="hero-accent-card-sub">AI detected early blight — act now</div>
            </div>
          </div>
        </div>

      </div>

      {/* ── bottom stats bar ── */}
      <div className="hero-stats-bar">
        {[
          { v: '20+',  l: t('statsGovernmentSchemes') || 'Government Schemes' },
          { v: '24/7', l: t('statsSupportAvailable')  || 'Support Available'  },
          { v: '1K+',  l: t('statsFarmersHelped')     || 'Farmers Helped'     },
        ].map(({ v, l }) => (
          <div key={l} className="hero-stat">
            <div className="hero-stat-value">{v}</div>
            <div className="hero-stat-label">{l}</div>
          </div>
        ))}
      </div>

      {/* ── scoped styles ── */}
      <style jsx>{`
        /* ---- layout ---- */
        .hero-root {
          position: relative;
          min-height: 680px;
          overflow: hidden;
          background-color: hsl(var(--background));
          padding: 5rem 1.5rem 3rem;
        }
        @media (min-width: 1024px) {
          .hero-root { padding: 6rem 2rem 3rem; }
        }

        /* ---- blobs ---- */
        .hero-blob {
          position: absolute;
          border-radius: 9999px;
          filter: blur(80px);
          pointer-events: none;
        }
        .hero-blob-1 {
          top: -4rem; right: -4rem;
          width: 28rem; height: 28rem;
          background: hsl(var(--primary) / 0.12);
          animation: blobFloat 7s ease-in-out infinite;
        }
        .hero-blob-2 {
          bottom: -5rem; left: -5rem;
          width: 34rem; height: 34rem;
          background: hsl(var(--accent) / 0.09);
          animation: blobFloat 9s ease-in-out infinite reverse;
        }
        .hero-blob-3 {
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 40rem; height: 40rem;
          background: hsl(var(--primary) / 0.04);
          animation: blobPulse 5s ease-in-out infinite;
        }

        /* ---- grid ---- */
        .hero-grid {
          position: relative;
          z-index: 10;
          max-width: 80rem;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr;
          gap: 3rem;
          align-items: center;
        }
        @media (min-width: 1024px) {
          .hero-grid { grid-template-columns: 1fr 1fr; gap: 4rem; }
        }

        /* ---- left panel ---- */
        .hero-left { display: flex; flex-direction: column; gap: 1.5rem; }

        /* badge */
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1.25rem;
          background: linear-gradient(135deg, hsl(var(--primary) / 0.12), hsl(var(--accent) / 0.12));
          color: hsl(var(--primary));
          border-radius: 9999px;
          font-size: 0.875rem;
          font-weight: 600;
          letter-spacing: 0.03em;
          border: 1px solid hsl(var(--primary) / 0.2);
          width: fit-content;
        }
        .hero-badge-icon { animation: spinSlow 20s linear infinite; }

        /* headline */
        .hero-headline {
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 900;
          line-height: 1.1;
          letter-spacing: -0.03em;
          color: hsl(var(--foreground));
          margin: 0;
        }
        .hero-headline-accent {
          background: linear-gradient(135deg, hsl(142, 76%, 30%), hsl(142, 76%, 50%));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* tagline */
        .hero-tagline {
          font-size: clamp(1rem, 2vw, 1.2rem);
          color: hsl(var(--muted-foreground));
          line-height: 1.7;
          max-width: 36rem;
          margin: 0;
        }

        /* pills */
        .hero-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .hero-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.3rem 0.75rem;
          background: hsl(var(--primary) / 0.08);
          color: hsl(var(--primary));
          border: 1px solid hsl(var(--primary) / 0.15);
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
        }
        .dark .hero-pill {
          background: hsl(var(--primary) / 0.15);
          border-color: hsl(var(--primary) / 0.3);
        }

        /* CTA row */
        .hero-ctas {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .hero-btn-primary {
          background: linear-gradient(135deg, hsl(var(--primary)), hsl(142, 76%, 28%));
          color: hsl(var(--primary-foreground));
          font-weight: 700;
          font-size: 1rem;
          padding: 0.875rem 2rem;
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          box-shadow: 0 8px 24px hsl(var(--primary) / 0.35);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .hero-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px hsl(var(--primary) / 0.45);
        }
        .hero-btn-secondary {
          border: 2px solid hsl(var(--border));
          color: hsl(var(--foreground));
          font-weight: 700;
          font-size: 1rem;
          padding: 0.875rem 2rem;
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          backdrop-filter: blur(4px);
          transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
        }
        .hero-btn-secondary:hover {
          transform: translateY(-2px);
          border-color: hsl(var(--primary) / 0.6);
          box-shadow: 0 8px 24px hsl(var(--primary) / 0.12);
        }

        /* trust bar */
        .hero-trust {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .hero-trust-item {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.8rem;
          color: hsl(var(--muted-foreground));
          font-weight: 500;
        }

        /* ---- right panel ---- */
        .hero-right {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 360px;
        }

        /* decorative ring */
        .hero-ring {
          position: absolute;
          inset: 0;
          border-radius: 9999px;
          border: 2px dashed hsl(var(--primary) / 0.15);
          animation: ringRotate 30s linear infinite;
        }

        /* metric cards grid */
        .hero-metrics {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          position: relative;
          z-index: 2;
        }
        .hero-metric-card {
          background: hsl(var(--card));
          border: 1px solid hsl(var(--border));
          border-radius: 1rem;
          padding: 1.25rem 1rem;
          text-align: center;
          box-shadow: 0 4px 20px rgba(0,0,0,0.06);
          animation: metricPop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
          transition: transform 0.3s, box-shadow 0.3s;
        }
        .dark .hero-metric-card {
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        }
        .hero-metric-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px hsl(var(--primary) / 0.15);
        }
        .hero-metric-icon { font-size: 1.75rem; margin-bottom: 0.35rem; }
        .hero-metric-value {
          font-size: 1.5rem;
          font-weight: 900;
          background: linear-gradient(135deg, hsl(var(--primary)), hsl(142, 76%, 50%));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1.1;
        }
        .hero-metric-label {
          font-size: 0.7rem;
          color: hsl(var(--muted-foreground));
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-top: 0.2rem;
        }

        /* floating accent card */
        .hero-accent-card {
          position: absolute;
          bottom: -1rem;
          left: -1.5rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: hsl(var(--card));
          border: 1px solid hsl(var(--primary) / 0.25);
          border-radius: 0.875rem;
          padding: 0.75rem 1rem;
          box-shadow: 0 8px 28px hsl(var(--primary) / 0.15);
          z-index: 3;
          animation: accentSlide 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.7s both;
          max-width: 240px;
        }
        .dark .hero-accent-card {
          box-shadow: 0 8px 28px rgba(0,0,0,0.4);
          border-color: hsl(var(--primary) / 0.4);
        }
        .hero-accent-card-icon { font-size: 1.5rem; flex-shrink: 0; }
        .hero-accent-card-title {
          font-size: 0.8rem;
          font-weight: 700;
          color: hsl(var(--foreground));
        }
        .hero-accent-card-sub {
          font-size: 0.7rem;
          color: hsl(var(--muted-foreground));
        }

        /* ---- stats bar ---- */
        .hero-stats-bar {
          position: relative;
          z-index: 10;
          max-width: 80rem;
          margin: 3rem auto 0;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          padding: 1.5rem;
          background: hsl(var(--card) / 0.6);
          border: 1px solid hsl(var(--border) / 0.5);
          border-radius: 1.25rem;
          backdrop-filter: blur(8px);
        }
        .hero-stat { text-align: center; }
        .hero-stat-value {
          font-size: clamp(1.5rem, 3vw, 2rem);
          font-weight: 900;
          color: hsl(var(--primary));
          line-height: 1;
        }
        .hero-stat-label {
          font-size: 0.8rem;
          color: hsl(var(--muted-foreground));
          font-weight: 500;
          margin-top: 0.25rem;
        }

        /* ---- entrance animations ---- */
        .hero-anim-1 { animation: fadeUp 0.7s ease-out 0.1s both; }
        .hero-anim-2 { animation: fadeUp 0.7s ease-out 0.25s both; }
        .hero-anim-3 { animation: fadeUp 0.7s ease-out 0.4s both; }
        .hero-anim-4 { animation: fadeUp 0.7s ease-out 0.55s both; }
        .hero-anim-right { animation: fadeLeft 0.8s ease-out 0.3s both; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeLeft {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes blobFloat {
          0%, 100% { transform: translateY(0) scale(1); }
          50%       { transform: translateY(-20px) scale(1.04); }
        }
        @keyframes blobPulse {
          0%, 100% { opacity: 0.3; transform: translate(-50%,-50%) scale(1); }
          50%       { opacity: 0.6; transform: translate(-50%,-50%) scale(1.06); }
        }
        @keyframes ringRotate {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes metricPop {
          from { opacity: 0; transform: scale(0.8) translateY(16px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes accentSlide {
          from { opacity: 0; transform: translateX(-20px) translateY(10px); }
          to   { opacity: 1; transform: translateX(0) translateY(0); }
        }
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}