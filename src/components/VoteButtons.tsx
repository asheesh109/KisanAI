'use client';

import React, { useState } from 'react';

interface VoteButtonsProps {
  experienceId: string;
  upvotes: number;
  downvotes: number;
  guestId: string;
  onVote: (upvotes: number, downvotes: number) => void;
}

export const VoteButtons: React.FC<VoteButtonsProps> = ({
  experienceId,
  upvotes,
  downvotes,
  guestId,
  onVote,
}) => {
  const [localUpvotes, setLocalUpvotes] = useState(upvotes);
  const [localDownvotes, setLocalDownvotes] = useState(downvotes);
  const [loading, setLoading] = useState(false);
  const [userVote, setUserVote] = useState<'upvote' | 'downvote' | null>(null);

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
    <div className="flex items-center gap-2 mt-3 bg-green-50 p-2 rounded-lg w-fit">
      <button
        onClick={handleUpvote}
        disabled={loading}
        className={`flex items-center gap-1 px-3 py-1 rounded transition-colors ${
          userVote === 'upvote'
            ? 'bg-green-600 text-white'
            : 'bg-white text-green-600 hover:bg-green-100 border border-green-300'
        } disabled:opacity-50`}
      >
        <span>👍</span>
        <span className="text-sm font-semibold">{localUpvotes}</span>
      </button>

      <div className="text-sm font-bold text-gray-700 px-2">
        {score > 0 ? '+' : ''}{score}
      </div>

      <button
        onClick={handleDownvote}
        disabled={loading}
        className={`flex items-center gap-1 px-3 py-1 rounded transition-colors ${
          userVote === 'downvote'
            ? 'bg-red-600 text-white'
            : 'bg-white text-red-600 hover:bg-red-100 border border-red-300'
        } disabled:opacity-50`}
      >
        <span>👎</span>
        <span className="text-sm font-semibold">{localDownvotes}</span>
      </button>
    </div>
  );
};
