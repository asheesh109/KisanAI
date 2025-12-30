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

  // Close language menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showLangMenu && !event.target.closest('.language-menu-container')) {
        setShowLangMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showLangMenu])

  // Render nothing until mounted to avoid SSR mismatch
  if (!mounted) return null

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 dark:bg-gray-900/90 border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo Section - Flex shrink to prevent overflow */}
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
            <div className="relative">
              <Sprout className="h-7 w-7 sm:h-8 sm:w-8 text-emerald-600 dark:text-emerald-500" />
              <div className="absolute inset-0 bg-emerald-600/20 blur-xl"></div>
            </div>
            <span className="text-xl sm:text-2xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-500 dark:to-teal-500 bg-clip-text text-transparent">
              KisanAI
            </span>
          </Link>

          {/* Desktop Navigation - Hidden on mobile */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navigation.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="px-3 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
              >
                {t(link.name)}
              </Link>
            ))}
          </nav>

          {/* Right Side Controls - Optimized spacing for mobile */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 md:space-x-3">
            {/* Theme Toggle - Smaller on mobile */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={`p-2 rounded-lg ${
                theme === 'dark'
                  ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              } hover:scale-105 transition-all duration-200 flex-shrink-0`}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4 sm:h-5 sm:w-5" />
              ) : (
                <Moon className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </button>

            {/* Language Switcher - Compact on mobile */}
            <div className="relative language-menu-container flex-shrink-0">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className={`flex items-center space-x-1.5 sm:space-x-2 px-2.5 sm:px-4 py-2 rounded-lg ${
                  theme === 'dark' 
                    ? 'bg-gray-800 hover:bg-gray-700' 
                    : 'bg-gray-100 hover:bg-gray-200'
                } hover:scale-105 transition-all duration-200`}
                aria-label="Change language"
              >
                <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700 dark:text-gray-300" />
                <span className="text-base sm:text-lg font-semibold">
                  {languages[language]?.flag}
                </span>
              </button>

              {/* Language Dropdown */}
              {showLangMenu && (
                <div
                  className={`absolute right-0 mt-2 w-44 sm:w-48 rounded-xl shadow-2xl ${
                    theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                  } border ${
                    theme === 'dark'
                      ? 'border-gray-700'
                      : 'border-gray-200'
                  } overflow-hidden animate-fade-in z-50`}
                >
                  {Object.values(languages).map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        changeLanguage(lang.code)
                        setShowLangMenu(false)
                      }}
                      className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-left flex items-center space-x-2 sm:space-x-3 ${
                        theme === 'dark'
                          ? 'hover:bg-gray-700'
                          : 'hover:bg-gray-50'
                      } transition-colors ${
                        language === lang.code
                          ? theme === 'dark'
                            ? 'bg-gray-700 border-l-4 border-emerald-500'
                            : 'bg-emerald-50 border-l-4 border-emerald-600'
                          : ''
                      }`}
                    >
                      <span className="text-xl sm:text-2xl">{lang.flag}</span>
                      <span className="font-medium text-sm sm:text-base text-gray-900 dark:text-white">
                        {lang.name}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle - Only visible on mobile */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 flex-shrink-0"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu - Full width, smooth animation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg animate-slide-down">
          <nav className="px-4 py-4 space-y-1">
            {navigation.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block rounded-lg px-4 py-3 text-base font-semibold text-gray-900 dark:text-white hover:bg-emerald-50 dark:hover:bg-gray-700 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t(link.name)}
              </Link>
            ))}
          </nav>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-down {
          from {
            opacity: 0;
            max-height: 0;
          }
          to {
            opacity: 1;
            max-height: 500px;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }

        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
      `}</style>
    </header>
  )
}