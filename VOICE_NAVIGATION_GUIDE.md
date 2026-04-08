# Voice Navigation System - Complete Guide

## 📋 Overview

The Voice Navigation System enables users to control the KisanAI app using voice commands in multiple languages without any external AI APIs. It uses rule-based matching with fuzzy matching capabilities for robust command recognition.

**Key Features:**
- ✅ Multi-language support (English, Hindi, Marathi, Gujarati, Malayalam)
- ✅ Rule-based command matching (no external APIs)
- ✅ Fuzzy matching for similar phrases
- ✅ Real-time speech-to-text integration
- ✅ Responsive UI with dark mode support
- ✅ 8+ built-in commands
- ✅ Easily extensible for new commands
- ✅ TypeScript fully typed
- ✅ Production ready

---

## 🎯 Quick Start

### 1. Add to Your Layout

**`src/app/layout.jsx`**

```jsx
import { VoiceNavigationPanel } from '@/components/VoiceNavigationPanel';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        
        {/* Add voice navigation panel */}
        <VoiceNavigationPanel 
          position="fixed" 
          layout="compact" 
          showCommands={true}
        />
      </body>
    </html>
  );
}
```

### 2. That's It!

Your app now has voice navigation. Users can:
- Click the floating microphone icon
- Speak commands like "Show schemes"
- App automatically navigates

---

## 📁 File Structure

```
src/
├── lib/
│   ├── voiceCommands.ts          # Command dictionary with phrases
│   ├── normalizeText.ts          # Text normalization & fuzzy matching
│   └── matchVoiceCommand.ts      # Command matching engine
├── hooks/
│   └── useVoiceNavigation.ts    # React hook for voice navigation
├── components/
│   ├── VoiceNavigationPanel.tsx # Main UI component
│   └── examples/
│       └── VoiceNavigationExamples.tsx # Integration examples
```

---

## 🎙️ How It Works

### Matching Strategy (Multi-Stage)

1. **Exact Match (100% confidence)**
   - User says: "show schemes"
   - Dictionary has: "show schemes"
   - → Match found immediately

2. **Keyword Match (60-100% confidence)**
   - User says: "please show me the government schemes"
   - Dictionary phrase: "show schemes"
   - → All keywords found, confidence = 100%

3. **Fuzzy Match (65-100% confidence)**
   - User says: "sho schemes"
   - Dictionary phrase: "show schemes"
   - → Similarity match = 86%
   - → Match accepted

4. **No Match**
   - User says: "hello"
   - → No phrases match
   - → Feedback: "Command not recognized"

---

## 📖 Component API

### VoiceNavigationPanel

```tsx
<VoiceNavigationPanel
  position="fixed"           // Position: 'fixed' or 'absolute'
  layout="compact"           // Layout: 'compact' or 'expanded'
  showCommands={true}        // Show command list
  theme="auto"              // Theme: 'auto', 'light', 'dark'
/>
```

**Props:**
- `position`: CSS position of the floating button
- `layout`: Compact (small panel) or expanded (full panel)
- `showCommands`: Show available commands in UI
- `theme`: Auto-detect system theme or force light/dark

---

### useVoiceNavigation Hook

```tsx
const voiceNav = useVoiceNavigation({
  autoNavigate: true,           // Auto-navigate on command
  navigationDelay: 600,         // Delay before navigating (ms)
  onCommandMatched: (result) => {
    console.log('Command:', result.command?.id);
  },
  onCommandFailed: (transcript) => {
    console.log('No match for:', transcript);
  },
});

// Use state
voiceNav.isListening;        // bool
voiceNav.transcript;         // string
voiceNav.lastCommand;        // MatchResult | null
voiceNav.feedback;           // string
voiceNav.error;              // string | null

// Use methods
voiceNav.handleTranscript(text, isFinal);  // Process transcript
voiceNav.setListening(bool);               // Set listening state
voiceNav.reset();                          // Clear state
```

---

## 🗣️ Built-in Commands

| Command | Routes | English | Hindi |
|---------|--------|---------|-------|
| Schemes | `/schemes` | "show schemes" | "योजनाएं दिखाओ" |
| Market | `/market-prices` | "market prices" | "मंडी भाव" |
| Weather | `/weather` | "show weather" | "मौसम दिखाओ" |
| Voice Assistant | `/voice-assistant` | "voice assistant" | "वॉइस सहायक" |
| Crop Analysis | `/crop-analysis` | "analyze crop" | "फसल विश्लेषण" |
| KCC | `/kcc-application` | "kisan credit card" | "किसान क्रेडिट कार्ड" |
| Eligibility | `/schemes/eligibility-checker` | "check eligibility" | "पात्रता जांचो" |
| Home | `/` | "go home" | "होम जाओ" |

