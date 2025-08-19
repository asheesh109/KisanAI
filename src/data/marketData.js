/**
 * Market data types and utilities for KisanAI Market Prices feature
 */

/**
 * Crop Price Object Structure
 * @typedef {Object} CropPrice
 * @property {number} id - Unique identifier
 * @property {string} crop - Crop name
 * @property {number} price - Current price
 * @property {string} change - Price change amount
 * @property {string} changePercent - Price change percentage
 * @property {string} market - Market name
 * @property {string} unit - Unit of measurement
 * @property {'up'|'down'} trending - Price trend direction
 * @property {number} minPrice - Minimum price
 * @property {number} maxPrice - Maximum price
 * @property {number} avgPrice - Average price
 * @property {string} volume - Trading volume
 * @property {string} quality - Quality grade
 * @property {string} lastUpdated - Last update timestamp
 * @property {string} forecast - Price forecast
 * @property {'very_low'|'low'|'medium'|'high'|'very_high'} demand - Demand level
 * @property {'very_low'|'low'|'medium'|'high'|'very_high'} supply - Supply level
 */

/**
 * Market Object Structure
 * @typedef {Object} Market
 * @property {string} name - Market name
 * @property {string} distance - Distance from user
 * @property {number} crops - Number of crops available
 * @property {'खुला'|'बंद'} status - Market status
 * @property {string} timing - Market timing
 * @property {string} contact - Contact information
 */

/**
 * Price Alert Object Structure
 * @typedef {Object} PriceAlert
 * @property {number} id - Alert identifier
 * @property {string} crop - Crop name
 * @property {number} targetPrice - Target price for alert
 * @property {number} currentPrice - Current market price
 * @property {'ऊपर'|'नीचे'} status - Alert status
 * @property {'above'|'below'} alertType - Type of alert
 * @property {string} created - Creation date
 */

/**
 * Market Insight Object Structure
 * @typedef {Object} MarketInsight
 * @property {string} title - Insight title
 * @property {string} description - Insight description
 * @property {'low'|'medium'|'high'} impact - Impact level
 * @property {string} timeframe - Time frame
 */

// Utility functions for market data processing

/**
 * Calculate price change and trending direction
 * @param {number} currentPrice - Current price
 * @param {number} previousPrice - Previous price
 * @returns {Object} Price change data
 */
const calculatePriceChange = (currentPrice, previousPrice) => {
  const diff = currentPrice - previousPrice
  const percentChange = (diff / previousPrice) * 100
  
  return {
    change: diff >= 0 ? `+${diff}` : `${diff}`,
    changePercent: diff >= 0 ? `+${percentChange.toFixed(1)}%` : `${percentChange.toFixed(1)}%`,
    trending: diff >= 0 ? 'up' : 'down'
  }
}

/**
 * Determine demand and supply levels with forecast
 * @param {number} demand - Demand value (1-5 scale)
 * @param {number} supply - Supply value (1-5 scale)
 * @returns {Object} Demand/supply status and forecast
 */
const getDemandSupplyStatus = (demand, supply) => {
  let demandLevel
  let supplyLevel
  
  // Determine demand level (1-5 scale)
  if (demand >= 4.5) demandLevel = 'very_high'
  else if (demand >= 3.5) demandLevel = 'high'
  else if (demand >= 2.5) demandLevel = 'medium'
  else if (demand >= 1.5) demandLevel = 'low'
  else demandLevel = 'very_low'
  
  // Determine supply level (1-5 scale)
  if (supply >= 4.5) supplyLevel = 'very_high'
  else if (supply >= 3.5) supplyLevel = 'high'
  else if (supply >= 2.5) supplyLevel = 'medium'
  else if (supply >= 1.5) supplyLevel = 'low'
  else supplyLevel = 'very_low'
  
  // Generate forecast based on demand-supply ratio
  let forecast = 'स्थिर रहने की संभावना'
  const ratio = demand / supply
  
  if (ratio > 1.5) forecast = 'तेजी से बढ़ने की संभावना'
  else if (ratio > 1.2) forecast = 'बढ़ने की संभावना'
  else if (ratio < 0.8) forecast = 'गिरने की संभावना'
  else if (ratio < 0.6) forecast = 'तेजी से गिरने की संभावना'
  
  return { demandLevel, supplyLevel, forecast }
}

/**
 * Get list of crop categories
 * @returns {string[]} Array of crop categories
 */
const getCropCategories = () => [
  'अनाज',
  'दलहन',
  'तिलहन',
  'सब्जियां',
  'फल',
  'मसाले',
  'नकदी फसल',
  'चारा फसल'
]

/**
 * Get crops by category
 * @param {string} category - Category name
 * @returns {string[]} Array of crops in the category
 */
const getCropsByCategory = (category) => {
  const categories = {
    'अनाज': ['गेहूं', 'चावल', 'मक्का', 'बाजरा', 'ज्वार'],
    'दलहन': ['अरहर', 'चना', 'मसूर', 'मूंग', 'उड़द'],
    'तिलहन': ['सोयाबीन', 'मूंगफली', 'सरसों', 'तिल', 'अलसी'],
    'सब्जियां': ['प्याज', 'आलू', 'टमाटर', 'मिर्च', 'बैंगन'],
    'फल': ['आम', 'केला', 'सेब', 'संतरा', 'अनार'],
    'मसाले': ['हल्दी', 'धनिया', 'जीरा', 'काली मिर्च', 'इलायची'],
    'नकदी फसल': ['कपास', 'गन्ना', 'तंबाकू', 'जूट'],
    'चारा फसल': ['बरसीम', 'ज्वार', 'मक्का', 'जई']
  }
  
  return categories[category] || []
}

