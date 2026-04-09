const OPENROUTER_API_KEY = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
const OPENROUTER_MODEL = 'openai/gpt-oss-120b:free';
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

if (!OPENROUTER_API_KEY) {
  console.warn('⚠️ OPENROUTER_API_KEY is not configured in environment variables');
}

// Multilingual farming knowledge base for AI responses (fallback)
export const farmingKnowledgeBase = {
  hi: [
    // Land Price related queries
    {
      query: 'एक बीघा जमीन का भाव',
      response: 'एक बीघा जमीन का भाव क्षेत्र, स्थान और जमीन की गुणवत्ता पर निर्भर करता है। भारत में 1 बीघा = 0.67 एकड़ या लगभग 2700 वर्ग मीटर।\n\n🏞️ शहरी इलाकों में: 5-15 लाख रुपये प्रति बीघा\n🌳 अर्ध-विकसित क्षेत्रों में: 1-5 लाख रुपये प्रति बीघा\n🚜 ग्रामीण क्षेत्रों में: 50,000-2,00,000 रुपये प्रति बीघा\n💧 सिंचित जमीन: ₹2-5 लाख प्रति बीघा\n🏜️ बारानी जमीन: ₹50,000-1,50,000 प्रति बीघा\n\n📍 आपके सटीक क्षेत्र के लिए स्थानीय जमीन दलालों या पटवारी से पूछें।',
      category: 'pricing',
      keywords: ['बीघा', 'जमीन', 'भाव', 'कीमत', 'दाम', 'जमीन खरीद', 'बीघे']
    },
    {
      query: 'एक एकड़ जमीन का भाव कितना है',
      response: 'एक एकड़ जमीन की कीमत क्षेत्र, स्थान, पानी की उपलब्धता और विकास पर निर्भर करती है।\n\n📍 शहरी इलाकों के पास: 10-30 लाख रुपये प्रति एकड़\n🏢 अर्ध-विकसित क्षेत्रों में: 3-10 लाख रुपये प्रति एकड़\n🌾 ग्रामीण/सूखे क्षेत्रों में: 1-3 लाख रुपये प्रति एकड़\n💧 सिंचित क्षेत्रों में: 3-10 लाख रुपये प्रति एकड़\n\n💡 नोट: सिंचित जमीन की कीमत बारानी जमीन से 3-4 गुना अधिक होती है। अपने जिले की वर्तमान दरें जानने के लिए पटवारी या तहसील से संपर्क करें।',
      category: 'pricing',
      keywords: ['एकड़', 'जमीन', 'भाव', 'कीमत', 'दाम', 'एकड़ जमीन']
    },
    {
      query: 'खाद कब डालनी चाहिए सही समय',
      response: 'खाद डालने का सही समय फसल और मौसम पर निर्भर करता है:\n\n🌾 गेहूं:\n• बुवाई के समय: DAP (डाइअमोनियम फॉस्फेट) 46 किग्रा + पोटाश 40 किग्रा प्रति एकड़\n• 20-25 दिन बाद: पहली यूरिया फवारणी 50 किग्रा\n• 45-50 दिन बाद: दूसरी यूरिया फवारणी 50 किग्रा\n\n🌾 धान:\n• बुवाई से पहले: 10-15 टन गोबर खाद मिलाएं\n• 20 दिन की पौध में: 60 किग्रा नाइट्रोजन\n• 40 दिन पर: 30 किग्रा नाइट्रोजन\n\n🌾 कपास/मूंगफली:\n• बुवाई के 30 दिन बाद: पहली निराई के समय खाद\n• बुवाई के 60 दिन बाद: दूसरी निराई के समय\n\n🌾 सब्जियां:\n• हर 15-20 दिन में जैविक खाद या वर्मीकम्पोस्ट\n• गर्मियों में कम, सर्दियों में अधिक\n\n💡 सलाह: मिट्टी की जांच करवाकर पोषक तत्वों के अनुसार खाद डालें।',
      category: 'fertilizer',
      keywords: ['खाद', 'समय', 'कब डालें', 'सही समय', 'यूरिया', 'DAP', 'फवारणी', 'खाद कब']
    },

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
  ],
  en: [
    // Land Price related queries
    {
      query: 'Price of one bigha land',
      response: 'The price of one bigha of land depends on the region, location, and quality of the land. In India, 1 bigha = 0.67 acres or approximately 2700 square meters.\n\n🏞️ Urban areas: ₹5-15 lakhs per bigha\n🌳 Semi-developed areas: ₹1-5 lakhs per bigha\n🚜 Rural areas: ₹50,000-2,00,000 per bigha\n💧 Irrigated land: ₹2-5 lakhs per bigha\n🏜️ Rainfed land: ₹50,000-1,50,000 per bigha\n\n📍 For your exact area, consult local land brokers or the patwari (revenue officer).',
      category: 'pricing',
      keywords: ['bigha', 'land', 'price', 'cost', 'rate', 'land price']
    },
    {
      query: 'What is the price of one acre of land',
      response: 'The price of one acre of land depends on location, water availability, and development status.\n\n📍 Near urban areas: ₹10-30 lakhs per acre\n🏢 Semi-developed areas: ₹3-10 lakhs per acre\n🌾 Rural/dry areas: ₹1-3 lakhs per acre\n💧 Irrigated areas: ₹3-10 lakhs per acre\n\n💡 Note: Irrigated land prices are 3-4 times higher than rainfed land. Contact your district\'s patwari or taluka office for current rates in your area.',
      category: 'pricing',
      keywords: ['acre', 'land', 'price', 'cost', 'acre land', 'bhumi']
    },
    {
      query: 'When should I apply fertilizer correct timing',
      response: 'The correct time to apply fertilizer depends on the crop and season:\n\n🌾 Wheat:\n• At sowing: DAP (Diammonium Phosphate) 46 kg + Potash 40 kg per acre\n• 20-25 days: First urea spray 50 kg\n• 45-50 days: Second urea spray 50 kg\n\n🌾 Paddy:\n• Before sowing: Mix 10-15 tons cow manure\n• At 20-day seedling stage: 60 kg nitrogen\n• At 40 days: 30 kg nitrogen\n\n🌾 Cotton/Groundnut:\n• 30 days after sowing: At first weeding\n• 60 days after sowing: At second weeding\n\n🌾 Vegetables:\n• Every 15-20 days: Organic fertilizer or vermicompost\n• Less in summer, more in winter\n\n💡 Tip: Get soil tested and apply fertilizer based on nutrient requirements.',
      category: 'fertilizer',
      keywords: ['fertilizer', 'when', 'timing', 'apply', 'urea', 'DAP', 'schedule']
    },

    // Disease related queries
    {
      query: 'Yellow leaves are appearing in my wheat crop',
      response: 'Yellow leaves in wheat are usually caused by nitrogen deficiency or root rot. Immediately spray urea and improve drainage. If the problem persists, contact an agricultural expert.',
      category: 'disease',
      keywords: ['wheat', 'yellow', 'leaves', 'disease', 'illness']
    },
    {
      query: 'Black spots are appearing on my tomatoes',
      response: 'Black spots on tomatoes are usually caused by early blight disease. Spray Mancozeb or copper oxychloride. Remove affected leaves and improve field drainage.',
      category: 'disease',
      keywords: ['tomato', 'black', 'spots', 'blight', 'disease']
    },

    // Fertilizer related queries
    {
      query: 'Which fertilizer is the best',
      response: 'The best fertilizer is determined based on soil testing. Generally, cow dung manure, compost, and green manure are considered the best. Use chemical fertilizers only after soil testing.',
      category: 'fertilizer',
      keywords: ['fertilizer', 'best', 'cow dung', 'compost', 'organic']
    },

    // Irrigation related queries
    {
      query: 'How much water should I give',
      response: 'The amount of water depends on weather, soil, and crop. Wheat requires 4-5 irrigations, keep 2-3 inches of standing water in paddy. Give a little water daily to vegetables. Water based on soil moisture.',
      category: 'irrigation',
      keywords: ['water', 'irrigation', 'amount', 'how much']
    },
    {
      query: 'How to do drip irrigation',
      response: 'For drip irrigation, lay drip lines from the main pipe. Install emitters near each plant. Water will drip slowly. It saves 50-60% water and improves crop quality.',
      category: 'irrigation',
      keywords: ['drip', 'irrigation', 'emitter', 'pipe']
    },

    // Weather related queries
    {
      query: 'What to do in the rain',
      response: 'During rain, arrange drainage in the field. Do not spray pesticides. Provide support to the crop. Do not enter the field after rain until the soil dries.',
      category: 'weather',
      keywords: ['rain', 'drainage', 'monsoon']
    },

    // Seeds related queries
    {
      query: 'Which seed should I sow',
      response: 'Choose seeds according to your area\'s climate and soil. Always buy certified seeds. Understand the pros and cons of local varieties and hybrids. Take advice from the agricultural science center.',
      category: 'seeds',
      keywords: ['seed', 'variety', 'certified', 'hybrid']
    },

    // General farming queries
    {
      query: 'I am suffering losses in farming',
      response: 'There can be many reasons for losses in farming. Use organic manure to reduce costs. Adopt advanced techniques. Get crop insurance. Do mixed farming. Take advice from local agricultural officers.',
      category: 'general',
      keywords: ['loss', 'cost', 'benefit', 'technique']
    },
    {
      query: 'How to do organic farming',
      response: 'For organic farming, stop using chemical fertilizers and pesticides. Use cow dung manure, compost, neem oil. Adopt crop rotation. Apply for organic certification.',
      category: 'general',
      keywords: ['organic', 'farming', 'natural', 'compost']
    }
  ],
  mr: [
    // Land Price related queries
    {
      query: '१ विघा जमिनीचा भाव किती आहे',
      response: 'एक विघा जमिनीचा भाव क्षेत्र, स्थान आणि जमिनीच्या गुणवत्तेवर अवलंबून असतो। भारतात 1 विघा = 0.67 एकर किंवा अंदाजे 2700 चौ.मी.\n\n🏞️ शहरी भागात: 5-15 लाख रुपये प्रति विघा\n🌳 अर्धविकसित भागात: 1-5 लाख रुपये प्रति विघा\n🚜 ग्रामीण भागात: 50,000-2,00,000 रुपये प्रति विघा\n💧 सिंचित जमीन: 2-5 लाख रुपये प्रति विघा\n🏜️ बारानी जमीन: 50,000-1,50,000 रुपये प्रति विघा\n\n📍 आपल्या क्षेत्राच्या सटीक दरांसाठी स्थानिक जमीन दलाल किंवा पटवारी याला विचारा.',
      category: 'pricing',
      keywords: ['विघा', 'जमीन', 'भाव', 'कीमत', 'दर']
    },
    {
      query: '१ एकर जमिनीचा भाव किती आहे',
      response: 'एक एकर जमिनीचा भाव स्थान, पाण्याची उपलब्धता आणि विकास स्थितीवर अवलंबून असतो.\n\n📍 शहरी भागाच्या जवळ: 10-30 लाख रुपये प्रति एकर\n🏢 अर्धविकसित भागात: 3-10 लाख रुपये प्रति एकर\n🌾 ग्रामीण/सूख भागात: 1-3 लाख रुपये प्रति एकर\n💧 सिंचित भागात: 3-10 लाख रुपये प्रति एकर\n\n💡 सूचना: सिंचित जमिनीचा भाव बारानी जमिनीपेक्षा 3-4 पट जास्त असतो. आपल्या जिल्ह्यातील सध्याच्या दरांसाठी पटवारी किंवा तहसील कार्यालयाशी संपर्क साधा.',
      category: 'pricing',
      keywords: ['एकर', 'जमीन', 'भाव', 'कीमत', 'दर']
    },
    {
      query: 'खत कधी टाकावे सही समय',
      response: 'खत टाकण्याचा सही समय पिकावर आणि ऋतूवर अवलंबून असतो:\n\n🌾 गहू:\n• लागवडीच्या वेळी: DAP 46 किग्रा + पोटाश 40 किग्रा प्रति एकर\n• 20-25 दिवसांनंतर: पहिली यूरिया फवारणी 50 किग्रा\n• 45-50 दिवसांनंतर: दूसरी यूरिया फवारणी 50 किग्रा\n\n🌾 भात:\n• लागवडीआधी: 10-15 टन गोबर खत मिलवा\n• 20 दिवसांच्या रोपणीमध्ये: 60 किग्रा नायट्रोजन\n• 40 दिवसांनी: 30 किग्रा नायट्रोजन\n\n🌾 कापूस/मूंगफळी:\n• लागवडीच्या 30 दिवसांनंतर: पहिल्या निराईच्या वेळी\n• लागवडीच्या 60 दिवसांनंतर: दूसऱ्या निराईच्या वेळी\n\n🌾 भाजीपाला:\n• प्रत्येक 15-20 दिवसांनी: सेंद्रिय खत किंवा केंचुव्याचा खाद\n• उन्हाळ्यात कमी, हिवाळ्यात जास्त\n\n💡 सूचना: मातीची तपासणी करून पोषक तत्वांनुसार खत टाका.',
      category: 'fertilizer',
      keywords: ['खत', 'समय', 'कधी', 'यूरिया', 'DAP', 'फवारणी']
    },

    // Disease related queries
    {
      query: 'माझ्या गहूच्या पिकात पिवळी पाने येत आहेत',
      response: 'गहू मध्ये पिवळी पाने सामान्यत: नायट्रोजनच्या कमतरतेमुळे किंवा मूळ सडण्यामुळे होतात. ताबडतोब युरिया फवारणी करा आणि पाणी वाहण्याची व्यवस्था सुधारा. समस्या कायम राहिल्यास कृषि तज्ज्ञाशी संपर्क साधा.',
      category: 'disease',
      keywords: ['गहू', 'पिवळे', 'पाने', 'रोग', 'आजार']
    },
    {
      query: 'टोमॅटोमध्ये काळे डाग येत आहेत',
      response: 'टोमॅटोमध्ये काळे डाग सामान्यत: लवकर ब्लाइट रोगामुळे होतात. मँकोझेब किंवा कॉपर ऑक्सिक्लोराइड फवारणी करा. प्रभावित पाने काढून टाका आणि शेतात पाणी वाहून नेण्याची व्यवस्था सुधारा.',
      category: 'disease',
      keywords: ['टोमॅटो', 'काळे', 'डाग', 'झुलसा', 'रोग']
    },

    // Fertilizer related queries
    {
      query: 'कोणते खत सर्वोत्तम आहे',
      response: 'सर्वोत्तम खत माती तपासणीनुसार ठरते. सामान्यत: गोबर खत, खाद आणि हिरवी खाद सर्वोत्तम मानली जाते. रासायनिक खत माती तपासणीनंतरच वापरा.',
      category: 'fertilizer',
      keywords: ['खत', 'चांगले', 'गोबर', 'खाद', 'सेंद्रिय']
    },

    // Irrigation related queries
    {
      query: 'पाणी किती द्यावे',
      response: 'पाण्याची मात्रा हवामान, माती आणि पिकावर अवलंबून असते. गहूसाठी ४-५ पाणी, भातात २-३ इंच पाणी साठवा. भाजीपाला साठी रोज थोडे थोडे पाणी द्या. मातीत ओलावा पाहून पाणी द्या.',
      category: 'irrigation',
      keywords: ['पाणी', 'सिंचन', 'मात्रा', 'किती']
    },
    {
      query: 'ड्रिप सिंचन कसे करावे',
      response: 'ड्रिप सिंचनासाठी मुख्य पाइप पासून ड्रिप लाइन पसरा. प्रत्येक वनस्पतीजवळ एमिटर लावा. पाणी हळूहळू टपकेल. हे ५०-६०% पाणी वाचवते आणि पीक गुणवत्ता वाढवते.',
      category: 'irrigation',
      keywords: ['ड्रिप', 'सिंचन', 'एमिटर', 'पाइप']
    },

    // Weather related queries
    {
      query: 'पावसात काय करावे',
      response: 'पावसात शेतात पाणी वाहून नेण्याची व्यवस्था करा. कीटकनाशक फवारणी करू नका. पीकला आधार द्या. पावसानंतर माती कोरडी होईपर्यंत शेतात जाऊ नका.',
      category: 'weather',
      keywords: ['पाऊस', 'पाणी वाहणे', 'मान्सून']
    },

    // Seeds related queries
    {
      query: 'कोणते बियाणे पेरावे',
      response: 'बियाणे निवड तुमच्या भागाच्या हवामान आणि मातीनुसार करा. नेहमी प्रमाणित बियाणे खरेदी करा. स्थानिक वाण आणि हायब्रिड दोन्हींचे फायदे-तोटे समजून घ्या. कृषि विज्ञान केंद्राकडून सल्ला घ्या.',
      category: 'seeds',
      keywords: ['बियाणे', 'वाण', 'प्रमाणित', 'हायब्रिड']
    },

    // General farming queries
    {
      query: 'शेतीत नुकसान होत आहे',
      response: 'शेतीत नुकसानाचे अनेक कारणे असू शकतात. खर्च कमी करण्यासाठी सेंद्रिय खत वापरा. प्रगत तंत्रज्ञान अवलंबा. पीक विमा करा. मिश्रित शेती करा. स्थानिक कृषि अधिकारी कडून सल्ला घ्या.',
      category: 'general',
      keywords: ['नुकसान', 'खर्च', 'फायदा', 'तंत्रज्ञान']
    },
    {
      query: 'सेंद्रिय शेती कशी करावी',
      response: 'सेंद्रिय शेतीसाठी रासायनिक खत आणि कीटकनाशकांचा वापर बंद करा. गोबर खत, खाद, तीळ तेल वापरा. पीक चक्र अवलंबा. सेंद्रिय प्रमाणीकरणासाठी अर्ज करा.',
      category: 'general',
      keywords: ['सेंद्रिय', 'शेती', 'नैसर्गिक', 'खाद']
    }
  ],
  gu: [
    // Land Price related queries
    {
      query: 'એક વીઘા જમીનનો ભાવ',
      response: 'એક વીઘા જમીનની કીમત વિસ્તાર, સ્થાન અને જમીનની ગુણવત્તા પર આધારિત છે. ભારતમાં 1 વીઘો = 0.67 એકર અથવા લગભગ 2700 ચોક્કસ મીટર।\n\n🏞️ શહેરી વિસ્તારમાં: 5-15 લાખ રુપિયા પ્રતિ વીઘો\n🌳 અર્ધવિકસિત વિસ્તારમાં: 1-5 લાખ રુપિયા પ્રતિ વીઘો\n🚜 ગ્રામીણ વિસ્તારમાં: 50,000-2,00,000 રુપિયા પ્રતિ વીઘો\n💧 સિંચિત જમીન: 2-5 લાખ રુપિયા પ્રતિ વીઘો\n🏜️ વરસાદી જમીન: 50,000-1,50,000 રુપિયા પ્રતિ વીઘો\n\n📍 તમારા ચોક્કસ વિસ્તાર માટે સ્થાનિક જમીન દલાલ અથવા પટવારી પાસે પૂછો.',
      category: 'pricing',
      keywords: ['વીઘો', 'જમીન', 'ભાવ', 'કીમત', 'દર']
    },
    {
      query: 'એક એકર જમીનનો ભાવ કેટલો આવે',
      response: 'એક એકર જમીનની કીમત સ્થાન, પાણીની ઉપલબ્ધતા અને વિકાસ સ્થિતિ પર આધારિત છે.\n\n📍 શહેરી વિસ્તારની નજીક: 10-30 લાખ રુપિયા પ્રતિ એકર\n🏢 અર્ધવિકસિત વિસ્તારમાં: 3-10 લાખ રુપિયા પ્રતિ એકર\n🌾 ગ્રામીણ/શુષ્ક વિસ્તારમાં: 1-3 લાખ રુપિયા પ્રતિ એકર\n💧 સિંચિત વિસ્તારમાં: 3-10 લાખ રુપિયા પ્રતિ એકર\n\n💡 સૂચના: સિંચિત જમીનની કીમત વરસાદી જમીન કરતાં 3-4 ગણી વધુ હોય છે. તમારા જિલ્લાના હાલના ભાવ માટે પટવારી અથવા તહસીલ કાર્યાલય સાથે સંપર્ક કરો.',
      category: 'pricing',
      keywords: ['એકર', 'જમીન', 'ભાવ', 'કીમત', 'દર']
    },
    {
      query: 'ખાતર ક્યારે મૂકવું સાચો સમય',
      response: 'ખાતર મૂકવાનો સાચો સમય પાક અને ઋતુ પર આધારિત છે:\n\n🌾 ઘઉં:\n• વાવણીના સમયે: DAP 46 કિગ્રા + પોટાશ 40 કિગ્રા પ્રતિ એકર\n• 20-25 દિવસ બાદ: પહેલું યુરિયા સ્પ્રે 50 કિગ્રા\n• 45-50 દિવસ બાદ: બીજું યુરિયા સ્પ્રે 50 કિગ્રા\n\n🌾 ધાન:\n• વાવણીથી પહેલાં: 10-15 ટન ગોમાંસ ખાતર મિશ્રિત કરો\n• 20 દિવસનો રોપણ તબક્કો: 60 કિગ્રા નાઈટ્રોજન\n• 40 દિવસે: 30 કિગ્રા નાઈટ્રોજન\n\n🌾 કપાસ/મગફળી:\n• વાવણીથી 30 દિવસ બાદ: પહેલી નીણુ સમયે\n• વાવણીથી 60 દિવસ બાદ: બીજી નીણુ સમયે\n\n🌾 શાકભાજી:\n• દર 15-20 દિવસે: જૈવિક ખાતર અથવા કીડો કમ્પોસ્ટ\n• ઉનાળામાં ઓછું, શીતકાળમાં વધુ\n\n💡 ટીપ: માટીની તપાસ કરાવીને પોષક તત્વો અનુસાર ખાતર મૂકો.',
      category: 'fertilizer',
      keywords: ['ખાતર', 'સમય', 'ક્યારે', 'યુરિયા', 'DAP']
    },

    // Disease related queries
    {
      query: 'મારા ઘઉંના પાકમાં પીળા પાંદડા આવી રહ્યા છે',
      response: 'ઘઉંમાં પીળા પાંદડા સામાન્ય રીતે નાઇટ્રોજનની કમી અથવા મૂળ સડવાથી થાય છે. તરત જ યુરિયા છંટકાવ કરો અને પાણીના નિકાલની વ્યવસ્થા સુધારો. સમસ્યા રહે તો કૃષિ નિષ્ણાતનો સંપર્ક કરો.',
      category: 'disease',
      keywords: ['ઘઉં', 'પીળા', 'પાંદડા', 'રોગ', 'બીમારી']
    },
    {
      query: 'ટમેટામાં કાળા ડાગ આવી રહ્યા છે',
      response: 'ટમેટામાં કાળા ડાગ સામાન્ય રીતે વહેલા ઝુલસા રોગથી થાય છે. મેન્કોઝેબ અથવા કોપર ઓક્સીક્લોરાઇડ છંટકાવ કરો. અસરગ્રસ્ત પાંદડા કાઢી નાખો અને ક્ષેત્રમાં પાણીના નિકાલને સુધારો.',
      category: 'disease',
      keywords: ['ટમેટો', 'કાળા', 'ડાગ', 'ઝુલસા', 'રોગ']
    },

    // Fertilizer related queries
    {
      query: 'કયું ખાતર સૌથી સારું છે',
      response: 'સૌથી સારું ખાતર માટીની તપાસ પર આધારિત છે. સામાન્ય રીતે ગોમાંસ, કમ્પોસ્ટ અને લીલું ખાતર સૌથી સારું માનવામાં આવે છે. રાસાયણિક ખાતર માટી તપાસ પછી જ વાપરો.',
      category: 'fertilizer',
      keywords: ['ખાતર', 'સારું', 'ગોમાંસ', 'કમ્પોસ્ટ', 'જૈવિક']
    },

    // Irrigation related queries
    {
      query: 'પાણી કેટલું આપવું',
      response: 'પાણીની માત્રા હવામાન, માટી અને પાક પર આધારિત છે. ઘઉં માટે ૪-૫ પાણી, ધાનમાં ૨-૩ ઇંચ પાણી ઊભું રાખો. શાકભાજી માટે રોજ થોડું-થોડું પાણી આપો. માટીની ભેજ જોઈને પાણી આપો.',
      category: 'irrigation',
      keywords: ['પાણી', 'સિંચાઈ', 'માત્રા', 'કેટલું']
    },
    {
      query: 'ડ્રિપ સિંચાઈ કેવી રીતે કરવી',
      response: 'ડ્રિપ સિંચાઈ માટે મુખ્ય પાઇપથી ડ્રિપ લાઇન પાડો. દરેક છોડ પાસે ઇમિટર લગાવો. પાણી ધીમે-ધીમે ટપકશે. આ ૫૦-૬૦% પાણી બચાવે છે અને પાકની ગુણવત્તા વધારે છે.',
      category: 'irrigation',
      keywords: ['ડ્રિપ', 'સિંચાઈ', 'ઇમિટર', 'પાઇપ']
    },

    // Weather related queries
    {
      query: 'વરસાદમાં શું કરવું',
      response: 'વરસાદ દરમિયાન ક્ષેત્રમાં પાણીના નિકાલની વ્યવસ્થા કરો. જંતુનાશક છંટકાવ ન કરો. પાકને આધાર આપો. વરસાદ પછી માટી સુકાઈ જાય ત્યાં સુધી ક્ષેત્રમાં ન જાઓ.',
      category: 'weather',
      keywords: ['વરસાદ', 'પાણી નિકાલ', 'મોસમ']
    },

    // Seeds related queries
    {
      query: 'કયું બીજ વાવવું',
      response: 'બીજની પસંદગી તમારા વિસ્તારના વાતાવરણ અને માટી અનુસાર કરો. હંમેશા પ્રમાણિત બીજ ખરીદો. સ્થાનિક વંશ અને હાઇબ્રિડ બંનેના ફાયદા-નુકસાન સમજો. કૃષિ વિજ્ઞાન કેન્દ્રથી સલાહ લો.',
      category: 'seeds',
      keywords: ['બીજ', 'વંશ', 'પ્રમાણિત', 'હાઇબ્રિડ']
    },

    // General farming queries
    {
      query: 'ખેતીમાં નુકસાન થઈ રહ્યું છે',
      response: 'ખેતીમાં નુકસાનના અનેક કારણો હોઈ શકે છે. ખર્ચ ઘટાડવા માટે જૈવિક ખાતરનો ઉપયોગ કરો. અદ્યતન તકનીક અપનાવો. પાક વીમો કરાવો. મિશ્રિત ખેતી કરો. સ્થાનિક કૃષિ અધિકારીથી સલાહ લો.',
      category: 'general',
      keywords: ['નુકસાન', 'ખર્ચ', 'લાભ', 'તકનીક']
    },
    {
      query: 'જૈવિક ખેતી કેવી રીતે કરવી',
      response: 'જૈવિક ખેતી માટે રાસાયણિક ખાતર અને જંતુનાશકનો ઉપયોગ બંધ કરો. ગોમાંસ, કમ્પોસ્ટ, નીમ તેલનો ઉપયોગ કરો. પાક ચક્ર અપનાવો. જૈવિક પ્રમાણીકરણ માટે અરજી કરો.',
      category: 'general',
      keywords: ['જૈવિક', 'ખેતી', 'પ્રાકૃતિક', 'કમ્પોસ્ટ']
    }
  ],
  ml: [
    // Land Price related queries
    {
      query: 'ഒരു വിഘയുടെ വിലയെന്താണ്',
      response: 'ഒരു വിഘ ഭൂമിയുടെ വില പ്രദേശം, സ്ഥാനം, ഭൂമിയുടെ ഗുണനിലവാരം എന്നിവയെ ആശ്രയിച്ചിരിക്കുന്നു. ഇന്ത്യയിൽ 1 വിഘ = 0.67 ഏക്കർ അല്ലെങ്കിൽ ഏകദേശം 2700 ചതുരശ്ര മീറ്റർ।\n\n🏞️ നഗരപ്രദേശങ്ങളിൽ: 5-15 ലക്ഷം രൂപ കോ വിഘ\n🌳 പകുതിയോ വികസിത പ്രദേശങ്ങളിൽ: 1-5 ലക്ഷം രൂപ കോ വിഘ\n🚜 ഗ്രാമപ്രദേശങ്ങളിൽ: 50,000-2,00,000 രൂപ കോ വിഘ\n💧 സേചന നിലങ്ങൾ: 2-5 ലക്ഷം രൂപ കോ വിഘ\n🏜️ വർഷാശ്രിത നിലങ്ങൾ: 50,000-1,50,000 രൂപ കോ വിഘ\n\n📍 നിങ്ങളുടെ പ്രത്യേക പ്രദേശത്തിനായി പ്രാദേശിക ഭൂമി ദലാളിൽ നിന്നോ പട്ടോളിൽ നിന്നോ ചോദിക്കുക.',
      category: 'pricing',
      keywords: ['വിഘ', 'ഭൂമി', 'വില', 'കിയ', 'നിരക്']
    },
    {
      query: 'ഒരു ഏക്കറിന്റെ വിലയെന്താണ്',
      response: 'ഒരു ഏക്കർ ഭൂമിയുടെ വില സ്ഥാനം, ജലലഭ്യത, വികാസ നിലവാരം എന്നിവയെ ആശ്രയിച്ചിരിക്കുന്നു.\n\n📍 നഗരപ്രദേശത്തിനടുത്ത്: 10-30 ലക്ഷം രൂപ കോ ഏക്കർ\n🏢 പകുതിയോ വികസിത പ്രദേശങ്ങളിൽ: 3-10 ലക്ഷം രൂപ കോ ഏക്കർ\n🌾 ഗ്രാമപ്രദേശങ്ങൾ/വരണ്ട പ്രദേശങ്ങളിൽ: 1-3 ലക്ഷം രൂപ കോ ഏക്കർ\n💧 സേചന പ്രദേശങ്ങളിൽ: 3-10 ലക്ഷം രൂപ കോ ഏക്കർ\n\n💡 കുറിപ്പ്: സേചന നിലങ്ങളുടെ വില വർഷാശ്രിത നിലങ്ങളുടെ വിലയുടെ 3-4 മടങ്ങ് കൂടുതലാണ്. നിങ്ങളുടെ ജില്ലയിലെ നിലവിലെ നിരക്കിനായി പട്ടോളിനോ തഹസീൽ കാര്യാലയത്തോട് സമീപിക്കുക.',
      category: 'pricing',
      keywords: ['ഏക്കർ', 'ഭൂമി', 'വില', 'കിയ', 'നിരക്']
    },
    {
      query: 'വിതരണം എപ്പോൾ ചെയ്യണം ശരിയായ സമയം',
      response: 'വിതരണം ചെയ്യുന്നതിനുള്ള ശരിയായ സമയം വിളയെയും സീസണിനെയും ആശ്രയിച്ചിരിക്കുന്നു:\n\n🌾 ഗോതമ്പ്:\n• വിതരണത്തിനു സമയമായി: DAP 46 കിലോഗ്രാം + പൊട്ടാഷ് 40 കിലോഗ്രാം കോ ഏക്കർ\n• 20-25 ദിവസത്തിനുശേഷം: ആദ്യം യുറിയ സ്പ്രേ 50 കിലോഗ്രാം\n• 45-50 ദിവസത്തിനുശേഷം: രണ്ടാം യുറിയ സ്പ്രേ 50 കിലോഗ്രാം\n\n🌾 നെൽ:\n• വിതരണത്തിനു മുമ്പായി: 10-15 ടൺ പശുക്കൂട കലർത്തുക\n• 20 ദിവസത്തെ നാണ്യം: 60 കിലോഗ്രാം നൈട്രജൻ\n• 40 ദിവസത്തിൽ: 30 കിലോഗ്രാം നൈട്രജൻ\n\n🌾 പരുപ്പ്/വിലാങ്ങി:\n• വിതരണത്തിന് 30 ദിവസത്തിനുശേഷം: ആദ്യ കളഞ്ഞ സമയത്ത്\n• വിതരണത്തിന് 60 ദിവസത്തിനുശേഷം: രണ്ടാം കളഞ്ഞ സമയത്ത്\n\n🌾 പച്ചക്കറികൾ:\n• ഓരോ 15-20 ദിവസത്തിലും: ജൈവ വിതരണം അല്ലെങ്കിൽ വെർമികമ്പോസ്റ്റ്\n• വേനലിൽ കുറവ്, ശീതകാലത്ത് കൂടുതല്\n\n💡 സഹായി: മണ്ണ് പരിശോധിപ്പിച്ച് പോഷക ആവശ്യ അനുസരിച്ച് വിതരണം ചെയ്യുക.',
      category: 'fertilizer',
      keywords: ['വിതരണം', 'സമയം', 'എപ്പോൾ', 'യുറിയ', 'DAP']
    },

    // Disease related queries
    {
      query: 'എന്റെ ഗോതമ്പ് നാറ്റിൽ പച്ച ഇലകൾ വരുന്നു',
      response: 'ഗോതമ്പിൽ പച്ച ഇലകൾ സാധാരണയായി നൈട്രജൻ കുറവോ അല്ലെങ്കിൽ വേരു ചോർച്ചയോ കാരണമാണ്. ഉടൻ യുറിയ സ്പ്രേ ചെയ്യുകയും ജലനിർഗമനം മെച്ചപ്പെടുത്തുകയും ചെയ്യുക. പ്രശ്നം തുടരുകയാണെങ്കിൽ കൃഷി വിദഗ്ധനെ സമീപിക്കുക.',
      category: 'disease',
      keywords: ['ഗോതമ്പ്', 'പച്ച', 'ഇലകൾ', 'രോഗം', 'നോയ്']
    },
    {
      query: 'എന്റെ തക്കാളിയിൽ കറുത്ത പാടുകൾ വരുന്നു',
      response: 'തക്കാളിയിൽ കറുത്ത പാടുകൾ സാധാരണയായി നേരത്തെ ബ്ലൈറ്റ് രോഗം കാരണമാണ്. മങ്കോസെബോ അല്ലെങ്കിൽ കോപ്പർ ഓക്സിക്ലോറൈഡ് സ്പ്രേ ചെയ്യുക. ബാധിത ഇലകൾ നീക്കം ചെയ്യുകയും വയൽ ഡ്രെയിനേജ് മെച്ചപ്പെടുത്തുകയും ചെയ്യുക.',
      category: 'disease',
      keywords: ['തക്കാളി', 'കറുത്ത', 'പാടുകൾ', 'ബ്ലൈറ്റ്', 'രോഗം']
    },

    // Fertilizer related queries
    {
      query: 'ഏത് വിതരണം നല്ലത്',
      response: 'ഏറ്റവും നല്ല വിതരണം മണ്ണ് പരിശോധനയെ ആശ്രയിച്ചിരിക്കുന്നു. സാധാരണയായി പശുക്കൂട, കമ്പോസ്റ്റ്, പച്ച വിതരണം നല്ലത്. രാസ വിതരണം മണ്ണ് പരിശോധനയ്ക്ക് ശേഷം മാത്രം.',
      category: 'fertilizer',
      keywords: ['വിതരണം', 'നല്ല', 'പശുക്കൂട', 'കമ്പോസ്റ്റ്', 'ജൈവ']
    },

    // Irrigation related queries
    {
      query: 'എത്ര വെള്ളം നൽകണം',
      response: 'വെള്ളത്തിന്റെ അളവ് കാലാവസ്ഥ, മണ്ണ്, വിള എന്നിവയെ ആശ്രയിച്ചിരിക്കുന്നു. ഗോതമ്പിന് 4-5 വെള്ളം, നെൽ 2-3 ഇഞ്ച് നിൽത്തുക. പച്ചക്കറികൾക്ക് ദിവസവും അല്പം. മണ്ണിലെ ഈർപ്പം കാണിച്ച് വെള്ളം.',
      category: 'irrigation',
      keywords: ['വെള്ളം', 'നീർതാരം', 'അളവ്', 'എത്ര']
    },
    {
      query: 'ഡ്രിപ് നീർതാരം എങ്ങനെ',
      response: 'ഡ്രിപ് നീർതാരത്തിന് പ്രധാന പൈപ്പിൽ നിന്ന് ഡ്രിപ് ലൈൻ വിരിക്കുക. ഓരോ ചെടിക്കരികെയും എമിറ്റർ ഇടുക. വെള്ളം പതുക്കെ കുപ്പിവീഴ്ച. ഇത് 50-60% വെള്ളം സേവ് ചെയ്യുന്നു, വിള ഗുണനിലവാരം വർദ്ധിപ്പിക്കുന്നു.',
      category: 'irrigation',
      keywords: ['ഡ്രിപ്', 'നീർതാരം', 'എമിറ്റർ', 'പൈപ്പ്']
    },

    // Weather related queries
    {
      query: 'മഴയിൽ എന്ത് ചെയ്യണം',
      response: 'മഴയിൽ വയലിൽ ജലനിർഗമനം ക്രമീകരിക്കുക. കീടനാശിനി സ്പ്രേ ചെയ്യരുത്. വിളയ്ക്ക് പിന്തുണ നൽകുക. മഴയ്ക്ക് ശേഷം മണ്ണ് വരണ്ടുപോകുന്നതുവരെ വയലിൽ പോകരുത്.',
      category: 'weather',
      keywords: ['മഴ', 'ജലനിർഗമനം', 'മൻസൂൾ']
    },

    // Seeds related queries
    {
      query: 'ഏത് വിത്ത് വിതയ്ക്കണം',
      response: 'വിത്ത് തിരഞ്ഞെടുക്കൽ നിങ്ങളുടെ പ്രദേശത്തിന്റെ കാലാവസ്ഥയും മണ്ണും അനുസരിച്ച്. എപ്പോഴും സർട്ടിഫൈഡ് വിത്ത് വാങ്ങുക. സ്ഥാനീയ ഇനങ്ങളും ഹൈബ്രിഡുകളും ഗുണങ്ങളും ദോഷങ്ങളും മനസ്സിലാക്കുക. കൃഷി വിജ്ഞാന കേന്ദ്രത്തിൽ നിന്ന് ഉപദേശം തേടുക.',
      category: 'seeds',
      keywords: ['വിത്ത്', 'ഇനം', 'സർട്ടിഫൈഡ്', 'ഹൈബ്രിഡ്']
    },

    // General farming queries
    {
      query: 'കൃഷിയിൽ നഷ്ടം സംഭവിക്കുന്നു',
      response: 'കൃഷിയിലെ നഷ്ടത്തിന് പല കാരണങ്ങൾ ഉണ്ടാകാം. ചെലവ് കുറയ്ക്കാൻ ജൈവ വിതരണം ഉപയോഗിക്കുക. അഡ്വാൻസ്ഡ് ടെക്നിക്കുകൾ അവലംബിക്കുക. വിള ബീമ പോളിസി എടുക്കുക. മിക്സഡ് ഫാമിങ് ചെയ്യുക. പ്രാദേശിക കൃഷി ഉദ്യോഗസ്ഥനിൽ നിന്ന് ഉപദേശം തേടുക.',
      category: 'general',
      keywords: ['നഷ്ടം', 'ചെലവ്', 'ലാഭം', 'ടെക്നിക്ക്']
    },
    {
      query: 'ജൈവ കൃഷി എങ്ങനെ',
      response: 'ജൈവ കൃഷിക്കായി രാസ വിതരണവും കീടനാശിനികളും ഉപയോഗിക്കരുത്. പശുക്കൂട, കമ്പോസ്റ്റ്, വേപ്പ് എണ്ണ ഉപയോഗിക്കുക. വിള ചക്രം അവലംബിക്കുക. ജൈവ സർട്ടിഫിക്കേഷനായി അപേക്ഷിക്കുക.',
      category: 'general',
      keywords: ['ജൈവ', 'കൃഷി', 'പ്രകൃതി', 'കമ്പോസ്റ്റ്']
    }
  ]
}