---

## ➕ Add Custom Commands

### 1. Add to Dictionary

**`src/lib/voiceCommands.ts`**

```ts
export const VOICE_COMMANDS: VoiceCommand[] = [
  // ... existing commands

  {
    id: 'my-custom-command',
    action: 'navigate',
    target: '/my-page',
    phrases: {
      en: ['my command', 'open my page', 'go to my page'],
      hi: ['मेरा आदेश', 'मेरा पृष्ठ खोलो'],
      mr: ['माझा आदेश'],
      gu: ['મારો આદેશ'],
      ml: ['എന്റെ കമാൻഡ്'],
    },
    label: {
      en: 'My Command',
      hi: 'मेरा आदेश',
      mr: 'माझा आदेश',
      gu: 'મારો આદેશ',
      ml: 'എന്റെ കമാൻഡ്',
    },
    icon: 'custom-icon',
  },
];
```

### 2. Define All Languages

Make sure you add phrases for all 5 languages:
- `en` - English
- `hi` - Hindi
- `mr` - Marathi
- `gu` - Gujarati
- `ml` - Malayalam

### 3. Test

- Click mic button
- Say your command
- Should navigate automatically

---

## ⚙️ Configuration

### Fine-Tune Matching Sensitivity

**`src/lib/matchVoiceCommand.ts`**

```ts
// Adjust fuzzy matching threshold (0-1)
const threshold = 0.65;  // Lower = more lenient
```

### Adjust Navigation Delay

```tsx
const voiceNav = useVoiceNavigation({
  navigationDelay: 1000,  // Wait 1s before navigating
});
```

### Disable Auto-Navigation

```tsx
const voiceNav = useVoiceNavigation({
  autoNavigate: false,  // Manual navigation required
});
```

---

## 🎨 UI Customization

### Change Layout

```tsx
// Compact (small floating button)
<VoiceNavigationPanel layout="compact" />

// Expanded (full command panel)
<VoiceNavigationPanel layout="expanded" />
```

### Position Options

```tsx
<VoiceNavigationPanel position="fixed" />    // Fixed bottom-right
<VoiceNavigationPanel position="absolute" />  // Relative to parent
```

### Theme

```tsx
<VoiceNavigationPanel theme="auto" />        // Auto-detect system
<VoiceNavigationPanel theme="dark" />        // Force dark mode
<VoiceNavigationPanel theme="light" />       // Force light mode
```

---

## 🧠 Custom Command Handlers

### Handle Custom Actions

```ts
const voiceNav = useVoiceNavigation({
  onCommandMatched: (result) => {
    if (result.command?.id === 'help') {
      showHelpModal();
    }
  },
});
```

### Listen for Action Events

```tsx
import { useVoiceAction } from '@/hooks/useVoiceNavigation';

// Listen for 'showHelp' action
useVoiceAction('showHelp', () => {
  console.log('Show help modal');
});

// Listen for 'toggleDarkMode' action
useVoiceAction('toggleDarkMode', () => {
  console.log('Toggle dark mode');
});
```

---

## 🌐 Multi-Language Features

### Detect Current Language

```tsx
import { useLanguage } from '@/contexts/LanguageContext';

const { language } = useLanguage();
// language: 'en' | 'hi' | 'mr' | 'gu' | 'ml'
```

### Commands Auto-Translated

The `VoiceNavigationPanel` automatically shows labels in the current user language. No additional setup needed!

### Hinglish Support (Bonus)

The system automatically handles common Hinglish variations:
- User says: "market" or "mandi" or "मंडी" → All recognized as market prices
- System uses fuzzy matching + transliteration helpers

---

## 📊 Debugging

### Enable Debug Logging

```tsx
import { debugMatchScores } from '@/lib/matchVoiceCommand';

// Get detailed matching scores
const scores = debugMatchScores('show schemes', 'en');
console.log(scores);

/* Output:
[
  {
    command: 'schemes',
    phrases: [
      { phrase: 'show schemes', score: 1.0 },
      { phrase: 'open schemes', score: 0.92 },
      { phrase: 'government schemes', score: 0.89 }
    ],
    maxScore: 1.0
  },
  ...
]
*/
```

