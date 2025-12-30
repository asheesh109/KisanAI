'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  CreditCard, User, FileText, Building, CheckCircle, Clock, Phone, 
  MessageCircle, Send, Bot, UserCheck, Download, Calculator,
  Search, Filter, ChevronRight, AlertCircle, Loader2,
  Globe, DollarSign, LandPlot, Home, MapPin, Database, TrendingUp,
  Users, Target, Calendar, Bell, ExternalLink, Shield, Coins, Leaf, Info
} from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

// Gemini API Key
const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY

// Translations object for all static texts (self-contained, no external i18n dependency for these)
const translations = {
  en: {
    kisanCreditCard: 'Kisan Credit Card',
    kccTagline: 'Timely Credit, Prosperous Farmers',
    application: 'Application',
    information: 'Information',
    queries: 'Queries',
    calculator: 'Calculator',
    startNewApplication: 'Start New Application',
    followStepsToComplete: 'Follow these steps to complete your application',
    startApplication: 'Start Application',
    downloadForm: 'Download Form',
    orVisitNearestBank: 'Or visit nearest bank branch',
    checkApplicationStatus: 'Check Application Status',
    contactBankOrHelplineForStatus: 'Contact your bank or use helpline for status updates',
    enterApplicationNumber: 'Enter Application Number',
    checkStatus: 'Check Status',
    viaPMKisanPortal: 'via PM Kisan Portal',
    orCallHelpline: 'Or call helpline',
    eligibilityCriteria: 'Eligibility Criteria',
    requiredDocuments: 'Required Documents',
    faq: 'Frequently Asked Questions',
    helpSupport: 'Help & Support',
    farmerHelpline: 'Farmer Helpline',
    emailSupport: 'Email Support',
    downloadForms: 'Download Forms',
    officialKCCFormFromPMKisan: 'Official KCC Form from PM Kisan',
    kccLoanCalculator: 'KCC Loan Calculator',
    loanAmount: 'Loan Amount',
    example: 'Example',
    tenure: 'Tenure',
    years: 'Years',
    calculate: 'Calculate',
    results: 'Results',
    monthlyInstallment: 'Monthly Installment',
    totalInterest: 'Total Interest',
    totalAmount: 'Total Amount',
    kccProcessTime: 'KCC processing takes 7-14 working days',
    kccAssistant: 'KCC Assistant',
    kccAssistantDesc: 'AI assistant for all your KCC related queries',
    helloKCCAssistant: 'Hello KCC Assistant',
    askKCCQuestions: 'Ask KCC related questions',
    typeYourQuestionHere: 'Type your question here',
    kccHelpText: 'Your privacy matters. This chat is secure.',
    answerComing: 'Answer coming soon...',
    fallbackNotification: 'Using sample response due to temporary connectivity issues. Please ensure a stable network connection for accurate AI assistance.'
  },
  hi: {
    kisanCreditCard: 'किसान क्रेडिट कार्ड',
    kccTagline: 'समय पर ऋण, समृद्ध किसान',
    application: 'आवेदन',
    information: 'जानकारी',
    queries: 'प्रश्न',
    calculator: 'कैलकुलेटर',
    startNewApplication: 'नया आवेदन शुरू करें',
    followStepsToComplete: 'अपने आवेदन को पूरा करने के लिए इन चरणों का पालन करें',
    startApplication: 'आवेदन शुरू करें',
    downloadForm: 'फॉर्म डाउनलोड करें',
    orVisitNearestBank: 'या निकटतम बैंक शाखा पर जाएं',
    checkApplicationStatus: 'आवेदन स्थिति जांचें',
    contactBankOrHelplineForStatus: 'स्थिति अपडेट के लिए अपने बैंक से संपर्क करें या हेल्पलाइन का उपयोग करें',
    enterApplicationNumber: 'आवेदन संख्या दर्ज करें',
    checkStatus: 'स्थिति जांचें',
    viaPMKisanPortal: 'पीएम किसान पोर्टल के माध्यम से',
    orCallHelpline: 'या हेल्पलाइन पर कॉल करें',
    eligibilityCriteria: 'पात्रता मानदंड',
    requiredDocuments: 'आवश्यक दस्तावेज',
    faq: 'अक्सर पूछे जाने वाले प्रश्न',
    helpSupport: 'सहायता और समर्थन',
    farmerHelpline: 'किसान हेल्पलाइन',
    emailSupport: 'ईमेल समर्थन',
    downloadForms: 'फॉर्म डाउनलोड करें',
    officialKCCFormFromPMKisan: 'पीएम किसान से आधिकारिक KCC फॉर्म',
    kccLoanCalculator: 'KCC ऋण कैलकुलेटर',
    loanAmount: 'ऋण राशि',
    example: 'उदाहरण',
    tenure: 'अवधि',
    years: 'वर्ष',
    calculate: 'गणना करें',
    results: 'परिणाम',
    monthlyInstallment: 'मासिक किस्त',
    totalInterest: 'कुल ब्याज',
    totalAmount: 'कुल राशि',
    kccProcessTime: 'KCC प्रक्रिया में 7-14 कार्य दिवस लगते हैं',
    kccAssistant: 'KCC सहायक',
    kccAssistantDesc: 'आपकी KCC संबंधी सभी प्रश्नों के लिए AI सहायक',
    helloKCCAssistant: 'नमस्ते KCC सहायक',
    askKCCQuestions: 'KCC से संबंधित प्रश्न पूछें',
    typeYourQuestionHere: 'अपना प्रश्न यहां टाइप करें',
    kccHelpText: 'आपकी गोपनीयता महत्वपूर्ण है। यह चैट सुरक्षित है।',
    answerComing: 'उत्तर जल्द आ रहा है...',
    fallbackNotification: 'अस्थायी कनेक्टिविटी समस्याओं के कारण नमूना प्रतिक्रिया का उपयोग किया जा रहा है। सटीक AI सहायता के लिए कृपया स्थिर नेटवर्क कनेक्शन सुनिश्चित करें।'
  },
  mr: {
    kisanCreditCard: 'किसान क्रेडिट कार्ड',
    kccTagline: 'वेळेवर कर्ज, समृद्ध शेतकरी',
    application: 'अर्ज',
    information: 'माहिती',
    queries: 'प्रश्न',
    calculator: 'कॅल्क्युलेटर',
    startNewApplication: 'नवीन अर्ज सुरू करा',
    followStepsToComplete: 'तुमच्या अर्ज पूर्ण करण्यासाठी या स्टेप्सचा अवलंब करा',
    startApplication: 'अर्ज सुरू करा',
    downloadForm: 'फॉर्म डाउनलोड करा',
    orVisitNearestBank: 'किंवा जवळील बँक शाखेला भेट द्या',
    checkApplicationStatus: 'अर्ज स्थिती तपासा',
    contactBankOrHelplineForStatus: 'स्थिती अपडेटसाठी तुमच्या बँकेला संपर्क साधा किंवा हेल्पलाइन वापरा',
    enterApplicationNumber: 'अर्ज क्रमांक एंटर करा',
    checkStatus: 'स्थिती तपासा',
    viaPMKisanPortal: 'पीएम किसान पोर्टलद्वारे',
    orCallHelpline: 'किंवा हेल्पलाइनवर कॉल करा',
    eligibilityCriteria: 'पात्रता निकष',
    requiredDocuments: 'आवश्यक कागदपत्रे',
    faq: 'वारंवार विचारले जाणारे प्रश्न',
    helpSupport: 'मदत आणि समर्थन',
    farmerHelpline: 'शेतकरी हेल्पलाइन',
    emailSupport: 'ईमेल समर्थन',
    downloadForms: 'फॉर्म डाउनलोड करा',
    officialKCCFormFromPMKisan: 'पीएम किसानकडून अधिकृत KCC फॉर्म',
    kccLoanCalculator: 'KCC कर्ज कॅल्क्युलेटर',
    loanAmount: 'कर्ज रक्कम',
    example: 'उदाहरण',
    tenure: 'कालावधी',
    years: 'वर्षे',
    calculate: 'गणना करा',
    results: 'परिणाम',
    monthlyInstallment: 'मासिक हप्ता',
    totalInterest: 'एकूण व्याज',
    totalAmount: 'एकूण रक्कम',
    kccProcessTime: 'KCC प्रक्रियेस ७-१४ कामकाजाच्या दिवस लागतात',
    kccAssistant: 'KCC सहाय्यक',
    kccAssistantDesc: 'तुमच्या सर्व KCC संबंधित प्रश्नांसाठी AI सहाय्यक',
    helloKCCAssistant: 'नमस्कार KCC सहाय्यक',
    askKCCQuestions: 'KCC संबंधित प्रश्न विचारा',
    typeYourQuestionHere: 'तुमचा प्रश्न इथे टाइप करा',
    kccHelpText: 'तुमची गोपनीयता महत्त्वाची आहे. ही चॅट सुरक्षित आहे.',
    answerComing: 'उत्तर लवकर येत आहे...',
    fallbackNotification: 'तात्पुरत्या कनेक्टिव्हिटी समस्यांमुळे नमुना प्रतिसाद वापरला जात आहे. अचूक AI सहाय्यासाठी स्थिर नेटवर्क कनेक्शन सुनिश्चित करा.'
  },
  gu: {
    kisanCreditCard: 'કિસાન ક્રેડિટ કાર્ડ',
    kccTagline: 'સમયસર લોન, સમૃદ્ધ ખેડૂતો',
    application: 'અરજી',
    information: 'માહિતી',
    queries: 'પ્રશ્નો',
    calculator: 'કેલ્ક્યુલેટર',
    startNewApplication: 'નવી અરજી શરૂ કરો',
    followStepsToComplete: 'તમારી અરજી પૂર્ણ કરવા માટે આ પગલાંનું પાલન કરો',
    startApplication: 'અરજી શરૂ કરો',
    downloadForm: 'ફોર્મ ડાઉનલોડ કરો',
    orVisitNearestBank: 'અથવા નજીકની બેંક શાખા પર જાઓ',
    checkApplicationStatus: 'અરજીની સ્થિતિ તપાસો',
    contactBankOrHelplineForStatus: 'સ્થિતિ અપડેટ માટે તમારી બેંકને સંપર્ક કરો અથવા હેલ્પલાઇન વાપરો',
    enterApplicationNumber: 'અરજી નંબર એન્ટર કરો',
    checkStatus: 'સ્થિતિ તપાસો',
    viaPMKisanPortal: 'PM કિસાન પોર્ટલ દ્વારા',
    orCallHelpline: 'અથવા હેલ્પલાઇન પર કોલ કરો',
    eligibilityCriteria: 'પાત્રતા માપદંડ',
    requiredDocuments: 'જરૂરી દસ્તાવેજો',
    faq: 'વારંવાર પૂછાયેલા પ્રશ્નો',
    helpSupport: 'સહાય અને સમર્થન',
    farmerHelpline: 'ખેડૂત હેલ્પલાઇન',
    emailSupport: 'ઈમેઇલ સમર્થન',
    downloadForms: 'ફોર્મ્સ ડાઉનલોડ કરો',
    officialKCCFormFromPMKisan: 'PM કિસાનમાંથી અધિકૃત KCC ફોર્મ',
    kccLoanCalculator: 'KCC લોન કેલ્ક્યુલેટર',
    loanAmount: 'લોન રકમ',
    example: 'ઉદાહરણ',
    tenure: 'કાલાવધિ',
    years: 'વર્ષ',
    calculate: 'ગણતરી કરો',
    results: 'પરિણામો',
    monthlyInstallment: 'માસિક કિસ્ત',
    totalInterest: 'કુલ વ્યાજ',
    totalAmount: 'કુલ રકમ',
    kccProcessTime: 'KCC પ્રક્રિયામાં 7-14 કાર્ય દિવસો લાગે છે',
    kccAssistant: 'KCC સહાયક',
    kccAssistantDesc: 'તમારા તમામ KCC સંબંધિત પ્રશ્નો માટે AI સહાયક',
    helloKCCAssistant: 'નમસ્કાર KCC સહાયક',
    askKCCQuestions: 'KCC સંબંધિત પ્રશ્નો પૂછો',
    typeYourQuestionHere: 'તમારો પ્રશ્ન અહીં ટાઇપ કરો',
    kccHelpText: 'તમારી ગોપનીયતા મહત્વપૂર્ણ છે. આ ચેટ સુરક્ષિત છે.',
    answerComing: 'જવાબ તરત જ આવી રહ્યો છે...',
    fallbackNotification: 'અસ્થાયી કનેક્ટિવિટી સમસ્યાઓને કારણે નમૂના જવાબનો ઉપયોગ કરવામાં આવી રહ્યો છે. સચોટ AI સહાય માટે સ્થિર નેટવર્ક કનેક્શનની ખાતરી કરો.'
  },
  ml: {
    kisanCreditCard: 'കിസാൻ ക്രെഡിറ്റ് കാർഡ്',
    kccTagline: 'കൃത്യസമയം വായ്പ, സമ്പന്നരായ കർഷകർ',
    application: 'അപേക്ഷ',
    information: 'വിവരങ്ങൾ',
    queries: 'ചോദ്യങ്ങൾ',
    calculator: 'കാൽക്കുലേറ്റർ',
    startNewApplication: 'പുതിയ അപേക്ഷ ആരംഭിക്കുക',
    followStepsToComplete: 'നിങ്ങളുടെ അപേക്ഷ പൂർത്തിയാക്കാൻ ഈ ഘട്ടങ്ങൾ പാലിക്കുക',
    startApplication: 'അപേക്ഷ ആരംഭിക്കുക',
    downloadForm: 'ഫോം ഡൗൺലോഡ് ചെയ്യുക',
    orVisitNearestBank: 'അല്ലെങ്കിൽ അടുത്ത ബാങ്ക് ശാഖ സന്ദർശിക്കുക',
    checkApplicationStatus: 'അപേക്ഷ സ്റ്റാറ്റസ് പരിശോധിക്കുക',
    contactBankOrHelplineForStatus: 'സ്റ്റാറ്റസ് അപ്ഡേറ്റിനായി നിങ്ങളുടെ ബാങ്കിനെ ബന്ധപ്പെടുക അല്ലെങ്കിൽ ഹെൽപ്പ്‌ലൈൻ ഉപയോഗിക്കുക',
    enterApplicationNumber: 'അപേക്ഷ നമ്പർ നൽകുക',
    checkStatus: 'സ്റ്റാറ്റസ് പരിശോധിക്കുക',
    viaPMKisanPortal: 'പിഎം കിസാൻ പോർട്ടൽ വഴി',
    orCallHelpline: 'അല്ലെങ്കിൽ ഹെൽപ്പ്‌ലൈനിലേക്ക് കോൾ ചെയ്യുക',
    eligibilityCriteria: 'യോഗ്യതാ മാനദണ്ഡങ്ങൾ',
    requiredDocuments: 'ആവശ്യമായ രേഖകൾ',
    faq: 'പതിവായി ചോദിക്കുന്ന ചോദ്യങ്ങൾ',
    helpSupport: 'സഹായവും പിന്തുണയും',
    farmerHelpline: 'കർഷക ഹെൽപ്പ്‌ലൈൻ',
    emailSupport: 'ഇമെയിൽ പിന്തുണ',
    downloadForms: 'ഫോമുകൾ ഡൗൺലോഡ് ചെയ്യുക',
    officialKCCFormFromPMKisan: 'പിഎം കിസാനിൽ നിന്നുള്ള ഔദ്യോഗിക KCC ഫോം',
    kccLoanCalculator: 'KCC വായ്പ കാൽക്കുലേറ്റർ',
    loanAmount: 'വായ്പ തുക',
    example: 'ഉദാഹരണം',
    tenure: 'കാലാവധി',
    years: 'വർഷങ്ങൾ',
    calculate: 'കണക്കാക്കുക',
    results: 'ഫലങ്ങൾ',
    monthlyInstallment: 'മാസം തിരിച്ചടവ്',
    totalInterest: 'ആകെ പലിശ',
    totalAmount: 'ആകെ തുക',
    kccProcessTime: 'KCC പ്രക്രിയയ്ക്ക് 7-14 പ്രവർത്തന ദിവസങ്ങൾ എടുക്കും',
    kccAssistant: 'KCC സഹായി',
    kccAssistantDesc: 'നിങ്ങളുടെ എല്ലാ KCC സംബന്ധിച്ച ചോദ്യങ്ങൾക്കുമായുള്ള AI സഹായി',
    helloKCCAssistant: 'ഹലോ KCC സഹായി',
    askKCCQuestions: 'KCC സംബന്ധിച്ച ചോദ്യങ്ങൾ ചോദിക്കുക',
    typeYourQuestionHere: 'നിങ്ങളുടെ ചോദ്യം ഇവിടെ ടൈപ്പ് ചെയ്യുക',
    kccHelpText: 'നിങ്ങളുടെ സ്വകാര്യത പ്രധാനമാണ്. ഈ ചാറ്റ് സുരക്ഷിതമാണ്.',
    answerComing: 'ഉത്തരം വരുന്നു...',
    fallbackNotification: 'താൽക്കാലിക കണക്റ്റിവിറ്റി പ്രശ്നങ്ങൾ കാരണം സാമ്പിൾ പ്രതികരണം ഉപയോഗിക്കുന്നു. കൃത്യമായ AI സഹായത്തിന് സ്ഥിരമായ നെറ്റ്‌വർക്ക് കണക്ഷൻ ഉറപ്പാക്കുക.'
  }
}

