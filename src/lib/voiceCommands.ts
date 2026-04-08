/**
 * Voice Command Dictionary
 * Defines all voice commands with phrases in multiple languages
 * Supports: English, Hindi, Marathi, Gujarati, Malayalam
 */

export interface VoiceCommand {
  id: string;
  action: 'navigate' | 'action';
  target: string; // route or action name
  phrases: {
    en: string[];
    hi: string[];
    mr: string[];
    gu: string[];
    ml: string[];
  };
  icon?: string;
  label: {
    en: string;
    hi: string;
    mr: string;
    gu: string;
    ml: string;
  };
  aliases?: string[]; // Alternative action names for backward compatibility
}

export const VOICE_COMMANDS: VoiceCommand[] = [
  // Navigation - Schemes
  {
    id: 'schemes',
    action: 'navigate',
    target: '/schemes',
    phrases: {
      en: ['show schemes', 'open schemes', 'government schemes', 'go to schemes', 'schemes page'],
      hi: ['योजनाएं दिखाओ', 'सरकारी योजनाएं', 'योजनाएं खोलो', 'योजना देखो'],
      mr: ['योजना दाखवा', 'सरकारी योजना', 'योजना उघड़ा'],
      gu: ['યોજનાઓ બતાવો', 'સરકારી યોજના', 'યોજના ખોલો'],
      ml: ['സ്കീമുകൾ കാണിക്കുക', 'സർക്കാർ സ്കീമുകൾ', 'സ്കീമുകൾ തുറക്കുക'],
    },
    label: {
      en: 'Schemes',
      hi: 'योजनाएं',
      mr: 'योजना',
      gu: 'યોજનાઓ',
      ml: 'സ്കീമുകൾ',
    },
    icon: 'scroll',
  },

  // Navigation - Market Prices
  {
    id: 'market',
    action: 'navigate',
    target: '/market-prices',
    phrases: {
      en: ['market prices', 'show mandi rates', 'mandi prices', 'go to market', 'market page', 'crop prices'],
      hi: ['मंडी भाव', 'मंडी दर दिखाओ', 'फसल भाव', 'बाजार भाव', 'कीमत देखो'],
      mr: ['मंडी दर', 'बाजार दर दाखवा', 'पणांची किंमत'],
      gu: ['મંડી ભાવ', 'બજાર ભાવ', 'ફસલ ભાવ', 'ભાવ બતાવો'],
      ml: ['മണ്ഡി നിരക്കുകൾ', 'വിപണി വില', 'ഭാവം കാണിക്കുക'],
    },
    label: {
      en: 'Market Prices',
      hi: 'मंडी भाव',
      mr: 'मंडी दर',
      gu: 'મંડી ભાવ',
      ml: 'മണ്ഡി നിരക്കുകൾ',
    },
    icon: 'trending-up',
  },

  // Navigation - Weather
  {
    id: 'weather',
    action: 'navigate',
    target: '/weather',
    phrases: {
      en: ['show weather', 'weather forecast', 'go to weather', 'weather page', 'weather info', 'check weather'],
      hi: ['मौसम दिखाओ', 'मौसम पूर्वानुमान', 'आबोहवा देखो', 'मौसम की जानकारी'],
      mr: ['हवामान दाखवा', 'हवामान पूर्वानुमान', 'हवामान पहा'],
      gu: ['હવામાન બતાવો', 'આબોહવા', 'આબોહવા તપાસો'],
      ml: ['കാലാവസ്ഥ കാണിക്കുക', 'കാലാവസ്ഥ പ്രവചനം', 'കാലാവസ്ഥ പരിശോധിക്കുക'],
    },
    label: {
      en: 'Weather',
      hi: 'मौसम',
      mr: 'हवामान',
      gu: 'હવામાન',
      ml: 'കാലാവസ്ഥ',
    },
    icon: 'cloud',
  },

  // Navigation - Voice Assistant
  {
    id: 'voice',
    action: 'navigate',
    target: '/voice-assistant',
    phrases: {
      en: ['voice assistant', 'open voice assistant', 'go to voice assistant', 'talk to assistant'],
      hi: ['वॉइस सहायक', 'वॉइस सहायक खोलो', 'सहायक से बात करो'],
      mr: ['व्हॉईस सहायक', 'अवाज सहायक'],
      gu: ['વોઇસ અસિસ્ટન્ટ', 'વોઇસ સહાયક'],
      ml: ['ശബ്ദ സഹായി', 'ശബ്ദ സഹായി തുറക്കുക'],
    },
    label: {
      en: 'Voice Assistant',
      hi: 'वॉइस सहायक',
      mr: 'व्हॉईस सहायक',
      gu: 'વોઇસ અસિસ્ટન્ટ',
      ml: 'ശബ്ദ സഹായി',
    },
    icon: 'mic',
  },

  // Navigation - Crop Analysis
  {
    id: 'crop-analysis',
    action: 'navigate',
    target: '/crop-analysis',
    phrases: {
      en: ['crop analysis', 'analyze crop', 'analyze my crop', 'crop disease', 'crop health'],
      hi: ['फसल विश्लेषण', 'फसल की जांच', 'फसल का रोग', 'फसल का स्वास्थ्य'],
      mr: ['पणांचे विश्लेषण', 'पणांचा रोग', 'पणांचे आरोग्य'],
      gu: ['પसલ વિશ્લેષણ', 'પસલ પરીક્ષણ'],
      ml: ['വിള വിശകലനം', 'വിള രോഗം', 'വിള ആരോഗ്യം'],
    },
    label: {
      en: 'Crop Analysis',
      hi: 'फसल विश्लेषण',
      mr: 'पणांचे विश्लेषण',
      gu: 'પસલ વિશ્લેષણ',
      ml: 'വിള വിശകലനം',
    },
    icon: 'image',
  },

  // Navigation - KCC Application
  {
    id: 'kcc',
    action: 'navigate',
    target: '/kcc-application',
    phrases: {
      en: ['kcc application', ' credit card', 'apply kcc', 'kcc form', 'credit card'],
      hi: [' क्रेडिट कार्ड', 'केसीसी आवेदन', 'केसीसी फॉर्म', 'क्रेडिट कार्ड'],
      mr: [' क्रेडिट कार्ड', 'केसीसी अर्ज'],
      gu: [' ક્રેડિટ કાર્ડ', 'केસીસી અરજી'],
      ml: ['കിസാൻ ക്രെഡിറ്റ് കാർഡ്', 'കെസിസി അപേക്ഷ'],
    },
    label: {
      en: 'KCC Application',
      hi: 'किसान क्रेडिट कार्ड',
      mr: 'किसान क्रेडिट कार्ड',
      gu: 'કિસાન ક્રેડિટ કાર્ડ',
      ml: 'കിസാൻ ക്രെഡിറ്റ് കാർഡ്',
    },
    icon: 'credit-card',
  },

  // Navigation - Home
  {
    id: 'home',
    action: 'navigate',
    target: '/',
    phrases: {
      en: ['go home', 'home', 'go to home', 'home page', 'back home'],
      hi: ['होम जाओ', 'घर जाओ', 'होमपेज', 'मुख्य पृष्ठ'],
      mr: ['घरी जा', 'मुख्य पृष्ठ'],
      gu: ['ઘરે જાઓ', 'હોમપેજ'],
      ml: ['വീട്ടിലേക്ക് പോകുക', 'ഹോം പേജ്'],
    },
    label: {
      en: 'Home',
      hi: 'होम',
      mr: 'मुख्य',
      gu: 'હોમ',
      ml: 'ഹോം',
    },
    icon: 'home',
  },

  // Navigation - Eligibility Checker
  {
    id: 'eligibility',
    action: 'navigate',
    target: '/schemes/eligibility-checker',
    phrases: {
      en: ['check eligibility', 'eligibility checker', 'am i eligible', 'eligibility'],
      hi: ['पात्रता जांचो', 'योग्यता देखो', 'क्या मैं योग्य हूँ', 'पात्रता चेक करो'],
      mr: ['पात्रता तपासा', 'पात्र आहे का'],
      gu: ['પાત્રતા તપાસો', 'શું હું પાત્ર છું'],
      ml: ['യോഗ്യത പരിശോധിക്കുക', 'ഞാൻ യോഗ്യനാണോ'],
    },
    label: {
      en: 'Eligibility Checker',
      hi: 'पात्रता जांचें',
      mr: 'पात्रता तपास',
      gu: 'પાત્રતા તપાસ',
      ml: 'യോഗ്യത പരിശോധന',
    },
    icon: 'check-circle',
  },

  // Help command
  {
    id: 'help',
    action: 'action',
    target: 'showHelp',
    phrases: {
      en: ['help', 'show help', 'what can i say', 'support'],
      hi: ['मदद', 'सहायता', 'मदद दिखाओ'],
      mr: ['मदत', 'मदत दाखवा'],
      gu: ['મદદ', 'સહાય'],
      ml: ['സഹായം', 'സാഹായ്യം'],
    },
    label: {
      en: 'Help',
      hi: 'मदद',
      mr: 'मदत',
      gu: 'મદદ',
      ml: 'സഹായം',
    },
    icon: 'help-circle',
  },
];

/**
 * Get command by ID
 */
export function getCommandById(id: string): VoiceCommand | undefined {
  return VOICE_COMMANDS.find((cmd) => cmd.id === id);
}

/**
 * Get all phrases for a language
 */
export function getPhrasesForLanguage(language: string): string[] {
  const lang = language as keyof VoiceCommand['phrases'];
  return VOICE_COMMANDS.flatMap((cmd) => cmd.phrases[lang] || []);
}

/**
 * Get all commands with labels for a specific language
 */
export function getCommandLabels(language: string) {
  const lang = language as keyof VoiceCommand['label'];
  return VOICE_COMMANDS.map((cmd) => ({
    id: cmd.id,
    label: cmd.label[lang],
    icon: cmd.icon,
  }));
}
