/**
 * Production-Grade Voice Command Matching Engine
 * Multilingual keyword-based intent detection with fuzzy matching
 * Supports: English, Hindi, Marathi, Gujarati, Malayalam, Mixed (Hinglish)
 */

/**
 * COMPREHENSIVE KEYWORD DATASETS FOR ALL INTENTS
 * Organized by intent with language-specific variations
 */
const KEYWORDS_BY_INTENT = {
  GO_TO_HOME: {
    primary: [
      // English
      'home', 'homepage', 'main', 'dashboard', 'landing', 'start', 'home page',
      'beginning', 'first', 'initial', 'main page', 'go home',
      // Hindi
      'होम', 'घर', 'मुख्य पेज', 'शुरू', 'होम पेज', 'घर जाओ', 'मुख्य',
      'पहला पेज', 'शुरुआत', 'मुख्य पृष्ठ', 'घर खोलो', 'होम खोलो',
      // Marathi
      'होम', 'घर', 'मुख्य पान', 'सुरुवात', 'मुख्य स्क्रीन', 'पहिला पृष्ठ',
      // Gujarati
      'હોમ', 'ઘર', 'મુખ્ય પેજ', 'શરૂઆત', 'પ્રથમ પેજ',
      // Malayalam
      'ഹോം', 'വീട്', 'പ്രധാന പേജ്', 'തുടക്കം', 'വീട്ടിലേക്ക്',
      // Mixed/Hinglish
      'home kholo', 'ghar kholo', 'home jao', 'ghaar chalao',
    ],
    synonyms: ['main', 'start', 'beginning', 'initial', 'first page'],
    weight: 1.0,
  },

  OPEN_WEATHER: {
    primary: [
      // English
      'weather', 'climate', 'temperature', 'rain', 'forecast', 'humidity',
      'today weather', 'weather info', 'weather report', 'wind', 'cold', 'hot',
      'sunny', 'cloudy', 'timing', 'atmospheric', 'mausam', 'weather check',
      // Hindi
      'मौसम', 'बारिश', 'तापमान', 'मौसम जानकारी', 'आज का मौसम',
      'मौसम रिपोर्ट', 'हवा', 'ठंडी', 'गर्म', 'धूप', 'बादल', 'तूफान',
      'तापमान चेक करो', 'मौसम बताओ', 'आज कैसा है',
      // Marathi
      'हवामान', 'पाऊस', 'तापमान', 'वातावरण', 'हवा', 'बार', 'आज कसे',
      // Gujarati
      'હવામાન', 'વરસાદ', 'તાપમાન', 'હવા', 'તોફાન',
      // Malayalam
      'കാലാവസ്ഥ', 'മഴ', 'താപനില', 'കാറ്റ്', 'വിജ്ഞാപനം',
      // Mixed/Hinglish
      'weather batao', 'mausam dikhao', 'weather dekho', 'rain check',
      'temperature batao', 'aaj kaisa hai', 'weather status',
    ],
    synonyms: ['climate', 'weather', 'rain', 'temperature', 'forecast'],
    weight: 1.2,
  },

  OPEN_MARKET: {
    primary: [
      // English
      'market', 'prices', 'mandi', 'rates', 'price', 'cost', 'value',
      'market prices', 'mandi rates', 'commodity', 'trading', 'buy', 'sell',
      'trade', 'stock', 'market price', 'going rate', 'quotation', 'market check',
      // Hindi
      'बाजार', 'कीमत', 'मंडी', 'दर', 'भाव', 'मूल्य', 'मंडी भाव',
      'बाजार का भाव', 'सामान की कीमत', 'कृषि मंडी', 'अनाज की कीमत',
      'दरें', 'भाव चेक करो', 'कीमत बताओ',
      // Marathi
      'बाजार', 'भाव', 'दर', 'मंडी', 'किंमत', 'मंडी भाव', 'कमोडिटी',
      // Gujarati
      'બાજાર', 'ભાવ', 'દર', 'મંડી', 'કિંમત', 'દામ',
      // Malayalam
      'വിപണി', 'വില', 'നിരക്ക്', 'മണ്ഡി', 'വിലകൾ', 'സാധനം',
      // Mixed/Hinglish
      'market dekho', 'prices batao', 'mandi rates', 'market dikhao',
      'kya rate hai', 'bhav check karo', 'commodities price',
    ],
    synonyms: ['market', 'prices', 'rate', 'cost', 'mandi'],
    weight: 1.1,
  },

  OPEN_SCHEMES: {
    primary: [
      // English
      'scheme', 'schemes', 'government schemes', 'yojana', 'benefits',
      'subsidy', 'grant', 'aid', 'program', 'government program',
      'government benefits', 'subsidy scheme', 'government aid',
      'scheme list', 'available schemes',
      // Hindi
      'योजना', 'योजनाएं', 'सरकारी योजना', 'स्कीम', 'लाभ',
      'अनुदान', 'सहायता', 'सरकारी सहायता', 'किसान योजना', 'सब्सिडी',
      'योजना की जानकारी', 'योजना बताओ', 'कौन सी योजना',
      // Marathi
      'योजना', 'सरकारी योजना', 'योजना माहिती', 'लाभ', 'अनुदान',
      'सहायता', 'किसान योजना',
      // Gujarati
      'યોજના', 'સરકારી યોજના', 'લાભ', 'અનુદાન', 'સહાય',
      // Malayalam
      'പദ്ധതി', 'സർക്കാർ പദ്ധതി', 'പ്രയോജനങ്ങൾ', 'സബ്സിഡി', 'സാഹായ്യം',
      // Mixed/Hinglish
      'yojana dikhao', 'scheme batao', 'scheme open', 'yojana ka list',
      'schemes available', 'gov scheme', 'sarkaari yojana',
    ],
    synonyms: ['scheme', 'schemes', 'yojana', 'benefits', 'government'],
    weight: 1.3,
  },

  OPEN_CROP_ANALYSIS: {
    primary: [
      // English
      'crop', 'analysis', 'scan', 'detect', 'plant', 'disease',
      'check crop', 'crop disease', 'analyze', 'identify', 'health check',
      'plant disease', 'pest', 'farming', 'farm', 'harvest', 'crop health',
      'disease detection', 'crop problem', 'crop check',
      // Hindi
      'फसल', 'जांच', 'विश्लेषण', 'स्कैन', 'रोग', 'कीट',
      'फसल की जांच', 'फसल का रोग', 'पौधे का रोग', 'फसल विश्लेषण',
      'खेती की जानकारी', 'फसल समस्या', 'रोग चिन्हित करो',
      // Marathi
      'पीक', 'तपासणी', 'विश्लेषण', 'रोग', 'कीटक', 'शेती',
      'पीकाचा विश्लेषण', 'पीकाचा रोग', 'समस्या तपास',
      // Gujarati
      'પાક', 'તપાસ', 'વિશ્લેષણ', 'રોગ', 'જંતુ', 'ખેતી',
      'પાકનો રોગ',
      // Malayalam
      'വിള', 'പരിശോധന', 'വിശകലനം', 'രോഗം', 'കീടം', 'കൃഷി',
      'വിള രോഗം', 'കീട നിയന്ത്രണം',
      // Mixed/Hinglish
      'crop check karo', 'crop analysis', 'photo se check', 'plant disease',
      'crop ke liye', 'farmland check', 'disease pata lagao',
    ],
    synonyms: ['crop', 'analysis', 'disease', 'plant', 'farm'],
    weight: 1.2,
  },

  OPEN_KCC_APPLICATION: {
    primary: [
      // English (CRITICAL - HIGH WEIGHT KEYWORDS)
      'kcc', 'loan', 'credit', 'farmer loan', ' credit card',
      'agriculture loan', 'agricultural credit', 'credit facility', 'borrowing',
      'kcc application', 'kcc apply', 'loan apply', 'apply loan', 'credit apply',
      'farm loan', 'agricultural loan', 'financing', 'kisan loan',
      // Hindi
      'केसीसी', 'ऋण', 'लोन', 'क्रेडिट', ' क्रेडिट कार्ड',
      'खेती का लोन', 'आर्थिक सहायता', 'वित्तीय सहायता',
      'केसीसी के लिए आवेदन करो', 'लोन के लिए', 'क्रेडिट कार्ड', 'किसान लोन',
      // Marathi
      'केसीसी', 'कर्ज', 'लोन', 'क्रेडिट', ' क्रेडिट कार्ड',
      'कृषि कर्ज', 'आर्थिक मदद', ' लोन',
      // Gujarati
      'કેઝીસી', 'લોન', 'ક્રેડિટ', 'કર્જ', ' ક્રેડિટ કાર્ડ',
      'ખેતી લોન', 'આર્થિક સહાય', 'ખેડૂત લોન',
      // Malayalam
      'കെസിസി', 'വായ്പ', 'കർഷക വായ്പ', 'കർഷക ക്രെഡിറ്റ് കാർഡ്',
      'ധനസഹായം', 'കർഷക ആനുകൂല്യം',
      // Mixed/Hinglish
      'kcc apply', 'loan apply', 'credit apply', ' credit card',
      'kcc kholo', 'loan le', 'kcc ke liye', 'loan available', ' loan',
      'kcc eligibility', 'kcc check', 'kcc ke liye apply',
    ],
    synonyms: ['kcc', 'loan', 'credit', 'farming'],
    weight: 1.5, // HIGH PRIORITY
  },

  OPEN_VOICE_ASSISTANT: {
    primary: [
      // English
      'voice', 'assistant', 'mic', 'microphone', 'speak', 'talk',
      'voice mode', 'voice command', 'voice chat', 'help', 'support',
      'voice help', 'ask', 'question', 'query', 'voice check',
      // Hindi
      'वॉइस', 'असिस्टेंट', 'माइक', 'बोलो', 'बातचीत', 'सहायता',
      'आवाज', 'सवाल पूछो', 'जानकारी चाहिए', 'मदद चाहिए',
      // Marathi
      'व्हॉइस', 'असिस्टंट', 'माइक', 'बोला', 'मदत', 'सहायता',
      // Gujarati
      'વોઇસ', 'આસિસ્ટન્ટ', 'માઇક', 'બોલો', 'મદદ', 'સહાય',
      // Malayalam
      'വോയ്സ്', 'അസിസ്റ്റന്റ്', 'സംസാരിക്കുക', 'മദ്ദ', 'സഹായം',
      // Mixed/Hinglish
      'mic kholo', 'voice chalu', 'bolo', 'baat karo', 'assistant call',
      'help le', 'voice help', 'mic use',
    ],
    synonyms: ['voice', 'assistant', 'help', 'mic', 'speak'],
    weight: 1.0,
  },

  ELIGIBILITY_CHECKER: {
    primary: [
      // English
      'eligibility', 'eligible', 'check', 'qualify', 'criteria',
      'requirement', 'eligible check', 'am i eligible', 'can i apply',
      'eligibility criteria', 'eligibility check', 'eligible check',
      // Hindi
      'पात्रता', 'पात्र', 'जांच', 'योग्य', 'मापदंड', 'आवश्यकता',
      'क्या मैं योग्य हूं', 'क्या मैं आवेदन कर सकता हूं', 'योग्यता जांच',
      // Marathi
      'पात्रता', 'पात्र', 'तपास', 'योग्य', 'निकष', 'आवश्यकता',
      // Gujarati
      'પાત્રતા', 'પાત્ર', 'તપાસ', 'યોગ્ય', 'માપદંડ',
      // Malayalam
      'യോഗ്യത', 'യോഗ്യ', 'പരിശോധിക്കുക', 'മാനദണ്ഡം', 'ആവശ്യകത',
      // Mixed/Hinglish
      'eligibility check', 'qualify check', 'criteria dikhao',
      'kya main eligible hu', 'apply kar sakta hu',
    ],
    synonyms: ['eligibility', 'check', 'qualify', 'eligible'],
    weight: 1.1,
  },
};

