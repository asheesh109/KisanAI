// app/schemes/page.js

'use client'

import { useState, useEffect } from 'react'
import { 
  CreditCard, Shield, Coins, Leaf, ChevronRight, Phone, ExternalLink, 
  Search, Filter, Calculator, Bell, FileText, CheckCircle2, Clock,
  TrendingUp, Users, Target, Calendar, AlertCircle, Download, Loader2,
  Bot, MessageSquare, Send, RefreshCw, Globe, DollarSign, LandPlot, Home,
  MapPin, Database, UserCheck
} from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

// API Configuration for all APIs
const API_KEY = '579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b'
const BASE_URL = 'https://api.data.gov.in/resource'

// Correct Resource IDs from documentation
const API1_RESOURCE_ID = '9afdf346-16d7-4f17-a2e3-684540c59a77' // Ministry Schemes
const API2_RESOURCE_ID = '85463811-491a-427a-9594-27c6c27ac15f' // State/UT-wise Integrated Scheme on Agriculture Census 2020-21
const API3_RESOURCE_ID = 'dba5315a-3dee-450c-89e3-1be27e8af4c5' // State-wise/Year-wise Schemes 2011-12 to 2014-15

// Enhanced fetch function with CORS handling and better error reporting
async function fetchWithRetry(url, apiName, options = {}, retries = 3, delay = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000)
      
      console.log(`Fetching from ${apiName}: ${url}`)
      
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ...options.headers
        }
      })
      
      clearTimeout(timeoutId)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log(`${apiName} response received:`, data)
      return data
    } catch (error) {
      console.error(`${apiName} Attempt ${i + 1} failed:`, error)
      if (i === retries - 1) throw error
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)))
    }
  }
}

// Function to categorize scheme based on name
function categorizeScheme(schemeName) {
  const name = schemeName.toLowerCase()
  
  if (name.includes('insurance') || name.includes('bima') || name.includes('बीमा') || name.includes('प्रधानमंत्री फसल बीमा')) {
    return 'insurance'
  }
  if (name.includes('credit') || name.includes('loan') || name.includes('kisan credit card') || name.includes('ऋण') || name.includes('क्रेडिट')) {
    return 'credit'
  }
  if (name.includes('income') || name.includes('samman nidhi') || name.includes('आय') || name.includes('पीएम किसान') || name.includes('निधि')) {
    return 'income-support'
  }
  if (name.includes('irrigation') || name.includes('सिंचाई') || name.includes('जल') || name.includes('पानी') || name.includes('नहर')) {
    return 'irrigation'
  }
  if (name.includes('training') || name.includes('प्रशिक्षण') || name.includes('कौशल') || name.includes('शिक्षा') || name.includes('ज्ञान')) {
    return 'training'
  }
  if (name.includes('subsidy') || name.includes('सब्सिडी') || name.includes('अनुदान') || name.includes('छूट')) {
    return 'subsidy'
  }
  return 'subsidy'
}

// Check eligibility based on user profile and scheme requirements
function checkEligibility(scheme, userProfile) {
  if (!userProfile.checkedEligibility) return true
  
  // Check income eligibility
  if (scheme.incomeEligibility !== 'all') {
    const userIncomeLevel = getIncomeLevel(userProfile.income)
    if (userIncomeLevel !== scheme.incomeEligibility) {
      return false
    }
  }
  
  // Check land eligibility
  if (scheme.landSizeEligibility !== 'all') {
    const userLandLevel = getLandLevel(userProfile.landOwnership)
    if (userLandLevel !== scheme.landSizeEligibility) {
      return false
    }
  }
  
  return true
}

// Get income level based on income
function getIncomeLevel(income) {
  if (income <= 100000) return 'low'
  if (income <= 500000) return 'medium'
  return 'high'
}

// Get land level based on land ownership
function getLandLevel(land) {
  if (land <= 2) return 'small'
  if (land <= 5) return 'medium'
  return 'large'
}

