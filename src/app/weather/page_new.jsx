'use client'

import { useState, useEffect, useCallback } from 'react'
import { Cloud, Sun, CloudRain, Wind, Droplets, Eye, MapPin, RefreshCw, AlertTriangle, Thermometer, Gauge, Sunrise, Sunset, Search } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { generateAIResponse } from '@/data/farmingKnowledge'

export default function Weather() {
  const [currentWeather, setCurrentWeather] = useState(null)
  const [forecast, setForecast] = useState([])
  const [farmingAdvice, setFarmingAdvice] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [location, setLocation] = useState(null) // Start with null
  const [lastRefresh, setLastRefresh] = useState(new Date())
  const [error, setError] = useState(null)
  const [searchInput, setSearchInput] = useState('')

  const API_KEY = '6ed570ac911dad2a255e2965a53ced74'

  // Fetch city from lat/lon using reverse geocoding
  const fetchCityFromCoords = useCallback(async (lat, lon) => {
    try {
      const url = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&appid=${API_KEY}&limit=1`
      const response = await fetch(url)
      if (!response.ok) throw new Error('Reverse geocoding failed')
      const data = await response.json()
      const city = data[0]?.name
      const country = data[0]?.country
      return city ? `${city}, ${country}` : 'Unknown Location'
    } catch (err) {
      console.error('Reverse geocoding error:', err)
      return 'Unknown Location'
    }
  }, [API_KEY])

  // Fetch current weather
  const fetchCurrentWeather = useCallback(async (city) => {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=hi`
      const response = await fetch(url)
      if (!response.ok) throw new Error(`Current weather fetch failed: ${response.status}`)
      const data = await response.json()
      return {
        location: `${data.name}, ${data.sys.country}`,
        temperature: Math.round(data.main.temp),
        condition: data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1),
        description: data.weather[0].description,
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed),
        windDirection: getWindDirection(data.wind.deg),
        visibility: (data.visibility / 1000).toFixed(1),
        uvIndex: 'N/A', // UV requires separate API call if needed
        pressure: data.main.pressure,
        feelsLike: Math.round(data.main.feels_like),
        sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' }),
        sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' }),
        lastUpdated: new Date().toLocaleTimeString('hi-IN')
      }
    } catch (err) {
      console.error('Current weather error:', err)
      throw err
    }
  }, [API_KEY])

  // Fetch 5-day forecast and aggregate to daily
  const fetchForecast = useCallback(async (city) => {
    try {
      const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=hi`
      const response = await fetch(url)
      if (!response.ok) throw new Error(`Forecast fetch failed: ${response.status}`)
      const data = await response.json()
      
      // Aggregate to daily (5 days)
      const dailyForecast = {}
      data.list.forEach(item => {
        const date = new Date(item.dt * 1000).toLocaleDateString('hi-IN', { weekday: 'short' })
        const fullDate = new Date(item.dt * 1000).toLocaleDateString('hi-IN')
        if (!dailyForecast[date]) {
          dailyForecast[date] = {
            day: date,
            date: fullDate,
            high: item.main.temp,
            low: item.main.temp,
            condition: item.weather[0].description.charAt(0).toUpperCase() + item.weather[0].description.slice(1),
            humidity: item.main.humidity,
            windSpeed: Math.round(item.wind.speed),
            rainChance: item.pop ? Math.round(item.pop * 100) : 0,
            icon: getForecastIcon(item.weather[0].main)
          }
        } else {
          // Update high/low
          dailyForecast[date].high = Math.max(dailyForecast[date].high, item.main.temp)
          dailyForecast[date].low = Math.min(dailyForecast[date].low, item.main.temp)
        }
      })

      return Object.values(dailyForecast).slice(0, 5) // First 5 days
    } catch (err) {
      console.error('Forecast error:', err)
      throw err
    }
  }, [API_KEY])

  // Helper to get wind direction
  const getWindDirection = (deg) => {
    if (deg < 22.5) return 'उत्तर'
    if (deg < 67.5) return 'उत्तर-पूर्व'
    if (deg < 112.5) return 'पूर्व'
    if (deg < 157.5) return 'दक्षिण-पूर्व'
    if (deg < 202.5) return 'दक्षिण'
    if (deg < 247.5) return 'दक्षिण-पश्चिम'
    if (deg < 292.5) return 'पश्चिम'
    if (deg < 337.5) return 'उत्तर-पश्चिम'
    return 'उत्तर'
  }

  // Helper to get forecast icon component
  const getForecastIcon = (main) => {
    switch (main) {
      case 'Clear': return Sun
      case 'Clouds': return Cloud
      case 'Rain': return CloudRain
      default: return Sun
    }
  }

  // Generate farming advice using Gemini (strict - no fallback)
  const generateFarmingAdvice = useCallback(async (weather, forecast) => {
    const weatherSummary = `वर्तमान मौसम ${weather.location} में: तापमान ${weather.temperature}°C, नमी ${weather.humidity}%, हवा ${weather.windSpeed} km/h, दबाव ${weather.pressure} hPa। पूर्वानुमान: अगले 5 दिनों में औसत तापमान ${forecast.reduce((sum, d) => sum + (d.high + d.low)/2, 0)/forecast.length}°C, बारिश की संभावना ${forecast.filter(d => d.rainChance > 50).length} दिनों में। किसानों के लिए 3-5 संक्षिप्त व्यावहारिक सलाह हिंदी में दें, पैराग्राफ फॉर्मेट में, कोई बुलेट्स न लगाएं।`

    try {
      const adviceText = await generateAIResponse(weatherSummary)
      return [{
        title: 'AI आधारित कृषि सलाह',
        description: adviceText,
        urgent: false,
        icon: '🤖',
        action: 'सलाह का पालन करें'
      }]
    } catch (err) {
      console.error('Gemini advice error:', err)
      throw new Error('Gemini advice generation failed')
    }
  }, [])

  const loadWeatherData = useCallback(async (useGeolocation = false, searchCity = null) => {
    setIsLoading(true)
    setError(null)
    try {
      let city = location || searchCity || 'Delhi, India' // Fallback only if no geolocation/search
      if (useGeolocation) {
        if (navigator.geolocation) {
          const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject)
          })
          const lat = position.coords.latitude
          const lon = position.coords.longitude
          city = await fetchCityFromCoords(lat, lon)
          setLocation(city)
        } else {
          throw new Error('Geolocation not supported')
        }
      } else if (searchCity) {
        city = searchCity
        setLocation(city)
      }

      const current = await fetchCurrentWeather(city)
      const forecastData = await fetchForecast(city)
      setCurrentWeather(current)
      setForecast(forecastData)
      const advice = await generateFarmingAdvice(current, forecastData)
      setFarmingAdvice(advice)
      setLastRefresh(new Date())
    } catch (err) {
      console.error('Weather load error:', err)
      if (err.message.includes('Gemini')) {
        setError('सलाह उत्पन्न करने में समस्या। कृपया पुनः प्रयास करें।')
        setFarmingAdvice([]) // No fallback
      } else {
        setError(err.message)
      }
    } finally {
      setIsLoading(false)
    }
  }, [location, fetchCityFromCoords, fetchCurrentWeather, fetchForecast, generateFarmingAdvice])

  useEffect(() => {
    // Auto-load with geolocation on mount
    loadWeatherData(true)
  }, [loadWeatherData])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchInput.trim()) {
      loadWeatherData(false, `${searchInput.trim()}, India`)
      setSearchInput('')
    }
  }

  const getLocationFromBrowser = () => {
    loadWeatherData(true)
  }

  const getWeatherIcon = (condition) => {
    if (condition.includes('साफ') || condition.includes('धूप')) return <Sun className="h-16 w-16 text-yellow-500 mx-auto mb-2" />
    if (condition.includes('बादल')) return <Cloud className="h-16 w-16 text-gray-500 mx-auto mb-2" />
    if (condition.includes('बारिश')) return <CloudRain className="h-16 w-16 text-blue-500 mx-auto mb-2" />
    return <Sun className="h-16 w-16 text-yellow-500 mx-auto mb-2" />
  }

  if (isLoading && !currentWeather) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 py-8">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-xl text-slate-700 font-medium">मौसम की जानकारी लोड हो रही है...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error && !currentWeather) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 py-8">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <div className="text-center">
            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <p className="text-xl text-red-600 font-medium">त्रुटि: {error}</p>
            <Button onClick={() => loadWeatherData(true)} className="mt-4">वर्तमान स्थान से लोड करें</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 py-8">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            मौसम की जानकारी
          </h1>
          <p className="text-xl text-slate-700 font-medium">
            आपके क्षेत्र का विस्तृत मौसम पूर्वानुमान और कृषि सलाह
          </p>
          <p className="text-sm text-slate-500 mt-2">
            अंतिम अपडेट: {lastRefresh.toLocaleTimeString('hi-IN')}
          </p>
        </div>

        {/* Current Weather */}
        {currentWeather && (
          <Card className="mb-8">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-2xl text-slate-900 font-bold">
                वर्तमान मौसम - {currentWeather.location}
              </CardTitle>
              <div className="flex space-x-2">
                {/* Search Bar */}
                <form onSubmit={handleSearch} className="flex space-x-2">
                  <Input
                    type="text"
                    placeholder="शहर खोजें..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="w-48"
                  />
                  <Button type="submit" variant="outline" size="sm">
                    <Search className="h-4 w-4 mr-1" />
                    खोजें
                  </Button>
                </form>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={getLocationFromBrowser}
                  disabled={isLoading}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  वर्तमान स्थान
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => loadWeatherData(false)}
                  disabled={isLoading}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  रिफ्रेश
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Main Weather */}
                <div className="text-center">
                  {getWeatherIcon(currentWeather.condition)}
                  <p className="text-3xl font-bold text-slate-900">{currentWeather.temperature}°C</p>
                  <p className="text-slate-600 font-medium">{currentWeather.condition}</p>
                  <p className="text-sm text-slate-500 mt-1">महसूस: {currentWeather.feelsLike}°C</p>
                </div>
                
                {/* Weather Details 1 */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-slate-700 font-medium">
                    <Droplets className="h-5 w-5 text-blue-500" />
                    <span>नमी: {currentWeather.humidity}%</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-700 font-medium">
                    <Wind className="h-5 w-5 text-gray-500" />
                    <span>हवा: {currentWeather.windSpeed} km/h {currentWeather.windDirection}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-700 font-medium">
                    <Gauge className="h-5 w-5 text-gray-500" />
                    <span>दबाव: {currentWeather.pressure} hPa</span>
                  </div>
                </div>
                
                {/* Weather Details 2 */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-slate-700 font-medium">
                    <Eye className="h-5 w-5 text-gray-500" />
                    <span>दृश्यता: {currentWeather.visibility} km</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-700 font-medium">
                    <Sun className="h-5 w-5 text-yellow-500" />
                    <span>UV Index: {currentWeather.uvIndex}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-700 font-medium">
                    <Thermometer className="h-5 w-5 text-red-500" />
                    <span>महसूस: {currentWeather.feelsLike}°C</span>
                  </div>
                </div>

                {/* Sun Times */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-slate-700 font-medium">
                    <Sunrise className="h-5 w-5 text-orange-500" />
                    <span>सूर्योदय: {currentWeather.sunrise}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-700 font-medium">
                    <Sunset className="h-5 w-5 text-orange-600" />
                    <span>सूर्यास्त: {currentWeather.sunset}</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-2">
                    अंतिम अपडेट: {currentWeather.lastUpdated}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 5-Day Forecast */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl text-slate-900 font-bold">5 दिन का मौसम पूर्वानुमान</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
              {forecast.map((day, index) => {
                const IconComponent = getForecastIcon(day.condition)
                return (
                  <div key={index} className="text-center p-4 rounded-lg bg-white border hover:shadow-md transition-shadow">
                    <p className="font-semibold text-slate-900 mb-1">{day.day}</p>
                    <p className="text-xs text-slate-500 mb-2">{day.date}</p>
                    <IconComponent className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                    <p className="text-sm text-slate-600 font-medium mb-1">{day.condition}</p>
                    <p className="text-sm mb-2">
                      <span className="font-medium text-slate-900">{day.high}°</span>
                      <span className="text-slate-500 ml-1">{day.low}°</span>
                    </p>
                    <div className="text-xs text-slate-500 space-y-1">
                      <div>बारिश: {day.rainChance}%</div>
                      <div>नमी: {day.humidity}%</div>
                      <div>हवा: {day.windSpeed} km/h</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Farming Advice */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center text-xl text-slate-900 font-bold">
              <AlertTriangle className="h-6 w-6 mr-2 text-yellow-500" />
              मौसम आधारित कृषि सलाह
            </CardTitle>
          </CardHeader>
          <CardContent>
            {farmingAdvice.length > 0 ? (
              <div className="space-y-4">
                {farmingAdvice.map((advice, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-l-4 ${
                      advice.urgent
                        ? 'bg-red-50 border-red-400'
                        : 'bg-green-50 border-green-400'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 mb-1">
                          <span className="mr-2">{advice.icon}</span>
                          {advice.title}
                          {advice.urgent && (
                            <span className="ml-2 inline-block px-2 py-1 text-xs bg-red-200 text-red-800 rounded-full">
                              तुरंत
                            </span>
                          )}
                        </h3>
                        <p className="text-slate-600 font-medium mb-2">{advice.description}</p>
                        <p className="text-sm text-slate-500 italic">
                          सुझावित कार्य: {advice.action}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500">सलाह लोड हो रही है...</p>
            )}
          </CardContent>
        </Card>

        {/* Weather Alerts & Tips */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-slate-900">मौसम चेतावनी</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {currentWeather && currentWeather.temperature > 35 && (
                  <div className="flex items-center space-x-2 text-red-600">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm font-medium">उच्च तापमान चेतावनी</span>
                  </div>
                )}
                {currentWeather && currentWeather.humidity > 80 && (
                  <div className="flex items-center space-x-2 text-orange-600">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm font-medium">उच्च नमी सावधानी</span>
                  </div>
                )}
                {currentWeather && currentWeather.windSpeed > 20 && (
                  <div className="flex items-center space-x-2 text-blue-600">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm font-medium">तेज हवा चेतावनी</span>
                  </div>
                )}
                {(!currentWeather || (currentWeather.temperature <= 35 && currentWeather.humidity <= 80 && currentWeather.windSpeed <= 20)) && (
                  <div className="flex items-center space-x-2 text-green-600">
                    <Sun className="h-4 w-4" />
                    <span className="text-sm font-medium">अनुकूल मौसम स्थितियां</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-slate-900">कृषि सुझाव</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex items-center space-x-2">
                  <span>🌱</span>
                  <span>मौसम के अनुसार बुआई का समय चुनें</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>💧</span>
                  <span>बारिश से पहले सिंचाई का कार्यक्रम बनाएं</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>🌿</span>
                  <span>तेज धूप में फसल को सुरक्षा प्रदान करें</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>🔍</span>
                  <span>नियमित रूप से मौसम की जांच करें</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <p className="text-slate-600 font-medium">
            मौसम की जानकारी हर घंटे अपडेट होती है। 
            कृषि कार्यों के लिए स्थानीय मौसम विभाग की सलाह भी लें।
          </p>
          <p className="text-xs text-slate-500 mt-2">
            डेटा स्रोत: OpenWeatherMap | अंतिम अपडेट: {lastRefresh.toLocaleString('hi-IN')}
          </p>
        </div>
      </div>
    </div>
  )
}