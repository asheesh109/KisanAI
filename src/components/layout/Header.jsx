'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useId, useState } from 'react'
import { Menu, X, Sprout, Globe, Sun, Moon } from 'lucide-react'
import { useTheme } from '@/components/theme-provider'
import { useLanguage } from '@/contexts/LanguageContext'

const navigation = [
  { name: 'home', href: '/' },
  { name: 'calendar', href: '/calendar' },
  { name: 'voiceAssistant', href: '/voice-assistant' },
  { name: 'cropAnalysis', href: '/crop-analysis' },
  { name: 'weather', href: '/weather' },
  { name: 'marketPrices', href: '/market-prices' },
  { name: 'governmentSchemes', href: '/schemes' },
  { name: 'kccApplication', href: '/kcc-application' },
]

const focusRingClasses =
  'focus-visible:outline-none focus-visible:ring-2 ' +
  'focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2 ' +
  'focus-visible:ring-offset-[hsl(var(--background))]'

function isNavigationActive(pathname, href) {
  if (href === '/') {
    return pathname === '/'
  }

  return pathname === href || pathname.startsWith(`${href}/`)
}

function getNavigationLinkClassName(isActive, isMobile = false) {
  const sizeClasses = isMobile
    ? 'block px-4 py-3 text-base'
    : 'px-3 py-2 text-sm'

  const stateClasses = isActive
    ? 'bg-secondary text-secondary-foreground underline decoration-[hsl(var(--primary))] decoration-2 underline-offset-4'
    : 'text-foreground hover:bg-[hsl(var(--muted))]'

  return [
    sizeClasses,
    'rounded-lg font-semibold',
    stateClasses,
    'transition-colors duration-200 motion-reduce:transition-none',
    focusRingClasses,
  ].join(' ')
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showLangMenu, setShowLangMenu] = useState(false)
  const [mounted, setMounted] = useState(false)

  const pathname = usePathname()
  const languageMenuId = useId()
  const mobileMenuId = useId()

  const { theme, setTheme } = useTheme()
  const { language, languages, t, changeLanguage } = useLanguage()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showLangMenu &&
        event.target instanceof Element &&
        !event.target.closest('.language-menu-container')
      ) {
        setShowLangMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showLangMenu])

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setShowLangMenu(false)
        setMobileMenuOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  if (!mounted) {
    return null
  }

  const isDarkTheme = theme === 'dark'

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background text-foreground shadow-sm transition-colors duration-200 motion-reduce:transition-none">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between sm:h-18">
          <Link
            href="/"
            aria-label="KisanAI home"
            className={`flex flex-shrink-0 items-center space-x-2 rounded-md ${focusRingClasses}`}
          >
            <div className="relative">
              <Sprout
                className="h-7 w-7 text-primary sm:h-8 sm:w-8"
                aria-hidden="true"
              />
              <div
                className="absolute inset-0 bg-emerald-600/20 blur-xl"
                aria-hidden="true"
              />
            </div>

            <span className="text-xl font-black text-primary sm:text-2xl">
              KisanAI
            </span>
          </Link>

          <nav
            aria-label="Primary navigation"
            className="hidden items-center space-x-1 lg:flex xl:space-x-2"
          >
            {navigation.map((link) => {
              const isActive = isNavigationActive(pathname, link.href)

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={getNavigationLinkClassName(isActive)}
                >
                  {t(link.name)}
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center space-x-1.5 sm:space-x-2 md:space-x-3">
            <button
              type="button"
              onClick={() => setTheme(isDarkTheme ? 'light' : 'dark')}
              className={`flex-shrink-0 rounded-lg bg-muted p-2 text-foreground transition-colors duration-200 hover:bg-[hsl(var(--secondary))] motion-reduce:transition-none ${focusRingClasses}`}
              aria-label={
                isDarkTheme
                  ? 'Switch to light theme'
                  : 'Switch to dark theme'
              }
              title={
                isDarkTheme
                  ? 'Switch to light theme'
                  : 'Switch to dark theme'
              }
            >
              {isDarkTheme ? (
                <Sun
                  className="h-4 w-4 text-yellow-500 sm:h-5 sm:w-5"
                  aria-hidden="true"
                />
              ) : (
                <Moon
                  className="h-4 w-4 sm:h-5 sm:w-5"
                  aria-hidden="true"
                />
              )}
            </button>

            <div className="language-menu-container relative flex-shrink-0">
              <button
                type="button"
                onClick={() => setShowLangMenu((current) => !current)}
                className={`flex items-center space-x-1.5 rounded-lg bg-muted px-2.5 py-2 text-foreground transition-colors duration-200 hover:bg-[hsl(var(--secondary))] motion-reduce:transition-none sm:space-x-2 sm:px-4 ${focusRingClasses}`}
                aria-label="Change language"
                aria-expanded={showLangMenu}
                aria-controls={languageMenuId}
              >
                <Globe
                  className="h-4 w-4 sm:h-5 sm:w-5"
                  aria-hidden="true"
                />

                <span className="text-base font-semibold sm:text-lg">
                  {languages[language]?.flag}
                </span>
              </button>

              {showLangMenu && (
                <div
                  id={languageMenuId}
                  role="group"
                  aria-label="Language options"
                  className="absolute right-0 z-50 mt-2 w-44 overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-2xl animate-fade-in sm:w-48"
                >
                  {Object.values(languages).map((lang) => {
                    const isSelected = language === lang.code

                    return (
                      <button
                        type="button"
                        aria-pressed={isSelected}
                        key={lang.code}
                        onClick={() => {
                          changeLanguage(lang.code)
                          setShowLangMenu(false)
                        }}
                        className={`flex w-full items-center space-x-2 px-3 py-2.5 text-left transition-colors duration-200 hover:bg-[hsl(var(--muted))] focus-visible:bg-[hsl(var(--muted))] focus-visible:outline-none motion-reduce:transition-none sm:space-x-3 sm:px-4 sm:py-3 ${
                          isSelected
                            ? 'border-l-4 border-[hsl(var(--primary))] bg-muted'
                            : ''
                        }`}
                      >
                        <span
                          className="text-xl sm:text-2xl"
                          aria-hidden="true"
                        >
                          {lang.flag}
                        </span>

                        <span className="text-sm font-medium text-card-foreground sm:text-base">
                          {lang.name}
                        </span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((current) => !current)}
              className={`flex-shrink-0 rounded-lg bg-muted p-2 text-foreground transition-colors duration-200 hover:bg-[hsl(var(--secondary))] motion-reduce:transition-none lg:hidden ${focusRingClasses}`}
              aria-label={
                mobileMenuOpen
                  ? 'Close navigation menu'
                  : 'Open navigation menu'
              }
              aria-expanded={mobileMenuOpen}
              aria-controls={mobileMenuId}
            >
              {mobileMenuOpen ? (
                <X
                  className="h-5 w-5 sm:h-6 sm:w-6"
                  aria-hidden="true"
                />
              ) : (
                <Menu
                  className="h-5 w-5 sm:h-6 sm:w-6"
                  aria-hidden="true"
                />
              )}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div
          id={mobileMenuId}
          className="animate-slide-down border-t border-border bg-card text-card-foreground shadow-lg lg:hidden"
        >
          <nav
            aria-label="Mobile navigation"
            className="space-y-1 px-4 py-4"
          >
            {navigation.map((link) => {
              const isActive = isNavigationActive(pathname, link.href)

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={getNavigationLinkClassName(isActive, true)}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t(link.name)}
                </Link>
              )
            })}
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

        @media (prefers-reduced-motion: reduce) {
          .animate-fade-in,
          .animate-slide-down {
            animation: none;
          }
        }
      `}</style>
    </header>
  )
}
