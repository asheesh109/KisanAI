'use client'

import { Users, Brain, FileText, Shield } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

const stats = [
  { icon: Users, value: '50K+', label: 'activeFarmers' },
  { icon: Brain, value: '1M+', label: 'solvedQueries' },
  { icon: FileText, value: '200+', label: 'listedSchemes' },
  { icon: Shield, value: '95%', label: 'aiAccuracy' },
];

// Local translations for stats labels (shorter versions for Malayalam)
const statsTranslations = {
  en: {
    activeFarmers: 'Active Farmers',
    solvedQueries: 'Queries Solved',
    listedSchemes: 'Schemes Listed',
    aiAccuracy: 'AI Accuracy',
    ourImpact: 'Our Impact'
  },
  hi: {
    activeFarmers: 'सक्रिय किसान',
    solvedQueries: 'प्रश्न हल',
    listedSchemes: 'सूचीबद्ध योजनाएं',
    aiAccuracy: 'AI सटीकता',
    ourImpact: 'हमारा प्रभाव'
  },
  mr: {
    activeFarmers: 'सक्रिय शेतकरी',
    solvedQueries: 'प्रश्न सोडवले',
    listedSchemes: 'सूचीबद्ध योजना',
    aiAccuracy: 'AI अचूकता',
    ourImpact: 'आमचा प्रभाव'
  },
  gu: {
    activeFarmers: 'સક્રિય ખેડૂતો',
    solvedQueries: 'પ્રશ્નો ઉકેલાયા',
    listedSchemes: 'યાદીમાં યોજનાઓ',
    aiAccuracy: 'AI ચોકસાઈ',
    ourImpact: 'અમારી અસર'
  },
  ml: {
    activeFarmers: 'സജീവ കർഷകർ',
    solvedQueries: 'ചോദ്യങ്ങൾ പരിഹരിച്ചു',
    listedSchemes: 'പദ്ധതികൾ',
    aiAccuracy: 'AI കൃത്യത',
    ourImpact: 'ഞങ്ങളുടെ സ്വാധീനം'
  }
}

// Function to get stat translation
const getStatTranslation = (language, key) => {
  return statsTranslations[language]?.[key] || statsTranslations.en[key] || key;
}

export default function StatsSection() {
  const { language, t } = useLanguage()

  return (
    <div className="relative py-20 sm:py-28 bg-background overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/20 to-accent/20 dark:from-primary/10 dark:to-accent/10 rounded-full blur-[150px]"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div className="text-center mb-16 sm:mb-20">
          <div className="inline-block mb-4 px-5 py-2 bg-gradient-to-r from-primary/20 to-accent/20 dark:from-primary/30 dark:to-accent/30 rounded-full backdrop-blur-sm">
            <span className="text-sm font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent uppercase tracking-wider">
              Our Impact
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 text-foreground dark:bg-gradient-to-r dark:from-foreground dark:via-primary dark:to-accent dark:bg-clip-text dark:text-transparent break-words px-2">
            {getStatTranslation(language, 'ourImpact')}
          </h2>
        </div>
        
        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            const translatedLabel = getStatTranslation(language, stat.label);
            
            return (
              <div 
                key={idx} 
                className="group relative overflow-hidden rounded-3xl bg-card/80 dark:bg-card/50 backdrop-blur-sm border-2 border-border/50 dark:border-border/30 hover:border-primary/50 dark:hover:border-primary/40 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20 dark:hover:shadow-primary/10"
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 dark:from-primary/20 dark:to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Shimmer effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                
                <div className="relative text-center p-6 sm:p-8 z-10">
                  {/* Icon container */}
                  <div className="relative inline-block mb-5">
                    <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-xl group-hover:shadow-2xl group-hover:shadow-primary/30 dark:group-hover:shadow-primary/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                      <Icon className="h-8 sm:h-10 w-8 sm:w-10 text-primary-foreground" />
                    </div>
                    {/* Glow effect */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary to-accent blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-500"></div>
                  </div>
                  
                  {/* Stat value */}
                  <div className="text-4xl sm:text-5xl md:text-6xl font-black mb-3 bg-gradient-to-br from-primary via-accent to-primary bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300 break-words">
                    {stat.value}
                  </div>
                  
                  {/* Stat label - added break-words and min height for consistency */}
                  <div className="text-sm sm:text-base font-bold text-muted-foreground group-hover:text-foreground transition-colors duration-300 break-words px-1 min-h-[2.5em] flex items-center justify-center">
                    {translatedLabel}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Bottom decorative line */}
        <div className="mt-16 sm:mt-20 flex justify-center">
          <div className="w-48 h-1 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full"></div>
        </div>
      </div>
    </div>
  )
}