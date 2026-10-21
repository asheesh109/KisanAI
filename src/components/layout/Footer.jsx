'use client'

import Link from 'next/link'
import { Sprout, Phone, Mail, MapPin, Settings } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { usePreferences } from '@/contexts/PreferencesContext'
import UserPreferencesModal from '@/components/UserPreferencesModal'

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

// English/Hindi UI labels
const footerTranslations = {
  en: {
    empoweringFarmers: 'Empowering farmers with AI technology',
    mainFeatures: 'Main Features',
    support: 'Support',
    contactUs: 'Contact Us',
    helpline: 'Helpline',
    address: 'Ministry of Agriculture, New Delhi, India',
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
    contact: 'Contact Us'
  },
  hi: {
    empoweringFarmers: 'किसानों को एआई प्रौद्योगिकी से सशक्त बनाना',
    mainFeatures: 'मुख्य विशेषताएं',
    support: 'समर्थन',
    contactUs: 'संपर्क करें',
    helpline: 'हेल्पलाइन',
    address: 'कृषि मंत्रालय, नई दिल्ली, भारत',
    privacy: 'गोपनीयता नीति',
    terms: 'सेवा की शर्तें',
    contact: 'संपर्क करें'
  }
}

const getFooterTranslation = (language, key) => {
  return footerTranslations[language]?.[key] || footerTranslations.en[key] || key
}

export default function Footer() {
  const { language, t } = useLanguage()
  const { preferences } = usePreferences()

  return (
    <footer className="bg-card text-foreground py-8 sm:py-12 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top section: Logo, Copyright, and Action Links */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 sm:mb-8">
          <div className="flex items-center space-x-2 mb-4 sm:mb-0">
            <Sprout className="h-6 sm:h-8 w-6 sm:w-8 text-primary" />
            <span className="text-xl sm:text-2xl font-bold">KisanAI</span>
          </div>
          <p className="text-muted-foreground text-center md:text-left text-sm sm:text-base break-words px-2">
            © 2024 KisanAI. {getFooterTranslation(language, 'empoweringFarmers')}
          </p>
          <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 mt-4 sm:mt-0">
            <Link 
              href="#" 
              className="text-muted-foreground hover:text-foreground transition-colors text-sm whitespace-nowrap"
            >
              {getFooterTranslation(language, 'privacy')}
            </Link>
            <Link 
              href="#" 
              className="text-muted-foreground hover:text-foreground transition-colors text-sm whitespace-nowrap"
            >
              {getFooterTranslation(language, 'terms')}
            </Link>
            <Link 
              href="#" 
              className="text-muted-foreground hover:text-foreground transition-colors text-sm whitespace-nowrap"
            >
              {getFooterTranslation(language, 'contact')}
            </Link>

            {/* Preferences Modal Component */}
            <UserPreferencesModal />
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="mt-6 sm:mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Main Features */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-foreground">
              {getFooterTranslation(language, 'mainFeatures')}
            </h3>
            <ul className="space-y-2">
              {navigation.main.map((item) => (
                <li key={item.name}>
                  <Link 
                    href={item.href} 
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm break-words inline-block max-w-full"
                  >
                    {t(item.name)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-foreground">
              {getFooterTranslation(language, 'support')}
            </h3>
            <ul className="space-y-2">
              {navigation.support.map((item) => (
                <li key={item.name}>
                  <Link 
                    href={item.href} 
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm break-words inline-block max-w-full"
                  >
                    {t(item.name)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-foreground">
              {getFooterTranslation(language, 'contactUs')}
            </h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-start sm:items-center space-x-2">
                <Phone className="h-4 w-4 flex-shrink-0 mt-0.5 sm:mt-0" />
                <span className="break-words">
                  {getFooterTranslation(language, 'helpline')}: 18xx-XXX-XXXX
                </span>
              </div>
              <div className="flex items-start sm:items-center space-x-2">
                <Mail className="h-4 w-4 flex-shrink-0 mt-0.5 sm:mt-0" />
                <span className="break-words">
                  support@kisanai.gov.in
                </span>
              </div>
              <div className="flex items-start sm:items-center space-x-2">
                <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5 sm:mt-0" />
                <span className="break-words">
                  {getFooterTranslation(language, 'address')}
                </span>
              </div>

              {/* Display Saved Region Preference */}
              {preferences?.region && (
                <div className="flex items-center space-x-2 text-emerald-600 font-medium pt-2">
                  <Settings className="h-4 w-4 flex-shrink-0" />
                  <span>Region: {preferences.region}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Note */}
        <div className="mt-8 pt-6 border-t border-border text-center">
          <p className="text-xs text-muted-foreground break-words">
            {t('governmentInitiativeNote') || 'An initiative to support farmers with modern technology.'}
          </p>
        </div>
      </div>
    </footer>
  )
}