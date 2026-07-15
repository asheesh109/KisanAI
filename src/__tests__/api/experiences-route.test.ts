import type { NextRequest } from 'next/server';
import { POST } from '@/app/api/experiences/route';
import { connectToDatabase } from '@/lib/mongodb';
import { translateExperienceToAllLanguages } from '@/lib/geminiTranslate';

jest.mock('next/server', () => {
  const actual = jest.requireActual('next/server');
  return {
    ...actual,
    NextResponse: {
      json: (body: unknown, init?: { status?: number }) => ({
        status: init?.status ?? 200,
        json: async () => body,
      }),
    },
  };
});

jest.mock('@/lib/mongodb', () => ({
  connectToDatabase: jest.fn(),
}));

jest.mock('@/lib/geminiTranslate', () => ({
  translateExperienceToAllLanguages: jest.fn(),
}));

const mockedConnectToDatabase = connectToDatabase as jest.MockedFunction<typeof connectToDatabase>;
const mockedTranslateExperienceToAllLanguages = translateExperienceToAllLanguages as jest.MockedFunction<
  typeof translateExperienceToAllLanguages
>;

describe('experiences API error handling', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does not leak raw database errors to the client', async () => {
    mockedConnectToDatabase.mockRejectedValueOnce(
      new Error('MongoServerError: Authentication failed for user "admin"')
    );
    mockedTranslateExperienceToAllLanguages.mockResolvedValueOnce({
      en: 'Translated',
      hi: 'Translated',
      mr: 'Translated',
      gu: 'Translated',
      ml: 'Translated',
    });

    const request = {
      json: async () => ({ content: 'A farming experience' }),
    } as unknown as NextRequest;

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error).toBe('Something went wrong. Please try again later.');
    expect(body.details).toBeUndefined();
    expect(body.error).not.toContain('Authentication');
  });
});
