"use client";

import { useState, useEffect, useCallback, useMemo } from 'react'
import { TrendingUp, TrendingDown, Search, RefreshCw, AlertCircle, Calendar, IndianRupee, Loader, Filter, ChevronDown, ChevronUp, Star, Target, BarChart3, Lightbulb, MapPin, Award, Clock } from 'lucide-react'

export default function EnhancedMarketPrices() {
  const [marketPrices, setMarketPrices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedState, setSelectedState] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [lastUpdated, setLastUpdated] = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  const [availableCommodities, setAvailableCommodities] = useState([])
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [expandedCategories, setExpandedCategories] = useState({})
  const [showRecommendations, setShowRecommendations] = useState(false)
  const [priceAnalysis, setPriceAnalysis] = useState(null)
  const [loadingStates, setLoadingStates] = useState({})
  const [lazyLoadedCategories, setLazyLoadedCategories] = useState(new Set())

  // Government API configuration
  const API_KEY = "579b464db66ec23bdd000001f35ef57f83f945b660e9b784d60a6ecb"
  const API_URL = "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070"

  // All Indian states for comprehensive coverage
  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry', 'Chandigarh',
    'Andaman and Nicobar Islands', 'Dadra and Nagar Haveli and Daman and Diu',
    'Lakshadweep'
  ]

  // Comprehensive categorization of crops with seasonal info
  const cropCategories = {
    vegetables: {
      name: 'सब्जियां',
      icon: '🥕',
      season: 'सभी मौसम',
      seasonEnglish: 'all',
      profitMargin: 'उच्च',
      crops: ['Onion', 'Potato', 'Tomato', 'Cabbage', 'Cauliflower', 'Carrot', 'Radish', 'Brinjal', 'Lady Finger', 'Green Chilli', 'Spinach', 'Bitter Gourd', 'Bottle Gourd', 'Ridge Gourd', 'Snake Gourd', 'Pumpkin', 'Cucumber', 'Green Peas', 'French Beans', 'Cluster Beans', 'Drumstick', 'Capsicum', 'Sweet Potato', 'Beetroot', 'Turnip', 'Green Beans', 'Plantain']
    },
    spices: {
      name: 'मसाले',
      icon: '🌶️',
      season: 'रबी/खरीफ',
      seasonEnglish: 'rabi/kharif',
      profitMargin: 'बहुत उच्च',
      crops: ['Turmeric', 'Chilli', 'Coriander', 'Garlic', 'Ginger', 'Fenugreek', 'Mint', 'Tamarind', 'Black Pepper', 'Cardamom', 'Clove', 'Nutmeg', 'Cinnamon', 'Cumin', 'Fennel', 'Ajwain', 'Asafoetida']
    },
    grains: {
      name: 'अनाज',
      icon: '🌾',
      season: 'रबी/खरीफ',
      seasonEnglish: 'rabi/kharif',
      profitMargin: 'मध्यम',
      crops: ['Wheat', 'Rice', 'Maize', 'Bajra', 'Jowar', 'Barley', 'Ragi', 'Foxtail Millet', 'Pearl Millet', 'Finger Millet']
    },
    pulses: {
      name: 'दालें',
      icon: '🫘',
      season: 'रबी/खरीफ',
      seasonEnglish: 'rabi/kharif',
      profitMargin: 'उच्च',
      crops: ['Black Gram', 'Green Gram', 'Red Gram', 'Bengal Gram', 'Field Pea', 'Lentil', 'Cowpea', 'Horse Gram', 'Kidney Beans', 'Soyabean']
    },
    oilseeds: {
      name: 'तिलहन',
      icon: '🌻',
      season: 'रबी/खरीफ',
      seasonEnglish: 'rabi/kharif',
      profitMargin: 'उच्च',
      crops: ['Groundnut', 'Mustard', 'Sesame', 'Sunflower', 'Safflower', 'Castor', 'Niger', 'Linseed', 'Coconut', 'Palm Oil']
    },
    fruits: {
      name: 'फल',
      icon: '🍎',
      season: 'बारहमासी',
      seasonEnglish: 'all',
      profitMargin: 'बहुत उच्च',
      crops: ['Banana', 'Apple', 'Orange', 'Mango', 'Grapes', 'Papaya', 'Lemon', 'Pomegranate', 'Guava', 'Pineapple', 'Watermelon', 'Muskmelon', 'Jackfruit', 'Custard Apple', 'Dates']
    },
    cashcrops: {
      name: 'नकदी फसलें',
      icon: '🌱',
      season: 'खरीफ/रबी',
      seasonEnglish: 'kharif/rabi',
      profitMargin: 'बहुत उच्च',
      crops: ['Cotton', 'Sugarcane', 'Tobacco', 'Jute', 'Tea', 'Coffee', 'Rubber', 'Indigo']
    },
   
  }

  // Enhanced commodity name mapping
  const commodityNameMap = {
    // Vegetables
    'Onion': 'प्याज', 'Potato': 'आलू', 'Tomato': 'टमाटर', 'Cabbage': 'पत्ता गोभी',
    'Cauliflower': 'फूल गोभी', 'Carrot': 'गाजर', 'Radish': 'मूली', 'Brinjal': 'बैंगन',
    'Lady Finger': 'भिंडी', 'Green Chilli': 'हरी मिर्च', 'Spinach': 'पालक',
    'Bitter Gourd': 'करेला', 'Bottle Gourd': 'लौकी', 'Ridge Gourd': 'तोरई',
    'Snake Gourd': 'चिचिंडा', 'Pumpkin': 'कद्दू', 'Cucumber': 'खीरा',
    'Green Peas': 'हरा मटर', 'French Beans': 'फ्रेंच बीन्स', 'Cluster Beans': 'ग्वार फली',
    'Drumstick': 'सहजन', 'Capsicum': 'शिमला मिर्च', 'Sweet Potato': 'शकरकंद',
    'Beetroot': 'चुकंदर', 'Turnip': 'शलजम', 'Green Beans': 'हरी फली', 'Plantain': 'कच्चा केला',

    // Spices
    'Turmeric': 'हल्दी', 'Chilli': 'मिर्च', 'Coriander': 'धनिया', 'Garlic': 'लहसुन',
    'Ginger': 'अदरक', 'Fenugreek': 'मेथी', 'Mint': 'पुदीना', 'Tamarind': 'इमली',
    'Black Pepper': 'काली मिर्च', 'Cardamom': 'इलायची', 'Clove': 'लौंग',
    'Nutmeg': 'जायफल', 'Cinnamon': 'दालचीनी', 'Cumin': 'जीरा', 'Fennel': 'सौंफ',

    // Grains
    'Wheat': 'गेहूं', 'Rice': 'चावल', 'Maize': 'मक्का', 'Bajra': 'बाजरा',
    'Jowar': 'ज्वार', 'Barley': 'जौ', 'Ragi': 'रागी',

    // Pulses
    'Black Gram': 'उड़द', 'Green Gram': 'मूंग', 'Red Gram': 'अरहर',
    'Bengal Gram': 'चना', 'Field Pea': 'मटर', 'Lentil': 'मसूर',
    'Soyabean': 'सोयाबीन', 'Cowpea': 'लोबिया',

    // Oilseeds
    'Groundnut': 'मूंगफली', 'Mustard': 'सरसों', 'Sesame': 'तिल',
    'Sunflower': 'सूरजमुखी', 'Safflower': 'कुसुम', 'Castor': 'अरंडी',
    'Niger': 'रामतिल', 'Coconut': 'नारियल',

    // Fruits
    'Banana': 'केला', 'Apple': 'सेब', 'Orange': 'संतरा', 'Mango': 'आम',
    'Grapes': 'अंगूर', 'Papaya': 'पपीता', 'Lemon': 'नींबू', 'Pomegranate': 'अनार',
    'Guava': 'अमरूद', 'Pineapple': 'अनानास', 'Watermelon': 'तरबूज',

    // Cash Crops
    'Cotton': 'कपास', 'Sugarcane': 'गन्ना', 'Tobacco': 'तंबाकू', 'Jute': 'जूट',

    // Others
    'Jaggery': 'गुड़', 'Honey': 'शहद', 'Milk': 'दूध'
  }

  // Function to categorize a commodity
  const categorizeCommodity = (commodity) => {
    for (const [categoryKey, categoryData] of Object.entries(cropCategories)) {
      if (categoryData.crops.includes(commodity)) {
        return categoryKey
      }
    }
    return 'others'
  }

  // Get current agricultural season based on month (proxy for weather/seasonal conditions)
  const getCurrentSeason = () => {
    const month = new Date().getMonth() + 1;
    if (month >= 6 && month <= 10) return 'Kharif'; // Monsoon season, suitable for rice, maize, etc.
    if (month >= 11 || month <= 3) return 'Rabi'; // Winter season, suitable for wheat, barley, etc.
    return 'Zaid'; // Summer season, suitable for vegetables, fruits, etc.
  };

  // Lazy load category data when expanded
  const loadCategoryData = useCallback(async (category) => {
    if (lazyLoadedCategories.has(category)) return
    
    setLoadingStates(prev => ({ ...prev, [category]: true }))
    
    try {
      const categoryData = cropCategories[category]
      if (!categoryData) return

      const batchSize = 3
      const crops = categoryData.crops
      
      for (let i = 0; i < crops.length; i += batchSize) {
        const batch = crops.slice(i, i + batchSize)
        
        const batchResponses = await Promise.allSettled(
          batch.map(async (commodity) => {
            try {
              const url = `${API_URL}?api-key=${API_KEY}&format=json&limit=20&filters[commodity]=${encodeURIComponent(commodity)}`
              const response = await fetch(url)
              
              if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
              
              const data = await response.json()
              return { commodity, records: data.records || [] }
            } catch (error) {
              console.warn(`Failed to fetch ${commodity}:`, error)
              return { commodity, records: [] }
            }
          })
        )

        batchResponses.forEach((result) => {
          if (result.status === 'fulfilled') {
            const { commodity, records } = result.value
            
            if (records.length > 0) {
              const processedRecords = records
                .filter(record => record.modal_price && parseFloat(record.modal_price) > 0)
                .map(record => {
                  const price = parseFloat(record.modal_price) || 0
                  const minPrice = parseFloat(record.min_price) || price
                  const maxPrice = parseFloat(record.max_price) || price
                  
                  const change = price - minPrice
                  const changePercent = minPrice > 0 ? ((change / minPrice) * 100) : 0

                  return {
                    crop: commodityNameMap[commodity] || commodity,
                    englishName: commodity,
                    category: category,
                    price: Math.round(price),
                    minPrice: Math.round(minPrice),
                    maxPrice: Math.round(maxPrice),
                    change: change > 0 ? `+${Math.round(change)}` : `${Math.round(change)}`,
                    changePercent: changePercent > 0 ? `+${changePercent.toFixed(1)}%` : `${changePercent.toFixed(1)}%`,
                    market: `${record.market}, ${record.district}`,
                    state: record.state,
                    district: record.district,
                    unit: 'प्रति क्विंटल',
                    trending: changePercent >= 0 ? 'up' : 'down',
                    variety: record.variety || 'सामान्य',
                    grade: record.grade || 'मध्यम',
                    arrivalDate: record.arrival_date,
                    quantity: record.arrivals_in_qtl || 0
                  }
                })

              setMarketPrices(prev => [...prev, ...processedRecords])
            }
          }
        })
        
        // Small delay to prevent API throttling
        if (i + batchSize < crops.length) {
          await new Promise(resolve => setTimeout(resolve, 100))
        }
      }

      setLazyLoadedCategories(prev => new Set([...prev, category]))
    } catch (error) {
      console.error(`Error loading category ${category}:`, error)
    } finally {
      setLoadingStates(prev => ({ ...prev, [category]: false }))
    }
  }, [API_KEY, API_URL, lazyLoadedCategories])

  // Analyze price trends and generate recommendations
  const analyzeMarketTrends = useCallback(() => {
    if (marketPrices.length === 0) return null

    // Group by commodity and calculate averages
    const commodityStats = {}
    marketPrices.forEach(item => {
      const key = item.englishName
      if (!commodityStats[key]) {
        commodityStats[key] = {
          name: item.crop,
          englishName: item.englishName,
          category: item.category,
          prices: [],
          states: new Set(),
          totalQuantity: 0
        }
      }
      commodityStats[key].prices.push(item.price)
      commodityStats[key].states.add(item.state)
      commodityStats[key].totalQuantity += item.quantity
    })

    // Calculate insights
    const insights = Object.values(commodityStats).map(stat => {
      const avgPrice = stat.prices.reduce((a, b) => a + b, 0) / stat.prices.length
      const maxPrice = Math.max(...stat.prices)
      const minPrice = Math.min(...stat.prices)
      const priceVariance = maxPrice - minPrice
      const volatility = avgPrice > 0 ? ((priceVariance / avgPrice) * 100) : 0
      const demandScore = stat.totalQuantity * stat.states.size
      
      return {
        ...stat,
        avgPrice: Math.round(avgPrice),
        maxPrice,
        minPrice,
        priceVariance,
        volatility: volatility.toFixed(1),
        demandScore,
        profitPotential: (avgPrice / 1000) * (stat.totalQuantity / 100) * stat.states.size
      }
    }).sort((a, b) => b.profitPotential - a.profitPotential)

    return {
      highPriceItems: insights.slice(0, 10),
      highDemandItems: insights.sort((a, b) => b.demandScore - a.demandScore).slice(0, 10),
      priceVolatileItems: insights.sort((a, b) => b.priceVariance - a.priceVariance).slice(0, 10),
      recommendations: generateFarmingRecommendations(insights)
    }
  }, [marketPrices])

  // Generate farming recommendations based on analysis
  const generateFarmingRecommendations = (insights) => {
    const recommendations = []
    const currentSeason = getCurrentSeason()

    // High profit potential crops
    const highProfitCrops = insights.slice(0, 5)
    recommendations.push({
      type: 'profit',
      title: 'उच्च मुनाफा संभावना',
      description: 'ये फसलें वर्तमान में अच्छे दाम दे रही हैं',
      crops: highProfitCrops,
      icon: '💰',
      priority: 'high'
    })

    // Seasonal recommendations based on current season (proxy for weather)
    const seasonalCrops = insights.filter(item => {
      const catSeason = cropCategories[item.category]?.seasonEnglish || ''
      return catSeason.includes('all') || catSeason.toLowerCase().includes(currentSeason.toLowerCase())
    }).sort((a, b) => b.profitPotential - a.profitPotential).slice(0, 5)

    recommendations.push({
      type: 'seasonal',
      title: `${currentSeason} सीजन सिफारिश`,
      description: `वर्तमान मौसम (${currentSeason}) के लिए उपयुक्त फसलें, मौसम की स्थिति के आधार पर`,
      crops: seasonalCrops,
      icon: '🌱',
      priority: 'medium'
    })

    // High demand crops
    const highDemandCrops = insights
      .sort((a, b) => b.demandScore - a.demandScore)
      .slice(0, 5)

    recommendations.push({
      type: 'demand',
      title: 'उच्च मांग वाली फसलें',
      description: 'बाजार में इन फसलों की अच्छी मांग है',
      crops: highDemandCrops,
      icon: '📈',
      priority: 'high'
    })

    // Nationwide costly crops
    const nationwideHigh = insights
      .filter(item => item.states.size >= 5)
      .sort((a, b) => b.avgPrice - a.avgPrice)
      .slice(0, 5)

    recommendations.push({
      type: 'nationwide',
      title: 'देशव्यापी उच्च मूल्य फसलें',
      description: 'ये फसलें पूरे देश में महंगे दाम पर बिक रही हैं',
      crops: nationwideHigh,
      icon: '🗺️',
      priority: 'high'
    })

    // Low risk crops (low volatility)
    const lowRiskCrops = insights
      .filter(item => item.volatility < 30)
      .sort((a, b) => b.profitPotential - a.profitPotential)
      .slice(0, 5)

    recommendations.push({
      type: 'lowrisk',
      title: 'स्थिर मूल्य फसलें',
      description: 'कम मूल्य उतार-चढ़ाव के साथ अच्छा रिटर्न, कम जोखिम',
      crops: lowRiskCrops,
      icon: '⚖️',
      priority: 'medium'
    })

    return recommendations
  }

  // Update price analysis when market prices change
  useEffect(() => {
    const analysis = analyzeMarketTrends()
    setPriceAnalysis(analysis)
  }, [analyzeMarketTrends])

  // Fetch available commodities from API
  const fetchAvailableCommodities = useCallback(async () => {
    try {
      const url = `${API_URL}?api-key=${API_KEY}&format=json&limit=1000`
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      const uniqueCommodities = [...new Set(
        (data.records || [])
          .map(record => record.commodity)
          .filter(commodity => commodity && commodity.trim() !== '')
      )].sort()

      setAvailableCommodities(uniqueCommodities)
      return uniqueCommodities
    } catch (error) {
      console.error('Error fetching commodities:', error)
      const fallbackCommodities = Object.keys(commodityNameMap)
      setAvailableCommodities(fallbackCommodities)
      return fallbackCommodities
    }
  }, [API_KEY, API_URL])

  // Initial data load - load all available commodities for analysis
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true)
      try {
        // First get all available commodities
        const commodities = await fetchAvailableCommodities()
        
        if (commodities.length > 0) {
          // Load a sample from each category for initial analysis
          const sampleSize = 3 // Take 3 items from each category for analysis
          const initialPrices = []

          for (const [categoryKey, categoryData] of Object.entries(cropCategories)) {
            const categoryCrops = categoryData.crops.filter(crop => commodities.includes(crop))
            const sampleCrops = categoryCrops.slice(0, sampleSize)
            
            for (const commodity of sampleCrops) {
              try {
                const url = `${API_URL}?api-key=${API_KEY}&format=json&limit=50&filters[commodity]=${encodeURIComponent(commodity)}`
                const response = await fetch(url)
                
                if (response.ok) {
                  const data = await response.json()
                  const records = data.records || []
                  
                  // Get unique markets for this commodity
                  const marketGroups = {}
                  records.forEach(record => {
                    if (record.modal_price && parseFloat(record.modal_price) > 0) {
                      const marketKey = `${record.state}-${record.district}-${record.market}`
                      if (!marketGroups[marketKey] || 
                          new Date(record.arrival_date) > new Date(marketGroups[marketKey].arrival_date)) {
                        marketGroups[marketKey] = record
                      }
                    }
                  })

                  Object.values(marketGroups).forEach(record => {
                    const price = parseFloat(record.modal_price) || 0
                    const minPrice = parseFloat(record.min_price) || price
                    const maxPrice = parseFloat(record.max_price) || price
                    
                    if (price > 0) {
                      const change = price - minPrice
                      const changePercent = minPrice > 0 ? ((change / minPrice) * 100) : 0

                      initialPrices.push({
                        crop: commodityNameMap[commodity] || commodity,
                        englishName: commodity,
                        category: categoryKey,
                        price: Math.round(price),
                        minPrice: Math.round(minPrice),
                        maxPrice: Math.round(maxPrice),
                        change: change > 0 ? `+${Math.round(change)}` : `${Math.round(change)}`,
                        changePercent: changePercent > 0 ? `+${changePercent.toFixed(1)}%` : `${changePercent.toFixed(1)}%`,
                        market: `${record.market}, ${record.district}`,
                        state: record.state,
                        district: record.district,
                        unit: 'प्रति क्विंटल',
                        trending: changePercent >= 0 ? 'up' : 'down',
                        variety: record.variety || 'सामान्य',
                        grade: record.grade || 'मध्यम',
                        arrivalDate: record.arrival_date,
                        quantity: record.arrivals_in_qtl || 0
                      })
                    }
                  })
                }
              } catch (error) {
                console.warn(`Failed to load ${commodity}:`, error)
              }
            }
          }

          setMarketPrices(initialPrices)
        }
        
        setLastUpdated(new Date())

      } catch (error) {
        console.error('Error loading initial data:', error)
        setError('प्रारंभिक डेटा लोड करने में समस्या हुई।')
      } finally {
        setLoading(false)
      }
    }

    loadInitialData()
  }, [fetchAvailableCommodities])

  // Filter and categorize prices
  const filteredPrices = useMemo(() => {
    return marketPrices.filter(item => {
      const matchesSearch = !searchTerm || 
        item.crop.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.market.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.variety.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesState = !selectedState || item.state === selectedState
      const matchesCategory = !selectedCategory || item.category === selectedCategory
      
      return matchesSearch && matchesState && matchesCategory
    })
  }, [marketPrices, searchTerm, selectedState, selectedCategory])

  // Group filtered prices by category
  const pricesByCategory = useMemo(() => {
    const groups = {}
    filteredPrices.forEach(item => {
      if (!groups[item.category]) {
        groups[item.category] = []
      }
      groups[item.category].push(item)
    })
    return groups
  }, [filteredPrices])

  const availableStates = useMemo(() => {
    return [...new Set(marketPrices.map(item => item.state))]
      .filter(Boolean)
      .sort()
  }, [marketPrices])

  const handleRefresh = () => {
    setMarketPrices([])
    setLazyLoadedCategories(new Set())
    setExpandedCategories({})
    window.location.reload()
  }

  const toggleCategory = async (category) => {
    const isExpanding = !expandedCategories[category]
    
    setExpandedCategories(prev => ({
      ...prev,
      [category]: isExpanding
    }))

    if (isExpanding && !lazyLoadedCategories.has(category)) {
      await loadCategoryData(category)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            🚀 स्मार्ट कृषि बाज़ार विश्लेषण
          </h1>
          <p className="text-xl text-slate-700 font-medium">
            मंडी भाव विश्लेषण एवं खेती की सिफारिशें
          </p>
          {lastUpdated && (
            <p className="text-sm text-slate-600 mt-2 flex items-center justify-center gap-2">
              <Calendar className="h-4 w-4" />
              अंतिम अपडेट: {lastUpdated.toLocaleString('hi-IN')}
            </p>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Quick Analysis Toggle */}
        <div className="mb-6 flex justify-center">
          <button
            onClick={() => setShowRecommendations(!showRecommendations)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
          >
            <BarChart3 className="h-5 w-5" />
            {showRecommendations ? 'भाव सूची देखें' : 'बाज़ार विश्लेषण और सिफारिशें देखें'}
          </button>
        </div>

        {/* Market Analysis & Recommendations */}
        {showRecommendations && priceAnalysis && (
          <div className="space-y-6 mb-8">
            {/* Price Analysis Summary */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-blue-600" />
                बाज़ार विश्लेषण
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h3 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    सबसे महंगी फसलें
                  </h3>
                  <div className="space-y-2">
                    {priceAnalysis.highPriceItems.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span>{item.name} ({item.states.size} राज्य)</span>
                        <span className="font-bold">₹{item.avgPrice.toLocaleString('hi-IN')}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    उच्च मांग
                  </h3>
                  <div className="space-y-2">
                    {priceAnalysis.highDemandItems.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span>{item.name}</span>
                        <span className="font-bold">{item.states.size} राज्य</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h3 className="font-semibold text-orange-800 mb-2 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    मूल्य में उतार-चढ़ाव
                  </h3>
                  <div className="space-y-2">
                    {priceAnalysis.priceVolatileItems.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span>{item.name}</span>
                        <span className="font-bold">₹{item.priceVariance} ({item.volatility}%)</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Farming Recommendations */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Lightbulb className="h-6 w-6 text-yellow-600" />
                खेती की सिफारिशें
              </h2>
              
              {priceAnalysis.recommendations.map((rec, idx) => (
                <div key={idx} className={`bg-white border-l-4 ${
                  rec.priority === 'high' ? 'border-green-500' : 'border-blue-500'
                } rounded-lg p-6 shadow-sm`}>
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">{rec.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-900 mb-2">{rec.title}</h3>
                      <p className="text-slate-600 mb-4">{rec.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {rec.crops.slice(0, 6).map((crop, cropIdx) => (
                          <div key={cropIdx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <div className="font-semibold text-slate-900">{crop.name}</div>
                              <div className="text-sm text-slate-600">{crop.states.size} राज्यों में उपलब्ध</div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-green-600">₹{crop.avgPrice.toLocaleString('hi-IN')}</div>
                              <div className="text-xs text-slate-500">औसत भाव</div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {rec.type === 'profit' && (
                        <div className="mt-4 p-3 bg-green-50 rounded-lg">
                          <p className="text-sm text-green-800 font-medium">
                            💡 सुझाव: इन फसलों में निवेश करने से अच्छा मुनाफा हो सकता है। बाजार की मांग और कीमतों के आधार पर यह विकल्प बेहतर है।
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search and Filter - Only show when not in recommendations view */}
        {!showRecommendations && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
            <div className="p-6">
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="फसल, किस्म, या मंडी का नाम खोजें..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-slate-900 placeholder-gray-500"
                  />
                </div>
                
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-slate-900"
                >
                  <option value="">सभी श्रेणियां</option>
                  {Object.entries(cropCategories).map(([key, category]) => (
                    <option key={key} value={key}>{category.icon} {category.name}</option>
                  ))}
                </select>

                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-slate-900"
                >
                  <option value="">सभी राज्य</option>
                  {indianStates.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>

                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
                >
                  <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                  रिफ्रेश
                </button>
              </div>

              <div className="text-sm text-slate-600">
                <MapPin className="inline h-4 w-4 mr-1" />
                सभी {indianStates.length} राज्यों और केंद्र शासित प्रदेशों के लिए डेटा उपलब्ध
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4">
              <Loader className="h-12 w-12" />
            </div>
            <p className="text-slate-600 mb-2">प्रारंभिक डेटा लोड हो रहा है...</p>
            <p className="text-sm text-slate-500">अन्य श्रेणियां मांग पर लोड होंगी</p>
          </div>
        )}

        {/* Categorized Prices Display - Only show when not in recommendations view */}
        {!loading && !showRecommendations && (
          <div className="space-y-6">
            {Object.entries(cropCategories).map(([categoryKey, categoryData]) => {
              const categoryPrices = pricesByCategory[categoryKey] || []
              const isExpanded = expandedCategories[categoryKey]
              const isLoading = loadingStates[categoryKey]

              return (
                <div key={categoryKey} className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div 
                    className="p-6 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => toggleCategory(categoryKey)}
                  >
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                        <span className="text-3xl">{categoryData.icon}</span>
                        <div>
                          <div>{categoryData.name}</div>
                          <div className="text-sm font-normal text-slate-600 flex items-center gap-4">
                            <span>({categoryPrices.length} आइटम)</span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {categoryData.season}
                            </span>
                            <span className="flex items-center gap-1">
                              <Award className="h-3 w-3" />
                              {categoryData.profitMargin} लाभ
                            </span>
                          </div>
                        </div>
                      </h2>
                      <div className="flex items-center gap-2">
                        {isLoading && <Loader className="h-4 w-4 animate-spin text-blue-600" />}
                        {isExpanded ? (
                          <ChevronUp className="h-6 w-6 text-slate-600" />
                        ) : (
                          <ChevronDown className="h-6 w-6 text-slate-600" />
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {isExpanded && (
                    <div className="p-6">
                      {isLoading && categoryPrices.length === 0 ? (
                        <div className="text-center py-8">
                          <Loader className="h-8 w-8 animate-spin mx-auto mb-2 text-blue-600" />
                          <p className="text-slate-600">डेटा लोड हो रहा है...</p>
                        </div>
                      ) : categoryPrices.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                          {categoryPrices.map((item, index) => (
                            <div
                              key={`${categoryKey}-${index}`}
                              className="p-4 border rounded-lg bg-white hover:shadow-md transition-all hover:border-green-300 relative"
                            >
                              {/* High price indicator */}
                              {item.price > 5000 && (
                                <div className="absolute top-2 right-2">
                                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                </div>
                              )}
                              
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <h3 className="font-semibold text-lg text-slate-900">{item.crop}</h3>
                                  <p className="text-xs text-slate-500 font-medium">({item.englishName})</p>
                                  <p className="text-xs text-slate-600 font-medium line-clamp-2">{item.market}</p>
                                  {item.variety && item.variety !== 'सामान्य' && (
                                    <p className="text-xs text-blue-600 font-medium">{item.variety}</p>
                                  )}
                                </div>
                                <div className={`flex items-center space-x-1 ${
                                  item.trending === 'up' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {item.trending === 'up' ? (
                                    <TrendingUp className="h-4 w-4" />
                                  ) : (
                                    <TrendingDown className="h-4 w-4" />
                                  )}
                                  <span className="text-sm font-medium">{item.changePercent}</span>
                                </div>
                              </div>
                              
                              <div className="flex justify-between items-end">
                                <div>
                                  <p className="text-2xl font-bold text-slate-900">₹{item.price.toLocaleString('hi-IN')}</p>
                                  <p className="text-sm text-slate-600 font-medium">{item.unit}</p>
                                  {item.minPrice !== item.maxPrice && (
                                    <p className="text-xs text-slate-500">
                                      रेंज: ₹{item.minPrice} - ₹{item.maxPrice}
                                    </p>
                                  )}
                                </div>
                                <div className={`text-sm font-medium ${
                                  item.trending === 'up' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {item.change}
                                </div>
                              </div>
                              
                              {item.quantity > 0 && (
                                <div className="mt-2 pt-2 border-t border-gray-100">
                                  <p className="text-xs text-slate-500">
                                    आगमन: {item.quantity} क्विंटल
                                  </p>
                                </div>
                              )}

                              {/* Profit indicator */}
                              {item.price > 3000 && (
                                <div className="mt-2 pt-2 border-t border-gray-100">
                                  <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                                    <TrendingUp className="h-3 w-3" />
                                    अच्छा मुनाफा संभव
                                  </p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-slate-500">इस श्रेणी में कोई डेटा उपलब्ध नहीं है</p>
                          <button
                            onClick={() => loadCategoryData(categoryKey)}
                            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                          >
                            डेटा लोड करें
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Summary Statistics */}
        {!loading && !showRecommendations && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-8 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">डेटा सारांश</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(cropCategories).map(([key, category]) => {
                const count = pricesByCategory[key]?.length || 0
                return (
                  <div key={key} className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl mb-1">{category.icon}</div>
                    <div className="font-semibold text-slate-900">{count}</div>
                    <div className="text-sm text-slate-600">{category.name}</div>
                    <div className="text-xs text-slate-500">{category.profitMargin}</div>
                  </div>
                )
              })}
            </div>
            <div className="mt-4 text-center">
              <p className="text-slate-600">
                कुल: <span className="font-semibold">{filteredPrices.length}</span> मार्केट एंट्रीज | 
                राज्य: <span className="font-semibold">{availableStates.length}</span>
              </p>
            </div>
          </div>
        )}

        {/* Enhanced Data Source Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
          <h3 className="font-semibold text-blue-900 mb-2">🚀 नई सुविधाएं और डेटा स्रोत</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-blue-800 mb-2">✨ नई सुविधाएं:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• स्मार्ट मार्केट एनालिटिक्स और ट्रेंड विश्लेषण</li>
                <li>• AI-आधारित खेती की सिफारिशें</li>
                <li>• तेज़ लोडिंग के लिए लेज़ी लोडिंग</li>
                <li>• सभी {indianStates.length} राज्यों का समर्थन</li>
                <li>• उच्च मुनाफा वाली फसलों की पहचान</li>
                <li>• मौसमी और मांग आधारित सुझाव</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-blue-800 mb-2">📊 डेटा स्रोत:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• भारत सरकार का ओपन डेटा प्लेटफॉर्म</li>
                <li>• APMC मंडी समिति के आधिकारिक रिकॉर्ड</li>
                <li>• रियल-टाइम मार्केट डेटा</li>
                <li>• श्रेणीवार स्मार्ट विश्लेषण</li>
                <li>• मूल्य प्रति क्विंटल (100 किलो) में</li>
                <li>• दैनिक अपडेट होने वाले भाव</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-slate-600 font-medium">
            🎯 भाव की जानकारी सरकारी APMC डेटा और AI विश्लेषण पर आधारित है। 
            बिक्री से पहले स्थानीय मंडी से वर्तमान भाव की पुष्टि अवश्य करें।
          </p>
          <p className="text-xs text-slate-500 mt-2">
            📈 स्मार्ट एनालिटिक्स | 🌱 फार्मिंग रेकमेंडेशन | 
            ⚡ फास्ट लोडिंग | 🇮🇳 पूर्ण भारत कवरेज
          </p>
        </div>
      </div>
    </div>
  )
}