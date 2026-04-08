'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle2, Circle, Trash2, Plus, Lightbulb } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function TasksPage() {
  const { language } = useLanguage();
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    type: 'irrigation',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  // Load tasks from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('kisanai_farming_tasks');
    if (stored) {
      try {
        setTasks(JSON.parse(stored));
      } catch (e) {
        console.error('Error loading tasks:', e);
      }
    }
  }, []);

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem('kisanai_farming_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = () => {
    if (!formData.title.trim()) return;

    const newTask = {
      id: `task_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      ...formData,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    setTasks([...tasks, newTask]);
    setFormData({
      title: '',
      type: 'irrigation',
      date: new Date().toISOString().split('T')[0],
      notes: ''
    });
    setIsModalOpen(false);
  };

  const handleCompleteTask = (taskId) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? { ...task, status: task.status === 'completed' ? 'pending' : 'completed' }
        : task
    ));
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const getTaskTypeLabel = (type) => {
    const labels = {
      irrigation: language === 'en' ? 'Irrigation' : language === 'hi' ? 'सिंचाई' : language === 'mr' ? 'सिंचन' : language === 'gu' ? 'સિંચણ' : 'ജലസേചനം',
      fertilizer: language === 'en' ? 'Fertilizer' : language === 'hi' ? 'खाद' : language === 'mr' ? 'खत' : language === 'gu' ? 'ખાતર' : 'കൃത്രിമ വളം',
      harvest: language === 'en' ? 'Harvest' : language === 'hi' ? 'कटाई' : language === 'mr' ? 'कापणी' : language === 'gu' ? 'લણણી' : 'വിളവെടുപ്പ്',
      spray: language === 'en' ? 'Spray' : language === 'hi' ? 'छिड़काव' : language === 'mr' ? 'फवारणी' : language === 'gu' ? 'છંટવાણી' : 'സ്പ്રേയിംഗ്',
      custom: language === 'en' ? 'Custom' : language === 'hi' ? 'कस्टम' : language === 'mr' ? 'कस्टम' : language === 'gu' ? 'કસ્ટમ' : 'കസ്റ്റം',
    };
    return labels[type] || type;
  };

  const getPageTitle = () => {
    return language === 'en' ? 'Farming Tasks' :
           language === 'hi' ? 'कृषि कार्य' :
           language === 'mr' ? 'शेती कार्य' :
           language === 'gu' ? 'કૃષિ કાર્યો' : 'കൃഷി ടാസ്കുകൾ';
  };

  const getAddButtonText = () => {
    return language === 'en' ? 'Add Task' :
           language === 'hi' ? 'कार्य जोड़ें' :
           language === 'mr' ? 'कार्य जोडा' :
           language === 'gu' ? 'કાર્ય ઉમેરો' : 'ടാസ്ક ചേർക്കുക';
  };

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900">
      {/* Header */}
      <section className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 py-12 border-b border-green-200 dark:border-green-800">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="w-8 h-8 text-green-600 dark:text-green-400" />
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                  {getPageTitle()}
                </h1>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                {language === 'en' ? 'Manage your daily farming tasks' :
                 language === 'hi' ? 'अपने दैनिक कृषि कार्यों को प्रबंधित करें' :
                 language === 'mr' ? 'तुमचे दैनिक शेती कार्य व्यवस्थापित करा' :
                 language === 'gu' ? 'તમારા દૈનિક કૃષિ કાર્યો સંચાલન કરો' : 'നിങ്ങളുടെ ദൈനിക കൃഷി ജോലികൾ കൈകാര്യം ചെയ്യുക'}
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition shadow-lg"
            >
              <Plus className="w-5 h-5" />
              {getAddButtonText()}
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          {tasks.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
              <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                {language === 'en' ? 'No tasks yet. Create your first farming task!' :
                 language === 'hi' ? 'अभी कोई कार्य नहीं। अपना पहला कृषि कार्य बनाएं!' :
                 language === 'mr' ? 'अजून कोणतेही कार्य नाही। आपले पहिले शेती कार्य तयार करा!' :
                 language === 'gu' ? 'અभી કોઈ કાર્ય નથી. તમારું પ્રથમ કૃષિ કાર્ય બનાવો!' : 'ഇതുവരെ ഒരു ടാസ്കും ഇല്ല. നിങ്ങളുടെ ആദ്യ കൃഷി ജോലി സൃഷ്ടിക്കുക!'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {tasks.map(task => (
                <div
                  key={task.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4 border-green-500 hover:shadow-lg transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <button
                          onClick={() => handleCompleteTask(task.id)}
                          className="transition hover:scale-110"
                        >
                          {task.status === 'completed' ? (
                            <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                          ) : (
                            <Circle className="w-6 h-6 text-gray-400 dark:text-gray-600" />
                          )}
                        </button>
                        <h3 className={`text-lg font-semibold ${
                          task.status === 'completed'
                            ? 'line-through text-gray-500 dark:text-gray-400'
                            : 'text-gray-900 dark:text-white'
                        }`}>
                          {task.title}
                        </h3>
                      </div>
                      
                      <div className="ml-9 space-y-2">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <strong>
                            {language === 'en' ? 'Type:' :
                             language === 'hi' ? 'प्रकार:' :
                             language === 'mr' ? 'प्रकार:' :
                             language === 'gu' ? 'પ્રકાર:' : 'തരം:'}
                          </strong> {getTaskTypeLabel(task.type)}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <strong>
                            {language === 'en' ? 'Date:' :
                             language === 'hi' ? 'तारीख:' :
                             language === 'mr' ? 'तारीख:' :
                             language === 'gu' ? 'તારીખ:' : 'തീയതി:'}
                          </strong> {new Date(task.date).toLocaleDateString(
                            language === 'en' ? 'en-US' :
                            language === 'hi' ? 'hi-IN' :
                            language === 'mr' ? 'mr-IN' :
                            language === 'gu' ? 'gu-IN' : 'ml-IN'
                          )}
                        </p>
                        {task.notes && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            <strong>
                              {language === 'en' ? 'Notes:' :
                               language === 'hi' ? 'नोट्स:' :
                               language === 'mr' ? 'नोट्स:' :
                               language === 'gu' ? 'નોટ્સ:' : 'കുറിപ്പുകൾ:'}
                            </strong> {task.notes}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="text-red-500 hover:text-red-700 dark:hover:text-red-400 transition ml-4"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full mx-4">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {getAddButtonText()}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {language === 'en' ? 'Task Title*' :
                   language === 'hi' ? 'कार्य शीर्षक*' :
                   language === 'mr' ? 'कार्य शीर्षक*' :
                   language === 'gu' ? 'કાર્ય શીર્ષક*' : 'ടാസ്ക് ശീർഷകം*'}
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder={language === 'en' ? 'Enter task title' : 'કાર્ય શીર્ષક દાખલ કરો'}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {language === 'en' ? 'Task Type' :
                   language === 'hi' ? 'कार्य प्रकार' :
                   language === 'mr' ? 'कार्य प्रकार' :
                   language === 'gu' ? 'કાર્ય પ્રકાર' : 'ટാસ્ક തരം'}
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="irrigation">Irrigation</option>
                  <option value="fertilizer">Fertilizer</option>
                  <option value="harvest">Harvest</option>
                  <option value="spray">Spray</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {language === 'en' ? 'Date' :
                   language === 'hi' ? 'तारीख' :
                   language === 'mr' ? 'तारीख' :
                   language === 'gu' ? 'તારીખ' : 'തീയതി'}
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {language === 'en' ? 'Notes (optional)' :
                   language === 'hi' ? 'नोट्स (वैकल्पिक)' :
                   language === 'mr' ? 'नोट्स (वैकल्पिक)' :
                   language === 'gu' ? 'નોટ્સ (વૈકલ્પિક)' : 'കുറിപ്പുകൾ (ഐച്ഛികം)'}
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder={language === 'en' ? 'Add notes...' : 'નોટ્સ ઉમેરો...'}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              >
                {language === 'en' ? 'Cancel' :
                 language === 'hi' ? 'रद्द करें' :
                 language === 'mr' ? 'रद्द करा' :
                 language === 'gu' ? 'રદ કરો' : 'റദ്ദാക്കുക'}
              </button>
              <button
                onClick={handleAddTask}
                disabled={!formData.title.trim()}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition"
              >
                {getAddButtonText()}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
