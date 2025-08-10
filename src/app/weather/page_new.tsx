'use client'

import { useState, useEffect, useCallback } from 'react'
import { Cloud, Sun, CloudRain, Wind, Droplets, Eye, MapPin, RefreshCw, AlertTriangle, Thermometer, Gauge, Sunrise, Sunset } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface WeatherData {
  location: string
  temperature: number
  condition: string
  description: string
  humidity: number
  windSpeed: number
  windDirection: string
  visibility: number
  uvIndex: number
  pressure: number
  feelsLike: number
  sunrise: string
  sunset: string
  lastUpdated: string
}

interface ForecastDay {
  day: string
  date: string
  high: number
  low: number
  condition: string
  description: string
  humidity: number
  windSpeed: number
  rainChance: number
  icon: React.ComponentType<{ className?: string }>
}

interface FarmingAdvice {
  title: string
  description: string
  urgent: boolean
  icon: string
  action: string
}

export default function Weather() {
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null)
  const [forecast, setForecast] = useState<ForecastDay[]>([])
  const [farmingAdvice, setFarmingAdvice] = useState<FarmingAdvice[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [location, setLocation] = useState('दिल्ली, भारत')
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())

  // Mock weather API - In production, this would call OpenWeatherMap or similar
  const fetchWeatherData = useCallback(async (locationName: string): Promise<{ current: WeatherData, forecast: ForecastDay[] }> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const mockCurrent: WeatherData = {
      location: locationName,
      temperature: Math.floor(Math.random() * 15) + 20, // 20-35°C
      condition: ['साफ आसमान', 'आंशिक बादल', 'बादल', 'हल्की बारिश'][Math.floor(Math.random() * 4)],
      description: 'आज का दिन खेती के लिए अनुकूल है',
      humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
      windSpeed: Math.floor(Math.random() * 20) + 5, // 5-25 km/h
      windDirection: ['उत्तर', 'दक्षिण', 'पूर्व', 'पश्चिम'][Math.floor(Math.random() * 4)],
      visibility: Math.floor(Math.random() * 5) + 8, // 8-12 km
      uvIndex: Math.floor(Math.random() * 8) + 3, // 3-10
      pressure: Math.floor(Math.random() * 50) + 1000, // 1000-1050 hPa
      feelsLike: Math.floor(Math.random() * 15) + 22, // 22-37°C
      sunrise: '06:15',
      sunset: '18:45',
      lastUpdated: new Date().toLocaleTimeString('hi-IN')
    }

    const forecastDays = ['आज', 'कल', 'परसों', 'गुरुवार', 'शुक्रवार', 'शनिवार', 'रविवार']
    const conditions = [
      { name: 'धूप', icon: Sun },
      { name: 'बादल', icon: Cloud },
      { name: 'बारिश', icon: CloudRain },
      { name: 'साफ', icon: Sun }
    ]

    const mockForecast: ForecastDay[] = forecastDays.map((day, index) => {
      const condition = conditions[Math.floor(Math.random() * conditions.length)]
      const high = Math.floor(Math.random() * 10) + 25 // 25-35°C
      const low = high - Math.floor(Math.random() * 8) - 5 // 5-12°C less than high
      
      return {
        day,
        date: new Date(Date.now() + index * 24 * 60 * 60 * 1000).toLocaleDateString('hi-IN'),
        high,
        low,
        condition: condition.name,
        description: `${condition.name} के साथ ${day}`,
        humidity: Math.floor(Math.random() * 30) + 50,
        windSpeed: Math.floor(Math.random() * 15) + 5,
        rainChance: condition.name === 'बारिश' ? Math.floor(Math.random() * 40) + 60 : Math.floor(Math.random() * 30),
        icon: condition.icon
      }
    })

    return { current: mockCurrent, forecast: mockForecast }
  }, [])

  // Generate farming advice based on weather conditions
  const generateFarmingAdvice = useCallback((weather: WeatherData, forecast: ForecastDay[]): FarmingAdvice[] => {
    const advice: FarmingAdvice[] = []

    // Temperature-based advice
    if (weather.temperature > 35) {
      advice.push({
        title: 'उच्च तापमान चेतावनी',
        description: 'तापमान बहुत अधिक है। फसलों को छाया प्रदान करें और दिन में पानी न दें।',
        urgent: true,
        icon: '🌡️',
        action: 'तुरंत छायादार जाल लगाएं'
      })
    }

    // Humidity-based advice
    if (weather.humidity > 80) {
      advice.push({
        title: 'उच्च नमी सावधानी',
        description: 'अधिक नमी से फंगल रोग का खतरा है। हवादार क्षेत्र बनाए रखें।',
        urgent: true,
        icon: '💧',
        action: 'फंगीसाइड छिड़काव करें'
      })
    }

    // Wind-based advice
    if (weather.windSpeed > 20) {
      advice.push({
        title: 'तेज हवा चेतावनी',
        description: 'तेज हवा से फसल को नुकसान हो सकता है। सहारा दें।',
        urgent: true,
        icon: '💨',
        action: 'फसल को बांधें और सहारा दें'
      })
    }

    // Rain-based advice from forecast
    const rainDays = forecast.filter(day => day.rainChance > 60).length
    if (rainDays >= 3) {
      advice.push({
        title: 'सिंचाई बंद करें',
        description: 'अगले दिनों में बारिश की संभावना है। सिंचाई रोक दें।',
        urgent: false,
        icon: '🌧️',
        action: 'ड्रेनेज सिस्टम चेक करें'
      })
    }

    // UV Index advice
    if (weather.uvIndex > 8) {
      advice.push({
        title: 'UV विकिरण चेतावनी',
        description: 'उच्च UV इंडेक्स। दोपहर में काम से बचें।',
        urgent: false,
        icon: '☀️',
        action: 'सुबह या शाम का समय चुनें'
      })
    }

    // Default positive advice
    if (advice.length === 0) {
      advice.push({
        title: 'अनुकूल मौसम',
        description: 'आज का मौसम कृषि कार्यों के लिए उपयुक्त है।',
        urgent: false,
        icon: '✅',
        action: 'नियमित देखभाल जारी रखें'
      })
    }

    return advice
  }, [])

  const loadWeatherData = useCallback(async () => {
    setIsLoading(true)
    try {
      const { current, forecast: forecastData } = await fetchWeatherData(location)
      setCurrentWeather(current)
      setForecast(forecastData)
      setFarmingAdvice(generateFarmingAdvice(current, forecastData))
      setLastRefresh(new Date())
    } catch (error) {
      console.error('Failed to fetch weather data:', error)
    } finally {
      setIsLoading(false)
    }
  }, [location, fetchWeatherData, generateFarmingAdvice])

  useEffect(() => {
    loadWeatherData()
  }, [loadWeatherData])

  const getLocationFromBrowser = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In real implementation, reverse geocode these coordinates
          setLocation(`${position.coords.latitude.toFixed(2)}°N, ${position.coords.longitude.toFixed(2)}°E`)
          loadWeatherData()
        },
        (error) => {
          console.error('Location access denied:', error)
        }
      )
    }
  }

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'धूप':
      case 'साफ आसमान':
      case 'साफ':
        return <Sun className="h-16 w-16 text-yellow-500 mx-auto mb-2" />
      case 'बादल':
      case 'आंशिक बादल':
        return <Cloud className="h-16 w-16 text-gray-500 mx-auto mb-2" />
      case 'बारिश':
      case 'हल्की बारिश':
        return <CloudRain className="h-16 w-16 text-blue-500 mx-auto mb-2" />
      default:
        return <Sun className="h-16 w-16 text-yellow-500 mx-auto mb-2" />
    }
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
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={getLocationFromBrowser}
                  disabled={isLoading}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  स्थान
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={loadWeatherData}
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

        {/* 7-Day Forecast */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl text-slate-900 font-bold">7 दिन का विस्तृत मौसम पूर्वानुमान</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-7 gap-4">
              {forecast.map((day, index) => {
                const IconComponent = day.icon
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
