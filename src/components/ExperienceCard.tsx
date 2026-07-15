'use client';

/**
 * @file ExperienceCard.tsx
 * @description Renders a single farmer experience card with vote controls and
 *              a relative-time timestamp.
 *
 * Prop types are imported from `@/types/experience` to keep the domain model
 * in a single source of truth shared with `FarmersExperienceFeed` and
 * `VoteButtons`.
 */

import React from 'react';
import { VoteButtons } from './VoteButtons';
import type { ExperienceCardProps } from '@/types/experience';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Converts a `Date` object or ISO date string into a human-readable relative
 * time label (e.g. "Just now", "5 min ago", "3h ago", "2d ago").
 *
 * @param date - The creation timestamp of the experience.
 * @returns    A short, locale-friendly relative time string.
 */
const getRelativeTime = (date: Date | string): string => {
  const now = new Date();
  const createdDate = typeof date === 'string' ? new Date(date) : date;
  const diffMs = now.getTime() - createdDate.getTime();
  const diffMins = Math.floor(diffMs / 60_000);
  const diffHours = Math.floor(diffMs / 3_600_000);
  const diffDays = Math.floor(diffMs / 86_400_000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return createdDate.toLocaleDateString();
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * `ExperienceCard` displays the textual content of a single farmer experience
 * together with a relative timestamp, a score badge, and vote buttons.
 *
 * **Prop contract** (`ExperienceCardProps` from `@/types/experience`):
 *
 * | Prop         | Type                                                        | Required | Description                                      |
 * |--------------|-------------------------------------------------------------|----------|--------------------------------------------------|
 * | `experience` | `Experience`                                                | ✅        | Full experience data object returned by the API. |
 * | `guestId`    | `string`                                                    | ✅        | Unique anonymous-user identifier from localStorage. |
 * | `onVote`     | `(experienceId: string, upvotes: number, downvotes: number) => void` | ✅ | Callback to propagate updated vote counts to parent. |
 *
 * @example
 * ```tsx
 * <ExperienceCard
 *   experience={experience}
 *   guestId={guestId}
 *   onVote={(id, up, down) => updateExperience(id, up, down)}
 * />
 * ```
 */
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

      {/* Footer with time and label */}
      <div className="flex items-center justify-between">
        <span className="text-gray-500 text-xs">{getRelativeTime(experience.createdAt)}</span>
        <div className="text-green-700 text-xs font-semibold">🌾 Farmer&apos;s Experience</div>
      </div>

      {/* Vote Buttons */}
      <VoteButtons
        experienceId={experience._id}
        upvotes={experience.upvotes}
        downvotes={experience.downvotes}
        guestId={guestId}
        onVote={(upvotes, downvotes) => onVote(experience._id, upvotes, downvotes)}
      />

      {/* Score badge — only shown when non-zero */}
      {score !== 0 && (
        <div className="mt-2 inline-block text-xs font-semibold px-3 py-1 rounded-full bg-green-100 text-green-800">
          {score > 0 ? `👍 ${score} helpful` : `👎 ${Math.abs(score)} not helpful`}
        </div>
      )}
    </div>
  );
};
