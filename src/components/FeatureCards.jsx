'use client';

import Link from 'next/link'
import {
  Mic,
  Camera,
  Brain,
  Cloud,
  TrendingUp,
  FileText,
  CreditCard,
  MessageSquare,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/contexts/LanguageContext'

const features = [
  {
    title: 'voiceAssistant',
    description: 'voiceAssistantDesc',
    icon: Mic,
    href: '/voice-assistant',
    gradient: 'from-emerald-500 to-teal-500',
    glow: 'hsl(160, 84%, 39%)',
  },
  {
    title: 'cropAnalysis',
    description: 'cropAnalysisDesc',
    icon: Camera,
    href: '/crop-analysis',
    gradient: 'from-green-500 to-lime-500',
    glow: 'hsl(142, 72%, 39%)',
  },
  {
    title: 'personalizedAdvice',
    description: 'personalizedAdviceDesc',
    icon: Brain,
    href: '/voice-assistant',
    gradient: 'from-violet-500 to-purple-600',
    glow: 'hsl(258, 90%, 66%)',
  },
  {
    title: 'weatherInfo',
    description: 'weatherInfoDesc',
    icon: Cloud,
    href: '/weather',
    gradient: 'from-sky-500 to-blue-500',
    glow: 'hsl(199, 89%, 48%)',
  },
  {
    title: 'marketPrices',
    description: 'marketPricesDesc',
    icon: TrendingUp,
    href: '/market-prices',
    gradient: 'from-amber-500 to-orange-500',
    glow: 'hsl(38, 92%, 50%)',
  },
  {
    title: 'governmentSchemes',
    description: 'governmentSchemesDesc',
    icon: FileText,
    href: '/schemes',
    gradient: 'from-rose-500 to-red-500',
    glow: 'hsl(347, 77%, 50%)',
  },
  {
    title: 'kccApplication',
    description: 'kccApplicationDesc',
    icon: CreditCard,
    href: '/kcc-application',
    gradient: 'from-indigo-500 to-blue-600',
    glow: 'hsl(234, 89%, 60%)',
  },
  {
    title: 'kccQueries',
    description: 'kccQueriesDesc',
    icon: MessageSquare,
    href: '/kcc-application',
    gradient: 'from-cyan-500 to-teal-600',
    glow: 'hsl(187, 85%, 43%)',
  },
]

export default function FeatureCards() {
  const { t } = useLanguage()

  return (
    <section className="py-16 sm:py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* section header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-block mb-3 px-4 py-1.5 bg-primary/10 dark:bg-primary/20 text-primary rounded-full text-xs font-bold uppercase tracking-widest">
            What We Offer
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 text-foreground dark:bg-gradient-to-r dark:from-primary dark:to-accent dark:bg-clip-text dark:text-transparent fc-fade-in">
            {t('features')}
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto fc-fade-in-delayed">
            {t('tagline')}
          </p>
        </div>

        {/* card grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {features.map((feature, idx) => {
            const IconComponent = feature.icon
            return (
              <div
                key={idx}
                className="group relative overflow-hidden rounded-2xl bg-card shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border border-border fc-card-appear"
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                {/* per-card gradient overlay on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                  style={{ background: `linear-gradient(135deg, ${feature.glow}, transparent)` }}
                />

                <div className="p-5 sm:p-6 relative z-10 h-full flex flex-col">
                  {/* icon */}
                  <div
                    className={`w-12 sm:w-14 h-12 sm:h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-all duration-300 shadow-lg`}
                    style={{ boxShadow: `0 8px 20px ${feature.glow}40` }}
                  >
                    <IconComponent className="h-6 sm:h-7 w-6 sm:w-7 text-white" />
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
                    {t(feature.title)}
                  </h3>
                  <p className="text-muted-foreground mb-5 text-sm flex-grow leading-relaxed">
                    {t(feature.description)}
                  </p>

                  <Link href={feature.href}>
                    <Button
                      className={`w-full bg-gradient-to-r ${feature.gradient} text-white font-semibold transition-all duration-300 group-hover:scale-105 border-0`}
                    >
                      {t('getStarted')}
                    </Button>
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <style jsx>{`
        @keyframes fc-fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fc-fade-in          { animation: fc-fade-in 0.8s ease-out; }
        .fc-fade-in-delayed  { animation: fc-fade-in 0.8s ease-out 0.3s both; }

        @keyframes fc-card-appear {
          from { opacity: 0; transform: translateY(30px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .fc-card-appear { animation: fc-card-appear 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) both; }
      `}</style>
    </section>
  )
}