'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Send, 
  Mic, 
  MicOff, 
  BookOpen, 
  Bot, 
  User, 
  Loader2, 
  HelpCircle,
  Volume2,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CropAssistantPage() {
  const { language } = useLanguage();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [micError, setMicError] = useState(false);
  
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Localization labels
  const labels = {
    en: {
      title: 'AI Crop Assistant',
      subtitle: 'Ask queries about crop health, diseases, fertilizers, and government schemes',
      placeholder: 'Type your farming question here...',
      welcome: 'Hello! I am your KisanAI Crop Assistant. Ask me any questions about crop diseases, pest controls, fertilizers, or agriculture schemes.',
      suggestTitle: 'Suggested Questions',
      suggestions: [
        'How to prevent Yellow Rust in Wheat?',
        'What is the NPK ratio for Rice crops?',
        'What are the benefits of PM-Kisan scheme?',
        'Best organic fertilizer for Tomatoes?'
      ],
      sourcesUsed: 'Verified Sources',
      matchScore: 'Similarity Match',
      generalAdvice: 'General AI Advice',
      listening: 'Listening to your voice...',
      speakNow: 'Click mic to speak in English/Hindi'
    },
    hi: {
      title: 'AI फसल सहायक',
      subtitle: 'फसलों के स्वास्थ्य, रोग, उर्वरक, और सरकारी योजनाओं के बारे में पूछें',
      placeholder: 'अपना खेती संबंधी प्रश्न यहाँ लिखें...',
      welcome: 'नमस्कार! मैं आपका किसानAI फसल सहायक हूँ। मुझसे फसलों के रोग, कीट नियंत्रण, खाद या सरकारी योजनाओं के बारे में कोई भी प्रश्न पूछें।',
      suggestTitle: 'सुझाए गए प्रश्न',
      suggestions: [
        'गेहूं में पीला रतुआ का इलाज क्या है?',
        'धान के लिए NPK अनुपात क्या होना चाहिए?',
        'पीएम-किसान योजना के क्या लाभ हैं?',
        'टमाटर की फसल में खाद कब डालें?'
      ],
      sourcesUsed: 'सत्यापित स्रोत',
      matchScore: 'समानता मैच',
      generalAdvice: 'सामान्य AI सलाह',
      listening: 'आपकी आवाज़ सुन रहा हूँ...',
      speakNow: 'अंग्रेजी/हिंदी में बोलने के लिए माइक दबाएं'
    }
  };

  const currentLabels = labels[language] || labels.en;

  // Initialize Welcome Message when language changes
  useEffect(() => {
    setMessages([
      {
        id: 'welcome',
        sender: 'bot',
        text: currentLabels.welcome,
        createdAt: new Date(),
        sources: []
      }
    ]);
  }, [language]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Speech Recognition (Web Speech API) Setup
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = language === 'hi' ? 'hi-IN' : 'en-US';

        rec.onstart = () => {
          setIsListening(true);
          setMicError(false);
        };

        rec.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setInputMessage(transcript);
          setIsListening(false);
        };

        rec.onerror = (e) => {
          console.error('Speech recognition error:', e);
          setMicError(true);
          setIsListening(false);
        };

        rec.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = rec;
      }
    }
  }, [language]);

  const handleMicToggle = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please use Google Chrome.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  const handleSend = async (textToSend) => {
    const query = textToSend || inputMessage;
    if (!query.trim()) return;

    // Add user message
    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      createdAt: new Date()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await fetch('/api/crop-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          language: language
        })
      });

      if (!response.ok) throw new Error('API server error');
      const data = await response.json();

      // Add bot message
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: data.answer,
        sources: data.sources || [],
        createdAt: new Date()
      }]);

    } catch (err) {
      console.error('Failed to get RAG response:', err);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: language === 'hi' ? 'क्षमा करें, आपके प्रश्न का उत्तर प्राप्त करने में समस्या आ रही है। कृपया पुनः प्रयास करें।' : 'Sorry, there was an issue processing your request. Please try again.',
        sources: [],
        createdAt: new Date()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    handleSend(suggestion);
  };

  const handleTTS = (text) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      // Cancel previous speaking
      window.speechSynthesis.cancel();
      
      // Clean markdown tags for clear speaking
      const cleanText = text.replace(/[#*`_]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header Panel */}
      <div className="text-center mb-8 bg-emerald-50 dark:bg-emerald-950/20 p-6 rounded-2xl border border-emerald-100 dark:border-emerald-900/30">
        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center mx-auto mb-3">
          <Bot className="h-9 w-9 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-2">
          {currentLabels.title}
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
          {currentLabels.subtitle}
        </p>
      </div>

      {/* Suggested Questions Grid */}
      {messages.length <= 1 && (
        <div className="mb-6">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
            <HelpCircle className="h-4 w-4" />
            {currentLabels.suggestTitle}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentLabels.suggestions.map((sug, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestionClick(sug)}
                className="text-left p-3 text-sm rounded-xl border border-border bg-card hover:bg-emerald-50 dark:hover:bg-emerald-950/20 hover:border-emerald-200 transition-all duration-300 shadow-sm"
              >
                {sug}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Window Panel */}
      <div className="border border-border rounded-2xl bg-card shadow-sm flex flex-col h-[500px]">
        {/* Messages List Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((msg) => {
            const isBot = msg.sender === 'bot';
            return (
              <div key={msg.id} className={`flex items-start gap-2.5 ${!isBot ? 'justify-end' : ''}`}>
                {isBot && (
                  <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                )}
                
                <div className="flex flex-col max-w-[85%] space-y-1">
                  <div className={`p-3.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap
                    ${isBot 
                      ? 'bg-muted text-foreground rounded-tl-none' 
                      : 'bg-emerald-600 text-white rounded-tr-none shadow-sm'}`}
                  >
                    {msg.text}
                    
                    {/* TTS Button for Bot Messages */}
                    {isBot && (
                      <button
                        onClick={() => handleTTS(msg.text)}
                        title="Listen Answer"
                        className="block mt-2.5 p-1 text-xs text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100/40 rounded transition-colors"
                      >
                        <Volume2 className="h-3.5 w-3.5 inline mr-1" />
                        {language === 'hi' ? 'बोलकर सुनें' : 'Listen'}
                      </button>
                    )}
                  </div>

                  {/* Retrieved Citations Section */}
                  {isBot && msg.sources && msg.sources.length > 0 && (
                    <div className="mt-1.5 border border-border rounded-xl bg-background/50 overflow-hidden">
                      <details className="group">
                        <summary className="p-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 cursor-pointer list-none flex items-center justify-between hover:bg-emerald-50/40 dark:hover:bg-emerald-950/10">
                          <span className="flex items-center gap-1">
                            <BookOpen className="h-3.5 w-3.5" />
                            {currentLabels.sourcesUsed} ({msg.sources.length})
                          </span>
                          <span className="text-[10px] text-muted-foreground group-open:rotate-180 transition-transform">▼</span>
                        </summary>
                        <div className="p-3 border-t border-border space-y-2 bg-background">
                          {msg.sources.map((src, sIdx) => (
                            <div key={sIdx} className="text-xs p-2.5 rounded-lg border border-border/60 bg-muted/20">
                              <div className="font-semibold text-foreground mb-1">{src.title}</div>
                              <div className="text-[10px] text-muted-foreground flex justify-between">
                                <span>Category: {src.category}</span>
                                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                  {currentLabels.matchScore}: {(src.similarity * 100).toFixed(0)}%
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </details>
                    </div>
                  )}
                </div>

                {!isBot && (
                  <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center flex-shrink-0">
                    <User className="h-4.5 w-4.5 text-white" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Loading bubble */}
          {loading && (
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center flex-shrink-0">
                <Bot className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="p-4 rounded-2xl bg-muted rounded-tl-none flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs text-muted-foreground">
                  {language === 'hi' ? 'जवाब तैयार कर रहा हूँ...' : 'Preparing answer...'}
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar Area */}
        <div className="p-3.5 border-t border-border bg-background rounded-b-2xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            {/* Voice Recording Button */}
            <Button
              type="button"
              onClick={handleMicToggle}
              variant="outline"
              size="icon"
              title={currentLabels.speakNow}
              className={`rounded-xl flex-shrink-0 ${isListening ? 'bg-red-500 hover:bg-red-600 text-white border-red-500 animate-pulse' : 'hover:bg-emerald-50 dark:hover:bg-emerald-950/20'}`}
            >
              {isListening ? <MicOff className="h-4.5 w-4.5" /> : <Mic className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400" />}
            </Button>

            {/* Input Box */}
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={isListening ? currentLabels.listening : currentLabels.placeholder}
              disabled={isListening}
              className="flex-1 h-10 px-4 rounded-xl text-sm border border-border bg-muted/30 focus:bg-background outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
            />

            {/* Send Button */}
            <Button
              type="submit"
              disabled={!inputMessage.trim() || loading}
              className="h-10 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex-shrink-0 flex items-center gap-1 font-semibold"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>

          {/* Mic warning banner */}
          {micError && (
            <div className="mt-2 flex items-center gap-1.5 text-[10px] text-red-500 font-semibold px-1">
              <AlertCircle className="h-3 w-3" />
              Mic access denied or error. Please check site permissions.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
