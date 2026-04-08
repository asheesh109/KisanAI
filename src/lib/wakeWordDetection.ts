/**
 * Wake Word Dictionary
 * Defines wake words in all languages to activate voice assistant
 */

export interface WakeWordPhrases {
  en: string[];
  hi: string[];
  mr: string[];
  gu: string[];
  ml: string[];
}

/**
 * Wake words to activate voice assistant
 * Format: "Hey KisanAI" in each language + variations
 */
export const WAKE_WORDS: WakeWordPhrases = {
  en: [
    'hey kisan ai',
    'hey kisan',
    'hey kisanai',
    'kisan ai',
    'ok kisan',
  ],
  hi: [
    'हे किसान ऐ आई',
    'हे किसान',
    'हेय किसान',
    'किसान ऐ आई',
    'ओके किसान',
  ],
  mr: [
    'हे किसान ऐ आই',
    'हे किसान',
    'किसान ऐ आई',
  ],
  gu: [
    'હે કિસાન ઐ આઈ',
    'હે કિસાન',
    'કિસાન ઐ આઈ',
  ],
  ml: [
    'ഹേ കിസാൻ എ ഐ',
    'ഹേ കിസാൻ',
    'കിസാൻ എ ഐ',
  ],
};

/**
 * Simplified commands - "open X" or "show X" format
 */
export interface VoiceCommand {
  id: string;
  route: string;
  phrases: WakeWordPhrases; // Phrases for each language
  icon: string;
}

export const VOICE_COMMANDS: VoiceCommand[] = [
  {
    id: 'weather',
    route: '/weather',
    phrases: {
      en: ['open weather', 'show weather', 'weather', 'weather forecast', 'weather info'],
      hi: ['मौसम खोलो', 'मौसम दिखाओ', 'मौसम दर्शाओ', 'मौसम की जानकारी'],
      mr: ['हवामान उघड़ा', 'हवामान दाखवा', 'हवामान'],
      gu: ['હવામાન ખોલો', 'હવામાન બતાવો', 'આબોહવા'],
      ml: ['കാലാവസ്ഥ തുറക്കുക', 'കാലാവസ്ഥ കാണിക്കുക', 'കാലാവസ്ഥ'],
    },
    icon: 'cloud',
  },

  {
    id: 'market',
    route: '/market-prices',
    phrases: {
      en: ['open market', 'show prices', 'market prices', 'mandi rates', 'show mandi'],
      hi: ['बाजार खोलो', 'कीमत दिखाओ', 'मंडी भाव', 'मंडी दरें दिखाओ'],
      mr: ['बाजार उघड़ा', 'मंडी दर दाखवा', 'भाव दाखवा'],
      gu: ['બાજાર ખોલો', 'ભાવ બતાવો', 'મંડી ભાવ'],
      ml: ['വിപണി തുറക്കുക', 'വിലകൾ കാണിക്കുക', 'മണ്ഡി നിരക്കുകൾ'],
    },
    icon: 'trending-up',
  },

  {
    id: 'schemes',
    route: '/schemes',
    phrases: {
      en: ['open schemes', 'show schemes', 'government schemes', 'schemes', 'open benefits'],
      hi: ['योजनाएं खोलो', 'योजनाएं दिखाओ', 'सरकारी योजनाएं', 'योजना'],
      mr: ['योजना उघड़ा', 'योजना दाखवा', 'सरकारी योजना'],
      gu: ['યોજનાઓ ખોલો', 'યોજનાઓ બતાવો', 'સરકારી યોજનાઓ'],
      ml: ['സ്കീമുകൾ തുറക്കുക', 'സ്കീമുകൾ കാണിക്കുക', 'സർക്കാർ സ്കീമുകൾ'],
    },
    icon: 'scroll',
  },

  {
    id: 'kcc',
    route: '/kcc-application',
    phrases: {
      en: ['open kcc', 'show kcc', 'kisan credit card', 'credit card', 'kcc application'],
      hi: ['किसान क्रेडिट कार्ड खोलो', 'KCC खोलो', 'केसीसी दिखाओ', 'क्रेडिट कार्ड'],
      mr: ['किसान क्रेडिट कार्ड उघड़ा', 'केसीसी दाखवा'],
      gu: ['કિસાન ક્રેડિટ કાર્ડ ખોલો', 'કે.સી.સી. બતાવો'],
      ml: ['കിസാൻ ക്രെഡിറ്റ് കാർഡ് തുറക്കുക', 'കെസിസി കാണിക്കുക'],
    },
    icon: 'credit-card',
  },

  {
    id: 'crop',
    route: '/crop-analysis',
    phrases: {
      en: ['open crop analysis', 'analyze crop', 'crop analysis', 'crop disease', 'check crop'],
      hi: ['फसल विश्लेषण खोलो', 'फसल का विश्लेषण करो', 'फसल की जांच करो'],
      mr: ['पणांचे विश्लेषण उघड़ा', 'पणांचा रोग दाखवा'],
      gu: ['પસલ વિશ્લેષણ ખોલો', 'પસલ તપાસો'],
      ml: ['വിള വിശകലനം തുറക്കുക', 'വിള രോഗം പരിശോധിക്കുക'],
    },
    icon: 'image',
  },

  {
    id: 'voice-assistant',
    route: '/voice-assistant',
    phrases: {
      en: ['open voice assistant', 'voice assistant', 'assistant', 'talk to assistant'],
      hi: ['वॉइस सहायक खोलो', 'वॉइस सहायक', 'सहायक'],
      mr: ['व्हॉईस सहायक उघड़ा', 'वॉइस सहायक'],
      gu: ['વોઇસ સહાયક ખોલો', 'વોઇસ સહાયક'],
      ml: ['ശബ്ദ സഹായി തുറക്കുക', 'ശബ്ദ സഹായി'],
    },
    icon: 'mic',
  },

  {
    id: 'eligibility',
    route: '/schemes/eligibility-checker',
    phrases: {
      en: ['check eligibility', 'eligibility', 'am i eligible', 'check eligible'],
      hi: ['पात्रता जांचो', 'पात्रता चेक करो', 'क्या मैं योग्य हूं'],
      mr: ['पात्रता तपासा', 'पात्रता चेक करा', 'पात्र आहे का'],
      gu: ['પાત્રતા તપાસો', 'પાત્રતા ચેક કરો', 'શું હું યોગ્ય છું'],
      ml: ['യോഗ്യത പരിശോധിക്കുക', 'യോഗ്യത ചെക്ക് ചെയ്യുക'],
    },
    icon: 'check-circle',
  },

  {
    id: 'home',
    route: '/',
    phrases: {
      en: ['go home', 'home', 'open home', 'main page', 'homepage'],
      hi: ['होम जाओ', 'होमपेज खोलो', 'मुख्य पृष्ठ'],
      mr: ['घरी जा', 'मुख्य पृष्ठ उघड़ा'],
      gu: ['ઘરે જાઓ', 'હોમ પેજ ખોલો'],
      ml: ['വീട്ടിലേക്ക് പോകുക', 'ഹോം പേജ് തുറക്കുക'],
    },
    icon: 'home',
  },
];

/**
 * Get command by route
 */
export function getCommandByRoute(route: string): VoiceCommand | undefined {
  return VOICE_COMMANDS.find((cmd) => cmd.route === route);
}

/**
 * Get all command labels for a language
 */
export function getCommandLabels(language: string) {
  return VOICE_COMMANDS.map((cmd) => ({
    id: cmd.id,
    route: cmd.route,
    label: cmd.phrases[language as keyof WakeWordPhrases]?.[0] || cmd.id,
  }));
}