// Function to get translation
const getTranslation = (language, key) => {
  return translations[language]?.[key] || translations.en[key] || key;
}

const applicationSteps = {
  en: [
    {
      id: 1,
      title: 'Personal Information',
      description: 'Name, address, Aadhaar number and mobile number',
      icon: User,
      status: 'pending',
    },
    {
      id: 2,
      title: 'Land Details',
      description: 'Land documents and Khata number',
      icon: FileText,
      status: 'pending',
    },
    {
      id: 3,
      title: 'Bank Details',
      description: 'Bank account and branch information',
      icon: Building,
      status: 'pending',
    },
    {
      id: 4,
      title: 'Document Upload',
      description: 'Scanned copies of required documents',
      icon: FileText,
      status: 'pending',
    },
  ],
  hi: [
    {
      id: 1,
      title: 'व्यक्तिगत जानकारी',
      description: 'नाम, पता, आधार नंबर और मोबाइल नंबर',
      icon: User,
      status: 'pending',
    },
    {
      id: 2,
      title: 'भूमि विवरण',
      description: 'भूमि के दस्तावेज और खसरा नंबर',
      icon: FileText,
      status: 'pending',
    },
    {
      id: 3,
      title: 'बैंक विवरण',
      description: 'बैंक खाता और शाखा की जानकारी',
      icon: Building,
      status: 'pending',
    },
    {
      id: 4,
      title: 'दस्तावेज अपलोड',
      description: 'आवश्यक दस्तावेजों की स्कैन कॉपी',
      icon: FileText,
      status: 'pending',
    },
  ],
  mr: [
    {
      id: 1,
      title: 'वैयक्तिक माहिती',
      description: 'नाव, पत्ता, आधार क्रमांक आणि मोबाइल नंबर',
      icon: User,
      status: 'pending',
    },
    {
      id: 2,
      title: 'जमीन तपशील',
      description: 'जमीन कागदपत्रे आणि खतावणी क्रमांक',
      icon: FileText,
      status: 'pending',
    },
    {
      id: 3,
      title: 'बँक तपशील',
      description: 'बँक खाते आणि शाखा माहिती',
      icon: Building,
      status: 'pending',
    },
    {
      id: 4,
      title: 'दस्तऐवज अपलोड',
      description: 'आवश्यक दस्तऐवजांच्या स्कॅन प्रती',
      icon: FileText,
      status: 'pending',
    },
  ],
  gu: [
    {
      id: 1,
      title: 'વ્યક્તિગત માહિતી',
      description: 'નામ, સરનામું, આધાર નંબર અને મોબાઈલ નંબર',
      icon: User,
      status: 'pending',
    },
    {
      id: 2,
      title: 'જમીન વિગતો',
      description: 'જમીનના દસ્તાવેજો અને ખતા નંબર',
      icon: FileText,
      status: 'pending',
    },
    {
      id: 3,
      title: 'બેંક વિગતો',
      description: 'બેંક એકાઉન્ટ અને શાખા માહિતી',
      icon: Building,
      status: 'pending',
    },
    {
      id: 4,
      title: 'દસ્તાવેજ અપલોડ',
      description: 'જરૂરી દસ્તાવેજોની સ્કેન કોપી',
      icon: FileText,
      status: 'pending',
    },
  ],
  ml: [
    {
      id: 1,
      title: 'വ്യക്തിഗത വിവരങ്ങൾ',
      description: 'പേര്, വിലാസം, ആധാർ നമ്പർ, മൊബൈൽ നമ്പർ',
      icon: User,
      status: 'pending',
    },
    {
      id: 2,
      title: 'നിലം വിശദാംശങ്ങൾ',
      description: 'നിലം രേഖകളും ഖത നമ്പറും',
      icon: FileText,
      status: 'pending',
    },
    {
      id: 3,
      title: 'ബാങ്ക് വിശദാംശങ്ങൾ',
      description: 'ബാങ്ക് അക്കൗണ്ടും ശാഖാ വിവരങ്ങളും',
      icon: Building,
      status: 'pending',
    },
    {
      id: 4,
      title: 'ഡോക്യുമെന്റ് അപ്‌ലോഡ്',
      description: 'ആവശ്യമായ ഡോക്യുമെന്റുകളുടെ സ്കാൻ കോപ്പികൾ',
      icon: FileText,
      status: 'pending',
    },
  ]
}

