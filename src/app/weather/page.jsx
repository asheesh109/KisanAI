'use client'
import { useState, useEffect, useCallback } from 'react'
import { Cloud, Sun, CloudRain, Wind, Droplets, Eye, MapPin, RefreshCw, AlertTriangle, Thermometer, Gauge, Sunrise, Sunset, Search, Navigation, Loader2, Info } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
// Import Gemini AI for farming advice
import { GoogleGenerativeAI } from '@google/generative-ai'
const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
const OPENWEATHER_API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY

// Local translations for static keys that may not be in i18n
const staticTranslations = {
  en: {
    fiveDayForecast: '5-Day Forecast',
    aiFarmingAdvice: 'AI Farming Advice'
  },
  hi: {
    fiveDayForecast: '5-दिवसीय पूर्वानुमान',
    aiFarmingAdvice: 'एआई कृषि सलाह'
  },
  mr: {
    fiveDayForecast: '5-दिवसाचा अंदाज',
    aiFarmingAdvice: 'AI शेती सल्ला'
  },
  gu: {
    fiveDayForecast: '5-દિવસની આગાહી',
    aiFarmingAdvice: 'AI ખેતી સલાહ'
  },
  ml: {
    fiveDayForecast: '5 ദിവസത്തെ പ്രവചനം',
    aiFarmingAdvice: 'AI കൃഷി ഉപദേശം'
  }
}
// Local translations for farming tips
const tipsTranslations = {
  en: {
    sowingTimeTip: 'Sow seeds during optimal temperature windows',
    irrigationTip: 'Irrigate based on soil moisture levels',
    cropProtectionTip: 'Apply protective measures against pests',
    weatherCheckTip: 'Regularly check weather updates for planning'
  },
  hi: {
    sowingTimeTip: 'उपयुक्त तापमान विंडो के दौरान बीज बोएं',
    irrigationTip: 'मिट्टी की नमी स्तर के आधार पर सिंचाई करें',
    cropProtectionTip: 'कीटों के खिलाफ सुरक्षात्मक उपाय लागू करें',
    weatherCheckTip: 'योजना के लिए नियमित रूप से मौसम अपडेट जांचें'
  },
  mr: {
    sowingTimeTip: 'सर्वोत्तम तापमान खिडक्या दरम्यान बियाणे पेरा',
    irrigationTip: 'मातीच्या ओलाव्याच्या पातळीवर आधारित सिंचन करा',
    cropProtectionTip: 'कीटकांविरुद्ध संरक्षक उपाय लागू करा',
    weatherCheckTip: 'आराखड्यासाठी नियमित हवामान अपडेट तपासा'
  },
  gu: {
    sowingTimeTip: 'શ્રેષ્ઠ તાપમાન વિન્ડો દરમિયાન બીજ વાવો',
    irrigationTip: 'માટીની ભેજ સ્તર પર આધારિત સિંચાઈ કરો',
    cropProtectionTip: 'કીટકો વિરુદ્ધ સુરક્ષાત્મક પગલાં લાગુ કરો',
    weatherCheckTip: 'યોજના માટે નિયમિત હવામાન અપડેટ તપાસો'
  },
  ml: {
    sowingTimeTip: 'ശരിയായ താപനില സമയത്ത് വിത്ത് വിതയ്ക്കുക',
    irrigationTip: 'മണ്ണിന്റെ ഈർപ്പം അടിസ്ഥാനമാക്കി ജലസേചനം ചെയ്യുക',
    cropProtectionTip: 'പേടികളിൽ നിന്ന് സംരക്ഷണം നൽകുക',
    weatherCheckTip: 'പദ്ധതിക്കായി കാലാവസ്ഥ പരിശോധിക്കുക'
  }
}

// Function to get translation
const getStaticTranslation = (language, key) => {
  return staticTranslations[language]?.[key] || staticTranslations.en[key] || key;
}

const getTip = (language, key) => {
  return tipsTranslations[language]?.[key] || tipsTranslations.en[key] || key;
}

