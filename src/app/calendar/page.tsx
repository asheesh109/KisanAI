'use client';

import { ProfessionalCalendar } from '@/components/ProfessionalCalendar';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState, useEffect } from 'react';

export default function CalendarPage() {
  const { language } = useLanguage();
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedUserId = localStorage.getItem('kisanai_user_id');
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      const generatedId = `user_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      localStorage.setItem('kisanai_user_id', generatedId);
      setUserId(generatedId);
    }
    setIsLoading(false);
  }, []);

  // ✅ Notification only — no fetch, no duplicate DELETE
  const handleEventDelete = (eventId: string): void => {
    // ProfessionalCalendar already deleted the event and called fetchEvents().
    // Add any page-level side effects here (toast, analytics, etc.)
    console.log('Event deleted:', eventId);
  };

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

  return (
    <>
      {userId && (
        <ProfessionalCalendar
          userId={userId}
          onEventDelete={handleEventDelete}
        />
      )}
    </>
  );
}