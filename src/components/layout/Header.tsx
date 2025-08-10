'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Sprout } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle, ThemeToggleCompact } from '@/components/theme-toggle'

const navigation = [
  { name: 'होम', href: '/', current: true },
  { name: 'आवाज सहायक', href: '/voice-assistant', current: false },
  { name: 'फसल विश्लेषण', href: '/crop-analysis', current: false },
  { name: 'मौसम', href: '/weather', current: false },
  { name: 'बाजार भाव', href: '/market-prices', current: false },
  { name: 'सरकारी योजनाएं', href: '/schemes', current: false },
  { name: 'KCC आवेदन', href: '/kcc-application', current: false },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-farming-800 dark:bg-farming-900 shadow-lg border-b border-farming-700 dark:border-farming-800 transition-colors duration-300">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex w-full items-center justify-between border-b border-farming-700 dark:border-farming-800 py-6 lg:border-none">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Sprout className="h-8 w-8 text-farming-200 dark:text-farming-300" />
              <span className="text-2xl font-bold text-white">KisanAI</span>
              <span className="text-sm text-farming-200 dark:text-farming-300 font-medium">किसान AI</span>
            </Link>
          </div>
          <div className="ml-10 hidden space-x-8 lg:block">
            {navigation.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-base font-semibold text-white hover:text-farming-200 dark:hover:text-farming-300 transition-colors duration-200"
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="ml-10 flex items-center space-x-4">
            <ThemeToggleCompact />
            <Button
              variant="outline"
              className="bg-white text-farming-700 hover:bg-farming-50 border-white dark:bg-farming-800 dark:text-farming-200 dark:border-farming-600 dark:hover:bg-farming-700"
            >
              लॉगिन
            </Button>
            <div className="flex lg:hidden">
              <Button
                variant="ghost"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-white hover:bg-farming-700 dark:hover:bg-farming-800"
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
        <div className="flex flex-wrap justify-center space-x-6 py-4 lg:hidden">
          {navigation.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-base font-semibold text-white hover:text-farming-200 dark:hover:text-farming-300 transition-colors duration-200"
            >
              {link.name}
            </Link>
          ))}
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-farming-700 dark:bg-farming-800">
          <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
            <div className="flex justify-center py-2">
              <ThemeToggle />
            </div>
            {navigation.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block rounded-md px-3 py-2 text-base font-semibold text-white hover:bg-farming-600 dark:hover:bg-farming-700 transition-colors duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
