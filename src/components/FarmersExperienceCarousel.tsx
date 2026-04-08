'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Send } from 'lucide-react';
import { ExperienceCarouselCard } from './ExperienceCarouselCard';
import { useLanguage } from '@/contexts/LanguageContext';

interface Experience {
  _id: string;
  content: string;
  translations?: {
    en: string;
    hi: string;
    mr: string;
    gu: string;
    ml: string;
  };
  upvotes: number;
  downvotes: number;
  createdAt: Date | string;
}

export const FarmersExperienceCarousel: React.FC = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [newExperienceContent, setNewExperienceContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [guestId, setGuestId] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const { translations, language } = useLanguage() || {
    translations: {},
    language: 'en',
  };

  console.log('[Carousel] Current language from context:', language);

  // Watch for language changes and log them
  useEffect(() => {
    console.log('[Carousel] 🔄 Language changed to:', language);
  }, [language]);

  // Initialize guest ID and dark mode detection
  useEffect(() => {
    let id = localStorage.getItem('guestId');
    if (!id) {
      id = `guest-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('guestId', id);
    }
    setGuestId(id);

    // Detect dark mode
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);

    // Listen for dark mode changes
    const observer = new MutationObserver(() => {
      const dark = document.documentElement.classList.contains('dark');
      setIsDarkMode(dark);
    });

    observer.observe(document.documentElement, { attributes: true });

    fetchExperiences();

    return () => observer.disconnect();
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
      console.log('[Carousel] Fetched experiences:', data.length);
      if (data.length > 0) {
        console.log('[Carousel] First experience:', {
          English: data[0].translations?.en?.substring(0, 50),
          Hindi: data[0].translations?.hi?.substring(0, 50),
          Marathi: data[0].translations?.mr?.substring(0, 50),
          Gujarati: data[0].translations?.gu?.substring(0, 50),
          Malayalam: data[0].translations?.ml?.substring(0, 50),
        });
      }
      // Sort by score (upvotes - downvotes)
      const sorted = data.sort(
        (a: Experience, b: Experience) =>
          (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes)
      );
      setExperiences(sorted);
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
      setError(translations?.shareExperience || 'Please share your experience');
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
      setCurrentIndex(0);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to share experience';
      console.error('❌ Error creating:', err);
      setError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleVote = (upvotes: number, downvotes: number) => {
    const updatedExperiences = [...experiences];
    updatedExperiences[currentIndex] = {
      ...updatedExperiences[currentIndex],
      upvotes,
      downvotes,
    };
    setExperiences(updatedExperiences);
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < experiences.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <section
      className={`w-full py-12 px-4 transition-colors ${
        isDarkMode
          ? 'bg-gradient-to-b from-gray-900 to-gray-800'
          : 'bg-gradient-to-b from-green-50 to-white'
      }`}
    >
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2
            className={`text-4xl font-bold mb-2 ${
              isDarkMode ? 'text-green-400' : 'text-green-800'
            }`}
          >
            {translations?.farmersExperiences || 'Farmers\' Experiences'}
          </h2>
          <p
            className={`text-lg ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            {translations?.shareYourFarmingJourney ||
              'Share your farming journey and upvote experiences that helped you'}
          </p>
        </div>

        {/* Share Experience Section */}
        <form
          onSubmit={handleCreateExperience}
          className={`rounded-xl p-6 shadow-lg mb-8 transition-colors ${
            isDarkMode
              ? 'bg-gray-800 border-2 border-green-600'
              : 'bg-white border-2 border-green-400'
          }`}
        >
          <label
            className={`block text-sm font-semibold mb-3 ${
              isDarkMode ? 'text-green-400' : 'text-green-800'
            }`}
          >
            {translations?.shareExperience || 'Share Your Farming Experience'}
          </label>
          <textarea
            value={newExperienceContent}
            onChange={(e) => {
              setNewExperienceContent(e.target.value);
              if (error) setError('');
            }}
            placeholder={
              translations?.shareYourFarmingExperienceDesc ||
              'Share your farming experience, success story, tips, or lessons learned...'
            }
            className={`w-full p-4 border rounded-lg focus:outline-none focus:ring-2 resize-none transition-colors ${
              isDarkMode
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-green-500'
                : 'bg-white border-green-200 text-gray-800 placeholder-gray-500 focus:ring-green-500'
            }`}
            rows={4}
            disabled={submitting}
          />

          {error && (
            <p className={`text-sm mt-2 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
              {error}
            </p>
          )}

          <div className="flex items-center justify-between mt-4">
            <p
              className={`text-xs ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}
            >
              {translations?.postedAsGuest || 'Posted as Guest (no login needed)'}
            </p>
            <button
              type="submit"
              disabled={!newExperienceContent.trim() || submitting}
              className={`flex items-center gap-2 font-bold py-3 px-8 rounded-lg transition-all ${
                isDarkMode
                  ? 'bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white'
                  : 'bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white'
              }`}
            >
              <Send size={18} />
              {submitting ? 'Sharing...' : translations?.shareExperienceBtn || 'Share Experience'}
            </button>
          </div>
        </form>

        {/* Carousel Section */}
        {loading ? (
          <div
            className={`text-center py-16 rounded-xl ${
              isDarkMode ? 'bg-gray-800' : 'bg-white border border-green-200'
            }`}
          >
            <p
              className={`text-lg ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              Loading experiences...
            </p>
          </div>
        ) : experiences.length === 0 ? (
          <div
            className={`text-center py-16 rounded-xl ${
              isDarkMode
                ? 'bg-gray-800 border border-gray-700'
                : 'bg-white border-2 border-green-200'
            }`}
          >
            <p
              className={`text-lg mb-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              {translations?.farmersExperiencesEmpty || 'No experiences yet!'}
            </p>
            <p
              className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
            >
              {translations?.beFirstFarmerShare ||
                'Be the first farmer to share your story'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Current Experience Card */}
            <ExperienceCarouselCard
              experience={experiences[currentIndex]}
              guestId={guestId}
              isDarkMode={isDarkMode}
              onVote={handleVote}
              currentIndex={currentIndex}
              total={experiences.length}
              language={language || 'en'}
            />

            {/* Navigation Buttons */}
            {experiences.length > 1 && (
              <div className="flex items-center justify-between">
                <button
                  onClick={handlePrevious}
                  disabled={currentIndex === 0}
                  className={`flex items-center gap-2 p-3 rounded-lg font-semibold transition-all ${
                    currentIndex === 0
                      ? isDarkMode
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : isDarkMode
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  <ChevronLeft size={20} />
                  {translations?.previousExperience || 'Previous'}
                </button>

                <div
                  className={`text-center font-semibold ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  {currentIndex + 1} {translations?.of || 'of'} {experiences.length}
                </div>

                <button
                  onClick={handleNext}
                  disabled={currentIndex === experiences.length - 1}
                  className={`flex items-center gap-2 p-3 rounded-lg font-semibold transition-all ${
                    currentIndex === experiences.length - 1
                      ? isDarkMode
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : isDarkMode
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {translations?.nextExperience || 'Next'}
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Footer Tip */}
        {experiences.length > 0 && (
          <div
            className={`mt-8 text-center text-xs ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}
          >
            {translations?.farmersExperienceTip ||
              'Experiences are sorted by how helpful farmers found them. Upvote to help others!'}
          </div>
        )}
      </div>
    </section>
  );
};
