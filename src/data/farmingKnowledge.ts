// Farming knowledge base for AI responses
export interface FarmingQuery {
  query: string
  response: string
  category: 'disease' | 'fertilizer' | 'irrigation' | 'weather' | 'seeds' | 'general'
  keywords: string[]
}

export const farmingKnowledgeBase: FarmingQuery[] = [
  // Disease related queries
  {
    query: 'मेरी गेहूं की फसल में पीले पत्ते हो रहे हैं',
    response: 'गेहूं में पीले पत्ते आमतौर पर नाइट्रोजन की कमी या जड़ सड़न के कारण होते हैं। तुरंत यूरिया का छिड़काव करें और जल निकासी की व्यवस्था सुधारें। यदि समस्या बनी रहे तो कृषि विशेषज्ञ से संपर्क करें।',
    category: 'disease',
    keywords: ['गेहूं', 'पीले', 'पत्ते', 'रोग', 'बीमारी']
  },
  {
    query: 'टमाटर में काले धब्बे हो रहे हैं',
    response: 'टमाटर में काले धब्बे आमतौर पर अगेती झुलसा रोग के कारण होते हैं। मैन्कोजेब या कॉपर ऑक्सीक्लोराइड का छिड़काव करें। प्रभावित पत्तियों को हटा दें और खेत में जल निकासी सुधारें।',
    category: 'disease',
    keywords: ['टमाटर', 'काले', 'धब्बे', 'झुलसा', 'रोग']
  },

  // Fertilizer related queries
  {
    query: 'खाद कब डालना चाहिए',
    response: 'खाद डालने का समय फसल पर निर्भर करता है। गेहूं में बुवाई के समय DAP और पोटाश, 20-25 दिन बाद यूरिया डालें। सब्जियों में हर 15-20 दिन में जैविक खाद डालते रहें।',
    category: 'fertilizer',
    keywords: ['खाद', 'उर्वरक', 'समय', 'डालना', 'यूरिया', 'DAP']
  },
  {
    query: 'कौन सी खाद सबसे अच्छी है',
    response: 'सबसे अच्छी खाद मिट्टी जांच के आधार पर तय होती है। आमतौर पर गोबर की खाद, कम्पोस्ट और हरी खाद सबसे अच्छी मानी जाती है। रासायनिक खाद का उपयोग मिट्टी जांच के बाद ही करें।',
    category: 'fertilizer',
    keywords: ['खाद', 'अच्छी', 'गोबर', 'कम्पोस्ट', 'जैविक']
  },

  // Irrigation related queries
  {
    query: 'कितना पानी देना चाहिए',
    response: 'पानी की मात्रा मौसम, मिट्टी और फसल पर निर्भर करती है। गेहूं में 4-5 पानी, धान में 2-3 इंच पानी खड़ा रखें। सब्जियों में रोज थोड़ा-थोड़ा पानी दें। मिट्टी में नमी देखकर पानी दें।',
    category: 'irrigation',
    keywords: ['पानी', 'सिंचाई', 'मात्रा', 'कितना']
  },
  {
    query: 'ड्रिप सिंचाई कैसे करें',
    response: 'ड्रिप सिंचाई के लिए मुख्य पाइप से ड्रिप लाइन बिछाएं। प्रत्येक पौधे के पास एमिटर लगाएं। पानी धीरे-धीरे टपकेगा। यह 50-60% पानी बचाता है और फसल की गुणवत्ता बढ़ाता है।',
    category: 'irrigation',
    keywords: ['ड्रिप', 'सिंचाई', 'एमिटर', 'पाइप']
  },

  // Weather related queries
  {
    query: 'बारिश में क्या करना चाहिए',
    response: 'बारिश के दौरान खेत में जल निकासी की व्यवस्था करें। कीटनाशक छिड़काव न करें। फसल को सहारा दें। बारिश के बाद खेत में न जाएं जब तक मिट्टी सूख न जाए।',
    category: 'weather',
    keywords: ['बारिश', 'जल निकासी', 'मानसून']
  },

  // Seeds related queries
  {
    query: 'कौन सा बीज बोना चाहिए',
    response: 'बीज का चुनाव आपके क्षेत्र की जलवायु और मिट्टी के अनुसार करें। हमेशा प्रमाणित बीज खरीदें। स्थानीय किस्म और हाइब्रिड दोनों के फायदे-नुकसान समझें। कृषि विज्ञान केंद्र से सलाह लें।',
    category: 'seeds',
    keywords: ['बीज', 'किस्म', 'प्रमाणित', 'हाइब्रिड']
  },

  // General farming queries
  {
    query: 'खेती में नुकसान हो रहा है',
    response: 'खेती में नुकसान के कई कारण हो सकते हैं। लागत कम करने के लिए जैविक खाद का उपयोग करें। उन्नत तकनीक अपनाएं। फसल बीमा कराएं। मिश्रित खेती करें। स्थानीय कृषि अधिकारी से सलाह लें।',
    category: 'general',
    keywords: ['नुकसान', 'लागत', 'फायदा', 'तकनीक']
  },
  {
    query: 'जैविक खेती कैसे करें',
    response: 'जैविक खेती के लिए रासायनिक उर्वरक और कीटनाशक का उपयोग बंद करें। गोबर की खाद, कम्पोस्ट, नीम का तेल का उपयोग करें। फसल चक्र अपनाएं। जैविक प्रमाणीकरण के लिए आवेदन करें।',
    category: 'general',
    keywords: ['जैविक', 'खेती', 'प्राकृतिक', 'कम्पोस्ट']
  }
]

// Function to find the best match for a query
export function findBestMatch(userQuery: string): FarmingQuery | null {
  const query = userQuery.toLowerCase()
  
  // First, try to find exact keyword matches
  const exactMatches = farmingKnowledgeBase.filter(item => 
    item.keywords.some(keyword => query.includes(keyword.toLowerCase()))
  )
  
  if (exactMatches.length > 0) {
    // Return the match with the most keyword matches
    return exactMatches.reduce((best, current) => {
      const bestMatches = best.keywords.filter(k => query.includes(k.toLowerCase())).length
      const currentMatches = current.keywords.filter(k => query.includes(k.toLowerCase())).length
      return currentMatches > bestMatches ? current : best
    })
  }
  
  // If no exact matches, try partial matches
  const partialMatches = farmingKnowledgeBase.filter(item =>
    item.keywords.some(keyword => 
      keyword.toLowerCase().includes(query) || query.includes(keyword.toLowerCase())
    )
  )
  
  return partialMatches.length > 0 ? partialMatches[0] : null
}

// Default response for unknown queries
export const defaultResponse = "मुझे खुशी होगी आपकी मदद करने में। कृपया अपना सवाल और विस्तार से बताएं। आप खेती, फसल, बीमारी, खाद, पानी या मौसम के बारे में पूछ सकते हैं। यदि आपका सवाल बहुत जटिल है तो कृषि विशेषज्ञ से संपर्क करने की सलाह देता हूं।"

// Function to generate AI response
export function generateAIResponse(userQuery: string): string {
  const match = findBestMatch(userQuery)
  return match ? match.response : defaultResponse
}
