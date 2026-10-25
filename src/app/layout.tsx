"use client";
import React, { useState } from 'react';
import { usePreferences } from '@/contexts/PreferencesContext';

export default function UserPreferencesModal() {
  const { preferences, setPreferences } = usePreferences();
  const [isOpen, setIsOpen] = useState(false);
  const [region, setRegion] = useState(preferences.region || '');

  const handleSave = () => {
    setPreferences((prev) => ({
      ...prev,
      region: region,
    }));
    setIsOpen(false);
  };

  return (
    <div className="p-2">
      <button 
        onClick={() => setIsOpen(true)}
        className="px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition"
      >
        ⚙️ Local Preferences
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-80">
            <h3 className="text-lg font-bold mb-4 dark:text-white">Farmer Preferences</h3>
            
            <label className="block text-sm font-medium mb-1 dark:text-gray-200">
              Your Region / State:
            </label>
            <input
              type="text"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              placeholder="e.g. Uttar Pradesh"
              className="w-full p-2 border rounded-md mb-4 dark:bg-gray-700 dark:text-white"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsOpen(false)}
                className="px-3 py-1 text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-1 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}