/**
 * Advanced Voice Command Matching Engine
 * NLP-based keyword detection with fuzzy matching and multilingual support
 * Handles: intent detection, action word matching, scoring logic
 */

/**
 * Intent Keywords Dictionary
 * Maps intents to keywords in multiple languages with variations
 */
const INTENT_KEYWORDS = {
  HOME: {
    en: ['home', 'homepage', 'main', 'start', 'dashboard'],
    hi: ['होम', 'घर', 'मुख्य', 'शुरुआत', 'डैशबोर्ड', 'होम'],
    mr: ['होम', 'घर', 'मुख्य', 'शुरुआत'],
    gu: ['હોમ', 'ઘર', 'મુખ્ય', 'શરૂ'],
    ml: ['ഹോം', 'വീട്', 'പ്രധാന', 'ആരംഭം'],
  },
  WEATHER: {
    en: ['weather', 'forecast', 'climate', 'temperature', 'rain', 'wind', 'cold', 'hot', 'sunny'],
    hi: ['मौसम', 'पूर्वानुमान', 'जलवायु', 'तापमान', 'बारिश', 'हवा', 'ठंड', 'गर्म', 'धूप'],
    mr: ['हवामान', 'भविष्य', 'जलवायु', 'तापमान', 'पाऊस', 'वारा'],
    gu: ['હવામાન', 'આબોહવા', 'તાપમાન', 'વરસાદ', 'પવન'],
    ml: ['കാലാവസ്ഥ', 'കാലാവസ്ഥയ്ക്കുള്ള', 'വഹിരം', 'താപനില', 'മഴ'],
  },
  MARKET: {
    en: ['market', 'prices', 'mandi', 'rates', 'price', 'cost', 'value', 'trade'],
    hi: ['बाजार', 'कीमत', 'मंडी', 'दर', 'भाव', 'मूल्य'],
    mr: ['बाजार', 'भाव', 'दर', 'मंडी', 'किंमत'],
    gu: ['બાજાર', 'ભાવ', 'દર', 'મંડી', 'કિંમત'],
    ml: ['വിപണി', 'വില', 'നിരക്ക്', 'മണ്ഡി', 'വിലകൾ'],
  },
  SCHEMES: {
    en: ['scheme', 'schemes', 'benefits', 'government', 'subsidy', 'grant', 'aid', 'program', 'yojana'],
    hi: ['योजना', 'योजनाएं', 'लाभ', 'सरकारी', 'सब्सिडी', 'अनुदान', 'सहायता', 'कार्यक्रम'],
    mr: ['योजना', 'लाभ', 'सरकारी', 'अनुदान', 'कार्यक्रम'],
    gu: ['યોજના', 'યોજનાઓ', 'લાભ', 'સરકારી', 'સબસિડી', 'અનુદાન'],
    ml: ['പദ്ധതി', 'പദ്ധതികൾ', 'പ്രയോജനങ്ങൾ', 'സർക്കാരി', 'സബ്സിഡി'],
  },
  KCC: {
    en: ['kcc', 'kisan credit card', 'credit card', 'loan', 'credit', 'borrowing', 'financial'],
    hi: [' क्रेडिट कार्ड', 'केसीसी', 'क्रेडिट कार्ड', 'ऋण', 'क्रेडिट', 'उधार', 'वित्तीय'],
    mr: [' क्रेडिट कार्ड', 'केसीसी', 'क्रेडिट कार्ड', 'कर्ज', 'क्रेडिट'],
    gu: [' ક્રેડિટ કાર્ડ', 'કે.સી.સી.', 'ક્રેડિટ કાર્ડ', 'લોન', 'ક્રેડિટ'],
    ml: ['കിസാൻ ക്രെഡിറ്റ് കാർഡ്', 'കെസിസി', 'ക്രെഡിറ്റ് കാർഡ്', 'വായ്പ', 'ക്രെഡിറ്റ്'],
  },
  CROP: {
    en: ['crop', 'crops', 'analysis', 'disease', 'pest', 'plant', 'farming', 'farm', 'harvest'],
    hi: ['फसल', 'फसलें', 'विश्लेषण', 'रोग', 'कीट', 'पौधा', 'खेती', 'खेत', 'फसल कट'],
    mr: ['पीक', 'पिकांचा', 'विश्लेषण', 'रोग', 'कीटक', 'वनस्पती', 'शेती'],
    gu: ['પસલ', 'પસલો', 'વિશ્લેષણ', 'રોગ', 'જંતુ', 'છોડ', 'ખેતી', 'ક્ષેત્ર'],
    ml: ['വിള', 'വിളകൾ', 'വിശകലനം', 'രോഗം', 'കീടം', 'ചെടി', 'കൃഷി', 'കൃഷിയോ'],
  },
  VOICE: {
    en: ['voice', 'assistant', 'help', 'support', 'talk', 'chat', 'speak'],
    hi: ['वॉइस', 'असिस्टेंट', 'सहायता', 'समर्थन', 'बात', 'चैट', 'बोलो'],
    mr: ['व्हॉइस', 'सहायक', 'मदत', 'समर्थन', 'बोल'],
    gu: ['વોઇસ', 'સહાયક', 'મદદ', 'સમર્થન', 'વાત'],
    ml: ['ശബ്ദം', 'സഹായി', 'സഹായ', 'പിന്തുണ', 'സംസാരിക്കുക'],
  },
  ELIGIBILITY: {
    en: ['eligibility', 'eligible', 'check', 'qualify', 'qualify', 'criteria', 'requirement'],
    hi: ['पात्रता', 'पात्र', 'जांच', 'योग्य', 'मानदंड', 'आवश्यकता'],
    mr: ['पात्रता', 'पात्र', 'तपास', 'योग्य', 'निकष'],
    gu: ['પાત્રતા', 'પાત્ર', 'તપાસ', 'યોગ્ય', 'માપદંડ'],
    ml: ['യോഗ്യത', 'യോഗ്യ', 'പരിശോധിക്കുക', 'ഇനം', 'മാനദണ്ഡം'],
  },
};

