import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      maxlength: [60, 'Name cannot be more than 60 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password cannot be less than 6 characters'],
      select: false, // Don't return password by default
    },
    role: {
      type: String,
      enum: ['farmer', 'expert', 'admin'],
      default: 'farmer',
    },
    preferences: {
      location: {
        type: String,
        default: '',
      },
      crops: {
        type: [String],
        default: [],
      },
      language: {
        type: String,
        enum: ['en', 'hi', 'mr', 'gu', 'ml'],
        default: 'en',
      },
    },
    savedAlerts: [
      {
        type: {
          type: String,
          enum: ['weather', 'market', 'scheme'],
          required: true,
        },
        title: String,
        message: String,
        date: {
          type: Date,
          default: Date.now,
        },
        read: {
          type: Boolean,
          default: false,
        },
      }
    ],
  },
  {
    timestamps: true,
  }
);

// If the model exists, use it. Otherwise, create it.
export default mongoose.models.User || mongoose.model('User', UserSchema);
