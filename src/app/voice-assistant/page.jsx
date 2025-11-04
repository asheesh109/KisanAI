'use client'

import { useState, useEffect, useCallback } from 'react'
import { Mic, MicOff, Volume2, VolumeX, MessageCircle, Loader2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition'
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis'
import { generateAIResponse, fallbackResponses } from '@/data/farmingKnowledge'
import { useLanguage } from '@/contexts/LanguageContext'

export default function VoiceAssistant() {
  const [conversations, setConversations] = useState([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [textInput, setTextInput] = useState('')
  const [lastQueryTime, setLastQueryTime] = useState(0)
  const { language, t } = useLanguage()

  const getTTSLang = (lang) => {
    const langMap = {
      en: 'en-IN',
      hi: 'hi-IN',
      mr: 'mr-IN',
      gu: 'gu-IN',
      ml: 'ml-IN',
    }
    return langMap[lang] || 'en-IN'
  }

  const ttsLang = getTTSLang(language)

  const {
    isListening,
    transcript,
    error: speechError,
    isSupported: speechSupported,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition({
    lang: ttsLang,
    continuous: false,
    interimResults: true,
  })

  const {
    speaking: isSpeaking,
    isSupported: ttsSupported,
    speak,
    cancel: stopSpeaking,
  } = useSpeechSynthesis({
    lang: ttsLang,
    rate: 0.8,
    pitch: 1,
  })

  const handleUserQuery = useCallback(async (query) => {
    const now = Date.now();
    if (now - lastQueryTime < 2000) {
      return;
    }
    setLastQueryTime(now);

    if (!query.trim()) return

    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      text: query,
      timestamp: new Date(),
    }

    setConversations(prev => [...prev, userMessage])
    setIsProcessing(true)

    try {
      const response = await generateAIResponse(query, language)
      
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        text: response,
        timestamp: new Date(),
      }

      setConversations(prev => [...prev, aiMessage])
      setIsProcessing(false)

      if (ttsSupported) {
        speak(response)
      }
    } catch (error) {
      console.error('Error generating response:', error)
      setIsProcessing(false)
      const errorMessage = {
        id: (Date.now() + 2).toString(),
        type: 'ai',
        text: fallbackResponses[language] || fallbackResponses['en'],
        timestamp: new Date(),
      }
      setConversations(prev => [...prev, errorMessage])
    }
  }, [ttsSupported, speak, lastQueryTime, language])

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

  // Multilingual quick questions
  const quickQuestions = {
    en: [
      "My wheat crop has yellow leaves",
      "Which crop should be sown this season",
      "When to apply fertilizer",
      "How to do organic farming"
    ],
    hi: [
      "मेरी गेहूं की फसल में पीले पत्ते हो रहे हैं",
      "इस मौसम में कौन सी फसल बोनी चाहिए",
      "खाद कब डालनी चाहिए",
      "जैविक खेती कैसे करें"
    ],
    mr: [
      "माझ्या गहूच्या पिकात पिवळी पाने येत आहेत",
      "या हंगामात कोणते पीक पेरावे",
      "खत कधी टाकावे",
      "सेंद्रिय शेती कशी करावी"
    ],
    gu: [
      "મારા ઘઉંના પાકમાં પીળા પાંદડા આવી રહ્યા છે",
      "આ મોસમમાં કયું પાક વાવવું",
      "ખાતર ક્યારે મૂકવું",
      "જૈવિક ખેતી કેવી રીતે કરવી"
    ],
    ml: [
      "എന്റെ ഗോതമ്പ് നാറ്റിൽ പച്ച ഇലകൾ വരുന്നു",
      "ഈ സീസണിൽ ഏത് വിള വിതയ്ക്കണം",
      "ഉരവിട്ട് എപ്പോൾ വയ്ക്കണം",
      "ജൈവ കൃഷി എങ്ങനെ"
    ]
  };

  const currentQuickQuestions = quickQuestions[language] || quickQuestions.en;

  // Multilingual FAQ title
  const faqTitle = {
    en: 'Frequently Asked Questions',
    hi: 'अक्सर पूछे जाने वाले प्रश्न',
    mr: 'वारंवार विचारले जाणारे प्रश्न',
    gu: 'ઘણી વખત પૂછવામાં આવતા પ્રશ્નો',
    ml: 'പതിവായി ചോദിക്കപ്പെടുന്ന ചോദ്യങ്ങൾ'
  };

  const currentFaqTitle = faqTitle[language] || faqTitle.en;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-slate-900 dark:to-slate-800 py-8">
      <div className="max-w-4xl mx-auto px-6 sm:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            {t('voiceAssistantTitle')}
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300">
            {t('voiceAssistantSubtitle')}
          </p>
        </div>

        <Card className="mb-8 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{t('talkToAIAssistant')}</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className={`w-32 h-32 rounded-full flex items-center justify-center mx-auto transition-all duration-300 ${
              isListening ? 'bg-red-100 dark:bg-red-900/30 animate-pulse' : 'bg-blue-100 dark:bg-blue-900/30'
            }`}>
              {isListening ? (
                <MicOff className="h-16 w-16 text-red-600 dark:text-red-400" />
              ) : (
                <Mic className="h-16 w-16 text-blue-600 dark:text-blue-400" />
              )}
            </div>
            
            {transcript && (
              <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <p className="text-slate-700 dark:text-slate-200">
                  <strong>{t('youSaid')}:</strong> {transcript}
                </p>
              </div>
            )}

            <div className="space-y-4">
              <div className="flex justify-center space-x-4">
                <Button 
                  size="lg" 
                  onClick={handleVoiceToggle}
                  disabled={!speechSupported || isProcessing}
                  className={isListening ? 'bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600' : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600'}
                >
                  {isListening ? (
                    <>
                      <MicOff className="mr-2 h-5 w-5" />
                      {t('stopSpeaking')}
                    </>
                  ) : (
                    <>
                      <Mic className="mr-2 h-5 w-5" />
                      {t('speakNow')}
                    </>
                  )}
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={isSpeaking ? stopSpeaking : () => {}}
                  disabled={!ttsSupported}
                  className="border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  {isSpeaking ? (
                    <>
                      <VolumeX className="mr-2 h-4 w-4" />
                      {t('mute')}
                    </>
                  ) : (
                    <>
                      <Volume2 className="mr-2 h-4 w-4" />
                      {t('turnOnVoice')}
                    </>
                  )}
                </Button>
              </div>

              <div className="flex space-x-2">
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleTextSubmit()}
                  placeholder={t('typeYourQuestion')}
                  disabled={isProcessing}
                  className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 disabled:bg-slate-100 dark:disabled:bg-slate-700 bg-white dark:bg-slate-700"
                />
                <Button 
                  onClick={handleTextSubmit} 
                  disabled={!textInput.trim() || isProcessing}
                  className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
                >
                  {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : t('send')}
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {currentQuickQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleUserQuery(question)}
                    disabled={isProcessing}
                    className="text-xs h-auto py-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    {question.length > 30 ? question.substring(0, 30) + '...' : question}
                  </Button>
                ))}
              </div>
              
              {speechError && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
                  <span className="text-red-700 dark:text-red-300">
                    {t('micProblem')}: {speechError === 'not-allowed' ? t('allowMicPermission') : speechError}
                  </span>
                </div>
              )}

              {!speechSupported && (
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <span className="text-yellow-700 dark:text-yellow-300">
                    {t('browserNotSupported')}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {conversations.length > 0 && (
          <Card className="mb-8 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-slate-900 dark:text-slate-100">{t('conversationHistory')}</CardTitle>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearConversation} 
                disabled={isProcessing}
                className="border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                {t('clear')}
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
                          ? 'bg-blue-600 dark:bg-blue-700 text-white'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{conversation.text}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {conversation.timestamp.toLocaleTimeString(ttsLang)}
                      </p>
                    </div>
                  </div>
                ))}
                
                {isProcessing && (
                  <div className="flex justify-start">
                    <div className="bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100 px-4 py-2 rounded-lg flex items-center">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      <span>{t('preparingAnswer')}</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center text-slate-900 dark:text-slate-100">
                <MessageCircle className="mr-2 h-5 w-5" />
                {currentFaqTitle}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {currentQuickQuestions.map((question, index) => (
                  <li 
                    key={index}
                    className="text-slate-700 dark:text-slate-300 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 p-2 rounded hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors"
                    onClick={() => !isProcessing && handleUserQuery(question)}
                  >
                    "{question}"
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center text-slate-900 dark:text-slate-100">
                <Volume2 className="mr-2 h-5 w-5" />
                {t('voiceFeatures')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="text-slate-700 dark:text-slate-300">
                  {speechSupported ? '✅' : '❌'} {t('voiceRecognition')}
                </li>
                <li className="text-slate-700 dark:text-slate-300">
                  {ttsSupported ? '✅' : '❌'} {t('voiceResponse')}
                </li>
                <li className="text-slate-700 dark:text-slate-300">✅ {t('instantAIAnswers')}</li>
                <li className="text-slate-700 dark:text-slate-300">✅ {t('expertFarmingAdvice')}</li>
                <li className="text-slate-700 dark:text-slate-300">✅ {t('conversationHistory')}</li>
                <li className="text-slate-700 dark:text-slate-300">✅ {t('textInputOption')}</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <p className="text-slate-700 dark:text-slate-300">
            {t('aiTechnologyNote')}
          </p>
        </div>
      </div>
    </div>
  )
}