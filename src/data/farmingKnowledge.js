import { GoogleGenerativeAI } from '@google/generative-ai'

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

// Multilingual farming knowledge base for AI responses (fallback)
export const farmingKnowledgeBase = {
  hi: [
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
  ],
  en: [
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
      query: 'When should I apply fertilizer',
      response: 'The timing of fertilizer application depends on the crop. For wheat, apply DAP and potash at sowing time, urea after 20-25 days. For vegetables, apply organic fertilizer every 15-20 days.',
      category: 'fertilizer',
      keywords: ['fertilizer', 'nutrient', 'time', 'apply', 'urea', 'DAP']
    },
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
    // Disease related queries
    {
      query: 'माझ्या गहूच्या पिकात पिवळी पाने येत आहेत',
      response: 'गहू मध्ये पिवळी पाने सामान्यत: नायट्रोजनच्या कमतरतेमुळे किंवा मूळ सडण्यामुळे होतात. ताबडतोब युरिया फवारणी करा आणि पाणी वाहण्याची व्यवस्था सुधारा. समस्या कायम राहिल्यास कृषी तज्ज्ञाशी संपर्क साधा.',
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
      query: 'खत कधी टाकावे',
      response: 'खत टाकण्याचा वेळ पिकावर अवलंबून असतो. गहूसाठी लागवडीच्या वेळी DAP आणि पोटॅश, २०-२५ दिवसांनंतर युरिया टाका. भाजीपाला साठी दर १५-२० दिवसांत सेंद्रिय खत टाकत राहा.',
      category: 'fertilizer',
      keywords: ['खत', 'खते', 'वेळ', 'टाकणे', 'युरिया', 'DAP']
    },
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
      response: 'बियाणे निवड तुमच्या भागाच्या हवामान आणि मातीनुसार करा. नेहमी प्रमाणित बियाणे खरेदी करा. स्थानिक वाण आणि हायब्रिड दोन्हींचे फायदे-तोटे समजून घ्या. कृषी विज्ञान केंद्राकडून सल्ला घ्या.',
      category: 'seeds',
      keywords: ['बियाणे', 'वाण', 'प्रमाणित', 'हायब्रिड']
    },

    // General farming queries
    {
      query: 'शेतीत नुकसान होत आहे',
      response: 'शेतीत नुकसानाचे अनेक कारणे असू शकतात. खर्च कमी करण्यासाठी सेंद्रिय खत वापरा. प्रगत तंत्रज्ञान अवलंबा. पीक विमा करा. मिश्रित शेती करा. स्थानिक कृषी अधिकारी कडून सल्ला घ्या.',
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
      query: 'ખાતર ક્યારે મૂકવું',
      response: 'ખાતર મૂકવાનો સમય પાક પર આધારિત છે. ઘઉં માટે વાવણીના સમયે DAP અને પોટાશ, ૨૦-૨૫ દિવસ પછી યુરિયા મૂકો. શાકભાજી માટે દર ૧૫-૨૦ દિવસે સેવાઈખાતર મૂકતા રહો.',
      category: 'fertilizer',
      keywords: ['ખાતર', 'ઉર્વરક', 'સમય', 'મૂકવું', 'યુરિયા', 'DAP']
    },
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
      query: 'ഉരവിട്ട് എപ്പോൾ വയ്ക്കണം',
      response: 'ഉരവിട്ട് വയ്ക്കുന്ന സമയം വിളയെ ആശ്രയിച്ചിരിക്കുന്നു. ഗോതമ്പിന് വിതറുന്ന സമയത്ത് DAP, പൊട്ടാഷ്, 20-25 ദിവസത്തിന് ശേഷം യുറിയ. പച്ചക്കറികൾക്ക് 15-20 ദിവസത്തിലൊരിക്കൽ ജൈവ ഉരവിട്ട്.',
      category: 'fertilizer',
      keywords: ['ഉരവിട്ട്', 'പോഷകം', 'സമയം', 'വയ്ക്കുക', 'യുറിയ', 'DAP']
    },
    {
      query: 'ഏത് ഉരവിട്ട് നല്ലത്',
      response: 'ഏറ്റവും നല്ല ഉരവിട്ട് മണ്ണ് പരിശോധനയെ ആശ്രയിച്ചിരിക്കുന്നു. സാധാരണയായി ആട്ടിൻകുടം, കമ്പോസ്റ്റ്, പച്ച ഉരവിട്ട് നല്ലത്. രാസ ഉരവിട്ട് മണ്ണ് പരിശോധനയ്ക്ക് ശേഷം മാത്രം.',
      category: 'fertilizer',
      keywords: ['ഉരവിട്ട്', 'നല്ല', 'ആട്ടിൻകുടം', 'കമ്പോസ്റ്റ്', 'ജൈവ']
    },

    // Irrigation related queries
    {
      query: 'എത്ര വെള്ളം നൽകണം',
      response: 'വെള്ളത്തിന്റെ അളവ് കാലാവസ്ഥ, മണ്ണ്, വിള എന്നിവയെ ആശ്രയിച്ചിരിക്കുന്നു. ഗോതമ്പിന് 4-5 വെള്ളം, നെല്ലിൽ 2-3 ഇഞ്ച് വെള്ളം നിർത്തുക. പച്ചക്കറികൾക്ക് ദിവസവും അല്പം. മണ്ണിലെ ഈർപ്പം കാണിച്ച് വെള്ളം.',
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
      keywords: ['മഴ', 'ജലനിർഗമനം', 'മൺസൂൺ']
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
      response: 'കൃഷിയിലെ നഷ്ടത്തിന് പല കാരണങ്ങൾ ഉണ്ടാകാം. ചെലവ് കുറയ്ക്കാൻ ജൈവ ഉരവിട്ട് ഉപയോഗിക്കുക. അഡ്വാൻസ്ഡ് ടെക്നിക്കുകൾ അവലംബിക്കുക. വിള ബീമ പോളിസി എടുക്കുക. മിക്സഡ് ഫാമിങ് ചെയ്യുക. പ്രാദേശിക കൃഷി ഉദ്യോഗസ്ഥനിൽ നിന്ന് ഉപദേശം തേടുക.',
      category: 'general',
      keywords: ['നഷ്ടം', 'ചെലവ്', 'ലാഭം', 'ടെക്നിക്ക്']
    },
    {
      query: 'ജൈവ കൃഷി എങ്ങനെ',
      response: 'ജൈവ കൃഷിക്കായി രാസ ഉരവിട്ടും കീടനാശിനികളും ഉപയോഗിക്കരുത്. ആട്ടിൻകുടം, കമ്പോസ്റ്റ്, വേപ്പ് എണ്ണ ഉപയോഗിക്കുക. വിള ചക്രം അവലംബിക്കുക. ജൈവ സർട്ടിഫിക്കേഷനായി അപേക്ഷിക്കുക.',
      category: 'general',
      keywords: ['ജൈവ', 'കൃഷി', 'പ്രകൃതി', 'കമ്പോസ്റ്റ്']
    }
  ]
}

