'use client'
import { useLanguage } from '@/contexts/LanguageContext'
import { ChevronRight, Mic, Sparkles } from 'lucide-react'
import Link from 'next/link'

// Mock Button component
const Button = ({ children, className, ...props }) => (
  <button className={className} {...props}>
    {children}
  </button>
)

export default function HeroBanner() {
  const { t } = useLanguage()

  return (
    <div className="relative min-h-[650px] overflow-hidden bg-white dark:bg-gray-950">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-green-500/5 to-teal-500/10 dark:from-emerald-500/20 dark:via-green-500/10 dark:to-teal-500/20"></div>
      
      {/* Geometric Shapes */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-green-500/10 dark:bg-green-500/20 rounded-full blur-3xl"></div>

      {/* Content */}
      <div className="relative flex items-center justify-center h-full px-6 py-24">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full text-sm font-medium">
            <Sparkles className="h-4 w-4" />
            <span>{t('transformingAgriculture')}</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            {t('heroWelcome')}
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
            {t('heroTagline')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/schemes">
              <Button className=" px-8 py-4 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center space-x-2">
                <span>{t('exploreSchemes')}</span>
                <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

            <Link href="/voice-assistant">
              <Button className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-500 rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center space-x-2">
                <Mic className="h-5 w-5" />
                <span>{t('voiceAssistant')}</span>
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto pt-8 border-t border-gray-200 dark:border-gray-800">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">20+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{t('statsGovernmentSchemes')}</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">24/7</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{t('statsSupportAvailable')}</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">1K+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{t('statsFarmersHelped')}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}