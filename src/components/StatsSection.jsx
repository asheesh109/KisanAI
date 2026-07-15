'use client'

import { Users, Brain, FileText, Shield } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

const stats = [
  { icon: Users,    value: '50K+', label: 'activeFarmers', trend: '↑ Growing',    trendColor: '#22c55e' },
  { icon: Brain,    value: '1M+',  label: 'solvedQueries', trend: '↑ This month', trendColor: '#22c55e' },
  { icon: FileText, value: '200+', label: 'listedSchemes', trend: '↑ Updated',    trendColor: '#22c55e' },
  { icon: Shield,   value: '95%',  label: 'aiAccuracy',    trend: '★ Top rated',  trendColor: '#f59e0b' },
]

const statsTranslations = {
  en: {
    activeFarmers: 'Active Farmers',
    solvedQueries: 'Queries Solved',
    listedSchemes: 'Schemes Listed',
    aiAccuracy: 'AI Accuracy',
    ourImpact: 'Our Impact',
    impactSubtitle: 'Real numbers, real farmers, real results.',
  },
  hi: {
    activeFarmers: 'सक्रिय किसान',
    solvedQueries: 'प्रश्न हल',
    listedSchemes: 'सूचीबद्ध योजनाएं',
    aiAccuracy: 'AI सटीकता',
    ourImpact: 'हमारा प्रभाव',
    impactSubtitle: 'वास्तविक संख्याएं, वास्तविक किसान, वास्तविक परिणाम।',
  },
  mr: {
    activeFarmers: 'सक्रिय शेतकरी',
    solvedQueries: 'प्रश्न सोडवले',
    listedSchemes: 'सूचीबद्ध योजना',
    aiAccuracy: 'AI अचूकता',
    ourImpact: 'आमचा प्रभाव',
    impactSubtitle: 'वास्तविक संख्या, वास्तविक शेतकरी, वास्तविक परिणाम.',
  },
  gu: {
    activeFarmers: 'સક્રિય ખેડૂતો',
    solvedQueries: 'પ્રશ્નો ઉકેલાયા',
    listedSchemes: 'યાદીમાં યોજનાઓ',
    aiAccuracy: 'AI ચોકસાઈ',
    ourImpact: 'અમારી અસર',
    impactSubtitle: 'વાસ્તવિક સંખ્યાઓ, વાસ્તવિક ખેડૂતો, વાસ્તવિક પરિણામો.',
  },
  ml: {
    activeFarmers: 'സജീവ കർഷകർ',
    solvedQueries: 'ചോദ്യങ്ങൾ പരിഹരിച്ചു',
    listedSchemes: 'പദ്ധതികൾ',
    aiAccuracy: 'AI കൃത്യത',
    ourImpact: 'ഞങ്ങളുടെ സ്വാധീനം',
    impactSubtitle: 'യഥാർത്ഥ സംഖ്യകൾ, യഥാർത്ഥ കർഷകർ, യഥാർത്ഥ ഫലങ്ങൾ.',
  },
}

const getT = (language, key) =>
  statsTranslations[language]?.[key] || statsTranslations.en[key] || key

export default function StatsSection() {
  const { language } = useLanguage()

  return (
    <div className="relative py-20 sm:py-28 bg-background overflow-hidden">
      {/* background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/20 to-accent/20 dark:from-primary/10 dark:to-accent/10 rounded-full blur-[150px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* section header */}
        <div className="text-center mb-14 sm:mb-20">
          <div className="inline-block mb-4 px-5 py-2 bg-gradient-to-r from-primary/20 to-accent/20 dark:from-primary/30 dark:to-accent/30 rounded-full backdrop-blur-sm">
            <span className="text-sm font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent uppercase tracking-wider">
              {getT(language, 'ourImpact')}
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-4 text-foreground dark:bg-gradient-to-r dark:from-foreground dark:via-primary dark:to-accent dark:bg-clip-text dark:text-transparent break-words px-2">
            {getT(language, 'ourImpact')}
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto">
            {getT(language, 'impactSubtitle')}
          </p>
        </div>

        {/* stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 sm:gap-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon
            const translatedLabel = getT(language, stat.label)
            return (
              <div
                key={idx}
                className="group relative overflow-hidden rounded-3xl bg-card/80 dark:bg-card/50 backdrop-blur-sm border-2 border-border/50 dark:border-border/30 hover:border-primary/50 dark:hover:border-primary/40 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20 dark:hover:shadow-primary/10"
              >
                {/* hover gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 dark:from-primary/20 dark:to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                {/* shimmer */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                <div className="relative text-center p-6 sm:p-8 z-10">
                  {/* icon */}
                  <div className="relative inline-block mb-4">
                    <div className="w-14 sm:w-18 h-14 sm:h-18 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-xl group-hover:shadow-2xl group-hover:shadow-primary/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                      <Icon className="h-7 sm:h-9 w-7 sm:w-9 text-primary-foreground" />
                    </div>
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary to-accent blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-500" />
                  </div>

                  {/* value */}
                  <div className="text-4xl sm:text-5xl font-black mb-1 bg-gradient-to-br from-primary via-accent to-primary bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300 break-words">
                    {stat.value}
                  </div>

                  {/* trend badge */}
                  <div
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold mb-2"
                    style={{
                      background: `${stat.trendColor}18`,
                      color: stat.trendColor,
                      border: `1px solid ${stat.trendColor}40`,
                    }}
                  >
                    {stat.trend}
                  </div>

                  {/* label */}
                  <div className="text-sm sm:text-base font-bold text-muted-foreground group-hover:text-foreground transition-colors duration-300 break-words px-1 min-h-[2.5em] flex items-center justify-center">
                    {translatedLabel}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* decorative line */}
        <div className="mt-16 sm:mt-20 flex justify-center">
          <div className="w-48 h-1 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full" />
        </div>
      </div>
    </div>
  )
}