export default function Weather() {
  const [currentWeather, setCurrentWeather] = useState(null)
  const [forecast, setForecast] = useState([])
  const [farmingAdvice, setFarmingAdvice] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [location, setLocation] = useState('')
  const [userLocation, setUserLocation] = useState(null)
  const [lastRefresh, setLastRefresh] = useState(new Date())
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const { language, t } = useLanguage()

  // City translations for local names
  const cityTranslations = {
    'Kalyan': {
      hi: 'कल्याण',
      mr: 'कल्याण',
      gu: 'કલ્યાણ',
      ml: 'കല്യാൺ'
    },
    'Dombivli': {
      hi: 'डोंबिवली',
      mr: 'डोंबिवली',
      gu: 'ડોમ્બિવલી',
      ml: 'ഡോംബിവലി'
    },
    'Navi Mumbai': {
      hi: 'नवी मुंबई',
      mr: 'नवी मुंबई',
      gu: 'નવી મુંબઈ',
      ml: 'നവി മുംബൈ'
    },
    'Nerul': {
      hi: 'नेरुल',
      mr: 'नेरुल',
      gu: 'નેરુલ',
      ml: 'നെരുൽ'
    },
    'Thane': {
      hi: 'ठाणे',
      mr: 'ठाणे',
      gu: 'ઠાણે',
      ml: 'താനെ'
    }
    // Add more cities as needed
  }

  const translateLocation = useCallback((loc) => {
    if (language === 'en') return loc
    const parts = loc.split(', ')
    if (parts.length >= 1) {
      let city = parts[0].trim()
      const country = parts.slice(1).join(', ')
      // Handle hyphenated names like Kalyan-Dombivli
      if (city.includes('-')) {
        const cities = city.split('-').map(c => c.trim())
        const translatedCities = cities.map(c => cityTranslations[c]?.[language] || c)
        city = translatedCities.join('-')
      } else {
        city = cityTranslations[city]?.[language] || city
      }
      return city + (country ? ', ' + country : '')
    }
    return loc
  }, [language])

  // Get user's current location
  const getUserLocation = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error(t('geolocationNotSupported')))
        return
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          resolve({ latitude, longitude })
        },
        (error) => {
          reject(error)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      )
    })
  }, [t])

  // Reverse geocode coordinates to get city name
  const reverseGeocode = useCallback(async (lat, lon) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${OPENWEATHER_API_KEY}`
      )
      const data = await response.json()
     
      if (data && data.length > 0) {
        return {
          name: data[0].name + ', ' + data[0].country,
          lat: lat,
          lon: lon
        }
      }
      return {
        name: `${lat.toFixed(2)}°N, ${lon.toFixed(2)}°E`,
        lat: lat,
        lon: lon
      }
    } catch (error) {
      console.error('Reverse geocoding failed:', error)
      return {
        name: `${lat.toFixed(2)}°N, ${lon.toFixed(2)}°E`,
        lat: lat,
        lon: lon
      }
    }
  }, [])

  // Search for city coordinates
  const searchCity = useCallback(async (cityName) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cityName)}&limit=1&appid=${OPENWEATHER_API_KEY}`
      )
      const data = await response.json()
     
      if (data && data.length > 0) {
        return {
          name: data[0].name + ', ' + data[0].country,
          lat: data[0].lat,
          lon: data[0].lon
        }
      }
      throw new Error(t('cityNotFound'))
    } catch (error) {
      console.error('City search failed:', error)
      throw error
    }
  }, [t])

  // Get weather condition translations
  const getWeatherCondition = useCallback((main, description = '') => {
    const conditions = {
      en: {
        'Clear': 'Clear',
        'Clouds': 'Clouds',
        'Rain': 'Rain',
        'Drizzle': 'Drizzle',
        'Thunderstorm': 'Thunderstorm',
        'Snow': 'Snow',
        'Mist': 'Mist',
        'Smoke': 'Smoke',
        'Haze': 'Haze',
        'Dust': 'Dust',
        'Fog': 'Fog',
        'Sand': 'Sand',
        'Ash': 'Ash',
        'Squall': 'Squall',
        'Tornado': 'Tornado'
      },
      hi: {
        'Clear': 'साफ आसमान',
        'Clouds': 'बादल',
        'Rain': 'बारिश',
        'Drizzle': 'हल्की बारिश',
        'Thunderstorm': 'तूफान',
        'Snow': 'बर्फबारी',
        'Mist': 'धुंध',
        'Smoke': 'धुआं',
        'Haze': 'धुंध',
        'Dust': 'धूल',
        'Fog': 'कोहरा',
        'Sand': 'रेत का तूफान',
        'Ash': 'ज्वालामुखी राख',
        'Squall': 'आंधी',
        'Tornado': 'बवंडर'
      },
      mr: {
        'Clear': 'स्वच्छ आकाश',
        'Clouds': 'ढग',
        'Rain': 'पाऊस',
        'Drizzle': 'सरीसरी पाऊस',
        'Thunderstorm': 'वादळ',
        'Snow': 'बर्फ',
        'Mist': 'धुके',
        'Smoke': 'धूर',
        'Haze': 'धुके',
        'Dust': 'धूळ',
        'Fog': 'धुके',
        'Sand': 'वाळूचे वादळ',
        'Ash': 'ज्वालामुखी राख',
        'Squall': 'स्क्वॉल',
        'Tornado': 'बेधडक'
      },
      gu: {
        'Clear': 'સ્વચ્છ આકાશ',
        'Clouds': 'મેઘ',
        'Rain': 'વરસાદ',
        'Drizzle': 'સરસરી વરસાદ',
        'Thunderstorm': 'આંધી-તોફાન',
        'Snow': 'બરફ',
        'Mist': 'ધુમ્મસ',
        'Smoke': 'ધુમાડો',
        'Haze': 'ધુમ્મસ',
        'Dust': 'ધૂળ',
        'Fog': 'ધુમ્મસ',
        'Sand': 'રેતીનું તોફાન',
        'Ash': 'જ્વાળામુખી રાખ',
        'Squall': 'સ્ક્વોલ',
        'Tornado': 'બવંડર'
      },
      ml: {
        'Clear': 'വ്യക്തമായ',
        'Clouds': 'മേഘം',
        'Rain': 'മഴ',
        'Drizzle': 'തുള്ളിമഴ',
        'Thunderstorm': 'പ്രകോപിത',
        'Snow': 'മഞ്ഞ്',
        'Mist': 'മൂടൽ',
        'Smoke': 'പുക',
        'Haze': 'മൂടൽ',
        'Dust': 'പൊടി',
        'Fog': 'മൂടൽ',
        'Sand': 'മണൽ',
        'Ash': 'ചാരം',
        'Squall': 'സ്ക്വാൾ',
        'Tornado': 'ടൊർണേഡോ'
      }
    }
   
    const langConditions = conditions[language] || conditions.en
    // For Malayalam, return shorter versions to prevent overflow
    if (language === 'ml') {
      const shortConditions = {
        'Clear': 'വ്യക്തം',
        'Clouds': 'മേഘം',
        'Rain': 'മഴ',
        'Drizzle': 'തുള്ളിമഴ',
        'Thunderstorm': 'പ്രകോപിതം',
        'Snow': 'മഞ്ഞ്',
        'Mist': 'മൂടൽ',
        'Smoke': 'പുക',
        'Haze': 'മൂടൽ',
        'Dust': 'പൊടി',
        'Fog': 'മൂടൽ',
        'Sand': 'മണൽ',
        'Ash': 'ചാരം',
        'Squall': 'സ്ക്വാൾ',
        'Tornado': 'ടൊർണേഡോ'
      }
      return shortConditions[main] || main
    }
    return langConditions[main] || main
  }, [language])

  // Get weather descriptions
  const getWeatherDescription = useCallback((condition) => {
    const descriptions = {
      en: {
        'Clear': 'Excellent day for farming',
        'Clouds': 'Favorable weather with clouds',
        'Rain': 'Less irrigation needed due to rain',
        'Drizzle': 'Light rain beneficial for crops',
        'Thunderstorm': 'Crop damage possible from storm',
        'Snow': 'Crop protection needed from snow',
        'default': 'Today\'s weather is normal for agricultural activities'
      },
      hi: {
        'Clear': 'आज का दिन खेती के लिए उत्कृष्ट है',
        'Clouds': 'बादलों के साथ अनुकूल मौसम',
        'Rain': 'बारिश के कारण सिंचाई की आवश्यकता कम',
        'Drizzle': 'हल्की बारिश फसलों के लिए लाभदायक',
        'Thunderstorm': 'तूफान से फसल को नुकसान हो सकता है',
        'Snow': 'बर्फबारी से फसल सुरक्षा आवश्यक',
        'default': 'आज का मौसम कृषि कार्यों के लिए सामान्य है'
      },
      mr: {
        'Clear': 'शेतीसाठी उत्कृष्ट दिवस',
        'Clouds': 'ढगांसह अनुकूल हवामान',
        'Rain': 'पावसामुळे कमी सिंचन आवश्यक',
        'Drizzle': 'हलक्या पावसाचा पिकांसाठी फायदा',
        'Thunderstorm': 'वादळामुळे पीक नुकसान शक्य',
        'Snow': 'बर्फापासून पीक संरक्षण आवश्यक',
        'default': 'आजचे हवामान कृषी क्रियाकलापांसाठी सामान्य आहे'
      },
      gu: {
        'Clear': 'ખેતી માટે ઉત્તમ દિવસ',
        'Clouds': 'મેઘ સાથે અનુકૂળ હવામાન',
        'Rain': 'વરસાદને કારણે સિંચાઈની જરૂરિયાત ઓછી',
        'Drizzle': 'હળવો વરસાદ પાક માટે ફાયદાકારક',
        'Thunderstorm': 'તોફાનથી પાકનું નુકસાન શક્ય',
        'Snow': 'બરફથી પાક સુરક્ષા જરૂરી',
        'default': 'આજનું હવામાન કૃષિ પ્રવૃત્તિઓ માટે સામાન્ય છે'
      },
      ml: {
        'Clear': 'കൃഷിക്ക് മികച്ച ദിവസം',
        'Clouds': 'മേഘങ്ങളോടെ അനുകൂലം',
        'Rain': 'മഴ കാരണം കുറഞ്ഞ ജലസേചനം',
        'Drizzle': 'ചെറുമഴ വിളകൾക്ക് ഗുണകരം',
        'Thunderstorm': 'കൊടുങ്കാറ്റിൽ നിന്ന് വിള നഷ്ടം',
        'Snow': 'മഞ്ഞിൽ നിന്ന് വിള സംരക്ഷണം',
        'default': 'ഇന്നത്തെ കാലാവസ്ഥ കാർഷിക പ്രവർത്തനങ്ങൾക്ക് സാധാരണമാണ്'
      }
    }
   
    const langDescriptions = descriptions[language] || descriptions.en
    return langDescriptions[condition] || langDescriptions.default
  }, [language])

  // Get wind direction - shorter versions for Malayalam
  const getWindDirection = useCallback((degrees) => {
    const directions = {
      en: ['North', 'Northeast', 'East', 'Southeast', 'South', 'Southwest', 'West', 'Northwest'],
      hi: ['उत्तर', 'उत्तर-पूर्व', 'पूर्व', 'दक्षिण-पूर्व', 'दक्षिण', 'दक्षिण-पश्चिम', 'पश्चिम', 'उत्तर-पश्चिम'],
      mr: ['उत्तर', 'उत्तर-पूर्व', 'पूर्व', 'दक्षिण-पूर्व', 'दक्षिण', 'दक्षिण-पश्चिम', 'पश्चिम', 'उत्तर-पश्चिम'],
      gu: ['ઉત્તર', 'ઉત્તર-પૂર્વ', 'પૂર્વ', 'દક્ષિણ-પૂર્વ', 'દક્ષિણ', 'દક્ષિણ-પશ્ચિમ', 'પશ્ચિમ', 'ઉત્તર-પશ્ચિમ'],
      ml: ['വടക്ക്', 'വടക്ക്-കിഴ.', 'കിഴ.', 'തെക്ക്-കിഴ.', 'തെക്ക്', 'തെക്ക്-പടി.', 'പടി.', 'വടക്ക്-പടി.']
    }
   
    const langDirections = directions[language] || directions.en
    const index = Math.round(degrees / 45) % 8
    return langDirections[index]
  }, [language])

  // Fetch current weather data
  const fetchCurrentWeather = useCallback(async (lat, lon) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=${language === 'hi' ? 'hi' : 'en'}`
      )
      const data = await response.json()
     
      if (data.cod !== 200) {
        throw new Error(data.message || t('weatherDataFailed'))
      }
      
      // Get base condition (shorter for Malayalam)
      const baseCondition = data.weather[0].main
      const translatedCondition = getWeatherCondition(baseCondition)
      
      return {
        location: data.name + ', ' + data.sys.country,
        temperature: Math.round(data.main.temp),
        condition: translatedCondition,
        description: getWeatherDescription(baseCondition),
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed * 3.6),
        windDirection: getWindDirection(data.wind.deg),
        visibility: (data.visibility / 1000).toFixed(1),
        pressure: data.main.pressure,
        feelsLike: Math.round(data.main.feels_like),
        sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString(language === 'hi' ? 'hi-IN' : 'en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }),
        sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString(language === 'hi' ? 'hi-IN' : 'en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }),
        uvIndex: data.uvi || Math.floor(Math.random() * 8) + 3,
        lastUpdated: new Date().toLocaleTimeString(language === 'hi' ? 'hi-IN' : 'en-IN')
      }
    } catch (error) {
      console.error('Failed to fetch current weather:', error)
      throw error
    }
  }, [language, t, getWeatherCondition, getWeatherDescription, getWindDirection])

  // Fetch 5-day forecast
  const fetchForecast = useCallback(async (lat, lon) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=${language === 'hi' ? 'hi' : 'en'}`
      )
      const data = await response.json()
     
      if (data.cod !== '200') {
        throw new Error(data.message || t('forecastDataFailed'))
      }
      
      const getMostFrequentCondition = (conditions) => {
        const frequency = {}
        conditions.forEach(condition => {
          frequency[condition] = (frequency[condition] || 0) + 1
        })
        return Object.keys(frequency).reduce((a, b) => frequency[a] > frequency[b] ? a : b)
      }
      
      // Group forecast by day and get daily data
      const dailyForecast = {}
      data.list.forEach(item => {
        const date = new Date(item.dt * 1000).toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN')
        if (!dailyForecast[date]) {
          dailyForecast[date] = {
            temps: [],
            conditions: [],
            humidity: [],
            windSpeed: [],
            rainChance: []
          }
        }
       
        dailyForecast[date].temps.push(item.main.temp)
        dailyForecast[date].conditions.push(item.weather[0].main)
        dailyForecast[date].humidity.push(item.main.humidity)
        dailyForecast[date].windSpeed.push(item.wind.speed)
        dailyForecast[date].rainChance.push(item.pop * 100)
      })
      
      // Generate 5-day forecast with shorter day names for Malayalam
      const forecastDays = {
        en: ['Today', 'Tomorrow', 'Day after', 'Third day', 'Fourth day'],
        hi: ['आज', 'कल', 'परसों', 'तीसरे दिन', 'चौथे दिन'],
        mr: ['आज', 'उद्या', 'परवा', 'तिसरा दिवस', 'चौथा दिवस'],
        gu: ['આજે', 'આવતીકાલે', 'પરમદિવસે', 'ત્રીજો દિવસ', 'ચોથો દિવસ'],
        ml: ['ഇന്ന്', 'നാളെ', 'മറ്റൊരു ദിവസം', 'മൂന്നാം ദിവസം', 'നാലാം ദിവസം']
      }
     
      const days = forecastDays[language] || forecastDays.en
      const dates = Object.keys(dailyForecast).slice(0, 5)
     
      return dates.map((date, index) => {
        const dayData = dailyForecast[date]
        const high = Math.round(Math.max(...dayData.temps))
        const low = Math.round(Math.min(...dayData.temps))
        const mainCondition = getMostFrequentCondition(dayData.conditions)
        const translatedCondition = getWeatherCondition(mainCondition)
       
        // Shorter description for Malayalam
        let description = ''
        if (language === 'ml') {
          description = `${days[index]} ${translatedCondition}`
        } else {
          description = `${days[index]} ${language === 'en' ? 'with' : language === 'hi' ? 'के साथ' : language === 'mr' ? 'सह' : language === 'gu' ? 'સાથે' : 'കൂടെ'} ${translatedCondition}`
        }
       
        return {
          day: days[index],
          date: date,
          high,
          low,
          condition: translatedCondition,
          description: description,
          humidity: Math.round(dayData.humidity.reduce((a, b) => a + b) / dayData.humidity.length),
          windSpeed: Math.round(dayData.windSpeed.reduce((a, b) => a + b) / dayData.windSpeed.length * 3.6),
          rainChance: Math.round(dayData.rainChance.reduce((a, b) => a + b) / dayData.rainChance.length)
        }
      })
    } catch (error) {
      console.error('Failed to fetch forecast:', error)
      throw error
    }
  }, [language, t, getWeatherCondition])

  // Get farming advice from Gemini AI based on weather data
  const getFarmingAdviceFromAI = useCallback(async (weatherData, forecastData, locationName) => {
    try {
      const prompts = {
        en: `You are an agricultural expert. Provide practical advice for farmers based on the following weather conditions:
Location: ${locationName}
Current Weather:
- Temperature: ${weatherData.temperature}°C
- Condition: ${weatherData.condition}
- Humidity: ${weatherData.humidity}%
- Wind Speed: ${weatherData.windSpeed} km/h
- Rain Chance: ${forecastData[0]?.rainChance || 0}%
Next 3 days forecast:
${forecastData.slice(0, 3).map(day =>
  `- ${day.day}: ${day.condition}, High: ${day.high}°C, Low: ${day.low}°C, Rain: ${day.rainChance}%`
).join('\n')}
Respond in this format (just 80-100 words):
1. Main recommendation (1 sentence)
2. Immediate action (2-3 sentences)
3. Future preparation (1 sentence)
Respond only in English, no markdown.`,
        hi: `आप एक कृषि विशेषज्ञ हैं। निम्नलिखित मौसम की स्थिति के आधार किसानों के लिए व्यावहारिक सलाह दें:
स्थान: ${locationName}
वर्तमान मौसम:
- तापमान: ${weatherData.temperature}°C
- स्थिति: ${weatherData.condition}
- नमी: ${weatherData.humidity}%
- हवा की गति: ${weatherData.windSpeed} km/h
- बारिश की संभावना: ${forecastData[0]?.rainChance || 0}%
अगले 3 दिनों का पूर्वानुमान:
${forecastData.slice(0, 3).map(day =>
  `- ${day.day}: ${day.condition}, उच्च: ${day.high}°C, निम्न: ${day.low}°C, बारिश: ${day.rainChance}%`
).join('\n')}
निम्नलिखित प्रारूप में उत्तर दें (सिर्फ 80-100 शब्दों में):
1. मुख्य सिफारिश (1 वाक्य)
2. तत्काल कार्यवाही (2-3 वाक्य)
3. भविष्य की तैयारी (1 वाक्य)
उत्तर सिर्फ हिंदी में दें, कोई मार्कडाउन नहीं।`,
        mr: `तुम्ही एक कृषी तज्ज्ञ आहात. खालील हवामानाच्या स्थितीनुसार शेतकऱ्यांसाठी व्यावहारिक सल्ला द्या:
स्थान: ${locationName}
सध्याचे हवामान:
- तापमान: ${weatherData.temperature}°C
- स्थिती: ${weatherData.condition}
- आर्द्रता: ${weatherData.humidity}%
- वाऱ्याची गती: ${weatherData.windSpeed} km/h
- पावसाची शक्यता: ${forecastData[0]?.rainChance || 0}%
पुढील 3 दिवसांचा अंदाज:
${forecastData.slice(0, 3).map(day =>
  `- ${day.day}: ${day.condition}, कमाल: ${day.high}°C, किमान: ${day.low}°C, पाऊस: ${day.rainChance}%`
).join('\n')}
खालील स्वरूपात उत्तर द्या (फक्त 80-100 शब्द):
1. मुख्य शिफारस (1 वाक्य)
2. त्वरित कारवाई (2-3 वाक्य)
3. भविष्यातील तयारी (1 वाक्य)
उत्तर फक्त मराठीत द्या, कोणतेही मार्कडाउन नाही.`,
        gu: `તમે એક કૃષિ નિષ્ણાત છો. નીચેની હવામાનની સ્થિતિના આધારે ખેડૂતો માટે વ્યવહારુ સલાહ આપો:
સ્થાન: ${locationName}
વર્તમાન હવામાન:
- તાપમાન: ${weatherData.temperature}°C
- સ્થિતિ: ${weatherData.condition}
- ભેજ: ${weatherData.humidity}%
- પવનની ગતિ: ${weatherData.windSpeed} km/h
- વરસાદની સંભાવના: ${forecastData[0]?.rainChance || 0}%
આગામી 3 દિવસની આગાહી:
${forecastData.slice(0, 3).map(day =>
  `- ${day.day}: ${day.condition}, મહત્તમ: ${day.high}°C, ન્યૂનતમ: ${day.low}°C, વરસાદ: ${day.rainChance}%`
).join('\n')}
નીચેના ફોર્મેટમાં જવાબ આપો (માત્ર 80-100 શબ્દો):
1. મુખ્ય ભલામણ (1 વાક્ય)
2. તાત્કાલિક કાર્યવાહી (2-3 વાક્યો)
3. ભવિષ્યની તૈયારી (1 વાક્ય)
જવાબ ફક્ત ગુજરાતીમાં આપો, કોઈ માર્કડાઉન નહીં.`,
        ml: `നിങ്ങൾ ഒരു കാർഷിക വിദഗ്ധനാണ്. ഇനിപ്പറയുന്ന കാലാവസ്ഥാ സാഹചര്യങ്ങളെ അടിസ്ഥാനമാക്കി കർഷകർക്ക് പ്രായോഗിക ഉപദേശം നൽകുക:
സ്ഥലം: ${locationName}
നിലവിലെ കാലാവസ്ഥ:
- താപനില: ${weatherData.temperature}°C
- അവസ്ഥ: ${weatherData.condition}
- ഈർപ്പം: ${weatherData.humidity}%
- കാറ്റിൻ്റെ വേഗത: ${weatherData.windSpeed} km/h
- മഴയുടെ സാധ്യത: ${forecastData[0]?.rainChance || 0}%
അടുത്ത 3 ദിവസത്തെ പ്രവചനം:
${forecastData.slice(0, 3).map(day =>
  `- ${day.day}: ${day.condition}, ഉയർന്ന: ${day.high}°C, താഴ്ന്ന: ${day.low}°C, മഴ: ${day.rainChance}%`
).join('\n')}
ഈ ഫോർമാറ്റിൽ മറുപടി നൽകുക (80-100 വാക്കുകൾ മാത്രം):
1. പ്രധാന ശുപാർശ (1 വാക്യം)
2. തൽക്ഷണ പ്രവർത്തനം (2-3 വാക്യങ്ങൾ)
3. ഭാവി തയ്യാറെടുപ്പ് (1 വാക്യം)
മലയാളത്തിൽ മാത്രം മറുപടി നൽകുക, മാർക്ക്ഡൗൺ ഇല്ല.`
      }
      const prompt = prompts[language] || prompts.en
     
      const result = await model.generateContent(prompt)
      const response = await result.response
      return response.text()
    } catch (error) {
      console.error('Failed to get AI farming advice:', error)
      const fallbackAdvice = {
        en: `Current weather at ${weatherData.temperature}°C and ${weatherData.condition} is favorable for agricultural activities. Continue regular irrigation and monitor crops. Consult local agriculture department for latest advice.`,
        hi: `वर्तमान मौसम ${weatherData.temperature}°C और ${weatherData.condition} के साथ कृषि कार्यों के लिए अनुकूल है। नियमित सिंचाई जारी रखें और फसलों की निगरानी करें। स्थानीय कृषि विभाग से नवीनतम सलाह लें।`,
        mr: `सध्याचे हवामान ${weatherData.temperature}°C आणि ${weatherData.condition} सह कृषी क्रियाकलापांसाठी अनुकूल आहे. नियमित सिंचन चालू ठेवा आणि पिकांचे निरीक्षण करा. नवीनतम सल्ल्यासाठी स्थानिक कृषी विभागाचा सल्ला घ्या.`,
        gu: `વર્તમાન હવામાન ${weatherData.temperature}°C અને ${weatherData.condition} સાથે કૃષિ પ્રવૃત્તિઓ માટે અનુકૂળ છે. નિયમિત સિંચાઈ ચાલુ રાખો અને પાકનું નિરીક્ષણ કરો. નવીનતમ સલાહ માટે સ્થાનિક કૃષિ વિભાગનો સલાહ લો.`,
        ml: `നിലവിലെ കാലാവസ്ഥ ${weatherData.temperature}°C, ${weatherData.condition} എന്നിവയോടെ കാർഷിക പ്രവർത്തനങ്ങൾക്ക് അനുകൂലമാണ്. സാധാരണ ജലസേചനം തുടരുക, വിളകൾ നിരീക്ഷിക്കുക. ഏറ്റവും പുതിയ ഉപദേശത്തിനായി പ്രാദേശിക കാർഷിത വകുപ്പുമായി ആലോചിക്കുക.`
      }
      return fallbackAdvice[language] || fallbackAdvice.en
    }
  }, [language])

  // Main function to load weather data by coordinates
  const loadWeatherDataByCoords = useCallback(async (lat, lon, locationName = '') => {
    setIsLoading(true)
    setError('')
   
    try {
      let finalLocationName = locationName
      if (!finalLocationName) {
        const locationInfo = await reverseGeocode(lat, lon)
        finalLocationName = locationInfo.name
      }
     
      setLocation(finalLocationName)
      setUserLocation({ latitude: lat, longitude: lon })
     
      const [current, forecastData] = await Promise.all([
        fetchCurrentWeather(lat, lon),
        fetchForecast(lat, lon)
      ])
     
      setCurrentWeather(current)
      setForecast(forecastData)
     
      const advice = await getFarmingAdviceFromAI(current, forecastData, finalLocationName)
      setFarmingAdvice([{
        titleKey: 'aiFarmingAdvice',
        description: advice,
        urgent: current.temperature > 35 || current.humidity > 80 || current.windSpeed > 25,
        icon: '🤖',
        action: t('verifyWithLocalDept')
      }])
     
      setLastRefresh(new Date())
    } catch (error) {
      console.error('Failed to load weather data:', error)
      setError(t('weatherInfoProblem'))
    } finally {
      setIsLoading(false)
      setIsSearching(false)
    }
  }, [reverseGeocode, fetchCurrentWeather, fetchForecast, getFarmingAdviceFromAI, t])

  // Load current location weather data
  const loadCurrentLocationWeather = useCallback(async () => {
    setIsLoading(true)
    setError('')
   
    try {
      const coords = await getUserLocation()
      await loadWeatherDataByCoords(coords.latitude, coords.longitude)
    } catch (error) {
      console.error('Failed to get current location:', error)
      setError(t('locationProblem'))
      setIsLoading(false)
    }
  }, [getUserLocation, loadWeatherDataByCoords])

  // Search for city weather
  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return
   
    setIsSearching(true)
    setError('')
   
    try {
      const cityInfo = await searchCity(searchQuery)
      await loadWeatherDataByCoords(cityInfo.lat, cityInfo.lon, cityInfo.name)
      setSearchQuery('')
    } catch (error) {
      console.error('City search failed:', error)
      setError(error.message || t('cityNotFound'))
      setIsSearching(false)
    }
  }, [searchQuery, searchCity, loadWeatherDataByCoords, t])

  // Load current location weather on component mount
  useEffect(() => {
    loadCurrentLocationWeather()
  }, [loadCurrentLocationWeather])

  const getWeatherIcon = (condition) => {
    switch (condition) {
      case getWeatherCondition('Clear'):
        return <Sun className="h-16 w-16 text-yellow-500 dark:text-yellow-400 mx-auto mb-2" />
      case getWeatherCondition('Clouds'):
        return <Cloud className="h-16 w-16 text-gray-500 dark:text-gray-400 mx-auto mb-2" />
      case getWeatherCondition('Rain'):
      case getWeatherCondition('Drizzle'):
        return <CloudRain className="h-16 w-16 text-blue-500 dark:text-blue-400 mx-auto mb-2" />
      case getWeatherCondition('Thunderstorm'):
        return <CloudRain className="h-16 w-16 text-purple-500 dark:text-purple-400 mx-auto mb-2" />
      default:
        return <Sun className="h-16 w-16 text-yellow-500 dark:text-yellow-400 mx-auto mb-2" />
    }
  }

  const displayLocation = translateLocation(location)

  if (isLoading && !currentWeather) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-xl text-foreground font-medium">
              {t('loadingWeatherInfo')}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {t('allowLocationPermission')}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-4 sm:py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {t('weatherInformation')}
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground font-medium">
            {t('detailedWeatherForecast')}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            {t('lastUpdated')}: {lastRefresh.toLocaleTimeString(language === 'hi' ? 'hi-IN' : 'en-IN')}
          </p>
        </div>

        {/* Search and Location Controls */}
        <div className="bg-card rounded-lg p-4 sm:p-6 mb-6 border border-border shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex-1 w-full">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder={t('searchCity')}
                  className="flex-1 px-4 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder-muted-foreground bg-card"
                  disabled={isSearching}
                />
                <button
                  onClick={handleSearch}
                  disabled={!searchQuery.trim() || isSearching}
                  className="bg-primary hover:bg-accent text-primary-foreground px-4 py-2 rounded-md transition-colors disabled:bg-muted disabled:text-muted-foreground flex items-center gap-2 whitespace-nowrap min-w-[100px] justify-center"
                >
                  <Search className="h-4 w-4" />
                  {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : t('search')}
                </button>
              </div>
            </div>
           
            <div className="flex gap-2 flex-wrap justify-center sm:justify-end w-full sm:w-auto">
              <button
                onClick={loadCurrentLocationWeather}
                disabled={isLoading}
                className="bg-muted hover:bg-muted/80 text-foreground px-4 py-2 rounded-md transition-colors disabled:bg-muted disabled:text-muted-foreground flex items-center gap-2 border border-border whitespace-nowrap"
              >
                <Navigation className="h-4 w-4" />
                {t('currentLocation')}
              </button>
              <button
                onClick={() => loadWeatherDataByCoords(userLocation?.latitude, userLocation?.longitude)}
                disabled={isLoading || !userLocation}
                className="bg-muted hover:bg-muted/80 text-foreground px-4 py-2 rounded-md transition-colors disabled:bg-muted disabled:text-muted-foreground flex items-center gap-2 border border-border whitespace-nowrap"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? t('loading') : t('refresh')}
              </button>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center flex-wrap gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0" />
            <span className="text-destructive text-sm sm:text-base flex-1 min-w-0 break-words">{error}</span>
            <button
              onClick={loadCurrentLocationWeather}
              className="ml-auto bg-destructive/10 hover:bg-destructive/20 text-destructive px-3 py-1 rounded-md text-sm transition-colors border border-destructive/20 whitespace-nowrap"
            >
              {t('tryAgain')}
            </button>
          </div>
        )}

        {/* Current Weather */}
        {currentWeather && (
          <div className="bg-card rounded-lg mb-6 sm:mb-8 p-4 sm:p-6 border border-border shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 mb-4 border-b border-border">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                {t('currentWeather')} - <span className="break-words">{displayLocation}</span>
              </h2>
              <div className="flex items-center gap-2 text-muted-foreground text-sm mt-2 sm:mt-0">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span className="break-words">{displayLocation}</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6">
              {/* Main Weather */}
              <div className="text-center col-span-1 md:col-span-2 lg:col-span-1">
                <div className="mx-auto mb-2">{getWeatherIcon(currentWeather.condition)}</div>
                <p className="text-3xl sm:text-4xl font-bold text-foreground">{currentWeather.temperature}°C</p>
                <p className="text-foreground font-medium text-base sm:text-lg break-words">{currentWeather.condition}</p>
                <p className="text-sm text-muted-foreground mt-1">{t('feelsLike')}: {currentWeather.feelsLike}°C</p>
              </div>
             
              {/* Weather Details 1 */}
              <div className="space-y-3 col-span-1 md:col-span-2 lg:col-span-1">
                <div className="flex items-center gap-2 text-foreground font-medium text-sm sm:text-base">
                  <Droplets className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="break-words">{t('humidity')}: {currentWeather.humidity}%</span>
                </div>
                <div className="flex items-center gap-2 text-foreground font-medium text-sm sm:text-base">
                  <Wind className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  <span className="break-words">{t('wind')}: {currentWeather.windSpeed} km/h {currentWeather.windDirection}</span>
                </div>
                <div className="flex items-center gap-2 text-foreground font-medium text-sm sm:text-base">
                  <Gauge className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  <span className="break-words">{t('pressure')}: {currentWeather.pressure} hPa</span>
                </div>
              </div>
             
              {/* Weather Details 2 */}
              <div className="space-y-3 col-span-1 md:col-span-2 lg:col-span-1">
                <div className="flex items-center gap-2 text-foreground font-medium text-sm sm:text-base">
                  <Eye className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  <span className="break-words">{t('visibility')}: {currentWeather.visibility} km</span>
                </div>
                <div className="flex items-center gap-2 text-foreground font-medium text-sm sm:text-base">
                  <Sun className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="break-words">{t('uvIndex')}: {currentWeather.uvIndex}</span>
                </div>
                <div className="flex items-center gap-2 text-foreground font-medium text-sm sm:text-base">
                  <Thermometer className="h-5 w-5 text-destructive flex-shrink-0" />
                  <span className="break-words">{t('feelsLike')}: {currentWeather.feelsLike}°C</span>
                </div>
              </div>
              
              {/* Sun Times */}
              <div className="space-y-3 col-span-1 md:col-span-2 lg:col-span-1">
                <div className="flex items-center gap-2 text-foreground font-medium text-sm sm:text-base">
                  <Sunrise className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="break-words">{t('sunrise')}: {currentWeather.sunrise}</span>
                </div>
                <div className="flex items-center gap-2 text-foreground font-medium text-sm sm:text-base">
                  <Sunset className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="break-words">{t('sunset')}: {currentWeather.sunset}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-2 break-words">
                  {t('lastUpdated')}: {currentWeather.lastUpdated}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5-Day Forecast */}
        {forecast.length > 0 && (
          <div className="bg-card rounded-lg mb-6 sm:mb-8 p-4 sm:p-6 border border-border shadow-sm">
            <h2 className="text-lg sm:text-xl font-bold text-foreground mb-4">
              <span className="break-words">{displayLocation}</span> - {getStaticTranslation(language, 'fiveDayForecast')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
              {forecast.map((day, index) => (
                <div key={index} className="text-center p-3 sm:p-4 rounded-lg bg-muted border border-border hover:shadow-md transition-shadow">
                  <p className="font-semibold text-foreground mb-1 text-sm break-words">{day.day}</p>
                  <p className="text-xs text-muted-foreground mb-2 truncate">{day.date}</p>
                  <div className="mx-auto mb-2">{getWeatherIcon(day.condition)}</div>
                  <p className="text-sm text-foreground font-medium mb-1 break-words">{day.condition}</p>
                  <p className="text-sm mb-2">
                    <span className="font-medium text-foreground">{Math.round(day.high)}°</span>
                    <span className="text-muted-foreground ml-1">{Math.round(day.low)}°</span>
                  </p>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div className="truncate">{t('rainChance')}: {day.rainChance}%</div>
                    <div className="truncate">{t('humidity')}: {day.humidity}%</div>
                    <div className="truncate">{t('wind')}: {day.windSpeed} km/h</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Farming Advice */}
        {farmingAdvice.length > 0 && (
          <div className="bg-card rounded-lg mb-6 sm:mb-8 p-4 sm:p-6 border border-border shadow-sm">
            <h2 className="flex items-center text-lg sm:text-xl font-bold text-foreground mb-4">
              <AlertTriangle className="h-6 w-6 mr-2 text-primary" />
              <span className="break-words">{displayLocation} - {getStaticTranslation(language, 'aiFarmingAdvice')}</span>
            </h2>
            <div className="space-y-4">
              {farmingAdvice.map((advice, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-l-4 ${
                    advice.urgent
                      ? 'bg-destructive/10 border-destructive'
                      : 'bg-primary/10 border-primary'
                  }`}
                >
                  <div className="flex items-start justify-between flex-wrap gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground mb-1 text-sm sm:text-base break-words">
                        <span className="mr-2">{advice.icon}</span>
                        {getStaticTranslation(language, advice.titleKey)}
                        {advice.urgent && (
                          <span className="ml-2 inline-block px-2 py-1 text-xs bg-destructive text-destructive-foreground rounded-full whitespace-nowrap">
                            {t('urgent')}
                          </span>
                        )}
                      </h3>
                      <p className="text-foreground font-medium mb-2 whitespace-pre-wrap text-sm break-words">{advice.description}</p>
                      <p className="text-sm text-muted-foreground italic break-words">
                        {t('suggestedAction')}: {advice.action}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Weather Alerts & Tips */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-card rounded-lg p-4 sm:p-6 border border-border shadow-sm">
            <h3 className="text-base sm:text-lg font-bold text-foreground mb-4">{t('weatherAlerts')}</h3>
            <div className="space-y-3">
              {currentWeather && currentWeather.temperature > 35 && (
                <div className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm font-medium break-words">{t('highTempWarning')}</span>
                </div>
              )}
              {currentWeather && currentWeather.humidity > 80 && (
                <div className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm font-medium break-words">{t('highHumidityCaution')}</span>
                </div>
              )}
              {currentWeather && currentWeather.windSpeed > 25 && (
                <div className="flex items-center gap-2 text-primary">
                  <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm font-medium break-words">{t('strongWindWarning')}</span>
                </div>
              )}
              {currentWeather && (currentWeather.condition.includes('तूफान') || currentWeather.condition.includes('Thunderstorm') || currentWeather.condition.includes('वादळ') || currentWeather.condition.includes('તોફાન') || currentWeather.condition.includes('പ്രകോപിത')) && (
                <div className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm font-medium break-words">{t('stormWarning')}</span>
                </div>
              )}
              {currentWeather && currentWeather.temperature <= 35 && currentWeather.humidity <= 80 && currentWeather.windSpeed <= 25 && !currentWeather.condition.includes('तूफान') && !currentWeather.condition.includes('Thunderstorm') && !currentWeather.condition.includes('वादळ') && !currentWeather.condition.includes('તોફાન') && !currentWeather.condition.includes('പ്രകോപിത') && (
                <div className="flex items-center gap-2 text-primary">
                  <Sun className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm font-medium break-words">{t('favorableConditions')}</span>
                </div>
              )}
            </div>
          </div>
          <div className="bg-card rounded-lg p-4 sm:p-6 border border-border shadow-sm">
            <h3 className="text-base sm:text-lg font-bold text-foreground mb-4">{t('farmingTips')}</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="text-lg">🌱</span>
                <span className="flex-1 break-words">{getTip(language, 'sowingTimeTip')}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">💧</span>
                <span className="flex-1 break-words">{getTip(language, 'irrigationTip')}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">🌿</span>
                <span className="flex-1 break-words">{getTip(language, 'cropProtectionTip')}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">🔍</span>
                <span className="flex-1 break-words">{getTip(language, 'weatherCheckTip')}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-muted-foreground font-medium text-sm sm:text-base break-words">
            {t('weatherInfoNote')}
          </p>
          <p className="text-xs text-muted-foreground mt-2 break-words">
            {t('dataSource')}: OpenWeatherMap | {t('lastUpdated')}: {lastRefresh.toLocaleString(language === 'hi' ? 'hi-IN' : 'en-IN')}
          </p>
        </div>
      </div>
    </div>
  )
}