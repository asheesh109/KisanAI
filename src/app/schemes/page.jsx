'use client'

import { useState, useEffect } from 'react'
import { 
  CreditCard, Shield, Coins, Leaf, ChevronRight, Phone, ExternalLink, 
  Search, Filter, Calculator, Bell, FileText, CheckCircle2, Clock,
  TrendingUp, Users, Target, Calendar, AlertCircle, Download, Loader2,
  Bot, MessageSquare, Send, RefreshCw, Globe
} from 'lucide-react'

// Multiple API endpoints as fallbacks
const API_ENDPOINTS = [
  
  'https://data.gov.in/api/datastore/resource.json?resource_id=579b464db66ec23bdd000001f35ef57f83f945b660e9b784d60a6ecb',
  'https://api.data.gov.in/resource/579b464db66ec23bdd000001f35ef57f83f945b660e9b784d60a6ecb'
]

// CORS proxy for development
const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/'

// Enhanced scheme categories
const schemeCategories = [
  {
    id: 'income-support',
    name: 'आय सहायता',
    icon: Coins,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    description: 'प्रत्यक्ष आर्थिक सहायता और नकद हस्तांतरण योजनाएं'
  },
  {
    id: 'insurance',
    name: 'फसल बीमा',
    icon: Shield,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    description: 'फसल सुरक्षा और जोखिम प्रबंधन योजनाएं'
  },
  {
    id: 'credit',
    name: 'ऋण योजनाएं',
    icon: CreditCard,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    description: 'कृषि ऋण, क्रेडिट कार्ड और वित्तीय सहायता'
  },
  {
    id: 'subsidy',
    name: 'सब्सिडी योजनाएं',
    icon: Leaf,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    description: 'उर्वरक, बीज, यंत्र और इनपुट सब्सिडी'
  },
  {
    id: 'irrigation',
    name: 'सिंचाई योजनाएं',
    icon: TrendingUp,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
    description: 'जल संरक्षण और सिंचाई परियोजनाएं'
  },
  {
    id: 'training',
    name: 'प्रशिक्षण योजनाएं',
    icon: Users,
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
    description: 'कृषि प्रशिक्षण और क्षमता निर्माण'
  }
]

