'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Droplet,
  Leaf,
  Sprout,
  Flame,
  Bug,
  AlertCircle,
  Calendar,
  X,
  Edit2,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  getDaysInMonth,
  getFirstDayOfMonth,
  isSameDay,
  isToday,
  getMonthName,
  getFullDayName,
} from '@/lib/calendarUtils';
import { SmartReschedulePanel } from './SmartReschedulePanel';
import type { RescheduledEvent } from '@/app/api/calendar/events/reschedule/route';

// ─── Types ────────────────────────────────────────────────────────────────────

type Language = 'en' | 'hi' | 'mr' | 'gu' | 'ml';

type EventCategory =
  | 'irrigation'
  | 'fertilizer'
  | 'harvest'
  | 'spray'
  | 'sowing'
  | 'weeding'
  | 'pest-management'
  | 'other';

type EventPriority = 'low' | 'medium' | 'high';

export interface CalendarEvent {
  _id: string;
  userId: string;
  title: string;
  description?: string;
  date: string;
  category: EventCategory;
  startTime: string;
  endTime: string;
  priority: EventPriority;
  notes?: string;
}

interface EventFormData {
  title: string;
  description: string;
  category: EventCategory;
  startTime: string;
  endTime: string;
  priority: EventPriority;
  notes: string;
}

interface ProfessionalCalendarProps {
  userId: string;
  weatherAlert?: string | null;
  onEventDelete?: (eventId: string) => void;
}

type TranslationKey =
  | 'farmingCalendar' | 'addEvent' | 'eventTitle' | 'description'
  | 'category' | 'startTime' | 'endTime' | 'priority' | 'notes'
  | 'save' | 'cancel' | 'deleteEvent' | 'edit'
  | 'irrigation' | 'fertilizer' | 'harvest' | 'spray' | 'sowing'
  | 'weeding' | 'pestManagement' | 'other'
  | 'low' | 'medium' | 'high'
  | 'deleteEventConfirmation' | 'today' | 'noEvents' | 'smartReschedule';

type Translations = Record<TranslationKey, string>;
type TranslationMap = Record<Language, Translations>;

// ─── Constants ────────────────────────────────────────────────────────────────

