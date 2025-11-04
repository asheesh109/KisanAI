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
import { useLanguage } from '@/contexts/LanguageContext'

const features = [
  {
    title: 'voiceAssistant',
    description: 'voiceAssistantDesc',
    icon: Mic,
    href: '/voice-assistant',
    color: 'from-sky-500 to-blue-600',
  },
  {
    title: 'cropAnalysis',
    description: 'cropAnalysisDesc',
    icon: Camera,
    href: '/crop-analysis',
    color: 'from-emerald-500 to-green-600',
  },
  {
    title: 'personalizedAdvice',
    description: 'personalizedAdviceDesc',
    icon: Brain,
    href: '/voice-assistant',
    color: 'from-purple-500 to-indigo-600',
  },
  {
    title: 'weatherInfo',
    description: 'weatherInfoDesc',
    icon: Cloud,
    href: '/weather',
    color: 'from-cyan-500 to-teal-600',
  },
  {
    title: 'marketPrices',
    description: 'marketPricesDesc',
    icon: TrendingUp,
    href: '/market-prices',
    color: 'from-orange-500 to-red-600',
  },
  {
    title: 'governmentSchemes',
    description: 'governmentSchemesDesc',
    icon: FileText,
    href: '/schemes',
    color: 'from-rose-500 to-pink-600',
  },
  {
    title: 'kccApplication',
    description: 'kccApplicationDesc',
    icon: CreditCard,
    href: '/kcc-application',
    color: 'from-indigo-500 to-purple-600',
  },
  {
    title: 'kccQueries',
   description: 'kccQueriesDesc',
    icon: CreditCard,
    href: '/kcc-application',
    color: 'from-cyan-500 to-teal-600',
  }
]

export default function FeatureCards() {
  const { t } = useLanguage()

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            {t('features')}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t('tagline')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {features.map((feature, idx) => {
            const IconComponent = feature.icon
            return (
              <div
                key={idx}
                className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
                <div className="p-6 relative z-10">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{t(feature.title)}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                    {t(feature.description)}
                  </p>
                  <Link href={feature.href}>
                    <button className={`w-full py-3 rounded-xl bg-gradient-to-r ${feature.color} text-white font-semibold hover:shadow-lg transition-all hover:scale-105`}>
                      {t('getStarted')}
                    </button>
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}