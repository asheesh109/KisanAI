'use client';

import React, { useState, useEffect } from 'react';
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
  Clock,
  X,
  Edit2,
  Trash2,
  CheckCircle2,
  Circle,
  Tag,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  getDaysInMonth,
  getFirstDayOfMonth,
  isSameDay,
  isToday,
  getMonthName,
  getDayName,
  getFullDayName,
  formatDate,
} from '@/lib/calendarUtils';

export function ProfessionalCalendar({ userId }) {
  const { language } = useLanguage();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'irrigation',
    startTime: '09:00',
    endTime: '10:00',
    priority: 'medium',
    notes: '',
  });
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Fetch events for the current month
  useEffect(() => {
    fetchEvents();
  }, [currentDate, userId]);

  const fetchEvents = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

      const response = await fetch(
        `/api/calendar/events?userId=${userId}&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
      );

      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDateClick = (day) => {
    const clicked = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(clicked);
    setEditingEvent(null);
    setFormData({
      title: '',
      description: '',
      category: 'irrigation',
      startTime: '09:00',
      endTime: '10:00',
      priority: 'medium',
      notes: '',
    });
    setShowModal(true);
  };

  const handleSaveEvent = async (e) => {
    e.preventDefault();
    setSaveError(null);
    setSaveSuccess(false);

    if (!formData.title.trim() || !selectedDate) {
      setSaveError('Please fill in the required fields');
      return;
    }

    try {
      const selectedDateTime = new Date(selectedDate);
      selectedDateTime.setHours(9, 0, 0, 0);

      const payload = {
        userId,
        title: formData.title,
        description: formData.description,
        date: selectedDateTime.toISOString(),
        category: formData.category,
        startTime: formData.startTime,
        endTime: formData.endTime,
        priority: formData.priority,
        notes: formData.notes,
      };

      console.log('Saving event with payload:', payload);

      let response;
      if (editingEvent) {
        response = await fetch(`/api/calendar/events/${editingEvent._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        response = await fetch('/api/calendar/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      const data = await response.json();
      
      if (response.ok) {
        console.log('Event saved successfully:', data);
        setSaveSuccess(true);
        await fetchEvents();
        setTimeout(() => {
          setShowModal(false);
          setFormData({
            title: '',
            description: '',
            category: 'irrigation',
            startTime: '09:00',
            endTime: '10:00',
            priority: 'medium',
            notes: '',
          });
          setEditingEvent(null);
          setSaveSuccess(false);
        }, 1000);
      } else {
        console.error('Error response:', data);
        setSaveError(data.error || 'Failed to save event');
      }
    } catch (error) {
      console.error('Failed to save event:', error);
      setSaveError(error.message || 'An error occurred while saving the event');
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm(getTranslation('deleteEventConfirmation'))) return;

    try {
      const response = await fetch(`/api/calendar/events/${eventId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchEvents();
      }
    } catch (error) {
      console.error('Failed to delete event:', error);
    }
  };

  const handleEditEvent = (event) => {
    setSelectedDate(new Date(event.date));
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description || '',
      category: event.category,
      startTime: event.startTime,
      endTime: event.endTime,
      priority: event.priority,
      notes: event.notes || '',
    });
    setShowModal(true);
  };

  const getTranslation = (key) => {
    const translations = {
      en: {
        farmingCalendar: 'Farming Calendar',
        filterByMonth: 'Filter by Month',
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
        noEventsFound: 'No events scheduled',
        deleteEventConfirmation: 'Are you sure you want to delete this event?',
        monthView: 'Month View',
        yearView: 'Year View',
        today: 'Today',
        noEvents: 'Click on a date to add an event',
      },
      hi: {
        farmingCalendar: 'कृषि कैलेंडर',
        filterByMonth: 'महीने से फ़िल्टर करें',
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
        noEventsFound: 'कोई ईवेंट शेड्यूल नहीं है',
        deleteEventConfirmation: 'क्या आप इस ईवेंट को हटाना चाहते हैं?',
        monthView: 'महीना दृश्य',
        yearView: 'वर्ष दृश्य',
        today: 'आज',
        noEvents: 'ईवेंट जोड़ने के लिए किसी दिन पर क्लिक करें',
      },
      mr: {
        farmingCalendar: 'कृषि कॅलेंडर',
        filterByMonth: 'महिन्यानुसार फिल्टर करा',
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
        noEventsFound: 'कोणतेही इव्हेंट शेड्यूल केलेले नाही',
        deleteEventConfirmation: 'हे इव्हेंट हटवायचे आहे का?',
        monthView: 'महिना दृश्य',
        yearView: 'वर्ष दृश्य',
        today: 'आज',
        noEvents: 'इव्हेंट जोडण्यासाठी तारखेवर क्लिक करा',
      },
      gu: {
        farmingCalendar: 'કૃષિ કેલેન્ડર',
        filterByMonth: 'મહિના દ્વારા ફિલ્ટર કરો',
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
        deleteEvent: 'કાઢી નાખো',
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
        noEventsFound: 'કોઈ ઇવેન્ટ શેડ્યુલ નથી',
        deleteEventConfirmation: 'શું તમે આ ઇવેન્ટ કાઢી શો છો?',
        monthView: 'મહિનો દૃશ્ય',
        yearView: 'વર્ષ દૃશ્ય',
        today: 'આજ',
        noEvents: 'ઇવેન્ટ ઉમેરવા માટે તારીખ પર ક્લિક કરો',
      },
      ml: {
        farmingCalendar: 'കൃഷി കാലെൻഡർ',
        filterByMonth: 'മാസം അനുസരിച്ച് ഫിൽട്ടർ ചെയ്യുക',
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
        noEventsFound: 'ഇവന്റ് ഷെഡ്യൂൾ ചെയ്തിട്ടില്ല',
        deleteEventConfirmation: 'ഈ ഇവന്റ് ഇല്ലാതാക്കട്ടെ?',
        monthView: 'മാസ കാഴ്ച്ച',
        yearView: 'വർഷ കാഴ്ച്ച',
        today: 'ഇന്ന്',
        noEvents: 'ഇവന്റ് ചേർക്കാൻ തീയതി ക്ലിക്ക് ചെയ്യുക',
      },
    };
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      irrigation: Droplet,
      fertilizer: Leaf,
      harvest: Sprout,
      spray: AlertCircle,
      sowing: Leaf,
      weeding: Flame,
      'pest-management': Bug,
      other: Calendar,
    };
    const IconComponent = icons[category] || Calendar;
    return <IconComponent className="w-4 h-4" />;
  };

  const getCategoryColor = (category) => {
    const colors = {
      irrigation: '#3b82f6', // blue
      fertilizer: '#10b981', // emerald
      harvest: '#f59e0b', // amber
      spray: '#ef4444', // red
      sowing: '#8b5cf6', // purple
      weeding: '#6b7280', // gray
      'pest-management': '#ec4899', // pink
      other: '#6b7280', // gray
    };
    return colors[category] || '#10b981';
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const calendarDays = Array(firstDay).fill(null);
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  const getEventsForDay = (day) => {
    if (!day) return [];
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return events.filter((event) => isSameDay(new Date(event.date), date));
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground flex items-center gap-3 mb-2">
              <Calendar className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              {getTranslation('farmingCalendar')}
            </h1>
            <p className="text-muted-foreground">
              {getMonthName(currentDate, language)} {currentDate.getFullYear()}
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedDate(new Date());
              setFormData({
                title: '',
                description: '',
                category: 'irrigation',
                startTime: '09:00',
                endTime: '10:00',
                priority: 'medium',
                notes: '',
              });
              setEditingEvent(null);
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white dark:text-white rounded-lg shadow-lg transition font-semibold"
          >
            <Plus className="w-5 h-5" />
            {getTranslation('addEvent')}
          </button>
        </div>

        {/* Month Navigation */}
        <div className="flex justify-between items-center mb-8 bg-card p-6 rounded-lg shadow">
          <button
            onClick={handlePreviousMonth}
            className="p-2 hover:bg-muted dark:hover:bg-muted rounded-lg transition"
          >
            <ChevronLeft className="w-6 h-6 text-foreground" />
          </button>

          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground">
              {getMonthName(currentDate, language)} {currentDate.getFullYear()}
            </h2>
          </div>

          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-muted dark:hover:bg-muted rounded-lg transition"
          >
            <ChevronRight className="w-6 h-6 text-foreground" />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 bg-card rounded-lg shadow-lg overflow-hidden">
          {/* Day Headers */}
          {dayNames.map((day) => (
            <div
              key={day}
              className="bg-emerald-100 dark:bg-emerald-900/30 p-4 text-center font-semibold text-foreground border-b border-border"
            >
              {day}
            </div>
          ))}

          {/* Calendar Days */}
          {calendarDays.map((day, index) => {
            const isCurrentMonth = day !== null;
            const dayEvents = isCurrentMonth ? getEventsForDay(day) : [];
            const isCurrentDay = isCurrentMonth && isToday(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));

            return (
              <div
                key={index}
                onClick={() => isCurrentMonth && handleDateClick(day)}
                className={`min-h-32 p-3 border border-border cursor-pointer transition ${
                  !isCurrentMonth
                    ? 'bg-muted dark:bg-muted'
                    : isCurrentDay
                    ? 'bg-emerald-100 dark:bg-emerald-900/20'
                    : 'bg-card dark:bg-card hover:bg-muted'
                }`}
              >
                {isCurrentMonth && (
                  <>
                    <div
                      className={`inline-flex items-center justify-center w-8 h-8 rounded-lg font-semibold mb-2 ${
                        isCurrentDay
                          ? 'bg-emerald-600 text-white'
                          : 'text-foreground'
                      }`}
                    >
                      {day}
                    </div>

                    {/* Events Display */}
                    <div className="space-y-1.5">
                      {dayEvents.slice(0, 2).map((event) => (
                        <div
                          key={event._id}
                          onClick={(e) => e.stopPropagation()}
                          className="text-xs p-1.5 rounded cursor-pointer hover:opacity-80 transition flex items-center gap-1"
                          style={{ backgroundColor: getCategoryColor(event.category) + '20', borderLeft: `3px solid ${getCategoryColor(event.category)}` }}
                        >
                          <div className="flex-1 truncate">
                            <p
                              className="font-medium truncate text-foreground"
                              style={{ color: getCategoryColor(event.category) }}
                            >
                              {event.title}
                            </p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditEvent(event);
                            }}
                            className="p-0.5 hover:bg-white/50 dark:hover:bg-gray-700/50 rounded transition"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}

                      {dayEvents.length > 2 && (
                        <div className="text-xs text-muted-foreground px-1">
                          +{dayEvents.length - 2} more
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-card rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex justify-between items-center p-6 border-b border-border sticky top-0 bg-card">
                <h2 className="text-2xl font-bold text-foreground">
                  {editingEvent ? getTranslation('edit') : getTranslation('addEvent')}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-muted rounded-lg transition"
                >
                  <X className="w-6 h-6 text-foreground" />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSaveEvent} className="p-6 space-y-4">
                {/* Error Message */}
                {saveError && (
                  <div className="p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg">
                    {saveError}
                  </div>
                )}

                {/* Success Message */}
                {saveSuccess && (
                  <div className="p-4 bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-400 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 rounded-lg">
                    Event saved successfully!
                  </div>
                )}

                {/* Date Display */}
                <div className="flex items-center gap-3 p-4 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg border border-emerald-300 dark:border-emerald-800">
                  <Calendar className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                  <div>
                    <p className="text-sm text-emerald-800 dark:text-emerald-300 font-medium">Date</p>
                    <p className="font-semibold text-foreground">
                      {selectedDate && getFullDayName(selectedDate, language)}, {selectedDate?.toLocaleDateString(language === 'en' ? 'en-US' : 'hi-IN')}
                    </p>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {getTranslation('eventTitle')}
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder={getTranslation('addEvent')}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {getTranslation('description')}
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder={getTranslation('description')}
                    rows={2}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                  />
                </div>

                {/* Row: Category and Priority */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {getTranslation('category')}
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="irrigation">{getTranslation('irrigation')}</option>
                      <option value="fertilizer">{getTranslation('fertilizer')}</option>
                      <option value="harvest">{getTranslation('harvest')}</option>
                      <option value="spray">{getTranslation('spray')}</option>
                      <option value="sowing">{getTranslation('sowing')}</option>
                      <option value="weeding">{getTranslation('weeding')}</option>
                      <option value="pest-management">{getTranslation('pestManagement')}</option>
                      <option value="other">{getTranslation('other')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {getTranslation('priority')}
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="low">{getTranslation('low')}</option>
                      <option value="medium">{getTranslation('medium')}</option>
                      <option value="high">{getTranslation('high')}</option>
                    </select>
                  </div>
                </div>

                {/* Row: Times */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {getTranslation('startTime')}
                    </label>
                    <input
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {getTranslation('endTime')}
                    </label>
                    <input
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {getTranslation('notes')}
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder={getTranslation('notes')}
                    rows={3}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-3 bg-muted hover:bg-muted/80 text-foreground rounded-lg transition font-medium"
                  >
                    {getTranslation('cancel')}
                  </button>

                  {editingEvent && (
                    <button
                      type="button"
                      onClick={() => {
                        handleDeleteEvent(editingEvent._id);
                        setShowModal(false);
                      }}
                      className="px-4 py-3 bg-red-200 hover:bg-red-300 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 rounded-lg transition font-medium flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      {getTranslation('deleteEvent')}
                    </button>
                  )}

                  <button
                    type="submit"
                    disabled={!formData.title.trim()}
                    className="flex-1 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white rounded-lg transition font-semibold"
                  >
                    {getTranslation('save')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
