'use client';

import React, { useState, useEffect } from 'react';
import { MessageCard } from './MessageCard';

interface Message {
  _id: string;
  content: string;
  createdAt: Date | string;
  replies: Array<{
    _id: string;
    content: string;
    createdAt: Date | string;
  }>;
}

export const MessagePool: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessageContent, setNewMessageContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Fetch messages on mount
  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch('/api/messages');

      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }

      const data = await response.json();
      setMessages(data);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('Failed to load messages. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessageContent.trim()) {
      setError('Message cannot be empty');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newMessageContent }),
      });

      if (!response.ok) {
        throw new Error('Failed to create message');
      }

      const newMessage = await response.json();

      // Optimistic UI update
      const formattedMessage: Message = {
        _id: newMessage._id,
        content: newMessage.content,
        createdAt: new Date(newMessage.createdAt),
        replies: [],
      };

      setMessages([formattedMessage, ...messages]);
      setNewMessageContent('');
    } catch (err) {
      console.error('Error creating message:', err);
      setError('Failed to post message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReplyAdded = (messageId: string, reply: { _id: string; content: string; createdAt: Date }) => {
    // Reply is already added optimistically in MessageCard component
  };

  return (
    <section className="w-full bg-gradient-to-b from-green-50 to-white py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-green-800 mb-2">
            🌾 Community Message Pool
          </h2>
          <p className="text-gray-600">
            Connect with farmers, share experiences, and ask questions
          </p>
        </div>

        {/* Create Message Section */}
        <form
          onSubmit={handleCreateMessage}
          className="bg-white border-2 border-green-300 rounded-lg p-6 shadow-md mb-8"
        >
          <label className="block text-sm font-semibold text-green-800 mb-3">
            Post a Message
          </label>
          <textarea
            value={newMessageContent}
            onChange={(e) => {
              setNewMessageContent(e.target.value);
              if (error) setError('');
            }}
            placeholder="Share your farming experience, ask a question, or offer advice..."
            className="w-full p-4 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none text-gray-800"
            rows={4}
            disabled={submitting}
          />

          {error && (
            <p className="text-red-600 text-sm mt-2">{error}</p>
          )}

          <div className="flex justify-end mt-4">
            <button
              type="submit"
              disabled={!newMessageContent.trim() || submitting}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200"
            >
              {submitting ? 'Posting...' : 'Post Message'}
            </button>
          </div>
        </form>

        {/* Messages List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Loading messages...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="bg-white border border-green-200 rounded-lg p-8 text-center">
              <p className="text-gray-600 mb-2">No messages yet!</p>
              <p className="text-gray-500 text-sm">Be the first to share your farming story</p>
            </div>
          ) : (
            messages.map((message) => (
              <MessageCard
                key={message._id}
                message={message}
                onReplyAdded={handleReplyAdded}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
};
