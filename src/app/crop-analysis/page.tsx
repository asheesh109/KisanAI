import { Camera, Upload, Image as ImageIcon, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export default function CropAnalysis() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 py-8">
      <div className="max-w-4xl mx-auto px-6 sm:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            फसल विश्लेषण
          </h1>
          <p className="text-xl text-gray-600">
            अपनी फसल की फोटो अपलोड करें और AI से स्वास्थ्य जांच कराएं
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">फसल की फोटो अपलोड करें</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 bg-gray-50">
              <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">
                यहाँ अपनी फसल की फोटो खींचें या अपलोड करें
              </p>
              <div className="space-x-4">
                <Button className="bg-green-600 hover:bg-green-700">
                  <Camera className="mr-2 h-5 w-5" />
                  फोटो खींचें
                </Button>
                <Button variant="outline">
                  <Upload className="mr-2 h-5 w-5" />
                  फाइल अपलोड करें
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ImageIcon className="mr-2 h-5 w-5" />
                फोटो की गुणवत्ता
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="text-gray-700">📸 साफ और तेज फोटो लें</li>
                <li className="text-gray-700">☀️ अच्छी रोशनी में फोटो खींचें</li>
                <li className="text-gray-700">🌿 पत्तियों और तने को दिखाएं</li>
                <li className="text-gray-700">📏 पास से फोटो लें</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="mr-2 h-5 w-5" />
                जांच की सुविधाएं
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="text-gray-700">🔍 बीमारी की पहचान</li>
                <li className="text-gray-700">🐛 कीड़े-मकोड़े की जांच</li>
                <li className="text-gray-700">💚 फसल के स्वास्थ्य का आकलन</li>
                <li className="text-gray-700">💡 उपचार के सुझाव</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>समर्थित फसलें</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="text-gray-700">🌾 गेहूं</li>
                <li className="text-gray-700">🌽 मक्का</li>
                <li className="text-gray-700">🍅 टमाटर</li>
                <li className="text-gray-700">🥬 हरी सब्जियां</li>
                <li className="text-gray-700">🌶️ मिर्च</li>
                <li className="text-gray-700">🧅 प्याज</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-500">
            यह AI-आधारित विश्लेषण प्रारंभिक जानकारी के लिए है। 
            गंभीर समस्या के लिए कृषि विशेषज्ञ से सलाह जरूर लें।
          </p>
        </div>
      </div>
    </div>
  )
}
