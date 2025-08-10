'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  CreditCard, Shield, Coins, Leaf, ChevronRight, Phone, ExternalLink, 
  Search, Filter, Calculator, Bell, FileText, CheckCircle2, Clock,
  TrendingUp, Users, Target, Calendar, AlertCircle, Download
} from 'lucide-react'
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
    count: governmentSchemes.filter(s => s.category === 'income-support').length,
  },
  {
    id: 'insurance',
    name: 'फसल बीमा',
    icon: Shield,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    description: 'फसल सुरक्षा और बीमा योजनाएं',
    count: governmentSchemes.filter(s => s.category === 'insurance').length,
  },
  {
    id: 'credit',
    name: 'ऋण योजनाएं',
    icon: CreditCard,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    description: 'कृषि ऋण और वित्तीय सहायता',
    count: governmentSchemes.filter(s => s.category === 'credit').length,
  },
  {
    id: 'subsidy',
    name: 'सब्सिडी योजनाएं',
    icon: Leaf,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    description: 'उर्वरक, बीज और यंत्र सब्सिडी',
    count: governmentSchemes.filter(s => s.category === 'subsidy').length,
  },
]

const quickActions = [
  {
    id: 'eligibility-checker',
    name: 'पात्रता जांच',
    icon: Calculator,
    description: 'अपनी पात्रता की जांच करें',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    id: 'application-tracker',
    name: 'आवेदन ट्रैकर',
    icon: FileText,
    description: 'आवेदन की स्थिति देखें',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    id: 'notifications',
    name: 'नई योजनाएं',
    icon: Bell,
    description: 'नवीनतम अपडेट प्राप्त करें',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
  {
    id: 'download-forms',
    name: 'फॉर्म डाउनलोड',
    icon: Download,
    description: 'आवेदन फॉर्म डाउनलोड करें',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
  },
]

const schemesStats = [
  { label: 'कुल योजनाएं', value: governmentSchemes.length, icon: Target, color: 'text-blue-600' },
  { label: 'लाभार्थी', value: '12.5 करोड़', icon: Users, color: 'text-green-600' },
  { label: 'कुल बजट', value: '₹2.15 लाख करोड़', icon: TrendingUp, color: 'text-purple-600' },
  { label: 'नई योजनाएं', value: '5', icon: Calendar, color: 'text-orange-600' },
]

export default function Schemes() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [filteredSchemes, setFilteredSchemes] = useState(governmentSchemes)

  useEffect(() => {
    let filtered = governmentSchemes

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(scheme => scheme.category === selectedCategory)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(scheme =>
        scheme.nameHindi.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scheme.descriptionHindi.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredSchemes(filtered)
  }, [searchTerm, selectedCategory])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold !text-slate-900 mb-4">
            सरकारी योजनाएं
          </h1>
          <p className="text-xl !text-slate-600 font-medium">
            केंद्र और राज्य सरकार की सभी कृषि योजनाओं की विस्तृत जानकारी
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {schemesStats.map((stat) => {
            const IconComponent = stat.icon
            return (
              <Card key={stat.label} className="bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm !text-slate-600 font-medium">{stat.label}</p>
                      <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                    </div>
                    <IconComponent className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Search and Filter Section */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="योजना खोजें..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent !text-slate-900 placeholder-gray-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-gray-600" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent !text-slate-900"
                >
                  <option value="all">सभी श्रेणियां</option>
                  {schemeCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold !text-slate-900 mb-6">त्वरित सेवाएं</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action) => {
              const IconComponent = action.icon
              const href = action.id === 'eligibility-checker' ? '/schemes/eligibility-checker' : '#'
              
              return (
                <Link key={action.id} href={href}>
                  <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-6 text-center">
                      <div className={`w-16 h-16 ${action.bgColor} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                        <IconComponent className={`h-8 w-8 ${action.color}`} />
                      </div>
                      <h3 className="text-lg font-semibold !text-slate-900 mb-2">{action.name}</h3>
                      <p className="text-sm !text-slate-600 font-medium">{action.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold !text-slate-900 mb-6">योजना श्रेणियां</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {schemeCategories.map((category) => {
              const IconComponent = category.icon
              return (
                <Card 
                  key={category.id} 
                  className={`group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer bg-white/80 backdrop-blur-sm ${selectedCategory === category.id ? 'ring-2 ring-green-500' : ''}`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 ${category.bgColor} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                      <IconComponent className={`h-8 w-8 ${category.color}`} />
                    </div>
                    <h3 className="text-lg font-semibold !text-slate-900 mb-2">{category.name}</h3>
                    <p className="text-sm !text-slate-600 font-medium mb-2">{category.description}</p>
                    <span className="inline-block px-2 py-1 bg-gray-100 rounded-full text-xs font-medium !text-gray-700">
                      {category.count} योजनाएं
                    </span>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Search Results Summary */}
        {(searchTerm || selectedCategory !== 'all') && (
          <div className="mb-6 flex items-center justify-between">
            <p className="!text-slate-600">
              {filteredSchemes.length} योजनाएं मिली{' '}
              {searchTerm && `"${searchTerm}" के लिए`}
              {selectedCategory !== 'all' && ` ${schemeCategories.find(c => c.id === selectedCategory)?.name} श्रेणी में`}
            </p>
            {(searchTerm || selectedCategory !== 'all') && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('all')
                }}
                className="text-sm"
              >
                फ़िल्टर साफ़ करें
              </Button>
            )}
          </div>
        )}

        {/* Featured Schemes */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold !text-slate-900 mb-6">
            {selectedCategory === 'all' ? 'मुख्य योजनाएं' : `${schemeCategories.find(c => c.id === selectedCategory)?.name}`}
          </h2>
          {filteredSchemes.length === 0 ? (
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold !text-slate-900 mb-2">कोई योजना नहीं मिली</h3>
                <p className="!text-slate-600">कृपया अपनी खोज को संशोधित करें या अन्य श्रेणी का चयन करें।</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredSchemes.map((scheme) => (
                <Card key={scheme.id} className="hover:shadow-lg transition-shadow bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl mb-2 !text-slate-900">{scheme.nameHindi}</CardTitle>
                        <CardDescription className="text-base !text-slate-600">{scheme.descriptionHindi}</CardDescription>
                      </div>
                      <div className="flex flex-col gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          scheme.category === 'income-support' ? 'bg-green-100 text-green-800' :
                          scheme.category === 'insurance' ? 'bg-blue-100 text-blue-800' :
                          scheme.category === 'credit' ? 'bg-purple-100 text-purple-800' :
                          'bg-orange-100 text-orange-800'
                        }`}>
                          {schemeCategories.find(c => c.id === scheme.category)?.name}
                        </span>
                        <div className="flex items-center text-xs text-green-600">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          सक्रिय
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium !text-slate-900 mb-2 flex items-center">
                          <Target className="h-4 w-4 mr-2 text-green-600" />
                          मुख्य लाभ:
                        </h4>
                        <ul className="text-sm !text-slate-600 space-y-1">
                          {scheme.benefitsHindi.slice(0, 2).map((benefit, index) => (
                            <li key={index} className="flex items-center">
                              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex items-center text-sm !text-slate-600">
                        <Clock className="h-4 w-4 mr-2 !text-slate-600" />
                        आवेदन की समय सीमा: चालू
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
          )}
        </div>

        {/* Quick Links */}
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="!text-slate-900">महत्वपूर्ण लिंक</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <a
                href="https://pmkisan.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="font-medium text-slate-900">PM-KISAN पोर्टल</span>
                <ExternalLink className="h-4 w-4 !text-slate-600 font-medium" />
              </a>
              <a
                href="https://pmfby.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="font-medium text-slate-900">फसल बीमा पोर्टल</span>
                <ExternalLink className="h-4 w-4 !text-slate-600 font-medium" />
              </a>
              <a
                href="https://soilhealth.dac.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="font-medium text-slate-900">मृदा स्वास्थ्य कार्ड</span>
                <ExternalLink className="h-4 w-4 !text-slate-600 font-medium" />
              </a>
              <Link href="/kcc-application">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                  <span className="font-medium text-slate-900">KCC आवेदन</span>
                  <ChevronRight className="h-4 w-4 !text-slate-600 font-medium" />
                </div>
              </Link>
              <a
                href="https://agricoop.nic.in"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="font-medium text-slate-900">कृषि मंत्रालय</span>
                <ExternalLink className="h-4 w-4 !text-slate-600 font-medium" />
              </a>
              <a
                href="tel:1551"
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="font-medium text-slate-900">किसान हेल्पलाइन</span>
                <Phone className="h-4 w-4 !text-slate-600 font-medium" />
              </a>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-gray-700">
            योजना की पात्रता और आवेदन प्रक्रिया के लिए संबंधित विभाग से संपर्क करें। 
            सभी जानकारी आधिकारिक सरकारी स्रोतों से ली गई है।
          </p>
        </div>
      </div>
    </div>
  )
}
