'use client';

import React from 'react';
import { ChevronUp, ThumbsUp, ThumbsDown, Clock } from 'lucide-react';

interface VoteButtonsCarouselProps {
  experienceId: string;
  upvotes: number;
  downvotes: number;
  guestId: string;
  isDarkMode: boolean;
  onVote: (upvotes: number, downvotes: number) => void;
}

export const VoteButtonsCarousel: React.FC<VoteButtonsCarouselProps> = ({
  experienceId,
  upvotes,
  downvotes,
  guestId,
  isDarkMode,
  onVote,
}) => {
  const [localUpvotes, setLocalUpvotes] = React.useState(upvotes);
  const [localDownvotes, setLocalDownvotes] = React.useState(downvotes);
  const [loading, setLoading] = React.useState(false);
  const [userVote, setUserVote] = React.useState<'upvote' | 'downvote' | null>(null);

  const handleUpvote = async () => {
    if (loading || userVote === 'upvote') return;

    setLoading(true);
    try {
      const response = await fetch(`/api/experiences/${experienceId}/upvote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guestId }),
      });

      if (response.ok) {
        const data = await response.json();
        setLocalUpvotes(data.upvotes);
        setLocalDownvotes(data.downvotes);
        setUserVote('upvote');
        onVote(data.upvotes, data.downvotes);
      }
    } catch (err) {
      console.error('Upvote error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownvote = async () => {
    if (loading || userVote === 'downvote') return;

    setLoading(true);
    try {
      const response = await fetch(`/api/experiences/${experienceId}/downvote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guestId }),
      });

      if (response.ok) {
        const data = await response.json();
        setLocalUpvotes(data.upvotes);
        setLocalDownvotes(data.downvotes);
        setUserVote('downvote');
        onVote(data.upvotes, data.downvotes);
      }
    } catch (err) {
      console.error('Downvote error:', err);
    } finally {
      setLoading(false);
    }
  };

  const score = localUpvotes - localDownvotes;

  return (
    <div
      className={`flex items-center gap-3 mt-4 p-3 rounded-lg w-fit ${
        isDarkMode
          ? 'bg-gray-800 border border-gray-700'
          : 'bg-green-50 border border-green-200'
      }`}
    >
      <button
        onClick={handleUpvote}
        disabled={loading}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
          userVote === 'upvote'
            ? isDarkMode
              ? 'bg-green-600 text-white'
              : 'bg-green-600 text-white'
            : isDarkMode
            ? 'bg-gray-700 text-gray-200 hover:bg-gray-600 border border-gray-600'
            : 'bg-white text-green-600 hover:bg-green-100 border border-green-300'
        } disabled:opacity-50`}
      >
        <ThumbsUp size={16} />
        <span className="text-sm font-semibold">{localUpvotes}</span>
      </button>

      <div
        className={`text-sm font-bold px-2 ${
          isDarkMode
            ? score > 0
              ? 'text-green-400'
              : score < 0
              ? 'text-red-400'
              : 'text-gray-400'
            : score > 0
            ? 'text-green-700'
            : score < 0
            ? 'text-red-700'
            : 'text-gray-700'
        }`}
      >
        {score > 0 ? '+' : ''}{score}
      </div>

      <button
        onClick={handleDownvote}
        disabled={loading}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
          userVote === 'downvote'
            ? 'bg-red-600 text-white'
            : isDarkMode
            ? 'bg-gray-700 text-gray-200 hover:bg-gray-600 border border-gray-600'
            : 'bg-white text-red-600 hover:bg-red-100 border border-red-300'
        } disabled:opacity-50`}
      >
        <ThumbsDown size={16} />
        <span className="text-sm font-semibold">{localDownvotes}</span>
      </button>
    </div>
  );
};
