'use client';

import React, { useState } from 'react';
import { ReplyBox } from './ReplyBox';

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

interface MessageCardProps {
  message: Message;
  onReplyAdded: (messageId: string, reply: { _id: string; content: string; createdAt: Date }) => void;
}

const getRelativeTime = (date: Date | string): string => {
  const now = new Date();
  const createdDate = typeof date === 'string' ? new Date(date) : date;
  const diffMs = now.getTime() - createdDate.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return createdDate.toLocaleDateString();
};

export const MessageCard: React.FC<MessageCardProps> = ({ message, onReplyAdded }) => {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replies, setReplies] = useState(message.replies);

  const handleReplySubmit = (reply: { _id: string; content: string; createdAt: Date }) => {
    setReplies([...replies, reply]);
    setShowReplyBox(false);
    onReplyAdded(message._id, reply);
  };

  return (
    <div className="bg-white border border-green-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      {/* Main Message */}
      <div className="mb-2">
        <p className="text-gray-800 text-sm leading-relaxed">{message.content}</p>
        <p className="text-gray-500 text-xs mt-2">{getRelativeTime(message.createdAt)}</p>
      </div>

      {/* Replies Count and Toggle */}
      {replies.length > 0 && (
        <button
          onClick={() => setShowReplyBox(!showReplyBox)}
          className="text-green-600 hover:text-green-700 text-xs font-medium mt-2 transition-colors"
        >
          View {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
        </button>
      )}

      {/* Reply Button */}
      {!showReplyBox && (
        <button
          onClick={() => setShowReplyBox(true)}
          className="text-green-600 hover:text-green-700 text-xs font-medium mt-2 transition-colors"
        >
          Reply
        </button>
      )}

      {/* Show Replies */}
      {(showReplyBox || replies.length > 0) && (
        <div className="mt-4 space-y-3 border-t border-green-100 pt-4">
          {replies.map((reply) => (
            <div
              key={reply._id}
              className="bg-green-50 border border-green-100 rounded p-3 text-sm"
            >
              <p className="text-gray-700">{reply.content}</p>
              <p className="text-gray-500 text-xs mt-1">
                {getRelativeTime(reply.createdAt)}
              </p>
            </div>
          ))}

          {/* Reply Input Box */}
          {showReplyBox && (
            <ReplyBox messageId={message._id} onReplySubmit={handleReplySubmit} />
          )}
        </div>
      )}
    </div>
  );
};
