'use client';
import Link from 'next/link'
import { Sprout, Phone, Mail, MapPin } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

const navigation = {
  main: [
    { name: 'home', href: '/' },
    { name: 'voiceAssistant', href: '/voice-assistant' },
    { name: 'cropAnalysis', href: '/crop-analysis' },
    { name: 'weather', href: '/weather' },
    { name: 'marketPrices', href: '/market-prices' },
    { name: 'governmentSchemes', href: '/schemes' },
  ],
  support: [
    { name: 'help', href: '/help' },
    { name: 'contact', href: '/contact' },
    { name: 'privacy', href: '/privacy' },
    { name: 'terms', href: '/terms' },
  ],
  government: [
    { name: 'PM-KISAN', href: '/schemes/pm-kisan' },
    { name: 'Soil Health Card', href: '/schemes/soil-health' },
    { name: 'Kisan Credit Card', href: '/kcc-application' },
    { name: 'Fasal Bima Yojana', href: '/schemes/fasal-bima' },
  ],
}

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white py-12 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Sprout className="h-8 w-8 text-emerald-500" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">KisanAI</span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-center md:text-left">
            © 2024 KisanAI. {t('empoweringFarmers')}
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-emerald-500 transition-colors">{t('privacy')}</a>
            <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-emerald-500 transition-colors">{t('terms')}</a>
            <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-emerald-500 transition-colors">{t('contact')}</a>
          </div>
        </div>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('mainFeatures')}</h3>
            <ul className="space-y-2">
              {navigation.main.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                    {t(item.name)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('support')}</h3>
            <ul className="space-y-2">
              {navigation.support.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                    {t(item.name)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('contactUs')}</h3>
            <div className="space-y-2 text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                <span>{t('helpline')}: 1800-XXX-XXXX</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                <span>support@kisanai.gov.in</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                <span>{t('address')}</span>
              </div>
            </div>
          </div>
        </div>
        
        
      </div>
    </footer>
  )
}