import mongoose from 'mongoose';
import FarmingEvent from '@/models/FarmingEvent';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const MONGODB_URI = process.env.MONGODB_URI as string;

async function connectDB(): Promise<void> {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(MONGODB_URI);
}

// ─── Next.js 15: params is a Promise, must be awaited ────────────────────────
type RouteContext = { params: Promise<{ id: string }> };

export async function GET(
  _request: NextRequest,
  { params }: RouteContext
): Promise<NextResponse> {
  try {
    await connectDB();

    const { id } = await params; // ✅ await params

    if (!id) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
    }

    const event = await FarmingEvent.findById(id);

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json(event, { status: 200 });
  } catch (error) {
    console.error('GET /api/calendar/events/[id] error:', error);
    return NextResponse.json({ error: 'Failed to fetch event' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: RouteContext
): Promise<NextResponse> {
  try {
    await connectDB();

    const { id } = await params; // ✅ await params
    const body = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
    }

    const event = await FarmingEvent.findByIdAndUpdate(
      id,
      {
        title: body.title,
        date: body.date ? new Date(body.date) : undefined,
        description: body.description,
        category: body.category,
        startTime: body.startTime,
        endTime: body.endTime,
        priority: body.priority,
        notes: body.notes,
        tags: body.tags,
        reminder: body.reminder,
        reminderTime: body.reminderTime,
        isCompleted: body.isCompleted,
        color: body.color,
      },
      { new: true, runValidators: true }
    );

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json(event, { status: 200 });
  } catch (error) {
    console.error('PUT /api/calendar/events/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: RouteContext
): Promise<NextResponse> {
  try {
    await connectDB();

    const { id } = await params; // ✅ await params

    if (!id) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
    }

    const deletedEvent = await FarmingEvent.findByIdAndDelete(id);

    if (!deletedEvent) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Event deleted successfully',
        deletedId: id,
        deletedEvent: {
          id: deletedEvent._id,
          title: deletedEvent.title,
          date: deletedEvent.date,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE /api/calendar/events/[id] error:', error);
    return NextResponse.json(
      {
        error: 'Failed to delete event',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}