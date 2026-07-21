'use client'
import React, { useEffect, useState } from 'react'
import { AlertTriangle, RefreshCw, Send, Home } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

// Simple translation object in case context language isn't fully loaded or fails
const fallbackTranslations = {
  en: {
    errorTitle: 'Something went wrong!',
    errorMessage: 'An unexpected error occurred while loading this section of the application.',
    retry: 'Try again',
    goHome: 'Go to Homepage',
    reportIssue: 'Report this issue',
    reporting: 'Reporting...',
    reported: 'Thank you for reporting! We will look into it.',
    errorLabel: 'Error details:',
  },
  hi: {
    errorTitle: 'कुछ गलत हो गया!',
    errorMessage: 'एप्लिकेशन के इस भाग को लोड करते समय एक अप्रत्याशित त्रुटि हुई।',
    retry: 'पुनः प्रयास करें',
    goHome: 'मुख्य पृष्ठ पर जाएं',
    reportIssue: 'इस समस्या की रिपोर्ट करें',
    reporting: 'रिपोर्ट की जा रही है...',
    reported: 'रिपोर्ट करने के लिए धन्यवाद! हम इसकी जांच करेंगे।',
    errorLabel: 'त्रुटि विवरण:',
  }
}

export default function ErrorBoundaryFallback({ error, reset }) {
  const { language } = useLanguage()
  const [reported, setReported] = useState(false)
  const [reporting, setReporting] = useState(false)

  const t = fallbackTranslations[language] || fallbackTranslations.en

  useEffect(() => {
    // Log the error to console or error service
    console.error('Captured by Error Boundary:', error)
  }, [error])

  const handleReport = async () => {
    setReporting(true)
    // Simulate error reporting delay
    await new Promise(resolve => setTimeout(resolve, 800))
    setReporting(false)
    setReported(true)
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card rounded-2xl shadow-xl border border-destructive/20 p-6 sm:p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-destructive/10 rounded-full mb-6">
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-3">
          {t.errorTitle}
        </h2>
        <p className="text-muted-foreground mb-6 text-sm sm:text-base leading-relaxed">
          {t.errorMessage}
        </p>

        {error && (
          <div className="mb-6 p-3 bg-muted/80 rounded-xl text-left border border-border">
            <span className="text-xs font-semibold text-muted-foreground block mb-1">
              {t.errorLabel}
            </span>
            <p className="text-xs font-mono text-destructive break-all line-clamp-3">
              {error.message || String(error)}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all font-medium text-sm cursor-pointer"
          >
            <RefreshCw className="h-4 w-4" />
            {t.retry}
          </button>
          
          <button
            onClick={handleReport}
            disabled={reporting || reported}
            className={`flex items-center justify-center gap-2 px-5 py-3 border border-border rounded-xl transition-all font-medium text-sm cursor-pointer ${
              reported
                ? 'bg-green-500/10 text-green-600 border-green-500/20 cursor-default'
                : 'bg-card text-foreground hover:bg-muted'
            }`}
          >
            <Send className="h-4 w-4" />
            {reporting ? t.reporting : reported ? t.reported : t.reportIssue}
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-border">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-sm text-primary hover:underline font-medium"
          >
            <Home className="h-4 w-4" />
            {t.goHome}
          </a>
        </div>
      </div>
    </div>
  )
}
