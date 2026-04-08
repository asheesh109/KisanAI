import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '@/lib/mongodb';
import { translateExperienceToAllLanguages } from '@/lib/geminiTranslate';

interface ExperienceDocument {
  _id?: ObjectId;
  content: string;
  translations: {
    en: string;
    hi: string;
    mr: string;
    gu: string;
    ml: string;
  };
  upvotes: number;
  downvotes: number;
  voterIds: string[];
  createdAt: Date;
}

// GET all experiences
export async function GET() {
  try {
    console.log('[API GET] Fetching experiences...');
    const { db } = await connectToDatabase();

    const experiences = await db
      .collection<ExperienceDocument>('experiences')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    console.log('[API GET] Found experiences:', experiences.length);

    const formattedExperiences = experiences.map((exp) => ({
      ...exp,
      _id: exp._id?.toString(),
      translations: exp.translations || {
        en: exp.content,
        hi: exp.content,
        mr: exp.content,
        gu: exp.content,
        ml: exp.content,
      },
    }));

    return NextResponse.json(formattedExperiences, { status: 200 });
  } catch (error) {
    console.error('❌ GET /api/experiences error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch experiences',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// POST - Create a new experience
export async function POST(request: NextRequest) {
  try {
    console.log('[API POST] New experience creation request');

    const { content } = await request.json();

    if (!content || typeof content !== 'string' || content.trim() === '') {
      return NextResponse.json(
        { error: 'Experience content is required and must be non-empty' },
        { status: 400 }
      );
    }

    const cleanContent = content.trim();

    const { db } = await connectToDatabase();

    // Default fallback translations
    let translations: ExperienceDocument['translations'] = {
      en: cleanContent,
      hi: cleanContent,
      mr: cleanContent,
      gu: cleanContent,
      ml: cleanContent,
    };

    console.log('[API POST] Calling translation service...');

    try {
      const result: any = await translateExperienceToAllLanguages(cleanContent);

      // ✅ Safe mapping (prevents TS + runtime errors)
      translations = {
        en: result?.en || cleanContent,
        hi: result?.hi || cleanContent,
        mr: result?.mr || cleanContent,
        gu: result?.gu || cleanContent,
        ml: result?.ml || cleanContent,
      };

      console.log('[API POST] ✅ Translations received');
    } catch (translateError) {
      console.error('[API POST] ⚠️ Translation failed, using fallback:', translateError);
    }

    const newExperience: ExperienceDocument = {
      content: cleanContent,
      translations,
      upvotes: 0,
      downvotes: 0,
      voterIds: [],
      createdAt: new Date(),
    };

    const result = await db
      .collection<ExperienceDocument>('experiences')
      .insertOne(newExperience);

    const insertedExperience = {
      _id: result.insertedId.toString(),
      ...newExperience,
    };

    console.log('[API POST] ✅ Created experience:', insertedExperience._id);

    return NextResponse.json(insertedExperience, { status: 201 });
  } catch (error) {
    console.error('❌ POST /api/experiences error:', error);

    return NextResponse.json(
      {
        error: 'Failed to create experience',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
