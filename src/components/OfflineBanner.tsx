'use client';

import { useOfflineStatus } from '@/hooks/useOfflineStatus';
import { WifiOff, RefreshCw } from 'lucide-react';
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
 * Displays a banner when the user is offline, with a retry control
 * that actively re-checks connectivity instead of waiting for the
 * browser to fire an 'online' event.
 * Supports dark mode and multilingual interface (en, hi, mr, gu, ml).
 */
export default function OfflineBanner({
  show = true,
  message,
  position = 'top',
  showInProduction = true,
}: OfflineBannerProps) {
  const { isOffline, isLoading, isRetrying, lastRetryFailed, retry } = useOfflineStatus();
  const { t } = useLanguage();

  // Don't show banner if loading or not offline
  if (isLoading || !isOffline || !show) {
    return null;
  }

  const displayMessage = message || t('offline.message');

  // z-[60] intentionally sits above the sticky Header (z-50) so the
  // banner isn't silently covered once the header sticks to the top
  // of the viewport during scroll.
  const positionClasses =
    position === 'top'
      ? 'fixed top-0 left-0 right-0 z-[60]'
      : 'fixed bottom-0 left-0 right-0 z-[60]';

  return (
    <div
      className={`${positionClasses} transition-all duration-300 ease-in-out animate-in fade-in slide-in-from-top-2`}
      role="status"
      aria-live="polite"
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
                {t('offline')}
              </p>
              <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-200 mt-1">
                {displayMessage}
              </p>
              {lastRetryFailed && !isRetrying && (
                <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-200 mt-1 font-medium">
                  {t('offline.retryFailed')}
                </p>
              )}
            </div>

            {/* Retry Button */}
            <div className="flex-shrink-0 sm:ml-auto w-full sm:w-auto">
              <button
                type="button"
                onClick={retry}
                disabled={isRetrying}
                aria-label={t('offline.retry')}
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md border border-amber-300 dark:border-amber-700 bg-white/60 dark:bg-black/20 text-amber-900 dark:text-amber-100 hover:bg-white dark:hover:bg-black/40 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 ${isRetrying ? 'animate-spin' : ''}`}
                  aria-hidden="true"
                />
                {isRetrying ? t('offline.retrying') : t('offline.retry')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}