// Multilingual default response for unknown queries
export const defaultResponse = {
  en: "I'd be happy to help you. Please tell me your question in more detail. You can ask about farming, crops, diseases, fertilizers, water or weather.",
  hi: "मुझे खुशी होगी आपकी मदद करने में। कृपया अपना सवाल और विस्तार से बताएं। आप खेती, फसल, बीमारी, खाद, पानी या मौसम के बारे में पूछ सकते हैं।",
  mr: "मला मदत करण्यात आनंद होईल. कृपया तुमचा प्रश्न अधिक तपशीलवार सांगा.",
  gu: "મને મદદ કરવામાં આનંદ થશે. કૃપા કરીને તમારો પ્રશ્ન વધુ વિગતવાર કહો.",
  ml: "ഞാൻ സന്തോഷത്തോടെ സഹായിക്കാം. ദയവായി നിങ്ങളുടെ ചോദ്യം കൂടുതൽ വിശദമായി പറയുക."
};

// Enhanced markdown cleaning function
export const cleanMarkdown = (text) => {
  if (!text) return '';
  
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/_(.*?)_/g, '$1')
    .replace(/~~(.*?)~~/g, '$1')
    .replace(/`(.*?)`/g, '$1')
    .replace(/\n\s*[*\-•]\s*/g, '\n• ')
    .replace(/\d+\.\s*/g, '')
    .replace(/\n\s*\n/g, '\n')
    .replace(/ +/g, ' ')
    .trim();
};

