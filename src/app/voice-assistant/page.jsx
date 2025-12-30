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
    <div className="min-h-screen bg-background py-4 sm:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {t('voiceAssistantTitle')}
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground">
            {t('voiceAssistantSubtitle')}
          </p>
        </div>

        <Card className="mb-6 sm:mb-8 bg-card border border-border">
          <CardHeader className="text-center">
            <CardTitle className="text-xl sm:text-2xl font-semibold text-foreground">{t('talkToAIAssistant')}</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4 sm:space-y-6">
            <div className={`w-24 sm:w-32 h-24 sm:h-32 rounded-full flex items-center justify-center mx-auto transition-all duration-300 border-2 border-border ${
              isListening ? 'border-destructive bg-destructive/10 dark:bg-destructive/20' : 'border-primary bg-primary/10 dark:bg-primary/20'
            }`}>
              {isListening ? (
                <MicOff className="h-12 sm:h-16 w-12 sm:w-16 text-destructive" />
              ) : (
                <Mic className="h-12 sm:h-16 w-12 sm:w-16 text-primary" />
              )}
            </div>
            
            {transcript && (
              <div className="p-3 sm:p-4 bg-muted rounded-lg">
                <p className="text-foreground">
                  <strong>{t('youSaid')}:</strong> {transcript}
                </p>
              </div>
            )}

            <div className="space-y-4">
              <div className="flex justify-center space-x-2 sm:space-x-4">
                <Button 
                  size="lg" 
                  onClick={handleVoiceToggle}
                  disabled={!speechSupported || isProcessing}
                  className={isListening ? 'bg-destructive hover:bg-destructive/90 dark:bg-destructive dark:hover:bg-destructive/90' : 'bg-primary hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/90'}
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
                  className="border-border text-foreground hover:bg-muted"
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
                  className="flex-1 px-3 sm:px-4 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder:text-muted-foreground disabled:bg-muted bg-card"
                />
                <Button 
                  onClick={handleTextSubmit} 
                  disabled={!textInput.trim() || isProcessing}
                  className="bg-primary hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/90"
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
                    className="text-xs h-auto py-2 border-border text-foreground hover:bg-muted"
                  >
                    {question.length > 30 ? question.substring(0, 30) + '...' : question}
                  </Button>
                ))}
              </div>
              
              {speechError && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center">
                  <AlertCircle className="h-5 w-5 text-destructive mr-2 flex-shrink-0" />
                  <span className="text-destructive">
                    {t('micProblem')}: {speechError === 'not-allowed' ? t('allowMicPermission') : speechError}
                  </span>
                </div>
              )}

              {!speechSupported && (
                <div className="p-3 bg-accent/10 border border-accent/20 rounded-lg">
                  <span className="text-accent">
                    {t('browserNotSupported')}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {conversations.length > 0 && (
          <Card className="mb-6 sm:mb-8 bg-card border border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-foreground">{t('conversationHistory')}</CardTitle>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearConversation} 
                disabled={isProcessing}
                className="border-border text-foreground hover:bg-muted"
              >
                {t('clear')}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-80 sm:max-h-96 overflow-y-auto">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`flex ${conversation.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs sm:max-w-md px-3 sm:px-4 py-2 rounded-lg ${
                        conversation.type === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-foreground'
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
                    <div className="bg-muted text-foreground px-4 py-2 rounded-lg flex items-center">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      <span>{t('preparingAnswer')}</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <Card className="bg-card border border-border">
            <CardHeader>
              <CardTitle className="flex items-center text-foreground">
                <MessageCircle className="mr-2 h-5 w-5" />
                {currentFaqTitle}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {currentQuickQuestions.map((question, index) => (
                  <li 
                    key={index}
                    className="text-muted-foreground cursor-pointer hover:text-primary p-2 rounded hover:bg-muted transition-colors"
                    onClick={() => !isProcessing && handleUserQuery(question)}
                  >
                    "{question}"
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-card border border-border">
            <CardHeader>
              <CardTitle className="flex items-center text-foreground">
                <Volume2 className="mr-2 h-5 w-5" />
                {t('voiceFeatures')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="text-muted-foreground">
                  {speechSupported ? '✅' : '❌'} {t('voiceRecognition')}
                </li>
                <li className="text-muted-foreground">
                  {ttsSupported ? '✅' : '❌'} {t('voiceResponse')}
                </li>
                <li className="text-muted-foreground">✅ {t('instantAIAnswers')}</li>
                <li className="text-muted-foreground">✅ {t('expertFarmingAdvice')}</li>
                <li className="text-muted-foreground">✅ {t('conversationHistory')}</li>
                <li className="text-muted-foreground">✅ {t('textInputOption')}</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 sm:mt-8 text-center">
          <p className="text-muted-foreground">
            {t('aiTechnologyNote')}
          </p>
        </div>
      </div>
    </div>
  )
}