'use client';

import React from 'react';
import { useNetwork } from '@/contexts/NetworkContext';
import { WifiOff } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function OfflineBanner() {
  const { isOnline } = useNetwork();
  const { language } = useLanguage();

  if (isOnline) return null;

  const offlineMessages = {
    en: "You are currently offline. Some features may be limited.",
    hi: "आप अभी ऑफ़लाइन हैं। कुछ सुविधाएँ सीमित हो सकती हैं।",
    mr: "तुम्ही सध्या ऑफलाइन आहात. काही वैशिष्ट्ये मर्यादित असू शकतात.",
    gu: "તમે હાલમાં ઑફલાઇન છો. કેટલીક સુવિધાઓ મર્યાદિત હોઈ શકે છે.",
    ml: "നിങ്ങൾ നിലവിൽ ഓഫ്‌ലൈനിലാണ്. ചില സവിശേഷതകൾ പരിമിതമായിരിക്കാം."
  };

  const message = offlineMessages[language] || offlineMessages.en;

  return (
    <div className="bg-yellow-500 text-black px-4 py-2 flex items-center justify-center text-sm font-medium z-50">
      <WifiOff className="h-4 w-4 mr-2" />
      {message}
    </div>
  );
}
