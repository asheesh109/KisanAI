'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import EligibilityForm from './EligibilityForm';
import { EligibilityFilters } from '@/hooks/useSchemeFilter';

interface EligibilityDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: EligibilityFilters;
  onFilterChange: (filterKey: keyof EligibilityFilters, value: any) => void;
  onApply: () => void;
  onReset: () => void;
  eligibleCount?: number;
  totalCount?: number;
  isDarkMode?: boolean;
}

export const EligibilityDrawer: React.FC<EligibilityDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onApply,
  onReset,
  eligibleCount = 0,
  totalCount = 0,
  isDarkMode = false,
}) => {
  const { translations } = useLanguage();

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleApplyClick = () => {
    onApply();
    // Don't close automatically - let the parent decide
  };

  const bgClass = isDarkMode ? 'bg-gray-900' : 'bg-white';
  const overlayClass = isDarkMode ? 'bg-black/50' : 'bg-black/30';
  const headerBgClass = isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200';
  const textClass = isDarkMode ? 'text-gray-100' : 'text-gray-900';
  const subtextClass = isDarkMode ? 'text-gray-400' : 'text-gray-600';

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className={`fixed inset-0 ${overlayClass} z-40 transition-opacity duration-300`}
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Drawer Container */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-md ${bgClass} shadow-2xl z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div
          className={`sticky top-0 border-b ${headerBgClass} p-6 flex items-center justify-between`}
        >
          <div>
            <h2 className={`text-xl font-bold ${textClass}`}>
              {translations?.eligibilityChecker || 'Eligibility Checker'}
            </h2>
            <p className={`text-sm mt-1 ${subtextClass}`}>
              {translations?.findSchemesForYou || 'Find schemes that match your profile'}
            </p>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode
                ? 'text-gray-400 hover:bg-gray-700'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
            aria-label="Close drawer"
          >
            <X size={24} />
          </button>
        </div>

        {/* Results Summary */}
        {Object.keys(filters).length > 0 && (
          <div className={`mx-6 mt-6 p-4 ${isDarkMode ? 'bg-green-900/30 border-green-700' : 'bg-green-50 border-green-200'} border rounded-lg`}>
            <p className={`${isDarkMode ? 'text-green-200' : 'text-green-800'} font-medium`}>
              {translations?.filtersApplied || 'Filters Applied'}
            </p>
            <p className={`mt-2 text-lg font-bold ${isDarkMode ? 'text-green-100' : 'text-green-900'}`}>
              {eligibleCount} {translations?.matchingSchemes || 'matching schemes found'}
            </p>
            <p className={`text-sm mt-1 ${subtextClass}`}>
              {eligibleCount} of {totalCount} schemes
            </p>
          </div>
        )}

        {/* Form */}
        <div className="mt-6">
          <EligibilityForm
            filters={filters}
            onFilterChange={onFilterChange}
            onApply={handleApplyClick}
            onReset={onReset}
            isDarkMode={isDarkMode}
          />
        </div>

        {/* Info Footer */}
        <div className={`border-t ${headerBgClass} p-6 mt-6`}>
          <p className={`text-xs ${subtextClass}`}>
            🔒 {translations?.personalizeSchemes || 'Personalize Schemes'}
          </p>
          <p className={`text-xs mt-2 ${subtextClass}`}>
            Your information is used only to filter schemes and is not stored or shared.
          </p>
        </div>
      </div>
    </>
  );
};

export default EligibilityDrawer;
