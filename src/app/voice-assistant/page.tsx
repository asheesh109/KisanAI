import { Mic, Volume2, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export default function VoiceAssistant() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-8">
      <div className="max-w-4xl mx-auto px-6 sm:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            आवाज सहायक
          </h1>
          <p className="text-xl text-gray-600">
            हिंदी में अपने खेती संबंधी सवाल पूछें और तुरंत जवाब पाएं
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">AI सहायक से बात करें</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <Mic className="h-16 w-16 text-blue-600" />
            </div>
            
            <div className="space-y-4">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Mic className="mr-2 h-5 w-5" />
                बोलना शुरू करें
              </Button>
              
              <p className="text-gray-600">
                माइक बटन दबाकर अपना सवाल पूछें
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageCircle className="mr-2 h-5 w-5" />
                आम सवाल
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="text-gray-700">&quot;मेरी गेहूं की फसल में पीले पत्ते हो रहे हैं&quot;</li>
                <li className="text-gray-700">&quot;इस मौसम में कौन सी फसल बोनी चाहिए?&quot;</li>
                <li className="text-gray-700">&quot;खाद कब डालना चाहिए?&quot;</li>
                <li className="text-gray-700">&quot;मिट्टी की जांच कैसे कराएं?&quot;</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Volume2 className="mr-2 h-5 w-5" />
                सुविधाएं
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="text-gray-700">✅ हिंदी में आवाज पहचान</li>
                <li className="text-gray-700">✅ तुरंत जवाब</li>
                <li className="text-gray-700">✅ खेती की विशेषज्ञ सलाह</li>
                <li className="text-gray-700">✅ बोलकर जवाब सुनें</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-500">
            यह सुविधा AI और ML तकनीक का उपयोग करके बनाई गई है। 
            अधिक सटीक जानकारी के लिए स्थानीय कृषि विशेषज्ञ से सलाह लें।
          </p>
        </div>
      </div>
    </div>
  )
}
