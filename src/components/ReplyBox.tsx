'use client';

import React, { useState } from 'react';

interface ReplyBoxProps {
  messageId: string;
  onReplySubmit: (reply: { _id: string; content: string; createdAt: Date }) => void;
}

export const ReplyBox: React.FC<ReplyBoxProps> = ({ messageId, onReplySubmit }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      setError('Reply cannot be empty');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/messages/${messageId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error('Failed to add reply');
      }

      const reply = await response.json();
      onReplySubmit(reply);
      setContent('');
    } catch (err) {
      console.error('Error submitting reply:', err);
      setError('Failed to post reply. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3 space-y-2">
      <textarea
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          setError('');
        }}
        placeholder="Write a reply..."
        className="w-full p-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm resize-none"
        rows={2}
        disabled={loading}
      />
      {error && <p className="text-red-600 text-xs">{error}</p>}
      <button
        type="submit"
        disabled={!content.trim() || loading}
        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-2 px-3 rounded-lg text-sm transition-colors"
      >
        {loading ? 'Posting...' : 'Reply'}
      </button>
    </form>
  );
};
