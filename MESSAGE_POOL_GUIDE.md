# 🌾 Community Message Pool Feature

A production-ready Reddit-style discussion section for KisanAI farmers to create posts, reply to messages, and engage in community discussions.

## 📋 Overview

This feature implements:
- ✅ Create text-based posts
- ✅ View all posts (latest first)
- ✅ Reply to posts (threaded comments)
- ✅ See replies nested under each post
- ✅ Relative time display ("2 min ago")
- ✅ Mobile-first responsive design
- ✅ Clean farmer-friendly green UI
- ✅ Optimistic UI updates
- ✅ Loading and error handling

## 🚀 Quick Start

### 1. Environment Setup

Add MongoDB connection string to your `.env.local`:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
```

### 2. Database Setup

The feature automatically creates:
- **Database**: `MessagePool`
- **Collection**: `messages`

No manual setup needed - the first API call will initialize it.

### 3. Start the Development Server

```bash
npm run dev
```

## 📁 File Structure

```
src/
├── app/
│   └── api/
│       └── messages/
│           ├── route.ts              # GET/POST messages
│           └── [id]/
│               └── reply/
│                   └── route.ts       # POST replies
├── components/
│   ├── MessagePool.tsx               # Main container component
│   ├── MessageCard.tsx               # Individual post card
│   └── ReplyBox.tsx                  # Reply input form
└── lib/
    └── mongodb.ts                    # MongoDB connection utility
```

## 🔌 API Endpoints

### GET /api/messages
Fetch all messages sorted by latest first.

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "content": "What's the best fertilizer for cotton?",
    "createdAt": "2024-04-07T10:30:00.000Z",
    "replies": [
      {
        "_id": "507f1f77bcf86cd799439012",
        "content": "NPK ratio works best!",
        "createdAt": "2024-04-07T10:35:00.000Z"
      }
    ]
  }
]
```

### POST /api/messages
Create a new message/post.

**Request:**
```json
{
  "content": "Your message text here"
}
```

**Response:** `201 Created`
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "content": "Your message text here",
  "createdAt": "2024-04-07T10:30:00.000Z",
  "replies": []
}
```

### POST /api/messages/[id]/reply
Add a reply to a specific message.

**Request:**
```json
{
  "content": "Your reply text here"
}
```

**Response:** `201 Created`
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "content": "Your reply text here",
  "createdAt": "2024-04-07T10:35:00.000Z"
}
```

## 🧩 Component Usage

### MessagePool (Main Component)

```tsx
import { MessagePool } from '@/components/MessagePool';

export default function Home() {
  return (
    <div>
      {/* Other sections */}
      <MessagePool />
    </div>
  );
}
```

The `MessagePool` component handles:
- Fetching all messages on mount
- Creating new messages
- Displaying loading/error states
- Managing optimistic UI updates

### MessageCard (Individual Post)

```tsx
<MessageCard 
  message={message} 
  onReplyAdded={(messageId, reply) => {
    // Handle reply addition
  }}
/>
```

Displays:
- Post content
- Relative creation time
- Reply count
- List of replies
- Reply input box

## 🎨 Styling Features

- **Green Farming Theme**: Matches KisanAI's agricultural aesthetic
- **Tailwind CSS**: Fully responsive and mobile-first
- **Cards with Shadows**: Clean, modern design
- **Hover Effects**: Interactive feedback
- **Disabled States**: Visual feedback for loading/invalid states

## ✨ UX Features

1. **Optimistic Updates**: New messages appear immediately
2. **Loading States**: "Posting...", "Loading..." indicators
3. **Error Handling**: User-friendly error messages
4. **Input Validation**: Prevents empty posts/replies
5. **Relative Time**: "2 min ago", "1h ago", etc.
6. **Threaded Replies**: Organized conversation flow

## 🔒 Data Validation

- **Empty Content Check**: Both posts and replies require non-empty text
- **ObjectId Validation**: Message IDs are validated before processing
- **Type Safety**: Full TypeScript types for all data structures

## 📊 Database Schema

```javascript
{
  _id: ObjectId,                    // Unique message ID
  content: String,                  // Post content
  createdAt: Date,                  // Creation timestamp
  replies: [
    {
      _id: ObjectId,                // Unique reply ID
      content: String,              // Reply content
      createdAt: Date               // Reply timestamp
    }
  ]
}
```

## 🧪 Testing the Feature

### Test Creating a Message

```bash
curl -X POST http://localhost:3000/api/messages \
  -H "Content-Type: application/json" \
  -d '{"content": "Hello farmers!"}'
```

### Test Fetching Messages

```bash
curl http://localhost:3000/api/messages
```

### Test Adding a Reply

```bash
curl -X POST http://localhost:3000/api/messages/{MESSAGE_ID}/reply \
  -H "Content-Type: application/json" \
  -d '{"content": "Great post!"}'
```

## 🚨 Error Handling

| Error | Status | Solution |
|-------|--------|----------|
| Empty content | 400 | Type a message before posting |
| Invalid message ID | 400 | Refresh and try again |
| Message not found | 404 | Message may have been deleted |
| Database connection | 500 | Check `MONGODB_URI` environment variable |
| Network error | 500 | Check internet connection |

## 🔧 Troubleshooting

**Q: Authorization error when connecting to MongoDB**
- A: Check your `MONGODB_URI` in `.env.local` has correct credentials
- A: Ensure your MongoDB Atlas IP whitelist includes your current IP

**Q: Messages not loading**
- A: Open DevTools → Network tab to check API response
- A: Check MongoDB is running and accessible

**Q: Replies not showing**
- A: Refresh the page to see latest replies
- A: Check browser console for any error messages

**Q: TypeScript errors in components**
- A: Run `npm run build` to check compilation
- A: Ensure all TypeScript types are properly imported

## 📝 MongoDB Connection Notes

The `mongodb.ts` utility provides:
- Connection pooling and reuse
- Automatic database selection
- Error logging
- Connection validation

Example usage:
```typescript
import { connectToDatabase } from '@/lib/mongodb';

const { db } = await connectToDatabase();
const collection = db.collection('messages');
```

## 🎯 Performance Considerations

1. **Caching**: Fetch all messages on component mount, add optimistically
2. **Pagination**: Ready for future enhancement with limit/offset
3. **Connection Pooling**: MongoDB driver handles connection reuse
4. **Index**: Consider adding index on `createdAt` for large datasets

## 🔮 Future Enhancements

- [ ] User authentication (link to farmer profiles)
- [ ] Message editing/deletion
- [ ] Like/vote system
- [ ] Search and filter
- [ ] Pagination for infinite scroll
- [ ] Image uploads in posts
- [ ] @mentions and notifications
- [ ] Moderation tools
- [ ] Admin dashboard

## 📞 Support

For issues or questions about the Message Pool feature, check:
1. This documentation file
2. Component JSDoc comments
3. Console error messages
4. MongoDB connection string

---

**Version**: 1.0.0  
**Last Updated**: April 7, 2024  
**Tested with**: Next.js 15, React 19, TypeScript 5, MongoDB Node Driver
