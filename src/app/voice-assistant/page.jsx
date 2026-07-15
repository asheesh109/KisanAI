'use client'

import { useState, useEffect, useCallback } from 'react'
import { Mic, MicOff, Volume2, VolumeX, MessageCircle, Loader2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition'
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis'
import { generateAIResponse, fallbackResponses } from '@/data/farmingKnowledge'
import { useLanguage } from '@/contexts/LanguageContext'
import { useNetwork } from '@/contexts/NetworkContext'
import { saveConversations, getConversations, saveOfflineAction, getOfflineQueue, removeOfflineAction } from '@/lib/idb'

export default function VoiceAssistant() {
  const [conversations, setConversations] = useState([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [textInput, setTextInput] = useState('')
  const [lastQueryTime, setLastQueryTime] = useState(0)
  const { language, t } = useLanguage()
  const { isOnline } = useNetwork()

  // Load conversations from IndexedDB on mount
  useEffect(() => {
    const loadConversations = async () => {
      const saved = await getConversations();
      if (saved && saved.length > 0) {
        // IDB might not restore Date objects perfectly depending on version, so just ensure they are Date objects
        const parsed = saved.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setConversations(parsed);
      }
    };
    loadConversations();
  }, []);

  // Save conversations to IndexedDB whenever they change
  useEffect(() => {
    if (conversations.length > 0) {
      saveConversations(conversations);
    }
  }, [conversations]);

  const processOfflineQueue = useCallback(async () => {
    const queue = await getOfflineQueue();
    if (queue.length === 0) return;

    for (const action of queue) {
      try {
        const response = await generateAIResponse(action.query, action.language);
        setConversations(prev => prev.map(msg => {
          if (msg.id === action.id && msg.isPending) {
            return { ...msg, text: response, isPending: false, timestamp: new Date() };
          }
          return msg;
        }));
        await removeOfflineAction(action.id);
      } catch (error) {
        console.error('Error processing offline queue:', error);
      }
    }
  }, []);

  // Process offline queue when back online
  useEffect(() => {
    if (isOnline) {
      processOfflineQueue();
    }
  }, [isOnline, processOfflineQueue]);

  const getOfflinePendingMsg = (lang) => {
    const msgs = {
      en: "You are offline. Your query has been saved and will be processed when you are online.",
      hi: "आप ऑफ़लाइन हैं। आपका प्रश्न सहेज लिया गया है और ऑनलाइन होने पर इसे संसाधित किया जाएगा।",
      mr: "तुम्ही ऑफलाइन आहात. तुमचा प्रश्न सेव्ह केला आहे आणि ऑनलाइन झाल्यावर त्यावर प्रक्रिया केली जाईल.",
      gu: "તમે ઑફલાઇન છો. તમારો પ્રશ્ન સાચવવામાં આવ્યો છે અને જ્યારે તમે ઑનલાઇન હશો ત્યારે તેના પર પ્રક્રિયા કરવામાં આવશે.",
      ml: "നിങ്ങൾ ഓഫ്‌ലൈനിലാണ്. നിങ്ങളുടെ ചോദ്യം സംരക്ഷിച്ചു, നിങ്ങൾ ഓൺലൈനിലായിരിക്കുമ്പോൾ പ്രോസസ്സ് ചെയ്യും."
    };
    return msgs[lang] || msgs.en;
  };

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

    if (!isOnline) {
      const offlineId = (Date.now() + 1).toString();
      const pendingMessage = {
        id: offlineId,
        type: 'ai',
        text: getOfflinePendingMsg(language),
        timestamp: new Date(),
        isPending: true,
      };
      setConversations(prev => [...prev, pendingMessage]);
      saveOfflineAction({ id: offlineId, query, language });
      return;
    }

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
  }, [ttsSupported, speak, lastQueryTime, language, isOnline])

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
    saveConversations([])
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
                <p className="text-foreground text-sm sm:text-base break-words">
                  <strong>{t('youSaid')}:</strong> {transcript}
                </p>
              </div>
            )}

            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                <Button 
                  size="lg" 
                  onClick={handleVoiceToggle}
                  disabled={!speechSupported || isProcessing}
                  className={`w-full sm:w-auto min-h-[44px] text-sm sm:text-base px-4 sm:px-6 whitespace-normal ${isListening ? 'bg-destructive hover:bg-destructive/90 dark:bg-destructive dark:hover:bg-destructive/90' : 'bg-primary hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/90'}`}
                >
                  {isListening ? (
                    <>
                      <MicOff className="mr-2 h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                      <span className="line-clamp-2">{t('stopSpeaking')}</span>
                    </>
                  ) : (
                    <>
                      <Mic className="mr-2 h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                      <span className="line-clamp-2">{t('speakNow')}</span>
                    </>
                  )}
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={isSpeaking ? stopSpeaking : () => {}}
                  disabled={!ttsSupported}
                  className="w-full sm:w-auto min-h-[44px] text-sm sm:text-base px-4 sm:px-6 border-border text-foreground hover:bg-muted whitespace-normal"
                >
                  {isSpeaking ? (
                    <>
                      <VolumeX className="mr-2 h-4 w-4 flex-shrink-0" />
                      <span className="line-clamp-2">{t('mute')}</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="mr-2 h-4 w-4 flex-shrink-0" />
                      <span className="line-clamp-2">{t('turnOnVoice')}</span>
                    </>
                  )}
                </Button>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleTextSubmit()}
                  placeholder={t('typeYourQuestion')}
                  disabled={isProcessing}
                  className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder:text-muted-foreground disabled:bg-muted bg-card text-sm sm:text-base"
                />
                <Button 
                  onClick={handleTextSubmit} 
                  disabled={!textInput.trim() || isProcessing}
                  className="w-full sm:w-auto bg-primary hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/90 min-h-[44px]"
                >
                  {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : t('send')}
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                {currentQuickQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleUserQuery(question)}
                    disabled={isProcessing}
                    className="text-xs sm:text-sm h-auto min-h-[44px] py-2 sm:py-3 px-3 border-border text-foreground hover:bg-muted whitespace-normal text-left leading-tight"
                  >
                    <span className="line-clamp-3 w-full">
                      {question}
                    </span>
                  </Button>
                ))}
              </div>
              
              {speechError && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start">
                  <AlertCircle className="h-5 w-5 text-destructive mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-destructive text-sm">
                    {t('micProblem')}: {speechError === 'not-allowed' ? t('allowMicPermission') : speechError}
                  </span>
                </div>
              )}

              {!speechSupported && (
                <div className="p-3 bg-accent/10 border border-accent/20 rounded-lg">
                  <span className="text-accent text-sm">
                    {t('browserNotSupported')}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {conversations.length > 0 && (
          <Card className="mb-6 sm:mb-8 bg-card border border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-base sm:text-lg text-foreground">{t('conversationHistory')}</CardTitle>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearConversation} 
                disabled={isProcessing}
                className="border-border text-foreground hover:bg-muted text-xs sm:text-sm"
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
                      className={`max-w-[85%] sm:max-w-xs md:max-w-md px-3 sm:px-4 py-2 rounded-lg ${
                        conversation.type === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-foreground'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap break-words">
                        {conversation.isPending && <Loader2 className="inline h-3 w-3 animate-spin mr-1" />}
                        {conversation.text}
                      </p>
                      <p className="text-xs opacity-70 mt-1">
                        {conversation.timestamp instanceof Date ? conversation.timestamp.toLocaleTimeString(ttsLang) : new Date(conversation.timestamp).toLocaleTimeString(ttsLang)}
                      </p>
                    </div>
                  </div>
                ))}
                
                {isProcessing && (
                  <div className="flex justify-start">
                    <div className="bg-muted text-foreground px-4 py-2 rounded-lg flex items-center">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      <span className="text-sm">{t('preparingAnswer')}</span>
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
              <CardTitle className="flex items-center text-foreground text-base sm:text-lg">
                <MessageCircle className="mr-2 h-5 w-5 flex-shrink-0" />
                <span className="line-clamp-2">{currentFaqTitle}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {currentQuickQuestions.map((question, index) => (
                  <li 
                    key={index}
                    className="text-muted-foreground text-sm cursor-pointer hover:text-primary p-2 rounded hover:bg-muted transition-colors break-words"
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
              <CardTitle className="flex items-center text-foreground text-base sm:text-lg">
                <Volume2 className="mr-2 h-5 w-5 flex-shrink-0" />
                <span className="line-clamp-2">{t('voiceFeatures')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
               
                <li className="text-muted-foreground text-sm break-words">
                  {ttsSupported ? '✅' : '❌'} {t('voiceResponse')}
                </li>
                <li className="text-muted-foreground text-sm break-words">✅ {t('instantAIAnswers')}</li>
                <li className="text-muted-foreground text-sm break-words">✅ {t('expertFarmingAdvice')}</li>
                <li className="text-muted-foreground text-sm break-words">✅ {t('conversationHistory')}</li>
                <li className="text-muted-foreground text-sm break-words">✅ {t('textInputOption')}</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 sm:mt-8 text-center">
          <p className="text-muted-foreground text-sm sm:text-base break-words px-4">
            {t('aiTechnologyNote')}
          </p>
        </div>
      </div>
    </div>
  )
}