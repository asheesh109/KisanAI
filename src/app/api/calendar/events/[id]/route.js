import mongoose from 'mongoose';
import FarmingEvent from '@/models/FarmingEvent';
import { NextResponse } from 'next/server';

const MONGODB_URI = process.env.MONGODB_URI;

async function connectDB() {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(MONGODB_URI);
}

export async function GET(request, { params }) {
  try {
    await connectDB();

    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      );
    }

    const event = await FarmingEvent.findById(id);

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(event, { status: 200 });
  } catch (error) {
    console.error('GET /api/calendar/events/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch event' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();

    const { id } = params;
    const body = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      );
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
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(event, { status: 200 });
  } catch (error) {
    console.error('PUT /api/calendar/events/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to update event' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      );
    }

    const event = await FarmingEvent.findByIdAndDelete(id);

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Event deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE /api/calendar/events/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    );
  }
}
