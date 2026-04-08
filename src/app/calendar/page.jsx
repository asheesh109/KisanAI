'use client';

import { ProfessionalCalendar } from '@/components/ProfessionalCalendar';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState, useEffect } from 'react';

export default function CalendarPage() {
  const { language } = useLanguage();
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get user ID from localStorage or use a default one
    const storedUserId = localStorage.getItem('kisanai_user_id');
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      // Generate a simple user ID for demo purposes
      const generatedId = `user_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      localStorage.setItem('kisanai_user_id', generatedId);
      setUserId(generatedId);
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            {language === 'en' ? 'Loading...' : 'लोड हो रहा है...'}
          </p>
        </div>
      </div>
    );
  }

  return <>{userId && <ProfessionalCalendar userId={userId} />}</>;
}
