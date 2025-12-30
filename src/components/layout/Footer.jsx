'use client'

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
    <footer className="bg-card text-foreground py-8 sm:py-12 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 sm:mb-0">
            <Sprout className="h-6 sm:h-8 w-6 sm:w-8 text-primary" />
            <span className="text-xl sm:text-2xl font-bold">KisanAI</span>
          </div>
          <p className="text-muted-foreground text-center md:text-left text-sm sm:text-base">
            © 2024 KisanAI. {t('empoweringFarmers')}
          </p>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">{t('privacy')}</Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">{t('terms')}</Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">{t('contact')}</Link>
          </div>
        </div>
        
        <div className="mt-6 sm:mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-foreground">{t('mainFeatures')}</h3>
            <ul className="space-y-2 text-sm">
              {navigation.main.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-muted-foreground hover:text-foreground transition-colors">
                    {t(item.name)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-foreground">{t('support')}</h3>
            <ul className="space-y-2 text-sm">
              {navigation.support.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-muted-foreground hover:text-foreground transition-colors">
                    {t(item.name)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-foreground">{t('contactUs')}</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>{t('helpline')}: 18xx-XXX-XXXX</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>support@kisanai.gov.in</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>{t('address')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}