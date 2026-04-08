'use client';

/**
 * Voice Navigation Integration Example
 * Shows how to integrate voice navigation into your pages
 */

import React, { useCallback } from 'react';
import { VoiceNavigationPanel } from '@/components/VoiceNavigationPanel';
import {
  useVoiceNavigation,
  useVoiceCommandFeedback,
  useVoiceAction,
} from '@/hooks/useVoiceNavigation';
import { getCommandById } from '@/lib/voiceCommands';
import { MatchResult } from '@/lib/matchVoiceCommand';

/**
 * Example 1: Basic Integration
 * Just add the panel to your layout
 */
export function BasicVoiceNavigationExample() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Your page content */}
      <main className="p-8">
        <h1 className="text-2xl font-bold mb-4">Welcome to KisanAI</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Click the microphone button to start voice commands
        </p>
      </main>

      {/* Voice Navigation Panel - Compact */}
      <VoiceNavigationPanel
        position="fixed"
        layout="compact"
        showCommands={true}
      />
    </div>
  );
}

/**
 * Example 2: With Custom Handlers
 * Handle voice commands with custom logic
 */
export function CustomHandlerVoiceNavigationExample() {
  const voiceNav = useVoiceNavigation({
    autoNavigate: true,
    navigationDelay: 600,
    onCommandMatched: (result: MatchResult) => {
      console.log('Command matched:', result.command?.id);
      // Send analytics
      trackVoiceCommand(result.command?.id || '', result.confidence);
      // Show toast notification
      showNotification(`Executing: ${result.command?.label.en}`);
    },
    onCommandFailed: (transcript: string) => {
      console.log('No matching command for:', transcript);
      // Could call a feedback API here
    },
  });

  const handleCustomAction = useCallback(() => {
    console.log('Custom action triggered');
    // Perform custom action
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <main className="p-8">
        <h1 className="text-2xl font-bold mb-4">Voice Navigation Example</h1>

        {/* Display current voice state */}
        <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded">
          <h2 className="font-semibold mb-2">Current Voice State:</h2>
          <pre className="text-xs overflow-x-auto">
            {JSON.stringify(
              {
                isListening: voiceNav.isListening,
                transcript: voiceNav.transcript,
                lastCommand: voiceNav.lastCommand?.command?.id,
                error: voiceNav.error,
              },
              null,
              2
            )}
          </pre>
        </div>
      </main>

      {/* Expanded voice panel */}
      <VoiceNavigationPanel
        position="fixed"
        layout="expanded"
        showCommands={true}
      />
    </div>
  );
}

/**
 * Example 3: Advanced with Voice Feedback
 * Listen to voice command events
 */
export function AdvancedVoiceNavigationExample() {
  const feedback = useVoiceCommandFeedback();

  // Listen for help action
  useVoiceAction('showHelp', () => {
    showHelpModal();
  });

  // Listen for dark mode toggle
  useVoiceAction('toggleDarkMode', () => {
    toggleDarkMode();
  });

  return (
    <div className="min-h-screen">
      <main className="p-8">
        <h1 className="text-2xl font-bold mb-4">Advanced Voice Navigation</h1>

        {/* Voice Feedback Display */}
        {feedback && (
          <div
            className={`mb-4 p-4 rounded ${
              feedback.type === 'success'
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                : feedback.type === 'error'
                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
            }`}
          >
            {feedback.message}
          </div>
        )}

        <div className="space-y-4">
          <section>
            <h2 className="text-xl font-semibold mb-2">Features</h2>
            <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
              <li>Voice-controlled navigation</li>
              <li>Multi-language support</li>
              <li>Fuzzy command matching</li>
              <li>Real-time feedback</li>
              <li>Custom action handling</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">Try saying:</h2>
            <div className="grid grid-cols-2 gap-2">
              <button className="p-2 bg-blue-100 dark:bg-blue-900 rounded text-sm hover:bg-blue-200 dark:hover:bg-blue-800">
                "Show schemes"
              </button>
              <button className="p-2 bg-blue-100 dark:bg-blue-900 rounded text-sm hover:bg-blue-200 dark:hover:bg-blue-800">
                "Market prices"
              </button>
              <button className="p-2 bg-blue-100 dark:bg-blue-900 rounded text-sm hover:bg-blue-200 dark:hover:bg-blue-800">
                "Weather forecast"
              </button>
              <button className="p-2 bg-blue-100 dark:bg-blue-900 rounded text-sm hover:bg-blue-200 dark:hover:bg-blue-800">
                "Go to home"
              </button>
            </div>
          </section>
        </div>
      </main>

      <VoiceNavigationPanel layout="compact" />
    </div>
  );
}

/**
 * Example 4: Programmatic Voice Command
 * Manually trigger voice command matching
 */
export function ProgrammaticVoiceCommandExample() {
  const { handleTranscript } = useVoiceNavigation();

  const handleManualCommand = (command: string) => {
    // Simulate speech-to-text result
    handleTranscript(command, true);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-8">
      <h1 className="text-2xl font-bold mb-6">Test Voice Commands</h1>

      <div className="grid grid-cols-2 gap-3 max-w-2xl">
        {[
          { label: 'Show Schemes', cmd: 'show schemes' },
          { label: 'Market Prices', cmd: 'market prices' },
          { label: 'Weather', cmd: 'show weather' },
          { label: 'Voice Assistant', cmd: 'open voice assistant' },
          { label: 'Crop Analysis', cmd: 'analyze my crop' },
          { label: 'KCC Application', cmd: 'kisan credit card' },
          { label: 'Check Eligibility', cmd: 'check eligibility' },
          { label: 'Go Home', cmd: 'go home' },
        ].map(({ label, cmd }) => (
          <button
            key={cmd}
            onClick={() => handleManualCommand(cmd)}
            className="p-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition"
          >
            {label}
          </button>
        ))}
      </div>

      <VoiceNavigationPanel layout="compact" showCommands={true} />
    </div>
  );
}

/**
 * Example 5: Minimal Integration (for layout.jsx)
 * Simplest way to add voice navigation to your app
 */
export function MinimalVoiceNavigationSetup() {
  return (
    <>
      {/* Add this to your root layout.jsx */}
      <VoiceNavigationPanel
        position="fixed"
        layout="compact"
        showCommands={true}
        theme="auto"
      />
    </>
  );
}

// Helper functions
function trackVoiceCommand(command: string, confidence: number) {
  // Send to analytics service
  console.log('Analytics: Voice command', { command, confidence });
}

function showNotification(message: string) {
  // Show toast notification
  console.log('Notification:', message);
}

function showHelpModal() {
  // Show help modal with all commands
  console.log('Showing help modal');
}

function toggleDarkMode() {
  // Toggle dark mode
  console.log('Toggling dark mode');
}

/**
 * Integration Checklist:
 *
 * 1. Import VoiceNavigationPanel:
 *    import { VoiceNavigationPanel } from '@/components/VoiceNavigationPanel';
 *
 * 2. Add to layout.jsx or page:
 *    <VoiceNavigationPanel position="fixed" layout="compact" />
 *
 * 3. Use hooks for custom handling (optional):
 *    const voiceNav = useVoiceNavigation({ onCommandMatched: ... });
 *
 * 4. Test with browser speech recognition:
 *    - Allow microphone permission
 *    - Click mic button
 *    - Speak command: "Show schemes"
 *    - Should navigate to /schemes
 *
 * 5. Add more commands in src/lib/voiceCommands.ts if needed
 *
 * That's it! Voice navigation is ready to use.
 */
