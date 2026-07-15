export const SUPPORTED_LANGUAGES = ['en', 'hi', 'mr', 'gu', 'ml'] as const

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]

export const CROP_CONDITIONS = [
  'healthy',
  'disease',
  'pest',
  'nutrient-deficiency',
] as const

export type CropCondition = (typeof CROP_CONDITIONS)[number]

export const SEVERITY_LEVELS = ['low', 'medium', 'high'] as const

export type SeverityLevel = (typeof SEVERITY_LEVELS)[number]

/**
 * Normalized crop analysis result used by the application.
 *
 * `recommendations` is retained as a backward-compatible alias for the
 * existing Crop Analysis UI. New code should use `treatmentRecommendations`.
 */
export interface CropAnalysisResult {
  condition: CropCondition
  confidence: number
  disease: string
  severity: SeverityLevel
  overview: string
  causes: string[]
  symptoms: string[]
  prevention: string[]
  treatmentRecommendations: string[]
  recommendations: string[]
}

const RESPONSE_LANGUAGE_NAMES: Record<SupportedLanguage, string> = {
  en: 'English',
  hi: 'Hindi',
  mr: 'Marathi',
  gu: 'Gujarati',
  ml: 'Malayalam',
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const normalizeText = (value: unknown): string => {
  if (typeof value === 'string') {
    return value.trim()
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value).trim()
  }

  return ''
}

const getFirstPresentValue = (
  source: Record<string, unknown>,
  keys: readonly string[],
): unknown => {
  for (const key of keys) {
    const value = source[key]

    if (value !== undefined && value !== null) {
      return value
    }
  }

  return undefined
}

const getFirstText = (
  source: Record<string, unknown>,
  keys: readonly string[],
): string => normalizeText(getFirstPresentValue(source, keys))

const cleanListItem = (item: string): string =>
  item
    .replace(/^\s*(?:[-*\u2022]|\d+[.)])\s*/, '')
    .replace(/\s+/g, ' ')
    .trim()

/**
 * Converts AI output into a clean string array.
 *
 * Supports:
 * - JSON arrays
 * - nested arrays
 * - newline-separated text
 * - semicolon-separated text
 * - numbered and bulleted items
 */
export const normalizeTextList = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return deduplicateItems(value.flatMap((item) => normalizeTextList(item)))
  }

  const text = normalizeText(value)

  if (!text) {
    return []
  }

  /*
   * Some models occasionally return a JSON array encoded as a string.
   * Attempt to parse it before treating it as ordinary text.
   */
  if (text.startsWith('[') && text.endsWith(']')) {
    try {
      const parsedValue: unknown = JSON.parse(text)

      if (Array.isArray(parsedValue)) {
        return normalizeTextList(parsedValue)
      }
    } catch {
      // Continue with normal text processing.
    }
  }

  const items = text
    .split(/\r?\n|;\s*/)
    .map(cleanListItem)
    .filter(Boolean)

  return deduplicateItems(items)
}

const deduplicateItems = (items: readonly string[]): string[] => {
  const seenItems = new Set<string>()

  return items.filter((item) => {
    const normalizedItem = item.toLocaleLowerCase()

    if (seenItems.has(normalizedItem)) {
      return false
    }

    seenItems.add(normalizedItem)
    return true
  })
}

const normalizeCondition = (value: unknown): CropCondition => {
  const condition = normalizeText(value)
    .toLocaleLowerCase()
    .replace(/[_\s]+/g, '-')

  switch (condition) {
    case 'healthy':
    case 'healthy-plant':
    case 'healthy-crop':
    case 'normal':
      return 'healthy'

    case 'disease':
    case 'diseased':
    case 'plant-disease':
    case 'crop-disease':
      return 'disease'

    case 'pest':
    case 'pests':
    case 'pest-infestation':
    case 'insect':
    case 'insect-infestation':
      return 'pest'

    case 'nutrient-deficiency':
    case 'nutrient-deficient':
    case 'deficiency':
    case 'nutrition-deficiency':
      return 'nutrient-deficiency'

    default:
      throw new Error(`Unsupported crop condition: ${condition || 'missing'}`)
  }
}

