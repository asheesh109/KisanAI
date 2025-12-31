'use client';

import Link from 'next/link'
import { 
  Mic, 
  Camera, 
  Brain, 
  Cloud, 
  TrendingUp, 
  FileText, 
  CreditCard 
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/contexts/LanguageContext'

const features = [
  {
    title: 'voiceAssistant',
    description: 'voiceAssistantDesc',
    icon: Mic,
    href: '/voice-assistant',
    color: 'from-primary to-accent',
  },
  {
    title: 'cropAnalysis',
    description: 'cropAnalysisDesc',
    icon: Camera,
    href: '/crop-analysis',
    color: 'from-primary to-accent',
  },
  {
    title: 'personalizedAdvice',
    description: 'personalizedAdviceDesc',
    icon: Brain,
    href: '/voice-assistant',
    color: 'from-primary to-accent',
  },
  {
    title: 'weatherInfo',
    description: 'weatherInfoDesc',
    icon: Cloud,
    href: '/weather',
    color: 'from-primary to-accent',
  },
  {
    title: 'marketPrices',
    description: 'marketPricesDesc',
    icon: TrendingUp,
    href: '/market-prices',
    color: 'from-primary to-accent',
  },
  {
    title: 'governmentSchemes',
    description: 'governmentSchemesDesc',
    icon: FileText,
    href: '/schemes',
    color: 'from-primary to-accent',
  },
  {
    title: 'kccApplication',
    description: 'kccApplicationDesc',
    icon: CreditCard,
    href: '/kcc-application',
    color: 'from-primary to-accent',
  },
  {
    title: 'kccQueries',
   description: 'kccQueriesDesc',
    icon: CreditCard,
    href: '/kcc-application',
    color: 'from-primary to-accent',
  }
]

export default function FeatureCards() {
  const { t } = useLanguage()

  return (
    <section className="py-16 sm:py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 text-foreground dark:bg-gradient-to-r dark:from-primary dark:to-accent dark:bg-clip-text dark:text-transparent animate-fade-in">
            {t('features')}
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in-delayed">
            {t('tagline')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {features.map((feature, idx) => {
            const IconComponent = feature.icon
            return (
              <div
                key={idx}
                className="group relative overflow-hidden rounded-2xl bg-card shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border border-border animate-card-appear"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                <div className="p-4 sm:p-6 relative z-10 h-full flex flex-col">
                  <div className={`w-12 sm:w-16 h-12 sm:h-16 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                    <IconComponent className="h-6 sm:h-8 w-6 sm:w-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">{t(feature.title)}</h3>
                  <p className="text-muted-foreground mb-4 sm:mb-6 text-sm flex-grow">{t(feature.description)}</p>
                  <Link href={feature.href}>
                    <Button className="w-full bg-primary hover:bg-accent text-primary-foreground font-semibold transition-all duration-300 group-hover:scale-105">
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
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        @keyframes fade-in-delayed {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-delayed {
          animation: fade-in-delayed 0.8s ease-out 0.3s both;
        }
        @keyframes card-appear {
          from { opacity: 0; transform: translateY(30px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-card-appear {
          animation: card-appear 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
      `}</style>
    </section>
  )
}