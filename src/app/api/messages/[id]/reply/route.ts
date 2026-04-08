import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '@/lib/mongodb';

interface Reply {
  _id: ObjectId;
  content: string;
  createdAt: Date;
}

interface MessageDocument {
  _id?: ObjectId;
  content: string;
  createdAt: Date;
  replies: Reply[];
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { content } = await request.json();
    const resolvedParams = await params;
    const messageId = resolvedParams.id;

    // Validate input
    if (!content || typeof content !== 'string' || content.trim() === '') {
      return NextResponse.json(
        { error: 'Reply content is required and must be non-empty' },
        { status: 400 }
      );
    }

    if (!ObjectId.isValid(messageId)) {
      return NextResponse.json(
        { error: 'Invalid message ID' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    const newReply: Reply = {
      _id: new ObjectId(),
      content: content.trim(),
      createdAt: new Date(),
    };

    const result = await db.collection<MessageDocument>('messages').updateOne(
      { _id: new ObjectId(messageId) },
      {
        $push: {
          replies: newReply,
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      );
    }

    const formattedReply = {
      _id: newReply._id.toString(),
      content: newReply.content,
      createdAt: newReply.createdAt,
    };

    return NextResponse.json(formattedReply, { status: 201 });
  } catch (error) {
    console.error('POST /api/messages/[id]/reply error:', error);
    return NextResponse.json(
      { error: 'Failed to add reply' },
      { status: 500 }
    );
  }
}