// Timeout function for API calls
const withTimeout = (promise, timeoutMs = 25000) => {
  return Promise.race([
    promise,
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout')), timeoutMs)
    )
  ]);
};

export async function generateAIResponse(query, language = 'en') {
  if (!query?.trim()) return '';

  const fallbackResponses = {
    en: "I apologize, but I'm having trouble generating a response right now. Please try again in a few moments.",
    hi: "मैं क्षमा चाहता हूं, लेकिन अभी जवाब तैयार करने में समस्या हो रही है। कृपया कुछ क्षणों में पुनः प्रयास करें।",
    mr: "मला माफ करा, पण आत्ता प्रतिसाद निर्माण करण्यात अडचण येत आहे.",
    gu: "હું માફી માંગુ છું, પરંતુ હમણાં જવાબ જનરેટ કરવામાં સમસ્યા આવી રહી છે.",
    ml: "ക്ഷമിക്കണം, എന്നാൽ ഇപ്പോൾ ഒരു പ്രതികരണം സൃഷ്ടിക്കുന്നതിൽ ഞാൻ പ്രശ്നം അനുഭവിക്കുന്നു."
  };

  const prompts = {
    en: `You are an agricultural expert assistant for Indian farmers. Provide helpful, practical advice in English.\n\nQuestion: ${query}\n\nGive clear, actionable advice in simple language. Keep response under 180 words.`,
    
    hi: `आप भारतीय किसानों के लिए कृषि विशेषज्ञ सहायक हैं। निम्नलिखित प्रश्न का हिंदी में व्यावहारिक उत्तर दें:\n\nप्रश्न: ${query}\n\nसरल भाषा में स्पष्ट सलाह दें। उत्तर 180 शब्दों से कम रखें।`,
    
    mr: `तुम भारतीय शेतकऱ्यांसाठी कृषी तज्ञ आहात. खालील प्रश्नाचे मराठीत सोपे उत्तर द्या:\n\nप्रश्न: ${query}\n\nव्यावहारिक सल्ला द्या. उत्तर १८० शब्दांपेक्षा कमी ठेवा.`,
    
    gu: `તમે ભારતીય ખેડૂતો માટે કૃષિ નિષ્ણાત સહાયક છો. નીચેના પ્રશ્નનો ગુજરાતીમાં વ્યવહારુ જવાબ આપો:\n\nપ્રશ્ન: ${query}\n\nસરળ ભાષામાં સ્પષ્ટ સલાહ આપો. જવાબ 180 શબ્દોથી ઓછો રાખો.`,
    
    ml: `നിങ്ങൾ ഇന്ത്യൻ കർഷകർക്കായുള്ള കൃഷി വിദഗ്ധ സഹായിയാണ്. ചോദ്യത്തിന് മലയാളത്തിൽ പ്രായോഗിക ഉത്തരം നൽകുക:\n\nചോദ്യം: ${query}\n\nലളിതമായ ഭാഷയിൽ ഉപയോഗപ്രദമായ ഉപദേശം നൽകുക. 180 വാക്കുകൾക്കുള്ളിൽ നിർത്തുക.`
  };

  const prompt = prompts[language] || prompts['en'];

  // Try OpenRouter API
  try {
    if (!OPENROUTER_API_KEY) {
      throw new Error('OpenRouter API key not configured');
    }

    const response = await withTimeout(
      fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
          'X-Title': 'Farming AI Assistant',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: OPENROUTER_MODEL,
          messages: [
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 600,
        }),
      }),
      30000 // 30 second timeout
    );

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    const aiText = data.choices?.[0]?.message?.content;

    if (aiText && aiText.trim()) {
      return cleanMarkdown(aiText);
    }
  } catch (error) {
    console.error('OpenRouter API Error:', error.message);
    // Fall through to knowledge base
  }

  // Fallback to knowledge base
  try {
    const match = findBestMatch(query, language);
    if (match?.response) {
      return match.response;
    }
  } catch (fbError) {
    console.error('Knowledge base error:', fbError);
  }

  // Final fallback
  return defaultResponse[language] || defaultResponse['en'];
}

// Find best match from knowledge base
export function findBestMatch(userQuery, language = 'en') {
  const base = farmingKnowledgeBase[language] || farmingKnowledgeBase['hi'];
  const query = userQuery.toLowerCase().trim();

  let bestMatch = null;
  let highestScore = 0;

  for (const item of base) {
    let score = 0;
    for (const keyword of item.keywords) {
      const k = keyword.toLowerCase();
      if (query.includes(k)) score += 3;
      if (k.includes(query)) score += 2;
    }
    if (score > highestScore) {
      highestScore = score;
      bestMatch = item;
    }
  }

  if (highestScore >= 2) return bestMatch;

  // Partial match fallback
  return base.find(item =>
    item.keywords.some(kw => 
      query.includes(kw.toLowerCase()) || kw.toLowerCase().includes(query)
    )
  ) || null;
}

export { fallbackResponses_old as fallbackResponses };