// Main component
export default function SchemesApp() {
  const [schemes, setSchemes] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedState, setSelectedState] = useState('all')
  const [filteredSchemes, setFilteredSchemes] = useState([])
  const [showChatbot, setShowChatbot] = useState(false)
  const [chatMessages, setChatMessages] = useState([])
  const [currentMessage, setCurrentMessage] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const [error, setError] = useState(null)
  const [dataSource, setDataSource] = useState('loading')
  const [selectedScheme, setSelectedScheme] = useState(null)
  const [showApplicationForm, setShowApplicationForm] = useState(false)
  const [applicationData, setApplicationData] = useState({})
  const [apiStats, setApiStats] = useState({ api1: 0, api2: 0, api3: 0, fallback: 0 })
  const [showEligibilityModal, setShowEligibilityModal] = useState(false)
  const [userProfile, setUserProfile] = useState({
    checkedEligibility: false,
    income: 0,
    landOwnership: 0,
    state: ''
  })
  const { language, t } = useLanguage()

  const getText = (en, hi, mr, gu, ml) => {
    switch (language) {
      case 'hi': return hi;
      case 'mr': return mr;
      case 'gu': return gu;
      case 'ml': return ml;
      default: return en;
    }
  };

  const getTranslatedArray = (enArray, hiArray, mrArray, guArray, mlArray) => getText(enArray, hiArray, mrArray, guArray, mlArray);

  // State options for filtering
  const englishStates = [
    'all', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
    'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha',
    'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
    'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Pan India'
  ];

  const enStateLabels = englishStates.map(s => s === 'all' ? 'All States' : s);

  const hiStateLabels = [
    'सभी राज्य', 'आंध्र प्रदेश', 'अरुणाचल प्रदेश', 'असम', 'बिहार', 'छत्तीसगढ़',
    'गोवा', 'गुजरात', 'हरियाणा', 'हिमाचल प्रदेश', 'झारखंड', 'कर्नाटक', 'केरल',
    'मध्य प्रदेश', 'महाराष्ट्र', 'मणिपुर', 'मेघालय', 'मिजोरम', 'नागालैंड', 'ओडिशा',
    'पंजाब', 'राजस्थान', 'सिक्किम', 'तमिलनाडु', 'तेलंगाना', 'त्रिपुरा', 'उत्तर प्रदेश',
    'उत्तराखंड', 'पश्चिम बंगाल', 'दिल्ली', 'जम्मू और कश्मीर', 'लद्दाख', 'पैन इंडिया'
  ];

  const mrStateLabels = [
    'सर्व राज्य', 'आंध्र प्रदेश', 'अरुणाचल प्रदेश', 'असम', 'बिहार', 'छत्तीसगढ',
    'गोवा', 'गुजरात', 'हरियाणा', 'हिमाचल प्रदेश', 'झारखंड', 'कर्नाटक', 'केरळ',
    'मध्य प्रदेश', 'महाराष्ट्र', 'मणिपूर', 'मेघालय', 'मिझोरम', 'नागालँड', 'ओडिशा',
    'पंजाब', 'राजस्थान', 'सिक्किम', 'तमिळनाडू', 'तेलंगणा', 'त्रिपुरा', 'उत्तर प्रदेश',
    'उत्तराखंड', 'पश्चिम बंगाल', 'दिल्ली', 'जम्मू आणि काश्मीर', 'लडाख', 'पॅन इंडिया'
  ];

  const guStateLabels = [
    'બધા રાજ્યો', 'આંધ્ર પ્રદેશ', 'અરુણાચલ પ્રદેશ', 'આસામ', 'બિહાર', 'છત્તીસગઢ',
    'ગોવા', 'ગુજરાત', 'હરિયાણા', 'હિમાચલ પ્રદેશ', 'ઝારખંડ', 'કર્ણાટક', 'કેરળ',
    'મધ્ય પ્રદેશ', 'મહારાષ્ટ્ર', 'મણિપુર', 'મેઘાલય', 'મિઝોરમ', 'નાગાલેન્ડ', 'ઓડિશા',
    'પંજાબ', 'રાજસ્થાન', 'સિક્કિમ', 'તમિલનાડુ', 'તેલંગાણા', 'ત્રિપુરા', 'ઉત્તર પ્રદેશ',
    'ઉત્તરાખંડ', 'પશ્ચિમ બંગાળ', 'દિલ્હી', 'જમ્મુ અને કાશ્મીર', 'લદ્દાખ', 'પાન ઇન્ડિયા'
  ];

  const mlStateLabels = [
    'എല്ലാ സംസ്ഥാനങ്ങളും', 'ആന്ധ്രാപ്രദേശ്', 'അരുണാചല്‍ പ്രദേശ്', 'അസ്സാം', 'ബിഹാര്‍', 'ഛത്തീസ്ഗഢ്',
    'ഗോവ', 'ഗുജറാത്ത്', 'ഹരിയാന', 'ഹിമാചല്‍ പ്രദേശ്', 'ഝാര്‍ഖണ്ഡ്', 'കര്ണാടക', 'കേരളം',
    'മധ്യപ്രദേശ്', 'മഹാരാഷ്ട്ര', 'മണിപ്പൂര്‍', 'മേഘാലയ', 'മിസോറാം', 'നാഗാലാന്‍ഡ്', 'ഒഡിഷ',
    'പഞ്ചാബ്', 'രാജസ്ഥാന്‍', 'സിക്കിം', 'തമിഴ്നാട്', 'തെലങ്കാന', 'ത്രിപുര', 'ഉത്തരപ്രദേശ്',
    'ഉത്തരാഖണ്ഡ്', 'പടിഞ്ഞാറ് ബംഗാള്‍', 'ദില്ലി', 'ജമ്മു & കാശ്മീര്‍', 'ലഡാക്ക്', 'പാന്‍ ഇന്ത്യ'
  ];

  const stateLabels = getTranslatedArray(enStateLabels, hiStateLabels, mrStateLabels, guStateLabels, mlStateLabels);

  const stateOptions = englishStates.map((value, index) => ({ value, label: stateLabels[index] }));

  const getStateLabel = (state) => {
    const index = englishStates.indexOf(state);
    if (index === -1) return state;
    return stateLabels[index];
  };

  // Scheme categories
  const schemeCategoriesEn = [
    {
      id: 'income-support',
      name: 'Income Support',
      icon: Coins,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'Direct financial assistance and cash transfer schemes'
    },
    {
      id: 'insurance',
      name: 'Crop Insurance',
      icon: Shield,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Crop protection and risk management schemes'
    },
    {
      id: 'credit',
      name: 'Loan Schemes',
      icon: CreditCard,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'Agricultural loans, credit cards and financial assistance'
    },
    {
      id: 'subsidy',
      name: 'Subsidy Schemes',
      icon: Leaf,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: 'Fertilizer, seed, machinery and input subsidies'
    },
    {
      id: 'irrigation',
      name: 'Irrigation Schemes',
      icon: TrendingUp,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      description: 'Water conservation and irrigation projects'
    },
    {
      id: 'training',
      name: 'Training Schemes',
      icon: Users,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      description: 'Agricultural training and capacity building'
    }
  ];

  const schemeCategoriesHi = [
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
  ];

  const schemeCategoriesMr = [
    {
      id: 'income-support',
      name: 'उत्पन्न सहाय्य',
      icon: Coins,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'थेट आर्थिक सहाय्य आणि रोख हस्तांतरण योजना'
    },
    {
      id: 'insurance',
      name: 'पिक विमा',
      icon: Shield,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'पिक संरक्षण आणि जोखीम व्यवस्थापन योजना'
    },
    {
      id: 'credit',
      name: 'कर्ज योजना',
      icon: CreditCard,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'कृषी कर्ज, क्रेडिट कार्ड आणि आर्थिक सहाय्य'
    },
    {
      id: 'subsidy',
      name: 'सबसिडी योजना',
      icon: Leaf,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: 'खते, बियाणे, यंत्र आणि इनपुट सबसिडी'
    },
    {
      id: 'irrigation',
      name: 'सिंचन योजना',
      icon: TrendingUp,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      description: 'पाणी संरक्षण आणि सिंचन प्रकल्प'
    },
    {
      id: 'training',
      name: 'प्रशिक्षण योजना',
      icon: Users,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      description: 'कृषी प्रशिक्षण आणि क्षमता बांधणी'
    }
  ];

  const schemeCategoriesGu = [
    {
      id: 'income-support',
      name: 'આવક સહાય',
      icon: Coins,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'સીધી આર્થિક સહાય અને રોકડ ટ્રાન્સફર યોજનાઓ'
    },
    {
      id: 'insurance',
      name: 'પાક વીમો',
      icon: Shield,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'પાક સુરક્ષા અને જોખમ વ્યવસ્થાપન યોજનાઓ'
    },
    {
      id: 'credit',
      name: 'ઋણ યોજનાઓ',
      icon: CreditCard,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'કૃષિ ઋણ, ક્રેડિટ કાર્ડ અને નાણાકીય સહાય'
    },
    {
      id: 'subsidy',
      name: 'સબસિડી યોજનાઓ',
      icon: Leaf,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: 'ખાતર, બીજ, યંત્ર અને ઇનપુટ સબસિડી'
    },
    {
      id: 'irrigation',
      name: 'સિંચાઈ યોજનાઓ',
      icon: TrendingUp,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      description: 'જળ સંરક્ષણ અને સિંચાઈ પ્રોજેક્ટ્સ'
    },
    {
      id: 'training',
      name: 'તાલીમ યોજનાઓ',
      icon: Users,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      description: 'કૃષિ તાલીમ અને ક્ષમતા નિર્માણ'
    }
  ];

  const schemeCategoriesMl = [
    {
      id: 'income-support',
      name: 'വരുമാന സഹായം',
      icon: Coins,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'നേരിട്ടുള്ള സാമ്പത്തിക സഹായവും നഗദ ട്രാൻസ്ഫർ സ്കീമുകളും'
    },
    {
      id: 'insurance',
      name: 'പയർദിന വിമ',
      icon: Shield,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'പയർദിന സംരക്ഷണവും അപകടസാധ്യത മാനേജ്മെന്റ് സ്കീമുകളും'
    },
    {
      id: 'credit',
      name: 'ലോൺ സ്കീമുകൾ',
      icon: CreditCard,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'കൃഷി ലോൺ, ക്രെഡിറ്റ് കാർഡുകൾ, സാമ്പത്തിക സഹായം'
    },
    {
      id: 'subsidy',
      name: 'സബ്സിഡി സ്കീമുകൾ',
      icon: Leaf,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: 'ഉരവറ്റകൾ, വിത്ത്, യന്ത്രങ്ങൾ, ഇൻപുട്ട് സബ്സിഡികൾ'
    },
    {
      id: 'irrigation',
      name: 'ഇറിഗേഷൻ സ്കീമുകൾ',
      icon: TrendingUp,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      description: 'ജല സംരക്ഷണവും ഇറിഗേഷൻ പ്രോജക്ടുകളും'
    },
    {
      id: 'training',
      name: 'പരിശീലന സ്കീമുകൾ',
      icon: Users,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      description: 'കൃഷി പരിശീലനവും ശേഷി വർധനവും'
    }
  ];

  const schemeCategories = getTranslatedArray(schemeCategoriesEn, schemeCategoriesHi, schemeCategoriesMr, schemeCategoriesGu, schemeCategoriesMl);

  // Quick actions
  const quickActionsEn = [
    {
      id: 'eligibility-checker',
      name: 'Eligibility Checker',
      icon: UserCheck,
      description: 'See schemes according to your eligibility',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      id: 'application-helper',
      name: 'Application Helper',
      icon: Bot,
      description: 'Get help with application from AI',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: 'notifications',
      name: 'New Schemes',
      icon: Bell,
      description: 'Get latest updates',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      id: 'download-forms',
      name: 'Download Forms',
      icon: Download,
      description: 'Download application forms',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  const quickActionsHi = [
    {
      id: 'eligibility-checker',
      name: 'पात्रता जांच',
      icon: UserCheck,
      description: 'अपनी पात्रता के अनुसार योजनाएं देखें',
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
  ];

  const quickActionsMr = [
    {
      id: 'eligibility-checker',
      name: 'पात्रता तपासक',
      icon: UserCheck,
      description: 'तुमच्या पात्रतेनुसार योजना पहा',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      id: 'application-helper',
      name: 'अर्ज सहाय्यक',
      icon: Bot,
      description: 'AI कडून अर्जात मदत घ्या',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: 'notifications',
      name: 'नवीन योजना',
      icon: Bell,
      description: 'नवीनतम अपडेट्स मिळवा',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      id: 'download-forms',
      name: 'फॉर्म डाउनलोड',
      icon: Download,
      description: 'अर्ज फॉर्म डाउनलोड करा',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  const quickActionsGu = [
    {
      id: 'eligibility-checker',
      name: 'પાત્રતા તપાસક',
      icon: UserCheck,
      description: 'તમારી પાત્રતા અનુસાર યોજનાઓ જુઓ',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      id: 'application-helper',
      name: 'અરજી સહાયક',
      icon: Bot,
      description: 'AI પાસેથી અરજીમાં મદદ મેળવો',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: 'notifications',
      name: 'નવી યોજનાઓ',
      icon: Bell,
      description: 'નવીનતમ અપડેટ્સ મેળવો',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      id: 'download-forms',
      name: 'ફોર્મ ડાઉનલોડ',
      icon: Download,
      description: 'અરજી ફોર્મ ડાઉનલોડ કરો',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  const quickActionsMl = [
    {
      id: 'eligibility-checker',
      name: 'യോഗ്യത പരിശോധകൻ',
      icon: UserCheck,
      description: 'നിങ്ങളുടെ യോഗ്യത പ്രകാരം സ്കീമുകൾ കാണുക',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      id: 'application-helper',
      name: 'അപേക്ഷ സഹായി',
      icon: Bot,
      description: 'AI ൽ നിന്ന് അപേക്ഷയ്ക്ക് സഹായം നേടുക',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: 'notifications',
      name: 'പുതിയ സ്കീമുകൾ',
      icon: Bell,
      description: 'പുതിയ അപ്ഡേറ്റുകൾ നേടുക',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      id: 'download-forms',
      name: 'ഫോമുകൾ ഡൗൺലോഡ്',
      icon: Download,
      description: 'അപേക്ഷ ഫോമുകൾ ഡൗൺലോഡ് ചെയ്യുക',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  const quickActions = getTranslatedArray(quickActionsEn, quickActionsHi, quickActionsMr, quickActionsGu, quickActionsMl);

  // Income levels for eligibility
  const incomeLevelsEn = [
    { id: 'low', name: 'Low Income (< ₹1 Lakh/Year)', maxIncome: 100000 },
    { id: 'medium', name: 'Medium Income (₹1-5 Lakh/Year)', maxIncome: 500000 },
    { id: 'high', name: 'High Income (> ₹5 Lakh/Year)', maxIncome: 1000000 }
  ];

  const incomeLevelsHi = [
    { id: 'low', name: 'कम आय (< ₹1 लाख/वर्ष)', maxIncome: 100000 },
    { id: 'medium', name: 'मध्यम आय (₹1-5 लाख/वर्ष)', maxIncome: 500000 },
    { id: 'high', name: 'उच्च आय (> ₹5 लाख/वर्ष)', maxIncome: 1000000 }
  ];

  const incomeLevelsMr = [
    { id: 'low', name: 'कमी उत्पन्न (< ₹1 लाख/वर्ष)', maxIncome: 100000 },
    { id: 'medium', name: 'मध्यम उत्पन्न (₹1-5 लाख/वर्ष)', maxIncome: 500000 },
    { id: 'high', name: 'जास्त उत्पन्न (> ₹5 लाख/वर्ष)', maxIncome: 1000000 }
  ];

  const incomeLevelsGu = [
    { id: 'low', name: 'ઓછી આવક (< ₹1 લાખ/વર્ષ)', maxIncome: 100000 },
    { id: 'medium', name: 'મધ્યમ આવક (₹1-5 લાખ/વર્ષ)', maxIncome: 500000 },
    { id: 'high', name: 'ઉચ્ચ આવક (> ₹5 લાખ/વર્ષ)', maxIncome: 1000000 }
  ];

  const incomeLevelsMl = [
    { id: 'low', name: 'കുറഞ്ഞ വരുമാനം (< ₹1 ലക്ഷം/വർഷം)', maxIncome: 100000 },
    { id: 'medium', name: 'മധ്യവർഗ്ഗ വരുമാനം (₹1-5 ലക്ഷം/വർഷം)', maxIncome: 500000 },
    { id: 'high', name: 'ഉയർന്ന വരുമാനം (> ₹5 ലക്ഷം/വർഷം)', maxIncome: 1000000 }
  ];

  const incomeLevels = getTranslatedArray(incomeLevelsEn, incomeLevelsHi, incomeLevelsMr, incomeLevelsGu, incomeLevelsMl);

  // Land ownership options
  const landOwnershipOptionsEn = [
    { id: 'small', name: 'Small Farmer (0-2 Hectares)', maxLand: 2 },
    { id: 'medium', name: 'Medium Farmer (2-5 Hectares)', maxLand: 5 },
    { id: 'large', name: 'Large Farmer (>5 Hectares)', maxLand: 100 }
  ];

  const landOwnershipOptionsHi = [
    { id: 'small', name: 'छोटा किसान (0-2 हेक्टेयर)', maxLand: 2 },
    { id: 'medium', name: 'मध्यम किसान (2-5 हेक्टेयर)', maxLand: 5 },
    { id: 'large', name: 'बड़ा किसान (>5 हेक्टेयर)', maxLand: 100 }
  ];

  const landOwnershipOptionsMr = [
    { id: 'small', name: 'छोटा शेतकरी (0-2 हेक्टर)', maxLand: 2 },
    { id: 'medium', name: 'मध्यम शेतकरी (2-5 हेक्टर)', maxLand: 5 },
    { id: 'large', name: 'मोठा शेतकरी (>5 हेक्टर)', maxLand: 100 }
  ];

  const landOwnershipOptionsGu = [
    { id: 'small', name: 'छોટો ખેડૂત (0-2 હેક્ટર)', maxLand: 2 },
    { id: 'medium', name: 'મધ્યમ ખેડૂત (2-5 હેક્ટર)', maxLand: 5 },
    { id: 'large', name: 'મોટો ખેડૂત (>5 હેક્ટર)', maxLand: 100 }
  ];

  const landOwnershipOptionsMl = [
    { id: 'small', name: 'ചെറു കർഷകൻ (0-2 ഹെക്ടർ)', maxLand: 2 },
    { id: 'medium', name: 'മധ്യ കർഷകൻ (2-5 ഹെക്ടർ)', maxLand: 5 },
    { id: 'large', name: 'വലിയ കർഷകൻ (>5 ഹെക്ടർ)', maxLand: 100 }
  ];

  const landOwnershipOptions = getTranslatedArray(landOwnershipOptionsEn, landOwnershipOptionsHi, landOwnershipOptionsMr, landOwnershipOptionsGu, landOwnershipOptionsMl);

  // Process data from API 1 (Ministry Schemes)
  function processApi1Data(records) {
    if (!records || !Array.isArray(records)) return []
    
    const commonDocumentsEn = ['Aadhaar card', 'Land ownership proof', 'Bank account details', 'Passport size photo']
    const commonDocumentsHi = ['आधार कार्ड', 'भूमि स्वामित्व प्रमाण', 'बैंक खाता विवरण', 'पासपोर्ट साइज फोटो']
    const commonDocumentsMr = ['आधार कार्ड', 'जमिनी मालकी पुरावा', 'बँक खाते तपशील', 'पासपोर्ट साइज फोटो']
    const commonDocumentsGu = ['આધાર કાર્ડ', 'જમીન માલિકી પુરાવો', 'બેંક ખાતાની વિગતો', 'પાસપોર્ટ સાઇઝ ફોટો']
    const commonDocumentsMl = ['ആധാർ കാർഡ്', 'ഭൂമി സ്വത്തവകാശം തെളിവ്', 'ബാങ്ക് അക്കൗണ്ട് വിശദാംശങ്ങൾ', 'പാസ്പോർട്ട് സൈസ് ഫോട്ടോ']

    const commonEligibilityEn = ['Indian farmers', 'Valid agricultural land holders', 'Availability of required documents']
    const commonEligibilityHi = ['भारतीय किसान', 'वैध कृषि भूमि धारक', 'आवश्यक दस्तावेज उपलब्धता']
    const commonEligibilityMr = ['भारतीय शेतकरी', 'वैध शेती जमीन धारक', 'आवश्यक दस्तऐवज उपलब्धता']
    const commonEligibilityGu = ['ભારતીય ખેડૂત', 'વૈધ કૃષિ જમીન ધારક', 'જરૂરી દસ્તાવેજોની ઉપલબ્ધતા']
    const commonEligibilityMl = ['ഇന്ത്യൻ കർഷകർ', 'വാലിഡ് കൃഷിഭൂമി ഉടമകൾ', 'ആവശ്യമായ ഡോക്യുമെന്റുകളുടെ ലഭ്യത']

    const commonApplicationEn = ['Registration on official website', 'Upload required documents', 'Submit application form', 'Verification process']
    const commonApplicationHi = ['आधिकारिक वेबसाइट पर पंजीकरण', 'आवश्यक दस्तावेज अपलोड करें', 'आवेदन फॉर्म जमा करें', 'सत्यापन प्रक्रिया']
    const commonApplicationMr = ['अधिकृत वेबसाइटवर नोंदणी', 'आवश्यक दस्तऐवज अपलोड करा', 'अर्ज फॉर्म सबमिट करा', 'तपासणी प्रक्रिया']
    const commonApplicationGu = ['અધિકૃત વેબસાઇટ પર નોંધણી', 'જરૂરી દસ્તાવેજો અપલોડ કરો', 'અરજી ફોર્મ જમા કરો', 'ચકાસણી પ્રક્રિયા']
    const commonApplicationMl = ['ഔദ്യോഗിക വെബ്സൈറ്റിൽ രജിസ്ട്രേഷൻ', 'ആവശ്യമായ ഡോക്യുമെന്റുകൾ അപ്‌ലോഡ് ചെയ്യുക', 'അപേക്ഷ ഫോം സമർപ്പിക്കുക', 'വെരിഫിക്കേഷൻ പ്രക്രിയ']

    const commonBenefitsEn = ['Financial assistance to farmers', 'Increase in agricultural productivity', 'Government support and guidance']
    const commonBenefitsHi = ['किसानों को वित्तीय सहायता', 'कृषि उत्पादकता में वृद्धि', 'सरकारी सहायता और मार्गदर्शन']
    const commonBenefitsMr = ['शेतकऱ्यांना आर्थिक सहाय्य', 'कृषी उत्पादकतेत वाढ', 'सरकारी सहाय्य आणि मार्गदर्शन']
    const commonBenefitsGu = ['ખેડૂતોને આર્થિક સહાય', 'કૃષિ ઉત્પાદકતામાં વધારો', 'સરકારી સહાય અને માર્ગદર્શન']
    const commonBenefitsMl = ['കർഷകർക്ക് സാമ്പത്തിക സഹായം', 'കൃഷി ഉൽപ്പാദനക്ഷമത വർധന', 'സർക്കാർ സപ്പോർട്ടും മാർഗദർശനവും']

    return records
      .filter(record => record && record.name_of_mission___scheme)
      .map(record => {
        const schemeName = record.name_of_mission___scheme || getText('Unnamed Scheme', 'अनाम योजना', 'अनामित योजना', 'અનામિત યોજના', 'അജ്ഞാത സ്കീം')
        
        return {
          id: `api1_${record.document_id || Math.random().toString(36).substring(2, 9)}`,
          schemeName: schemeName,
          schemeObjective: record.objective || record.scheme_objective || getText('Scheme for agriculture development and farmer welfare', 'कृषि विकास और किसान कल्याण हेतु योजना', 'कृषी विकास आणि शेतकरी कल्याण योजना', 'કૃષિ વિકાસ અને ખેડૂત કલ્યાણ યોજના', 'കൃഷി വികസനവും കർഷക ക്ഷേമവും സ്കീം'),
          schemeBenefits: getTranslatedArray(commonBenefitsEn, commonBenefitsHi, commonBenefitsMr, commonBenefitsGu, commonBenefitsMl),
          schemeEligibility: getTranslatedArray(commonEligibilityEn, commonEligibilityHi, commonEligibilityMr, commonEligibilityGu, commonEligibilityMl),
          applicationProcess: getTranslatedArray(commonApplicationEn, commonApplicationHi, commonApplicationMr, commonApplicationGu, commonApplicationMl),
          documentsRequired: getTranslatedArray(commonDocumentsEn, commonDocumentsHi, commonDocumentsMr, commonDocumentsGu, commonDocumentsMl),
          helplineNumber: record.helpline || '1800-180-1551',
          schemeUrl: record.website || 'https://agriculture.gov.in',
          category: categorizeScheme(schemeName),
          sponsorMinistry: record.ministry || getText('Ministry of Agriculture, Cooperation and Farmers Welfare', 'कृषि, सहकारिता और किसान कल्याण मंत्रालय', 'कृषी, सहकार्य आणि शेतकरी कल्याण मंत्रालय', 'કૃષિ, સહકાર અને ખેડૂત કલ્યાણ મંત્રાલય', 'കൃഷി, സഹകരണം, കർഷക ക്ഷേമ മന്ത്രാലയം'),
          schemeIntroducedYear: record.year || 'N/A',
          schemeStatus: 'active',
          lastModifiedDate: record.last_updated || new Date().toISOString().split('T')[0],
          state: record.state || 'Pan India',
          targetBeneficiary: getText('Farmers', 'किसान', 'शेतकरी', 'ખેડૂત', 'കർഷകർ'),
          incomeEligibility: 'all',
          landSizeEligibility: 'all',
          apiSource: 'api1',
          rawData: record
        }
      })
  }

  // Process data from API 2 (State/UT-wise Integrated Scheme on Agriculture Census 2020-21)
  function processApi2Data(records) {
    if (!records || !Array.isArray(records)) return []
    
    const api2DocumentsEn = ['Land records', 'Crop details', 'Agricultural equipment information']
    const api2DocumentsHi = ['भूमि रिकॉर्ड', 'फसल विवरण', 'कृषि उपकरण जानकारी']
    const api2DocumentsMr = ['जमिनी रेकॉर्ड', 'पिक तपशील', 'कृषी उपकरण माहिती']
    const api2DocumentsGu = ['જમીન રેકોર્ડ', 'પાક વિગતો', 'કૃષિ સાધન માહિતી']
    const api2DocumentsMl = ['ഭൂമി രേഖകൾ', 'വിള വിശദാംശങ്ങൾ', 'കൃഷി ഉപകരണ വിവരങ്ങൾ']

    const api2EligibilityEn = ['All farmers in the state', 'Agricultural land holders', 'Government data collectors']
    const api2EligibilityHi = ['राज्य के सभी किसान', 'कृषि भूमि धारक', 'सरकारी आंकड़ा संग्रहकर्ता']
    const api2EligibilityMr = ['राज्यातील सर्व शेतकरी', 'शेती जमीन धारक', 'सरकारी डेटा संग्राहक']
    const api2EligibilityGu = ['રાજ્યમાં બધા ખેડૂત', 'કૃષિ જમીન ધારક', 'સરકારી ડેટા સંગ્રાહક']
    const api2EligibilityMl = ['സംസ്ഥാനത്തെ എല്ലാ കർഷകരും', 'കൃഷിഭൂമി ഉടമകൾ', 'സർക്കാർ ഡാറ്റ സംഘർഷകർ']

    const api2ApplicationEn = ['Automated registration by agriculture department', 'Data collection process', 'Data verification and processing']
    const api2ApplicationHi = ['कृषि विभाग द्वारा स्वचालित पंजीकरण', 'आंकड़ा संग्रहण प्रक्रिया', 'डेटा सत्यापन और प्रसंस्करण']
    const api2ApplicationMr = ['कृषी विभागाद्वारे स्वयंचलित नोंदणी', 'डेटा संग्रह प्रक्रिया', 'डेटा तपासणी आणि प्रक्रिया']
    const api2ApplicationGu = ['કૃષિ વિભાગ દ્વારા સ્વચાલિત નોંધણી', 'ડેટા સંગ્રહ પ્રક્રિયા', 'ડેટા ચકાસણી અને પ્રોસેસિંગ']
    const api2ApplicationMl = ['കൃഷി വകുപ്പ് ഓട്ടോമേറ്റഡ് രജിസ്ട്രേഷൻ', 'ഡാറ്റ സമാഹരണ പ്രക്രിയ', 'ഡാറ്റ വെരിഫിക്കേഷൻ & പ്രോസസ്സിംഗ്']

    const api2BenefitsEn = ['Scientific collection of agricultural data', 'Assistance in scheme formulation', 'State-specific agriculture data']
    const api2BenefitsHi = ['कृषि आंकड़ों का वैज्ञानिक संग्रहण', 'योजना निर्माण में सहायता', 'राज्य-विशिष्ट कृषि डेटा']
    const api2BenefitsMr = ['कृषी डेटाचा वैज्ञानिक संग्रह', 'योजना तयार करण्यात सहाय्य', 'राज्य-विशिष्ट कृषी डेटा']
    const api2BenefitsGu = ['કૃષિ ડેટાનું વૈજ્ઞાનિક સંગ્રહ', 'યોજના નિર્માણમાં સહાય', 'રાજ્ય-વિશિષ્ટ કૃષિ ડેટા']
    const api2BenefitsMl = ['കൃഷി ഡാറ്റയുടെ ശാസ്ത്രീയ സമാഹരണം', 'സ്കീം രൂപീകരണത്തിൽ സഹായം', 'സംസ്ഥാന-നിർദ്ദിഷ്ട കൃഷി ഡാറ്റ']

    return records
      .filter(record => record && record.name_of_the_state_ut)
      .map(record => {
        const stateName = record.name_of_the_state_ut || getText('Unknown State', 'अज्ञात राज्य', 'अज्ञात राज्य', 'અજ્ઞાત રાજ્ય', 'അജ്ഞാത സംസ്ഥാനം')
        const stateLabel = getStateLabel(stateName)
        const allocation = record._2020_21___allocation || 'N/A'
        const released = record._2020_21___released || 'N/A'
        
        return {
          id: `api2_${record.document_id || Math.random().toString(36).substring(2, 9)}`,
          schemeName: `${getText('Agriculture Census Scheme', 'कृषि जनगणना योजना', 'कृषी जनगणना योजना', 'કૃષિ ગણતરી યોજના', 'കൃഷി സെൻസസ് സ്കീം')} - ${stateLabel}`,
          schemeObjective: getText('State level agriculture census and data collection scheme', 'राज्य स्तरीय कृषि जनगणना और आंकड़ा संग्रहण योजना', 'राज्य पात्री कृषी जनगणना आणि डेटा संग्रह योजना', 'રાજ્ય સ્તરની કૃષિ ગણતરી અને ડેટા સંગ્રહણ યોજના', 'സംസ്ഥാനതല കൃഷി സെൻസസും ഡാറ്റ സമാഹരണ സ്കീമും'),
          schemeBenefits: getTranslatedArray(api2BenefitsEn, api2BenefitsHi, api2BenefitsMr, api2BenefitsGu, api2BenefitsMl),
          schemeEligibility: getTranslatedArray(api2EligibilityEn, api2EligibilityHi, api2EligibilityMr, api2EligibilityGu, api2EligibilityMl),
          applicationProcess: getTranslatedArray(api2ApplicationEn, api2ApplicationHi, api2ApplicationMr, api2ApplicationGu, api2ApplicationMl),
          documentsRequired: getTranslatedArray(api2DocumentsEn, api2DocumentsHi, api2DocumentsMr, api2DocumentsGu, api2DocumentsMl),
          helplineNumber: '1800-180-1551',
          schemeUrl: 'https://agricensus.gov.in',
          category: 'training',
          sponsorMinistry: getText('Ministry of Agriculture and Farmers Welfare', 'कृषि एवं किसान कल्याण मंत्रालय', 'कृषी व शेतकरी कल्याण मंत्रालय', 'કૃષિ અને ખેડૂત કલ્યાણ મંત્રાલય', 'കൃഷി & കർഷക ക്ഷേമ മന്ത്രാലയം'),
          schemeIntroducedYear: '2020',
          schemeStatus: 'active',
          lastModifiedDate: new Date().toISOString().split('T')[0],
          state: stateName,
          targetBeneficiary: getText('Farmers and Agriculture Department', 'किसान और कृषि विभाग', 'शेतकरी आणि कृषी विभाग', 'ખેડૂત અને કૃષિ વિભાગ', 'കർഷകരും കൃഷി വകുപ്പും'),
          incomeEligibility: 'all',
          landSizeEligibility: 'all',
          apiSource: 'api2',
          allocation: allocation,
          released: released,
          rawData: record
        }
      })
  }

  // Process data from API 3 (State-wise/Year-wise Schemes 2011-12 to 2014-15)
  function processApi3Data(records) {
    if (!records || !Array.isArray(records)) return []
    
    const api3DocumentsEn = ['Aadhaar card', 'Residence proof', 'Land ownership proof', 'Bank account details']
    const api3DocumentsHi = ['आधार कार्ड', 'निवास प्रमाण पत्र', 'भूमि स्वामित्व प्रमाण', 'बैंक खाता विवरण']
    const api3DocumentsMr = ['आधार कार्ड', 'निवास पुरावा', 'जमिनी मालकी पुरावा', 'बँक खाते तपशील']
    const api3DocumentsGu = ['આધાર કાર્ડ', 'નિવાસ પુરાવો', 'જમીન માલિકી પુરાવો', 'બેંક ખાતાની વિગતો']
    const api3DocumentsMl = ['ആധാർ കാർഡ്', 'താമസ തെളിവ്', 'ഭൂമി സ്വത്തവകാശം തെളിവ്', 'ബാങ്ക് അക്കൗണ്ട് വിശദാംശങ്ങൾ']

    const api3EligibilityEn = ['Resident farmers of the state', 'Valid agricultural land holders', 'Registered members of state agriculture department']
    const api3EligibilityHi = ['राज्य के निवासी किसान', 'वैध कृषि भूमि धारक', 'राज्य कृषि विभाग के पंजीकृत सदस्य']
    const api3EligibilityMr = ['राज्याचे रहिवासी शेतकरी', 'वैध शेती जमीन धारक', 'राज्य कृषी विभागाचे नोंदणीकृत सदस्य']
    const api3EligibilityGu = ['રાજ્યના રહેવાસી ખેડૂત', 'વૈધ કૃષિ જમીન ધારક', 'રાજ્ય કૃષિ વિભાગના નોંધાયેલા સભ્યો']
    const api3EligibilityMl = ['സംസ്ഥാനത്തെ താമസക്കാർ കർഷകർ', 'വാലിഡ് കൃഷിഭൂമി ഉടമകൾ', 'സംസ്ഥാന കൃഷി വകുപ്പിന്റെ രജിസ്റ്റേർഡ് അംഗങ്ങൾ']

    const api3ApplicationEn = ['Registration on state agriculture portal', 'Submit required documents', 'District level approval', 'Benefit distribution']
    const api3ApplicationHi = ['राज्य कृषि पोर्टल पर पंजीकरण', 'आवश्यक दस्तावेज जमा करें', 'जिला स्तरीय अनुमोदन', 'लाभ वितरण']
    const api3ApplicationMr = ['राज्य कृषी पोर्टलवर नोंदणी', 'आवश्यक दस्तऐवज सबमिट करा', 'जिल्हा स्तर मंजुरी', 'लाभ वितरण']
    const api3ApplicationGu = ['રાજ્ય કૃષિ પોર્ટલ પર નોંધણી', 'જરૂરી દસ્તાવેજો જમા કરો', 'જિલ્લા સ્તરીય મંજૂરી', 'લાભ વિતરણ']
    const api3ApplicationMl = ['സംസ്ഥാന കൃഷി പോർട്ടലിൽ രജിസ്ട്രേഷൻ', 'ആവശ്യമായ ഡോക്യുമെന്റുകൾ സമർപ്പിക്കുക', 'ജില്ലാതല അംഗീകാരം', 'പ്രയോജന വിതരണം']

    const api3BenefitsEn = ['Multi-year agricultural development', 'State-specific agriculture initiatives', 'Financial assistance and guidance']
    const api3BenefitsHi = ['बहु-वर्षीय कृषि विकास', 'राज्य-विशिष्ट कृषि पहल', 'वित्तीय सहायता और मार्गदर्शन']
    const api3BenefitsMr = ['बहु-वर्षीय कृषी विकास', 'राज्य-विशिष्ट कृषी उपक्रम', 'आर्थिक सहाय्य आणि मार्गदर्शन']
    const api3BenefitsGu = ['બહુ-વર્ષીય કૃષિ વિકાસ', 'રાજ્ય-વિશિષ્ટ કૃષિ પહેલ', 'આર્થિક સહાય અને માર્ગદર્શન']
    const api3BenefitsMl = ['ബഹുവർഷ കൃഷി വികസനം', 'സംസ്ഥാന-നിർദ്ദിഷ്ട കൃഷി സംരംഭങ്ങൾ', 'സാമ്പത്തിക സഹായവും മാർഗദർശനവും']

    return records
      .filter(record => record && record.state)
      .map(record => {
        const stateName = record.state || getText('Unknown State', 'अज्ञात राज्य', 'अज्ञात राज्य', 'અજ્ઞાત રાજ્ય', 'അജ്ഞാത സംസ്ഥാനം')
        const stateLabel = getStateLabel(stateName)
        const year2011 = record._2011_12 || 'N/A'
        const year2012 = record._2012_13 || 'N/A'
        const year2013 = record._2013_14 || 'N/A'
        const year2014 = record['2014_15till_january2015'] || 'N/A'
        
        return {
          id: `api3_${record.document_id || Math.random().toString(36).substring(2, 9)}`,
          schemeName: `${getText('State Agriculture Development Scheme', 'राज्य कृषि विकास योजना', 'राज्य कृषी विकास योजना', 'રાજ્ય કૃષિ વિકાસ યોજના', 'സംസ്ഥാന കൃഷി വികസന സ്കീം')} - ${stateLabel}`,
          schemeObjective: getText('State level agriculture development and farmer welfare scheme', 'राज्य स्तरीय कृषि विकास और किसान कल्याण योजना', 'राज्य पात्री कृषी विकास आणि शेतकरी कल्याण योजना', 'રાજ્ય સ્તરીય કૃષિ વિકાસ અને ખેડૂત કલ્યાણ યોજના', 'സംസ്ഥാനതല കൃഷി വികസനവും കർഷക ക്ഷേമ സ്കീമും'),
          schemeBenefits: getTranslatedArray(api3BenefitsEn, api3BenefitsHi, api3BenefitsMr, api3BenefitsGu, api3BenefitsMl),
          schemeEligibility: getTranslatedArray(api3EligibilityEn, api3EligibilityHi, api3EligibilityMr, api3EligibilityGu, api3EligibilityMl),
          applicationProcess: getTranslatedArray(api3ApplicationEn, api3ApplicationHi, api3ApplicationMr, api3ApplicationGu, api3ApplicationMl),
          documentsRequired: getTranslatedArray(api3DocumentsEn, api3DocumentsHi, api3DocumentsMr, api3DocumentsGu, api3DocumentsMl),
          helplineNumber: '1800-180-1551',
          schemeUrl: 'https://stateagriculture.gov.in',
          category: 'subsidy',
          sponsorMinistry: getText('State Agriculture Department', 'राज्य कृषि विभाग', 'राज्य कृषी विभाग', 'રાજ્ય કૃષિ વિભાગ', 'സംസ്ഥാന കൃഷി വകുപ്പ്'),
          schemeIntroducedYear: '2011',
          schemeStatus: 'active',
          lastModifiedDate: new Date().toISOString().split('T')[0],
          state: stateName,
          targetBeneficiary: getText('State farmers', 'राज्य के किसान', 'राज्याचे शेतकरी', 'રાજ્યના ખેડૂત', 'സംസ്ഥാന കർഷകർ'),
          incomeEligibility: 'all',
          landSizeEligibility: 'all',
          apiSource: 'api3',
          coverage: {
            '2011-12': year2011,
            '2012-13': year2012,
            '2013-14': year2013,
            '2014-15': year2014
          },
          rawData: record
        }
      })
  }

  // Fallback schemes in case APIs fail
  const getFallbackSchemes = () => {
    const pmKisanName = getText('PM-KISAN Scheme', 'प्रधानमंत्री किसान सम्मान निधि योजना', 'प्रधानमंत्री शेतकरी सन्मान निधी योजना', 'પીએમ-કિસાન યોજના', 'പിഎം-കിസാൻ സ്കീം');

    const pmKisanObjective = getText('Small and marginal farmers to provide direct financial assistance of ₹6000 per year', 'छोटे और सीमांत किसानों को प्रतिवर्ष ₹6000 की प्रत्यक्ष आर्थिक सहायता', 'छोटे आणि सीमांत शेतकऱ्यांना प्रति वर्ष ₹6000 ची थेट आर्थिक सहाय्य', 'छોટા અને સીમાંત ખેડૂતોને વાર્ષિક ₹6000 ની સીધી આર્થિક સહાય', 'കുറഞ്ഞ വരുമാനമുള്ള കർഷകർക്ക് വർഷം തോറും ₹6000 നേരിട്ടുള്ള സാമ്പത്തിക സഹായം');

    const pmKisanBenefits = getTranslatedArray(
      ['₹6000 annual assistance (₹2000 per installment)', 'Direct bank account transfer', 'No intermediaries, no deductions'],
      ['₹6000 वार्षिक सहायता (₹2000 प्रति किस्त)', 'प्रत्यक्ष बैंक खाता स्थानांतरण', 'कोई मध्यस्थ नहीं, कोई कटौती नहीं'],
      ['₹6000 वार्षिक सहाय्य (₹2000 प्रति किस्त)', 'थेट बँक खाते हस्तांतरण', 'कोणतेही मध्यस्थ नाहीत, कोणतीही कपात नाही'],
      ['₹6000 વાર્ષિક સહાય (₹2000 પ્રતિ કિस्त)', 'સીધું બેંક ખાતામાં ટ્રાન્સફર', 'કોઈ મધ્યસ્થી નથી, કોઈ કપાત નથી'],
      ['₹6000 വാർഷിക സഹായം (₹2000 ഓരോ കിസ്തിനും)', 'നേരിട്ടുള്ള ബാങ്ക് അക്കൗണ്ട് ട്രാൻസ്ഫർ', 'മധ്യസ്ഥരില്ല, കുറവുകളില്ല']
    );

    const pmKisanEligibility = getTranslatedArray(
      ['Farmers with up to 2 hectares of agricultural land', 'Indian citizenship required', 'All family members holding land are eligible'],
      ['2 हेक्टेयर तक कृषि भूमि वाले किसान', 'भारतीय नागरिकता आवश्यक', 'सभी भूमि धारक परिवार के सदस्य पात्र'],
      ['2 हेक्टर पर्यंत शेतीची जमीन असलेले शेतकरी', 'भारतीय नागरिकत्व आवश्यक', 'जमीन धारण करणारे सर्व कुटुंब सदस्य पात्र'],
      ['2 હેક્ટર સુધીની કૃષિ જમીનવાળા ખેડૂતો', 'ભારતીય નાગરિકતા જરૂરી', 'જમીન ધરાવતા તમામ કુટુંબ સભ્યો પાત્ર'],
      ['2 ഹെക്ടർ വരെ കൃഷിഭൂമി ഉള്ള കർഷകർ', 'ഇന്ത്യൻ പൗരത്വം ആവശ്യം', 'ഭൂമി ഉടമകളായ എല്ലാ കുടുംബാംഗങ്ങളും യോഗ്യർ']
    );

    const pmKisanApplicationProcess = getTranslatedArray(
      ['Registration on PM-KISAN portal', 'Upload required documents', 'Bank details verification'],
      ['PM-KISAN पोर्टल पर पंजीकरण', 'आवश्यक दस्तावेज अपलोड करें', 'बैंक विवरण सत्यापन'],
      ['PM-KISAN पोर्टलवर नोंदणी', 'आवश्यक दस्तऐवज अपलोड करा', 'बँक तपशील तपासणी'],
      ['PM-KISAN પોર્ટલ પર નોંધણી', 'જરૂરી દસ્તાવેજો અપલોડ કરો', 'બેંક વિગતો ચકાસણી'],
      ['PM-KISAN പോർട്ടലിൽ രജിസ്ട്രേഷൻ', 'ആവശ്യമായ ഡോക്യുമെന്റുകൾ അപ്‌ലോഡ് ചെയ്യുക', 'ബാങ്ക് വിശദാംശങ്ങൾ വെരിഫിക്കേഷൻ']
    );

    const pmKisanDocumentsRequired = getTranslatedArray(
      ['Aadhaar card', 'Land ownership proof', 'Bank account details'],
      ['आधार कार्ड', 'भूमि स्वामित्व प्रमाण', 'बैंक खाता विवरण'],
      ['आधार कार्ड', 'जमिनी मालकी पुरावा', 'बँक खाते तपशील'],
      ['આધાર કાર્ડ', 'જમીન માલિકી પુરાવો', 'બેંક ખાતાની વિગતો'],
      ['ആധാർ കാർഡ്', 'ഭൂമി സ്വത്തവകാശം തെളിവ്', 'ബാങ്ക് അക്കൗണ്ട് വിശദാംശങ്ങൾ']
    );

    const pmKisanSponsorMinistry = getText('Ministry of Agriculture and Farmers Welfare', 'कृषि एवं किसान कल्याण मंत्रालय', 'कृषी व शेतकरी कल्याण मंत्रालय', 'કૃષિ અને ખેડૂત કલ્યાણ મંત્રાલય', 'കൃഷി & കർഷക ക്ഷേമ മന്ത്രാലയം');

    const pmKisanTargetBeneficiary = getText('Farmers', 'किसान', 'शेतकरी', 'ખેડૂત', 'കർഷകർ');

    const pmKisan = {
      id: 'pm-kisan',
      schemeName: pmKisanName,
      schemeObjective: pmKisanObjective,
      schemeBenefits: pmKisanBenefits,
      schemeEligibility: pmKisanEligibility,
      applicationProcess: pmKisanApplicationProcess,
      documentsRequired: pmKisanDocumentsRequired,
      helplineNumber: '155261',
      schemeUrl: 'https://pmkisan.gov.in',
      category: 'income-support',
      sponsorMinistry: pmKisanSponsorMinistry,
      schemeIntroducedYear: '2019',
      schemeStatus: 'active',
      lastModifiedDate: '2024-04-01',
      state: 'Pan India',
      targetBeneficiary: pmKisanTargetBeneficiary,
      incomeEligibility: 'low',
      landSizeEligibility: 'small',
      apiSource: 'fallback'
    };

    const pmfbyName = getText('PM Fasal Bima Yojana', 'प्रधानमंत्री फसल बीमा योजना', 'प्रधानमंत्री पिक विमा योजना', 'પીએમ-ફસલ બીમા યોજના', 'പിഎം ഫസൽ ബിമ യോജന');

    const pmfbyObjective = getText('Protection of farmers from crop loss due to natural calamities', 'प्राकृतिक आपदाओं के कारण फसल क्षति से किसानों की सुरक्षा', 'नैसर्गिक आपत्तीमुळे पिक नुकसानीपासून शेतकऱ्यांचे संरक्षण', 'પ્રાકૃતિક આફતોને કારણે પાકના નુકસાનથી ખેડૂતોનું રક્ષણ', 'പ്രകൃതി ദുരന്തങ്ങളാൽ വിള നഷ്ടത്തിൽ നിന്നുള്ള കർഷകരുടെ സംരക്ഷണം');

    const pmfbyBenefits = getTranslatedArray(
      ['Maximum 2% premium rate (for Kharif crops)', '1.5% premium rate for Rabi crops', '5% for commercial/horticulture crops'],
      ['अधिकतम 2% प्रीमियम दर (खरीफ फसलों के लिए)', 'रबी फसलों के लिए 1.5% प्रीमियम दर', 'वाणिज्यिक/बागवानी फसलों के लिए 5%'],
      ['कमाल 2% प्रीमियम दर (खरीफ पिकांसाठी)', 'रबी पिकांसाठी 1.5% प्रीमियम दर', 'व्यावसायिक/फळबाग पिकांसाठी 5%'],
      ['મહત્તમ 2% પ્રીમિયમ દર (ખરીફ પાકો માટે)', 'રબી પાકો માટે 1.5% પ્રીમિયમ દર', 'વ્યાપારી/બગીચા પાકો માટે 5%'],
      ['കഴിഞ്ഞ 2% പ്രീമിയം നിരക്ക് (ഖരീഫ് വിളകൾക്ക്)', 'റബി വിളകൾക്ക് 1.5% പ്രീമിയം നിരക്ക്', 'വാണിജ്യ/തോട്ടവിളകൾക്ക് 5%']
    );

    const pmfbyEligibility = getTranslatedArray(
      ['All farmers eligible (both loanee and non-loanee)', 'For notified crops', 'State government notified area'],
      ['सभी किसान पात्र (ऋणी और गैर-ऋणी दोनों)', 'अधिसूचित फसलों के लिए', 'राज्य सरकार द्वारा अधिसूचित क्षेत्र'],
      ['सर्व शेतकरी पात्र (कर्जदार आणि गैर-कर्जदार दोन्ही)', 'सूचित पिकांसाठी', 'राज्य सरकारने सूचित क्षेत्र'],
      ['બધા ખેડૂતો પાત્ર (ઋણી અને બિનઋણી બંને)', 'સૂચિત પાકો માટે', 'રાજ્ય સરકાર દ્વારા સૂચિત વિસ્તાર'],
      ['എല്ലാ കർഷകരും യോഗ്യർ (ലോണി, നോൺ-ലോണി)', 'നോട്ടിഫൈഡ് വിളകൾക്ക്', 'സംസ്ഥാന സർക്കാർ നോട്ടിഫൈഡ് ഏരിയ']
    );

    const pmfbyApplicationProcess = getTranslatedArray(
      ['Apply at bank or CSC', 'Pay premium', 'Receive insurance policy'],
      ['बैंक या CSC पर आवेदन', 'प्रीमियम भुगतान', 'बीमा पॉलिसी प्राप्त करें'],
      ['बँक किंवा CSC वर अर्ज', 'प्रीमियम भरणा', 'विमा धोरण मिळवा'],
      ['બેંક અથવા CSC પર અરજી', 'પ્રીમિયમ ચૂકવો', 'વીમા પોલિસી મેળવો'],
      ['ബാങ്കിലോ CSC ൽ അപേക്ഷിക്കുക', 'പ്രീമിയം പേയ്', 'ഇൻഷുറൻസ് പോളിസി ലഭിക്കുക']
    );

    const pmfbyDocumentsRequired = getTranslatedArray(
      ['Aadhaar card', 'Land documents', 'Bank account details'],
      ['आधार कार्ड', 'भूमि दस्तावेज', 'बैंक खाता विवरण'],
      ['आधार कार्ड', 'जमिनी दस्तऐवज', 'बँक खाते तपशील'],
      ['આધાર કાર્ડ', 'જમીન દસ્તાવેજ', 'બેંક ખાતાની વિગતો'],
      ['ആധാർ കാർഡ്', 'ഭൂമി ഡോക്യുമെന്റുകൾ', 'ബാങ്ക് അക്കൗണ്ട് വിശദാംശങ്ങൾ']
    );

    const pmfby = {
      id: 'pmfby',
      schemeName: pmfbyName,
      schemeObjective: pmfbyObjective,
      schemeBenefits: pmfbyBenefits,
      schemeEligibility: pmfbyEligibility,
      applicationProcess: pmfbyApplicationProcess,
      documentsRequired: pmfbyDocumentsRequired,
      helplineNumber: '14447',
      schemeUrl: 'https://pmfby.gov.in',
      category: 'insurance',
      sponsorMinistry: pmKisanSponsorMinistry,
      schemeIntroducedYear: '2016',
      schemeStatus: 'active',
      lastModifiedDate: '2024-03-15',
      state: 'Pan India',
      targetBeneficiary: pmKisanTargetBeneficiary,
      incomeEligibility: 'all',
      landSizeEligibility: 'all',
      apiSource: 'fallback'
    };

    const kccName = getText('Kisan Credit Card Scheme', 'किसान क्रेडिट कार्ड योजना', 'शेतकरी क्रेडिट कार्ड योजना', 'કિસાન ક્રેડિટ કાર્ડ યોજના', 'കിസാൻ ക്രെഡിറ്റ് കാർഡ് സ്കീം');

    const kccObjective = getText('Timely credit facility for agriculture and allied activities', 'कृषि और संबंधित गतिविधियों के लिए समयबद्ध ऋण सुविधा', 'शेती आणि संलग्न क्रियांसाठी वेळेवर कर्ज सुविधा', 'કૃષિ અને જોડાયેલી પ્રવૃત્તિઓ માટે સમયસર ક્રેડિટ સુવિધા', 'കൃഷി & സഖ്യ പ്രവർത്തനങ്ങൾക്കുള്ള സമയബന്ധിത ക്രെഡിറ്റ് സൗകര്യം');

    const kccBenefits = getTranslatedArray(
      ['Loan up to ₹1.6 lakh (for general farmers)', '4% interest rate per year (after subsidy)', '1 year moratorium on crop loan'],
      ['₹1.6 लाख तक का ऋण (सामान्य किसानों के लिए)', '4% प्रति वर्ष ब्याज दर (सब्सिडी के बाद)', 'फसल ऋण पर 1 वर्ष की मोहलत'],
      ['₹1.6 लाख पर्यंत कर्ज (सामान्य शेतकऱ्यांसाठी)', '4% वार्षिक व्याज दर (सबसिडीनंतर)', 'पिक कर्जावर 1 वर्षाची मोहलत'],
      ['₹1.6 લાખ સુધીનું કરજ (સામાન્ય ખેડૂતો માટે)', '4% વાર્ષિક વ્યાજ દર (સબસિડી પછી)', 'પાક કરજ પર 1 વર્ષની મોરેટોરિયમ'],
      ['പൊതു കർഷകർക്ക് ₹1.6 ലക്ഷം വരെ ലോൺ', '4% വാർഷിക പലിശ നിരക്ക് (സബ്സിഡി ശേഷം)', 'വിള ലോണിന് 1 വർഷം മോറട്ടോറിയം']
    );

    const kccEligibility = getTranslatedArray(
      ['Individual farmers and joint borrowers', 'Tenant farmers, partnership firms', 'Self-help groups (SHGs)'],
      ['व्यक्तिगत किसान और संयुक्त उधारकर्ता', 'किरायेदार किसान, साझेदारी फर्में', 'स्व-सहायता समूह (SHGs)'],
      ['वैयक्तिक शेतकरी आणि संयुक्त उधारकर्ते', 'भाडेकरू शेतकरी, भागीदारी फर्म', 'स्व-सहाय्य गट (SHGs)'],
      ['વ્યક્તિગત ખેડૂતો અને જોઈન્ટ બોરોવર્સ', 'કિરાયદાર ખેડૂતો, પાર્ટનરશિપ ફર્મ', 'સ્વ-સહાય સમૂહો (SHGs)'],
      ['ഇൻഡിവിജ്വൽ കർഷകർ, ജോയിന്റ് ബോറോവേഴ്സ്', 'ടെനന്റ് കർഷകർ, പാർട്നർഷിപ് ഫേമുകൾ', 'സെൽഫ്-ഹെൽപ് ഗ്രൂപ്പുകൾ (SHGs)']
    );

    const kccApplicationProcess = getTranslatedArray(
      ['Apply at bank branch', 'Document verification', 'Issue KCC'],
      ['बैंक शाखा में आवेदन', 'दस्तावेज सत्यापन', 'KCC जारी करना'],
      ['बँक शाखेत अर्ज', 'दस्तऐवज तपासणी', 'KCC जारी करा'],
      ['બેંક શાખામાં અરજી', 'દસ્તાવેજ ચકાસણી', 'KCC જારી કરો'],
      ['ബാങ്ക് ബ്രാഞ്ചിൽ അപേക്ഷിക്കുക', 'ഡോക്യുമെന്റ് വെരിഫിക്കേഷൻ', 'KCC ഇഷ്യൂ ചെയ്യുക']
    );

    const kccDocumentsRequired = getTranslatedArray(
      ['Identity proof (Aadhaar, PAN)', 'Land ownership proof', 'Passport size photo'],
      ['पहचान प्रमाण (आधार, पैन)', 'भूमि स्वामित्व प्रमाण', 'पासपोर्ट आकार फोटो'],
      ['ओळख पुरावा (आधार, PAN)', 'जमिनी मालकी पुरावा', 'पासपोर्ट साइज फोटो'],
      ['ઓળખ પુરાવો (આધાર, PAN)', 'જમીન માલિકી પુરાવો', 'પાસપોર્ટ સાઇઝ ફોટો'],
      ['ഐഡന്റിറ്റി പ്രൂഫ് (ആധാർ, PAN)', 'ഭൂമി സ്വത്തവകാശം തെളിവ്', 'പാസ്പോർട്ട് സൈസ് ഫോട്ടോ']
    );

    const kcc = {
      id: 'kcc',
      schemeName: kccName,
      schemeObjective: kccObjective,
      schemeBenefits: kccBenefits,
      schemeEligibility: kccEligibility,
      applicationProcess: kccApplicationProcess,
      documentsRequired: kccDocumentsRequired,
      helplineNumber: '1800-180-1551',
      schemeUrl: 'https://pmkisan.gov.in/kcc',
      category: 'credit',
      sponsorMinistry: pmKisanSponsorMinistry,
      schemeIntroducedYear: '1998',
      schemeStatus: 'active',
      lastModifiedDate: '2024-02-20',
      state: 'Pan India',
      targetBeneficiary: pmKisanTargetBeneficiary,
      incomeEligibility: 'all',
      landSizeEligibility: 'all',
      apiSource: 'fallback'
    };

    return [pmKisan, pmfby, kcc];
  }

  // Fetch schemes from all 3 APIs
  const fetchSchemes = async () => {
    setLoading(true)
    setError(null)
    setDataSource('loading')
    
    try {
      const params = new URLSearchParams({
        'api-key': API_KEY,
        'format': 'json',
        'limit': '100',
        'offset': '0'
      })

      // Fetch from all 3 APIs concurrently with better error handling
      const apiUrls = [
        `${BASE_URL}/${API1_RESOURCE_ID}?${params}`,
        `${BASE_URL}/${API2_RESOURCE_ID}?${params}`,
        `${BASE_URL}/${API3_RESOURCE_ID}?${params}`
      ]

      const apiPromises = apiUrls.map((url, index) => 
        fetchWithRetry(url, `API ${index + 1}`)
      )

      const results = await Promise.allSettled(apiPromises)

      let allSchemes = []
      const stats = { api1: 0, api2: 0, api3: 0, fallback: 0 }

      // Process each API result
      results.forEach((result, index) => {
        const apiName = `API ${index + 1}`
        if (result.status === 'fulfilled' && result.value && result.value.records) {
          let processedSchemes = []
          switch(index) {
            case 0:
              processedSchemes = processApi1Data(result.value.records)
              stats.api1 = processedSchemes.length
              break
            case 1:
              processedSchemes = processApi2Data(result.value.records)
              stats.api2 = processedSchemes.length
              break
            case 2:
              processedSchemes = processApi3Data(result.value.records)
              stats.api3 = processedSchemes.length
              break
          }
          allSchemes = [...allSchemes, ...processedSchemes]
          console.log(`${apiName} fetched ${processedSchemes.length} schemes`)
        } else {
          console.warn(`${apiName} failed:`, result.reason)
        }
      })

      // If no schemes from APIs, use fallback
      if (allSchemes.length === 0) {
        console.log('No schemes from APIs, using fallback data')
        const fallbackSchemes = getFallbackSchemes()
        allSchemes = fallbackSchemes
        stats.fallback = fallbackSchemes.length
        setDataSource('fallback')
      } else {
        setDataSource('api')
      }

      setApiStats(stats)
      
      // Remove duplicates based on scheme name and state
      const uniqueSchemes = allSchemes.filter((scheme, index, self) =>
        index === self.findIndex(s => 
          s.schemeName.toLowerCase() === scheme.schemeName.toLowerCase() && 
          s.state === scheme.state
        )
      )
      
      setSchemes(uniqueSchemes)
      setFilteredSchemes(uniqueSchemes)
      setError(null)
      
      console.log(`Total unique schemes: ${uniqueSchemes.length}`)
      console.log(`API breakdown:`, stats)
      
    } catch (error) {
      console.error('Error fetching schemes:', error)
      setError(`${getText('Error fetching data from API', 'API से डेटा प्राप्त करने में त्रुटि', 'API मधून डेटा मिळवताना त्रुटी', 'API માંથી ડેટા મેળવવામાં ભૂલ', 'APIൽ നിന്ന് ഡാറ്റ ഫെച്ച് ചെയ്യുമ്പോൾ പിശക്')} ${error.message}`)
      setDataSource('error')
      
      // Use fallback data on error
      const fallbackSchemes = getFallbackSchemes()
      setSchemes(fallbackSchemes)
      setFilteredSchemes(fallbackSchemes)
      setApiStats({ api1: 0, api2: 0, api3: 0, fallback: fallbackSchemes.length })
    } finally {
      setLoading(false)
    }
  }

  // Filter schemes based on search, category, state, and eligibility
  useEffect(() => {
    let filtered = [...schemes]

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(scheme => scheme.category === selectedCategory)
    }

    if (selectedState !== 'all') {
      filtered = filtered.filter(scheme => 
        scheme.state.includes(selectedState) || scheme.state === 'Pan India'
      )
    }

    // Apply eligibility filter if user has checked eligibility
    if (userProfile.checkedEligibility) {
      filtered = filtered.filter(scheme => checkEligibility(scheme, userProfile))
    }

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(scheme => {
        return (
          (scheme.schemeName?.toLowerCase() || '').includes(searchLower) ||
          (scheme.schemeObjective?.toLowerCase() || '').includes(searchLower) ||
          (scheme.schemeBenefits?.join(' ')?.toLowerCase() || '').includes(searchLower) ||
          (scheme.schemeEligibility?.join(' ')?.toLowerCase() || '').includes(searchLower) ||
          (scheme.state?.toLowerCase() || '').includes(searchLower) ||
          (scheme.sponsorMinistry?.toLowerCase() || '').includes(searchLower)
        )
      })
    }

    setFilteredSchemes(filtered)
  }, [searchTerm, selectedCategory, selectedState, schemes, userProfile])

  useEffect(() => {
    fetchSchemes()
  }, [language])

  // Handle eligibility check
  const handleEligibilityCheck = (profile) => {
    const updatedProfile = {
      ...profile,
      checkedEligibility: true
    }
    setUserProfile(updatedProfile)
    setShowEligibilityModal(false)
  }

  // Reset eligibility filter
  const resetEligibility = () => {
    setUserProfile({
      checkedEligibility: false,
      income: 0,
      landOwnership: 0,
      state: ''
    })
  }

  // Chat functionality
  const handleChatMessage = (message) => {
    setChatLoading(true)
    
    setTimeout(() => {
      let response = ''
      const messageLower = message.toLowerCase()
      
      if (messageLower.includes('eligibility') || messageLower.includes(getText('eligibility', 'पात्रता', 'पात्रता', 'પાત્રતા', 'യോഗ്യത').toLowerCase())) {
        response = getText(
          'To check eligibility, please tell me:\n1. How many acres of land do you have?\n2. Which state do you reside in?\n3. What is your main crop?\n\nBased on this information, I can tell you about suitable schemes.',
          'पात्रता जांचने के लिए कृपया बताएं:\n1. आपके पास कितनी एकड़ जमीन है?\n2. आप किस राज्य के निवासी हैं?\n3. आपकी मुख्य फसल क्या है?\n\nइस जानकारी के आधार पर मैं आपको उपयुक्त योजनाओं के बारे में बता सकूंगा।',
          'पात्रता तपासण्यासाठी कृपया सांगा:\n1. तुमच्याकडे किती एकर जमीन आहे?\n2. तुम्ही कोणत्या राज्यात राहता?\n3. तुमची मुख्य पिक काय आहे?\n\nया माहितीवर आधारित मी तुम्हाला योग्य योजनांबद्दल सांगू शकतो.',
          'પાત્રતા તપાસવા માટે કૃપા કરીને કહો:\n1. તમારી પાસે કેટલા એકર જમીન છે?\n2. તમે કયા રાજ્યમાં રહો છો?\n3. તમારી મુખ્ય પાક શું છે?\n\nઆ માહિતીના આધારે હું તમને યોગ્ય યોજનાઓ વિશે કહી શકું.',
          'യോഗ്യത പരിശോധിക്കാൻ, ദയവായി പറയൂ:\n1. എത്ര ഏക്കർ ഭൂമി നിങ്ങൾക്ക് ഉണ്ട്?\n2. ഏത് സംസ്ഥാനത്താണ് നിങ്ങൾ താമസിക്കുന്നത്?\n3. നിങ്ങളുടെ പ്രധാന വിള എന്താണ്?\n\nഈ വിവരങ്ങളുടെ അടിസ്ഥാനത്തിൽ ഞാൻ അനുയോജ്യമായ സ്കീമുകളെക്കുറിച്ച് പറയാം.'
        );
      } else if (messageLower.includes('application') || messageLower.includes(getText('application', 'आवेदन', 'अर्ज', 'અરજી', 'അപേക്ഷ').toLowerCase())) {
        response = getText(
          'General application process:\n1. Go to the official website of the scheme\n2. Prepare required documents (Aadhaar card, land papers, bank passbook)\n3. Apply online or offline\n4. Keep checking application status\n\nWhich scheme do you want to apply for?',
          'आवेदन के लिए सामान्य प्रक्रिया:\n1. संबंधित योजना की आधिकारिक वेबसाइट पर जाएं\n2. आवश्यक दस्तावेज तैयार करें (आधार कार्ड, जमीन के कागजात, बैंक पासबुक)\n3. ऑनलाइन या ऑफलाइन आवेदन करें\n4. आवेदन की स्थिति की जांच करते रहें\n\nकिस योजना के लिए आवेदन करना चाहते हैं?',
          'सामान्य अर्ज प्रक्रिया:\n1. संबंधित योजनेच्या अधिकृत वेबसाइटवर जा\n2. आवश्यक दस्तऐवज तयार करा (आधार कार्ड, जमिनी कागदपत्र, बँक पासबुक)\n3. ऑनलाइन किंवा ऑफलाइन अर्ज करा\n4. अर्ज स्थिती तपासत राहा\n\nकोणत्या योजनेसाठी अर्ज करायचा आहे?',
          'સામાન્ય અરજી પ્રક્રિયા:\n1. સંબંધિત યોજનાની અધિકૃત વેબસાઇટ પર જાઓ\n2. જરૂરી દસ્તાવેજો તૈયાર કરો (આધાર કાર્ડ, જમીનના કાગળો, બેંક પાસબુક)\n3. ઓનલાઇન અથવા ઓફલાઇન અરજી કરો\n4. અરજીની સ્થિતિ તપાસત રહો\n\nકયા યોજના માટે અરજી કરવી છે?',
          'പൊതു അപേക്ഷ പ്രക്രിയ:\n1. സ്കീമിന്റെ ഔദ്യോഗിക വെബ്സൈറ്റിലേക്ക് പോകുക\n2. ആവശ്യമായ ഡോക്യുമെന്റുകൾ തയ്യാറാക്കുക (ആധാർ കാർഡ്, ഭൂമി പേപ്പറുകൾ, ബാങ്ക് പാസ്ബുക്ക്)\n3. ഓൺലൈൻ അല്ലെങ്കിൽ ഓഫ്‌ലൈൻ അപേക്ഷിക്കുക\n4. അപേക്ഷ സ്റ്റാറ്റസ് പരിശോധിക്കുക\n\nഏത് സ്കീമിനാണ് അപേക്ഷിക്കാൻ ആഗ്രഹിക്കുന്നത്?'
        );
      } else if (messageLower.includes('pm-kisan') || messageLower.includes(getText('pm-kisan', 'किसान सम्मान निधि', 'शेतकरी सन्मान निधी', 'કિસાન સમ્માન નિધિ', 'കിസാൻ സമ്മാൻ നിധി').toLowerCase())) {
        response = getText(
          'PM-KISAN scheme information:\n• ₹6000 annual assistance\n• Paid in three installments\n• Farmers with up to 2 hectares eligible\n• Official website: https://pmkisan.gov.in\n• Helpline: 155261\n\nDo you want to apply for this?',
          'PM-KISAN योजना की जानकारी:\n• ₹6000 वार्षिक सहायता\n• तीन किस्तों में भुगतान\n• 2 हेक्टेयर तक किसान पात्र\n• आधिकारिक वेबसाइट: https://pmkisan.gov.in\n• हेल्पलाइन: 155261\n\nक्या आप इसके लिए आवेदन करना चाहते हैं?',
          'PM-KISAN योजना माहिती:\n• ₹6000 वार्षिक सहाय्य\n• तीन किस्तांत भरणा\n• 2 हेक्टर पर्यंत शेतकरी पात्र\n• अधिकृत वेबसाइट: https://pmkisan.gov.in\n• हेल्पलाइन: 155261\n\nतुम्हाला यासाठी अर्ज करायचा आहे का?',
          'PM-KISAN યોજના માહિતી:\n• ₹6000 વાર્ષિક સહાય\n• ત્રણ કિસ્તોમાં ચૂકવણી\n• 2 હેક્ટર સુધીના ખેડૂતો પાત્ર\n• અધિકૃત વેબસાઇટ: https://pmkisan.gov.in\n• હેલ્પલાઇન: 155261\n\nશું તમે આ માટે અરજી કરવા માંગો છો?',
          'PM-KISAN സ്കീം വിവരങ്ങൾ:\n• ₹6000 വാർഷിക സഹായം\n• മൂന്ന് കിസ്തുകളിൽ അടയ്ക്കൽ\n• 2 ഹെക്ടർ വരെ കർഷകർ യോഗ്യർ\n• ഔദ്യോഗിക വെബ്സൈറ്റ്: https://pmkisan.gov.in\n• ഹെൽപ്‌ലൈൻ: 155261\n\nഇതിന് അപേക്ഷിക്കാൻ ആഗ്രഹിക്കുന്നുണ്ടോ?'
        );
      } else if (messageLower.includes('crop insurance') || messageLower.includes(getText('crop insurance', 'फसल बीमा', 'पिक विमा', 'પાક વીમો', 'പയർദിന വിമ').toLowerCase())) {
        response = getText(
          'Crop Insurance Scheme (PMFBY) information:\n• Protection from natural disasters\n• 2% premium for Kharif\n• 1.5% premium for Rabi\n• Official website: https://pmfby.gov.in\n• Helpline: 14447\n\nContact nearest bank.',
          'फसल बीमा योजना (PMFBY) की जानकारी:\n• प्राकृतिक आपदा से सुरक्षा\n• खरीफ के लिए 2% प्रीमियम\n• रबी के लिए 1.5% प्रीमियम\n• आधिकारिक वेबसाइट: https://pmfby.gov.in\n• हेल्पलाइन: 14447\n\nनजदीकी बैंक से संपर्क करें।',
          'पिक विमा योजना (PMFBY) माहिती:\n• नैसर्गिक आपत्तीपासून संरक्षण\n• खरीफ साठी 2% प्रीमियम\n• रबी साठी 1.5% प्रीमियम\n• अधिकृत वेबसाइट: https://pmfby.gov.in\n• हेल्पलाइन: 14447\n\nनजीकच्या बँकेशी संपर्क साधा.',
          'પાક વીમા યોજના (PMFBY) માહિતી:\n• પ્રાકૃતિક આફતોથી રક્ષણ\n• ખરીફ માટે 2% પ્રીમિયમ\n• રબી માટે 1.5% પ્રીમિયમ\n• અધિકૃત વેબસાઇટ: https://pmfby.gov.in\n• હેલ્પલાઇન: 14447\n\nનજીકની બેંકનો સંપર્ક કરો.',
          'ക്രോപ് ഇൻഷുറൻസ് സ്കീം (PMFBY) വിവരങ്ങൾ:\n• പ്രകൃതി ദുരന്തങ്ങളിൽ നിന്നുള്ള സംരക്ഷണം\n• ഖരീഫിന് 2% പ്രീമിയം\n• റബിക്ക് 1.5% പ്രീമിയം\n• ഔദ്യോഗിക വെബ്സൈറ്റ്: https://pmfby.gov.in\n• ഹെൽപ്‌ലൈൻ: 14447\n\nഏറ്റവും അടുത്തുള്ള ബാങ്കുമായി ബന്ധപ്പെടുക.'
        );
      } else {
        response = getText(
          'I am here to help! You can ask questions on:\n• Scheme eligibility\n• Application process\n• Required documents\n• Helpline numbers\n• Scheme benefits\n\nPlease ask your question clearly.',
          'मैं आपकी मदद के लिए यहाँ हूँ! आप निम्न विषयों पर प्रश्न पूछ सकते हैं:\n• योजनाओं की पात्रता\n• आवेदन प्रक्रिया\n• आवश्यक दस्तावेज\n• हेल्पलाइन नंबर\n• योजना के लाभ\n\nकृपया अपना प्रश्न स्पष्ट रूप से पूछें।',
          'मी इथे मदतीसाठी आहे! तुम्ही खालील विषयांवर प्रश्न विचारू शकता:\n• योजनांची पात्रता\n• अर्ज प्रक्रिया\n• आवश्यक दस्तऐवज\n• हेल्पलाइन क्रमांक\n• योजनांचे फायदे\n\nकृपया तुमचा प्रश्न स्पष्टपणे विचारा.',
          'હું મદદ કરવા માટે અહીં છું! તમે નીચેના વિષયો પર પ્રશ્નો પૂછી શકો છો:\n• યોજનાની પાત્રતા\n• અરજી પ્રક્રિયા\n• જરૂરી દસ્તાવેજો\n• હેલ્પલાઇન નંબર\n• યોજનાના લાભ\n\nકૃપા કરીને તમારો પ્રશ્ન સ્પષ્ટપણે પૂછો.',
          'ഞാൻ സഹായിക്കാൻ ഇവിടെയാണ്! നിങ്ങൾ ചോദിക്കാവുന്ന വിഷയങ്ങൾ:\n• സ്കീം യോഗ്യത\n• അപേക്ഷ പ്രക്രിയ\n• ആവശ്യമായ ഡോക്യുമെന്റുകൾ\n• ഹെൽപ്‌ലൈൻ നമ്പറുകൾ\n• സ്കീം പ്രയോജനങ്ങൾ\n\nനിങ്ങളുടെ ചോദ്യം വ്യക്തമായി ചോദിക്കുക.'
        );
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

  // Scheme detail modal
  const openSchemeDetail = (scheme) => {
    setSelectedScheme(scheme)
  }

  // Close detail
  const closeSchemeDetail = () => {
    setSelectedScheme(null)
  }

  // Application form handler
  const handleApplicationStep = (step, value) => {
    setApplicationData(prev => ({ ...prev, [step]: value }))
  }

  const submitApplication = () => {
    // Simulate submission
    alert(getText('Application submitted successfully! Tracking number: APP-', 'आवेदन सफलतापूर्वक जमा किया गया! ट्रैकिंग नंबर: APP-', 'अर्ज यशस्वीरित्या सादर केला! ट्रॅकिंग नंबर: APP-', 'અરજી સફળતાપૂર્વક સબમિટ કરવામાં આવી! ટ્રેકિંગ નંબર: APP-', 'അപേക്ഷ വിജയകരമായി സമർപ്പിച്ചു! ട്രാക്കിംഗ് നമ്പർ: APP-') + Math.random().toString(36).substring(7).toUpperCase())
    setShowApplicationForm(false)
    setApplicationData({})
  }

  const resetFilters = () => {
    setSearchTerm('')
    setSelectedCategory('all')
    setSelectedState('all')
    resetEligibility()
  }

  const schemesStats = [
    { label: getText('Total Schemes', 'कुल योजनाएं', 'एकूण योजना', 'કુલ યોજનાઓ', 'ആകെ സ്കീമുകൾ'), value: schemes.length, icon: Target, color: 'text-blue-600' },
    { label: getText('Active Schemes', 'सक्रिय योजनाएं', 'सक्रिय योजना', 'સક્રિય યોજનાઓ', 'സജീവ സ്കീമുകൾ'), value: schemes.filter(s => s.schemeStatus === 'active').length, icon: CheckCircle2, color: 'text-green-600' },
    { label: getText('API Schemes', 'API योजनाएं', 'API योजना', 'API યોજનાઓ', 'API സ്കീമുകൾ'), value: apiStats.api1 + apiStats.api2 + apiStats.api3, icon: Globe, color: 'text-purple-600' },
    { label: getText('Eligible Schemes', 'पात्र योजनाएं', 'पात्र योजना', 'પાત્ર યોજનાઓ', 'യോഗ്യ സ്കീമുകൾ'), value: userProfile.checkedEligibility ? filteredSchemes.length : getText('Check', 'जांचें', 'तपासा', 'ચેક કરો', 'പരിശോധിക്കുക'), icon: UserCheck, color: 'text-orange-600' },
  ]

  const getApiSourceColor = (apiSource) => {
    switch(apiSource) {
      case 'api1': return 'border-l-purple-500'
      case 'api2': return 'border-l-orange-500'
      case 'api3': return 'border-l-green-500'
      case 'fallback': return 'border-l-red-500'
      default: return 'border-l-gray-500'
    }
  }

  const getApiSourceBadge = (apiSource) => {
    switch(apiSource) {
      case 'api1': return { text: getText('Central Govt', 'केंद्र सरकार', 'केंद्रीय सरकार', 'કેન્દ્રીય સરકાર', 'കേന്ദ്ര സർക്കാർ'), color: 'bg-purple-100 text-purple-800' }
      case 'api2': return { text: getText('Agri Census', 'कृषि जनगणना', 'कृषी जनगणना', 'કૃષિ ગણતરી', 'കൃഷി സെൻസസ്'), color: 'bg-orange-100 text-orange-800' }
      case 'api3': return { text: getText('State Schemes', 'राज्य योजनाएं', 'राज्य योजना', 'રાજ્ય યોજનાઓ', 'സംസ്ഥാന സ്കീമുകൾ'), color: 'bg-green-100 text-green-800' }
      case 'fallback': return { text: getText('Demo Scheme', 'डेमो योजना', 'डेमो योजना', 'ડેમો યોજના', 'ഡെമോ സ്കീം'), color: 'bg-red-100 text-red-800' }
      default: return { text: getText('Govt Scheme', 'सरकारी योजना', 'सरकारी योजना', 'સરકારી યોજના', 'സർക്കാർ സ്കീം'), color: 'bg-gray-100 text-gray-800' }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">{getText('Loading government schemes information...', 'सरकारी योजनाओं की जानकारी लाई जा रही है...', 'सरकारी योजनांची माहिती लोड होत आहे...', 'સરકારી યોજનાઓની માહિતી લાવવામાં આવી રહી છે...', 'സർക്കാർ സ്കീമുകളുടെ വിവരങ്ങൾ ലോഡ് ചെയ്യുന്നു...')}</h2>
          <p className="text-gray-600">{getText('Please wait, we are fetching latest schemes data from three government APIs', 'कृपया प्रतीक्षा करें, हम तीन सरकारी APIs से नवीनतम योजनाओं का डेटा प्राप्त कर रहे हैं', 'कृपया वाट पाहा, आम्ही तीन सरकारी APIs वरून नवीनतम योजनांचा डेटा मिळवत आहोत', 'કૃપા કરીને રાહ જુઓ, અમે ત્રણ સરકારી APIs માંથી તાજેતરની યોજનાઓના ડેટા મેળવી રહ્યા છીએ', 'ദയവായി കാത്തിരിക്കുക, ഞങ്ങൾ മൂന്ന് സർക്കാർ APIകളിൽ നിന്ന് ഏറ്റവും പുതിയ സ്കീമുകളുടെ ഡാറ്റ ഫെച്ച് ചെയ്യുന്നു')}</p>
          <div className="mt-4 flex justify-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
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
            <Database className="h-8 w-8 text-green-600 mr-2" />
            <h1 className="text-4xl font-bold text-slate-900">{t('governmentSchemesPortal')}</h1>
          </div>
          <p className="text-xl text-slate-600 font-medium">
            {t('centralStateSchemes')}
          </p>
          <p className="text-sm text-slate-500 mt-2">
            {getText('Data Source', 'डेटा स्रोत', 'डेटा स्रोत', 'ડેટા સ્ત્રોત', 'ഡാറ്റ സോഴ്സ്')}: {dataSource === 'api' ? getText('All three government APIs', 'तीनों सरकारी APIs', 'तीन सर्व सरकारी APIs', 'તમામ ત્રણ સરકારી APIs', 'മൂന്ന് സർക്കാർ APIകൾ') : dataSource === 'fallback' ? getText('Demo Data', 'डेमो डेटा', 'डेमो डेटा', 'ડેમો ડેટા', 'ഡെമോ ഡാറ്റ') : dataSource === 'error' ? getText('API Error', 'API त्रुटि', 'API त्रुटी', 'API ભૂલ', 'API പിശക്') : getText('Loading...', 'लोड हो रहा है...', 'लोड होत आहे...', 'લોડ થઈ રહ્યું છે...', 'ലോഡ് ചെയ്യുന്നു...')}
            {dataSource !== 'loading' && ` | ${getText('Total Schemes', 'कुल योजनाएं', 'एकूण योजना', 'કુલ યોજનાઓ', 'ആകെ സ്കീമുകൾ')}: ${schemes.length} | ${getText('Displayed Schemes', 'प्रदर्शित योजनाएं', 'दाखवलेल्या योजना', 'પ્રદર્શિત યોજનાઓ', 'പ്രദർശിപ്പിച്ച സ്കീമുകൾ')}: ${filteredSchemes.length}`}
            {userProfile.checkedEligibility && ` | ${getText('Eligibility-based filter active', 'पात्रता आधारित फ़िल्टर सक्रिय', 'पात्रता आधारित फिल्टर सक्रिय', 'પાત્રતા આધારિત ફિલ્ટર સક્રિય', 'യോഗ്യത അധിഷ്ഠിത ഫിൽട്ടർ സജീവം')}`}
          </p>
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <div>
                  <p className="text-red-700 font-medium">{getText('Error: Problem fetching data', 'त्रुटि: डेटा प्राप्त करने में समस्या', 'त्रुटी: डेटा मिळवण्यात समस्या', 'ભૂલ: ડેટા મેળવવામાં સમસ્યા', 'പിശക്: ഡാറ്റ ഫെച്ച് ചെയ്യുമ്പോൾ പ്രശ്നം')}</p>
                  <p className="text-red-600 text-sm mt-1">{error}</p>
                </div>
                <button
                  onClick={fetchSchemes}
                  className="ml-4 flex items-center text-red-600 hover:text-red-700"
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  {getText('Retry', 'पुनः प्रयास', 'पुन्हा प्रयत्न', 'પુનઃ પ્રયાસ', 'പുനഃപ്രയത്നിക്കുക')}
                </button>
              </div>
            </div>
          )}
          {filteredSchemes.length === 0 && schemes.length > 0 && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
                <p className="text-yellow-700">{getText('No schemes are being displayed. May be due to search or filter.', 'कोई योजना प्रदर्शित नहीं हो रही है। खोज या फ़िल्टर के कारण हो सकता है।', 'कोणतीही योजना दाखवली जात नाही. शोध किंवा फिल्टरमुळे असू शकते.', 'કોઈ યોજના દર્શાવવામાં આવી નથી. શોધ અથવા ફિલ્ટરને કારણે હોઈ શકે.', 'ഒരു സ്കീമും പ്രദർശിപ്പിക്കുന്നില്ല. തിരയൽ അല്ലെങ്കിൽ ഫിൽട്ടർ കാരണമായിരിക്കാം.')}</p>
                <button
                  onClick={resetFilters}
                  className="ml-4 flex items-center text-yellow-600 hover:text-yellow-700"
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  {getText('Reset Filters', 'फ़िल्टर रीसेट करें', 'फिल्टर्स रीसेट करा', 'ફિલ્ટર્સ રીસેટ કરો', 'ഫിൽട്ടറുകൾ റീസെറ്റ് ചെയ്യുക')}
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
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-5 gap-4">
            <div className="xl:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder={getText("Search schemes (name, description, state, benefits, ministry)...", "योजना खोजें (नाम, विवरण, राज्य, लाभ, मंत्रालय)...", "योजना शोधा (नाव, वर्णन, राज्य, फायदे, मंत्रालय)...", "યોજનાઓ શોધો (નામ, વર્ણન, રાજ્ય, લાભ, મંત્રાલય)...", "സ്കീമുകൾ തിരയുക (പേര്, വിവരണം, സംസ്ഥാനം, പ്രയോജനങ്ങൾ, മന്ത്രാലയം)...")}
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-slate-900"
              >
                <option value="all">{getText('All Categories', 'सभी श्रेणियां', 'सर्व श्रेणी', 'બધી કેટેગરીઝ', 'എല്ലാ വിഭാഗങ്ങളും')}</option>
                {schemeCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-gray-600" />
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-slate-900"
              >
                {stateOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <button
                onClick={resetFilters}
                className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg flex items-center justify-center text-gray-700"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                {getText('Reset', 'रीसेट', 'रीसेट', 'રીસેટ', 'റീസെറ്റ്')}
              </button>
            </div>
          </div>
          
          {/* Eligibility Status */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-green-600" />
                <span className="text-sm text-gray-700">
                  {userProfile.checkedEligibility 
                    ? `${getText('Eligibility filter active:', 'पात्रता फ़िल्टर सक्रिय:', 'पात्रता फिल्टर सक्रिय:', 'પાત્રતા ફિલ્ટર સક્રિય:', 'യോഗ്യത ഫിൽട്ടർ സജീവം:')} ${getIncomeLevel(userProfile.income)} ${getText('income,', 'आय,', 'उत्पन्न,', 'આવક,', 'വരുമാനം,')} ${getLandLevel(userProfile.landOwnership)} ${getText('land', 'भूमि', 'जमीन', 'જમીન', 'നിലം')}`
                    : getText('Check eligibility and see only suitable schemes for you', 'पात्रता जांचें और केवल अपने लिए उपयुक्त योजनाएं देखें', 'पात्रता तपासा आणि फक्त तुमच्यासाठी योग्य योजना पहा', 'પાત્રતા તપાસો અને માત્ર તમારા માટે યોગ્ય યોજનાઓ જુઓ', 'യോഗ്യത പരിശോധിക്കുകയും നിങ്ങൾക്ക് അനുയോജ്യമായ സ്കീമുകൾ മാത്രം കാണുക')
                  }
                </span>
              </div>
              <div className="flex gap-2">
                {userProfile.checkedEligibility ? (
                  <button
                    onClick={resetEligibility}
                    className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm"
                  >
                    {getText('Remove Eligibility Filter', 'पात्रता फ़िल्टर हटाएं', 'पात्रता फिल्टर काढा', 'પાત્રતા ફિલ્ટર દૂર કરો', 'യോഗ്യത ഫിൽട്ടർ നീക്കം ചെയ്യുക')}
                  </button>
                ) : null}
                <button
                  onClick={() => setShowEligibilityModal(true)}
                  className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm flex items-center"
                >
                  <UserCheck className="h-4 w-4 mr-1" />
                  {getText('Check Eligibility', 'पात्रता जांचें', 'पात्रता तपासा', 'પાત્રતા તપાસો', 'യോഗ്യത പരിശോധിക്കുക')}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">{getText('Support Services', 'सहायक सेवाएं', 'सहाय्य सेवा', 'સહાયક સેવાઓ', 'സപ്പോർട്ട് സർവീസുകൾ')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action) => {
              const IconComponent = action.icon
              
              return (
                <div 
                  key={action.id} 
                  className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer bg-white/80 backdrop-blur-sm rounded-lg p-6"
                  onClick={() => {
                    if (action.id === 'eligibility-checker') {
                      setShowEligibilityModal(true)
                    } else if (action.id === 'application-helper') {
                      setShowChatbot(true)
                      setChatMessages([{
                        type: 'ai',
                        message: getText(
                          'Hello! I can help you with applying for government schemes. Please tell me:\n1. Which scheme do you want to apply for?\n2. Have you prepared any documents already?\n3. Do you need help with any specific step?',
                          'नमस्ते! मैं आपको सरकारी योजनाओं के लिए आवेदन करने में मदद कर सकता हूँ। कृपया बताएं:\n1. आप किस योजना के लिए आवेदन करना चाहते हैं?\n2. क्या आपने पहले से कोई दस्तावेज तैयार किए हैं?\n3. क्या आपको किसी विशेष चरण में सहायता चाहिए?',
                          'नमस्कार! मी तुम्हाला सरकारी योजनांसाठी अर्ज करण्यात मदत करू शकतो. कृपया सांगा:\n1. तुम्ही कोणत्या योजनेसाठी अर्ज करू इकशील?\n2. तुम्ही आधीच काही दस्तऐवज तयार केले आहेत का?\n3. तुम्हाला कोणत्याही विशिष्ट पायरीत मदत हवी आहे का?',
                          'નમસ્તે! હું તમને સરકારી યોજનાઓ માટે અરજી કરવામાં મદદ કરી શકું છું. કૃપા કરીને કહો:\n1. તમે કયા યોજના માટે અરજી કરવા માંગો છો?\n2. શું તમે પહેલેથી જ કોઈ દસ્તાવેજો તૈયાર કર્યા છે?\n3. શું તમને કોઈ વિશેષ પગલામાં મદદની જરૂર છે?',
                          'നമസ്കാരം! ഞാൻ സർക്കാർ സ്കീമുകൾക്കായുള്ള അപേക്ഷയിൽ സഹായിക്കാം. ദയവായി പറയൂ:\n1. ഏത് സ്കീമിനാണ് അപേക്ഷിക്കാൻ ആഗ്രഹിക്കുന്നത്?\n2. ഏതെങ്കിലും ഡോക്യുമെന്റുകൾ ഇതിനകം തയ്യാറാക്കിയിട്ടുണ്ടോ?\n3. ഏതെങ്കിലും പ്രത്യേക ഘട്ടത്തിൽ സഹായം ആവശ്യമുണ്ടോ?'
                        )
                      }])
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
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900">
              {userProfile.checkedEligibility ? getText('Suitable Schemes for You', 'आपके लिए उपयुक्त योजनाएं', 'तुमच्यासाठी योग्य योजना', 'તમારા માટે યોગ્ય યોજનાઓ', 'നിങ്ങൾക്ക് അനുയോജ്യമായ സ്കീമുകൾ') : getText('Available Schemes', 'उपलब्ध योजनाएं', 'उपलब्ध योजना', 'ઉપલબ્ધ યોજનાઓ', 'ലഭ്യമായ സ്കീമുകൾ')} ({filteredSchemes.length})
            </h2>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-purple-500 rounded-full mr-1"></div>
                <span>{getText('Central Govt', 'केंद्र सरकार', 'केंद्रीय सरकार', 'કેન્દ્રીય સરકાર', 'കേന്ദ്ര സർക്കാർ')}</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-orange-500 rounded-full mr-1"></div>
                <span>{getText('Agri Census', 'कृषि जनगणना', 'कृषी जनगणना', 'કૃષિ ગણતરી', 'കൃഷി സെൻസസ്')}</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                <span>{getText('State Schemes', 'राज्य योजनाएं', 'राज्य योजना', 'રાજ્ય યોજનાઓ', 'സംസ്ഥാന സ്കീമുകൾ')}</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
                <span>{getText('Demo Schemes', 'डेमो योजनाएं', 'डेमो योजना', 'ડેમો યોજનાઓ', 'ഡെമോ സ്കീമുകൾ')}</span>
              </div>
            </div>
          </div>
          
          {filteredSchemes.length === 0 && schemes.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-8 text-center shadow-sm">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{getText('No Schemes Found', 'कोई योजना नहीं मिली', 'कोणतीही योजना सापडली नाही', 'કોઈ યોજના મળી નથી', 'സ്കീമുകൾ കണ്ടെത്തിയില്ല')}</h3>
              <p className="text-slate-600">{getText('Data not available from API. Please try again later.', 'API से डेटा प्राप्त नहीं हो पा रहा है। कृपया बाद में पुनः प्रयास करें।', 'API मधून डेटा उपलब्ध नाही. कृपया नंतर पुन्हा प्रयत्न करा.', 'API માંથી ડેટા ઉપલબ્ધ નથી. કૃપા કરીને પછીથી પુનઃ પ્રયાસ કરો.', 'APIൽ നിന്ന് ഡാറ്റ ലഭ്യമല്ല. പിന്നീട് വീണ്ടും ശ്രമിക്കുക.')}</p>
              <button
                onClick={fetchSchemes}
                className="mt-4 inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                {getText('Retry', 'पुनः प्रयास करें', 'पुन्हा प्रयत्न करा', 'પુનઃ પ્રયાસ કરો', 'പിന്നീട് വീണ്ടും ശ്രമിക്കുക')}
              </button>
            </div>
          ) : filteredSchemes.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-8 text-center shadow-sm">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {userProfile.checkedEligibility ? getText('No schemes match your eligibility', 'आपकी पात्रता के अनुसार कोई योजना नहीं मिली', 'तुमच्या पात्रतेनुसार कोणतीही योजना नाही', 'તમારી પાત્રતા સાથે મેળ ખાતી કોઈ યોજના નથી', 'നിങ്ങളുടെ യോഗ്യതയുമായി പൊരുത്തപ്പെടുന്ന സ്കീമുകൾ ഇല്ല') : getText('No Schemes Found', 'कोई योजना नहीं मिली', 'कोणतीही योजना सापडली नाही', 'કોઈ યોજના મળી નથી', 'സ്കീമുകൾ കണ്ടെത്തിയില്ല')}
              </h3>
              <p className="text-slate-600">
                {userProfile.checkedEligibility 
                  ? getText('Please modify your eligibility check or view all schemes.', 'कृपया अपनी पात्रता जांच को संशोधित करें या सभी योजनाएं देखें।', 'कृपया तुमची पात्रता तपास सुधारा किंवा सर्व योजना पहा.', 'કૃપા કરીને તમારી પાત્રતા તપાસ સુધારો અથવા બધી યોજનાઓ જુઓ.', 'നിങ്ങളുടെ യോഗ്യത പരിശോധന മാറ്റുക അല്ലെങ്കിൽ എല്ലാ സ്കീമുകളും കാണുക.')
                  : getText('Please modify your search or select other category/state.', 'कृपया अपनी खोज को संशोधित करें या अन्य श्रेणी/राज्य का चयन करें।', 'कृपया तुमचा शोध सुधारा किंवा इतर श्रेणी/राज्य निवडा.', 'કૃપા કરીને તમારો શોધ સુધારો અથવા અન્ય કેટેગરી/રાજ્ય પસંદ કરો.', 'നിങ്ങളുടെ തിരയൽ മാറ്റുക അല്ലെങ്കിൽ മറ്റൊരു വിഭാഗം/സംസ്ഥാനം തിരഞ്ഞെടുക്കുക.')
                }
              </p>
              <div className="mt-4 flex gap-2 justify-center">
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {userProfile.checkedEligibility ? getText('View All Schemes', 'सभी योजनाएं देखें', 'सर्व योजना पहा', 'બધી યોજનાઓ જુઓ', 'എല്ലാ സ്കീമുകളും കാണുക') : getText('Reset Filters', 'फ़िल्टर रीसेट करें', 'फिल्टर्स रीसेट करा', 'ફિલ્ટર્સ રીસેટ કરો', 'ഫിൽട്ടറുകൾ റീസെറ്റ് ചെയ്യുക')}
                </button>
                {userProfile.checkedEligibility && (
                  <button
                    onClick={() => setShowEligibilityModal(true)}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                  >
                    <UserCheck className="h-4 w-4 mr-2" />
                    {getText('Change Eligibility', 'पात्रता बदलें', 'पात्रता बदला', 'પાત્રતા બદલો', 'യോഗ്യത മാറ്റുക')}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredSchemes.map((scheme) => {
                const apiSourceBadge = getApiSourceBadge(scheme.apiSource)
                const category = schemeCategories.find(c => c.id === scheme.category)
                const categoryName = category ? category.name : getText('Other', 'अन्य', 'इतर', 'અન્ય', 'മറ്റ്')
                const statusText = scheme.schemeStatus === 'active' ? getText('Active', 'सक्रिय', 'सक्रिय', 'સક્રિય', 'സജീവം') : getText('Inactive', 'निष्क्रिय', 'निष्क्रिय', 'નિષ્ક્રિય', 'നിഷ്ക്രിയം')
                const eligibleText = getText('Eligible', 'पात्र', 'पात्र', 'પાત્ર', 'യോഗ്യ')
                
                return (
                  <div 
                    key={scheme.id} 
                    className={`hover:shadow-lg transition-shadow bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border-l-4 ${getApiSourceColor(scheme.apiSource)}`}
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-xl font-bold text-slate-900 mb-2">{scheme.schemeName}</h3>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${apiSourceBadge.color}`}>
                              {apiSourceBadge.text}
                            </span>
                          </div>
                          <p className="text-base text-slate-600">{scheme.schemeObjective}</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            scheme.category === 'income-support' ? 'bg-green-100 text-green-800' :
                            scheme.category === 'insurance' ? 'bg-blue-100 text-blue-800' :
                            scheme.category === 'credit' ? 'bg-purple-100 text-purple-800' :
                            scheme.category === 'irrigation' ? 'bg-cyan-100 text-cyan-800' :
                            scheme.category === 'training' ? 'bg-pink-100 text-pink-800' :
                            'bg-orange-100 text-orange-800'
                          }`}>
                            {categoryName}
                          </span>
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {getStateLabel(scheme.state)}
                          </span>
                          {scheme.schemeStatus === 'active' ? (
                            <span className="flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              {statusText}
                            </span>
                          ) : (
                            <span className="flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <Clock className="h-3 w-3 mr-1" />
                              {statusText}
                            </span>
                          )}
                          {userProfile.checkedEligibility && (
                            <span className="flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <UserCheck className="h-3 w-3 mr-1" />
                              {eligibleText}
                            </span>
                          )}
                        </div>

                        <div>
                          <h4 className="font-medium text-slate-900 mb-2 flex items-center">
                            <Target className="h-4 w-4 mr-2 text-green-600" />
                            {getText('Main Benefits:', 'मुख्य लाभ:', 'मुख्य फायदे:', 'મુખ્ય લાભ:', 'പ്രധാന പ്രയോജനങ്ങൾ:')}
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
                            <p><strong>{getText('Ministry/Department:', 'मंत्रालय/विभाग:', 'मंत्रालय/विभाग:', 'મંત્રાલય/વિભાગ:', 'മന്ത്രാലയം/വകുപ്പ്:')} </strong> {scheme.sponsorMinistry}</p>
                          )}
                          {scheme.schemeIntroducedYear && scheme.schemeIntroducedYear !== 'N/A' && (
                            <p><strong>{getText('Start Year:', 'शुरुआत वर्ष:', 'सुरू वर्ष:', 'શરૂઆતનું વર્ષ:', 'തുടക്ക വർഷം:')} </strong> {scheme.schemeIntroducedYear}</p>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <button 
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center"
                            onClick={() => openSchemeDetail(scheme)}
                          >
                            {getText('View Scheme Details', 'योजना विवरण देखें', 'योजना तपशील पहा', 'યોજના વિગતો જુઓ', 'സ്കീം വിശദാംശങ്ങൾ കാണുക')}
                            <ChevronRight className="ml-2 h-4 w-4" />
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
                              {getText('View Official Website', 'आधिकारिक वेबसाइट देखें', 'अधिकृत वेबसाइट पहा', 'અધિકૃત વેબસાઇટ જુઓ', 'ഔദ്യോഗിക വെബ്സൈറ്റ് കാണുക')}
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Eligibility Check Modal */}
        {showEligibilityModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg w-full max-w-md max-h-[80vh] overflow-y-auto">
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold text-slate-900">{getText('Eligibility Check', 'पात्रता जांच', 'पात्रता तपास', 'પાત્રતા તપાસ', 'യോഗ്യത പരിശോധന')}</h2>
                <p className="text-sm text-gray-600 mt-1">{getText('Enter your information and see only suitable schemes', 'अपनी जानकारी दर्ज करें और केवल उपयुक्त योजनाएं देखें', 'तुमची माहिती प्रविष्ट करा आणि फक्त योग्य योजना पहा', 'તમારી માહિતી દાખલ કરો અને માત્ર યોગ્ય યોજનાઓ જુઓ', 'നിങ്ങളുടെ വിവരങ്ങൾ നൽകി യോഗ്യമായ സ്കീമുകൾ മാത്രം കാണുക')}</p>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {getText('Annual Income (₹)', 'वार्षिक आय (₹ में)', 'वार्षिक उत्पन्न (₹ मध्ये)', 'વાર્ષિક આવક (₹ માં)', 'വാർഷിക വരുമാനം (₹)')}
                  </label>
                  <input
                    type="number"
                    placeholder="150000"
                    value={userProfile.income || ''}
                    onChange={(e) => setUserProfile(prev => ({ ...prev, income: parseInt(e.target.value) || 0 }))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <div className="mt-2 space-y-1">
                    {incomeLevels.map(level => (
                      <div key={level.id} className="flex items-center text-xs text-gray-600">
                        <div className={`w-2 h-2 rounded-full mr-2 ${
                          userProfile.income <= level.maxIncome ? 'bg-green-500' : 'bg-gray-300'
                        }`}></div>
                        {level.name}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {getText('Land Ownership (hectares)', 'भूमि स्वामित्व (हेक्टेयर में)', 'जमिनी मालकी (हेक्टर मध्ये)', 'જમીન માલિકી (હેક્ટરમાં)', 'നിലം സ്വത്തവകാശം (ഹെക്ടർ)')}
                  </label>
                  <input
                    type="number"
                    placeholder="2.5"
                    step="0.1"
                    value={userProfile.landOwnership || ''}
                    onChange={(e) => setUserProfile(prev => ({ ...prev, landOwnership: parseFloat(e.target.value) || 0 }))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <div className="mt-2 space-y-1">
                    {landOwnershipOptions.map(option => (
                      <div key={option.id} className="flex items-center text-xs text-gray-600">
                        <div className={`w-2 h-2 rounded-full mr-2 ${
                          userProfile.landOwnership <= option.maxLand ? 'bg-green-500' : 'bg-gray-300'
                        }`}></div>
                        {option.name}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {getText('State', 'राज्य', 'राज्य', 'રાજ્ય', 'സംസ്ഥാനം')}
                  </label>
                  <select
                    value={userProfile.state}
                    onChange={(e) => setUserProfile(prev => ({ ...prev, state: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">{getText('Select State', 'राज्य चुनें', 'राज्य निवडा', 'રાજ્ય પસંદ કરો', 'സംസ്ഥാനം തിരഞ്ഞെടുക്കുക')}</option>
                    {stateOptions.filter(option => option.value !== 'all').map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
                
                <div className="flex gap-2 pt-4">
                  <button
                    onClick={() => setShowEligibilityModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors"
                  >
                    {getText('Cancel', 'रद्द करें', 'रद्द करा', 'રદ કરો', 'റദ്ദാക്കുക')}
                  </button>
                  <button
                    onClick={() => handleEligibilityCheck(userProfile)}
                    disabled={!userProfile.income || !userProfile.landOwnership}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    {getText('Check Eligibility', 'पात्रता जांचें', 'पात्रता तपासा', 'પાત્રતા તપાસો', 'യോഗ്യത പരിശോധിക്കുക')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-700">
            {getText('This information is obtained from APIs of the Ministry of Agriculture, Cooperation and Farmers Welfare.', 'यह जानकारी कृषि, सहकारिता और किसान कल्याण मंत्रालय के APIs से प्राप्त की गई है।', 'ही माहिती कृषी, सहकार्य आणि शेतकरी कल्याण मंत्रालयाच्या APIs वरून मिळाली आहे.', 'આ માહિતી કૃષિ, સહકાર અને ખેડૂત કલ્યાણ મંત્રાલયની APIs માંથી મેળવવામાં આવી છે.', 'ഈ വിവരങ്ങൾ കൃഷി, സഹകരണം, കർഷക ക്ഷേമ മന്ത്രാലയത്തിന്റെ APIകളിൽ നിന്ന് ലഭിച്ചതാണ്.')}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {getText('Last Updated', 'अंतिम अपडेट', 'शेवटचा अपडेट', 'છેલ્લો અપડેટ', 'അവസാന അപ്ഡേറ്റ്')}: {new Date().toLocaleDateString(language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : language === 'gu' ? 'gu-IN' : language === 'ml' ? 'ml-IN' : 'en-IN')} | 
            {getText('API Schemes', 'API योजनाएं', 'API योजना', 'API યોજનાઓ', 'API സ്കീമുകൾ')}: {apiStats.api1 + apiStats.api2 + apiStats.api3} | 
            {getText('Demo Schemes', 'डेमो योजनाएं', 'डेमो योजना', 'ડેમો યોજનાઓ', 'ഡെമോ സ്കീമുകൾ')}: {apiStats.fallback} | 
            {getText('Total Schemes', 'कुल योजनाएं', 'एकूण योजना', 'કુલ યોજનાઓ', 'ആകെ സ്കീമുകൾ')}: {schemes.length} |
            {getText('Version', 'संस्करण', 'आवृत्ती', 'આવૃત્તિ', 'പതിപ്പ്')}: 7.0.0
          </p>
        </div>
      </div>
    </div>
  )
}