/**
 * Action Words
 * Verbs that indicate what to do (open, show, check, etc.)
 */
const ACTION_WORDS = {
  en: ['open', 'show', 'go', 'check', 'start', 'see', 'view', 'display', 'tell', 'give', 'get'],
  hi: ['खोलो', 'दिखाओ', 'जाओ', 'जांचो', 'शुरू करो', 'देखो', 'बताओ', 'दो', 'लो'],
  mr: ['उघडा', 'दाखवा', 'जा', 'तपास', 'सुरू करा', 'बघ', 'सांग'],
  gu: ['ખોલો', 'બતાવો', 'જાઓ', 'તપાસો', 'શરૂ કરો', 'જુઓ', 'કહો'],
  ml: ['തുറക്കുക', 'കാണിക്കുക', 'പോകുക', 'പരിശോധിക്കുക', 'ആരംഭിക്കുക', 'കാണുക'],
};

/**
 * Routes mapping for commands
 */
const COMMAND_ROUTES = {
  HOME: '/',
  WEATHER: '/weather',
  MARKET: '/market-prices',
  SCHEMES: '/schemes',
  ELIGIBILITY: '/schemes/eligibility-checker',
  KCC: '/kcc-application',
  CROP: '/crop-analysis',
  VOICE: '/voice-assistant',
};

/**
 * Normalize text for matching
 */
