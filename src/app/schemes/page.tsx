import Link from 'next/link'
import { CreditCard, Shield, Coins, Leaf, ChevronRight, Phone, ExternalLink } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { governmentSchemes } from '@/data/governmentSchemes'

const schemeCategories = [
  {
    id: 'income-support',
    name: 'आय सहायता',
    icon: Coins,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    description: 'प्रत्यक्ष आर्थिक सहायता योजनाएं',
  },
  {
    id: 'insurance',
    name: 'फसल बीमा',
    icon: Shield,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    description: 'फसल सुरक्षा और बीमा योजनाएं',
  },
  {
    id: 'credit',
    name: 'ऋण योजनाएं',
    icon: CreditCard,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    description: 'कृषि ऋण और वित्तीय सहायता',
  },
  {
    id: 'subsidy',
    name: 'सब्सिडी योजनाएं',
    icon: Leaf,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    description: 'उर्वरक, बीज और यंत्र सब्सिडी',
  },
]

export default function Schemes() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            सरकारी योजनाएं
          </h1>
          <p className="text-xl text-gray-600">
            केंद्र और राज्य सरकार की सभी कृषि योजनाओं की विस्तृत जानकारी
          </p>
        </div>

        {/* Quick Access Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {schemeCategories.map((category) => {
            const IconComponent = category.icon
            return (
              <Card key={category.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 ${category.bgColor} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <IconComponent className={`h-8 w-8 ${category.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.name}</h3>
                  <p className="text-sm text-gray-600">{category.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Featured Schemes */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">मुख्य योजनाएं</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {governmentSchemes.map((scheme) => (
              <Card key={scheme.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl mb-2">{scheme.nameHindi}</CardTitle>
                      <CardDescription className="text-base">{scheme.descriptionHindi}</CardDescription>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      scheme.category === 'income-support' ? 'bg-green-100 text-green-800' :
                      scheme.category === 'insurance' ? 'bg-blue-100 text-blue-800' :
                      scheme.category === 'credit' ? 'bg-purple-100 text-purple-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {schemeCategories.find(c => c.id === scheme.category)?.name}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">मुख्य लाभ:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {scheme.benefitsHindi.slice(0, 2).map((benefit, index) => (
                          <li key={index} className="flex items-center">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Link href={`/schemes/${scheme.id}`} className="flex-1">
                        <Button className="w-full bg-green-600 hover:bg-green-700">
                          विस्तार से देखें
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                      <Button variant="outline" className="flex items-center justify-center">
                        <Phone className="mr-2 h-4 w-4" />
                        {scheme.helplineNumber}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <Card>
          <CardHeader>
            <CardTitle>महत्वपूर्ण लिंक</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <a
                href="https://pmkisan.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="font-medium text-gray-900">PM-KISAN पोर्टल</span>
                <ExternalLink className="h-4 w-4 text-gray-600" />
              </a>
              <a
                href="https://pmfby.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="font-medium text-gray-900">फसल बीमा पोर्टल</span>
                <ExternalLink className="h-4 w-4 text-gray-600" />
              </a>
              <a
                href="https://soilhealth.dac.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="font-medium text-gray-900">मृदा स्वास्थ्य कार्ड</span>
                <ExternalLink className="h-4 w-4 text-gray-600" />
              </a>
              <Link href="/kcc-application">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                  <span className="font-medium text-gray-900">KCC आवेदन</span>
                  <ChevronRight className="h-4 w-4 text-gray-600" />
                </div>
              </Link>
              <a
                href="https://agricoop.nic.in"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="font-medium text-gray-900">कृषि मंत्रालय</span>
                <ExternalLink className="h-4 w-4 text-gray-600" />
              </a>
              <a
                href="tel:1551"
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="font-medium text-gray-900">किसान हेल्पलाइन</span>
                <Phone className="h-4 w-4 text-gray-600" />
              </a>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-gray-500">
            योजना की पात्रता और आवेदन प्रक्रिया के लिए संबंधित विभाग से संपर्क करें। 
            सभी जानकारी आधिकारिक सरकारी स्रोतों से ली गई है।
          </p>
        </div>
      </div>
    </div>
  )
}
