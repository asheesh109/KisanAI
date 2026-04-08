import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, 'User ID is required'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Event title is required'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    date: {
      type: Date,
      required: [true, 'Event date is required'],
      index: true,
    },
    startTime: {
      type: String,
      default: '09:00', // HH:MM format
    },
    endTime: {
      type: String,
      default: '10:00', // HH:MM format
    },
    category: {
      type: String,
      enum: ['irrigation', 'fertilizer', 'harvest', 'spray', 'sowing', 'weeding', 'pest-management', 'other'],
      default: 'other',
    },
    color: {
      type: String,
      default: '#10b981', // emerald-500
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    notes: {
      type: String,
      maxlength: [1000, 'Notes cannot exceed 1000 characters'],
    },
    tags: [
      {
        type: String,
        maxlength: 20,
      },
    ],
    reminder: {
      type: Boolean,
      default: false,
    },
    reminderTime: {
      type: String,
      enum: ['15min', '30min', '1hour', '1day'],
      default: '1day',
    },
    recurrence: {
      type: String,
      enum: ['none', 'daily', 'weekly', 'biweekly', 'monthly'],
      default: 'none',
    },
    recurringEndDate: {
      type: Date,
    },
    attachments: [
      {
        name: String,
        url: String,
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
EventSchema.index({ userId: 1, date: 1 });
EventSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.models.FarmingEvent || mongoose.model('FarmingEvent', EventSchema);
