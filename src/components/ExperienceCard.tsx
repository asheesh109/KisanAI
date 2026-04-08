'use client';

import React from 'react';
import { VoteButtons } from './VoteButtons';

interface Experience {
  _id: string;
  content: string;
  upvotes: number;
  downvotes: number;
  createdAt: Date | string;
  voterIds?: string[];
}

interface ExperienceCardProps {
  experience: Experience;
  guestId: string;
  onVote: (experienceId: string, upvotes: number, downvotes: number) => void;
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

export const ExperienceCard: React.FC<ExperienceCardProps> = ({
  experience,
  guestId,
  onVote,
}) => {
  const score = experience.upvotes - experience.downvotes;

  return (
    <div className="bg-white border border-green-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
      {/* Experience Content */}
      <div className="mb-3">
        <p className="text-gray-800 text-sm leading-relaxed">{experience.content}</p>
      </div>

      {/* Footer with time and votes */}
      <div className="flex items-center justify-between">
        <span className="text-gray-500 text-xs">{getRelativeTime(experience.createdAt)}</span>
        <div className="text-green-700 text-xs font-semibold">🌾 Farmer's Experience</div>
      </div>

      {/* Vote Buttons */}
      <VoteButtons
        experienceId={experience._id}
        upvotes={experience.upvotes}
        downvotes={experience.downvotes}
        guestId={guestId}
        onVote={(upvotes, downvotes) => onVote(experience._id, upvotes, downvotes)}
      />

      {/* Score badge */}
      {score !== 0 && (
        <div className="mt-2 inline-block text-xs font-semibold px-3 py-1 rounded-full bg-green-100 text-green-800">
          {score > 0 ? `👍 ${score} helpful` : `👎 ${Math.abs(score)} not helpful`}
        </div>
      )}
    </div>
  );
};