/**
 * ACTION WORDS (OPTIONAL BUT BOOST CONFIDENCE)
 * Verbs that indicate intent to perform action
 */
const ACTION_WORDS = {
  en: [
    'open', 'show', 'go', 'check', 'start', 'navigate', 'display',
    'tell', 'give', 'get', 'see', 'view', 'apply', 'use', 'call',
  ],
  hi: [
    'खोलो', 'दिखाओ', 'जाओ', 'जांचो', 'शुरू करो', 'देखो', 'बताओ',
    'दो', 'लो', 'चलाओ', 'उपयोग करो', 'आवेदन करो',
  ],
  mr: [
    'उघडा', 'दाखवा', 'जा', 'तपास', 'सुरू करा', 'बघ', 'सांग',
    'दे', 'घे', 'लागू करा',
  ],
  gu: [
    'ખોલો', 'બતાવો', 'જાઓ', 'તપાસો', 'શરૂ કરો', 'જુઓ', 'કહો',
    'આપો', 'લો', 'ઉપયોગ કરો',
  ],
  ml: [
    'തുറക്കുക', 'കാണിക്കുക', 'പോകുക', 'പരിശോധിക്കുക', 'ആരംഭിക്കുക',
    'കാണുക', 'പറയുക', 'കൊടുക്കുക', 'ഉപയോഗിക്കുക',
  ],
};

