import { useState, useRef, useEffect } from 'react';
import { colors, fonts, fontSizes, spacing, radii } from '../styles/theme';
import { SKILL_CATEGORIES } from '../data/fisher-scenarios';
import { saveCapturedScenario, updateCapturedScenario } from '../utils/storage';
import { generateScenarioFromCapture, isApiConfigured } from '../utils/claudeApi';
import { isVoiceSupported, createRecognizer } from '../utils/voice';
import IconMic from './icons/IconMic';

const LANG_KEY = 'improveme.captureLang';

// Capture screen — one textarea, optional mic, save & process button.
// Saves the raw text immediately and kicks off Claude generation in the
// background. The user is back at the menu before Claude finishes.
//
// Props:
//   onBack(): called when the user taps Back or finishes saving.
export default function Capture({ onBack }) {
  const [text, setText] = useState('');
  const [skillCategory, setSkillCategory] = useState(null);
  const [sourceOpen, setSourceOpen] = useState(false);
  const [sourceBook, setSourceBook] = useState('');
  const [sourceAuthor, setSourceAuthor] = useState('');
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem(LANG_KEY) || 'en';
    } catch {
      return 'en';
    }
  });
  const [listening, setListening] = useState(false);
  const [voiceError, setVoiceError] = useState(null);

  const recognizerRef = useRef(null);
  // Snapshot of the textarea contents at the moment listening started.
  // Each interim transcript replaces only the appended portion, so the user's
  // existing text never gets clobbered.
  const baselineRef = useRef('');

  const voiceOk = isVoiceSupported();
  const apiOk = isApiConfigured();

  // Persist the language toggle so it remembers across sessions.
  useEffect(() => {
    try {
      localStorage.setItem(LANG_KEY, lang);
    } catch {
      // ignore quota errors
    }
  }, [lang]);

  // If we're listening and the user changes language, restart the recognizer
  // with the new lang code so the next words go through the right model.
  useEffect(() => {
    if (!listening) return;
    stopListening();
    // small delay so onend fires before we start again
    const t = setTimeout(() => startListening(), 100);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  // Stop the recognizer if the component unmounts mid-recording.
  useEffect(() => {
    return () => {
      if (recognizerRef.current) {
        try {
          recognizerRef.current.stop();
        } catch {
          // ignore
        }
        recognizerRef.current = null;
      }
    };
  }, []);

  function startListening() {
    if (!voiceOk) return;
    setVoiceError(null);
    try {
      baselineRef.current = text ? text + ' ' : '';
      const r = createRecognizer({
        lang: lang === 'pl' ? 'pl-PL' : 'en-US',
        onTranscript: (chunk) => {
          setText(baselineRef.current + chunk);
        },
        onError: (errString) => {
          setVoiceError(errString);
          setListening(false);
        },
        onEnd: () => {
          setListening(false);
        },
      });
      recognizerRef.current = r;
      r.start();
      setListening(true);
    } catch (err) {
      setVoiceError(err.message || 'Could not start microphone');
      setListening(false);
    }
  }

  function stopListening() {
    if (recognizerRef.current) {
      try {
        recognizerRef.current.stop();
      } catch {
        // ignore
      }
    }
    setListening(false);
  }

  function toggleListening() {
    if (listening) stopListening();
    else startListening();
  }

  function handleSave() {
    const trimmed = text.trim();
    if (!trimmed) return;
    if (!skillCategory) return;

    // 1. Stop any active mic.
    if (listening) stopListening();

    // 2. Build optional source object — only keep it if both fields filled.
    const bookTrim = sourceBook.trim();
    const authorTrim = sourceAuthor.trim();
    const source = bookTrim && authorTrim ? { book: bookTrim, author: authorTrim } : null;

    // 3. Save the raw capture immediately so it appears in the next drill.
    const saved = saveCapturedScenario({
      situation: trimmed,
      skillCategory,
      source,
      status: 'raw',
      sourceLang: lang,
    });

    // 4. Kick off Claude generation in the background. Don't await it.
    //    The user navigates back to the menu instantly.
    if (apiOk) {
      generateScenarioFromCapture({ rawText: trimmed, skillCategory, sourceLang: lang })
        .then((generated) => {
          updateCapturedScenario(saved.id, {
            ...generated,
            status: 'ready',
          });
        })
        .catch((err) => {
          console.warn('[capture] Claude generation failed, leaving as raw:', err);
          // Leave the capture in 'raw' status — it's still drillable in Tier 2.
        });
    }

    // 5. Navigate back to menu immediately.
    onBack();
  }

  const canSave = text.trim().length > 0 && !!skillCategory;

  return (
    <div
      style={{
        maxWidth: 480,
        margin: '0 auto',
        padding: `${spacing.lg}px 20px ${spacing.xxl}px 20px`,
        minHeight: '100vh',
        background: colors.bg,
      }}
    >
      {/* Top bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: spacing.xl,
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            color: colors.textDim,
            fontFamily: fonts.sans,
            fontSize: fontSizes.meta,
            cursor: 'pointer',
            padding: '4px 8px 4px 0',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <span style={{ fontSize: 18, lineHeight: 1 }}>←</span> Back
        </button>
        <span
          style={{
            fontFamily: fonts.sans,
            fontSize: fontSizes.eyebrow,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: colors.textDim,
          }}
        >
          Capture
        </span>
      </div>

      {/* Hero */}
      <h1
        style={{
          fontFamily: fonts.serif,
          fontSize: fontSizes.h2,
          fontWeight: 700,
          color: colors.textPrimary,
          margin: `0 0 ${spacing.xs}px 0`,
          lineHeight: 1.2,
        }}
      >
        Capture a moment
      </h1>
      <p
        style={{
          fontFamily: fonts.serif,
          fontSize: fontSizes.bodyLg,
          color: colors.textMuted,
          margin: `0 0 ${spacing.lg}px 0`,
          lineHeight: 1.5,
        }}
      >
        What just happened? What was said?
      </p>

      {/* Textarea */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Just dump it. What was said, what you felt, what you wish you'd said..."
        rows={6}
        style={{
          width: '100%',
          padding: '16px 18px',
          background: colors.surface,
          border: `1px solid ${listening ? colors.accent : colors.border}`,
          borderRadius: radii.lg,
          color: colors.textBody,
          fontFamily: fonts.serif,
          fontSize: fontSizes.bodyLg,
          lineHeight: 1.6,
          resize: 'vertical',
          outline: 'none',
          boxSizing: 'border-box',
          minHeight: 180,
          transition: 'border-color 0.2s, box-shadow 0.2s',
          boxShadow: listening ? `0 0 0 4px ${colors.accentSoft}` : 'none',
        }}
        onFocus={(e) => {
          if (!listening) e.currentTarget.style.borderColor = colors.accent;
        }}
        onBlur={(e) => {
          if (!listening) e.currentTarget.style.borderColor = colors.border;
        }}
      />

      {/* Mic + lang toggle row */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: spacing.sm,
          marginTop: spacing.sm + 4,
        }}
      >
        {/* Lang pill */}
        <div
          style={{
            display: 'flex',
            background: colors.surface,
            border: `1px solid ${colors.border}`,
            borderRadius: radii.pill,
            padding: 2,
          }}
        >
          {['en', 'pl'].map((l) => {
            const sel = lang === l;
            return (
              <button
                key={l}
                onClick={() => setLang(l)}
                style={{
                  padding: '4px 12px',
                  background: sel ? colors.accent : 'transparent',
                  color: sel ? colors.bg : colors.textDim,
                  border: 'none',
                  borderRadius: radii.pill,
                  fontFamily: fonts.sans,
                  fontSize: fontSizes.label,
                  fontWeight: 600,
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  transition: 'all 0.15s',
                }}
              >
                {l}
              </button>
            );
          })}
        </div>

        {/* Mic button */}
        <button
          onClick={toggleListening}
          disabled={!voiceOk}
          title={voiceOk ? (listening ? 'Stop' : 'Speak') : 'Voice not supported in this browser'}
          style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: listening ? colors.accent : colors.surface,
            border: `1px solid ${listening ? colors.accent : colors.border}`,
            color: listening ? colors.bg : voiceOk ? colors.textBody : colors.textVeryDim,
            cursor: voiceOk ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.15s',
            boxShadow: listening ? `0 0 0 6px ${colors.accentSoft}` : 'none',
          }}
        >
          <IconMic size={20} />
        </button>
      </div>

      {/* Voice error */}
      {voiceError && (
        <p
          style={{
            marginTop: spacing.sm,
            fontFamily: fonts.sans,
            fontSize: fontSizes.label,
            color: colors.scoreRed,
            textAlign: 'right',
          }}
        >
          Mic error: {voiceError}
        </p>
      )}

      {/* Skill picker — required. User owns this choice, not Claude. */}
      <div style={{ marginTop: spacing.lg }}>
        <p
          style={{
            fontFamily: fonts.sans,
            fontSize: fontSizes.eyebrow,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: colors.textDim,
            margin: `0 0 ${spacing.sm}px 0`,
          }}
        >
          What does this help you improve?
        </p>
        <div
          style={{
            display: 'flex',
            gap: spacing.sm,
            overflowX: 'auto',
            paddingBottom: 4,
            marginLeft: -4,
            marginRight: -4,
            paddingLeft: 4,
            paddingRight: 4,
            scrollbarWidth: 'thin',
          }}
        >
          {SKILL_CATEGORIES.map((skill) => {
            const selected = skillCategory === skill;
            return (
              <button
                key={skill}
                onClick={() => setSkillCategory(skill)}
                style={{
                  flexShrink: 0,
                  padding: '8px 14px',
                  background: selected ? colors.accent : colors.surface,
                  color: selected ? colors.bg : colors.textCool,
                  border: `1px solid ${selected ? colors.accent : colors.border}`,
                  borderRadius: radii.pill,
                  fontFamily: fonts.sans,
                  fontSize: fontSizes.meta,
                  fontWeight: 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s',
                }}
              >
                {skill}
              </button>
            );
          })}
        </div>
      </div>

      {/* Optional source — collapsed by default */}
      <div style={{ marginTop: spacing.md }}>
        {!sourceOpen ? (
          <button
            onClick={() => setSourceOpen(true)}
            style={{
              background: 'none',
              border: 'none',
              color: colors.textDim,
              fontFamily: fonts.sans,
              fontSize: fontSizes.label,
              cursor: 'pointer',
              padding: '4px 0',
              textDecoration: 'underline',
              textUnderlineOffset: 3,
            }}
          >
            + Add book &amp; author (optional)
          </button>
        ) : (
          <div
            style={{
              background: colors.surface,
              border: `1px solid ${colors.border}`,
              borderRadius: radii.md,
              padding: '12px 14px',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: spacing.sm,
              }}
            >
              <span
                style={{
                  fontFamily: fonts.sans,
                  fontSize: fontSizes.eyebrow,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: colors.textDim,
                }}
              >
                Source (optional)
              </span>
              <button
                onClick={() => {
                  setSourceOpen(false);
                  setSourceBook('');
                  setSourceAuthor('');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: colors.textVeryDim,
                  fontFamily: fonts.sans,
                  fontSize: fontSizes.label,
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                remove
              </button>
            </div>
            <input
              type="text"
              value={sourceBook}
              onChange={(e) => setSourceBook(e.target.value)}
              placeholder="Book title"
              style={{
                width: '100%',
                padding: '8px 12px',
                background: colors.bg,
                border: `1px solid ${colors.border}`,
                borderRadius: radii.sm,
                color: colors.textBody,
                fontFamily: fonts.sans,
                fontSize: fontSizes.meta,
                outline: 'none',
                boxSizing: 'border-box',
                marginBottom: spacing.xs + 2,
              }}
            />
            <input
              type="text"
              value={sourceAuthor}
              onChange={(e) => setSourceAuthor(e.target.value)}
              placeholder="Author"
              style={{
                width: '100%',
                padding: '8px 12px',
                background: colors.bg,
                border: `1px solid ${colors.border}`,
                borderRadius: radii.sm,
                color: colors.textBody,
                fontFamily: fonts.sans,
                fontSize: fontSizes.meta,
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
        )}
      </div>

      {/* Save & process button */}
      <button
        onClick={handleSave}
        disabled={!canSave}
        style={{
          width: '100%',
          marginTop: spacing.xl,
          padding: '18px 24px',
          background: canSave ? colors.accent : colors.surface,
          color: canSave ? colors.bg : colors.textDim,
          border: canSave ? 'none' : `1px solid ${colors.border}`,
          borderRadius: radii.md,
          fontSize: 16,
          fontFamily: fonts.sans,
          fontWeight: 600,
          cursor: canSave ? 'pointer' : 'not-allowed',
          transition: 'transform 0.15s, box-shadow 0.15s',
          boxShadow: canSave ? `0 6px 20px ${colors.accentSoft}` : 'none',
        }}
        onMouseOver={(e) => {
          if (canSave) {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = `0 10px 28px ${colors.accentSoft}`;
          }
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          if (canSave) e.currentTarget.style.boxShadow = `0 6px 20px ${colors.accentSoft}`;
        }}
      >
        Save & process
      </button>

      {!apiOk && (
        <p
          style={{
            marginTop: spacing.md,
            fontFamily: fonts.sans,
            fontSize: fontSizes.label,
            color: colors.textVeryDim,
            textAlign: 'center',
            lineHeight: 1.5,
          }}
        >
          Heads up: API key not set, so Claude won't process this capture into a polished scenario. The raw text will still be drillable.
        </p>
      )}
    </div>
  );
}
