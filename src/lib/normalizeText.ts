/**
 * Text Normalization Utilities
 * Converts speech-to-text output into normalized, comparable text
 */

/**
 * Normalize text for voice command matching
 * - Lowercase
 * - Trim whitespace
 * - Remove punctuation
 * - Remove extra spaces
 */
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .trim()
    // Remove common punctuation
    .replace(/[.,!?;:\-'"()[\]{}]/g, '')
    // Remove extra spaces
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Phonetic similarity check for Hinglish/mixed language support
 * Handles common transliteration variations
 * Example: "krishi" vs "krsi" vs "कृषि"
 */
export function getPhoneticVariants(text: string): string[] {
  const variants: Set<string> = new Set([text]);

  // Remove vowels for fuzzy matching
  const consonantOnly = text.replace(/[aeiouआइउएओ]/gi, '');
  if (consonantOnly !== text) {
    variants.add(consonantOnly);
  }

  // Common Hindi-English transliteration mappings
  const transliterations: Record<string, string> = {
    // Common hindi sounds in English
    'ch': 'च',
    'sh': 'श',
    'th': 'थ',
    'kh': 'ख',
    'gh': 'घ',
    'jay': 'जे',
    'j': 'ज',
    // Variations
    'yojana': 'योजना',
    'sarkari': 'सरकारी',
    'mandi': 'मंडी',
    'bhaav': 'भाव',
    'krishi': 'कृषि',
    'mausam': 'मौसम',
  };

  for (const [eng, hindi] of Object.entries(transliterations)) {
    if (text.includes(eng)) {
      variants.add(text.replace(new RegExp(eng, 'gi'), hindi));
    }
  }

  return Array.from(variants);
}

/**
 * Check if text contains keywords (partial match)
 * Useful for fuzzy matching when exact match fails
 */
export function matchesKeywords(text: string, keywords: string[]): boolean {
  const normalized = normalizeText(text);
  return keywords.some((keyword) => {
    const normalizedKeyword = normalizeText(keyword);
    // Full word match or phrase match
    return (
      normalized === normalizedKeyword ||
      normalized.includes(normalizedKeyword) ||
      normalizedKeyword.includes(normalized)
    );
  });
}

/**
 * Calculate Levenshtein distance (simple fuzzy matching)
 * Returns similarity score 0-1 (1 = perfect match)
 */
export function calculateSimilarity(str1: string, str2: string): number {
  const s1 = normalizeText(str1);
  const s2 = normalizeText(str2);

  if (s1 === s2) return 1;
  if (Math.max(s1.length, s2.length) === 0) return 1;

  const longer = s1.length > s2.length ? s1 : s2;
  const shorter = s1.length > s2.length ? s2 : s1;

  const editDistance = getEditDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

/**
 * Helper function to calculate edit distance (Levenshtein distance)
 */
function getEditDistance(s1: string, s2: string): number {
  const costs: number[] = [];

  for (let i = 0; i <= s1.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= s2.length; j++) {
      if (i === 0) {
        costs[j] = j;
      } else if (j > 0) {
        let newValue = costs[j - 1];
        if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
          newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
        }
        costs[j - 1] = lastValue;
        lastValue = newValue;
      }
    }
    if (i > 0) costs[s2.length] = lastValue;
  }

  return costs[s2.length];
}

/**
 * Clean speech-to-text output
 * Removes common artifacts from speech recognition
 */
export function cleanTranscript(transcript: string): string {
  return transcript
    .replace(/\s+/g, ' ') // Multiple spaces to single
    .replace(/\s\s+/g, ' ') // Extra spaces cleanup
    .trim();
}

/**
 * Extract keywords from text
 * Splits text into individual words for matching
 */
export function extractKeywords(text: string): string[] {
  return normalizeText(text)
    .split(/[\s,]+/)
    .filter((word) => word.length > 0);
}

/**
 * Check if text starts with any keyword
 * Useful for command detection
 */
export function startsWithKeyword(text: string, keywords: string[]): boolean {
  const normalized = normalizeText(text);
  return keywords.some((keyword) => {
    const normalizedKeyword = normalizeText(keyword);
    return normalized.startsWith(normalizedKeyword);
  });
}