const requiredDocuments = {
  en: [
    'Aadhaar Card',
    'Land documents (Khata/Khatouni)',
    'Passport size photo',
    'Bank passbook',
    'Income certificate',
    'Residence certificate',
    'Caste certificate (if applicable)',
  ],
  hi: [
    'आधार कार्ड',
    'भूमि के कागजात (खसरा/खतौनी)',
    'पासपोर्ट साइज फोटो',
    'बैंक पासबुक',
    'आय प्रमाण पत्र',
    'निवास प्रमाण पत्र',
    'जाति प्रमाण पत्र (यदि लागू हो)',
  ],
  mr: [
    'आधार कार्ड',
    'जमीन कागदपत्रे (खसरा/खतावणी)',
    'पासपोर्ट आकार फोटो',
    'बँक पासबुक',
    'उत्पन्न दाखला',
    'निवास दाखला',
    'जात प्रमाणपत्र (लागू असल्यास)',
  ],
  gu: [
    'આધાર કાર્ડ',
    'જમીનના દસ્તાવેજો (ખતા/ખતોની)',
    'પાસપોર્ટ સાઇઝ ફોટો',
    'બેંક પાસબુક',
    'આવક પ્રમાણપત્ર',
    'રહેઠાણ પ્રમાણપત્ર',
    'જાતિ પ્રમાણપત્ર (જો લાગુ પડતું હોય)',
  ],
  ml: [
    'ആധാർ കാർഡ്',
    'നിലം രേഖകൾ (ഖത/ഖതൗണി)',
    'പാസ്പോർട്ട് സൈസ് ഫോട്ടോ',
    'ബാങ്ക് പാസ്ബുക്ക്',
    'വരുമാന സർട്ടിഫിക്കറ്റ്',
    'വസതി സർട്ടിഫിക്കറ്റ്',
    'ജാതി സർട്ടിഫിക്കറ്റ് (ബാധകമാണെങ്കിൽ)',
  ]
}

