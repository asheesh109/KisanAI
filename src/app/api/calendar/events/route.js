import mongoose from 'mongoose';
import FarmingEvent from '@/models/FarmingEvent';
import { NextResponse } from 'next/server';

const MONGODB_URI = process.env.MONGODB_URI;

async function connectDB() {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(MONGODB_URI);
}

export async function GET(request) {
  try {
    await connectDB();

    const searchParams = new URL(request.url).searchParams;
    const userId = searchParams.get('userId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const query = { userId };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const events = await FarmingEvent.find(query).sort({ date: 1 });

    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    console.error('GET /api/calendar/events error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { userId, title, date, description, category, startTime, endTime, priority, notes, tags, reminder, reminderTime } = body;

    if (!userId || !title || !date) {
      return NextResponse.json(
        { error: 'User ID, title, and date are required' },
        { status: 400 }
      );
    }

    const event = new FarmingEvent({
      userId,
      title,
      date: new Date(date),
      description,
      category,
      startTime,
      endTime,
      priority,
      notes,
      tags,
      reminder,
      reminderTime,
    });

    await event.save();

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error('POST /api/calendar/events error:', error);
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    );
  }
}
