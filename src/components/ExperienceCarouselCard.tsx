'use client';

import React, { useMemo } from 'react';
import { Clock, Award } from 'lucide-react';
import { VoteButtonsCarousel } from './VoteButtonsCarousel';
import { useLanguage } from '@/contexts/LanguageContext';

interface ExperienceCarouselCardProps {
  experience: {
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
  };
  guestId: string;
  isDarkMode: boolean;
  onVote: (upvotes: number, downvotes: number) => void;
  currentIndex: number;
  total: number;
  language?: string;
}

const getRelativeTime = (date: Date | string): string => {
  const now = new Date();
  const createdDate = typeof date === 'string' ? new Date(date) : date;
  const diffMs = now.getTime() - createdDate.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return createdDate.toLocaleDateString();
};

const getDisplayContent = (experience: any, language: string = 'en'): string => {
  console.log('[Card] Getting display content for language:', language);
  console.log('[Card] Experience translations available:', !!experience.translations);
  
  // If translations exist, use the one for the current language
  if (experience.translations && experience.translations[language]) {
    console.log('[Card] ✅ Using translated content for:', language, ':', experience.translations[language].substring(0, 40));
    return experience.translations[language];
  }
  
  console.log('[Card] ⚠️ Translation not found, using original content');
  // Fallback to content
  return experience.content;
};

export const ExperienceCarouselCard: React.FC<ExperienceCarouselCardProps> = ({
  experience,
  guestId,
  isDarkMode,
  onVote,
  currentIndex,
  total,
  language: propLanguage = 'en',
}) => {
  const { language: contextLanguage, translations } = useLanguage() || {
    language: 'en',
    translations: {},
  };

  // Use context language (which updates in real-time), fallback to prop if needed
  const language = contextLanguage || propLanguage || 'en';
  const score = experience.upvotes - experience.downvotes;
  
  // Use useMemo to recalculate displayContent whenever language or experience changes
  const displayContent = useMemo(() => {
    const content = getDisplayContent(experience, language);
    console.log('[Card] 🔄 displayContent recalculated for language:', language);
    return content;
  }, [experience, language]); // Re-calculate when language changes

  return (
    <div
      className={`rounded-xl p-8 shadow-lg transition-all ${
        isDarkMode
          ? 'bg-gray-900 border border-gray-800'
          : 'bg-white border-2 border-green-400'
      } min-h-96 flex flex-col justify-between`}
    >
      {/* Header with index */}
      <div className="flex justify-between items-start mb-4">
        <div
          className={`text-xs font-bold px-3 py-1 rounded-full ${
            isDarkMode
              ? 'bg-green-600 text-white'
              : 'bg-green-100 text-green-800'
          }`}
        >
          {translations?.farmExperience || 'Experience'}
        </div>
        <div
          className={`text-xs font-semibold ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          {currentIndex + 1} / {total}
        </div>
      </div>

      {/* Content */}
      <div className="mb-6 flex-grow">
        <p
          className={`text-lg leading-relaxed ${
            isDarkMode ? 'text-gray-100' : 'text-gray-800'
          }`}
        >
          {displayContent}
        </p>
      </div>

      {/* Footer with time and badge */}
      <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock
              size={14}
              className={isDarkMode ? 'text-gray-500' : 'text-gray-500'}
            />
            <span
              className={`text-xs ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}
            >
              {getRelativeTime(experience.createdAt)}
            </span>
          </div>
          {score > 0 && (
            <div className="flex items-center gap-1">
              <Award
                size={14}
                className={isDarkMode ? 'text-yellow-500' : 'text-yellow-600'}
              />
              <span
                className={`text-xs font-semibold ${
                  isDarkMode ? 'text-yellow-400' : 'text-yellow-700'
                }`}
              >
                {score} {translations?.helpful || 'helpful'}
              </span>
            </div>
          )}
        </div>

        {/* Vote Buttons */}
        <VoteButtonsCarousel
          experienceId={experience._id}
          upvotes={experience.upvotes}
          downvotes={experience.downvotes}
          guestId={guestId}
          isDarkMode={isDarkMode}
          onVote={onVote}
        />
      </div>
    </div>
  );
};
