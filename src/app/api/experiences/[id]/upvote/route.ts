import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '@/lib/mongodb';

interface VoteRequest {
  guestId: string; // Guest browser ID
}

// POST - Upvote an experience
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { guestId } = await request.json() as VoteRequest;
    const resolvedParams = await params;
    const experienceId = resolvedParams.id;

    // Validate inputs
    if (!guestId || typeof guestId !== 'string') {
      return NextResponse.json({ error: 'Guest ID required' }, { status: 400 });
    }

    if (!ObjectId.isValid(experienceId)) {
      return NextResponse.json({ error: 'Invalid experience ID' }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    const experience = await db
      .collection('experiences')
      .findOne({ _id: new ObjectId(experienceId) });

    if (!experience) {
      return NextResponse.json({ error: 'Experience not found' }, { status: 404 });
    }

    // Check if guest already voted
    const hasVoted = experience.voterIds?.includes(`upvote-${guestId}`);

    if (hasVoted) {
      return NextResponse.json(
        { error: 'You already upvoted this', upvotes: experience.upvotes },
        { status: 400 }
      );
    }

    // Remove downvote if exists
    const hasDownvoted = experience.voterIds?.includes(`downvote-${guestId}`);

    await db.collection('experiences').updateOne(
      { _id: new ObjectId(experienceId) },
      {
        $inc: {
          upvotes: 1,
          downvotes: hasDownvoted ? -1 : 0,
        },
        $addToSet: { voterIds: `upvote-${guestId}` },
        ...(hasDownvoted && {
          $pull: { voterIds: `downvote-${guestId}` },
        }),
      }
    );

    const updated = await db
      .collection('experiences')
      .findOne({ _id: new ObjectId(experienceId) });

    if (!updated) {
      return NextResponse.json(
        { error: 'Experience not found' },
        { status: 404 }
      );
    }

    console.log('✅ Upvoted experience:', experienceId);
    return NextResponse.json(
      { upvotes: updated.upvotes, downvotes: updated.downvotes },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Upvote error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to upvote', details: errorMessage },
      { status: 500 }
    );
  }
}
