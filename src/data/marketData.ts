// Market data types and utilities for KisanAI Market Prices feature
export interface CropPrice {
  id: number
  crop: string
  price: number
  change: string
  changePercent: string
  market: string
  unit: string
  trending: 'up' | 'down'
  minPrice: number
  maxPrice: number
  avgPrice: number
  volume: string
  quality: string
  lastUpdated: string
  forecast: string
  demand: 'very_low' | 'low' | 'medium' | 'high' | 'very_high'
  supply: 'very_low' | 'low' | 'medium' | 'high' | 'very_high'
}

export interface Market {
  name: string
  distance: string
  crops: number
  status: 'खुला' | 'बंद'
  timing: string
  contact: string
}

export interface PriceAlert {
  id: number
  crop: string
  targetPrice: number
  currentPrice: number
  status: 'ऊपर' | 'नीचे'
  alertType: 'above' | 'below'
  created: string
}

export interface MarketInsight {
  title: string
  description: string
  impact: 'low' | 'medium' | 'high'
  timeframe: string
}

// Utility functions for market data processing
export const calculatePriceChange = (currentPrice: number, previousPrice: number): {
  change: string
  changePercent: string
  trending: 'up' | 'down'
} => {
  const diff = currentPrice - previousPrice
  const percentChange = (diff / previousPrice) * 100
  
  return {
    change: diff >= 0 ? `+${diff}` : `${diff}`,
    changePercent: diff >= 0 ? `+${percentChange.toFixed(1)}%` : `${percentChange.toFixed(1)}%`,
    trending: diff >= 0 ? 'up' : 'down'
  }
}

export const getDemandSupplyStatus = (demand: number, supply: number): {
  demandLevel: CropPrice['demand']
  supplyLevel: CropPrice['supply']
  forecast: string
} => {
  let demandLevel: CropPrice['demand']
  let supplyLevel: CropPrice['supply']
  
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

export const getCropCategories = (): string[] => [
  'अनाज',
  'दलहन',
  'तिलहन',
  'सब्जियां',
  'फल',
  'मसाले',
  'नकदी फसल',
  'चारा फसल'
]

export const getCropsByCategory = (category: string): string[] => {
  const categories: Record<string, string[]> = {
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

export const getMarketsByState = (state: string): Market[] => {
  // This would typically come from an API
  const markets: Record<string, Market[]> = {
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
export const fetchMarketPrices = async (filters?: {
  crop?: string
  market?: string
  state?: string
}): Promise<CropPrice[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // This would typically fetch from APMC API or other sources
  // For now, returning empty array - would be implemented with real API
  console.log('Fetching market prices with filters:', filters)
  return []
}

export const fetchPriceHistory = async (cropId: number, days: number = 30): Promise<{
  date: string
  price: number
}[]> => {
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

export const createPriceAlert = async (alert: Omit<PriceAlert, 'id' | 'created'>): Promise<PriceAlert> => {
  await new Promise(resolve => setTimeout(resolve, 200))
  
  return {
    ...alert,
    id: Math.floor(Math.random() * 10000),
    created: new Date().toLocaleDateString('hi-IN')
  }
}

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('hi-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

export const formatVolume = (volume: number): string => {
  if (volume >= 1000) {
    return `${(volume / 1000).toFixed(1)}K क्विंटल`
  }
  return `${volume} क्विंटल`
}

export const getQualityGrades = (): string[] => [
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

export const getUnitTypes = (): string[] => [
  'प्रति क्विंटल',
  'प्रति टन',
  'प्रति किलो',
  'प्रति बोरी',
  'प्रति दर्जन',
  'प्रति पीस'
]

// Export default configuration
export const marketConfig = {
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
    sortBy: 'name' as const,
    viewMode: 'grid' as const,
    showOnlyActive: true
  }
}