const eligibilityCriteria = {
  en: [
    'Must be an Indian citizen',
    'Owner or tenant of agricultural land',
    'Age between 18-75 years',
    'No existing KCC',
    'Must have bank account',
  ],
  hi: [
    'भारतीय नागरिक होना आवश्यक',
    'कृषि भूमि का मालिक या काश्तकार',
    '18-75 वर्ष की आयु',
    'पहले से KCC न हो',
    'बैंक में खाता होना आवश्यक',
  ],
  mr: [
    'भारतीय नागरिक असणे आवश्यक',
    'शेती जमिनीचा मालक किंवा भाडेकरू',
    '18-75 वर्षे वय',
    'आधीपासून KCC नसावे',
    'बँकेत खाते असणे आवश्यक',
  ],
  gu: [
    'ભારતીય નાગરિક હોવું જરૂરી',
    'કૃષિ જમીનનો માલિક અથવા ભાડુઆત',
    '18-75 વર્ષની ઉંમર',
    'પહેલાથી KCC ન હોય',
    'બેંક એકાઉન્ટ હોવું જરૂરી',
  ],
  ml: [
    'ഇന്ത്യൻ പൗരനായിരിക്കണം',
    'കാർഷിക നിലത്തിന്റെ ഉടമയോ കുടിയാനോ ആയിരിക്കണം',
    '18-75 വയസ്സ് പ്രായം',
    'നിലവിൽ KCC ഇല്ലാതിരിക്കണം',
    'ബാങ്ക് അക്കൗണ്ട് ഉണ്ടായിരിക്കണം',
  ]
}

