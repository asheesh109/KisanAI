'use client';

import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { TaskType } from '@/hooks/useTasks';
import { useLanguage } from '@/contexts/LanguageContext';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (title: string, type: TaskType, date: string, notes?: string) => void;
}

export function AddTaskModal({ isOpen, onClose, onAdd }: AddTaskModalProps) {
  const { language } = useLanguage();
  const [title, setTitle] = useState('');
  const [type, setType] = useState<TaskType>('irrigation');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const taskTypes: { value: TaskType; label: string }[] = [
    { value: 'irrigation', label: language === 'en' ? 'Irrigation' : language === 'hi' ? 'सिंचाई' : language === 'mr' ? 'सिंचन' : language === 'gu' ? 'સિંચણ' : 'ജലസേചനം' },
    { value: 'fertilizer', label: language === 'en' ? 'Fertilizer' : language === 'hi' ? 'खाद' : language === 'mr' ? 'खत' : language === 'gu' ? 'ખાતર' : 'കൃത്രിമ വളം' },
    { value: 'harvest', label: language === 'en' ? 'Harvest' : language === 'hi' ? 'कटाई' : language === 'mr' ? 'कापणी' : language === 'gu' ? 'લણણી' : 'വിളവെടുപ്പ്' },
    { value: 'spray', label: language === 'en' ? 'Spray' : language === 'hi' ? 'छिड़काव' : language === 'mr' ? 'फवारणी' : language === 'gu' ? 'છંટવાણી' : 'സ്പ്രേയിംഗ്' },
    { value: 'custom', label: language === 'en' ? 'Custom' : language === 'hi' ? 'कस्टम' : language === 'mr' ? 'कस्टम' : language === 'gu' ? 'કસ્ટમ' : 'കസ്റ്റം' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      await onAdd(title, type, date, notes || undefined);
      setTitle('');
      setType('irrigation');
      setDate(new Date().toISOString().split('T')[0]);
      setNotes('');
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {language === 'en' ? 'Add Task' : language === 'hi' ? 'कार्य जोड़ें' : language === 'mr' ? 'कार्य जोडा' : language === 'gu' ? 'કાર્ય ઉમેરો' : 'ടാസ്ക് ചേർക്കുക'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {language === 'en' ? 'Task Title*' : language === 'hi' ? 'कार्य शीर्षक*' : language === 'mr' ? 'कार्य शीर्षक*' : language === 'gu' ? 'કાર્ય શીર્ષક*' : 'ടാസ്ക് ശീർഷകം*'}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={language === 'en' ? 'Enter task title' : language === 'hi' ? 'कार्य शीर्षक दर्ज करें' : 'ટાસ્ક શીર્ષક દાખલ કરો'}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {language === 'en' ? 'Task Type' : language === 'hi' ? 'कार्य प्रकार' : language === 'mr' ? 'कार्य प्रकार' : language === 'gu' ? 'કાર્ય પ્રકાર' : 'ടാസ്ക് തരം'}
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as TaskType)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {taskTypes.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {language === 'en' ? 'Date' : language === 'hi' ? 'तारीख' : language === 'mr' ? 'तारीख' : language === 'gu' ? 'તારીખ' : 'തീയതി'}
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={today}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {language === 'en' ? 'Notes (optional)' : language === 'hi' ? 'नोट्स (वैकल्पिक)' : language === 'mr' ? 'नोट्स (वैकल्पिक)' : language === 'gu' ? 'નોટ્સ (વૈકલ્પિક)' : 'കുറിപ്പുകൾ (ഐച്ഛികം)'}
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={language === 'en' ? 'Add notes...' : language === 'hi' ? 'नोट्स जोड़ें...' : 'નોટ્સ ઉમેરો...'}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              {language === 'en' ? 'Cancel' : language === 'hi' ? 'रद्द करें' : 'રદ કરો'}
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim()}
              className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              {language === 'en' ? 'Add Task' : language === 'hi' ? 'कार्य जोड़ें' : 'કાર્ય ઉમેરો'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
