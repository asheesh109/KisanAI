'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X, Sprout, Globe, Sun, Moon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/components/theme-provider'
import { useLanguage } from '@/contexts/LanguageContext'

const navigation = [
  { name: 'home', href: '/' },
  { name: 'voiceAssistant', href: '/voice-assistant' },
  { name: 'cropAnalysis', href: '/crop-analysis' },
  { name: 'weather', href: '/weather' },
  { name: 'marketPrices', href: '/market-prices' },
  { name: 'governmentSchemes', href: '/schemes' },
  { name: 'kccApplication', href: '/kcc-application' },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showLangMenu, setShowLangMenu] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const { language, languages, t, changeLanguage } = useLanguage()

  // ✅ Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Render nothing until mounted to avoid SSR mismatch
  if (!mounted) return null

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sprout className="h-8 w-8 text-emerald-600" />
          <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            KisanAI
          </span>
        </div>

        <div className="ml-10 hidden space-x-8 lg:block">
          {navigation.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-base font-semibold text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
            >
              {t(link.name)}
            </Link>
          ))}
        </div>

        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className={`p-2 rounded-full ${
              theme === 'dark'
                ? 'bg-gray-800 text-yellow-400'
                : 'bg-gray-100 text-gray-900'
            } hover:scale-110 transition-transform`}
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>

          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
              } hover:scale-105 transition-transform`}
            >
              <Globe className="h-5 w-5" />
              <span className="font-semibold">
                {languages[language]?.flag}
              </span>
            </button>

            {showLangMenu && (
              <div
                className={`absolute right-0 mt-2 w-48 rounded-xl shadow-2xl ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                } border ${
                  theme === 'dark'
                    ? 'border-gray-700'
                    : 'border-gray-200'
                } overflow-hidden`}
              >
                {Object.values(languages).map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      changeLanguage(lang.code)
                      setShowLangMenu(false)
                    }}
                    className={`w-full px-4 py-3 text-left flex items-center space-x-3 ${
                      theme === 'dark'
                        ? 'hover:bg-gray-700'
                        : 'hover:bg-gray-50'
                    } transition-colors ${
                      language === lang.code
                        ? theme === 'dark'
                          ? 'bg-gray-700'
                          : 'bg-emerald-50'
                        : ''
                    }`}
                  >
                    <span className="text-2xl">{lang.flag}</span>
                    <span className="font-medium">{lang.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex lg:hidden">
            <Button
              variant="ghost"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
            {navigation.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block rounded-md px-3 py-2 text-base font-semibold text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t(link.name)}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
