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

// Local translations for footer specific content
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
  },
  mr: {
    empoweringFarmers: 'शेतकऱ्यांना AI तंत्रज्ञानाद्वारे सक्षम करणे',
    mainFeatures: 'मुख्य वैशिष्ट्ये',
    support: 'समर्थन',
    contactUs: 'संपर्क साधा',
    helpline: 'हेल्पलाइन',
    address: 'कृषी मंत्रालय, नवी दिल्ली, भारत',
    privacy: 'गोपनीयता धोरण',
    terms: 'सेवा अटी',
    contact: 'संपर्क साधा'
  },
  gu: {
    empoweringFarmers: 'AI ટેક્નોલોજી સાથે ખેડૂતોને સશક્ત બનાવવું',
    mainFeatures: 'મુખ્ય વિશેષતાઓ',
    support: 'સપોર્ટ',
    contactUs: 'અમારો સંપર્ક કરો',
    helpline: 'હેલ્પલાઇન',
    address: 'કૃષિ મંત્રાલય, નવી દિલ્હી, ભારત',
    privacy: 'ગોપનીયતા નીતિ',
    terms: 'સેવાની શરતો',
    contact: 'સંપર્ક કરો'
  },
  ml: {
    empoweringFarmers: 'AI സാങ്കേതികവിദ്യയിലൂടെ കർഷകരെ ശാക്തീകരിക്കുന്നു',
    mainFeatures: 'പ്രധാന സവിശേഷതകൾ',
    support: 'പിന്തുണ',
    contactUs: 'ഞങ്ങളെ ബന്ധപ്പെടുക',
    helpline: 'ഹെൽപ്പ്‌ലൈൻ',
    address: 'കാർഷിക മന്ത്രാലയം, ന്യൂ ഡൽഹി, ഇന്ത്യ',
    privacy: 'സ്വകാര്യതാനയം',
    terms: 'സേവന വ്യവസ്ഥകൾ',
    contact: 'ബന്ധപ്പെടുക'
  }
}

// Function to get footer translation
const getFooterTranslation = (language, key) => {
  return footerTranslations[language]?.[key] || footerTranslations.en[key] || key;
}

export default function Footer() {
  const { language, t } = useLanguage()

  // Get shorter navigation names for Malayalam
  const getNavigationName = (key) => {
    if (language === 'ml') {
      const malayalamShortNames = {
        'home': 'ഹോം',
        'voiceAssistant': 'വോയ്‌സ് സഹായി',
        'cropAnalysis': 'വിള വിശകലനം',
        'weather': 'കാലാവസ്ഥ',
        'marketPrices': 'വിപണി വിലകൾ',
        'governmentSchemes': 'സർക്കാർ പദ്ധതികൾ',
        'help': 'സഹായം',
        'contact': 'ബന്ധപ്പെടുക',
        'privacy': 'സ്വകാര്യത',
        'terms': 'നിബന്ധനകൾ',
        'PM-KISAN': 'പിഎം-കിസാൻ',
        'Soil Health Card': 'മണ്ണ് ആരോഗ്യ കാർഡ്',
        'Kisan Credit Card': 'കിസാൻ ക്രെഡിറ്റ് കാർഡ്',
        'Fasal Bima Yojana': 'ഫസൽ ബിമ യോജന'
      }
      return malayalamShortNames[key] || t(key)
    }
    return t(key)
  }

  return (
    <footer className="bg-card text-foreground py-8 sm:py-12 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top section with logo and copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 sm:mb-8">
          <div className="flex items-center space-x-2 mb-4 sm:mb-0">
            <Sprout className="h-6 sm:h-8 w-6 sm:w-8 text-primary" />
            <span className="text-xl sm:text-2xl font-bold">KisanAI</span>
          </div>
          <p className="text-muted-foreground text-center md:text-left text-sm sm:text-base break-words px-2">
            © 2024 KisanAI. {getFooterTranslation(language, 'empoweringFarmers')}
          </p>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-4 sm:mt-0">
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
          </div>
        </div>
        
        {/* Navigation sections */}
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
                    {getNavigationName(item.name)}
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
                    {getNavigationName(item.name)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact Us */}
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
            </div>
          </div>
        </div>

        

        {/* Bottom note */}
        <div className="mt-8 pt-6 border-t border-border text-center">
          <p className="text-xs text-muted-foreground break-words">
            {t('governmentInitiativeNote') || 'An initiative to support farmers with modern technology.'}
          </p>
        </div>
      </div>
    </footer>
  )
}