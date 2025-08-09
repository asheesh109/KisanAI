import { Cloud, Sun, CloudRain, Wind, Droplets, Eye } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

// Mock weather data - in real implementation, this would come from an API
const currentWeather = {
  location: 'दिल्ली, भारत',
  temperature: 28,
  condition: 'आंशिक बादल',
  humidity: 65,
  windSpeed: 12,
  visibility: 8,
  uvIndex: 6,
}

const forecast = [
  { day: 'आज', high: 32, low: 24, condition: 'धूप', icon: Sun },
  { day: 'कल', high: 30, low: 22, condition: 'बादल', icon: Cloud },
  { day: 'परसों', high: 28, low: 20, condition: 'बारिश', icon: CloudRain },
  { day: 'गुरुवार', high: 26, low: 18, condition: 'बारिश', icon: CloudRain },
  { day: 'शुक्रवार', high: 29, low: 21, condition: 'धूप', icon: Sun },
  { day: 'शनिवार', high: 31, low: 23, condition: 'धूप', icon: Sun },
  { day: 'रविवार', high: 33, low: 25, condition: 'गर्म', icon: Sun },
]

const farmingAdvice = [
  {
    title: 'सिंचाई की सलाह',
    description: 'अगले 3 दिन बारिश की संभावना है, सिंचाई रोक दें',
    urgent: true,
  },
  {
    title: 'फसल सुरक्षा',
    description: 'तेज हवा से फसल को बचाने के लिए सहारा दें',
    urgent: false,
  },
  {
    title: 'कीटनाशक छिड़काव',
    description: 'बारिश के बाद कीटनाशक का छिड़काव करें',
    urgent: false,
  },
]

export default function Weather() {
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
        </div>

        {/* Current Weather */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-center text-2xl text-slate-900 font-bold">
              वर्तमान मौसम - {currentWeather.location}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div>
                <Cloud className="h-16 w-16 text-blue-500 mx-auto mb-2" />
                <p className="text-3xl font-bold text-slate-900">{currentWeather.temperature}°C</p>
                <p className="text-slate-600 font-medium">{currentWeather.condition}</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-center space-x-2 text-slate-700 font-medium">
                  <Droplets className="h-5 w-5 text-blue-500" />
                  <span>नमी: {currentWeather.humidity}%</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-slate-700 font-medium">
                  <Wind className="h-5 w-5 text-gray-500" />
                  <span>हवा: {currentWeather.windSpeed} km/h</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-center space-x-2 text-slate-700 font-medium">
                  <Eye className="h-5 w-5 text-gray-500" />
                  <span>दृश्यता: {currentWeather.visibility} km</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-slate-700 font-medium">
                  <Sun className="h-5 w-5 text-yellow-500" />
                  <span>UV Index: {currentWeather.uvIndex}</span>
                </div>
              </div>
              
              <div className="flex justify-center">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  स्थान बदलें
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 7-Day Forecast */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>7 दिन का मौसम पूर्वानुमान</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-7 gap-4">
              {forecast.map((day, index) => {
                const IconComponent = day.icon
                return (
                  <div key={index} className="text-center p-4 rounded-lg bg-gray-50">
                                        <p className="font-semibold text-slate-900 mb-2">{day.day}</p>
                    <IconComponent className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                    <p className="text-sm text-slate-600 font-medium mb-1">{day.condition}</p>
                    <p className="text-sm">
                      <span className="font-medium">{day.high}°</span>
                      <span className="text-gray-500 ml-1">{day.low}°</span>
                    </p>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Farming Advice */}
        <Card>
          <CardHeader>
            <CardTitle>कृषि सलाह</CardTitle>
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
                  <h3 className="font-semibold text-slate-900 mb-1">
                    {advice.urgent && (
                      <span className="text-red-600 mr-2">🚨</span>
                    )}
                    {advice.title}
                  </h3>
                  <p className="text-slate-600 font-medium">{advice.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-slate-600 font-medium">
            मौसम की जानकारी प्रतिदिन अपडेट होती है। 
            कृषि कार्यों के लिए स्थानीय मौसम विभाग की सलाह भी लें।
          </p>
        </div>
      </div>
    </div>
  )
}
