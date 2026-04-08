'use client';

import React, { useState, useEffect } from 'react';
import { ExperienceCard } from './ExperienceCard';

interface Experience {
  _id: string;
  content: string;
  upvotes: number;
  downvotes: number;
  createdAt: Date | string;
  voterIds?: string[];
}

export const FarmersExperienceFeed: React.FC = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [newExperienceContent, setNewExperienceContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [guestId, setGuestId] = useState('');

  // Initialize guest ID from localStorage
  useEffect(() => {
    let id = localStorage.getItem('guestId');
    if (!id) {
      id = `guest-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('guestId', id);
    }
    setGuestId(id);
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch('/api/experiences');

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.details || errorData.error || 'Failed to fetch');
      }

      const data = await response.json();
      setExperiences(data);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load experiences';
      console.error('❌ Error fetching:', err);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateExperience = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newExperienceContent.trim()) {
      setError('Please share your experience');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/experiences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newExperienceContent }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.details || errorData.error || 'Failed to share');
      }

      const newExperience = await response.json();

      const formattedExperience: Experience = {
        _id: newExperience._id,
        content: newExperience.content,
        upvotes: 0,
        downvotes: 0,
        createdAt: new Date(newExperience.createdAt),
      };

      setExperiences([formattedExperience, ...experiences]);
      setNewExperienceContent('');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to share experience';
      console.error('❌ Error creating:', err);
      setError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleVote = (experienceId: string, upvotes: number, downvotes: number) => {
    setExperiences(
      experiences.map((exp) =>
        exp._id === experienceId ? { ...exp, upvotes, downvotes } : exp
      )
    );
  };

  // Sort by score (upvotes - downvotes)
  const sortedExperiences = [...experiences].sort(
    (a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes)
  );

  return (
    <section className="w-full bg-gradient-to-b from-green-50 to-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-green-800 mb-2">
            🌾 Farmers' Experiences
          </h2>
          <p className="text-gray-600 text-lg">
            Share your farming journey and upvote experiences that helped you
          </p>
        </div>

        {/* Share Experience Section */}
        <form
          onSubmit={handleCreateExperience}
          className="bg-white border-2 border-green-400 rounded-lg p-6 shadow-md mb-8"
        >
          <label className="block text-sm font-semibold text-green-800 mb-3">
            📝 Share Your Farming Experience
          </label>
          <textarea
            value={newExperienceContent}
            onChange={(e) => {
              setNewExperienceContent(e.target.value);
              if (error) setError('');
            }}
            placeholder="Share your farming experience, success story, tips, or lessons learned..."
            className="w-full p-4 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none text-gray-800"
            rows={4}
            disabled={submitting}
          />

          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

          <div className="flex items-center justify-between mt-4">
            <p className="text-xs text-gray-500">👤 Posted as Guest (no login needed)</p>
            <button
              type="submit"
              disabled={!newExperienceContent.trim() || submitting}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200"
            >
              {submitting ? 'Sharing...' : '✨ Share Experience'}
            </button>
          </div>
        </form>

        {/* Experiences Feed */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">Loading experiences...</p>
            </div>
          ) : sortedExperiences.length === 0 ? (
            <div className="bg-white border border-green-200 rounded-lg p-8 text-center">
              <p className="text-gray-600 mb-2 text-lg">No experiences yet!</p>
              <p className="text-gray-500">Be the first farmer to share your story 🌟</p>
            </div>
          ) : (
            sortedExperiences.map((experience) => (
              <ExperienceCard
                key={experience._id}
                experience={experience}
                guestId={guestId}
                onVote={handleVote}
              />
            ))
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-xs text-gray-500">
          💡 Tip: Experiences are sorted by how helpful farmers found them. Upvote to help others!
        </div>
      </div>
    </section>
  );
};