const TRANSLATIONS: TranslationMap = {
  en: {
    farmingCalendar: 'Farming Calendar',
    addEvent: 'Add Event',
    eventTitle: 'Event Title *',
    description: 'Description',
    category: 'Category',
    startTime: 'Start Time',
    endTime: 'End Time',
    priority: 'Priority',
    notes: 'Notes',
    save: 'Save Event',
    cancel: 'Cancel',
    deleteEvent: 'Delete',
    edit: 'Edit',
    irrigation: 'Irrigation',
    fertilizer: 'Fertilizer',
    harvest: 'Harvest',
    spray: 'Spray',
    sowing: 'Sowing',
    weeding: 'Weeding',
    pestManagement: 'Pest Management',
    other: 'Other',
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    deleteEventConfirmation: 'Are you sure you want to delete this event?',
    today: 'Today',
    noEvents: 'Tap a date to add an event',
    smartReschedule: 'Smart Reschedule',
  },
  hi: {
    farmingCalendar: 'कृषि कैलेंडर',
    addEvent: 'ईवेंट जोड़ें',
    eventTitle: 'ईवेंट शीर्षक *',
    description: 'विवरण',
    category: 'श्रेणी',
    startTime: 'शुरुआत का समय',
    endTime: 'समाप्ति का समय',
    priority: 'प्राथमिकता',
    notes: 'नोट्स',
    save: 'ईवेंट सहेजें',
    cancel: 'रद्द करें',
    deleteEvent: 'हटाएं',
    edit: 'संपादित करें',
    irrigation: 'सिंचाई',
    fertilizer: 'खाद',
    harvest: 'कटाई',
    spray: 'छिड़काव',
    sowing: 'बुवाई',
    weeding: 'गुड़ाई',
    pestManagement: 'कीट प्रबंधन',
    other: 'अन्य',
    low: 'कम',
    medium: 'मध्यम',
    high: 'उच्च',
    deleteEventConfirmation: 'क्या आप इस ईवेंट को हटाना चाहते हैं?',
    today: 'आज',
    noEvents: 'ईवेंट जोड़ने के लिए किसी दिन पर टैप करें',
    smartReschedule: 'स्मार्ट पुनर्निर्धारण',
  },
  mr: {
    farmingCalendar: 'कृषि कॅलेंडर',
    addEvent: 'इव्हेंट जोडा',
    eventTitle: 'इव्हेंट शीर्षक *',
    description: 'वर्णन',
    category: 'वर्ग',
    startTime: 'सुरुवातीचा वेळ',
    endTime: 'समाप्तीचा वेळ',
    priority: 'प्राधान्यता',
    notes: 'नोट्स',
    save: 'इव्हेंट जतन करा',
    cancel: 'रद्द करा',
    deleteEvent: 'हटवा',
    edit: 'संपादित करा',
    irrigation: 'सिंचन',
    fertilizer: 'खत',
    harvest: 'कापणी',
    spray: 'फवारणी',
    sowing: 'बिया',
    weeding: 'हलकावणी',
    pestManagement: 'कीटक व्यवस्थापन',
    other: 'इतर',
    low: 'कमी',
    medium: 'मध्यम',
    high: 'उच्च',
    deleteEventConfirmation: 'हे इव्हेंट हटवायचे आहे का?',
    today: 'आज',
    noEvents: 'इव्हेंट जोडण्यासाठी तारखेवर टॅप करा',
    smartReschedule: 'स्मार्ट पुनर्निर्धारण',
  },
  gu: {
    farmingCalendar: 'કૃષિ કેલેન્ડર',
    addEvent: 'ઇવેન્ટ ઉમેરો',
    eventTitle: 'ઇવેન્ટ શીર્ષક *',
    description: 'વર્ણન',
    category: 'શ્રેણી',
    startTime: 'શરૂવાતનો સમય',
    endTime: 'અંતનો સમય',
    priority: 'પ્રાધાન્ય',
    notes: 'નોટ્સ',
    save: 'ઇવેન્ટ સાચવો',
    cancel: 'રદ કરો',
    deleteEvent: 'કાઢી નાખો',
    edit: 'સંપાદિત કરો',
    irrigation: 'સિંચણ',
    fertilizer: 'ખાતર',
    harvest: 'લણણી',
    spray: 'છંટવાણી',
    sowing: 'વાવણી',
    weeding: 'નીંદણ',
    pestManagement: 'જંતુ નિયંત્રણ',
    other: 'અન્ય',
    low: 'ઓછું',
    medium: 'મધ્યમ',
    high: 'ઉચ્ચ',
    deleteEventConfirmation: 'શું તમે આ ઇવેન્ટ કાઢી શો છો?',
    today: 'આજ',
    noEvents: 'ઇવેન્ટ ઉમેરવા માટે તારીખ પર ટૅપ કરો',
    smartReschedule: 'સ્માર્ટ પુનઃ-સૂચિ',
  },
  ml: {
    farmingCalendar: 'കൃഷി കാലെൻഡർ',
    addEvent: 'ഇവന്റ് ചേർക്കുക',
    eventTitle: 'ഇവന്റ് ശീർഷകം *',
    description: 'വിവരണം',
    category: 'വിഭാഗം',
    startTime: 'ആരംഭ സമയം',
    endTime: 'സമാപ്ത സമയം',
    priority: 'മുൻഗണന',
    notes: 'കുറിപ്പ്',
    save: 'ഇവന്റ് സംരക്ഷിക്കുക',
    cancel: 'റദ്ദാക്കുക',
    deleteEvent: 'ഇല്ലാതാക്കുക',
    edit: 'തിരുത്തുക',
    irrigation: 'സേചനം',
    fertilizer: 'വളം',
    harvest: 'വിളവെടുപ്പ്',
    spray: 'സ്പ്രേയിംഗ്',
    sowing: 'വിതരണം',
    weeding: 'കളമെടുക്കൽ',
    pestManagement: 'കീടനിയന്ത്രണം',
    other: 'മറ്റ്',
    low: 'കുറഞ്ഞത്',
    medium: 'ഇടത്തരം',
    high: 'ഉയർച്ച',
    deleteEventConfirmation: 'ഈ ഇവന്റ് ഇല്ലാതാക്കട്ടെ?',
    today: 'ഇന്ന്',
    noEvents: 'ഇവന്റ് ചേർക്കാൻ തീയതി ടാപ്പ് ചെയ്യുക',
    smartReschedule: 'സ്മാർട്ട് ഷെഡ്യൂൾ മാറ്റം',
  },
};

const CATEGORY_COLORS: Record<EventCategory, string> = {
  irrigation: '#3b82f6',
  fertilizer: '#10b981',
  harvest: '#f59e0b',
  spray: '#ef4444',
  sowing: '#8b5cf6',
  weeding: '#6b7280',
  'pest-management': '#ec4899',
  other: '#94a3b8',
};

