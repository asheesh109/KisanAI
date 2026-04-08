/**
 * Voice Command Matching Engine
 * Matches normalized speech input against command dictionary
 */

import { VOICE_COMMANDS, VoiceCommand } from './voiceCommands';
import {
  normalizeText,
  matchesKeywords,
  calculateSimilarity,
  startsWithKeyword,
} from './normalizeText';

export interface MatchResult {
  matched: boolean;
  command?: VoiceCommand;
  confidence: number; // 0-1 confidence score
  matchType: 'exact' | 'fuzzy' | 'keyword' | 'none';
}

/**
 * Main function to match voice transcript to a command
 * Supports multiple matching strategies with fallback
 */
export function matchVoiceCommand(
  transcript: string,
  language: string = 'en'
): MatchResult {
  const normalized = normalizeText(transcript);
  const lang = language as keyof VoiceCommand['phrases'];

  // Strategy 1: Exact phrase match (highest priority)
  const exactMatch = findExactMatch(normalized, lang);
  if (exactMatch) {
    return {
      matched: true,
      command: exactMatch,
      confidence: 1.0,
      matchType: 'exact',
    };
  }

  // Strategy 2: Keyword matching (high priority)
  const keywordMatch = findKeywordMatch(normalized, lang);
  if (keywordMatch.command) {
    return keywordMatch;
  }

  // Strategy 3: Fuzzy matching with similarity score (medium priority)
  const fuzzyMatch = findFuzzyMatch(normalized, lang);
  if (fuzzyMatch && fuzzyMatch.confidence > 0.65) {
    return {
      matched: true,
      command: fuzzyMatch.command,
      confidence: fuzzyMatch.confidence,
      matchType: 'fuzzy',
    };
  }

  // No match found
  return {
    matched: false,
    confidence: 0,
    matchType: 'none',
  };
}

/**
 * Strategy 1: Exact phrase match
 * Looks for exact match in predefined phrases
 */
function findExactMatch(
  normalized: string,
  language: keyof VoiceCommand['phrases']
): VoiceCommand | null {
  for (const command of VOICE_COMMANDS) {
    const phrases = command.phrases[language] || [];
    for (const phrase of phrases) {
      if (normalizeText(phrase) === normalized) {
        return command;
      }
    }
  }
  return null;
}

/**
 * Strategy 2: Keyword matching
 * Matches if all keywords from a phrase are found in transcript
 * Plus bonus if phrase starts with command keyword
 */
function findKeywordMatch(
  normalized: string,
  language: keyof VoiceCommand['phrases']
): MatchResult {
  let bestMatch: { command: VoiceCommand; confidence: number } | null = null;

  for (const command of VOICE_COMMANDS) {
    const phrases = command.phrases[language] || [];

    for (const phrase of phrases) {
      const phraseKeywords = normalizeText(phrase).split(/\s+/);

      // Check if all keywords are present in transcript
      const allKeywordsPresent = phraseKeywords.every((keyword) =>
        normalized.includes(keyword)
      );

      if (allKeywordsPresent) {
        // Calculate confidence based on keyword coverage
        const matchedKeywords = phraseKeywords.filter((keyword) =>
          normalized.includes(keyword)
        ).length;
        const confidence = matchedKeywords / phraseKeywords.length;

        // Prefer commands where phrase appears at start
        const isStart = startsWithKeyword(normalized, [phrase]) ? 1.2 : 1;
        const adjustedConfidence = Math.min(confidence * isStart, 1);

        if (
          !bestMatch ||
          adjustedConfidence > bestMatch.confidence
        ) {
          bestMatch = {
            command,
            confidence: adjustedConfidence,
          };
        }
      }
    }
  }

  if (bestMatch) {
    return {
      matched: true,
      command: bestMatch.command,
      confidence: bestMatch.confidence,
      matchType: 'keyword',
    };
  }

  return {
    matched: false,
    confidence: 0,
    matchType: 'none',
  };
}

/**
 * Strategy 3: Fuzzy matching with similarity score
 * Uses string similarity and returns best match above threshold
 */
function findFuzzyMatch(
  normalized: string,
  language: keyof VoiceCommand['phrases']
): { command: VoiceCommand; confidence: number } | null {
  let bestMatch: { command: VoiceCommand; similarity: number } | null = null;
  const threshold = 0.65;

  for (const command of VOICE_COMMANDS) {
    const phrases = command.phrases[language] || [];

    for (const phrase of phrases) {
      const similarity = calculateSimilarity(normalized, phrase);

      if (similarity >= threshold) {
        if (!bestMatch || similarity > bestMatch.similarity) {
          bestMatch = {
            command,
            similarity,
          };
        }
      }
    }
  }

  if (bestMatch) {
    return {
      command: bestMatch.command,
      confidence: bestMatch.similarity,
    };
  }

  return null;
}

/**
 * Get multiple matching suggestions (for disambiguation UI)
 */
export function getCommandSuggestions(
  transcript: string,
  language: string = 'en',
  topN: number = 3
): MatchResult[] {
  const normalized = normalizeText(transcript);
  const lang = language as keyof VoiceCommand['phrases'];
  const suggestions: MatchResult[] = [];

  for (const command of VOICE_COMMANDS) {
    const phrases = command.phrases[lang] || [];

    for (const phrase of phrases) {
      const similarity = calculateSimilarity(normalized, phrase);

      if (similarity > 0.5) {
        const existing = suggestions.find(
          (s) => s.command?.id === command.id
        );

        if (!existing || similarity > (existing.confidence || 0)) {
          if (existing) {
            suggestions.splice(suggestions.indexOf(existing), 1);
          }

          suggestions.push({
            matched: similarity > 0.65,
            command,
            confidence: similarity,
            matchType: similarity > 0.9 ? 'exact' : 'fuzzy',
          });
        }
      }
    }
  }

  return suggestions
    .sort((a, b) => (b.confidence || 0) - (a.confidence || 0))
    .slice(0, topN);
}

/**
 * Normalize language code (en -> en, hi -> hi, etc.)
 */
export function normalizeLanguageCode(lang: string): string {
  const langMap: Record<string, string> = {
    en: 'en',
    hi: 'hi',
    hindi: 'hi',
    mr: 'mr',
    marathi: 'mr',
    gu: 'gu',
    gujarati: 'gu',
    ml: 'ml',
    malayalam: 'ml',
  };

  return langMap[lang.toLowerCase()] || 'en';
}

/**
 * Debug helper - show all matching scores
 */
export function debugMatchScores(
  transcript: string,
  language: string = 'en'
): Array<{ command: string; phrases: Array<{ phrase: string; score: number }> }> {
  const normalized = normalizeText(transcript);
  const lang = language as keyof VoiceCommand['phrases'];
  const results = [];

  for (const command of VOICE_COMMANDS) {
    const phrases = command.phrases[lang] || [];
    const phraseScores = phrases.map((phrase) => ({
      phrase,
      score: calculateSimilarity(normalized, phrase),
    }));

    results.push({
      command: command.id,
      phrases: phraseScores.sort((a, b) => b.score - a.score),
    });
  }

  return results
    .map((r) => ({
      ...r,
      maxScore: Math.max(...r.phrases.map((p) => p.score)),
    }))
    .sort((a, b) => (b as any).maxScore - (a as any).maxScore)
    .slice(0, 10);
}
