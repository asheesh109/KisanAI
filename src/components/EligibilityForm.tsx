'use client';

import React, { useState, useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { EligibilityFilters } from '@/hooks/useSchemeFilter';

interface EligibilityFormProps {
  filters: EligibilityFilters;
  onFilterChange: (filterKey: keyof EligibilityFilters, value: any) => void;
  onApply: () => void;
  onReset: () => void;
  isDarkMode?: boolean;
}

// State options for India
const INDIA_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
];

export const EligibilityForm: React.FC<EligibilityFormProps> = ({
  filters,
  onFilterChange,
  onApply,
  onReset,
  isDarkMode = false,
}) => {
  const { translations } = useLanguage();
  const [validationError, setValidationError] = useState<string>('');

  const handleApply = useCallback(() => {
    // Basic validation: at least one filter should be selected
    if (Object.keys(filters).length === 0) {
      setValidationError(translations?.requiredFieldsEmpty || 'Please select at least one filter');
      return;
    }
    setValidationError('');
    onApply();
  }, [filters, onApply, translations]);

  const handleReset = useCallback(() => {
    setValidationError('');
    onReset();
  }, [onReset]);

  const bgClass = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const inputBgClass = isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900';
  const labelClass = isDarkMode ? 'text-gray-200' : 'text-gray-700';
  const textClass = isDarkMode ? 'text-gray-300' : 'text-gray-600';
  const sectionBgClass = isDarkMode ? 'bg-gray-750' : 'bg-gray-50';

  return (
    <div className={`p-6 ${bgClass} space-y-6`}>
      {/* Validation Error */}
      {validationError && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-700 dark:text-red-200 text-sm">{validationError}</p>
        </div>
      )}

      {/* Basic Information Section */}
      <div className={`p-4 rounded-lg ${sectionBgClass}`}>
        <h3 className={`font-semibold mb-4 ${labelClass}`}>
          {translations?.basicInfo || 'Basic Information'}
        </h3>

        {/* Age */}
        <div className="mb-4">
          <label className={`block text-sm font-medium mb-2 ${labelClass}`}>
            {translations?.age || 'Age'}
          </label>
          <input
            type="number"
            min="0"
            max="120"
            value={filters.age || ''}
            onChange={(e) => onFilterChange('age', e.target.value ? parseInt(e.target.value) : undefined)}
            placeholder="25"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${inputBgClass}`}
          />
        </div>

        {/* Gender */}
        <div className="mb-4">
          <label className={`block text-sm font-medium mb-2 ${labelClass}`}>
            {translations?.gender || 'Gender'}
          </label>
          <select
            value={filters.gender || ''}
            onChange={(e) => onFilterChange('gender', e.target.value || undefined)}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${inputBgClass}`}
          >
            <option value="">{translations?.selectGender || 'Select Gender'}</option>
            <option value="male">{translations?.male || 'Male'}</option>
            <option value="female">{translations?.female || 'Female'}</option>
            <option value="other">{translations?.other || 'Other'}</option>
          </select>
        </div>
      </div>

      {/* Location Information Section */}
      <div className={`p-4 rounded-lg ${sectionBgClass}`}>
        <h3 className={`font-semibold mb-4 ${labelClass}`}>
          {translations?.locationInfo || 'Location Details'}
        </h3>

        {/* State */}
        <div className="mb-4">
          <label className={`block text-sm font-medium mb-2 ${labelClass}`}>
            {translations?.state || 'State'}
          </label>
          <select
            value={filters.state || ''}
            onChange={(e) => onFilterChange('state', e.target.value || undefined)}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${inputBgClass}`}
          >
            <option value="">{translations?.selectState || 'Select State'}</option>
            {INDIA_STATES.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        {/* District */}
        <div className="mb-4">
          <label className={`block text-sm font-medium mb-2 ${labelClass}`}>
            {translations?.district || 'District'} ({translations?.optional || 'Optional'})
          </label>
          <input
            type="text"
            value={filters.district || ''}
            onChange={(e) => onFilterChange('district', e.target.value || undefined)}
            placeholder="Enter district name"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${inputBgClass}`}
          />
        </div>
      </div>

      {/* Financial Information Section */}
      <div className={`p-4 rounded-lg ${sectionBgClass}`}>
        <h3 className={`font-semibold mb-4 ${labelClass}`}>
          {translations?.financialInfo || 'Financial Information'}
        </h3>

        {/* Annual Income */}
        <div className="mb-4">
          <label className={`block text-sm font-medium mb-2 ${labelClass}`}>
            {translations?.annualIncome || 'Annual Income'}
          </label>
          <select
            value={filters.annualIncome || ''}
            onChange={(e) => onFilterChange('annualIncome', e.target.value || undefined)}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${inputBgClass}`}
          >
            <option value="">{translations?.selectIncome || 'Select Income Range'}</option>
            <option value="<1L">{translations?.incomeLessThan1L || '< ₹1 Lakh'}</option>
            <option value="1L-5L">{translations?.income1Lto5L || '₹1L - ₹5L'}</option>
            <option value=">5L">{translations?.incomeMoreThan5L || '> ₹5L'}</option>
          </select>
        </div>
      </div>

      {/* Farming Details Section */}
      <div className={`p-4 rounded-lg ${sectionBgClass}`}>
        <h3 className={`font-semibold mb-4 ${labelClass}`}>
          {translations?.farmingDetails || 'Farming Details'}
        </h3>

        {/* Land Ownership */}
        <div className="mb-4">
          <label className={`block text-sm font-medium mb-2 ${labelClass}`}>
            {translations?.doYouOwnLand || 'Do you own agricultural land?'}
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="landOwned"
                value="yes"
                checked={filters.landOwned === true}
                onChange={() => onFilterChange('landOwned', true)}
              />
              <span className={labelClass}>{translations?.yes || 'Yes'}</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="landOwned"
                value="no"
                checked={filters.landOwned === false}
                onChange={() => onFilterChange('landOwned', false)}
              />
              <span className={labelClass}>{translations?.no || 'No'}</span>
            </label>
          </div>
        </div>

        {/* Land Size */}
        {filters.landOwned && (
          <div className="mb-4">
            <label className={`block text-sm font-medium mb-2 ${labelClass}`}>
              {translations?.landSize || 'Land Size (in acres)'}
            </label>
            <input
              type="number"
              min="0"
              step="0.5"
              value={filters.landSize || ''}
              onChange={(e) => onFilterChange('landSize', e.target.value ? parseFloat(e.target.value) : undefined)}
              placeholder="2.5 acres"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${inputBgClass}`}
            />
          </div>
        )}

        {/* Farmer Type */}
        <div className="mb-4">
          <label className={`block text-sm font-medium mb-2 ${labelClass}`}>
            {translations?.farmerType || 'Farmer Type'}
          </label>
          <select
            value={filters.farmerType || ''}
            onChange={(e) => onFilterChange('farmerType', e.target.value || undefined)}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${inputBgClass}`}
          >
            <option value="">{translations?.selectFarmerType || 'Select Farmer Type'}</option>
            <option value="small">{translations?.smallFarmer || 'Small Farmer'}</option>
            <option value="marginal">{translations?.marginalFarmer || 'Marginal Farmer'}</option>
            <option value="large">{translations?.largeFarmer || 'Large Farmer'}</option>
          </select>
        </div>
      </div>

      {/* Social Category Section */}
      <div className={`p-4 rounded-lg ${sectionBgClass}`}>
        <h3 className={`font-semibold mb-4 ${labelClass}`}>
          {translations?.categoryInfo || 'Social Category'}
        </h3>

        {/* Social Category */}
        <div className="mb-4">
          <label className={`block text-sm font-medium mb-2 ${labelClass}`}>
            {translations?.socialCategory || 'Social Category'}
          </label>
          <select
            value={filters.socialCategory || ''}
            onChange={(e) => onFilterChange('socialCategory', e.target.value || undefined)}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${inputBgClass}`}
          >
            <option value="">{translations?.selectCategory || 'Select Category'}</option>
            <option value="general">{translations?.general || 'General'}</option>
            <option value="obc">{translations?.obc || 'OBC'}</option>
            <option value="sc">{translations?.sc || 'SC'}</option>
            <option value="st">{translations?.st || 'ST'}</option>
          </select>
        </div>

        {/* Women Farmer */}
        <div className="mb-4">
          <label className={`block text-sm font-medium mb-2 ${labelClass}`}>
            {translations?.womenFarmer || 'Are you a woman farmer?'}
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="womenFarmer"
                value="yes"
                checked={filters.womenFarmer === true}
                onChange={() => onFilterChange('womenFarmer', true)}
              />
              <span className={labelClass}>{translations?.yes || 'Yes'}</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="womenFarmer"
                value="no"
                checked={filters.womenFarmer === false}
                onChange={() => onFilterChange('womenFarmer', false)}
              />
              <span className={labelClass}>{translations?.no || 'No'}</span>
            </label>
          </div>
        </div>
      </div>

      {/* Documents Section */}
      <div className={`p-4 rounded-lg ${sectionBgClass}`}>
        <h3 className={`font-semibold mb-4 ${labelClass}`}>
          {translations?.documentsInfo || 'Documents Available'}
        </h3>

        {/* Aadhaar */}
        <div className="mb-4 flex items-center gap-3">
          <input
            type="checkbox"
            id="aadhaar"
            checked={filters.aadhaarAvailable || false}
            onChange={(e) => onFilterChange('aadhaarAvailable', e.target.checked || undefined)}
            className="w-4 h-4 rounded cursor-pointer"
          />
          <label htmlFor="aadhaar" className={`cursor-pointer ${labelClass}`}>
            {translations?.aadhaarAvailable || 'Aadhaar Card Available'}
          </label>
        </div>

        {/* Bank Account */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="bankAccount"
            checked={filters.bankAccountLinked || false}
            onChange={(e) => onFilterChange('bankAccountLinked', e.target.checked || undefined)}
            className="w-4 h-4 rounded cursor-pointer"
          />
          <label htmlFor="bankAccount" className={`cursor-pointer ${labelClass}`}>
            {translations?.bankAccountLinked || 'Bank Account Linked'}
          </label>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          onClick={handleApply}
          className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
        >
          {translations?.applyFilters || 'Apply Filters'}
        </button>
        <button
          onClick={handleReset}
          className={`flex-1 px-6 py-3 border-2 font-medium rounded-lg transition-colors ${
            isDarkMode
              ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
              : 'border-gray-300 text-gray-700 hover:bg-gray-100'
          }`}
        >
          {translations?.resetFilters || 'Reset'}
        </button>
      </div>
    </div>
  );
};

export default EligibilityForm;
