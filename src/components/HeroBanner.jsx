 'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { ChevronRight, Mic, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HeroBanner() {
  const { t } = useLanguage()

  return (
    <section className="relative overflow-hidden bg-background">
      {/* Subtle background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-32 -top-32 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 mx-auto flex min-h-[560px] max-w-7xl items-center px-4 py-16 sm:min-h-[600px] sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto w-full max-w-4xl text-center">

          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary backdrop-blur-sm sm:mb-8 sm:px-5 sm:py-2.5">
            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>{t('transformingAgriculture')}</span>
          </div>

          {/* Main Heading */}
          <h1 className="mx-auto max-w-4xl text-4xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            {t('heroWelcome')}
          </h1>

          {/* Description */}
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:mt-6 sm:text-lg sm:leading-8 md:text-xl">
            {t('heroTagline')}
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:mt-10 sm:flex-row sm:items-center sm:gap-4">
            <Link href="/schemes" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="group w-full min-w-[200px] rounded-xl px-7 py-6 text-base font-semibold shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl sm:w-auto"
              >
                <span>{t('exploreSchemes')}</span>

                <ChevronRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>

            <Link href="/voice-assistant" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full min-w-[200px] rounded-xl border-2 px-7 py-6 text-base font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:bg-muted sm:w-auto"
              >
                <Mic className="mr-2 h-5 w-5" />

                <span>{t('voiceAssistant')}</span>
              </Button>
            </Link>

          </div>

          {/* Statistics */}
          <div className="mx-auto mt-12 grid max-w-3xl grid-cols-1 gap-3 sm:mt-16 sm:grid-cols-3 sm:gap-4">

            {/* Government Schemes */}
            <div className="rounded-2xl border border-border/70 bg-card/70 px-5 py-5 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md sm:px-4 sm:py-6">
              <div className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
                20+
              </div>

              <div className="mt-2 text-sm font-medium text-muted-foreground">
                {t('statsGovernmentSchemes')}
              </div>
            </div>

            {/* Support */}
            <div className="rounded-2xl border border-border/70 bg-card/70 px-5 py-5 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md sm:px-4 sm:py-6">
              <div className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
                24/7
              </div>

              <div className="mt-2 text-sm font-medium text-muted-foreground">
                {t('statsSupportAvailable')}
              </div>
            </div>

            {/* Farmers Helped */}
            <div className="rounded-2xl border border-border/70 bg-card/70 px-5 py-5 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md sm:px-4 sm:py-6">
              <div className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
                1K+
              </div>

              <div className="mt-2 text-sm font-medium text-muted-foreground">
                {t('statsFarmersHelped')}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}