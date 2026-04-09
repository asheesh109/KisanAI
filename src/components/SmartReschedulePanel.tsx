'use client';

import React, { useState } from 'react';
import {
  AlertTriangle,
  CloudRain,
  Loader2,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  Zap,
  Info,
  Calendar,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import type { CalendarEvent } from './ProfessionalCalendar';
import type { RescheduleResponse, RescheduledEvent } from '@/app/api/calendar/events/reschedule/route';

// ─── Types ────────────────────────────────────────────────────────────────────

type Language = 'en' | 'hi' | 'mr' | 'gu' | 'ml';

interface SmartReschedulePanelProps {
  events: CalendarEvent[];
  language: Language;
  weatherAlert?: string | null;
  onConfirmReschedule: (rescheduled: RescheduledEvent[]) => Promise<void>;
  onDismiss: () => void;
  autoOpenWithWeather?: boolean;
}

// ─── Translations ─────────────────────────────────────────────────────────────

type TKey =
  | 'disasterTitle' | 'disasterSubtitle' | 'weatherAlertTitle' | 'weatherAlertSubtitle'
  | 'inputPlaceholder' | 'analyzeBtn' | 'analyzing' | 'aiSummary' | 'generalAdvice'
  | 'affectedEvents' | 'newSchedule' | 'reason' | 'advice' | 'confirmReschedule'
  | 'keepOriginal' | 'rescheduling' | 'successMsg' | 'urgency_low' | 'urgency_medium'
  | 'urgency_high' | 'urgency_critical' | 'noChanges' | 'errorMsg' | 'weatherWarning'
  | 'weatherAllowQ' | 'allowBtn' | 'denyBtn' | 'eventsMoved' | 'reportDisaster';

const T: Record<Language, Record<TKey, string>> = {
  en: {
    disasterTitle: 'Report Disaster / Emergency',
    disasterSubtitle: 'Describe what happened and AI will reschedule your farming calendar',
    weatherAlertTitle: 'Weather Alert Detected',
    weatherAlertSubtitle: 'Our weather system predicts conditions that may affect your schedule',
    inputPlaceholder: 'e.g. Heavy flood came in our region, all fields are waterlogged...',
    analyzeBtn: 'Analyze & Suggest Reschedule',
    analyzing: 'AI is analyzing your situation...',
    aiSummary: 'AI Assessment',
    generalAdvice: 'General Advice',
    affectedEvents: 'Affected Events',
    newSchedule: 'New Schedule',
    reason: 'Why rescheduled',
    advice: 'What to do',
    confirmReschedule: 'Apply Rescheduling',
    keepOriginal: 'Keep Original Schedule',
    rescheduling: 'Applying changes...',
    successMsg: 'Calendar rescheduled successfully!',
    urgency_low: 'Low Impact',
    urgency_medium: 'Moderate Impact',
    urgency_high: 'High Impact',
    urgency_critical: 'Critical Emergency',
    noChanges: 'No events need rescheduling for this situation.',
    errorMsg: 'Failed to analyze. Please try again.',
    weatherWarning: 'Weather Prediction Warning',
    weatherAllowQ: 'Allow AI to reschedule based on this weather prediction?',
    allowBtn: 'Yes, Reschedule',
    denyBtn: 'No, Keep My Schedule',
    eventsMoved: 'events will be rescheduled',
    reportDisaster: 'Report Emergency',
  },
  hi: {
    disasterTitle: 'आपदा / आपातकाल रिपोर्ट करें',
    disasterSubtitle: 'क्या हुआ बताएं, AI आपका कृषि कैलेंडर पुनर्निर्धारित करेगा',
    weatherAlertTitle: 'मौसम अलर्ट मिला',
    weatherAlertSubtitle: 'मौसम प्रणाली ने ऐसी स्थिति की भविष्यवाणी की है जो आपके शेड्यूल को प्रभावित कर सकती है',
    inputPlaceholder: 'जैसे: हमारे क्षेत्र में भारी बाढ़ आई, सभी खेत जलमग्न हैं...',
    analyzeBtn: 'विश्लेषण करें और पुनर्निर्धारण सुझाएं',
    analyzing: 'AI आपकी स्थिति का विश्लेषण कर रही है...',
    aiSummary: 'AI मूल्यांकन',
    generalAdvice: 'सामान्य सलाह',
    affectedEvents: 'प्रभावित कार्यक्रम',
    newSchedule: 'नया शेड्यूल',
    reason: 'पुनर्निर्धारण का कारण',
    advice: 'क्या करें',
    confirmReschedule: 'पुनर्निर्धारण लागू करें',
    keepOriginal: 'मूल शेड्यूल रखें',
    rescheduling: 'बदलाव लागू हो रहे हैं...',
    successMsg: 'कैलेंडर सफलतापूर्वक पुनर्निर्धारित हुआ!',
    urgency_low: 'कम प्रभाव',
    urgency_medium: 'मध्यम प्रभाव',
    urgency_high: 'उच्च प्रभाव',
    urgency_critical: 'गंभीर आपातकाल',
    noChanges: 'इस स्थिति के लिए किसी कार्यक्रम को पुनर्निर्धारित करने की आवश्यकता नहीं है।',
    errorMsg: 'विश्लेषण विफल। कृपया पुनः प्रयास करें।',
    weatherWarning: 'मौसम पूर्वानुमान चेतावनी',
    weatherAllowQ: 'क्या इस मौसम पूर्वानुमान के आधार पर AI को पुनर्निर्धारण करने दें?',
    allowBtn: 'हाँ, पुनर्निर्धारित करें',
    denyBtn: 'नहीं, मेरा शेड्यूल रखें',
    eventsMoved: 'कार्यक्रम पुनर्निर्धारित होंगे',
    reportDisaster: 'आपातकाल रिपोर्ट करें',
  },
  mr: {
    disasterTitle: 'आपत्ती / आणीबाणी नोंदवा',
    disasterSubtitle: 'काय झाले ते सांगा, AI तुमचे कृषी वेळापत्रक पुनर्निर्धारित करेल',
    weatherAlertTitle: 'हवामान सूचना मिळाली',
    weatherAlertSubtitle: 'हवामान प्रणालीने असे अंदाज केले आहेत जे तुमच्या वेळापत्रकावर परिणाम करू शकतात',
    inputPlaceholder: 'उदा: आमच्या भागात मोठा पूर आला, सर्व शेते पाण्याखाली आहेत...',
    analyzeBtn: 'विश्लेषण करा आणि पुनर्निर्धारण सुचवा',
    analyzing: 'AI तुमची परिस्थिती विश्लेषित करत आहे...',
    aiSummary: 'AI मूल्यांकन',
    generalAdvice: 'सामान्य सल्ला',
    affectedEvents: 'प्रभावित कार्यक्रम',
    newSchedule: 'नवीन वेळापत्रक',
    reason: 'पुनर्निर्धारणाचे कारण',
    advice: 'काय करावे',
    confirmReschedule: 'पुनर्निर्धारण लागू करा',
    keepOriginal: 'मूळ वेळापत्रक ठेवा',
    rescheduling: 'बदल लागू होत आहेत...',
    successMsg: 'कॅलेंडर यशस्वीरित्या पुनर्निर्धारित झाले!',
    urgency_low: 'कमी परिणाम',
    urgency_medium: 'मध्यम परिणाम',
    urgency_high: 'उच्च परिणाम',
    urgency_critical: 'गंभीर आणीबाणी',
    noChanges: 'या परिस्थितीसाठी कोणत्याही कार्यक्रमाला पुनर्निर्धारित करण्याची गरज नाही.',
    errorMsg: 'विश्लेषण अयशस्वी. कृपया पुन्हा प्रयत्न करा.',
    weatherWarning: 'हवामान अंदाज इशारा',
    weatherAllowQ: 'या हवामान अंदाजाच्या आधारे AI ला पुनर्निर्धारण करू द्यायचे का?',
    allowBtn: 'होय, पुनर्निर्धारित करा',
    denyBtn: 'नाही, माझे वेळापत्रक ठेवा',
    eventsMoved: 'कार्यक्रम पुनर्निर्धारित होतील',
    reportDisaster: 'आणीबाणी नोंदवा',
  },
  gu: {
    disasterTitle: 'આપત્તિ / કટોકટી નોંધો',
    disasterSubtitle: 'શું થયું તે જણાવો, AI તમારી ખેતી સૂચિ ફરીથી નક્કી કરશે',
    weatherAlertTitle: 'હવામાન ચેતવણી મળી',
    weatherAlertSubtitle: 'હવામાન પ્રણાલીએ એવી પ્રેડિક્શન કરી છે જે તમારી સૂચિ પ્રભાવિત કરી શકે',
    inputPlaceholder: 'દા.ત. અમારા વિસ્તારમાં ભારે પૂર આવ્યો, બધા ખેતરો જળમગ્ન છે...',
    analyzeBtn: 'વિશ્લેષણ કરો અને પુનઃ-સૂચિ સૂચવો',
    analyzing: 'AI તમારી સ્થિતિ વિશ્લેષિત કરી રહ્યો છે...',
    aiSummary: 'AI મૂલ્યાંકન',
    generalAdvice: 'સામાન્ય સલાહ',
    affectedEvents: 'પ્રભાવિત ઇવેન્ટ',
    newSchedule: 'નવી સૂચિ',
    reason: 'ફેરફારનું કારણ',
    advice: 'શું કરવું',
    confirmReschedule: 'ફેરફાર લાગુ કરો',
    keepOriginal: 'મૂળ સૂચિ રાખો',
    rescheduling: 'ફેરફાર લાગુ થઈ રહ્યા છે...',
    successMsg: 'કૅલેન્ડર સફળતાપૂર્વક ફરીથી નક્કી થઈ ગઈ!',
    urgency_low: 'ઓછો પ્રભાવ',
    urgency_medium: 'મધ્યમ પ્રભાવ',
    urgency_high: 'ઉચ્ચ પ્રભાવ',
    urgency_critical: 'ગંભીર કટોકટી',
    noChanges: 'આ પરિસ્થિતિ માટે કોઈ ઇવેન્ટ ફરીથી નક્કી કરવાની જરૂર નથી.',
    errorMsg: 'વિશ્લેષણ નિષ્ફળ. કૃપા કરી ફરી પ્રયાસ કરો.',
    weatherWarning: 'હવામાન આગાહી ચેતવણી',
    weatherAllowQ: 'શું AI ને આ હવામાન આગાહીના આધારે ફેરફાર કરવા દો?',
    allowBtn: 'હા, ફેરફાર કરો',
    denyBtn: 'ના, મારી સૂચિ રાખો',
    eventsMoved: 'ઇવેન્ટ ફરી નક્કી થશે',
    reportDisaster: 'કટોકટી નોંધો',
  },
  ml: {
    disasterTitle: 'ദുരന്തം / അടിയന്തര സ്ഥിതി റിപ്പോർട്ട് ചെയ്യുക',
    disasterSubtitle: 'എന്ത് സംഭവിച്ചെന്ന് വിവരിക്കൂ, AI നിങ്ങളുടെ കൃഷി ഷെഡ്യൂൾ പുനഃക്രമീകരിക്കും',
    weatherAlertTitle: 'കാലാവസ്ഥ അലേർട്ട് കണ്ടെത്തി',
    weatherAlertSubtitle: 'കാലാവസ്ഥ സംവിധാനം നിങ്ങളുടെ ഷെഡ്യൂളിനെ ബാധിക്കുന്ന പ്രവചനം നടത്തി',
    inputPlaceholder: 'ഉദാ: ഞങ്ങളുടെ പ്രദേശത്ത് വലിയ വെള്ളപ്പൊക്കം വന്നു, വയലുകൾ മുങ്ങി...',
    analyzeBtn: 'വിശകലനം ചെയ്യുക & പുനഃക്രമീകരണം നിർദ്ദേശിക്കുക',
    analyzing: 'AI നിങ്ങളുടെ സ്ഥിതി വിശകലനം ചെയ്യുന്നു...',
    aiSummary: 'AI വിലയിരുത്തൽ',
    generalAdvice: 'പൊതു ഉപദേശം',
    affectedEvents: 'ബാധിക്കപ്പെട്ട ഇവന്റുകൾ',
    newSchedule: 'പുതിയ ഷെഡ്യൂൾ',
    reason: 'മാറ്റത്തിന്റെ കാരണം',
    advice: 'എന്ത് ചെയ്യണം',
    confirmReschedule: 'മാറ്റം പ്രയോഗിക്കുക',
    keepOriginal: 'യഥാർത്ഥ ഷെഡ്യൂൾ നിലനിർത്തുക',
    rescheduling: 'മാറ്റങ്ങൾ പ്രയോഗിക്കുന്നു...',
    successMsg: 'ക്യാലൻഡർ വിജയകരമായി പുനഃക്രമീകരിച്ചു!',
    urgency_low: 'കുറഞ്ഞ ആഘാതം',
    urgency_medium: 'മിതമായ ആഘാതം',
    urgency_high: 'ഉയർന്ന ആഘാതം',
    urgency_critical: 'ഗുരുതരമായ അടിയന്തരാവസ്ഥ',
    noChanges: 'ഈ സ്ഥിതിക്ക് ഒരു ഇവന്റും പുനഃക്രമീകരിക്കേണ്ടതില്ല.',
    errorMsg: 'വിശകലനം പരാജയപ്പെട്ടു. വീണ്ടും ശ്രമിക്കൂ.',
    weatherWarning: 'കാലാവസ്ഥ പ്രവചന മുന്നറിയിപ്പ്',
    weatherAllowQ: 'ഈ കാലാവസ്ഥ പ്രവചനത്തിന്റെ അടിസ്ഥാനത്തിൽ AI-ക്ക് ഷെഡ്യൂൾ മാറ്റാൻ അനുവദിക്കണോ?',
    allowBtn: 'അതെ, മാറ്റം വരുത്തൂ',
    denyBtn: 'അല്ല, ഷെഡ്യൂൾ നിലനിർത്തൂ',
    eventsMoved: 'ഇവന്റുകൾ പുനഃക്രമീകരിക്കും',
    reportDisaster: 'അടിയന്തരം റിപ്പോർട്ട് ചെയ്യുക',
  },
};

// ─── Urgency config ───────────────────────────────────────────────────────────

const URGENCY_CONFIG = {
  low: {
    outerBg: 'bg-blue-50 dark:bg-blue-950/30',
    border: 'border-blue-200 dark:border-blue-800',
    headerBg: 'bg-blue-50 dark:bg-blue-950/30',
    headerBorder: 'border-blue-200 dark:border-blue-800',
    text: 'text-blue-700 dark:text-blue-300',
    dot: 'bg-blue-500',
    icon: Info,
  },
  medium: {
    outerBg: 'bg-amber-50 dark:bg-amber-950/30',
    border: 'border-amber-200 dark:border-amber-800',
    headerBg: 'bg-amber-50 dark:bg-amber-950/30',
    headerBorder: 'border-amber-200 dark:border-amber-800',
    text: 'text-amber-700 dark:text-amber-300',
    dot: 'bg-amber-500',
    icon: AlertTriangle,
  },
  high: {
    outerBg: 'bg-orange-50 dark:bg-orange-950/30',
    border: 'border-orange-200 dark:border-orange-800',
    headerBg: 'bg-orange-50 dark:bg-orange-950/30',
    headerBorder: 'border-orange-200 dark:border-orange-800',
    text: 'text-orange-700 dark:text-orange-300',
    dot: 'bg-orange-500',
    icon: Zap,
  },
  critical: {
    outerBg: 'bg-red-50 dark:bg-red-950/30',
    border: 'border-red-200 dark:border-red-800',
    headerBg: 'bg-red-50 dark:bg-red-950/30',
    headerBorder: 'border-red-200 dark:border-red-800',
    text: 'text-red-700 dark:text-red-300',
    dot: 'bg-red-500',
    icon: ShieldAlert,
  },
} as const;

// ─── Component ────────────────────────────────────────────────────────────────

export function SmartReschedulePanel({
  events,
  language,
  weatherAlert,
  onConfirmReschedule,
  onDismiss,
  autoOpenWithWeather = false,
}: SmartReschedulePanelProps): React.ReactElement {
  const t = (key: TKey): string => T[language]?.[key] ?? T.en[key];

  type Mode = 'idle' | 'disaster' | 'weather-confirm' | 'analyzing' | 'result' | 'applying' | 'success';

  const [mode, setMode] = useState<Mode>(
    autoOpenWithWeather && weatherAlert ? 'weather-confirm' : 'idle'
  );
  const [disasterText, setDisasterText] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RescheduleResponse | null>(null);
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);

  // ── Helpers ────────────────────────────────────────────────────────────────

  const getEventTitle = (id: string): string =>
    events.find((e) => e._id === id)?.title ?? id;

  const getEventOriginalDate = (id: string): string => {
    const ev = events.find((e) => e._id === id);
    if (!ev) return '';
    return new Date(ev.date).toLocaleDateString();
  };

  // ── Core analyze call ──────────────────────────────────────────────────────

  const analyze = async (description: string): Promise<void> => {
    if (!description.trim()) return;
    setMode('analyzing');
    setError(null);
    try {
      const res = await fetch('/api/calendar/events/reschedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          events: events.map((e) => ({
            _id: e._id,
            title: e.title,
            date: e.date,
            category: e.category,
            startTime: e.startTime,
            endTime: e.endTime,
            priority: e.priority,
            description: e.description,
            notes: e.notes,
          })),
          disasterDescription: description,
          weatherAlert: weatherAlert ?? undefined,
          language,
          currentDate: new Date().toISOString(),
        }),
      });

      const contentType = res.headers.get('content-type') ?? '';
      if (!contentType.includes('application/json')) {
        const text = await res.text();
        console.error('Non-JSON response from reschedule API:', text.slice(0, 200));
        throw new Error(
          res.status === 404
            ? 'Reschedule API route not found. Make sure the file is at app/api/calendar/events/reschedule/route.ts'
            : `Server returned non-JSON response (${res.status})`
        );
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Unknown error');

      setResult(data as RescheduleResponse);
      setMode('result');
    } catch (err) {
      const msg = err instanceof Error ? err.message : t('errorMsg');
      setError(msg);
      setMode('disaster');
    }
  };

  // ── Apply rescheduling ─────────────────────────────────────────────────────

  const handleApply = async (): Promise<void> => {
    if (!result) return;
    setMode('applying');
    try {
      await onConfirmReschedule(result.rescheduledEvents);
      setMode('success');
      setTimeout(() => {
        setMode('idle');
        setResult(null);
        onDismiss();
      }, 2000);
    } catch {
      setMode('result');
    }
  };

  // ── Idle ───────────────────────────────────────────────────────────────────

  if (mode === 'idle') {
    return (
      <div className="flex flex-col xs:flex-row gap-2 w-full">
        <button
          onClick={() => setMode('disaster')}
          className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white rounded-xl font-semibold text-xs sm:text-sm shadow transition w-full xs:w-auto"
        >
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span className="hidden xs:inline">{t('reportDisaster')}</span>
          <span className="xs:hidden">{t('reportDisaster')}</span>
        </button>
        {weatherAlert && (
          <button
            onClick={() => setMode('weather-confirm')}
            className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-semibold text-xs sm:text-sm shadow transition w-full xs:w-auto"
          >
            <CloudRain className="w-4 h-4 shrink-0" />
            <span className="hidden xs:inline">{t('weatherWarning')}</span>
            <span className="xs:hidden">⚠️ Weather</span>
          </button>
        )}
      </div>
    );
  }

  // ── Weather permission prompt ──────────────────────────────────────────────

  if (mode === 'weather-confirm') {
    return (
      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-sm">
        <div className="flex items-start gap-3 mb-4">
          <CloudRain className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-amber-800 dark:text-amber-200 text-sm sm:text-base leading-tight">
              {t('weatherAlertTitle')}
            </h3>
            <p className="text-xs sm:text-sm text-amber-700 dark:text-amber-300 mt-1 leading-snug">
              {t('weatherAlertSubtitle')}
            </p>
          </div>
        </div>

        {weatherAlert && (
          <div className="bg-white dark:bg-gray-900 rounded-lg sm:rounded-xl p-3 mb-4 border border-amber-200 dark:border-amber-700">
            <p className="text-xs sm:text-sm text-gray-800 dark:text-foreground italic line-clamp-3">
              "{weatherAlert}"
            </p>
          </div>
        )}

        <p className="text-xs sm:text-sm font-semibold text-amber-800 dark:text-amber-200 mb-3">
          {t('weatherAllowQ')}
        </p>

        <div className="flex flex-col gap-2">
          <button
            onClick={() => analyze(weatherAlert ?? t('weatherAlertTitle'))}
            className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white rounded-lg sm:rounded-xl font-semibold text-sm transition"
          >
            {t('allowBtn')}
          </button>
          <button
            onClick={onDismiss}
            className="w-full py-2.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-foreground rounded-lg sm:rounded-xl font-semibold text-sm transition"
          >
            {t('denyBtn')}
          </button>
        </div>
      </div>
    );
  }

  // ── Disaster input ─────────────────────────────────────────────────────────

  if (mode === 'disaster') {
    return (
      <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-sm">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <ShieldAlert className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-red-800 dark:text-red-200 text-sm sm:text-base leading-tight">
              {t('disasterTitle')}
            </h3>
            <p className="text-xs sm:text-sm text-red-700 dark:text-red-300 mt-1 leading-snug">
              {t('disasterSubtitle')}
            </p>
          </div>
        </div>

        {/* Textarea */}
        <textarea
          value={disasterText}
          onChange={(e) => setDisasterText(e.target.value)}
          placeholder={t('inputPlaceholder')}
          rows={3}
          className="
            w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm resize-none mb-3
            bg-white dark:bg-gray-900
            text-gray-900 dark:text-foreground
            placeholder-gray-400 dark:placeholder-gray-500
            border border-red-300 dark:border-red-700
            focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-600
            transition-colors
          "
        />

        {/* Error */}
        {error && (
          <div className="mb-3 p-3 bg-red-100 dark:bg-red-900/40 border border-red-300 dark:border-red-700 rounded-lg sm:rounded-xl">
            <p className="text-xs sm:text-sm text-red-700 dark:text-red-300 break-words">{error}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => analyze(disasterText)}
            disabled={!disasterText.trim()}
            className="
              flex-1 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm transition
              flex items-center justify-center gap-2
              bg-red-600 hover:bg-red-700 active:bg-red-800 text-white
              disabled:bg-gray-300 dark:disabled:bg-gray-700
              disabled:text-gray-500 dark:disabled:text-gray-400
              disabled:cursor-not-allowed
            "
          >
            {t('analyzeBtn')}
          </button>
          <button
            onClick={() => {
              setMode('idle');
              setDisasterText('');
              setError(null);
            }}
            className="p-2.5 sm:p-3 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 rounded-lg sm:rounded-xl transition shrink-0"
            title="Close"
          >
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // ── Analyzing spinner ──────────────────────────────────────────────────────

  if (mode === 'analyzing') {
    return (
      <div className="bg-white dark:bg-card border border-gray-200 dark:border-border rounded-xl sm:rounded-2xl p-3 sm:p-5 flex items-center gap-3 shadow-sm">
        <Loader2 className="w-5 h-5 text-emerald-600 dark:text-emerald-500 animate-spin shrink-0" />
        <p className="text-xs sm:text-sm font-medium text-gray-800 dark:text-foreground">
          {t('analyzing')}
        </p>
      </div>
    );
  }

  // ── Applying changes ───────────────────────────────────────────────────────

  if (mode === 'applying') {
    return (
      <div className="bg-white dark:bg-card border border-gray-200 dark:border-border rounded-xl sm:rounded-2xl p-3 sm:p-5 flex items-center gap-3 shadow-sm">
        <Loader2 className="w-5 h-5 text-emerald-600 dark:text-emerald-500 animate-spin shrink-0" />
        <p className="text-xs sm:text-sm font-medium text-gray-800 dark:text-foreground">
          {t('rescheduling')}
        </p>
      </div>
    );
  }

  // ── Success ────────────────────────────────────────────────────────────────

  if (mode === 'success') {
    return (
      <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-xl sm:rounded-2xl p-3 sm:p-5 flex items-center gap-3 shadow-sm">
        <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
        <p className="font-semibold text-emerald-800 dark:text-emerald-200 text-xs sm:text-sm">
          {t('successMsg')}
        </p>
      </div>
    );
  }

  // ── Result ─────────────────────────────────────────────────────────────────

  if (mode === 'result' && result) {
    const urgency = result.urgencyLevel ?? 'medium';
    const cfg = URGENCY_CONFIG[urgency];
    const UrgencyIcon = cfg.icon;

    return (
      <div className={`${cfg.outerBg} ${cfg.border} border rounded-xl sm:rounded-2xl shadow-sm overflow-hidden`}>

        {/* Urgency header */}
        <div className={`${cfg.headerBg} border-b ${cfg.headerBorder} px-3 sm:px-5 py-3 sm:py-4`}>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className={`w-2 h-2 rounded-full ${cfg.dot} animate-pulse shrink-0`} />
            <UrgencyIcon className={`w-4 h-4 ${cfg.text} shrink-0`} />
            <span className={`text-xs font-bold uppercase tracking-wider ${cfg.text}`}>
              {t(`urgency_${urgency}` as TKey)}
            </span>
          </div>
          <h3 className={`font-bold text-xs sm:text-sm ${cfg.text} mb-1`}>{t('aiSummary')}</h3>
          <p className="text-xs sm:text-sm text-gray-900 dark:text-foreground leading-snug">
            {result.summary}
          </p>
        </div>

        {/* General advice */}
        <div className="px-3 sm:px-5 py-3 sm:py-4 bg-white/50 dark:bg-card/60 border-b border-gray-200 dark:border-border/40">
          <p className="text-xs font-bold text-gray-600 dark:text-muted-foreground uppercase tracking-wide mb-1.5">
            {t('generalAdvice')}
          </p>
          <p className="text-xs sm:text-sm text-gray-900 dark:text-foreground leading-snug">
            {result.generalAdvice}
          </p>
        </div>

        {/* Affected events */}
        {result.rescheduledEvents.length === 0 ? (
          <div className="px-3 sm:px-5 py-3 sm:py-4 text-xs sm:text-sm text-gray-600 dark:text-muted-foreground">
            {t('noChanges')}
          </div>
        ) : (
          <div className="px-3 sm:px-5 py-3 sm:py-4">
            <p className="text-xs font-bold text-gray-600 dark:text-muted-foreground uppercase tracking-wide mb-2.5">
              {t('affectedEvents')} · {result.rescheduledEvents.length} {t('eventsMoved')}
            </p>

            <div className="space-y-2">
              {result.rescheduledEvents.map((ev) => {
                const isOpen = expandedEvent === ev._id;
                return (
                  <div
                    key={ev._id}
                    className="bg-white dark:bg-gray-900 rounded-lg sm:rounded-xl border border-gray-200 dark:border-border overflow-hidden"
                  >
                    <button
                      onClick={() => setExpandedEvent(isOpen ? null : ev._id)}
                      className="w-full flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition"
                    >
                      <Calendar className="w-4 h-4 text-gray-400 dark:text-gray-600 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-foreground truncate">
                          {getEventTitle(ev._id)}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1 flex-wrap gap-y-0.5">
                          <span className="text-xs text-gray-500 dark:text-gray-400 line-through">
                            {getEventOriginalDate(ev._id)}
                          </span>
                          <ArrowRight className="w-3 h-3 text-emerald-500 shrink-0" />
                          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                            {new Date(ev.newDate).toLocaleDateString()} · {ev.newStartTime}
                          </span>
                        </div>
                      </div>
                      {isOpen
                        ? <ChevronUp className="w-4 h-4 text-gray-400 dark:text-gray-600 shrink-0" />
                        : <ChevronDown className="w-4 h-4 text-gray-400 dark:text-gray-600 shrink-0" />
                      }
                    </button>

                    {isOpen && (
                      <div className="px-3 sm:px-4 pb-3 sm:pb-4 space-y-3 border-t border-gray-100 dark:border-border/30 bg-gray-50 dark:bg-gray-900/50">
                        <div className="pt-3">
                          <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">
                            {t('reason')}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-800 dark:text-foreground leading-snug">
                            {ev.reason}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">
                            {t('advice')}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-800 dark:text-foreground leading-snug">
                            {ev.actionAdvice}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="px-3 sm:px-5 py-3 sm:py-4 border-t border-gray-200 dark:border-border/40 flex flex-col sm:flex-row gap-2">
          {result.rescheduledEvents.length > 0 && (
            <button
              onClick={handleApply}
              className="flex-1 py-2.5 sm:py-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm transition shadow-sm"
            >
              {t('confirmReschedule')}
            </button>
          )}
          <button
            onClick={() => {
              setMode('idle');
              setResult(null);
              onDismiss();
            }}
            className="flex-1 py-2.5 sm:py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-foreground rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm transition"
          >
            {t('keepOriginal')}
          </button>
        </div>
      </div>
    );
  }

  // Fallback
  return (
    <div className="bg-white dark:bg-card border border-gray-200 dark:border-border rounded-xl sm:rounded-2xl p-3 sm:p-5 flex items-center gap-3">
      <Loader2 className="w-5 h-5 text-emerald-600 dark:text-emerald-500 animate-spin shrink-0" />
      <p className="text-xs sm:text-sm text-gray-800 dark:text-foreground">{t('analyzing')}</p>
    </div>
  );
}