const loanBenefits = {
  en: [
    {
      title: 'Low Interest Rate',
      description: 'Up to 7% annual interest rate',
    },
    {
      title: 'Subsidy',
      description: '2% interest subsidy available',
    },
    {
      title: 'Easy Repayment',
      description: 'Flexible payment according to crop season',
    },
    {
      title: 'Insurance Cover',
      description: 'Personal accident insurance',
    },
  ],
  hi: [
    {
      title: 'कम ब्याज दर',
      description: '7% तक वार्षिक ब्याज दर',
    },
    {
      title: 'सब्सिडी',
      description: '2% ब्याज सब्सिडी उपलब्ध',
    },
    {
      title: 'आसान भुगतान',
      description: 'फसल के अनुसार भुगतान की सुविधा',
    },
    {
      title: 'बीमा कवर',
      description: 'व्यक्तिगत दुर्घटना बीमा',
    },
  ],
  mr: [
    {
      title: 'कमी व्याज दर',
      description: '7% पर्यंत वार्षिक व्याज दर',
    },
    {
      title: 'सब्सिडी',
      description: '2% व्याज सबसिडी उपलब्ध',
    },
    {
      title: 'सोपे परतफेड',
      description: 'पीक हंगामानुसार सवलत देय',
    },
    {
      title: 'विमा कव्हर',
      description: 'वैयक्तिक अपघात विमा',
    },
  ],
  gu: [
    {
      title: 'ઓછી વ્યાજ દર',
      description: '7% સુધી વાર્ષિક વ્યાજ દર',
    },
    {
      title: 'સબસિડી',
      description: '2% વ્યાજ સબસિડી ઉપલબ્ધ',
    },
    {
      title: 'સરળ પરતફેડ',
      description: 'પાક સીઝન મુજબ ફ્લેક્સિબલ પેમેન્ટ',
    },
    {
      title: 'વીમા કવર',
      description: 'વ્યક્તિગત અકસ્માત વીમો',
    },
  ],
  ml: [
    {
      title: 'കുറഞ്ഞ പലിശ നിരക്ക്',
      description: '7% വരെ വാർഷിക പലിശ നിരക്ക്',
    },
    {
      title: 'സബ്സിഡി',
      description: '2% പലിശ സബ്സിഡി ലഭ്യം',
    },
    {
      title: 'ലളിതമായ തിരിച്ചടവ്',
      description: 'പയർക്കാലത്തിനനുസരിച്ചുള്ള ഫ്ലെക്സിബിൾ പേയ്മെന്റ്',
    },
    {
      title: 'ഇൻഷുറൻസ് കവർ',
      description: 'വ്യക്തിഗത അപകട ഇൻഷുറൻസ്',
    },
  ]
}

const faqQuestions = {
  en: [
    {
      question: 'What is the maximum loan limit for KCC?',
      answer: 'Up to ₹1.6 lakh loan is available for general farmers.'
    },
    {
      question: 'What is the interest rate for KCC?',
      answer: 'Currently 7% annual interest rate, effective rate becomes 5% after 2% subsidy.'
    },
    {
      question: 'How long does the application process take?',
      answer: 'KCC is issued within 7-14 working days after submitting application.'
    },
    {
      question: 'What is the validity period of KCC?',
      answer: 'KCC is valid for 5 years, after which it can be renewed.'
    }
  ],
  hi: [
    {
      question: 'KCC के लिए अधिकतम ऋण सीमा क्या है?',
      answer: 'सामान्य किसानों के लिए ₹1.6 लाख तक का ऋण उपलब्ध है।'
    },
    {
      question: 'KCC का ब्याज दर क्या है?',
      answer: 'वर्तमान में 7% वार्षिक ब्याज दर है, जिसमें 2% की सब्सिडी मिलने पर प्रभावी दर 5% हो जाती है।'
    },
    {
      question: 'आवेदन प्रक्रिया में कितना समय लगता है?',
      answer: 'आवेदन जमा करने के बाद 7-14 कार्य दिवसों में KCC जारी कर दिया जाता है।'
    },
    {
      question: 'KCC की वैधता अवधि कितनी है?',
      answer: 'KCC 5 वर्षों के लिए वैध होता है, जिसके बाद इसे नवीनीकृत किया जा सकता है।'
    }
  ],
  mr: [
    {
      question: 'KCC साठी कमाल कर्ज मर्यादा किती?',
      answer: 'सामान्य शेतकऱ्यांसाठी ₹1.6 लाख पर्यंत कर्ज उपलब्ध आहे.'
    },
    {
      question: 'KCC चा व्याज दर किती?',
      answer: 'सध्या 7% वार्षिक व्याज दर आहे, 2% सबसिडी मिळाल्यानंतर प्रभावी दर 5% होतो.'
    },
    {
      question: 'अर्ज प्रक्रियेस किती वेळ लागतो?',
      answer: 'अर्ज सबमिट केल्यानंतर 7-14 कामकाजाच्या दिवसांत KCC जारी केला जातो.'
    },
    {
      question: 'KCC ची वैधता कालावधी किती?',
      answer: 'KCC 5 वर्षांसाठी वैध आहे, त्यानंतर ते नूतनीकरण करता येते.'
    }
  ],
  gu: [
    {
      question: 'KCC માટે મહત્તમ લોન લિમિટ કેટલી છે?',
      answer: 'સામાન્ય ખેડૂતો માટે ₹1.6 લાખ સુધીની લોન ઉપલબ્ધ છે.'
    },
    {
      question: 'KCC નો વ્યાજ દર કેટલો છે?',
      answer: 'હાલમાં 7% વાર્ષિક વ્યાજ દર છે, 2% સબસિડી મળ્યા બાદ અસરકારક દર 5% થાય છે.'
    },
    {
      question: 'એપ્લિકેશન પ્રક્રિયામાં કેટલો સમય લાગે છે?',
      answer: 'એપ્લિકેશન સબમિટ કર્યા પછી 7-14 કાર્ય દિવસોમાં KCC જારી કરવામાં આવે છે.'
    },
    {
      question: 'KCC ની માન્યતા અવધિ કેટલી છે?',
      answer: 'KCC 5 વર્ષ માટે માન્ય છે, જે પછી તે નવીકરણ કરી શકાય છે.'
    }
  ],
  ml: [
    {
      question: 'KCC-യ്ക്കുള്ള പരമാവധി വായ്പ പരിധി എത്രയാണ്?',
      answer: 'സാധാരണ കർഷകർക്ക് ₹1.6 ലക്ഷം വരെ വായ്പ ലഭ്യമാണ്.'
    },
    {
      question: 'KCC-യുടെ പലിശ നിരക്ക് എത്രയാണ്?',
      answer: 'നിലവിൽ 7% വാർഷിക പലിശ നിരക്കാണ്, 2% സബ്സിഡി ലഭിച്ച ശേഷം ഫലപ്രദമായ നിരക്ക് 5% ആകുന്നു.'
    },
    {
      question: 'അപേക്ഷാ പ്രക്രിയയ്ക്ക് എത്ര സമയമെടുക്കും?',
      answer: 'അപേക്ഷ സമർപ്പിച്ചതിന് ശേഷം 7-14 പണി ദിവസങ്ങൾക്കുള്ളിൽ KCC നൽകുന്നു.'
    },
    {
      question: 'KCC-യുടെ സാധുതാ കാലയളവ് എത്രയാണ്?',
      answer: 'KCC 5 വർഷത്തേക്ക് സാധുതയുള്ളതാണ്, അതിനുശേഷം അത് പുതുക്കാവുന്നതാണ്.'
    }
  ]
}

