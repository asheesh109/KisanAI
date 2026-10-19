'use client';

import { useMarketPrice } from '@/hooks/useMarketPrice';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { TrendingUp, TrendingDown, Search, RefreshCw, AlertCircle, Calendar, IndianRupee, Loader, Filter, ChevronDown, ChevronUp, Star, Target, BarChart3, Lightbulb, MapPin, Award, Clock, Rocket, Leaf, Flame, Wheat, Nut, Sun, Apple, DollarSign, Sparkles, Database, Shield, Globe, Info } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

// ----------------------------------------------------
// Static Data & Translations
// ----------------------------------------------------
const translations = {
  // ... aapke purane translations object ki details
};

const cropCategoryTranslations = {
  // ... crop category translations
};

const commodityNames = {
  // ... commodity names
};

const staticMarketData = [
  // ... static market data
];

// ----------------------------------------------------
// Main Page Component
// ----------------------------------------------------
export default function MarketPricesPage() {
  const { language } = useLanguage();

  // 🚀 1. Client-side caching hook call (5 mins TTL)
  const { prices, isLoading, isError, mutate } = useMarketPrice('/api/market-prices', 300000);

  // States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedState, setSelectedState] = useState('all');

  // Active market prices: SWR API response agar available hai toh wo use karein, varna staticMarketData fallback
  const marketPrices = prices || staticMarketData;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Market Prices & Analytics
        </h1>
        <button
          onClick={() => mutate()}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Loading & Error States */}
      {isLoading && (
        <div className="flex items-center gap-2 text-blue-600 my-4">
          <Loader className="animate-spin w-5 h-5" />
          <span>Fetching cached/latest market data...</span>
        </div>
      )}

      {isError && (
        <div className="flex items-center gap-2 text-red-600 my-4">
          <AlertCircle className="w-5 h-5" />
          <span>Failed to load live data. Showing offline data instead.</span>
        </div>
      )}

      {/* Market Prices UI List / Grid Render */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {marketPrices.map((item, index) => (
          <div key={index} className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                  {item.crop || item.englishName}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {item.market || item.state}
                </p>
              </div>
              <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                ₹{item.price} / Quintal
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}