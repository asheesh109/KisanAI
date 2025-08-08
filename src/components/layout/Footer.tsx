import Link from 'next/link'
import { Sprout, Phone, Mail, MapPin } from 'lucide-react'

const navigation = {
  main: [
    { name: 'होम', href: '/' },
    { name: 'आवाज सहायक', href: '/voice-assistant' },
    { name: 'फसल विश्लेषण', href: '/crop-analysis' },
    { name: 'मौसम', href: '/weather' },
    { name: 'बाजार भाव', href: '/market-prices' },
    { name: 'सरकारी योजनाएं', href: '/schemes' },
  ],
  support: [
    { name: 'हेल्प सेंटर', href: '/help' },
    { name: 'संपर्क करें', href: '/contact' },
    { name: 'प्राइवेसी पॉलिसी', href: '/privacy' },
    { name: 'नियम व शर्तें', href: '/terms' },
  ],
  government: [
    { name: 'PM-KISAN', href: '/schemes/pm-kisan' },
    { name: 'Soil Health Card', href: '/schemes/soil-health' },
    { name: 'Kisan Credit Card', href: '/kcc-application' },
    { name: 'Fasal Bima Yojana', href: '/schemes/fasal-bima' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-green-800 text-white">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8">
            <div className="flex items-center space-x-2">
              <Sprout className="h-8 w-8 text-green-200" />
              <span className="text-2xl font-bold">KisanAI</span>
              <span className="text-sm text-green-200">किसान AI</span>
            </div>
            <p className="text-sm leading-6 text-green-200">
              भारतीय किसानों के लिए AI-आधारित डिजिटल सहायक। 
              खेती, मौसम, बाजार की जानकारी और सरकारी योजनाओं का लाभ उठाएं।
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-green-200">
                <Phone className="h-4 w-4" />
                <span>हेल्पलाइन: 1800-XXX-XXXX</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-green-200">
                <Mail className="h-4 w-4" />
                <span>support@kisanai.gov.in</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-green-200">
                <MapPin className="h-4 w-4" />
                <span>नई दिल्ली, भारत</span>
              </div>
            </div>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-white">मुख्य सुविधाएं</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.main.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm leading-6 text-green-200 hover:text-white transition-colors"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-white">सहायता</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.support.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm leading-6 text-green-200 hover:text-white transition-colors"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-1 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-white">सरकारी योजनाएं</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.government.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm leading-6 text-green-200 hover:text-white transition-colors"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16 border-t border-green-700 pt-8 sm:mt-20 lg:mt-24">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-5 text-green-200">
              &copy; 2025 KisanAI. सभी अधिकार सुरक्षित। डिजिटल इंडिया पहल का हिस्सा।
            </p>
            <div className="mt-4 sm:mt-0">
              <p className="text-xs leading-5 text-green-200">
                भारत सरकार के सहयोग से विकसित
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
