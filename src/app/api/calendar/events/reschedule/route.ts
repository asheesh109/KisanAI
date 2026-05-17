/**
 * PLACE THIS FILE AT:
 *   app/api/calendar/events/reschedule/route.ts
 *
 * This file handles AI-powered event rescheduling during disasters/weather alerts.
 * Uses OpenRouter API with proper authentication and error handling.
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_MODEL = 'openai/gpt-4o-mini'; // Free tier model, reliable
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

/**
 * POST /api/calendar/events/reschedule
 * Analyzes a disaster/weather situation and returns rescheduling recommendations
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // ─── Validate API Key ─────────────────────────────────────────────────────
    if (!OPENROUTER_API_KEY) {
      console.error('[Reschedule] Missing OPENROUTER_API_KEY environment variable');
      return NextResponse.json(
        {
          error: 'AI service is not configured. Please add OPENROUTER_API_KEY to your .env.local file.',
          hint: 'Get a free API key from https://openrouter.ai',
        },
        { status: 503 }
      );
    }

    // ─── Parse Request Body ───────────────────────────────────────────────────
    let body: RescheduleRequest;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const { events, disasterDescription, weatherAlert, language, currentDate } = body;

    if (!events || !Array.isArray(events) || !disasterDescription) {
      return NextResponse.json(
        { error: 'Missing required fields: events (array) and disasterDescription (string)' },
        { status: 400 }
      );
    }

    if (events.length === 0) {
      return NextResponse.json(
        {
          summary: 'No events to reschedule.',
          rescheduledEvents: [],
          generalAdvice: 'Your schedule is currently empty.',
          urgencyLevel: 'low',
        },
        { status: 200 }
      );
    }

    const languageInstruction = getLanguageInstruction(language);

    // ─── Build AI Prompt ──────────────────────────────────────────────────────
    const prompt = `You are an expert agricultural advisor AI helping a farmer in India manage their farming schedule during unexpected events.

Current date: ${currentDate}

SITUATION REPORTED BY FARMER:
"${disasterDescription}"

${weatherAlert ? `\nWEATHER ALERT FROM SYSTEM:\n${weatherAlert}` : ''}

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
  "generalAdvice": "Detailed practical advice for the farmer given this situation. Be empathetic and practical.",
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
- Always return valid JSON that can be parsed`;

    // ─── Call OpenRouter API ───────────────────────────────────────────────────
    console.log(`[Reschedule] Calling OpenRouter API with model: ${OPENROUTER_MODEL}`);

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

    // ─── Handle OpenRouter Response ────────────────────────────────────────────
    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      let errorData: unknown;

      try {
        if (contentType?.includes('application/json')) {
          errorData = await response.json();
        } else {
          const text = await response.text();
          errorData = { raw: text };
        }
      } catch {
        errorData = { raw: 'Could not parse error response' };
      }

      console.error(`[Reschedule] OpenRouter API error (${response.status}):`, errorData);

      // ─── Specific error handling ──────────────────────────────────────────
      if (response.status === 401) {
        return NextResponse.json(
          {
            error: 'Authentication failed with OpenRouter API.',
            hint: 'Check that OPENROUTER_API_KEY is correct in .env.local',
          },
          { status: 401 }
        );
      }

      if (response.status === 429) {
        return NextResponse.json(
          {
            error: 'Rate limit exceeded. OpenRouter free tier may have usage limits.',
            hint: 'Try again in a few moments or upgrade your OpenRouter account.',
          },
          { status: 429 }
        );
      }

      if (response.status === 400) {
        return NextResponse.json(
          {
            error: 'Invalid request to OpenRouter API.',
            details: errorData,
          },
          { status: 400 }
        );
      }

      return NextResponse.json(
        {
          error: `OpenRouter API returned status ${response.status}`,
          details: errorData,
        },
        { status: response.status }
      );
    }

    const responseData = await response.json();
    const content = responseData?.choices?.[0]?.message?.content ?? '';

    if (!content) {
      console.error('[Reschedule] Empty response from OpenRouter:', responseData);
      return NextResponse.json(
        { error: 'AI returned an empty response. Please try again.' },
        { status: 500 }
      );
    }

    // ─── Parse JSON Response ──────────────────────────────────────────────────
    const cleaned = content
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    let parsed: RescheduleResponse;
    try {
      parsed = JSON.parse(cleaned);
    } catch (parseError) {
      console.error('[Reschedule] Failed to parse response as JSON:', cleaned);
      return NextResponse.json(
        {
          error: 'AI returned an unexpected response format.',
          rawResponse: cleaned.slice(0, 500),
        },
        { status: 500 }
      );
    }

    // ─── Validate Response Structure ───────────────────────────────────────────
    if (!parsed.summary || !parsed.urgencyLevel || !Array.isArray(parsed.rescheduledEvents)) {
      console.error('[Reschedule] Response missing required fields:', parsed);
      return NextResponse.json(
        { error: 'AI response was incomplete. Please try again.' },
        { status: 500 }
      );
    }

    // ─── Validate rescheduled events structure ────────────────────────────────
    const validatedEvents: RescheduledEvent[] = parsed.rescheduledEvents
      .filter((ev: unknown) => {
        const evt = ev as Record<string, unknown>;
        return (
          typeof evt._id === 'string' &&
          typeof evt.newDate === 'string' &&
          typeof evt.newStartTime === 'string' &&
          typeof evt.newEndTime === 'string' &&
          typeof evt.reason === 'string' &&
          typeof evt.actionAdvice === 'string'
        );
      });

    console.log(`[Reschedule] Success: ${validatedEvents.length} events rescheduled`);

    return NextResponse.json(
      {
        summary: parsed.summary,
        urgencyLevel: parsed.urgencyLevel,
        generalAdvice: parsed.generalAdvice,
        rescheduledEvents: validatedEvents,
      } as RescheduleResponse,
      { status: 200 }
    );
  } catch (error) {
    console.error('[Reschedule] Unexpected server error:', error);
    const errorMsg = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      {
        error: errorMsg,
        type: 'server_error',
      },
      { status: 500 }
    );
  }
}

/**
 * Language-specific instruction for the AI
 */
function getLanguageInstruction(language: string): string {
  const instructions: Record<string, string> = {
    en: 'Write all text fields (summary, generalAdvice, reason, actionAdvice) in clear, concise English.',
    hi: 'Write all text fields in simple Hindi (हिंदी) that a rural farmer can easily understand.',
    mr: 'Write all text fields in simple Marathi (मराठी) that a rural farmer can easily understand.',
    gu: 'Write all text fields in simple Gujarati (ગુજરાતી) that a rural farmer can easily understand.',
    ml: 'Write all text fields in simple Malayalam (മലയാളം) that a rural farmer can easily understand.',
  };
  return instructions[language] ?? instructions['en'];
}