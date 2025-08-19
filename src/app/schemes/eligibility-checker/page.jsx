'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Calculator, CheckCircle2, XCircle, AlertTriangle, 
  ArrowLeft, ExternalLink 
} from 'lucide-react'
import { governmentSchemes } from '@/data/governmentSchemes'
import { 
  eligibilityCriteria, 
  checkEligibility
} from '@/data/schemeApplications'
import Link from 'next/link'

export default function EligibilityChecker() {
  const [selectedScheme, setSelectedScheme] = useState('')
  const [formData, setFormData] = useState({})
  const [result, setResult] = useState(null)

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (selectedScheme) {
      const eligibilityResult = checkEligibility(selectedScheme, formData)
      setResult(eligibilityResult)
    }
  }

  const selectedCriteria = eligibilityCriteria.find(c => c.schemeId === selectedScheme)
  const selectedSchemeData = governmentSchemes.find(s => s.id === selectedScheme)

  const resetForm = () => {
    setSelectedScheme('')
    setFormData({})
    setResult(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-6 sm:px-8">
        <div className="mb-8">
          <Link href="/schemes">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              योजनाओं पर वापस जाएं
            </Button>
          </Link>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Calculator className="h-12 w-12 text-green-600 mr-3" />
              <h1 className="text-4xl font-bold text-slate-900">
                पात्रता जांच
              </h1>
            </div>
            <p className="text-xl text-slate-600 font-medium">
              अपनी पात्रता की जांच करें और सही योजना का चुनाव करें
            </p>
          </div>
        </div>

        {/* Scheme Selection */}
        {!selectedScheme && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>योजना चुनें</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {governmentSchemes
                  .filter(scheme => eligibilityCriteria.some(c => c.schemeId === scheme.id))
                  .map((scheme) => (
                    <Card 
                      key={scheme.id} 
                      className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-green-300"
                      onClick={() => setSelectedScheme(scheme.id)}
                    >
                      <CardContent className="p-6">
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">
                          {scheme.nameHindi}
                        </h3>
                        <p className="text-sm text-slate-600 mb-4">
                          {scheme.descriptionHindi}
                        </p>
                        <Button className="w-full bg-green-600 hover:bg-green-700">
                          पात्रता जांचें
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Eligibility Form */}
        {selectedScheme && selectedCriteria && !result && (
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{selectedSchemeData?.nameHindi}</CardTitle>
                  <p className="text-sm text-slate-600 mt-1">
                    कृपया निम्नलिखित जानकारी भरें
                  </p>
                </div>
                <Button variant="outline" onClick={resetForm}>
                  योजना बदलें
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {selectedCriteria.criteria.map((criterion) => (
                  <div key={criterion.field} className="space-y-2">
                    <label className="block text-sm font-medium text-slate-900">
                      {criterion.labelHindi}
                      {criterion.required && <span className="text-red-500 ml-1">*</span>}
                      {criterion.unit && (
                        <span className="text-slate-500 ml-2">({criterion.unit})</span>
                      )}
                    </label>
                    
                    {criterion.type === 'number' && (
                      <input
                        type="number"
                        required={criterion.required}
                        min={criterion.min}
                        max={criterion.max}
                        step="0.1"
                        value={formData[criterion.field] || ''}
                        onChange={(e) => handleInputChange(criterion.field, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder={`${criterion.min || 0} से ${criterion.max || '∞'} तक`}
                      />
                    )}
                    
                    {criterion.type === 'select' && (
                      <select
                        required={criterion.required}
                        value={formData[criterion.field] || ''}
                        onChange={(e) => handleInputChange(criterion.field, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="">चुनें...</option>
                        {criterion.options?.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.labelHindi}
                          </option>
                        ))}
                      </select>
                    )}
                    
                    {criterion.type === 'boolean' && (
                      <div className="flex items-center space-x-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name={criterion.field}
                            value="true"
                            checked={formData[criterion.field] === true || formData[criterion.field] === 'true'}
                            onChange={() => handleInputChange(criterion.field, true)}
                            className="mr-2 text-green-600 focus:ring-green-500"
                          />
                          हां
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name={criterion.field}
                            value="false"
                            checked={formData[criterion.field] === false || formData[criterion.field] === 'false'}
                            onChange={() => handleInputChange(criterion.field, false)}
                            className="mr-2 text-green-600 focus:ring-green-500"
                          />
                          नहीं
                        </label>
                      </div>
                    )}
                  </div>
                ))}
                
                <Button 
                  type="submit" 
                  className="w-full bg-green-600 hover:bg-green-700 py-3 text-lg"
                >
                  पात्रता जांचें
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {result && selectedSchemeData && (
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>पात्रता परिणाम</CardTitle>
                <Button variant="outline" onClick={() => setResult(null)}>
                  फिर से जांचें
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className={`p-6 rounded-lg border-2 ${
                  result.eligible 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-center justify-center mb-4">
                    {result.eligible ? (
                      <CheckCircle2 className="h-16 w-16 text-green-600" />
                    ) : (
                      <XCircle className="h-16 w-16 text-red-600" />
                    )}
                  </div>
                  <div className="text-center">
                    <h3 className={`text-2xl font-bold mb-2 ${
                      result.eligible ? 'text-green-900' : 'text-red-900'
                    }`}>
                      {result.eligible ? 'आप पात्र हैं!' : 'आप पात्र नहीं हैं'}
                    </h3>
                    <p className="text-slate-700">
                      {selectedSchemeData.nameHindi} के लिए
                    </p>
                    <div className="mt-4">
                      <div className="flex items-center justify-center space-x-2">
                        <span className="text-lg font-medium">स्कोर:</span>
                        <span className="text-2xl font-bold">
                          {result.score}/{result.maxScore}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {result.missingCriteria.length > 0 && (
                  <Card className="border-orange-200 bg-orange-50">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <AlertTriangle className="h-6 w-6 text-orange-600 mr-2" />
                        <h4 className="text-lg font-semibold text-orange-900">
                          आवश्यक शर्तें
                        </h4>
                      </div>
                      <ul className="space-y-2">
                        {result.missingCriteria.map((criteria, index) => (
                          <li key={index} className="flex items-center text-orange-800">
                            <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                            {criteria}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                <Card className="border-blue-200 bg-blue-50">
                  <CardContent className="p-6">
                    <h4 className="text-lg font-semibold text-blue-900 mb-4">
                      सुझाव
                    </h4>
                    <ul className="space-y-2">
                      {result.recommendationsHindi.map((recommendation, index) => (
                        <li key={index} className="flex items-center text-blue-800">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                          {recommendation}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <div className="flex flex-col sm:flex-row gap-4">
                  {result.eligible && (
                    <>
                      <Link href={`/schemes/${selectedScheme}`} className="flex-1">
                        <Button className="w-full bg-green-600 hover:bg-green-700">
                          आवेदन प्रक्रिया देखें
                        </Button>
                      </Link>
                      {selectedSchemeData.website && (
                        <a 
                          href={selectedSchemeData.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1"
                        >
                          <Button variant="outline" className="w-full">
                            आधिकारिक वेबसाइट
                            <ExternalLink className="ml-2 h-4 w-4" />
                          </Button>
                        </a>
                      )}
                    </>
                  )}
                  <Button 
                    variant="outline" 
                    onClick={resetForm}
                    className="flex-1"
                  >
                    अन्य योजना जांचें
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Help Section */}
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              सहायता और जानकारी
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600">
              <div>
                <h4 className="font-medium text-slate-900 mb-2">महत्वपूर्ण सूचना:</h4>
                <ul className="space-y-1">
                  <li>• यह केवल प्रारंभिक पात्रता जांच है</li>
                  <li>• अंतिम निर्णय संबंधित विभाग का होगा</li>
                  <li>• सभी दस्तावेज सत्यापन आवश्यक है</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-slate-900 mb-2">सहायता हेतु संपर्क:</h4>
                <ul className="space-y-1">
                  <li>• किसान हेल्पलाइन: 1551</li>
                  <li>• PM-KISAN हेल्पलाइन: 155261</li>
                  <li>• स्थानीय कृषि विभाग</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
