import {
  SUPPORTED_LANGUAGES,
  buildCropAnalysisPrompt,
  extractJsonPayload,
  normalizeTextList,
  parseCropAnalysisResponse,
} from '@/lib/crop-analysis/analysis'

describe('crop analysis response utilities', () => {
  it('normalizes, flattens, and deduplicates list values', () => {
    const result = normalizeTextList([
      '  First item  ',
      ['- Second item', '\u2022 Third item'],
      'second item; Fourth item',
      '["Fifth item", "Sixth item"]',
    ])

    expect(result).toEqual([
      'First item',
      'Second item',
      'Third item',
      'Fourth item',
      'Fifth item',
      'Sixth item',
    ])
  })

  it('extracts balanced JSON surrounded by explanatory text', () => {
    const response = `
      Analysis result:

      \`\`\`json
      {
        "overview": "Leaves show {small} brown spots"
      }
      \`\`\`

      End of response.
    `

    expect(extractJsonPayload(response)).toEqual({
      overview: 'Leaves show {small} brown spots',
    })
  })

  it('normalizes current and legacy response fields', () => {
    const response = JSON.stringify({
      plant_condition: 'Plant Disease',
      probability: '0.87',
      disease_name: 'Early blight',
      severity_level: 'moderate',
      disease_description: 'A fungal disease affecting plant leaves.',
      possible_causes: '- Warm weather\n\u2022 High humidity\nwarm weather',
      common_symptoms: '["Brown spots", "Yellow leaves"]',
      preventive_measures: [
        'Use crop rotation',
        ['Sanitize farming tools'],
      ],
      recommendations:
        'Follow product label directions; Consult a local agricultural expert',
    })

    expect(parseCropAnalysisResponse(response)).toEqual({
      condition: 'disease',
      confidence: 87,
      disease: 'Early blight',
      severity: 'medium',
      overview: 'A fungal disease affecting plant leaves.',
      causes: [
        'Warm weather',
        'High humidity',
      ],
      symptoms: [
        'Brown spots',
        'Yellow leaves',
      ],
      prevention: [
        'Use crop rotation',
        'Sanitize farming tools',
      ],
      treatmentRecommendations: [
        'Follow product label directions',
        'Consult a local agricultural expert',
      ],
      recommendations: [
        'Follow product label directions',
        'Consult a local agricultural expert',
      ],
    })
  })

  it('handles missing optional detail fields gracefully', () => {
    const response = JSON.stringify({
      condition: 'pest',
      confidence: '74%',
      disease: 'Aphid infestation',
    })

    expect(parseCropAnalysisResponse(response)).toEqual({
      condition: 'pest',
      confidence: 74,
      disease: 'Aphid infestation',
      severity: 'medium',
      overview: '',
      causes: [],
      symptoms: [],
      prevention: [],
      treatmentRecommendations: [],
      recommendations: [],
    })
  })

  it('defaults a healthy result without severity to low', () => {
    const response = JSON.stringify({
      condition: 'healthy plant',
      confidence: 0.96,
      disease: 'Healthy plant',
    })

    const result = parseCropAnalysisResponse(response)

    expect(result.condition).toBe('healthy')
    expect(result.confidence).toBe(96)
    expect(result.severity).toBe('low')
  })

  it('rejects responses without a JSON object', () => {
    expect(() =>
      parseCropAnalysisResponse('No structured result was returned'),
    ).toThrow('AI response does not contain a JSON object')
  })

  it('rejects incomplete JSON responses', () => {
    expect(() =>
      parseCropAnalysisResponse('{"condition":"disease"'),
    ).toThrow('AI response contains an incomplete JSON object')
  })

  it('rejects unsupported crop conditions', () => {
    const response = JSON.stringify({
      condition: 'unknown-condition',
      confidence: 80,
      disease: 'Unknown issue',
    })

    expect(() =>
      parseCropAnalysisResponse(response),
    ).toThrow('Unsupported crop condition')
  })

  it('rejects responses missing a disease name', () => {
    const response = JSON.stringify({
      condition: 'disease',
      confidence: 80,
    })

    expect(() =>
      parseCropAnalysisResponse(response),
    ).toThrow('Crop analysis response is missing the disease name')
  })
})

describe('buildCropAnalysisPrompt', () => {
  const languageNames = {
    en: 'English',
    hi: 'Hindi',
    mr: 'Marathi',
    gu: 'Gujarati',
    ml: 'Malayalam',
  }

  it.each(SUPPORTED_LANGUAGES)(
    'requests localized structured output for %s',
    (language) => {
      const prompt = buildCropAnalysisPrompt(language)

      expect(prompt).toContain(
        `in ${languageNames[language]}.`,
      )

      expect(prompt).toContain(
        '"treatmentRecommendations"',
      )

      expect(prompt).toContain(
        'Return only one valid JSON object',
      )

      expect(prompt).toContain(
        'Do not guarantee a diagnosis from an image alone',
      )
    },
  )
})