// Multilingual default response for unknown queries (fallback)
export const defaultResponse = {
  en: "I'd be happy to help you. Please tell me your question in more detail. You can ask about farming, crops, diseases, fertilizers, water or weather. If your question is very complex, I recommend contacting an agricultural expert.",
  hi: "मुझे खुशी होगी आपकी मदद करने में। कृपया अपना सवाल और विस्तार से बताएं। आप खेती, फसल, बीमारी, खाद, पानी या मौसम के बारे में पूछ सकते हैं। यदि आपका सवाल बहुत जटिल है तो कृषि विशेषज्ञ से संपर्क करने की सलाह देता हूं।",
  mr: "मला मदत करण्यात आनंद होईल. कृपया तुमचा प्रश्न अधिक तपशीलवार सांगा. तुम्ही शेती, पिक, रोग, खत, पाणी किंवा हवामानाबद्दल विचारू शकता. तुमचा प्रश्न खूप जटिल असेल तर कृषी तज्ज्ञाशी संपर्क साधण्याचा सल्ला देतो.",
  gu: "મને મદદ કરવામાં આનંદ થશે. કૃપા કરીને તમારો પ્રશ્ન વધુ વિગતવાર કહો. તમે ખેતી, પાક, રોગ, ખાતર, પાણી અથવા હવામાન વિશે પૂછી શકો છો. જો તમારો પ્રશ્ન ખૂબ જટિલ હોય તો કૃષિ નિષ્ણાતનો સંપર્ક કરવાની સલાહ આપું છું.",
  ml: "ഞാൻ സന്തോഷത്തോടെ സഹായിക്കാം. ദയവായി നിങ്ങളുടെ ചോദ്യം കൂടുതൽ വിശദമായി പറയുക. നിങ്ങൾ കൃഷി, വിളകൾ, രോഗങ്ങൾ, ഉരവിട്ട്, വെള്ളം അല്ലെങ്കിൽ കാലാവസ്ഥയെക്കുറിച്ച് ചോദിക്കാം. നിങ്ങളുടെ ചോദ്യം വളരെ സങ്കീർണ്ണമാണെങ്കിൽ കൃഷി വിദഗ്ധനെ സമീപിക്കാൻ ഞാൻ ശുപാർശ ചെയ്യുന്നു."
}

