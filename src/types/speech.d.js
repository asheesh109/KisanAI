// This is a documentation-only file for JavaScript implementations
// Web Speech API definitions for reference

/*
Speech Recognition API Notes:
- Available as window.SpeechRecognition or window.webkitSpeechRecognition
- Main properties/methods:
  continuous: boolean
  interimResults: boolean
  lang: string
  start(), stop(), abort()
  Event handlers: onresult, onerror, onend, etc.

Speech Synthesis API Notes:
- Available as window.speechSynthesis
- SpeechSynthesisUtterance is the main class for speech:
  text, lang, rate, pitch, volume properties
  Event handlers: onstart, onend, onerror, etc.
*/

// Example runtime check for feature support
if (typeof window !== 'undefined') {
  if (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window)) {
    console.warn('Speech Recognition API not supported in this browser');
  }
  
  if (!('speechSynthesis' in window)) {
    console.warn('Speech Synthesis API not supported in this browser');
  }
}

// No actual exports needed in JavaScript version