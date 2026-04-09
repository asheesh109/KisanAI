/**
 * Translation Service using MyMemory Translation API (Free, No Auth Required)
 * Reference: https://mymemory.translated.net/doc/spec.php
 */

interface TranslationResult {
  [key: string]: string;
}

const LANGUAGE_MAP = {
  en: 'en-US',
  hi: 'hi-IN',
  mr: 'mr-IN',
  gu: 'gu-IN',
  ml: 'ml-IN',
};

/**
 * Translate text using MyMemory API (Free, no auth needed)
 */
async function translateWithMyMemory(
  text: string,
  targetLang: string
): Promise<string> {
  try {
    const langCode = LANGUAGE_MAP[targetLang as keyof typeof LANGUAGE_MAP] || 'en-US';
    
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en-US|${langCode}`
    );

    if (!response.ok) {
      console.error(`[MyMemory] Error for ${targetLang}:`, response.status);
      return text;
    }

    const data = await response.json();
    
    if (data.responseStatus !== 200) {
      console.error(`[MyMemory] API error for ${targetLang}:`, data.responseStatus);
      return text;
    }

    const translated = data.responseData?.translatedText || text;
    console.log(`[MyMemory] ✅ Translated to ${targetLang}:`, translated.substring(0, 40));
    return translated;
  } catch (error) {
    console.error(`[MyMemory] Error translating to ${targetLang}:`, error);
    return text;
  }
}

/**
 * Translate experience to all supported languages
 * Using MyMemory API (completely free, no authentication needed)
 */
export async function translateExperienceToAllLanguages(
  experience: string
): Promise<TranslationResult> {
  if (!experience || experience.trim().length === 0) {
    console.error('[Translation] Empty experience provided');
    throw new Error('Experience text cannot be empty');
  }

  console.log('[Translation] Starting multi-language translation...');
  console.log('[Translation] Original text:', experience.substring(0, 50));

  try {
    // Translate to all languages in parallel
    const [enText, hiText, mrText, guText, mlText] = await Promise.all([
      Promise.resolve(experience), // English is original
      translateWithMyMemory(experience, 'hi'),
      translateWithMyMemory(experience, 'mr'),
      translateWithMyMemory(experience, 'gu'),
      translateWithMyMemory(experience, 'ml'),
    ]);

    const result: TranslationResult = {
      en: enText,
      hi: hiText,
      mr: mrText,
      gu: guText,
      ml: mlText,
    };

    console.log('[Translation] ✅ All translations complete');
    return result;
  } catch (error) {
    console.error('[Translation] ❌ Error during translation:', error);
    // Fallback: return original in all languages
    return {
      en: experience,
      hi: experience,
      mr: experience,
      gu: experience,
      ml: experience,
    };
  }
}