const quickActions = [
  {
    id: 'eligibility-checker',
    name: 'पात्रता जांच',
    icon: Calculator,
    description: 'AI से अपनी पात्रता की जांच करें',
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  {
    id: 'application-helper',
    name: 'आवेदन सहायता',
    icon: Bot,
    description: 'AI से आवेदन में मदद पाएं',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    id: 'notifications',
    name: 'नई योजनाएं',
    icon: Bell,
    description: 'नवीनतम अपडेट प्राप्त करें',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  },
  {
    id: 'download-forms',
    name: 'फॉर्म डाउनलोड',
    icon: Download,
    description: 'आवेदन फॉर्म डाउनलोड करें',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50'
  }
]

// Enhanced fetch with multiple fallbacks
async function fetchWithRetry(url, options = {}, retries = 3, delay = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
      
      // Try direct fetch first
      let response
      try {
        response = await fetch(url, {
          ...options,
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            ...options.headers
          }
        })
      } catch (directError) {
        console.log('Direct fetch failed, trying with CORS proxy')
        // Try with CORS proxy if direct fetch fails
        response = await fetch(CORS_PROXY + url, {
          ...options,
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            ...options.headers
          }
        })
      }
      
      clearTimeout(timeoutId)
      
      if (!response.ok) {
        const errorText = await response.text()
        if ((response.status === 503 || response.status === 429) && i < retries - 1) {
          console.warn(`API temporarily unavailable (${response.status}), retrying in ${delay * (i + 1)}ms...`)
          await new Promise(resolve => setTimeout(resolve, delay * (i + 1)))
          continue
        }
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`)
      }
      return await response.json()
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error)
      if (i === retries - 1) throw error
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)))
    }
  }
}

// Fallback data
const getFallbackSchemes = () => {
  return [
    {
      id: 'pm-kisan',
      schemeNameEn: 'PM-KISAN Scheme',
      schemeNameHi: 'प्रधानमंत्री किसान सम्मान निधि योजना',
      schemeObjective: 'छोटे और सीमांत किसानों को प्रतिवर्ष ₹6000 की प्रत्यक्ष आर्थिक सहायता',
      schemeBenefits: [
        '₹6000 वार्षिक सहायता (₹2000 प्रति किस्त)',
        'प्रत्यक्ष बैंक खाता स्थानांतरण',
        'कोई मध्यस्थ नहीं, कोई कटौती नहीं'
      ],
      schemeEligibility: [
        '2 हेक्टेयर तक कृषि भूमि वाले किसान',
        'भारतीय नागरिकता आवश्यक',
        'सभी भूमि धारक परिवार के सदस्य पात्र'
      ],
      applicationProcess: [
        'PM-KISAN पोर्टल पर पंजीकरण',
        'आवश्यक दस्तावेज अपलोड करें',
        'बैंक विवरण सत्यापन'
      ],
      documentsRequired: [
        'आधार कार्ड',
        'भूमि स्वामित्व प्रमाण',
        'बैंक खाता विवरण'
      ],
      helplineNumber: '155261',
      schemeUrl: 'https://pmkisan.gov.in',
      category: 'income-support',
      sponsorMinistry: 'कृषि एवं किसान कल्याण मंत्रालय',
      schemeIntroducedYear: '2019',
      schemeStatus: 'सक्रिय',
      lastModifiedDate: '2024-04-01'
    },
    {
      id: 'pmfby',
      schemeNameEn: 'PM Fasal Bima Yojana',
      schemeNameHi: 'प्रधानमंत्री फसल बीमा योजना',
      schemeObjective: 'प्राकृतिक आपदाओं के कारण फसल क्षति से किसानों की सुरक्षा',
      schemeBenefits: [
        'अधिकतम 2% प्रीमियम दर (खरीफ फसलों के लिए)',
        'रबी फसलों के लिए 1.5% प्रीमियम दर',
        'वाणिज्यिक/बागवानी फसलों के लिए 5%'
      ],
      schemeEligibility: [
        'सभी किसान पात्र (ऋणी और गैर-ऋणी दोनों)',
        'अधिसूचित फसलों के लिए',
        'राज्य सरकार द्वारा अधिसूचित क्षेत्र'
      ],
      applicationProcess: [
        'बैंक या CSC पर आवेदन',
        'प्रीमियम भुगतान',
        'बीमा पॉलिसी प्राप्त करें'
      ],
      documentsRequired: [
        'आधार कार्ड',
        'भूमि दस्तावेज',
        'बैंक खाता विवरण'
      ],
      helplineNumber: '14447',
      schemeUrl: 'https://pmfby.gov.in',
      category: 'insurance',
      sponsorMinistry: 'कृषि एवं किसान कल्याण मंत्रालय',
      schemeIntroducedYear: '2016',
      schemeStatus: 'सक्रिय',
      lastModifiedDate: '2024-03-15'
    },
    {
      id: 'kcc',
      schemeNameEn: 'Kisan Credit Card Scheme',
      schemeNameHi: 'किसान क्रेडिट कार्ड योजना',
      schemeObjective: 'कृषि और संबंधित गतिविधियों के लिए समयबद्ध ऋण सुविधा',
      schemeBenefits: [
        '₹1.6 लाख तक का ऋण (सामान्य किसानों के लिए)',
        '4% प्रति वर्ष ब्याज दर (सब्सिडी के बाद)',
        'फसल ऋण पर 1 वर्ष की मोहलत'
      ],
      schemeEligibility: [
        'व्यक्तिगत किसान और संयुक्त उधारकर्ता',
        'किरायेदार किसान, साझेदारी फर्में',
        'स्व-सहायता समूह (SHGs)'
      ],
      applicationProcess: [
        'बैंक शाखा में आवेदन',
        'दस्तावेज सत्यापन',
        'KCC जारी करना'
      ],
      documentsRequired: [
        'पहचान प्रमाण (आधार, पैन)',
        'भूमि स्वामित्व प्रमाण',
        'पासपोर्ट आकार फोटो'
      ],
      helplineNumber: '1800-180-1551',
      schemeUrl: 'https://pmkisan.gov.in/kcc',
      category: 'credit',
      sponsorMinistry: 'कृषि एवं किसान कल्याण मंत्रालय',
      schemeIntroducedYear: '1998',
      schemeStatus: 'सक्रिय',
      lastModifiedDate: '2024-02-20'
    }
  ]
}

// Function to categorize scheme
function categorizeScheme(scheme) {
  const title = (scheme.schemeNameEn || '').toLowerCase() + ' ' + (scheme.schemeObjective || '').toLowerCase()
  const benefits = (scheme.schemeBenefits || []).join(' ').toLowerCase()
  const fullText = title + ' ' + benefits
  
  if (fullText.includes('insurance') || fullText.includes('bima') || fullText.includes('फसल बीमा')) {
    return 'insurance'
  }
  if (fullText.includes('credit') || fullText.includes('loan') || fullText.includes('kisan credit card') || fullText.includes('ऋण')) {
    return 'credit'
  }
  if (fullText.includes('income support') || fullText.includes('samman nidhi') || fullText.includes('आय सहायता')) {
    return 'income-support'
  }
  if (fullText.includes('irrigation') || fullText.includes('सिंचाई') || fullText.includes('जल')) {
    return 'irrigation'
  }
  if (fullText.includes('training') || fullText.includes('प्रशिक्षण') || fullText.includes('कौशल')) {
    return 'training'
  }
  return 'subsidy'
}

export default function SchemesApp() {
  const [schemes, setSchemes] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [filteredSchemes, setFilteredSchemes] = useState([])
  const [showChatbot, setShowChatbot] = useState(false)
  const [chatMessages, setChatMessages] = useState([])
  const [currentMessage, setCurrentMessage] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const [error, setError] = useState(null)
  const [dataSource, setDataSource] = useState('loading')

  // Function to fetch schemes with multiple fallbacks
  const fetchSchemes = async () => {
    setLoading(true)
    setError(null)
    setDataSource('loading')
    
    try {
      // Try each API endpoint
      for (const endpoint of API_ENDPOINTS) {
        try {
          console.log(`Trying endpoint: ${endpoint}`)
          
          const params = {
            lang: 'en',
            q: JSON.stringify([{
              "identifier": "schemeCategory", 
              "value": "Agriculture,Rural & Environment"
            }]),
            keyword: '',
            sort: '',
            from: 0,
            size: 100
          }
          
          const queryString = new URLSearchParams(params).toString()
          const apiUrl = `${endpoint}?${queryString}`
          
          const data = await fetchWithRetry(apiUrl, {
            method: 'GET'
          })
          
          if (data && Array.isArray(data.content)) {
            const processedSchemes = data.content
              .filter(scheme => scheme && (scheme.schemeNameEn || scheme.schemeNameHi))
              .map(scheme => ({
                id: scheme.schemeId || Math.random().toString(36).substring(2, 9),
                schemeNameEn: scheme.schemeNameEn || 'Name not available',
                schemeNameHi: scheme.schemeNameHi || scheme.schemeNameEn || 'नाम उपलब्ध नहीं',
                schemeObjective: scheme.schemeObjective || scheme.schemeDescription || 'विवरण उपलब्ध नहीं',
                schemeBenefits: Array.isArray(scheme.schemeBenefits) 
                  ? scheme.schemeBenefits 
                  : (scheme.schemeBenefits ? [scheme.schemeBenefits] : ['लाभ की जानकारी उपलब्ध नहीं']),
                schemeEligibility: Array.isArray(scheme.schemeEligibility) 
                  ? scheme.schemeEligibility 
                  : (scheme.schemeEligibility ? [scheme.schemeEligibility] : ['पात्रता की जानकारी उपलब्ध नहीं']),
                applicationProcess: Array.isArray(scheme.applicationProcess) 
                  ? scheme.applicationProcess 
                  : (scheme.schemeApplicationProcess ? [scheme.schemeApplicationProcess] : ['आवेदन प्रक्रिया उपलब्ध नहीं']),
                documentsRequired: Array.isArray(scheme.documentsRequired) 
                  ? scheme.documentsRequired 
                  : (scheme.schemeDocumentsRequired ? [scheme.schemeDocumentsRequired] : ['दस्तावेज की जानकारी उपलब्ध नहीं']),
                helplineNumber: scheme.helplineNumber || scheme.contactNumber || '1800-180-1551',
                schemeUrl: scheme.schemeUrl || scheme.officialWebsite || 'https://www.india.gov.in',
                category: categorizeScheme(scheme),
                sponsorMinistry: scheme.sponsorMinistry || scheme.ministry || 'सरकारी योजना',
                schemeIntroducedYear: scheme.schemeIntroducedYear || scheme.launchYear || 'N/A',
                schemeStatus: (scheme.schemeStatus === 'inactive' || scheme.schemeStatus === 'Inactive') ? 'निष्क्रिय' : 'सक्रिय',
                lastModifiedDate: scheme.lastModifiedDate || scheme.lastUpdated || new Date().toISOString().split('T')[0],
                state: scheme.state || 'पैन इंडिया',
                targetBeneficiary: scheme.targetBeneficiary || 'किसान'
              }))
            
            if (processedSchemes.length > 0) {
              setSchemes(processedSchemes)
              setFilteredSchemes(processedSchemes)
              setDataSource(`api-${endpoint}`)
              setLoading(false)
              return
            }
          }
        } catch (apiError) {
          console.warn(`Failed to fetch from ${endpoint}:`, apiError.message)
          continue
        }
      }
      
      // If all API endpoints fail, use fallback
      throw new Error('All API endpoints failed')
      
    } catch (error) {
      console.error('Error fetching schemes:', error)
      setError(`API से डेटा प्राप्त करने में त्रुटि: ${error.message}. स्थानीय डेटा दिखाया जा रहा है।`)
      setDataSource('fallback')
      
      const fallbackSchemes = getFallbackSchemes()
      setSchemes(fallbackSchemes)
      setFilteredSchemes(fallbackSchemes)
    } finally {
      setLoading(false)
    }
  }

  // Chat functionality
  const handleChatMessage = (message) => {
    setChatLoading(true)
    
    setTimeout(() => {
      let response = ''
      const messageLower = message.toLowerCase()
      
      if (messageLower.includes('पात्रता') || messageLower.includes('eligibility')) {
        response = 'पात्रता जांचने के लिए कृपया बताएं:\n1. आपके पास कितनी एकड़ जमीन है?\n2. आप किस राज्य के निवासी हैं?\n3. आपकी मुख्य फसल क्या है?\n\nइस जानकारी के आधार पर मैं आपको उपयुक्त योजनाओं के बारे में बता सकूंगा।'
      } else if (messageLower.includes('आवेदन') || messageLower.includes('application')) {
        response = 'आवेदन के लिए सामान्य प्रक्रिया:\n1. संबंधित योजना की आधिकारिक वेबसाइट पर जाएं\n2. आवश्यक दस्तावेज तैयार करें (आधार कार्ड, जमीन के कागजात, बैंक पासबुक)\n3. ऑनलाइन या ऑफलाइन आवेदन करें\n4. आवेदन की स्थिति की जांच करते रहें\n\nकिस योजना के लिए आवेदन करना चाहते हैं?'
      } else if (messageLower.includes('pm-kisan') || messageLower.includes('किसान सम्मान निधि')) {
        response = 'PM-KISAN योजना की जानकारी:\n• ₹6000 वार्षिक सहायता\n• तीन किस्तों में भुगतान\n• 2 हेक्टेयर तक जमीन वाले किसान पात्र\n• आधिकारिक वेबसाइट: https://pmkisan.gov.in\n• हेल्पलाइन: 155261\n\nक्या आप इसके लिए आवेदन करना चाहते हैं?'
      } else if (messageLower.includes('फसल बीमा') || messageLower.includes('crop insurance')) {
        response = 'फसल बीमा योजना (PMFBY) की जानकारी:\n• प्राकृतिक आपदा से सुरक्षा\n• खरीफ के लिए 2% प्रीमियम\n• रबी के लिए 1.5% प्रीमियम\n• आधिकारिक वेबसाइट: https://pmfby.gov.in\n• हेल्पलाइन: 14447\n\nनजदीकी बैंक से संपर्क करें।'
      } else {
        response = 'मैं आपकी मदद के लिए यहाँ हूँ! आप निम्न विषयों पर प्रश्न पूछ सकते हैं:\n• योजनाओं की पात्रता\n• आवेदन प्रक्रिया\n• आवश्यक दस्तावेज\n• हेल्पलाइन नंबर\n• योजना के लाभ\n\nकृपया अपना प्रश्न स्पष्ट रूप से पूछें।'
      }
      
      setChatMessages(prev => [...prev, 
        { type: 'user', message: message },
        { type: 'ai', message: response }
      ])
      setChatLoading(false)
    }, 1000)
  }

  const handleSendMessage = () => {
    if (currentMessage.trim()) {
      handleChatMessage(currentMessage)
      setCurrentMessage('')
    }
  }

  useEffect(() => {
    fetchSchemes()
  }, [])

  useEffect(() => {
    let filtered = [...schemes]

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(scheme => scheme.category === selectedCategory)
    }

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(scheme => {
        return (
          (scheme.schemeNameHi?.toLowerCase() || '').includes(searchLower) ||
          (scheme.schemeNameEn?.toLowerCase() || '').includes(searchLower) ||
          (scheme.schemeObjective?.toLowerCase() || '').includes(searchLower) ||
          (scheme.schemeBenefits?.join(' ')?.toLowerCase() || '').includes(searchLower) ||
          (scheme.schemeEligibility?.join(' ')?.toLowerCase() || '').includes(searchLower)
        )
      })
    }

    setFilteredSchemes(filtered)
  }, [searchTerm, selectedCategory, schemes])

  const resetFilters = () => {
    setSearchTerm('')
    setSelectedCategory('all')
  }

  const schemesStats = [
    { label: 'कुल योजनाएं', value: schemes.length, icon: Target, color: 'text-blue-600' },
    { label: 'सक्रिय योजनाएं', value: schemes.filter(s => s.schemeStatus === 'सक्रिय').length, icon: CheckCircle2, color: 'text-green-600' },
    { label: 'डेटा स्रोत', value: dataSource.startsWith('api') ? 'सरकारी API' : 'स्थानीय डेटा', icon: Globe, color: 'text-purple-600' },
    { label: 'अंतिम अपडेट', value: new Date().toLocaleDateString('hi-IN'), icon: Calendar, color: 'text-orange-600' },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">सरकारी योजनाओं की जानकारी लाई जा रही है...</h2>
          <p className="text-gray-600">कृपया प्रतीक्षा करें, हम सरकारी API से नवीनतम योजनाओं का डेटा प्राप्त कर रहे हैं</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Globe className="h-8 w-8 text-green-600 mr-2" />
            <h1 className="text-4xl font-bold text-slate-900">सरकारी योजनाएं पोर्टल</h1>
          </div>
          <p className="text-xl text-slate-600 font-medium">
            MyScheme.gov.in API से प्राप्त आधिकारिक कृषि योजनाओं की जानकारी
          </p>
          <p className="text-sm text-slate-500 mt-2">
            डेटा स्रोत: {dataSource.startsWith('api') ? 'सरकारी API' : dataSource === 'fallback' ? 'स्थानीय डेटा' : 'लोड हो रहा है...'}
            {dataSource !== 'loading' && ` | कुल योजनाएं: ${schemes.length} | प्रदर्शित योजनाएं: ${filteredSchemes.length}`}
          </p>
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <div>
                  <p className="text-red-700 font-medium">त्रुटि: डेटा प्राप्त करने में समस्या</p>
                  <p className="text-red-600 text-sm mt-1">{error.message}</p>
                </div>
                <button
                  onClick={fetchSchemes}
                  className="ml-4 flex items-center text-red-600 hover:text-red-700"
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  पुनः प्रयास
                </button>
              </div>
            </div>
          )}
          {filteredSchemes.length === 0 && schemes.length > 0 && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
                <p className="text-yellow-700">कोई योजना प्रदर्शित नहीं हो रही है। खोज या श्रेणी फ़िल्टर के कारण हो सकता है।</p>
                <button
                  onClick={resetFilters}
                  className="ml-4 flex items-center text-yellow-600 hover:text-yellow-700"
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  फ़िल्टर रीसेट करें
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {schemesStats.map((stat) => {
            const IconComponent = stat.icon
            return (
              <div key={stat.label} className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 font-medium">{stat.label}</p>
                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                  </div>
                  <IconComponent className={`h-8 w-8 ${stat.color}`} />
                </div>
              </div>
            )
          })}
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8 bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="योजना खोजें (नाम, विवरण, लाभ, पात्रता)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-slate-900 placeholder-gray-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-600" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-slate-900"
              >
                <option value="all">सभी श्रेणियां</option>
                {schemeCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg flex items-center text-gray-700"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              फ़िल्टर रीसेट करें
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">सहायक सेवाएं</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action) => {
              const IconComponent = action.icon
              
              return (
                <div 
                  key={action.id} 
                  className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer bg-white/80 backdrop-blur-sm rounded-lg p-6"
                  onClick={() => {
                    if (action.id === 'application-helper' || action.id === 'eligibility-checker') {
                      setShowChatbot(true)
                      if (action.id === 'eligibility-checker') {
                        setChatMessages([{
                          type: 'ai',
                          message: 'नमस्ते! मैं आपकी योजनाओं की पात्रता जांचने में मदद कर सकता हूँ। कृपया निम्नलिखित जानकारी प्रदान करें:\n1. आप किस राज्य के निवासी हैं?\n2. आपके पास कितनी कृषि भूमि है?\n3. आपकी मुख्य फसल क्या है?\n4. आप किस प्रकार की योजना में रुचि रखते हैं?'
                        }])
                      } else {
                        setChatMessages([{
                          type: 'ai',
                          message: 'नमस्ते! मैं आपको सरकारी योजनाओं के लिए आवेदन करने में मदद कर सकता हूँ। कृपया बताएं:\n1. आप किस योजना के लिए आवेदन करना चाहते हैं?\n2. क्या आपने पहले से कोई दस्तावेज तैयार किए हैं?\n3. क्या आपको किसी विशेष चरण में सहायता चाहिए?'
                        }])
                      }
                    }
                  }}
                >
                  <div className="text-center">
                    <div className={`w-16 h-16 ${action.bgColor} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                      <IconComponent className={`h-8 w-8 ${action.color}`} />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">{action.name}</h3>
                    <p className="text-sm text-slate-600 font-medium">{action.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Schemes List */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            उपलब्ध योजनाएं ({filteredSchemes.length})
          </h2>
          {filteredSchemes.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-8 text-center shadow-sm">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">कोई योजना नहीं मिली</h3>
              <p className="text-slate-600">कृपया अपनी खोज को संशोधित करें या अन्य श्रेणी का चयन करें।</p>
              {schemes.length > 0 && (
                <button
                  onClick={resetFilters}
                  className="mt-4 inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  सभी योजनाएं देखें
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredSchemes.map((scheme) => (
                <div key={scheme.id} className="hover:shadow-lg transition-shadow bg-white/80 backdrop-blur-sm rounded-lg shadow-sm">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">{scheme.schemeNameHi}</h3>
                        <p className="text-sm text-gray-600 mb-1">{scheme.schemeNameEn}</p>
                        <p className="text-base text-slate-600">{scheme.schemeObjective}</p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          scheme.category === 'income-support' ? 'bg-green-100 text-green-800' :
                          scheme.category === 'insurance' ? 'bg-blue-100 text-blue-800' :
                          scheme.category === 'credit' ? 'bg-purple-100 text-purple-800' :
                          scheme.category === 'irrigation' ? 'bg-cyan-100 text-cyan-800' :
                          scheme.category === 'training' ? 'bg-pink-100 text-pink-800' :
                          'bg-orange-100 text-orange-800'
                        }`}>
                          {schemeCategories.find(c => c.id === scheme.category)?.name || 'अन्य'}
                        </span>
                        {scheme.schemeStatus === 'सक्रिय' ? (
                          <div className="flex items-center text-xs text-green-600">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            सक्रिय
                          </div>
                        ) : (
                          <div className="flex items-center text-xs text-red-600">
                            <Clock className="h-3 w-3 mr-1" />
                            निष्क्रिय
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-slate-900 mb-2 flex items-center">
                          <Target className="h-4 w-4 mr-2 text-green-600" />
                          मुख्य लाभ:
                        </h4>
                        <ul className="text-sm text-slate-600 space-y-1">
                          {scheme.schemeBenefits?.slice(0, 3).map((benefit, index) => (
                            <li key={index} className="flex items-center">
                              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="text-xs text-gray-500 space-y-1">
                        {scheme.sponsorMinistry && (
                          <p><strong>मंत्रालय:</strong> {scheme.sponsorMinistry}</p>
                        )}
                        {scheme.schemeIntroducedYear && (
                          <p><strong>शुरुआत:</strong> {scheme.schemeIntroducedYear}</p>
                        )}
                        {scheme.state && scheme.state !== 'पैन इंडिया' && (
                          <p><strong>राज्य:</strong> {scheme.state}</p>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button 
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center"
                          onClick={() => {
                            setShowChatbot(true)
                            setChatMessages([{
                              type: 'ai',
                              message: `${scheme.schemeNameHi} के बारे में जानकारी:\n\nमुख्य लाभ:\n${scheme.schemeBenefits?.join('\n')}\n\nपात्रता:\n${scheme.schemeEligibility?.join('\n')}\n\nक्या आप इस योजना के लिए आवेदन करने में मदद चाहते हैं?`
                            }])
                          }}
                        >
                          चैटबॉट से जानकारी
                          <Bot className="ml-2 h-4 w-4" />
                        </button>
                        {scheme.helplineNumber && (
                          <a 
                            href={`tel:${scheme.helplineNumber}`}
                            className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg transition-colors flex items-center justify-center"
                          >
                            <Phone className="mr-2 h-4 w-4" />
                            {scheme.helplineNumber}
                          </a>
                        )}
                        {scheme.schemeUrl && (
                          <a
                            href={scheme.schemeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="col-span-2 border border-blue-300 hover:bg-blue-50 text-blue-700 px-4 py-2 rounded-lg transition-colors flex items-center justify-center"
                          >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            आधिकारिक वेबसाइट देखें
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Chatbot Modal */}
        {showChatbot && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] flex flex-col">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center">
                  <Bot className="h-6 w-6 text-green-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">योजना सहायक चैटबॉट</h3>
                </div>
                <button
                  onClick={() => setShowChatbot(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatMessages.length === 0 && (
                  <div className="text-center py-8">
                    <Bot className="h-10 w-10 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900">नमस्ते! मैं आपकी कैसे मदद कर सकता हूँ?</h4>
                    <p className="text-gray-600 mt-2">आप मुझसे सरकारी योजनाओं के बारे में कोई भी प्रश्न पूछ सकते हैं</p>
                  </div>
                )}
                
                {chatMessages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-lg ${
                      msg.type === 'user' 
                        ? 'bg-green-600 text-white' 
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-4 border-t border-gray-200">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    placeholder="अपना प्रश्न यहाँ लिखें..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    disabled={chatLoading}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={chatLoading || !currentMessage.trim()}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  सामान्य जानकारी के लिए - विस्तृत जानकारी के लिए आधिकारिक वेबसाइट देखें
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-700">
            यह जानकारी {dataSource.startsWith('api') ? 'सरकारी API' : 'स्थानीय डेटा'} से प्राप्त की गई है। योजना की पात्रता और आवेदन प्रक्रिया के लिए संबंधित विभाग से संपर्क करें।
          </p>
          <p className="text-sm text-gray-500 mt-2">
            अंतिम अपडेट: {new Date().toLocaleDateString('hi-IN')} | डेटा स्रोत: {dataSource.startsWith('api') ? 'सरकारी API' : 'Fallback'} | संस्करण: 2.0.0
          </p>
        </div>
      </div>
    </div>
  )
}