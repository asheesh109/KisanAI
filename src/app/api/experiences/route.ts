import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '@/lib/mongodb';
import { translateExperienceToAllLanguages } from '@/lib/geminiTranslate';

interface ExperienceDocument {
  _id?: ObjectId;
  content: string; // Original English content
  translations?: {
    en: string;
    hi: string;
    mr: string;
    gu: string;
    ml: string;
  };
  upvotes: number;
  downvotes: number;
  voterIds: string[]; // Track which guests voted
  createdAt: Date;
}

// GET all experiences - sorted by votes (trending)
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

    const formattedExperiences = experiences.map((exp) => {
      const hasManyLanguages = exp.translations && 
        exp.translations.en && 
        exp.translations.hi && 
        exp.translations.mr;
      
      console.log('[API GET] Experience translations status:', {
        hasTranslations: !!exp.translations,
        hasManyLanguages,
        languages: exp.translations ? Object.keys(exp.translations) : 'none',
      });

      return {
        ...exp,
        _id: exp._id?.toString(),
        translations: exp.translations || {
          en: exp.content,
          hi: exp.content,
          mr: exp.content,
          gu: exp.content,
          ml: exp.content,
        },
      };
    });

    console.log('[API GET] ✅ Returning', formattedExperiences.length, 'experiences with translations');
    return NextResponse.json(formattedExperiences, { status: 200 });
  } catch (error) {
    console.error('❌ GET /api/experiences error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to fetch experiences', details: errorMessage },
      { status: 500 }
    );
  }
}

// POST - Create a new experience
export async function POST(request: NextRequest) {
  try {
    console.log('[API POST] New experience creation request');
    const { content } = await request.json();

    // Validate input
    if (!content || typeof content !== 'string' || content.trim() === '') {
      return NextResponse.json(
        { error: 'Experience content is required and must be non-empty' },
        { status: 400 }
      );
    }

    console.log('[API POST] Content:', content.substring(0, 50) + '...');

    const { db } = await connectToDatabase();

    // Get translations from Gemini
    let translations = {
      en: content.trim(),
      hi: content.trim(),
      mr: content.trim(),
      gu: content.trim(),
      ml: content.trim(),
    };

    console.log('[API POST] Calling translation service...');
    try {
      translations = await translateExperienceToAllLanguages(content.trim());
      console.log('[API POST] ✅ Translations received:', Object.keys(translations));
    } catch (translateError) {
      console.error('[API POST] ⚠️ Translation error:', translateError);
    }

    const newExperience: ExperienceDocument = {
      content: content.trim(),
      translations,
      upvotes: 0,
      downvotes: 0,
      voterIds: [],
      createdAt: new Date(),
    };

    console.log('[API POST] Inserting experience with translations:', {
      contentLength: content.length,
      hasTranslations: !!translations.hi,
    });

    const result = await db.collection<ExperienceDocument>('experiences').insertOne(newExperience);

    const insertedExperience = {
      _id: result.insertedId.toString(),
      content: newExperience.content,
      translations: newExperience.translations,
      upvotes: 0,
      downvotes: 0,
      voterIds: [],
      createdAt: newExperience.createdAt,
    };

    console.log('[API POST] ✅ Created experience:', insertedExperience._id);
    return NextResponse.json(insertedExperience, { status: 201 });
  } catch (error) {
    console.error('❌ POST /api/experiences error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to create experience', details: errorMessage },
      { status: 500 }
    );
  }
}
