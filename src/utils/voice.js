// Tiny wrapper around the browser Web Speech API.
// Used by the capture form so it doesn't have to know the messy details
// (vendor-prefixed constructor, interim results, error event shapes).
//
// No backend, no API cost. The browser does the transcription locally
// (or via the user's OS speech service in some browsers).

// Returns true if SpeechRecognition is available in this browser.
export function isVoiceSupported() {
  return Boolean(
    typeof window !== 'undefined' &&
      (window.SpeechRecognition || window.webkitSpeechRecognition)
  );
}

// Create a recognizer instance the caller can start/stop.
//
// Args:
//   lang:         BCP-47 tag — 'en-US' or 'pl-PL'
//   onTranscript: (text, isFinal) => void   fires repeatedly while speaking
//   onError:      (errorString) => void     fires on permission denial / network errors
//   onEnd:        () => void                fires when the recognizer naturally stops
//
// Returns the underlying SpeechRecognition object so the caller can call .start() / .stop().
export function createRecognizer({ lang = 'en-US', onTranscript, onError, onEnd }) {
  if (!isVoiceSupported()) {
    throw new Error('SpeechRecognition is not supported in this browser.');
  }
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const r = new SR();
  r.lang = lang;
  r.continuous = true;
  r.interimResults = true;

  r.onresult = (e) => {
    let interim = '';
    let final = '';
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const chunk = e.results[i][0].transcript;
      if (e.results[i].isFinal) final += chunk;
      else interim += chunk;
    }
    if (onTranscript) onTranscript(final + interim, Boolean(final));
  };

  r.onerror = (e) => {
    if (onError) onError(e?.error || 'unknown');
  };

  r.onend = () => {
    if (onEnd) onEnd();
  };

  return r;
}