/**
 * Normalize text for matching
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[.,!?;:\-'"()[\]{}]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Calculate Levenshtein distance for fuzzy matching
 * Returns similarity score 0-1 (1 = perfect match)
 */
function levenshteinDistance(str1: string, str2: string): number {
  const track = Array(str2.length + 1)
    .fill(null)
    .map(() => Array(str1.length + 1).fill(0));

  for (let i = 0; i <= str1.length; i++) track[0][i] = i;
  for (let j = 0; j <= str2.length; j++) track[j][0] = j;

  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
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
 * Fuzzy match with tolerance
 * tolerance: 0-1 (0.7 = 70% similarity required)
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
 * Split text into words/tokens
 */
function tokenize(text: string): string[] {
  return text.split(/\s+/).filter((t) => t.length > 0);
}

/**
 * Score a single intent against normalized text
 */
function scoreIntent(
  normalizedText: string,
  intentKeywords: typeof KEYWORDS_BY_INTENT[keyof typeof KEYWORDS_BY_INTENT],
  text: string
): number {
  let score = 0;
  const tokens = tokenize(normalizedText);

  // Check primary keywords
  for (const keyword of intentKeywords.primary) {
    const normalizedKeyword = normalizeText(keyword);

    // Exact word match (highest score)
    if (tokens.includes(normalizedKeyword)) {
      score += 3;
      console.log(`[MATCH] ✅ Exact word: "${keyword}" → +3`);
    }
    // Fuzzy word match in tokens (high score)
    else if (tokens.some((token) => fuzzyMatch(token, normalizedKeyword, 0.75))) {
      score += 2;
      console.log(`[MATCH] 🔄 Fuzzy word: "${keyword}" → +2`);
    }
    // Substring match (medium score)
    else if (normalizedText.includes(normalizedKeyword)) {
      score += 1.5;
      console.log(`[MATCH] 📍 Substring: "${keyword}" → +1.5`);
    }
    // Fuzzy substring match (low score)
    else if (fuzzyMatch(normalizedText, normalizedKeyword, 0.8)) {
      score += 1;
      console.log(`[MATCH] 🌊 Fuzzy substring: "${keyword}" → +1`);
    }
  }

  // Bonus for action words
  const language = 'en'; // Default to English for action words
  const actionWordList = ACTION_WORDS[language as keyof typeof ACTION_WORDS] || [];
  if (actionWordList.some((action) => normalizedText.includes(normalizeText(action)))) {
    score += 0.5;
    console.log(`[MATCH] 🎯 Action word detected → +0.5`);
  }

  return score * intentKeywords.weight;
}

/**
 * Main command matching function
 */
export type CommandAction =
  | 'GO_TO_HOME'
  | 'OPEN_WEATHER'
  | 'OPEN_MARKET'
  | 'OPEN_SCHEMES'
  | 'OPEN_CROP_ANALYSIS'
  | 'OPEN_KCC_APPLICATION'
  | 'OPEN_VOICE_ASSISTANT'
  | 'OPEN_ELIGIBILITY'
  | 'UNKNOWN';

export interface MatchResult {
  action: CommandAction;
  confidence: number; // 0-1
  matchedKeywords: string[];
  debug: {
    normalizedText: string;
    intentScores: { [key: string]: number };
    topIntent: string;
    language: string;
  };
}

export function matchVoiceCommand(
  transcript: string,
  language: string = 'en'
): MatchResult {
  const normalized = normalizeText(transcript);

  console.log('\n╔════════════════════════════════════════════════════╗');
  console.log('║        [VOICE MATCH] Starting Analysis              ║');
  console.log('╠════════════════════════════════════════════════════╣');
  console.log(`║ Input: "${transcript}"`);
  console.log(`║ Normalized: "${normalized}"`);
  console.log(`║ Language: ${language}`);
  console.log('╚════════════════════════════════════════════════════╝\n');

  // Score all intents
  const intentScores: { [key: string]: number } = {};
  let maxScore = 0;
  let topIntent = 'UNKNOWN';

  for (const [intent, keywords] of Object.entries(KEYWORDS_BY_INTENT)) {
    const score = scoreIntent(normalized, keywords as any, transcript);
    intentScores[intent] = score;

    console.log(`📊 ${intent}: ${score.toFixed(2)}`);

    if (score > maxScore) {
      maxScore = score;
      topIntent = intent;
    }
  }

  console.log('\n───────────────────────────────────────────────────\n');

  // Determine action based on top intent
  const actionMap: { [key: string]: CommandAction } = {
    GO_TO_HOME: 'GO_TO_HOME',
    OPEN_WEATHER: 'OPEN_WEATHER',
    OPEN_MARKET: 'OPEN_MARKET',
    OPEN_SCHEMES: 'OPEN_SCHEMES',
    OPEN_CROP_ANALYSIS: 'OPEN_CROP_ANALYSIS',
    OPEN_KCC_APPLICATION: 'OPEN_KCC_APPLICATION',
    OPEN_VOICE_ASSISTANT: 'OPEN_VOICE_ASSISTANT',
    ELIGIBILITY_CHECKER: 'OPEN_ELIGIBILITY',
  };

  // Confidence calculation
  const confidenceThreshold = 1.5; // Minimum score to trigger
  const confidence = maxScore > 0 ? Math.min(maxScore / 6, 1) : 0;
  const action: CommandAction =
    confidence > 0.3 && maxScore > confidenceThreshold
      ? actionMap[topIntent] || 'UNKNOWN'
      : 'UNKNOWN';

  // Extract matched keywords for debugging
  const matchedKeywords = KEYWORDS_BY_INTENT[topIntent as keyof typeof KEYWORDS_BY_INTENT]?.primary
    .filter((kw) => {
      const nkw = normalizeText(kw);
      return (
        normalized.includes(nkw) ||
        normalized.split(' ').some((w) => fuzzyMatch(w, nkw, 0.75))
      );
    }) || [];

  console.log(`🎯 FINAL RESULT:`);
  console.log(`   Action: ${action}`);
  console.log(`   Confidence: ${(confidence * 100).toFixed(1)}%`);
  console.log(`   Top Intent: ${topIntent} (score: ${maxScore.toFixed(2)})\n`);

  return {
    action,
    confidence,
    matchedKeywords,
    debug: {
      normalizedText: normalized,
      intentScores,
      topIntent,
      language,
    },
  };
}

/**
 * Export keyword data for reference
 */
export { KEYWORDS_BY_INTENT, ACTION_WORDS };