// Function to get Gemini response
async function getGeminiResponse(prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`
  
  const response = await fetch(url, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    })
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Gemini API error: ${response.status} - ${errorText}`)
  }

  const data = await response.json()
  
  if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
    throw new Error('Invalid response format from Gemini API')
  }
  
  return data.candidates[0].content.parts[0]?.text || 'Sorry, there was a problem getting the answer.'
}

// Function to get AI response using Gemini
async function getAIResponse(userMessage, language) {
  const fallbackMessages = {
    en: 'KCC (Kisan Credit Card) is an important scheme of the Government of India that provides timely and adequate credit facilities to farmers. For more information, please state your specific problem.',
    hi: 'KCC (किसान क्रेडिट कार्ड) भारत सरकार की एक महत्वपूर्ण योजना है जो किसानों को समय पर और पर्याप्त ऋण सुविधाएं प्रदान करती है। अधिक जानकारी के लिए कृपया अपनी विशिष्ट समस्या बताएं।',
    mr: 'KCC (किसान क्रेडिट कार्ड) ही भारत सरकारची एक महत्त्वाची योजना आहे जी शेतकऱ्यांना वेळेवर आणि पुरेशी कर्ज सुविधा प्रदान करते. अधिक माहितीसाठी कृपया आपली विशिष्ट समस्या सांगा.',
    gu: 'KCC (કિસાન ક્રેડિટ કાર્ડ) ભારત સરકારની એક મહત્વપૂર્ણ યોજના છે જે ખેડૂતોને સમયસર અને પર્યાપ્ત ક્રેડિટ સુવિધાઓ પૂરી પાડે છે. વધુ માહિતી માટે કૃપા કરીને તમારી ચોક્કસ સમસ્યા જણાવો.',
    ml: 'KCC (കിസാൻ ക്രെഡിറ്റ് കാർഡ്) ഇന്ത്യാ സർക്കാരിന്റെ ഒരു പ്രധാന പദ്ധതിയാണ്, ഇത് കർഷകർക്ക് സമയോചിതവും മതിയായതുമായ ക്രെഡിറ്റ് സൗകര്യങ്ങൾ നൽകുന്നു. കൂടുതൽ വിവരങ്ങൾക്ക് ദയവായി നിങ്ങളുടെ നിർദ്ദിഷ്ട പ്രശ്നം പറയുക.'
  }
  
  try {
    const prompts = {
      en: `You are a helpful assistant for KCC (Kisan Credit Card) scheme in India. Answer the following question concisely in English: ${userMessage}`,
      hi: `आप भारत में KCC (किसान क्रेडिट कार्ड) योजना के लिए एक सहायक सहायक हैं। निम्नलिखित प्रश्न का संक्षिप्त उत्तर हिंदी में दें: ${userMessage}`,
      mr: `तुम्ही भारतातील KCC (किसान क्रेडिट कार्ड) योजनेसाठी एक उपयुक्त सहाय्यक आहात. खालील प्रश्नाचे संक्षिप्त उत्तर मराठीत द्या: ${userMessage}`,
      gu: `તમે ભારતમાં KCC (કિસાન ક્રેડિટ કાર્ડ) સ્કીમ માટે મદદગાર સહાયક છો. નીચેના પ્રશ્નનો સંક્ષિપ્તમાં જવાબ ગુજરાતીમાં આપો: ${userMessage}`,
      ml: `നിങ്ങൾ ഇന്ത്യയിലെ KCC (കിസാൻ ക്രെഡിറ്റ് കാർഡ്) സ്കീമിനായി ഒരു സഹായക സഹായിയാണ്. ഇനിപ്പറയുന്ന ചോദ്യത്തിന് സംക്ഷിപ്തമായി മലയാളത്തിൽ ഉത്തരം നൽകുക: ${userMessage}`
    }
    
    const prompt = prompts[language] || prompts.en
    const response = await getGeminiResponse(prompt)
    
    return { response, isFallback: false }
  } catch (error) {
    console.error('Error getting AI response:', error)
    return { 
      response: fallbackMessages[language] || fallbackMessages.en, 
      isFallback: true 
    }
  }
}

