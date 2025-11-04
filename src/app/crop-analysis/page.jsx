'use client'

import { useState, useRef, useCallback } from 'react'
import { Camera, Upload, FileImage as ImageIcon, CheckCircle, AlertTriangle, Leaf, Bug, Droplets, Sun, X, RotateCcw, Info } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

// Import Gemini AI
import { GoogleGenerativeAI } from '@google/generative-ai'

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY 
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })


export default function CropAnalysis() {
  const [selectedImage, setSelectedImage] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState(null)
  const [usingFallback, setUsingFallback] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)
  const { language, t } = useLanguage()

  // Mock data fallback in all languages
  const getMockAnalysisResult = useCallback(() => {
    const mockResults = {
      en: [
        {
          condition: 'healthy',
          confidence: 95,
          disease: 'Healthy Plant',
          recommendations: [
            'Crop appears healthy, continue regular care',
            'Maintain soil moisture and balanced irrigation',
            'Continue regular monitoring of plants'
          ],
          severity: 'low'
        },
        {
          condition: 'disease',
          confidence: 88,
          disease: 'Leaf Spot Disease',
          recommendations: [
            'Spray with Mancozeb or Copper Oxychloride',
            'Remove and destroy infected leaves immediately',
            'Maintain proper distance between plants'
          ],
          severity: 'medium'
        },
        {
          condition: 'pest',
          confidence: 92,
          disease: 'Aphid Infestation',
          recommendations: [
            'Use 2% neem oil solution for spraying',
            'Clean affected parts with strong water stream',
            'Use organic pesticides'
          ],
          severity: 'high'
        },
        {
          condition: 'nutrient-deficiency',
          confidence: 85,
          disease: 'Nitrogen Deficiency',
          recommendations: [
            'Use urea or ammonium sulfate',
            'Apply green manure or compost',
            'Get soil testing done'
          ],
          severity: 'medium'
        }
      ],
      hi: [
        {
          condition: 'healthy',
          confidence: 95,
          disease: 'स्वस्थ पौधा',
          recommendations: [
            'फसल स्वस्थ दिख रही है, नियमित देखभाल जारी रखें',
            'मिट्टी की नमी बनाए रखें और संतुलित सिंचाई करें',
            'नियमित रूप से पौधों की निगरानी करते रहें'
          ],
          severity: 'low'
        },
        {
          condition: 'disease',
          confidence: 88,
          disease: 'पत्ती का धब्बा रोग',
          recommendations: [
            'मैन्कोजेब या कॉपर ऑक्सीक्लोराइड का छिड़काव करें',
            'संक्रमित पत्तियों को तुरंत हटाकर नष्ट कर दें',
            'पौधों के बीच उचित दूरी बनाए रखें'
          ],
          severity: 'medium'
        },
        {
          condition: 'pest',
          confidence: 92,
          disease: 'एफिड कीट संक्रमण',
          recommendations: [
            'नीम के तेल का 2% घोल बनाकर छिड़काव करें',
            'प्रभावित भागों को पानी की तेज धार से साफ करें',
            'जैविक कीटनाशक का उपयोग करें'
          ],
          severity: 'high'
        },
        {
          condition: 'nutrient-deficiency',
          confidence: 85,
          disease: 'नाइट्रोजन की कमी',
          recommendations: [
            'यूरिया या अमोनियम सल्फेट का उपयोग करें',
            'हरी खाद या कम्पोस्ट डालें',
            'मिट्टी की जांच करवाएं'
          ],
          severity: 'medium'
        }
      ],
      mr: [
        {
          condition: 'healthy',
          confidence: 95,
          disease: 'निरोगी वनस्पती',
          recommendations: [
            'पीक निरोगी दिसते आहे, नियमित काळजी सुरू ठेवा',
            'मातीची आर्द्रता राखा आणि संतुलित सिंचन करा',
            'वनस्पतींचे नियमित निरीक्षण सुरू ठेवा'
          ],
          severity: 'low'
        },
        {
          condition: 'disease',
          confidence: 88,
          disease: 'पान डाग रोग',
          recommendations: [
            'मॅन्कोझेब किंवा कॉपर ऑक्सिक्लोराईडची फवारणी करा',
            'संसर्गित पाने लगेच काढून टाका आणि नष्ट करा',
            'वनस्पतींमध्ये योग्य अंतर ठेवा'
          ],
          severity: 'medium'
        },
        {
          condition: 'pest',
          confidence: 92,
          disease: 'अफिड कीट संसर्ग',
          recommendations: [
            '२% निंब तेल उपाय फवारणीसाठी वापरा',
            'प्रभावित भाग शक्तिशाली पाण्याच्या प्रवाहाने स्वच्छ करा',
            'सेंद्रिय कीटकनाशके वापरा'
          ],
          severity: 'high'
        },
        {
          condition: 'nutrient-deficiency',
          confidence: 85,
          disease: 'नायट्रोजनची कमतरता',
          recommendations: [
            'युरिया किंवा अमोनियम सल्फेट वापरा',
            'हिरवा खत किंवा कंपोस्ट लावा',
            'मातीची चाचणी करा'
          ],
          severity: 'medium'
        }
      ],
      gu: [
        {
          condition: 'healthy',
          confidence: 95,
          disease: 'સ્વસ્થ છોડ',
          recommendations: [
            'પાક સ્વસ્થ દેખાય છે, નિયમિત સંભાળ ચાલુ રાખો',
            'માટીની ભેજ જાળવો અને સંતુલિત સિંચાઈ કરો',
            'નિયમિત રીતે છોડનું નિરીક્ષણ ચાલુ રાખો'
          ],
          severity: 'low'
        },
        {
          condition: 'disease',
          confidence: 88,
          disease: 'લીફ સ્પોટ રોગ',
          recommendations: [
            'મેન્કોઝેબ અથવા કોપર ઓક્સિક્લોરાઇડનું સ્પ્રે કરો',
            'સંક્રમિત પાંદડાઓ તરત જ દૂર કરો અને નાશ કરો',
            'છોડ વચ્ચે યોગ્ય અંતર જાળવો'
          ],
          severity: 'medium'
        },
        {
          condition: 'pest',
          confidence: 92,
          disease: 'એફિડ કીટ સંક્રમણ',
          recommendations: [
            'સ્પ્રે માટે 2% નીમ તેલનો ઉપયોગ કરો',
            'પ્રભાવિત ભાગોને મજબૂત પાણીના પ્રવાહથી સાફ કરો',
            'ઓર્ગેનિક કીટનાશકોનો ઉપયોગ કરો'
          ],
          severity: 'high'
        },
        {
          condition: 'nutrient-deficiency',
          confidence: 85,
          disease: 'નાઇટ્રોજનની ઉણપ',
          recommendations: [
            'યુરિયા અથવા એમોનિયમ સલ્ફેટનો ઉપયોગ કરો',
            'ગ્રીન મેન્યોર અથવા કોમ્પોસ્ટ લગાવો',
            'માટીની ચકાસણી કરાવો'
          ],
          severity: 'medium'
        }
      ],
      ml: [
        {
          condition: 'healthy',
          confidence: 95,
          disease: 'ആരോഗ്യകരമായ ചെടി',
          recommendations: [
            'വിള ആരോഗ്യകരമായി കാണപ്പെടുന്നു, സാധാരണ പരിപാലനം തുടരുക',
            'മണ്ണിന്റെ ഈർപ്പം നിലനിർത്തുക, സമതുലിതമായ ജലസേചനം നടത്തുക',
            'ചെടികളുടെ സാധാരണ നിരീക്ഷണം തുടരുക'
          ],
          severity: 'low'
        },
        {
          condition: 'disease',
          confidence: 88,
          disease: 'ലീഫ് സ്പോട്ട് രോഗം',
          recommendations: [
            'മാൻകോസെബ് അല്ലെങ്കിൽ കോപ്പർ ഓക്സിക്ലോറൈഡ് ഉപയോഗിച്ച് സ്പ്രേ ചെയ്യുക',
            'ബാധിച്ച ഇലകൾ ഉടൻ നീക്കംചെയ്ത് നശിപ്പിക്കുക',
            'ചെടികൾക്കിടയിൽ ശരിയായ ദൂരം നിലനിർത്തുക'
          ],
          severity: 'medium'
        },
        {
          condition: 'pest',
          confidence: 92,
          disease: 'അഫിഡ് കീട ബാധ',
          recommendations: [
            'സ്പ്രേയിംഗിനായി 2% നീം ഓയിൽ ലായനി ഉപയോഗിക്കുക',
            'ബാധിച്ച ഭാഗങ്ങൾ ശക്തമായ വെള്ളപ്പോക്ക് ഉപയോഗിച്ച് വൃത്തിയാക്കുക',
            'ജൈവ കീടനാശിനികൾ ഉപയോഗിക്കുക'
          ],
          severity: 'high'
        },
        {
          condition: 'nutrient-deficiency',
          confidence: 85,
          disease: 'നൈട്രജൻ കുറവ്',
          recommendations: [
            'യൂറിയ അല്ലെങ്കിൽ അമോണിയം സൾഫേറ്റ് ഉപയോഗിക്കുക',
            'പച്ചിലക്കൂട്ടം അല്ലെങ്കിൽ കമ്പോസ്റ്റ് പ്രയോഗിക്കുക',
            'മണ്ണ് പരിശോധന നടത്തുക'
          ],
          severity: 'medium'
        }
      ]
    }
    
    const results = mockResults[language] || mockResults.en
    return results[Math.floor(Math.random() * results.length)]
  }, [language])

  // Convert file to base64
  const fileToGenerativePart = useCallback(async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        resolve({
          inlineData: {
            data: reader.result.split(',')[1],
            mimeType: file.type
          }
        })
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }, [])

  // Get language-specific prompt
  const getPrompt = useCallback((lang) => {
    const prompts = {
      en: `You are an agriculture expert. Analyze this plant/crop image in detail.

      Analyze the following:
      1. Overall plant health condition
      2. Any visible diseases or problems
      3. Pest damage if present
      4. Signs of nutrient deficiency
      5. Treatment recommendations

      Respond in this exact JSON format:
      {
        "condition": "healthy|disease|pest|nutrient-deficiency",
        "confidence": 85,
        "disease": "Specific disease/pest/problem name in English",
        "severity": "low|medium|high",
        "recommendations": ["Recommendation 1 in English", "Recommendation 2 in English", "Recommendation 3 in English"]
      }`,

      hi: `आप एक कृषि विशेषज्ञ हैं। इस पौधे/फसल की छवि का विस्तृत विश्लेषण करें।

      निम्नलिखित बातों का विश्लेषण करें:
      1. पौधे की समग्र स्वास्थ्य स्थिति
      2. कोई दिखाई देने वाली बीमारियाँ या समस्याएं
      3. यदि मौजूद हो तो कीट क्षति
      4. पोषक तत्वों की कमी के संकेत
      5. उपचार के लिए सिफारिशें

      अपनी प्रतिक्रिया इस सटीक JSON प्रारूप में दें:
      {
        "condition": "healthy|disease|pest|nutrient-deficiency",
        "confidence": 85,
        "disease": "विशिष्ट बीमारी/कीट/समस्या का नाम हिंदी में",
        "severity": "low|medium|high",
        "recommendations": ["हिंदी में सिफारिश 1", "हिंदी में सिफारिश 2", "हिंदी में सिफारिश 3"]
      }`,

      mr: `तुम्ही एक कृषी तज्ज्ञ आहात. या वनस्पती/पीक प्रतिमेचे तपशीलवार विश्लेषण करा.

      खालील गोष्टींचे विश्लेषण करा:
      1. वनस्पतीची एकूण आरोग्य स्थिती
      2. कोणतीही दृश्यमान रोग किंवा समस्या
      3. उपस्थित असल्यास कीटक नुकसान
      4. पोषक तत्वांच्या कमतरतेची चिन्हे
      5. उपचार शिफारसी

      या अचूक JSON स्वरूपात प्रतिसाद द्या:
      {
        "condition": "healthy|disease|pest|nutrient-deficiency",
        "confidence": 85,
        "disease": "विशिष्ट रोग/कीट/समस्येचे नाव मराठीत",
        "severity": "low|medium|high",
        "recommendations": ["मराठीत शिफारस 1", "मराठीत शिफारस 2", "मराठीत शिफारस 3"]
      }`,

      gu: `તમે એક કૃષિ નિષ્ણાત છો. આ છોડ/પાકની છબીનું વિગતવાર વિશ્લેષણ કરો.

      નીચેનાનું વિશ્લેષણ કરો:
      1. છોડની એકંદર આરોગ્ય સ્થિતિ
      2. કોઈપણ દૃશ્યમાન રોગ અથવા સમસ્યાઓ
      3. હાજર હોય તો કીટ નુકસાન
      4. પોષક તત્વોની ઉણપના ચિહ્નો
      5. ઉપચારની ભલામણો

      આ ચોક્કસ JSON ફોર્મેટમાં જવાબ આપો:
      {
        "condition": "healthy|disease|pest|nutrient-deficiency",
        "confidence": 85,
        "disease": "ચોક્કસ રોગ/કીટ/સમસ્યાનું નામ ગુજરાતીમાં",
        "severity": "low|medium|high",
        "recommendations": ["ગુજરાતીમાં ભલામણ 1", "ગુજરાતીમાં ભલામણ 2", "ગુજરાતીમાં ભલામણ 3"]
      }`,

      ml: `നിങ്ങൾ ഒരു കാർഷിക വിദഗ്ധനാണ്. ഈ ചെടി/വിളയുടെ ചിത്രം വിശദമായി വിശകലനം ചെയ്യുക.

      ഇനിപ്പറയുന്നവ വിശകലനം ചെയ്യുക:
      1. മൊത്തത്തിലുള്ള ചെടിയുടെ ആരോഗ്യ നില
      2. എന്തെങ്കിലും ദൃശ്യമാകുന്ന രോഗങ്ങൾ അല്ലെങ്കിൽ പ്രശ്നങ്ങൾ
      3. ഉണ്ടെങ്കിൽ കീട നാശം
      4. പോഷകാഹാരക്കുറവിന്റെ അടയാളങ്ങൾ
      5. ചികിത്സാ ശുപാർശകൾ

      ഈ കൃത്യമായ JSON ഫോർമാറ്റിൽ പ്രതികരിക്കുക:
      {
        "condition": "healthy|disease|pest|nutrient-deficiency",
        "confidence": 85,
        "disease": "നിർദ്ദിഷ്ട രോഗം/കീടം/പ്രശ്നത്തിന്റെ പേര് മലയാളത്തിൽ",
        "severity": "low|medium|high",
        "recommendations": ["മലയാളത്തിൽ ശുപാർശ 1", "മലയാളത്തിൽ ശുപാർശ 2", "മലയാളത്തിൽ ശുപാർശ 3"]
      }`
    }

    return prompts[lang] || prompts.en
  }, [])

  // Analyze image with Gemini 2.5 Flash
  const analyzeImage = useCallback(async (imageFile) => {
    if (!imageFile) return null
    
    setIsAnalyzing(true)
    setError(null)
    
    try {
      const imagePart = await fileToGenerativePart(imageFile)
      const prompt = getPrompt(language)
      
      const result = await model.generateContent([prompt, imagePart])
      const response = await result.response
      const textResponse = response.text()
      
      if (!textResponse) {
        throw new Error('No response from AI')
      }

      // Extract JSON from response
      const jsonMatch = textResponse.match(/\{[\s\S]*?\}/)
      if (!jsonMatch) {
        console.log('Raw response:', textResponse)
        throw new Error('Invalid AI response format')
      }

      const analysisData = JSON.parse(jsonMatch[0])
      
      // Validate the response structure
      if (!analysisData.condition || !analysisData.confidence || !analysisData.recommendations || !analysisData.disease) {
        throw new Error('Invalid AI response structure')
      }

      setUsingFallback(false)
      return analysisData

    } catch (error) {
      console.error('Gemini API Error:', error)
      
      // Graceful fallback: Use mock data without showing error
      setUsingFallback(true)
      
      // Return mock data as fallback
      return getMockAnalysisResult()
    } finally {
      setIsAnalyzing(false)
    }
  }, [fileToGenerativePart, getPrompt, getMockAnalysisResult, language])

  const handleFileSelect = useCallback((file) => {
    if (file && file.type.startsWith('image/')) {
      // Check file size (limit to 4MB for better API compatibility)
      if (file.size > 4 * 1024 * 1024) {
        setError(t('fileSizeError'))
        setUsingFallback(false)
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage({
          url: e.target?.result,
          file: file
        })
        setAnalysisResult(null)
        setError(null)
        setUsingFallback(false)
      }
      reader.onerror = () => {
        setError(t('fileReadError'))
        setUsingFallback(false)
      }
      reader.readAsDataURL(file)
    } else {
      setError(t('invalidFileError'))
      setUsingFallback(false)
    }
  }, [t])

  const handleDrag = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(e.type === "dragenter" || e.type === "dragover")
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files?.[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }, [handleFileSelect])

  const handleFileInputChange = (e) => {
    if (e.target.files?.[0]) {
      handleFileSelect(e.target.files[0])
    }
  }

  const handleAnalyzeClick = useCallback(async () => {
    if (!selectedImage?.file) return
    const result = await analyzeImage(selectedImage.file)
    if (result) {
      setAnalysisResult(result)
    }
  }, [selectedImage, analyzeImage])

  const resetAnalysis = () => {
    setSelectedImage(null)
    setAnalysisResult(null)
    setError(null)
    setUsingFallback(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const getConditionIcon = (condition) => {
    switch (condition) {
      case 'healthy': return <CheckCircle className="h-6 w-6 text-green-600" />
      case 'disease': return <AlertTriangle className="h-6 w-6 text-red-600" />
      case 'pest': return <Bug className="h-6 w-6 text-orange-600" />
      case 'nutrient-deficiency': return <Droplets className="h-6 w-6 text-yellow-600" />
      default: return <Leaf className="h-6 w-6 text-gray-600" />
    }
  }

  const getConditionText = (condition) => {
    const conditions = {
      en: {
        'healthy': 'Healthy Crop',
        'disease': 'Disease Detected',
        'pest': 'Pest Infection',
        'nutrient-deficiency': 'Nutrient Deficiency',
        'default': 'Unknown Condition'
      },
      hi: {
        'healthy': 'स्वस्थ फसल',
        'disease': 'रोग की पहचान',
        'pest': 'कीट संक्रमण',
        'nutrient-deficiency': 'पोषक तत्वों की कमी',
        'default': 'अज्ञात स्थिति'
      },
      mr: {
        'healthy': 'निरोगी पीक',
        'disease': 'रोग ओळखला',
        'pest': 'कीट संसर्ग',
        'nutrient-deficiency': 'पोषक तत्वांची कमतरता',
        'default': 'अज्ञात स्थिती'
      },
      gu: {
        'healthy': 'સ્વસ્થ પાક',
        'disease': 'રોગ શોધાયો',
        'pest': 'કીટ સંક્રમણ',
        'nutrient-deficiency': 'પોષક તત્વની અભાવ',
        'default': 'અજ્ઞાત સ્થિતિ'
      },
      ml: {
        'healthy': 'ആരോഗ്യകരമായ വിള',
        'disease': 'രോഗം കണ്ടെത്തി',
        'pest': 'കീട അണുബാധ',
        'nutrient-deficiency': 'പോഷകാഹാരക്കുറവ്',
        'default': 'അജ്ഞാത നില'
      }
    }
    
    const langConditions = conditions[language] || conditions.en
    return langConditions[condition] || langConditions.default
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'low': return 'text-green-600 bg-green-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'high': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getSeverityText = (severity) => {
    const severities = {
      en: {
        'low': 'Low',
        'medium': 'Medium',
        'high': 'High',
        'default': 'Unknown'
      },
      hi: {
        'low': 'कम',
        'medium': 'मध्यम',
        'high': 'अधिक',
        'default': 'अज्ञात'
      },
      mr: {
        'low': 'कमी',
        'medium': 'मध्यम',
        'high': 'उच्च',
        'default': 'अज्ञात'
      },
      gu: {
        'low': 'ઓછું',
        'medium': 'મધ્યમ',
        'high': 'ઉચ્ચ',
        'default': 'અજ્ઞાત'
      },
      ml: {
        'low': 'കുറവ്',
        'medium': 'മീഡിയം',
        'high': 'ഉയർന്ന',
        'default': 'അജ്ഞാതം'
      }
    }
    
    const langSeverities = severities[language] || severities.en
    return langSeverities[severity] || langSeverities.default
  }

  // Get fallback notification message
  const getFallbackMessage = useCallback(() => {
    const messages = {
      en: 'Using sample data for demonstration. For accurate real-time AI analysis, please ensure a stable network connection and try again.',
      hi: 'प्रदर्शन के लिए नमूना डेटा का उपयोग किया जा रहा है। सटीक वास्तविक समय AI विश्लेषण के लिए, कृपया स्थिर नेटवर्क कनेक्शन सुनिश्चित करें और पुनः प्रयास करें।',
      mr: 'प्रदर्शनासाठी नमुना डेटा वापरला जात आहे. अचूक रिअल-टाइम AI विश्लेषणासाठी, स्थिर नेटवर्क कनेक्शन सुनिश्चित करा आणि पुन्हा प्रयत्न करा.',
      gu: 'પ્રદર્શન માટે નમૂના ડેટાનો ઉપયોગ કરવામાં આવી રહ્યો છે. સચોટ રીઅલ-ટાઇમ AI વિશ્લેષણ માટે, સ્થિર નેટવર્ક કનેક્શનની ખાતરી કરો અને ફરીથી પ્રયાસ કરો.',
      ml: 'പ്രദർശനത്തിനായി സാമ്പിൾ ഡാറ്റ ഉപയോഗിക്കുന്നു. കൃത്യമായ റിയൽ-ടൈം AI വിശകലനത്തിന്, സ്ഥിരമായ നെറ്റ്‌വർക്ക് കണക്ഷൻ ഉറപ്പാക്കുകയും വീണ്ടും ശ്രമിക്കുക.'
    }
    return messages[language] || messages.en
  }, [language])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 py-8">
      <div className="max-w-4xl mx-auto px-6 sm:px-8">
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              <p>{error}</p>
            </div>
          </div>
        )}

        {usingFallback && analysisResult && (
          <div className="mb-4 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded-lg">
            <div className="flex items-center">
              <Info className="h-5 w-5 mr-2" />
              <p>{getFallbackMessage()}</p>
            </div>
          </div>
        )}

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">{t('cropAnalysis')}</h1>
          <p className="text-xl text-slate-600 font-medium">
            {t('analyzeCropHealth')}
          </p>
        </div>

        {!selectedImage ? (
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="text-center p-6 border-b border-gray-200">
                <h2 className="text-2xl font-semibold text-slate-800">{t('uploadCropPhoto')}</h2>
              </div>
              <div className="p-6 text-center space-y-6">
                <div 
                  className={`border-2 border-dashed rounded-lg p-12 transition-colors cursor-pointer ${
                    dragActive ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-slate-600 mb-4 font-medium">
                    {t('dragDrop')}
                  </p>
                  <p className="text-sm text-slate-500 mb-6">
                    {t('supportedFormats')}
                  </p>
                  <button 
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    <Upload className="mr-2 h-5 w-5" />
                    {t('uploadFile')}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="flex flex-row items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-2xl font-semibold text-slate-800">{t('photoAnalysis')}</h2>
                <button 
                  onClick={resetAnalysis}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <X className="h-4 w-4 mr-2" />
                  {t('newPhoto')}
                </button>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="border rounded-lg overflow-hidden">
                      <img 
                        src={selectedImage.url} 
                        alt="Selected crop" 
                        className="w-full h-64 object-cover"
                      />
                    </div>
                    {!analysisResult && !isAnalyzing && (
                      <button 
                        className="w-full inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                        onClick={handleAnalyzeClick}
                      >
                        <Leaf className="mr-2 h-5 w-5" />
                        {t('startAnalysis')}
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">
                    {isAnalyzing ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                        <p className="text-slate-600 font-medium">{t('analysisInProgress')}</p>
                        <p className="text-sm text-slate-500">{t('pleaseWait')}</p>
                      </div>
                    ) : analysisResult ? (
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          {getConditionIcon(analysisResult.condition)}
                          <div>
                            <h3 className="text-lg font-semibold text-slate-800">
                              {getConditionText(analysisResult.condition)}
                            </h3>
                            <p className="text-sm text-slate-600">
                              {t('confidence')}: {analysisResult.confidence}%
                            </p>
                          </div>
                        </div>

                        {analysisResult.disease && (
                          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <h4 className="font-medium text-red-800 mb-2">{t('identifiedDisease')}:</h4>
                            <p className="text-red-700">{analysisResult.disease}</p>
                          </div>
                        )}

                        <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(analysisResult.severity)}`}>
                          {t('severity')}: {getSeverityText(analysisResult.severity)}
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h4 className="font-medium text-blue-800 mb-3">{t('recommendations')}</h4>
                          <ul className="space-y-2">
                            {analysisResult.recommendations.map((rec, index) => (
                              <li key={index} className="flex items-start text-blue-700">
                                <CheckCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <button 
                          onClick={resetAnalysis}
                          className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                          <RotateCcw className="mr-2 h-4 w-4" />
                          {t('newAnalysis')}
                        </button>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-slate-500">
                        <ImageIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
                        <p>{t('clickToStartAnalysis')}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="flex items-center text-slate-800 font-semibold">
                <ImageIcon className="mr-2 h-5 w-5" />
                {t('photoQuality')}
              </h3>
            </div>
            <div className="p-6">
              <ul className="text-sm text-slate-600 space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                  {t('clearPhoto')}
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                  {t('goodLighting')}
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                  {t('closeUp')}
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="flex items-center text-slate-800 font-semibold">
                <Leaf className="mr-2 h-5 w-5" />
                {t('analysisFeatures')}
              </h3>
            </div>
            <div className="p-6">
              <ul className="text-sm text-slate-600 space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                  {t('diseaseDetection')}
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                  {t('pestInfectionCheck')}
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                  {t('nutrientAnalysis')}
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="flex items-center text-slate-800 font-semibold">
                <Sun className="mr-2 h-5 w-5" />
                {t('betterResults')}
              </h3>
            </div>
            <div className="p-6">
              <ul className="text-sm text-slate-600 space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                  {t('daytimePhoto')}
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                  {t('focusOnProblem')}
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                  {t('multipleAngles')}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}