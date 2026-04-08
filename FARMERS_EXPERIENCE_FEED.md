# 🌾 Farmers' Experience Feed - Quick Guide

## What Changed?

You now have a **news-style experience feed** where:
- ✅ Farmers post their experiences **anonymously** (NO LOGIN needed)
- ✅ Other users can **upvote 👍 or downvote 👎** posts
- ✅ Feed is **sorted by helpfulness** (highest-voted first)
- ✅ **Guest-friendly** - no registration required
- ✅ **Browser-based** guest tracking (localStorage)

## Features

### For Farmers (Posters)
- Share farming experiences, tips, success stories
- Posted anonymously as "Guest"
- See real-time upvote/downvote counts
- Posts sorted by community feedback

### For Readers (Voters)
- Upvote 👍 posts that were helpful
- Downvote 👎 posts that weren't helpful
- Vote as guest (no login!)
- Each guest gets a unique browser ID
- Switch vote (upvote to downvote or vice versa)

## API Endpoints

### GET `/api/experiences`
Fetch all posts (sorted by creation date)

### POST `/api/experiences`
Create a new experience post
```json
{
  "content": "Your farming experience text here"
}
```

### POST `/api/experiences/[id]/upvote`
Upvote a post (guest-tracked)
```json
{
  "guestId": "browser-unique-id"
}
```

### POST `/api/experiences/[id]/downvote`
Downvote a post (guest-tracked)
```json
{
  "guestId": "browser-unique-id"
}
```

## Database

**Collection**: `experiences`

```javascript
{
  _id: ObjectId,
  content: String,
  upvotes: Number,
  downvotes: Number,
  voterIds: [String], // Track ["upvote-guestId", "downvote-guestId"]
  createdAt: Date
}
```

## Components

### `FarmersExperienceFeed`
- Main container component
- Manages experience list
- Handles create/vote logic
- Guest ID management (localStorage)

### `ExperienceCard`
- Individual post display
- Shows content, time, vote count
- Integrates VoteButtons

### `VoteButtons`
- Upvote/downvote buttons
- Vote state management
- Prevents duplicate votes

## Guest Tracking

**No login required!** Instead:
- Guest ID stored in browser's `localStorage`
- Format: `guest-{timestamp}-{random}`
- Each guest can vote once per post
- Switching votes is allowed

## Testing

### Start Dev Server
```bash
npm run dev
```

### Create a Post
1. Visit `http://localhost:3000`
2. Scroll to "Farmers' Experiences"
3. Type an experience
4. Click "Share Experience"

### Vote on Posts
1. Click 👍 to upvote
2. Click 👎 to downvote
3. See vote count update instantly
4. Try switching your vote

### Test with Different Browser
- Open in different browser/incognito
- Gets different guest ID
- Can vote independently

## Key Differences from Previous Design

| Feature | Old (MessagePool) | New (Experience Feed) |
|---------|------|------|
| Login | ❌ Not needed | ✅ Still not needed |
| Interactions | Comments/Replies | Upvote/Downvote |
| Threading | Yes | No (simpler) |
| Sorting | Latest first | By helpfulness |
| Guest Tracking | No | Yes (localStorage) |
| Vote Prevention | No | Yes (per-post per-guest) |

## UI Flow

```
┌─────────────────────────────────┐
│  Farmers' Experiences           │
│  Share & Upvote (No Login!)    │
├─────────────────────────────────┤
│ 📝 Share Your Experience        │
│ [textarea...]                   │
│ [Share Experience Button]       │
├─────────────────────────────────┤
│ Sorted by Votes (Helpful First) │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ Experience Post             │ │
│ │ "My cotton yield increased" │ │
│ │ 2 min ago | 🌾 Farmer       │ │
│ │ 👍 12  +10   👎 2           │ │
│ │ 👍 10 helpful               │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ Another Experience          │ │
│ │ ...                         │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

## Error Handling

- **Can't upvote twice**: Shows error message
- **Can't downvote twice**: Shows error message
- **Switch vote**: Automatically removes old vote
- **Invalid ID**: Returns 404
- **Connection issues**: Shows retry prompt

## Performance

- ✅ Lazy loading ready
- ✅ Instant optimistic updates
- ✅ Efficient vote counting
- ✅ Guest tracking via localStorage
- ✅ No database lookups per vote (just increments)

## Next Steps

1. ✅ Dev server running
2. ✅ Test creating posts
3. ✅ Test voting
4. ✅ Deploy when ready

---

**Status**: ✅ Ready to Use
**No Login**: ✅ Completely Anonymous
**Guest Voting**: ✅ Full Support
