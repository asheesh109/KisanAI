/**
 * PLACE THIS FILE AT:
 *   app/api/calendar/events/reschedule/route.ts
 *
 * FIX: Updated to use OpenRouter API with proper authentication
 * OpenRouter API v1 uses Authorization: Bearer header
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY as string;
const OPENROUTER_MODEL = 'openai/gpt-oss-120b:free'; // More reliable than free tier
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export interface RescheduleRequest {
  events: Array<{
    _id: string;
    title: string;
    date: string;
    category: string;
    startTime: string;
    endTime: string;
    priority: string;
    description?: string;
    notes?: string;
  }>;
  disasterDescription: string;
  weatherAlert?: string;
  language: string;
  currentDate: string;
}

export interface RescheduledEvent {
  _id: string;
  newDate: string;
  newStartTime: string;
  newEndTime: string;
  reason: string;
  actionAdvice: string;
}

export interface RescheduleResponse {
  summary: string;
  rescheduledEvents: RescheduledEvent[];
  generalAdvice: string;
  urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // ── Guard: ensure API key is configured ───────────────────────────────────
    if (!OPENROUTER_API_KEY) {
      console.error('OPENROUTER_API_KEY is not set in environment variables');
      return NextResponse.json(
        { error: 'AI service is not configured. Please add OPENROUTER_API_KEY to your .env.local file.' },
        { status: 503 }
      );
    }

    const body: RescheduleRequest = await request.json();
    const { events, disasterDescription, weatherAlert, language, currentDate } = body;

    if (!events || !disasterDescription) {
      return NextResponse.json(
        { error: 'Events and disaster description are required' },
        { status: 400 }
      );
    }

    const languageInstruction = getLanguageInstruction(language);

    const prompt = `You are an expert agricultural advisor AI helping a farmer in India manage their farming schedule during unexpected events.

Current date: ${currentDate}

SITUATION REPORTED BY FARMER:
"${disasterDescription}"

${weatherAlert ? `WEATHER ALERT FROM SYSTEM: ${weatherAlert}` : ''}

FARMER'S CURRENT SCHEDULED EVENTS (next 30 days):
${JSON.stringify(events, null, 2)}

TASK:
Analyze the situation and provide a smart rescheduling plan. Consider:
1. Which events are URGENT to reschedule (e.g., irrigation during flood is unnecessary; harvesting before more rain is critical)
2. Which events can be postponed vs cancelled vs done earlier
3. Crop-specific advice based on the category (irrigation, fertilizer, harvest, spray, sowing, weeding, pest-management)
4. Safety of the farmer
5. Minimize crop loss

RESPONSE FORMAT — respond ONLY with valid JSON, no markdown code fences, no explanation outside JSON:
{
  "summary": "2-3 sentence overview of the situation and overall recommendation",
  "urgencyLevel": "low|medium|high|critical",
  "generalAdvice": "Detailed practical advice for the farmer given this situation",
  "rescheduledEvents": [
    {
      "_id": "exact _id from input events",
      "newDate": "YYYY-MM-DD",
      "newStartTime": "HH:MM",
      "newEndTime": "HH:MM",
      "reason": "Why this event needs to be rescheduled",
      "actionAdvice": "Specific action the farmer should take for this activity"
    }
  ]
}

IMPORTANT:
- Only include events that genuinely need rescheduling
- Keep events on the same date if they are unaffected
- For newDate, choose realistic future dates that make agricultural sense
- ${languageInstruction}
- Be empathetic and practical — this farmer's livelihood depends on this advice`;

    console.log(`[Reschedule API] Calling OpenRouter model: ${OPENROUTER_MODEL}`);

    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://kisanai.app',
        'X-Title': 'KisanAI',
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 2048,
        top_p: 0.9,
      }),
    });

    // ── Handle response ────────────────────────────────────────────────────────

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMsg = errorData?.error?.message || `OpenRouter API error (${response.status})`;
      console.error(`[Reschedule API] Error: ${errorMsg}`, errorData);

      // More helpful error messages
      if (response.status === 401) {
        return NextResponse.json(
          {
            error: 'Authentication failed. Please check your OPENROUTER_API_KEY in .env.local',
          },
          { status: 401 }
        );
      }

      if (response.status === 429) {
        return NextResponse.json(
          {
            error: 'Rate limit exceeded. Please try again in a few moments.',
          },
          { status: 429 }
        );
      }

      return NextResponse.json(
        { error: `AI service error: ${errorMsg}` },
        { status: response.status }
      );
    }

    const responseData = await response.json();
    const content = responseData?.choices?.[0]?.message?.content ?? '';

    if (!content) {
      console.error('[Reschedule API] Empty response from OpenRouter:', responseData);
      return NextResponse.json(
        { error: 'AI returned an empty response. Please try again.' },
        { status: 500 }
      );
    }

    // ── Parse JSON response ────────────────────────────────────────────────────

    // Remove markdown code fences if present
    const cleaned = content
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    let parsed: RescheduleResponse;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      console.error('[Reschedule API] Failed to parse response as JSON:', cleaned);
      return NextResponse.json(
        { error: 'AI returned an unexpected response format. Please try again.' },
        { status: 500 }
      );
    }

    // ── Validate response ──────────────────────────────────────────────────────

    if (!parsed.summary || !parsed.urgencyLevel || !Array.isArray(parsed.rescheduledEvents)) {
      console.error('[Reschedule API] Response missing required fields:', parsed);
      return NextResponse.json(
        { error: 'AI response was incomplete. Please try again.' },
        { status: 500 }
      );
    }

    console.log(`[Reschedule API] Success: ${parsed.rescheduledEvents.length} events rescheduled`);

    return NextResponse.json(parsed, { status: 200 });
  } catch (error) {
    console.error('[Reschedule API] Unexpected error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}

function getLanguageInstruction(language: string): string {
  const map: Record<string, string> = {
    en: 'Write all text fields (summary, generalAdvice, reason, actionAdvice) in clear English.',
    hi: 'Write all text fields (summary, generalAdvice, reason, actionAdvice) in simple Hindi (हिंदी) that a rural farmer can easily understand.',
    mr: 'Write all text fields (summary, generalAdvice, reason, actionAdvice) in simple Marathi (मराठी) that a rural farmer can easily understand.',
    gu: 'Write all text fields (summary, generalAdvice, reason, actionAdvice) in simple Gujarati (ગુજરાતી) that a rural farmer can easily understand.',
    ml: 'Write all text fields (summary, generalAdvice, reason, actionAdvice) in simple Malayalam (മലയാളം) that a rural farmer can easily understand.',
  };
  return map[language] ?? map['en'];
}