export default function KCCApplication() {
  const [activeTab, setActiveTab] = useState('application')
  const [showChatbot, setShowChatbot] = useState(false)
  const [chatMessages, setChatMessages] = useState([])
  const [currentMessage, setCurrentMessage] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const [usingFallback, setUsingFallback] = useState(false)
  const chatContainerRef = useRef(null)
  const { language } = useLanguage() // Removed t, using getTranslation instead

  // Calculator states
  const [loanAmount, setLoanAmount] = useState(100000)
  const [tenure, setTenure] = useState(5)
  const [monthlyEMI, setMonthlyEMI] = useState(0)
  const [totalInterest, setTotalInterest] = useState(0)
  const [totalAmount, setTotalAmount] = useState(0)

  // Locale map for number formatting
  const localeMap = {
    en: 'en-IN',
    hi: 'hi-IN',
    mr: 'mr-IN',
    gu: 'gu-IN',
    ml: 'ml-IN'
  }
  const currentLocale = localeMap[language] || 'en-IN'

  // Calculator calculation
  useEffect(() => {
    if (loanAmount > 0 && tenure > 0) {
      const annualRate = 0.07 // 7% interest rate for KCC
      const monthlyRate = annualRate / 12
      const months = tenure * 12
      const emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1)
      setMonthlyEMI(Math.round(emi))
      const totalPayable = emi * months
      setTotalAmount(Math.round(totalPayable))
      setTotalInterest(Math.round(totalPayable - loanAmount))
    } else {
      setMonthlyEMI(0)
      setTotalAmount(0)
      setTotalInterest(0)
    }
  }, [loanAmount, tenure])

  // Scroll to bottom of chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [chatMessages])

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return

    const userMessage = currentMessage.trim()
    setCurrentMessage('')
    setChatMessages(prev => [...prev, { type: 'user', message: userMessage }])
    setChatLoading(true)

    const result = await getAIResponse(userMessage, language)
    setChatMessages(prev => [...prev, { type: 'ai', message: result.response }])
    setUsingFallback(result.isFallback)
    
    setChatLoading(false)
  }

  const handleQuickQuestion = (question) => {
    setCurrentMessage(question)
    // Auto-send the quick question
    setTimeout(() => {
      if (currentMessage === question) {
        handleSendMessage()
      }
    }, 100)
  }

  const quickQuestions = {
    en: [
      'What is the interest rate for KCC?',
      'What is the loan limit?',
      'How to apply?',
      'What documents are required?',
      'How many days to get KCC?'
    ],
    hi: [
      'KCC का ब्याज दर क्या है?',
      'ऋण सीमा कितनी है?',
      'आवेदन कैसे करें?',
      'कौन से दस्तावेज चाहिए?',
      'कितने दिन में मिलेगा KCC?'
    ],
    mr: [
      'KCC चा व्याज दर किती?',
      'कर्ज मर्यादा किती?',
      'अर्ज कसा करायचा?',
      'कोणती कागदपत्रे आवश्यक?',
      'किती दिवसात मिळेल KCC?'
    ],
    gu: [
      'KCC નો વ્યાજ દર કેટલો છે?',
      'લોન લિમિટ કેટલી છે?',
      'કેવી રીતે અરજી કરવી?',
      'કયા દસ્તાવેજો જરૂરી છે?',
      'કેટલા દિવસમાં મળશે KCC?'
    ],
    ml: [
      'KCC-യുടെ പലിശ നിരക്ക് എത്രയാണ്?',
      'വായ്പ പരിധി എത്രയാണ്?',
      'എങ്ങനെ അപേക്ഷിക്കാം?',
      'എന്ത് ഡോക്യുമെന്റുകൾ ആവശ്യമാണ്?',
      'എത്ര ദിവസം കൊണ്ട് KCC ലഭിക്കും?'
    ]
  }

  const ChatInterface = () => {
    const renderMessage = (text) => {
      return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    };

    return (
      <div className="flex flex-col h-[60vh] sm:h-[70vh] bg-card rounded-lg shadow-sm border border-border">
        {/* Fallback Notification */}
        {usingFallback && chatMessages.length > 0 && (
          <div className="p-4 bg-muted border border-border text-card-foreground rounded-lg mb-4">
            <div className="flex items-center">
              <Info className="h-5 w-5 mr-2 flex-shrink-0 text-primary" />
              <p className="text-sm">{getTranslation(language, 'fallbackNotification')}</p>
            </div>
          </div>
        )}
        
        {/* Chat Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center">
            <Bot className="h-6 w-6 text-primary mr-2 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-card-foreground">{getTranslation(language, 'kccAssistant')}</h3>
              <p className="text-sm text-muted-foreground">{getTranslation(language, 'kccAssistantDesc')}</p>
            </div>
          </div>
        </div>
        
        {/* Chat Messages */}
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4"
        >
          {chatMessages.length === 0 ? (
            <div className="text-center py-8">
              <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h4 className="text-lg font-medium text-card-foreground">{getTranslation(language, 'helloKCCAssistant')}</h4>
              <p className="text-muted-foreground mt-2">{getTranslation(language, 'askKCCQuestions')}</p>
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                {(quickQuestions[language] || quickQuestions.en).map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickQuestion(question)}
                    className="px-3 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-sm transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            chatMessages.map((msg, index) => (
              <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-lg ${
                  msg.type === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-card-foreground'
                }`}>
                  <p 
                    className="text-sm whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{ __html: renderMessage(msg.message) }}
                  />
                </div>
              </div>
            ))
          )}
          {chatLoading && (
            <div className="flex justify-start">
              <div className="bg-muted p-3 rounded-lg flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">{getTranslation(language, 'answerComing')}</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Chat Input */}
        <div className="p-4 border-t border-border">
          <div className="flex gap-2">
            <input
              type="text"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              placeholder={getTranslation(language, 'typeYourQuestionHere')}
              className="flex-1 px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-card-foreground placeholder-muted-foreground bg-card"
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={chatLoading}
              autoFocus={!chatLoading}
              autoComplete="off"
              spellCheck="false"
            />
            <button
              onClick={handleSendMessage}
              disabled={chatLoading || !currentMessage.trim()}
              className="bg-primary hover:bg-accent disabled:bg-muted text-primary-foreground px-4 py-2 rounded-lg transition-colors flex items-center disabled:text-muted-foreground"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            {getTranslation(language, 'kccHelpText')}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-4 sm:py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {getTranslation(language, 'kisanCreditCard')}
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground font-medium">
            {getTranslation(language, 'kccTagline')}
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-1 mb-6 sm:mb-8 bg-card rounded-lg p-1 shadow-sm border border-border">
          {[
            { id: 'application', name: getTranslation(language, 'application'), icon: CreditCard },
            { id: 'information', name: getTranslation(language, 'information'), icon: FileText },
            { id: 'queries', name: getTranslation(language, 'queries'), icon: MessageCircle },
            { id: 'calculator', name: getTranslation(language, 'calculator'), icon: Calculator }
          ].map((tab) => {
            const IconComponent = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3 sm:px-4 py-3 rounded-md flex-1 transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                <IconComponent className="h-5 w-5 flex-shrink-0" />
                <span className="font-medium text-sm sm:text-base">{tab.name}</span>
              </button>
            )
          })}
        </div>

        {/* Main Content */}
        {activeTab === 'application' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Application Form */}
            <div className="space-y-6">
              <div className="bg-card rounded-lg shadow-sm p-4 sm:p-6 border border-border">
                <h2 className="text-xl font-bold text-foreground mb-4 flex items-center">
                  <CreditCard className="mr-2 h-5 w-5 flex-shrink-0 text-primary" />
                  {getTranslation(language, 'startNewApplication')}
                </h2>
                <p className="text-muted-foreground mb-6">
                  {getTranslation(language, 'followStepsToComplete')}
                </p>
                <div className="space-y-4">
                  {(applicationSteps[language] || applicationSteps.en).map((step) => {
                    const IconComponent = step.icon
                    return (
                      <div key={step.id} className="flex items-start space-x-4 p-4 border border-border rounded-lg hover:border-primary/50 transition-colors">
                        <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mt-1">
                          <IconComponent className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-foreground">{step.title}</h4>
                          <p className="text-sm text-muted-foreground">{step.description}</p>
                        </div>
                        <div className="flex-shrink-0">
                          <Clock className="h-5 w-5 text-muted-foreground mt-1" />
                        </div>
                      </div>
                    )
                  })}
                  <a 
                    href="https://pmkisan.gov.in/documents/Kcc.pdf"
                    download="KCC_Application_Form.pdf"
                    className="bg-card text-primary hover:bg-primary/5 px-6 py-3 rounded-xl font-semibold shadow-sm transition-all duration-200 flex items-center justify-center border border-primary"
                  >
                    {getTranslation(language, 'startApplication')} - {getTranslation(language, 'downloadForm')}
                  </a>
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    {getTranslation(language, 'orVisitNearestBank')}
                  </p>
                </div>
              </div>

              {/* Status Check */}
              <div className="bg-card rounded-lg shadow-sm p-4 sm:p-6 border border-border">
                <h2 className="text-xl font-bold text-foreground mb-4">{getTranslation(language, 'checkApplicationStatus')}</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  {getTranslation(language, 'contactBankOrHelplineForStatus')}
                </p>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder={getTranslation(language, 'enterApplicationNumber')}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-card-foreground placeholder-muted-foreground bg-card"
                  />
                  <a 
                    href="http://pmkisan.gov.in/beneficiarystatus.aspx"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full block border border-primary text-primary hover:bg-primary/5 py-2 rounded-lg font-medium transition-colors text-center"
                  >
                    {getTranslation(language, 'checkStatus')} - {getTranslation(language, 'viaPMKisanPortal')}
                  </a>
                  <p className="text-xs text-muted-foreground text-center">
                    {getTranslation(language, 'orCallHelpline')} 1800-180-1551
                  </p>
                </div>
              </div>
            </div>

            {/* Information Panel */}
            <div className="space-y-6">
              {/* Eligibility */}
              <div className="bg-card rounded-lg shadow-sm p-4 sm:p-6 border border-border">
                <h2 className="text-xl font-bold text-foreground mb-4 flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0 text-primary" />
                  {getTranslation(language, 'eligibilityCriteria')}
                </h2>
                <ul className="space-y-3">
                  {(eligibilityCriteria[language] || eligibilityCriteria.en).map((criteria, index) => (
                    <li key={index} className="flex items-center">
                      <span className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0"></span>
                      <span className="text-card-foreground">{criteria}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Required Documents */}
              <div className="bg-card rounded-lg shadow-sm p-4 sm:p-6 border border-border">
                <h2 className="text-xl font-bold text-foreground mb-4 flex items-center">
                  <FileText className="mr-2 h-5 w-5 flex-shrink-0 text-primary" />
                  {getTranslation(language, 'requiredDocuments')}
                </h2>
                <ul className="space-y-3">
                  {(requiredDocuments[language] || requiredDocuments.en).map((document, index) => (
                    <li key={index} className="flex items-center">
                      <span className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0"></span>
                      <span className="text-card-foreground">{document}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'information' && (
          <div className="space-y-6">
            {/* Loan Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(loanBenefits[language] || loanBenefits.en).map((benefit, index) => (
                <div key={index} className="bg-card rounded-lg shadow-sm p-4 sm:p-6 border border-border hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <CreditCard className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </div>
              ))}
            </div>

            {/* FAQ Section */}
            <div className="bg-card rounded-lg shadow-sm p-4 sm:p-6 border border-border">
              <h2 className="text-xl font-bold text-foreground mb-6 flex items-center">
                <MessageCircle className="mr-2 h-5 w-5 flex-shrink-0 text-primary" />
                {getTranslation(language, 'faq')}
              </h2>
              <div className="space-y-4">
                {(faqQuestions[language] || faqQuestions.en).map((faq, index) => (
                  <div key={index} className="border-b border-border pb-4 last:border-b-0">
                    <h3 className="font-semibold text-foreground mb-2">{faq.question}</h3>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Help & Support */}
            <div className="bg-card rounded-lg shadow-sm p-4 sm:p-6 border border-border">
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center">
                <Phone className="mr-2 h-5 w-5 flex-shrink-0 text-primary" />
                {getTranslation(language, 'helpSupport')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium text-card-foreground mb-2">{getTranslation(language, 'farmerHelpline')}</h4>
                  <p className="text-sm text-muted-foreground">Toll Free: 1800-180-1551</p>
                  <p className="text-sm text-muted-foreground">Time: 6 AM to 10 PM</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium text-card-foreground mb-2">{getTranslation(language, 'emailSupport')}</h4>
                  <p className="text-sm text-muted-foreground">kcc-support@kisanai.gov.in</p>
                </div>
              </div>
              <a 
                href="https://pmkisan.gov.in/documents/Kcc.pdf"
                download="KCC_Application_Form.pdf"
                className="w-full block border border-primary text-primary hover:bg-primary/5 py-3 rounded-lg font-medium mt-4 transition-colors text-center flex items-center justify-center"
              >
                <Download className="h-4 w-4 mr-2 flex-shrink-0" />
                {getTranslation(language, 'downloadForms')}
              </a>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                {getTranslation(language, 'officialKCCFormFromPMKisan')}
              </p>
            </div>
          </div>
        )}

        {activeTab === 'queries' && <ChatInterface />}

        {activeTab === 'calculator' && (
          <div className="bg-card rounded-lg shadow-sm p-4 sm:p-6 border border-border">
            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center">
              <Calculator className="mr-2 h-5 w-5 flex-shrink-0 text-primary" />
              {getTranslation(language, 'kccLoanCalculator')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-2">
                    {getTranslation(language, 'loanAmount')} (₹)
                  </label>
                  <input
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value) || 0)}
                    placeholder={`${getTranslation(language, 'example')}: 100000`}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-card-foreground bg-card"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-2">
                    {getTranslation(language, 'tenure')} ({getTranslation(language, 'years')})
                  </label>
                  <input
                    type="number"
                    value={tenure}
                    onChange={(e) => setTenure(Number(e.target.value) || 0)}
                    placeholder={`${getTranslation(language, 'example')}: 5`}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-card-foreground bg-card"
                  />
                </div>
                <button 
                  className="w-full bg-primary hover:bg-accent text-primary-foreground py-3 rounded-lg font-medium transition-colors"
                >
                  {getTranslation(language, 'calculate')}
                </button>
              </div>
              <div className="bg-muted rounded-lg p-4 sm:p-6">
                <h3 className="font-semibold text-card-foreground mb-4">{getTranslation(language, 'results')}</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{getTranslation(language, 'monthlyInstallment')}:</span>
                    <span className="font-semibold text-card-foreground">₹{monthlyEMI.toLocaleString(currentLocale)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{getTranslation(language, 'totalInterest')}:</span>
                    <span className="font-semibold text-card-foreground">₹{totalInterest.toLocaleString(currentLocale)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{getTranslation(language, 'totalAmount')}:</span>
                    <span className="font-semibold text-card-foreground">₹{totalAmount.toLocaleString(currentLocale)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 sm:mt-8 text-center">
          <p className="text-muted-foreground">
            {getTranslation(language, 'kccProcessTime')}
          </p>
        </div>
      </div>
    </div>
  )
}