/**
 * Get markets by state
 * @param {string} state - State name
 * @returns {Market[]} Array of markets in the state
 */
const getMarketsByState = (state) => {
  // This would typically come from an API
  const markets = {
    'दिल्ली': [
      {
        name: 'आज़ादपुर मंडी',
        distance: '12 km',
        crops: 35,
        status: 'खुला',
        timing: '4:00 AM - 12:00 PM',
        contact: '011-2358-7410'
      },
      {
        name: 'गाज़ीपुर मंडी',
        distance: '18 km',
        crops: 28,
        status: 'खुला',
        timing: '5:00 AM - 1:00 PM',
        contact: '011-2214-3625'
      }
    ],
    'हरियाणा': [
      {
        name: 'करनाल मंडी',
        distance: '78 km',
        crops: 42,
        status: 'खुला',
        timing: '5:00 AM - 1:00 PM',
        contact: '0184-2258-741'
      },
      {
        name: 'सोनीपत मंडी',
        distance: '45 km',
        crops: 38,
        status: 'खुला',
        timing: '6:00 AM - 2:00 PM',
        contact: '0130-2214-852'
      }
    ]
  }
  
  return markets[state] || []
}

// Mock API functions (in real app, these would call actual APIs)

/**
 * Fetch market prices with optional filters
 * @param {Object} [filters] - Filter options
 * @param {string} [filters.crop] - Crop name filter
 * @param {string} [filters.market] - Market name filter
 * @param {string} [filters.state] - State filter
 * @returns {Promise<CropPrice[]>} Promise resolving to array of crop prices
 */
const fetchMarketPrices = async (filters) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // This would typically fetch from APMC API or other sources
  // For now, returning empty array - would be implemented with real API
  console.log('Fetching market prices with filters:', filters)
  return []
}

/**
 * Fetch price history for a crop
 * @param {number} cropId - Crop identifier
 * @param {number} [days=30] - Number of days of history
 * @returns {Promise<Array<{date: string, price: number}>>} Promise resolving to price history
 */
const fetchPriceHistory = async (cropId, days = 30) => {
  await new Promise(resolve => setTimeout(resolve, 300))
  
  // Generate mock historical data
  const history = []
  const basePrice = 2000 + Math.random() * 3000
  
  for (let i = days; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    
    const variation = (Math.random() - 0.5) * 200
    const price = Math.max(basePrice + variation, 100)
    
    history.push({
      date: date.toISOString().split('T')[0],
      price: Math.round(price)
    })
  }
  
  return history
}

/**
 * Create a new price alert
 * @param {Omit<PriceAlert, 'id' | 'created'>} alert - Alert data without id and created fields
 * @returns {Promise<PriceAlert>} Promise resolving to created alert
 */
const createPriceAlert = async (alert) => {
  await new Promise(resolve => setTimeout(resolve, 200))
  
  return {
    ...alert,
    id: Math.floor(Math.random() * 10000),
    created: new Date().toLocaleDateString('hi-IN')
  }
}

/**
 * Format currency amount in Indian Rupees
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('hi-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

/**
 * Format volume with appropriate unit
 * @param {number} volume - Volume to format
 * @returns {string} Formatted volume string
 */
const formatVolume = (volume) => {
  if (volume >= 1000) {
    return `${(volume / 1000).toFixed(1)}K क्विंटल`
  }
  return `${volume} क्विंटल`
}

/**
 * Get available quality grades
 * @returns {string[]} Array of quality grades
 */
const getQualityGrades = () => [
  'A1 Grade',
  'A Grade', 
  'B Grade',
  'C Grade',
  'Premium',
  'Super Fine',
  'Fine',
  'Medium',
  'FAQ (Fair Average Quality)',
  'Below FAQ'
]

/**
 * Get available unit types
 * @returns {string[]} Array of unit types
 */
const getUnitTypes = () => [
  'प्रति क्विंटल',
  'प्रति टन',
  'प्रति किलो',
  'प्रति बोरी',
  'प्रति दर्जन',
  'प्रति पीस'
]

// Export default configuration
const marketConfig = {
  refreshInterval: 30000, // 30 seconds
  priceAlertLimits: {
    min: 10,
    max: 100000
  },
  supportedStates: [
    'दिल्ली',
    'हरियाणा',
    'पंजाब',
    'उत्तर प्रदेश',
    'राजस्थान',
    'मध्य प्रदेश',
    'गुजरात',
    'महाराष्ट्र'
  ],
  defaultFilters: {
    sortBy: 'name',
    viewMode: 'grid',
    showOnlyActive: true
  }
}

// Export for CommonJS (Node.js)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    calculatePriceChange,
    getDemandSupplyStatus,
    getCropCategories,
    getCropsByCategory,
    getMarketsByState,
    fetchMarketPrices,
    fetchPriceHistory,
    createPriceAlert,
    formatCurrency,
    formatVolume,
    getQualityGrades,
    getUnitTypes,
    marketConfig
  };
}

// Export for ES6 modules (if needed)
// export {
//   calculatePriceChange,
//   getDemandSupplyStatus,
//   getCropCategories,
//   getCropsByCategory,
//   getMarketsByState,
//   fetchMarketPrices,
//   fetchPriceHistory,
//   createPriceAlert,
//   formatCurrency,
//   formatVolume,
//   getQualityGrades,
//   getUnitTypes,
//   marketConfig
// };