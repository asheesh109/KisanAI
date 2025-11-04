'use client'

import { Users, Brain, FileText, Shield } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

const stats = [
  { icon: Users, value: '50K+', label: 'activeFarmers' },
  { icon: Brain, value: '1M+', label: 'solvedQueries' },
  { icon: FileText, value: '200+', label: 'listedSchemes' },
  { icon: Shield, value: '95%', label: 'aiAccuracy' },
];

export default function StatsSection() {
  const { t } = useLanguage()

  return (
    <div className="py-16 bg-slate-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
          {t('ourImpact')}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="text-center p-6 rounded-2xl bg-white dark:bg-gray-900 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2">
                <Icon className="h-12 w-12 mx-auto mb-4 text-emerald-600" />
                <div className="text-4xl font-extrabold mb-2 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                  {t(stat.label)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  )
}