### Check Voice Recognition

1. Open DevTools → Console
2. Click mic button
3. Speak and check console for transcript
4. Verify matching score in debug output

---

## ⚡ Performance Tips

1. **Memoize Handlers**
   ```tsx
   const handleCommandMatched = useCallback((result) => {
     // ...
   }, []);
   ```

2. **Lazy Load Commands**
   - Load commands only when voice panel opens
   - Use React.lazy() for component splitting

3. **Batch Updates**
   - Use useTransition() for non-blocking updates
   - Prevents UI jank during matching

4. **Cache Normalization**
   - Pre-normalize command phrases once
   - Reuse normalized text for matching

---

## 🔒 Security & Privacy

✅ **No External APIs**
- All matching happens locally
- Speech-to-text uses browser's Web Speech API
- No data sent to servers

✅ **User Privacy**
- Transcript only kept in component state
- Automatically cleared on reset
- Users control mic access

✅ **Accessibility**
- Keyboard shortcuts available
- Screen reader friendly labels
- High contrast dark mode

---

## 🐛 Troubleshooting

### Microphone Not Working

```
Error: Speech recognition not available
```

**Solution:** Check browser compatibility
- Chrome/Edge: ✅ (Full support)
- Firefox: ⚠️ (Partial support)
- Safari: ⚠️ (Requires HTTPS + specific config)
- IE: ❌ (Not supported)

### Commands Not Matching

**Check:**
1. Ensure you're using the correct language code
2. Verify phrase is in dictionary
3. Check matching threshold isn't too high
4. Run `debugMatchScores()` to see scores

### Navigation Delay Too Long

```tsx
// Reduce delay
navigationDelay: 300  // 300ms instead of 600ms
```

### Commands List Not Showing

```tsx
// Enable command display
showCommands={true}
```

---

## 📚 Integration Examples

### Example 1: Basic (5 min)

```tsx
import { VoiceNavigationPanel } from '@/components/VoiceNavigationPanel';

export default function Layout({ children }) {
  return (
    <>
      {children}
      <VoiceNavigationPanel />
    </>
  );
}
```

### Example 2: With Handlers (15 min)

```tsx
const voiceNav = useVoiceNavigation({
  onCommandMatched: (result) => {
    trackAnalytics(result.command?.id, result.confidence);
  },
});
```

### Example 3: Custom Commands (20 min)

1. Add to voiceCommands.ts
2. Test with voice panel
3. Done!

---

## ✨ Advanced Features

### Confidence Scoring

```tsx
const result = matchVoiceCommand('show schemes', 'en');
console.log(result.confidence);  // 0.0 - 1.0
// 1.0 = Exact match
// 0.85 = High confidence
// 0.65 = Acceptable match
// 0.0 = No match
```

### Match Type Detection

```tsx
result.matchType  // 'exact' | 'keyword' | 'fuzzy' | 'none'
```

### Suggestions API

```tsx
import { getCommandSuggestions } from '@/lib/matchVoiceCommand';

// Get top 3 matching suggestions
const suggestions = getCommandSuggestions('sho schemes', 'en', 3);
suggestions.forEach(s => {
  console.log(s.command?.label.en, s.confidence);
});
```

---

## 🚀 Production Checklist

- [ ] Test on 3+ browsers (Chrome, Firefox, Safari)
- [ ] Test with 3+ microphones
- [ ] Test all 5 languages
- [ ] Test in noisy environment
- [ ] Test with accent variations
- [ ] Verify HTTPS for speech API (if deployed)
- [ ] Monitor error logs
- [ ] Add analytics tracking
- [ ] Create help documentation for users
- [ ] Deploy with confidence scoring

---

## 🤝 Contributing

### Adding New Languages

1. Update `VOICE_COMMANDS` with phrases
2. Update i18n translations
3. Test with native speakers
4. Document language-specific rules

### Adding New Commands

1. Create command entry in voiceCommands.ts
2. Define phrases for all 5 languages
3. Add target route or action
4. Test in voice panel
5. Update this documentation

---

## 📞 Support

Need help?

1. Check **Troubleshooting** section above
2. Review **Integration Examples**
3. Run `debugMatchScores()` to diagnose issues
4. Check browser console for errors

---

## 📝 License

Integrated into KisanAI - Follow project license

---

**Last Updated:** April 2026
**Status:** Production Ready ✅
