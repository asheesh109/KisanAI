'use client';

import { useOfflineStatus } from '@/hooks/useOfflineStatus';
import { WifiOff, Info } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface OfflineBannerProps {
  /**
   * Whether to show the banner when offline
   * @default true
   */
  show?: boolean;

  /**
   * Custom message to display
   * If not provided, will use translation key 'offline.message'
   */
  message?: string;

  /**
   * Position of the banner
   * @default 'top'
   */
  position?: 'top' | 'bottom';

  /**
   * Whether to show in production
   * @default true
   */
  showInProduction?: boolean;
}

/**
 * OfflineBanner Component
 * Displays a banner when the user is offline
 * Supports dark mode and multilingual interface
 */
export default function OfflineBanner({
  show = true,
  message,
  position = 'top',
  showInProduction = true,
}: OfflineBannerProps) {
  const { isOffline, isLoading } = useOfflineStatus();
  const { language } = useLanguage();

  // Don't show banner if loading or not offline
  if (isLoading || !isOffline || !show) {
    return null;
  }

  // Get translations based on language
  const translations = {
    en: {
      offline: 'You are offline',
      offlineMessage: 'You are offline. Showing saved data. Some features may be limited.',
      lastUpdated: 'Last updated',
    },
    hi: {
      offline: 'आप ऑफलाइन हैं',
      offlineMessage: 'आप ऑफलाइन हैं। संग्रहीत डेटा दिखाया जा रहा है। कुछ सुविधाएं सीमित हो सकती हैं।',
      lastUpdated: 'अंतिम अपडेट',
    },
    mr: {
      offline: 'आप ऑफलाइन आहात',
      offlineMessage: 'आप ऑफलाइन आहात. जतन केलेले डेटा दाखवले जात आहे. काही वैशिष्ट्ये मर्यादित असू शकतात.',
      lastUpdated: 'शेवटचा अपडेट',
    },
    gu: {
      offline: 'તમે ઓફલાઇન છો',
      offlineMessage: 'તમે ઓફલાઇન છો. સંરક્ષિત ડેટા દર્શાવવામાં આવે છે. કેટલીક વૈશિષ્ટ્યો મર્યાદિત હોઈ શકે છે.',
      lastUpdated: 'છેલ્લો અપડેટ',
    },
    ml: {
      offline: 'നിങ്ങൾ ഓഫ്‌ലൈനിലാണ്',
      offlineMessage: 'നിങ്ങൾ ഓഫ്‌ലൈനിലാണ്. സേവ് ചെയ്ത ഡാറ്റ കാണിക്കുന്നു. ചില ഫീച്ചറുകൾ പരിമിതമായിരിക്കാം.',
      lastUpdated: 'അവസാന അപ്ഡേറ്റ്',
    },
  };

  const currentTranslations =
    translations[language as keyof typeof translations] ||
    translations.en;
  const displayMessage = message || currentTranslations.offlineMessage;

  const positionClasses =
    position === 'top'
      ? 'fixed top-0 left-0 right-0 z-50'
      : 'fixed bottom-0 left-0 right-0 z-50';

  return (
    <div
      className={`${positionClasses} transition-all duration-300 ease-in-out animate-in fade-in slide-in-from-top-2`}
    >
      {/* Offline Banner */}
      <div className="w-full bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950 border-b border-amber-200 dark:border-amber-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-start sm:items-center gap-3 flex-col sm:flex-row">
            {/* Icon */}
            <div className="flex-shrink-0 mt-0.5 sm:mt-0">
              <WifiOff className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>

            {/* Message */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">
                {currentTranslations.offline}
              </p>
              <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-200 mt-1">
                {displayMessage}
              </p>
            </div>

            {/* Info Icon */}
            <div className="flex-shrink-0 ml-auto">
              <Info className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Spacer for fixed positioning when banner is at top */}
      {position === 'top' && <div className="h-16 sm:h-12" />}
    </div>
  );
}