const normalizeSeverity = (
  value: unknown,
  condition: CropCondition,
): SeverityLevel => {
  const severity = normalizeText(value)
    .toLocaleLowerCase()
    .replace(/[_\s]+/g, '-')

  switch (severity) {
    case 'low':
    case 'mild':
    case 'minor':
    case 'none':
      return 'low'

    case 'medium':
    case 'moderate':
      return 'medium'

    case 'high':
    case 'severe':
    case 'critical':
      return 'high'

    default:
      /*
       * Preserve compatibility with older responses that occasionally omit
       * severity. Healthy results default to low; other findings use medium.
       */
      return condition === 'healthy' ? 'low' : 'medium'
  }
}

const normalizeConfidence = (value: unknown): number => {
  const confidenceText = normalizeText(value).replace('%', '')
  const confidence = Number.parseFloat(confidenceText)

  if (!Number.isFinite(confidence)) {
    throw new Error('Crop analysis confidence must be a valid number')
  }

  /*
   * Accept either:
   * - decimal probability, such as 0.87
   * - percentage, such as 87 or "87%"
   */
  const percentage =
    confidence > 0 && confidence <= 1 ? confidence * 100 : confidence

  return Math.min(100, Math.max(0, Math.round(percentage)))
}

/**
 * Extracts one complete JSON object from an AI response.
 *
 * This supports:
 * - plain JSON
 * - Markdown JSON code blocks
 * - explanatory text before or after JSON
 * - braces appearing inside JSON strings
 */
export const extractJsonPayload = (
  responseText: string,
): Record<string, unknown> => {
  const trimmedResponse = responseText.trim()

  if (!trimmedResponse) {
    throw new Error('AI response is empty')
  }

  /*
   * First handle the ideal case where the whole response is valid JSON.
   */
  try {
    const parsedValue: unknown = JSON.parse(trimmedResponse)

    if (isRecord(parsedValue)) {
      return parsedValue
    }
  } catch {
    // Continue by finding a balanced JSON object.
  }

  const objectStart = trimmedResponse.indexOf('{')

  if (objectStart === -1) {
    throw new Error('AI response does not contain a JSON object')
  }

  let objectDepth = 0
  let insideString = false
  let escapedCharacter = false

  for (let index = objectStart; index < trimmedResponse.length; index += 1) {
    const character = trimmedResponse[index]

    if (insideString) {
      if (escapedCharacter) {
        escapedCharacter = false
        continue
      }

      if (character === '\\') {
        escapedCharacter = true
        continue
      }

      if (character === '"') {
        insideString = false
      }

      continue
    }

    if (character === '"') {
      insideString = true
      continue
    }

    if (character === '{') {
      objectDepth += 1
      continue
    }

    if (character === '}') {
      objectDepth -= 1

      if (objectDepth === 0) {
        const jsonCandidate = trimmedResponse.slice(objectStart, index + 1)

        let parsedCandidate: unknown

        try {
          parsedCandidate = JSON.parse(jsonCandidate)
        } catch {
          throw new Error('AI response contains malformed JSON')
        }

        if (!isRecord(parsedCandidate)) {
          throw new Error('AI response JSON must be an object')
        }

        return parsedCandidate
      }
    }
  }

  throw new Error('AI response contains an incomplete JSON object')
}

/**
 * Converts current and legacy Gemini responses into one stable structure.
 */
