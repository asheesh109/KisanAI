'use client'

import { useState, useEffect, useCallback } from 'react'
import { Mic, MicOff, Volume2, VolumeX, MessageCircle, Loader2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition'
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis'
import { generateAIResponse } from '@/data/farmingKnowledge'

interface Conversation {
  id: string
  type: 'user' | 'ai'
  text: string
  timestamp: Date
}

export default function VoiceAssistant() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [textInput, setTextInput] = useState('')

  const {
    isListening,
    transcript,
    error: speechError,
    isSupported: speechSupported,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition({
    lang: 'hi-IN',
    continuous: false,
    interimResults: true,
  })

  const {
    speaking: isSpeaking,
    isSupported: ttsSupported,
    speak,
    cancel: stopSpeaking,
  } = useSpeechSynthesis({
    lang: 'hi-IN',
    rate: 0.8,
    pitch: 1,
  })

  const handleUserQuery = useCallback(async (query: string) => {
    if (!query.trim()) return

    const userMessage: Conversation = {
      id: Date.now().toString(),
      type: 'user',
      text: query,
      timestamp: new Date(),
    }

    setConversations(prev => [...prev, userMessage])
    setIsProcessing(true)

    // Simulate processing delay for realistic experience
    setTimeout(() => {
      const aiResponse = generateAIResponse(query)
      
      const aiMessage: Conversation = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        text: aiResponse,
        timestamp: new Date(),
      }

      setConversations(prev => [...prev, aiMessage])
      setIsProcessing(false)

      // Speak the response
      if (ttsSupported) {
        speak(aiResponse)
      }
    }, 1500)
  }, [ttsSupported, speak])

  // Process transcript when speech recognition completes
  useEffect(() => {
    if (transcript && !isListening && transcript.trim().length > 0) {
      handleUserQuery(transcript)
      resetTranscript()
    }
  }, [transcript, isListening, resetTranscript, handleUserQuery])

  const handleTextSubmit = () => {
    if (textInput.trim()) {
      handleUserQuery(textInput)
      setTextInput('')
    }
  }

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  const clearConversation = () => {
    setConversations([])
    stopSpeaking()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-8">
      <div className="max-w-4xl mx-auto px-6 sm:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold !text-gray-900 mb-4">
            आवाज सहायक
          </h1>
          <p className="text-xl text-gray-600">
            हिंदी में अपने खेती संबंधी सवाल पूछें और तुरंत जवाब पाएं
          </p>
        </div>

        {/* Voice Control Interface */}
        <Card className="mb-8">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-semibold !text-gray-900">AI सहायक से बात करें</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            {/* Voice Recognition Status */}
            <div className={`w-32 h-32 rounded-full flex items-center justify-center mx-auto transition-all duration-300 ${
              isListening ? 'bg-red-100 animate-pulse' : 'bg-blue-100'
            }`}>
              {isListening ? (
                <MicOff className="h-16 w-16 text-red-600" />
              ) : (
                <Mic className="h-16 w-16 text-blue-600" />
              )}
            </div>
            
            {/* Current Transcript */}
            {transcript && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700">
                  <strong>आप कह रहे हैं:</strong> {transcript}
                </p>
              </div>
            )}

            {/* Control Buttons */}
            <div className="space-y-4">
              <div className="flex justify-center space-x-4">
                <Button 
                  size="lg" 
                  onClick={handleVoiceToggle}
                  disabled={!speechSupported}
                  className={isListening ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}
                >
                  {isListening ? (
                    <>
                      <MicOff className="mr-2 h-5 w-5" />
                      रोकें
                    </>
                  ) : (
                    <>
                      <Mic className="mr-2 h-5 w-5" />
                      बोलना शुरू करें
                    </>
                  )}
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={isSpeaking ? stopSpeaking : () => {}}
                  disabled={!ttsSupported}
                >
                  {isSpeaking ? (
                    <>
                      <VolumeX className="mr-2 h-4 w-4" />
                      चुप करें
                    </>
                  ) : (
                    <>
                      <Volume2 className="mr-2 h-4 w-4" />
                      आवाज चालू
                    </>
                  )}
                </Button>
              </div>

              {/* Text Input Alternative */}
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleTextSubmit()}
                  placeholder="या यहाँ टाइप करें..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent !text-slate-900 placeholder-gray-500"
                />
                <Button onClick={handleTextSubmit} disabled={!textInput.trim()}>
                  भेजें
                </Button>
              </div>
              
              {/* Error Display */}
              {speechError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                  <span className="text-red-700">
                    माइक की समस्या: {speechError === 'not-allowed' ? 'माइक की अनुमति दें' : speechError}
                  </span>
                </div>
              )}

              {!speechSupported && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <span className="text-yellow-700">
                    आपका ब्राउज़र आवाज पहचान का समर्थन नहीं करता। कृपया टेक्स्ट बॉक्स का उपयोग करें।
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Conversation History */}
        {conversations.length > 0 && (
          <Card className="mb-8">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="!text-gray-900">बातचीत का इतिहास</CardTitle>
              <Button variant="outline" size="sm" onClick={clearConversation}>
                साफ़ करें
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`flex ${conversation.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        conversation.type === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{conversation.text}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {conversation.timestamp.toLocaleTimeString('hi-IN')}
                      </p>
                    </div>
                  </div>
                ))}
                
                {isProcessing && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg flex items-center">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      <span>जवाब तैयार कर रहा हूं...</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center !text-gray-900">
                <MessageCircle className="mr-2 h-5 w-5" />
                आम सवाल
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="text-gray-700 cursor-pointer hover:text-blue-600" 
                    onClick={() => handleUserQuery("मेरी गेहूं की फसल में पीले पत्ते हो रहे हैं")}>
                  &quot;मेरी गेहूं की फसल में पीले पत्ते हो रहे हैं&quot;
                </li>
                <li className="text-gray-700 cursor-pointer hover:text-blue-600"
                    onClick={() => handleUserQuery("इस मौसम में कौन सी फसल बोनी चाहिए")}>
                  &quot;इस मौसम में कौन सी फसल बोनी चाहिए?&quot;
                </li>
                <li className="text-gray-700 cursor-pointer hover:text-blue-600"
                    onClick={() => handleUserQuery("खाद कब डालना चाहिए")}>
                  &quot;खाद कब डालना चाहिए?&quot;
                </li>
                <li className="text-gray-700 cursor-pointer hover:text-blue-600"
                    onClick={() => handleUserQuery("जैविक खेती कैसे करें")}>
                  &quot;जैविक खेती कैसे करें?&quot;
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center !text-gray-900">
                <Volume2 className="mr-2 h-5 w-5" />
                सुविधाएं
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="text-gray-700">
                  {speechSupported ? '✅' : '❌'} हिंदी में आवाज पहचान
                </li>
                <li className="text-gray-700">
                  {ttsSupported ? '✅' : '❌'} बोलकर जवाब सुनें
                </li>
                <li className="text-gray-700">✅ तुरंत AI जवाब</li>
                <li className="text-gray-700">✅ खेती की विशेषज्ञ सलाह</li>
                <li className="text-gray-700">✅ बातचीत का इतिहास</li>
                <li className="text-gray-700">✅ टेक्स्ट इनपुट विकल्प</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-700">
            यह सुविधा AI और ML तकनीक का उपयोग करके बनाई गई है। 
            अधिक सटीक जानकारी के लिए स्थानीय कृषि विशेषज्ञ से सलाह लें।
          </p>
        </div>
      </div>
    </div>
  )
}