export function normalizeTextAdvanced(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[.,!?;:\-'"()[\]{}]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Calculate Levenshtein distance for fuzzy matching
 */
function levenshteinDistance(str1: string, str2: string): number {
  const track = Array(str2.length + 1)
    .fill(null)
    .map(() => Array(str1.length + 1).fill(0));

  for (let i = 0; i <= str1.length; i += 1) {
    track[0][i] = i;
  }

  for (let j = 0; j <= str2.length; j += 1) {
    track[j][0] = j;
  }

  for (let j = 1; j <= str2.length; j += 1) {
    for (let i = 1; i <= str1.length; i += 1) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      track[j][i] = Math.min(
        track[j][i - 1] + 1,
        track[j - 1][i] + 1,
        track[j - 1][i - 1] + indicator
      );
    }
  }

  return track[str2.length][str1.length];
}

/**
 * Fuzzy match with tolerance (0.8 = 80% similarity required)
 */
function fuzzyMatch(input: string, target: string, tolerance = 0.75): boolean {
  if (input === target) return true;
  if (input.includes(target) || target.includes(input)) return true;

  const distance = levenshteinDistance(input, target);
  const maxLength = Math.max(input.length, target.length);
  const similarity = 1 - distance / maxLength;

  return similarity >= tolerance;
}

/**
 * Find keywords in text with scoring
 */
function findKeywords(
  normalizedText: string,
  keywords: Record<string, Record<string, string[]>>,
  language: string
): { [intent: string]: number } {
  const words = normalizedText.split(' ');
  const scores: { [intent: string]: number } = {};

  Object.entries(keywords).forEach(([intent, langKeywords]) => {
    const keywordList: string[] = (langKeywords as Record<string, string[]>)[language] || [];
    let score = 0;

    keywordList.forEach((keyword: string) => {
      // Exact word match
      if (words.includes(keyword)) {
        score += 2;
      }
      // Fuzzy word match
      else if (words.some((word) => fuzzyMatch(word, keyword, 0.7))) {
        score += 1.5;
      }
      // Substring match
      else if (normalizedText.includes(keyword)) {
        score += 1;
      }
      // Fuzzy substring match
      else if (fuzzyMatch(normalizedText, keyword, 0.75)) {
        score += 0.5;
      }
    });

    if (score > 0) scores[intent] = score;
  });

  return scores;
}

/**
 * Main command matching function
 */
export interface MatchResult {
  intent: string | null;
  route: string | null;
  confidence: number;
  matchType: 'exact' | 'fuzzy' | 'keyword' | 'none';
  debug: {
    normalizedText: string;
    intentScores: { [key: string]: number };
    hasActionWord: boolean;
    language: string;
  };
}

export function matchVoiceCommand(
  transcript: string,
  language: string = 'en'
): MatchResult {
  const normalized = normalizeTextAdvanced(transcript);

  console.log('[VOICE-MATCH] 🎯 Matching started', { transcript, normalized, language });

  // Check for action words
  const actionWordList = ACTION_WORDS[language as keyof typeof ACTION_WORDS] || [];
  const hasActionWord = actionWordList.some(
    (action) => normalized.includes(action) || fuzzyMatch(normalized, action, 0.7)
  );

  console.log('[VOICE-MATCH] 🔍 Action word check:', { hasActionWord, actionWordList });

  // Find matching intents
  const intentScores = findKeywords(normalized, INTENT_KEYWORDS, language);
  console.log('[VOICE-MATCH] 📊 Intent scores:', intentScores);

  if (Object.keys(intentScores).length === 0) {
    console.log('[VOICE-MATCH] ❌ No intent matched');
    return {
      intent: null,
      route: null,
      confidence: 0,
      matchType: 'none',
      debug: {
        normalizedText: normalized,
        intentScores,
        hasActionWord,
        language,
      },
    };
  }

  // Get highest scoring intent
  const topIntent = Object.entries(intentScores).sort(([, a], [, b]) => b - a)[0];
  const [intent, score] = topIntent;

  // Calculate confidence (0-1)
  const maxPossibleScore = 10; // Adjust based on keyword density
  const confidence = Math.min(score / maxPossibleScore, 1);

  console.log('[VOICE-MATCH] ✅ Match found:', {
    intent,
    score,
    confidence,
  });

  const route = COMMAND_ROUTES[intent as keyof typeof COMMAND_ROUTES] || null;

  return {
    intent,
    route,
    confidence,
    matchType: confidence > 0.5 ? 'keyword' : 'fuzzy',
    debug: {
      normalizedText: normalized,
      intentScores,
      hasActionWord,
      language,
    },
  };
}

/**
 * Export for component usage
 */
export { COMMAND_ROUTES };