export const normalizeAnalysisResult = (
  value: unknown,
): CropAnalysisResult => {
  if (!isRecord(value)) {
    throw new Error('Crop analysis response must be a JSON object')
  }

  const condition = normalizeCondition(
    getFirstPresentValue(value, [
      'condition',
      'plantCondition',
      'plant_condition',
      'cropCondition',
      'crop_condition',
    ]),
  )

  const confidence = normalizeConfidence(
    getFirstPresentValue(value, [
      'confidence',
      'confidenceScore',
      'confidence_score',
      'accuracy',
      'probability',
    ]),
  )

  const disease = getFirstText(value, [
    'disease',
    'diseaseName',
    'disease_name',
    'identifiedDisease',
    'identified_disease',
    'problem',
    'diagnosis',
  ])

  if (!disease) {
    throw new Error('Crop analysis response is missing the disease name')
  }

  const severity = normalizeSeverity(
    getFirstPresentValue(value, [
      'severity',
      'severityLevel',
      'severity_level',
    ]),
    condition,
  )

  const overview = getFirstText(value, [
    'overview',
    'diseaseOverview',
    'disease_overview',
    'description',
    'diseaseDescription',
    'disease_description',
    'whatIsDisease',
    'what_is_disease',
  ])

  const causes = normalizeTextList(
    getFirstPresentValue(value, [
      'causes',
      'cause',
      'possibleCauses',
      'possible_causes',
      'diseaseCauses',
      'disease_causes',
    ]),
  )

  const symptoms = normalizeTextList(
    getFirstPresentValue(value, [
      'symptoms',
      'symptom',
      'commonSymptoms',
      'common_symptoms',
      'visibleSymptoms',
      'visible_symptoms',
    ]),
  )

  const prevention = normalizeTextList(
    getFirstPresentValue(value, [
      'prevention',
      'preventionMethods',
      'prevention_methods',
      'preventiveMeasures',
      'preventive_measures',
    ]),
  )

  /*
   * `recommendations` is the current application's legacy field.
   * It remains accepted for backward compatibility.
   */
  const treatmentRecommendations = normalizeTextList(
    getFirstPresentValue(value, [
      'treatmentRecommendations',
      'treatment_recommendations',
      'treatments',
      'treatment',
      'recommendations',
    ]),
  )

  return {
    condition,
    confidence,
    disease,
    severity,
    overview,
    causes,
    symptoms,
    prevention,
    treatmentRecommendations,
    recommendations: treatmentRecommendations,
  }
}

/**
 * Parses and normalizes a raw Gemini text response.
 */
export const parseCropAnalysisResponse = (
  responseText: string,
): CropAnalysisResult =>
  normalizeAnalysisResult(extractJsonPayload(responseText))

/**
 * Builds one consistent multilingual prompt instead of maintaining five
 * duplicated prompt structures in the page component.
 */
export const buildCropAnalysisPrompt = (
  language: SupportedLanguage = 'en',
): string => {
  const responseLanguage = RESPONSE_LANGUAGE_NAMES[language]

  return `
You are an agricultural crop-health expert.

Carefully analyze the supplied crop or plant image. Base the diagnosis only on
visible evidence in the image. Do not claim certainty when the image is unclear.

Return only one valid JSON object. Do not include Markdown, code fences,
headings, commentary, or text outside the JSON object.

Use this exact structure:

{
  "condition": "healthy|disease|pest|nutrient-deficiency",
  "confidence": 85,
  "disease": "Specific disease, pest, deficiency, or healthy-plant name",
  "severity": "low|medium|high",
  "overview": "A concise explanation of what the detected condition is",
  "causes": [
    "Likely cause 1",
    "Likely cause 2"
  ],
  "symptoms": [
    "Visible or common symptom 1",
    "Visible or common symptom 2"
  ],
  "prevention": [
    "Practical prevention method 1",
    "Practical prevention method 2"
  ],
  "treatmentRecommendations": [
    "Safe and actionable treatment recommendation 1",
    "Safe and actionable treatment recommendation 2"
  ]
}

Rules:

1. Write disease, overview, causes, symptoms, prevention, and treatment entries
   in ${responseLanguage}.
2. Keep the condition and severity enum values exactly in English as shown.
3. Return confidence as a whole number between 0 and 100.
4. Include three to five useful entries in causes, symptoms, prevention, and
   treatmentRecommendations whenever applicable.
5. If the plant appears healthy, use condition "healthy", severity "low", and
   explain the healthy signs that are visible.
6. If the exact diagnosis is uncertain, state the most likely condition in the
   overview and lower the confidence score.
7. Do not guarantee a diagnosis from an image alone.
8. Avoid unsafe chemical-use instructions. When mentioning agricultural
   products, advise following the product label and consulting a local
   agricultural expert where appropriate.
`.trim()
}
