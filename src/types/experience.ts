/**
 * @file experience.ts
 * @description Shared TypeScript type definitions for the Farmers' Experience feature.
 *
 * These interfaces are consumed by:
 *  - `ExperienceCard`      – renders a single experience entry
 *  - `FarmersExperienceFeed` – fetches and lists multiple experiences
 *  - `VoteButtons`          – handles upvote / downvote interactions
 *
 * Keeping the types in one place ensures a single source of truth and
 * prevents silent drift between the consumer components.
 */

// ---------------------------------------------------------------------------
// Core domain model
// ---------------------------------------------------------------------------

/**
 * Represents a single farmer experience document as returned by the API.
 *
 * @property _id        - Unique MongoDB ObjectId string.
 * @property content    - The text body of the experience shared by the farmer.
 * @property upvotes    - Total number of upvotes received.
 * @property downvotes  - Total number of downvotes received.
 * @property createdAt  - ISO timestamp string or Date object from the server.
 * @property voterIds   - Optional array of guest IDs who have already voted;
 *                        used client-side to prevent duplicate votes.
 */
export interface Experience {
  _id: string;
  content: string;
  upvotes: number;
  downvotes: number;
  createdAt: Date | string;
  voterIds?: string[];
}

// ---------------------------------------------------------------------------
// Component prop interfaces
// ---------------------------------------------------------------------------

/**
 * Props accepted by the `ExperienceCard` component.
 *
 * @property experience - The full experience data object to render.
 * @property guestId    - Unique identifier for the anonymous guest user,
 *                        persisted in `localStorage` and forwarded to the API
 *                        to enforce one-vote-per-guest semantics.
 * @property onVote     - Callback fired after a successful vote API response.
 *                        Receives the updated `upvotes` and `downvotes` totals
 *                        alongside the `experienceId` so the parent list can
 *                        update its local state without a full refetch.
 */
export interface ExperienceCardProps {
  experience: Experience;
  guestId: string;
  onVote: (experienceId: string, upvotes: number, downvotes: number) => void;
}

/**
 * Props accepted by the `VoteButtons` component.
 *
 * @property experienceId - The `_id` of the experience being voted on.
 * @property upvotes      - Current upvote count (used as initial local state).
 * @property downvotes    - Current downvote count (used as initial local state).
 * @property guestId      - Unique guest identifier forwarded to the vote API.
 * @property onVote       - Callback invoked after a successful vote with the
 *                          updated `upvotes` and `downvotes` counts.
 */
export interface VoteButtonsProps {
  experienceId: string;
  upvotes: number;
  downvotes: number;
  guestId: string;
  onVote: (upvotes: number, downvotes: number) => void;
}