const DEFAULT_FORM: EventFormData = {
  title: '',
  description: '',
  category: 'irrigation',
  startTime: '09:00',
  endTime: '10:00',
  priority: 'medium',
  notes: '',
};

const DAY_NAMES_SHORT = ['S', 'M', 'T', 'W', 'T', 'F', 'S'] as const;
const DAY_NAMES_FULL = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

// ─── Component ────────────────────────────────────────────────────────────────

export function ProfessionalCalendar({
  userId,
  weatherAlert,
  onEventDelete,
}: ProfessionalCalendarProps): React.ReactElement {
  const { language } = useLanguage() as { language: Language };

  // ── State ──────────────────────────────────────────────────────────────────

  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [formData, setFormData] = useState<EventFormData>(DEFAULT_FORM);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [daySheetDate, setDaySheetDate] = useState<Date | null>(null);
  const [showReschedule, setShowReschedule] = useState<boolean>(false);
  const [weatherPrompted, setWeatherPrompted] = useState<boolean>(false);

  const t = (key: TranslationKey): string =>
    TRANSLATIONS[language]?.[key] ?? TRANSLATIONS.en[key] ?? key;

  // ── Weather Alert Effect ───────────────────────────────────────────────────

  useEffect(() => {
    if (weatherAlert && !weatherPrompted) {
      setShowReschedule(true);
      setWeatherPrompted(true);
    }
  }, [weatherAlert, weatherPrompted]);

  // ── Fetch Events ───────────────────────────────────────────────────────────

  const fetchEvents = useCallback(async (): Promise<void> => {
    if (!userId) return;
    setLoading(true);
    try {
      const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      const res = await fetch(
        `/api/calendar/events?userId=${userId}&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
      );
      if (res.ok) {
        const data: CalendarEvent[] = await res.json();
        setEvents(data);
      }
    } catch (err) {
      console.error('Failed to fetch events:', err);
    } finally {
      setLoading(false);
    }
  }, [currentDate, userId]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // ── Smart Reschedule ───────────────────────────────────────────────────────

  const handleConfirmReschedule = async (rescheduled: RescheduledEvent[]): Promise<void> => {
    await Promise.all(
      rescheduled.map(async (r) => {
        const original = events.find((e) => e._id === r._id);
        if (!original) return;
        await fetch(`/api/calendar/events/${r._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            title: original.title,
            description: original.description,
            date: new Date(r.newDate).toISOString(),
            category: original.category,
            startTime: r.newStartTime,
            endTime: r.newEndTime,
            priority: original.priority,
            notes: original.notes,
          }),
        });
      })
    );
    await fetchEvents();
  };

  // ── Modal Helpers ──────────────────────────────────────────────────────────

  const openAddModal = (date: Date): void => {
    setSelectedDate(date);
    setEditingEvent(null);
    setFormData(DEFAULT_FORM);
    setSaveError(null);
    setSaveSuccess(false);
    setDaySheetDate(null);
    setShowModal(true);
  };

  const handleEditEvent = (event: CalendarEvent): void => {
    setSelectedDate(new Date(event.date));
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description ?? '',
      category: event.category,
      startTime: event.startTime,
      endTime: event.endTime,
      priority: event.priority,
      notes: event.notes ?? '',
    });
    setSaveError(null);
    setSaveSuccess(false);
    setDaySheetDate(null);
    setShowModal(true);
  };

  const handleDateClick = (day: number): void => {
    const clicked = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dayEvts = getEventsForDay(day);
    if (dayEvts.length > 0) {
      setDaySheetDate(clicked);
    } else {
      openAddModal(clicked);
    }
  };

  // ── Save Event ─────────────────────────────────────────────────────────────

  const handleSaveEvent = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setSaveError(null);
    setSaveSuccess(false);
    if (!formData.title.trim() || !selectedDate) {
      setSaveError('Please fill in the required fields');
      return;
    }
    try {
      const dt = new Date(selectedDate);
      dt.setHours(9, 0, 0, 0);
      const payload = { userId, ...formData, date: dt.toISOString() };
      const url = editingEvent
        ? `/api/calendar/events/${editingEvent._id}`
        : '/api/calendar/events';
      const method = editingEvent ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        setSaveSuccess(true);
        await fetchEvents();
        setTimeout(() => {
          setShowModal(false);
          setFormData(DEFAULT_FORM);
          setEditingEvent(null);
          setSaveSuccess(false);
        }, 800);
      } else {
        setSaveError(data.error ?? 'Failed to save event');
      }
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  // ── Delete Event ───────────────────────────────────────────────────────────

  const handleDeleteEvent = async (eventId: string, closeModal = false): Promise<void> => {
    if (!window.confirm(t('deleteEventConfirmation'))) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/calendar/events/${eventId}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchEvents();
        onEventDelete?.(eventId);
        setDaySheetDate(null);
        if (closeModal) {
          setShowModal(false);
          setEditingEvent(null);
          setFormData(DEFAULT_FORM);
        }
      } else {
        const data = await res.json();
        console.error('Delete failed:', data.error);
      }
    } catch (err) {
      console.error('Failed to delete event:', err);
    } finally {
      setDeleteLoading(false);
    }
  };

  // ── Helpers ────────────────────────────────────────────────────────────────

  const getCategoryIcon = (category: EventCategory): React.ReactElement => {
    const map: Record<EventCategory, React.ElementType> = {
      irrigation: Droplet,
      fertilizer: Leaf,
      harvest: Sprout,
      spray: AlertCircle,
      sowing: Leaf,
      weeding: Flame,
      'pest-management': Bug,
      other: Calendar,
    };
    const Icon = map[category] ?? Calendar;
    return <Icon className="w-3 h-3 shrink-0" />;
  };

  const getCategoryColor = (cat: EventCategory): string =>
    CATEGORY_COLORS[cat] ?? '#10b981';

  const getEventsForDay = (day: number): CalendarEvent[] => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return events.filter((ev) => isSameDay(new Date(ev.date), date));
  };

  // ── Calendar Grid Data ─────────────────────────────────────────────────────

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const calendarDays: (number | null)[] = [
    ...Array<null>(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-4">

        {/* ── Header ── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-3xl font-bold text-foreground flex items-center gap-2">
              <Calendar className="w-5 h-5 sm:w-7 sm:h-7 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="truncate">{t('farmingCalendar')}</span>
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 ml-7">
              {getMonthName(currentDate, language)} {currentDate.getFullYear()}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowReschedule((v) => !v)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-semibold text-xs sm:text-sm shadow transition ${
                showReschedule
                  ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-700'
                  : 'bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">{t('smartReschedule')}</span>
            </button>
            <button
              onClick={() => openAddModal(new Date())}
              className="flex items-center gap-1.5 px-3 py-2 sm:px-5 sm:py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl shadow-md transition font-semibold text-sm shrink-0"
            >
              <Plus className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">{t('addEvent')}</span>
            </button>
          </div>
        </div>

        {/* ── Smart Reschedule Panel ── */}
        {showReschedule && (
          <SmartReschedulePanel
            events={events}
            language={language}
            weatherAlert={weatherAlert}
            onConfirmReschedule={handleConfirmReschedule}
            onDismiss={() => setShowReschedule(false)}
            autoOpenWithWeather={!!weatherAlert && !weatherPrompted}
          />
        )}

        {/* ── Weather Alert Banner ── */}
        {weatherAlert && !showReschedule && (
          <button
            onClick={() => setShowReschedule(true)}
            className="w-full flex items-center gap-3 px-4 py-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl text-left hover:bg-amber-100 dark:hover:bg-amber-950/50 transition"
          >
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <p className="text-sm text-amber-800 dark:text-amber-200 font-medium truncate">
              {weatherAlert}
            </p>
            <span className="ml-auto text-xs text-amber-600 dark:text-amber-400 font-semibold shrink-0">
              View →
            </span>
          </button>
        )}

        {/* ── Month Navigation ── */}
        <div className="flex items-center justify-between bg-card border border-border rounded-2xl px-3 py-2.5 sm:px-6 sm:py-4 shadow-sm">
          <button
            onClick={() =>
              setCurrentDate(
                new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
              )
            }
            className="p-2 hover:bg-muted active:bg-muted/70 rounded-xl transition touch-manipulation"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <h2 className="text-sm sm:text-xl font-bold text-foreground">
            {getMonthName(currentDate, language)} {currentDate.getFullYear()}
          </h2>
          <button
            onClick={() =>
              setCurrentDate(
                new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
              )
            }
            className="p-2 hover:bg-muted active:bg-muted/70 rounded-xl transition touch-manipulation"
          >
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>
        </div>

        {/* ── Calendar Grid ── */}
        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">

          {/* Day headers */}
          <div className="grid grid-cols-7 border-b border-border">
            {DAY_NAMES_FULL.map((day, i) => (
              <div
                key={day}
                className="py-2 sm:py-3 text-center text-xs font-semibold text-muted-foreground bg-emerald-50 dark:bg-emerald-950/20 select-none"
              >
                <span className="sm:hidden">{DAY_NAMES_SHORT[i]}</span>
                <span className="hidden sm:inline">{day}</span>
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7">
            {calendarDays.map((day, index) => {
              if (day === null) {
                return (
                  <div
                    key={`empty-${index}`}
                    className="min-h-[44px] sm:min-h-[88px] bg-muted/20 border-b border-r border-border/40"
                  />
                );
              }

              const dayEvts = getEventsForDay(day);
              const isCurrentDay = isToday(
                new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
              );

              return (
                <div
                  key={day}
                  onClick={() => handleDateClick(day)}
                  className={`
                    min-h-[44px] sm:min-h-[88px] p-1 sm:p-2
                    border-b border-r border-border/40
                    cursor-pointer transition-colors touch-manipulation select-none
                    ${
                      isCurrentDay
                        ? 'bg-emerald-50 dark:bg-emerald-950/30'
                        : 'bg-card hover:bg-muted/50 active:bg-muted'
                    }
                  `}
                >
                  {/* Day number */}
                  <div className="flex justify-center sm:justify-start mb-0.5 sm:mb-1">
                    <span
                      className={`
                        inline-flex items-center justify-center
                        w-6 h-6 sm:w-7 sm:h-7 rounded-full text-xs sm:text-sm font-semibold
                        ${isCurrentDay ? 'bg-emerald-600 text-white' : 'text-foreground'}
                      `}
                    >
                      {day}
                    </span>
                  </div>

                  {/* Desktop: event pills */}
                  <div className="hidden sm:block space-y-0.5">
                    {dayEvts.slice(0, 2).map((ev) => (
                      <div
                        key={ev._id}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditEvent(ev);
                        }}
                        className="flex items-center gap-1 text-xs px-1.5 py-0.5 rounded cursor-pointer hover:opacity-80 transition truncate"
                        style={{
                          backgroundColor: getCategoryColor(ev.category) + '22',
                          borderLeft: `3px solid ${getCategoryColor(ev.category)}`,
                          color: getCategoryColor(ev.category),
                        }}
                      >
                        {getCategoryIcon(ev.category)}
                        <span className="truncate font-medium">{ev.title}</span>
                      </div>
                    ))}
                    {dayEvts.length > 2 && (
                      <p className="text-[10px] text-muted-foreground pl-1">
                        +{dayEvts.length - 2} more
                      </p>
                    )}
                  </div>

                  {/* Mobile: colored dots */}
                  {dayEvts.length > 0 && (
                    <div className="flex sm:hidden justify-center flex-wrap gap-[3px] mt-0.5">
                      {dayEvts.slice(0, 3).map((ev) => (
                        <span
                          key={ev._id}
                          className="w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ backgroundColor: getCategoryColor(ev.category) }}
                        />
                      ))}
                      {dayEvts.length > 3 && (
                        <span className="text-[9px] leading-none text-muted-foreground">
                          +{dayEvts.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Loading Spinner ── */}
        {loading && (
          <div className="flex justify-center">
            <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* ── Mobile Day Detail Bottom Sheet ── */}
      {daySheetDate && (
        <div
          className="fixed inset-0 z-40 flex flex-col justify-end bg-black/40"
          onClick={() => setDaySheetDate(null)}
        >
          <div
            className="bg-card rounded-t-3xl shadow-2xl max-h-[75vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
            </div>

            <div className="px-5 pb-8">
              <div className="flex items-center justify-between mb-4 mt-1">
                <div>
                  <p className="text-xs text-muted-foreground">
                    {getFullDayName(daySheetDate, language)}
                  </p>
                  <h3 className="text-lg font-bold text-foreground">
                    {daySheetDate.toLocaleDateString(
                      language === 'en' ? 'en-US' : 'hi-IN',
                      {
                        day: 'numeric',
                        month: 'long',
                      }
                    )}
                  </h3>
                </div>
                <button
                  onClick={() => openAddModal(daySheetDate)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm rounded-xl font-semibold shadow"
                >
                  <Plus className="w-3.5 h-3.5" />
                  {t('addEvent')}
                </button>
              </div>

              <div className="space-y-2">
                {getEventsForDay(daySheetDate.getDate()).map((ev) => (
                  <div
                    key={ev._id}
                    className="flex items-center gap-3 p-3 rounded-xl border border-border bg-background"
                    style={{
                      borderLeftColor: getCategoryColor(ev.category),
                      borderLeftWidth: 4,
                    }}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground text-sm truncate">
                        {ev.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {ev.startTime} – {ev.endTime}
                      </p>
                    </div>
                    <button
                      onClick={() => handleEditEvent(ev)}
                      className="p-2 hover:bg-muted rounded-lg transition shrink-0"
                    >
                      <Edit2 className="w-4 h-4 text-foreground" />
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(ev._id)}
                      disabled={deleteLoading}
                      className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition shrink-0 disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Add / Edit Modal ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50">
          <div className="bg-card w-full sm:rounded-2xl sm:max-w-lg sm:mx-4 rounded-t-3xl shadow-2xl max-h-[92vh] overflow-y-auto">

            {/* Drag handle (mobile only) */}
            <div className="flex justify-center pt-3 sm:hidden">
              <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-border sticky top-0 bg-card z-10">
              <h2 className="text-base sm:text-xl font-bold text-foreground">
                {editingEvent ? t('edit') : t('addEvent')}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-muted rounded-xl transition"
              >
                <X className="w-5 h-5 text-foreground" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveEvent} className="px-5 sm:px-6 py-4 space-y-4">

              {saveError && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-xl text-sm">
                  {saveError}
                </div>
              )}
              {saveSuccess && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 rounded-xl text-sm">
                  Event saved successfully!
                </div>
              )}

              {/* Date chip */}
              <div className="flex items-center gap-3 px-4 py-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl border border-emerald-200 dark:border-emerald-800">
                <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                    Date
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    {selectedDate && getFullDayName(selectedDate, language)},{' '}
                    {selectedDate?.toLocaleDateString(
                      language === 'en' ? 'en-US' : 'hi-IN'
                    )}
                  </p>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5 uppercase tracking-wide">
                  {t('eventTitle')}
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-border rounded-xl bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5 uppercase tracking-wide">
                  {t('description')}
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={2}
                  className="w-full px-4 py-2.5 border border-border rounded-xl bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none text-sm"
                />
              </div>

              {/* Category + Priority */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5 uppercase tracking-wide">
                    {t('category')}
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      setFormData({
                        ...formData,
                        category: e.target.value as EventCategory,
                      })
                    }
                    className="w-full px-3 py-2.5 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  >
                    <option value="irrigation">{t('irrigation')}</option>
                    <option value="fertilizer">{t('fertilizer')}</option>
                    <option value="harvest">{t('harvest')}</option>
                    <option value="spray">{t('spray')}</option>
                    <option value="sowing">{t('sowing')}</option>
                    <option value="weeding">{t('weeding')}</option>
                    <option value="pest-management">
                      {t('pestManagement')}
                    </option>
                    <option value="other">{t('other')}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5 uppercase tracking-wide">
                    {t('priority')}
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      setFormData({
                        ...formData,
                        priority: e.target.value as EventPriority,
                      })
                    }
                    className="w-full px-3 py-2.5 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  >
                    <option value="low">{t('low')}</option>
                    <option value="medium">{t('medium')}</option>
                    <option value="high">{t('high')}</option>
                  </select>
                </div>
              </div>

              {/* Times */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5 uppercase tracking-wide">
                    {t('startTime')}
                  </label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, startTime: e.target.value })
                    }
                    className="w-full px-3 py-2.5 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5 uppercase tracking-wide">
                    {t('endTime')}
                  </label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, endTime: e.target.value })
                    }
                    className="w-full px-3 py-2.5 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5 uppercase tracking-wide">
                  {t('notes')}
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-2.5 border border-border rounded-xl bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none text-sm"
                />
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 pt-1 pb-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 bg-muted hover:bg-muted/80 text-foreground rounded-xl transition font-semibold text-sm"
                >
                  {t('cancel')}
                </button>

                {editingEvent && (
                  <button
                    type="button"
                    onClick={() => handleDeleteEvent(editingEvent._id, true)}
                    disabled={deleteLoading}
                    className="px-4 py-3 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded-xl transition font-semibold text-sm flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4 shrink-0" />
                    <span className="hidden xs:inline">
                      {deleteLoading ? '…' : t('deleteEvent')}
                    </span>
                  </button>
                )}

                <button
                  type="submit"
                  disabled={!formData.title.trim()}
                  className="flex-1 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white rounded-xl transition font-semibold text-sm disabled:cursor-not-allowed"
                >
                  {t('save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}