import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '@/lib/mongodb';

interface MessageDocument {
  _id?: ObjectId;
  content: string;
  createdAt: Date;
  replies: Array<{
    _id: ObjectId;
    content: string;
    createdAt: Date;
  }>;
}

// GET all messages - sorted by latest
export async function GET() {
  try {
    const { db } = await connectToDatabase();

    const messages = await db
      .collection<MessageDocument>('messages')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    const formattedMessages = messages.map((msg) => ({
      ...msg,
      _id: msg._id?.toString(),
      replies: msg.replies?.map((reply) => ({
        ...reply,
        _id: reply._id?.toString(),
      })) || [],
    }));

    return NextResponse.json(formattedMessages, { status: 200 });
  } catch (error) {
    console.error('GET /api/messages error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

// POST - Create a new message
export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json();

    // Validate input
    if (!content || typeof content !== 'string' || content.trim() === '') {
      return NextResponse.json(
        { error: 'Content is required and must be non-empty' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    const newMessage: MessageDocument = {
      content: content.trim(),
      createdAt: new Date(),
      replies: [],
    };

    const result = await db.collection<MessageDocument>('messages').insertOne(newMessage);

    const insertedMessage = {
      _id: result.insertedId.toString(),
      content: newMessage.content,
      createdAt: newMessage.createdAt,
      replies: [],
    };

    return NextResponse.json(insertedMessage, { status: 201 });
  } catch (error) {
    console.error('POST /api/messages error:', error);
    return NextResponse.json(
      { error: 'Failed to create message' },
      { status: 500 }
    );
  }
}
