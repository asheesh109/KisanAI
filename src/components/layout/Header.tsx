'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Sprout } from 'lucide-react'
import { Button } from '@/components/ui/button'

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
    <header className="bg-green-800 shadow-lg border-b border-green-700">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex w-full items-center justify-between border-b border-green-700 py-6 lg:border-none">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Sprout className="h-8 w-8 text-green-200" />
              <span className="text-2xl font-bold text-white">KisanAI</span>
              <span className="text-sm text-green-200 font-medium">किसान AI</span>
            </Link>
          </div>
          <div className="ml-10 hidden space-x-8 lg:block">
            {navigation.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-base font-semibold text-white hover:text-green-200 transition-colors duration-200"
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="ml-10 flex space-x-4">
            <Button
              variant="outline"
              className="bg-white text-green-700 hover:bg-green-50 border-white"
            >
              लॉगिन
            </Button>
            <div className="flex lg:hidden">
              <Button
                variant="ghost"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-white hover:bg-green-700"
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
              className="text-base font-semibold text-white hover:text-green-200 transition-colors duration-200"
            >
              {link.name}
            </Link>
          ))}
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-green-700">
          <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
            {navigation.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block rounded-md px-3 py-2 text-base font-semibold text-white hover:bg-green-600 transition-colors duration-200"
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