// Enhanced markdown cleaning function
export const cleanMarkdown = (text) => {
  if (!text) return '';
  
  return text
    // Remove markdown formatting
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/_(.*?)_/g, '$1')
    .replace(/~~(.*?)~~/g, '$1')
    .replace(/`(.*?)`/g, '$1')
    
    // Clean up bullet points and lists
    .replace(/\n\s*[*\-•]\s*/g, '\n• ')
    .replace(/\d+\.\s*/g, '')
    
    // Remove extra newlines and spaces
    .replace(/\n\s*\n/g, '\n')
    .replace(/ +/g, ' ')
    .trim();
};

// Timeout function for API calls
const withTimeout = (promise, timeoutMs) => {
  return Promise.race([
    promise,
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout')), timeoutMs)
    )
  ]);
};

export async function generateAIResponse(query, language = 'en') {
  if (!query.trim()) return '';

  const fallbackResponses = {
    en: "I apologize, but I'm having trouble generating a response right now. Please try again in a few moments or contact our support team for immediate assistance.",
    hi: "मैं क्षमा चाहता हूं, लेकिन अभी जवाब तैयार करने में समस्या हो रही है। कृपया कुछ क्षणों में पुनः प्रयास करें या तत्काल सहायता के लिए हमारी सहायता टीम से संपर्क करें।",
    mr: "मला माफ करा, पण आत्ता प्रतिसाद निर्माण करण्यात अडचण येत आहे. कृपया काही क्षणांत पुन्हा प्रयत्न करा किंवा तातडीच्या मदतीसाठी आमच्या समर्थन संघाशी संपर्क साधा.",
    gu: "હું માફી માંગુ છું, પરંતુ હમણાં જવાબ જનરેટ કરવામાં સમસ્યા આવી રહી છે. કૃપા કરીને થોડી ક્ષણોમાં ફરી પ્રયાસ કરો અથવા તાત્કાલિક સહાય માટે અમારી સપોર્ટ ટીમનો સંપર્ક કરો.",
    ml: "ക്ഷമിക്കണം, എന്നാൽ ഇപ്പോൾ ഒരു പ്രതികരണം സൃഷ്ടിക്കുന്നതിൽ ഞാൻ പ്രശ്നം അനുഭവിക്കുന്നു. കുറച്ച് നിമിഷങ്ങൾക്കുള്ളിൽ വീണ്ടും ശ്രമിക്കുക അല്ലെങ്കിൽ തൽക്ഷണ സഹായത്തിന് ഞങ്ങളുടെ പിന്തുണ ടീമിൽ ബന്ധപ്പെടുക."
  };

  const prompts = {
    en: `You are an agricultural expert assistant for Indian farmers. Provide helpful, practical advice for the following question in English:

Question: ${query}

Please provide:
1. Clear, actionable advice
2. Specific recommendations if applicable
3. Any precautions or warnings
4. Keep response under 150 words
5. Use simple, easy-to-understand language

Focus on practical farming solutions that Indian farmers can implement.`,

    hi: `आप भारतीय किसानों के लिए एक कृषि विशेषज्ञ सहायक हैं। निम्नलिखित प्रश्न का उत्तर हिंदी में दें:

प्रश्न: ${query}

कृपया निम्नलिखित प्रदान करें:
1. स्पष्ट, व्यावहारिक सलाह
2. विशिष्ट सिफारिशें यदि लागू हों
3. कोई सावधानियां या चेतावनियां
4. उत्तर 150 शब्दों से कम रखें
5. सरल, आसानी से समझ में आने वाली भाषा का प्रयोग करें

व्यावहारिक खेती समाधानों पर ध्यान दें जिन्हें भारतीय किसान लागू कर सकते हैं।`,

    mr: `तुम एक कृषी तज्ञ सहायक आहात भारतीय शेतकऱ्यांसाठी. खालील प्रश्नाचे उत्तर मराठीत द्या:

प्रश्न: ${query}

कृपया पुरवा:
1. स्पष्ट, व्यावहारिक सल्ला
2. विशिष्ट शिफारसी लागू असल्यास
3. कोणतीही सावधगिरी किंवा चेतावणी
4. उत्तर 150 शब्दांपेक्षा कमी ठेवा
5. सोपी, समजण्यास सोपी भाषा वापरा

व्यावहारिक शेती उपायांवर लक्ष केंद्रित करा जे भारतीय शेतकरी लागू करू शकतात.`,

    gu: `તમે ભારતીય ખેડૂતો માટે કૃષિ નિષ્ણાત સહાયક છો. નીચેના પ્રશ્નનો જવાબ ગુજરાતીમાં આપો:

પ્રશ્ન: ${query}

કૃપા કરીને પ્રદાન કરો:
1. સ્પષ્ટ, વ્યવહારુ સલાહ
2. ચોક્કસ ભલામણો જો લાગુ પડતી હોય
3. કોઈપણ સાવચેતીઓ અથવા ચેતવણીઓ
4. જવાબ 150 શબ્દોથી ઓછો રાખો
5. સરળ, સમજવામાં સરળ ભાષા વાપરો

વ્યવહારુ ખેતી ઉકેલો પર ધ્યાન કેન્દ્રિત કરો જે ભારતીય ખેડૂતો લાગુ કરી શકે છે.`,

    ml: `നിങ്ങൾ ഇന്ത്യൻ കർഷകർക്കായുള്ള ഒരു കൃഷി വിദഗ്ധ സഹായിയാണ്. ഇനിപ്പറയുന്ന ചോദ്യത്തിന് മലയാളത്തിൽ ഉപയോഗപ്രദമായ ഉത്തരം നൽകുക:

ചോദ്യം: ${query}

ദയവായി നൽകുക:
1. വ്യക്തമായ, പ്രായോഗിക ഉപദേശം
2. പ്രത്യേക ശുപാർശകൾ ബാധകമാണെങ്കിൽ
3. എന്തെങ്കിലും മുൻകരുതലുകൾ അല്ലെങ്കിൽ മുന്നറിയിപ്പുകൾ
4. പ്രതികരണം 150 വാക്കുകൾക്കുള്ളിൽ നിലനിർത്തുക
5. ലളിതമായ, മനസ്സിലാക്കാൻ എളുപ്പമുള്ള ഭാഷ ഉപയോഗിക്കുക

ഇന്ത്യൻ കർഷകർക്ക് നടപ്പിലാക്കാൻ കഴിയുന്ന പ്രായോഗിക കാർഷിക പരിഹാരങ്ങളിൽ ശ്രദ്ധ കേന്ദ്രീകരിക്കുക।`
  };

  const prompt = prompts[language] || prompts['en'];
  
  // First, try Gemini API via SDK with timeout
  try {
    if (!GEMINI_API_KEY) {
      throw new Error('API key not configured');
    }

    const result = await withTimeout(
      model.generateContent(prompt),
      20000 // 20 second timeout
    );
    
    const response = await result.response;
    const aiText = response.text();

    // If Gemini returns a valid response, clean and use it
    if (aiText && aiText.trim()) {
      const cleanedText = cleanMarkdown(aiText);
      return cleanedText;
    }
  } catch (error) {
    console.error('Gemini integration error:', error);
    // Fall back to knowledge base for all languages
  }

  // Fallback to knowledge base for all languages, or generic fallback
  try {
    const match = await withTimeout(
      Promise.resolve(findBestMatch(query, language)),
      20000 // 2 second timeout for fallback
    );
    
    return match ? match.response : defaultResponse[language] || defaultResponse['en'];
  } catch (timeoutError) {
    console.error('Fallback timeout:', timeoutError);
    return fallbackResponses[language] || fallbackResponses['en'];
  }
}

// Function to find the best match for a query (updated for multilingual support)
export function findBestMatch(userQuery, language = 'en') {
  const base = farmingKnowledgeBase[language] || farmingKnowledgeBase['hi'];
  const query = userQuery.toLowerCase()
  
  // First, try to find exact keyword matches
  const exactMatches = base.filter(item => 
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
  const partialMatches = base.filter(item =>
    item.keywords.some(keyword => 
      keyword.toLowerCase().includes(query) || query.includes(keyword.toLowerCase())
    )
  )
  
  return partialMatches.length > 0 ? partialMatches[0] : null
}

// src/data/farmingKnowledge.js
const fallbackResponses = [
  "Sorry, I didn’t get that.",
  "Can you repeat that?",
  "Hmm, I’m not sure about that topic yet."
];



export { fallbackResponses as fallbackResponses };