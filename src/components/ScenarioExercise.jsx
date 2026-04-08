import { useState, useEffect, useRef } from 'react';
import {
  colors,
  fonts,
  fontSizes,
  spacing,
  radii,
  colorForScore,
  borderForScore,
  labelForScore,
  headlineForScore,
} from '../styles/theme';
import { shuffle } from '../utils/shuffle';
import { scoreOpenResponse } from '../utils/claudeApi';

const TIER3_SECONDS = 30;
const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

// ScenarioExercise — practice loop for all three tiers.
// Props:
//   scenarios: Array of scenario objects (already filtered + outer-shuffled).
//   tier: 'tier1' (multiple choice) | 'tier2' (open text) | 'tier3' (timed open text)
//   onExit(): called when user taps the Exit link.
//   onComplete(results): called after the last scenario.
export default function ScenarioExercise({ scenarios, tier = 'tier1', onExit, onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState([]);

  // Tier 1 state
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState([]);

  // Tier 2/3 state
  const [openText, setOpenText] = useState('');
  const [scoringStatus, setScoringStatus] = useState('idle'); // idle | loading | done | error
  const [scoredResult, setScoredResult] = useState(null);
  const [scoringError, setScoringError] = useState(null);
  const [showIdeal, setShowIdeal] = useState(false);

  // Tier 3 state
  const [secondsLeft, setSecondsLeft] = useState(TIER3_SECONDS);
  const [timeExpired, setTimeExpired] = useState(false);
  const submittedRef = useRef(false);

  const feedbackRef = useRef(null);
  const current = scenarios[currentIndex];
  // Captures (and any scenario with no MC options) cannot run Tier 1.
  // Force them onto Tier 2 even if the surrounding session is Tier 1.
  const hasOptions = Boolean(current?.options && current.options.length > 0);
  const effectiveTier = !hasOptions && tier === 'tier1' ? 'tier2' : tier;
  const isOpenText = effectiveTier === 'tier2' || effectiveTier === 'tier3';
  const isTimed = effectiveTier === 'tier3';
  const hasPrinciple = Boolean(current?.principle);
  const isRawCapture = current?.isCapture && current?.status === 'raw';

  // Re-shuffle the options every time we land on a new scenario (Tier 1).
  useEffect(() => {
    if (current && effectiveTier === 'tier1' && hasOptions) {
      setShuffledOptions(shuffle(current.options));
    }
  }, [currentIndex, current, effectiveTier, hasOptions]);

  // Reset all per-scenario state on advance.
  useEffect(() => {
    setSelectedOption(null);
    setShowFeedback(false);
    setOpenText('');
    setScoringStatus('idle');
    setScoredResult(null);
    setScoringError(null);
    setShowIdeal(false);
    setSecondsLeft(TIER3_SECONDS);
    setTimeExpired(false);
    submittedRef.current = false;
  }, [currentIndex]);

  // Tier 3 countdown timer.
  useEffect(() => {
    if (!isTimed) return;
    if (scoringStatus !== 'idle') return; // freeze once we submit
    if (secondsLeft <= 0) {
      setTimeExpired(true);
      // Auto-submit whatever is in the textarea (even if empty).
      if (!submittedRef.current) {
        submittedRef.current = true;
        handleSubmitOpenText();
      }
      return;
    }
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft, isTimed, scoringStatus]);

  // ---------- Tier 1 handlers ----------
  const handleSelect = (option, idx) => {
    if (showFeedback) return;
    setSelectedOption({ ...option, idx });
    setShowFeedback(true);
    setResults((prev) => [
      ...prev,
      {
        scenario: current,
        chosen: option,
        maxScore: 3,
      },
    ]);
    setTimeout(() => {
      feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  // ---------- Tier 2/3 handlers ----------
  const handleSubmitOpenText = async () => {
    if (scoringStatus === 'loading') return;
    submittedRef.current = true;
    setScoringStatus('loading');
    setScoringError(null);
    try {
      const result = await scoreOpenResponse({
        scenario: current,
        userResponse: openText,
      });
      setScoredResult(result);
      setScoringStatus('done');
      setResults((prev) => [
        ...prev,
        {
          scenario: current,
          chosen: {
            text: openText.trim() || '(no response)',
            score: result.score,
            feedback: result.feedback,
          },
          openText: openText.trim(),
          scoredResult: result,
          maxScore: 3,
          isOpenText: true,
        },
      ]);
      setTimeout(() => {
        feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    } catch (err) {
      setScoringError(err.message || 'Something went wrong calling Claude.');
      setScoringStatus('error');
    }
  };

  const retryScoring = () => {
    setScoringStatus('idle');
    setScoringError(null);
    submittedRef.current = false;
  };

  // ---------- Shared advance ----------
  const nextScenario = () => {
    if (currentIndex + 1 >= scenarios.length) {
      onComplete([...results]);
      return;
    }
    setCurrentIndex((prev) => prev + 1);
  };

  if (!current) return null;

  const tierLabel =
    effectiveTier === 'tier1' ? 'Quick' : effectiveTier === 'tier2' ? 'Type it' : 'Timed';
  const progressPct = ((currentIndex + 1) / scenarios.length) * 100;
  // Show the subSkill (Fisher tactic name like "DE-ESCALATION") when present —
  // that's the interesting label during a drill, not the top-level skillCategory.
  // Fall back to skillCategory for captures with no Claude-inferred subSkill yet.
  const categoryLabel =
    current.subSkill || current.skillCategory || (isRawCapture ? 'Captured' : '');
  const sourceChip = current.source
    ? `${current.source.author} · ${current.source.book}`
    : null;

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
      {/* Top bar — back arrow + n / total */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: spacing.md,
        }}
      >
        <button
          onClick={onExit}
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
          <span style={{ fontSize: 18, lineHeight: 1 }}>←</span> Exit
        </button>
        <span
          style={{
            fontFamily: fonts.sans,
            fontSize: fontSizes.meta,
            color: colors.textDim,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {currentIndex + 1} <span style={{ color: colors.textVeryDim }}>/ {scenarios.length}</span>
        </span>
      </div>

      {/* Slim progress bar */}
      <div
        style={{
          height: 3,
          background: colors.surfaceAlt,
          borderRadius: radii.pill,
          overflow: 'hidden',
          marginBottom: spacing.lg,
        }}
      >
        <div
          style={{
            width: `${progressPct}%`,
            height: '100%',
            background: colors.accent,
            transition: 'width 0.4s ease',
          }}
        />
      </div>

      {/* Category pill + tier badge */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: spacing.sm,
          marginBottom: spacing.lg,
          flexWrap: 'wrap',
        }}
      >
        {categoryLabel && (
          <span
            style={{
              fontFamily: fonts.sans,
              fontSize: fontSizes.label,
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: colors.accent,
              background: colors.surfaceAlt,
              border: `1px solid ${colors.accentBorder}`,
              padding: '5px 12px',
              borderRadius: radii.pill,
            }}
          >
            {categoryLabel}
          </span>
        )}
        <span
          style={{
            fontFamily: fonts.sans,
            fontSize: fontSizes.label,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: colors.textDim,
            border: `1px solid ${colors.border}`,
            padding: '5px 12px',
            borderRadius: radii.pill,
          }}
        >
          {tierLabel}
        </span>
        {isRawCapture && (
          <span
            style={{
              fontFamily: fonts.sans,
              fontSize: fontSizes.label,
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: colors.accent,
            }}
          >
            Your capture
          </span>
        )}
      </div>

      {/* Source attribution chip — only when scenario has a source */}
      {sourceChip && (
        <p
          style={{
            fontFamily: fonts.sans,
            fontSize: fontSizes.label,
            color: colors.textVeryDim,
            textAlign: 'center',
            margin: `-${spacing.sm + 2}px 0 ${spacing.lg}px 0`,
            letterSpacing: '0.02em',
          }}
        >
          {sourceChip}
        </p>
      )}

      {/* Principle — only when present */}
      {hasPrinciple && (
        <div style={{ textAlign: 'center', marginBottom: spacing.lg }}>
          <p
            style={{
              fontFamily: fonts.sans,
              fontSize: fontSizes.eyebrow,
              color: colors.textVeryDim,
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              margin: `0 0 ${spacing.xs}px 0`,
            }}
          >
            Principle
          </p>
          <p
            style={{
              fontFamily: fonts.serif,
              fontSize: fontSizes.bodyLg,
              fontStyle: 'italic',
              color: colors.textMuted,
              margin: 0,
              lineHeight: 1.5,
              maxWidth: 420,
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            "{current.principle}"
          </p>
        </div>
      )}

      {/* Scenario card — big centered serif, no border */}
      <div
        style={{
          textAlign: 'center',
          padding: `${spacing.lg}px 4px ${spacing.xl}px 4px`,
        }}
      >
        <p
          style={{
            fontFamily: fonts.serif,
            fontSize: fontSizes.scenarioLg,
            lineHeight: 1.45,
            color: colors.textPrimary,
            margin: 0,
            fontWeight: 500,
          }}
        >
          {current.situation}
        </p>
      </div>

      {/* Tier 3 timer */}
      {isTimed && scoringStatus === 'idle' && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 14px',
            background: colors.surfaceAlt,
            border: `1px solid ${secondsLeft <= 5 ? colors.scoreRedBorder : colors.border}`,
            borderRadius: radii.md,
            marginBottom: spacing.md,
          }}
        >
          <span
            style={{
              fontFamily: fonts.sans,
              fontSize: fontSizes.label,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: colors.textDim,
            }}
          >
            Time on the clock
          </span>
          <span
            style={{
              fontFamily: fonts.sans,
              fontSize: 22,
              fontWeight: 700,
              color: secondsLeft <= 5 ? colors.scoreRed : colors.textPrimary,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {String(Math.max(0, secondsLeft)).padStart(2, '0')}s
          </span>
        </div>
      )}

      {/* ---------- Tier 1: multiple choice with letter circles ---------- */}
      {effectiveTier === 'tier1' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm + 2 }}>
          {shuffledOptions.map((option, idx) => {
            const isSelected = selectedOption?.idx === idx;
            const isPerfect = showFeedback && option.score === 3;
            const letter = OPTION_LETTERS[idx] || String(idx + 1);

            let borderColor = colors.border;
            let bg = colors.surface;
            let circleBg = colors.surfaceAlt;
            let circleColor = colors.textBody;
            let circleBorder = colors.border;
            let textColor = colors.textBody;

            if (isSelected && showFeedback) {
              borderColor = colorForScore(option.score);
              bg = colors.surfaceFeedbackPositive;
              circleBg = colorForScore(option.score);
              circleColor = colors.bg;
              circleBorder = colorForScore(option.score);
            } else if (!isSelected && isPerfect) {
              borderColor = colors.scoreGreenBorder;
              circleBorder = colors.scoreGreenBorder;
              circleColor = colors.scoreGreen;
            } else if (showFeedback && !isSelected) {
              textColor = colors.textVeryDim;
              circleColor = colors.textVeryDim;
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(option, idx)}
                disabled={showFeedback}
                style={{
                  padding: '14px 16px',
                  background: bg,
                  border: `1px solid ${borderColor}`,
                  borderRadius: radii.lg,
                  color: textColor,
                  fontFamily: fonts.serif,
                  fontSize: fontSizes.bodyLg,
                  lineHeight: 1.5,
                  cursor: showFeedback ? 'default' : 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                  opacity: showFeedback && !isSelected && !isPerfect ? 0.45 : 1,
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: spacing.md,
                  position: 'relative',
                }}
                onMouseOver={(e) => {
                  if (!showFeedback) {
                    e.currentTarget.style.borderColor = colors.accent;
                    const circle = e.currentTarget.querySelector('[data-letter-circle]');
                    if (circle) {
                      circle.style.background = colors.accent;
                      circle.style.color = colors.bg;
                      circle.style.borderColor = colors.accent;
                    }
                  }
                }}
                onMouseOut={(e) => {
                  if (!showFeedback) {
                    e.currentTarget.style.borderColor = colors.border;
                    const circle = e.currentTarget.querySelector('[data-letter-circle]');
                    if (circle) {
                      circle.style.background = colors.surfaceAlt;
                      circle.style.color = colors.textBody;
                      circle.style.borderColor = colors.border;
                    }
                  }
                }}
              >
                <span
                  data-letter-circle
                  style={{
                    flexShrink: 0,
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: circleBg,
                    border: `1px solid ${circleBorder}`,
                    color: circleColor,
                    fontFamily: fonts.serif,
                    fontSize: 15,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s',
                  }}
                >
                  {letter}
                </span>
                <span style={{ flex: 1, paddingTop: 5 }}>{option.text}</span>
                {showFeedback && isSelected && (
                  <span
                    style={{
                      position: 'absolute',
                      top: 10,
                      right: 14,
                      fontFamily: fonts.sans,
                      fontSize: fontSizes.eyebrow,
                      fontWeight: 700,
                      color: colorForScore(option.score),
                      letterSpacing: '0.05em',
                    }}
                  >
                    {labelForScore(option.score)}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* ---------- Tier 2/3: open text ---------- */}
      {isOpenText && (
        <>
          <p
            style={{
              fontFamily: fonts.sans,
              fontSize: fontSizes.eyebrow,
              color: colors.textVeryDim,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              margin: `0 0 ${spacing.sm}px 0`,
              textAlign: 'center',
            }}
          >
            Type what you'd actually say
          </p>

          <textarea
            value={openText}
            onChange={(e) => setOpenText(e.target.value)}
            disabled={scoringStatus !== 'idle'}
            placeholder={
              isTimed
                ? 'Clock is ticking. First instinct, no rewriting...'
                : 'Take your time. Write the words you would actually say out loud.'
            }
            rows={5}
            style={{
              width: '100%',
              padding: '14px 16px',
              background: colors.surface,
              border: `1px solid ${colors.border}`,
              borderRadius: radii.lg,
              color: colors.textBody,
              fontFamily: fonts.serif,
              fontSize: fontSizes.bodyLg,
              lineHeight: 1.6,
              resize: 'vertical',
              outline: 'none',
              boxSizing: 'border-box',
              minHeight: 120,
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = colors.accent)}
            onBlur={(e) => (e.currentTarget.style.borderColor = colors.border)}
          />

          {scoringStatus === 'idle' && (
            <button
              onClick={handleSubmitOpenText}
              disabled={!openText.trim() && !timeExpired}
              style={{
                width: '100%',
                marginTop: spacing.md,
                padding: '16px',
                background: openText.trim() ? colors.accent : colors.surface,
                color: openText.trim() ? colors.bg : colors.textDim,
                border: openText.trim() ? 'none' : `1px solid ${colors.border}`,
                borderRadius: radii.md,
                fontSize: fontSizes.bodyLg,
                fontFamily: fonts.sans,
                fontWeight: 600,
                cursor: openText.trim() ? 'pointer' : 'not-allowed',
                boxShadow: openText.trim() ? `0 6px 20px ${colors.accentSoft}` : 'none',
                transition: 'all 0.15s',
              }}
            >
              Score my response
            </button>
          )}

          {scoringStatus === 'loading' && (
            <div
              style={{
                marginTop: spacing.md,
                padding: spacing.lg,
                background: colors.surfaceAlt,
                border: `1px solid ${colors.border}`,
                borderRadius: radii.lg,
                fontFamily: fonts.sans,
                fontSize: fontSizes.body,
                color: colors.textMuted,
                textAlign: 'center',
              }}
            >
              Claude is reading your response...
            </div>
          )}

          {scoringStatus === 'error' && (
            <div
              style={{
                marginTop: spacing.md,
                padding: spacing.lg,
                background: colors.surfaceAlt,
                border: `1px solid ${colors.scoreRedBorder}`,
                borderRadius: radii.lg,
                fontFamily: fonts.sans,
                fontSize: fontSizes.body,
                color: colors.scoreRed,
                lineHeight: 1.5,
              }}
            >
              <div style={{ marginBottom: spacing.sm, fontWeight: 600 }}>Scoring failed</div>
              <div style={{ color: colors.textMuted, marginBottom: spacing.md }}>
                {scoringError}
              </div>
              <button
                onClick={retryScoring}
                style={{
                  padding: '10px 16px',
                  background: colors.accent,
                  color: colors.bg,
                  border: 'none',
                  borderRadius: radii.md,
                  fontFamily: fonts.sans,
                  fontSize: fontSizes.body,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Try again
              </button>
            </div>
          )}
        </>
      )}

      {/* ---------- Feedback card (Tier 1) ---------- */}
      {effectiveTier === 'tier1' && showFeedback && selectedOption && (() => {
        const perfectOption = shuffledOptions.find((o) => o.score === 3);
        const showBetter = selectedOption.score < 3 && perfectOption;
        return (
          <div
            ref={feedbackRef}
            style={{
              marginTop: 20,
              padding: spacing.lg,
              background: colors.surfaceFeedbackPositive,
              border: `1px solid ${borderForScore(selectedOption.score)}`,
              borderRadius: radii.xl,
            }}
          >
            <p
              style={{
                fontFamily: fonts.sans,
                fontSize: fontSizes.eyebrow,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: colorForScore(selectedOption.score),
                margin: '0 0 10px 0',
              }}
            >
              {headlineForScore(selectedOption.score)}
            </p>
            <p
              style={{
                fontFamily: fonts.serif,
                fontSize: fontSizes.bodyLg,
                lineHeight: 1.65,
                color: colors.textBody,
                margin: 0,
              }}
            >
              {selectedOption.feedback}
            </p>

            {showBetter && (
              <div
                style={{
                  marginTop: spacing.lg,
                  paddingTop: spacing.md,
                  borderTop: `1px solid ${colors.scoreGreenBorder}`,
                }}
              >
                <p
                  style={{
                    fontFamily: fonts.sans,
                    fontSize: fontSizes.eyebrow,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: colors.scoreGreen,
                    margin: `0 0 ${spacing.sm}px 0`,
                  }}
                >
                  Why the green answer works
                </p>
                <p
                  style={{
                    fontFamily: fonts.serif,
                    fontSize: fontSizes.bodyLg,
                    fontStyle: 'italic',
                    color: colors.textPrimary,
                    margin: `0 0 ${spacing.sm}px 0`,
                    lineHeight: 1.5,
                  }}
                >
                  "{perfectOption.text}"
                </p>
                <p
                  style={{
                    fontFamily: fonts.serif,
                    fontSize: fontSizes.bodyLg,
                    lineHeight: 1.65,
                    color: colors.textBody,
                    margin: 0,
                  }}
                >
                  {perfectOption.feedback}
                </p>
              </div>
            )}
          </div>
        );
      })()}

      {/* ---------- Feedback card (Tier 2/3) ---------- */}
      {isOpenText && scoringStatus === 'done' && scoredResult && (
        <div
          ref={feedbackRef}
          style={{
            marginTop: 20,
            padding: spacing.lg,
            background: colors.surfaceFeedbackPositive,
            border: `1px solid ${borderForScore(scoredResult.score)}`,
            borderRadius: radii.xl,
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 10,
            }}
          >
            <p
              style={{
                fontFamily: fonts.sans,
                fontSize: fontSizes.eyebrow,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: colorForScore(scoredResult.score),
                margin: 0,
              }}
            >
              {headlineForScore(scoredResult.score)} · {scoredResult.label}
            </p>
            <span
              style={{
                fontFamily: fonts.sans,
                fontSize: fontSizes.label,
                fontWeight: 700,
                color: colorForScore(scoredResult.score),
              }}
            >
              {scoredResult.score} / 3
            </span>
          </div>

          <p
            style={{
              fontFamily: fonts.serif,
              fontSize: fontSizes.bodyLg,
              lineHeight: 1.65,
              color: colors.textBody,
              margin: `0 0 ${spacing.md}px 0`,
            }}
          >
            {scoredResult.feedback}
          </p>

          {/* Pillar breakdown */}
          {scoredResult.pillars && (
            <div
              style={{
                display: 'flex',
                gap: spacing.sm,
                marginBottom: spacing.md,
                flexWrap: 'wrap',
              }}
            >
              {['control', 'confidence', 'connection'].map((p) => {
                const hit = scoredResult.pillars[p] === 'hit';
                return (
                  <span
                    key={p}
                    style={{
                      padding: '5px 10px',
                      borderRadius: radii.pill,
                      fontFamily: fonts.sans,
                      fontSize: fontSizes.label,
                      letterSpacing: '0.05em',
                      textTransform: 'capitalize',
                      background: hit ? colors.scoreGreenBorder : colors.surfaceAlt,
                      color: hit ? colors.scoreGreen : colors.textVeryDim,
                      border: `1px solid ${hit ? colors.scoreGreenBorder : colors.border}`,
                    }}
                  >
                    {hit ? '✓' : '·'} {p}
                  </span>
                );
              })}
            </div>
          )}

          {/* Reveal ideal response — only if the scenario has one (raw captures may not). */}
          {current.idealResponse && (
            <button
              onClick={() => setShowIdeal((v) => !v)}
              style={{
                background: 'none',
                border: 'none',
                color: colors.accent,
                fontFamily: fonts.sans,
                fontSize: fontSizes.meta,
                cursor: 'pointer',
                padding: 0,
                textDecoration: 'underline',
                textUnderlineOffset: 3,
              }}
            >
              {showIdeal ? "Hide Fisher's benchmark" : 'See what Fisher would say'}
            </button>
          )}

          {showIdeal && current.idealResponse && (
            <div
              style={{
                marginTop: spacing.md,
                padding: spacing.md,
                background: colors.surfaceAlt,
                borderLeft: `2px solid ${colors.accent}`,
                borderRadius: radii.sm,
              }}
            >
              <p
                style={{
                  fontFamily: fonts.sans,
                  fontSize: fontSizes.eyebrow,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: colors.textVeryDim,
                  margin: `0 0 ${spacing.sm}px 0`,
                }}
              >
                Benchmark response
              </p>
              <p
                style={{
                  fontFamily: fonts.serif,
                  fontSize: fontSizes.bodyLg,
                  lineHeight: 1.65,
                  color: colors.textBody,
                  fontStyle: 'italic',
                  margin: 0,
                }}
              >
                {current.idealResponse}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Next button — appears after any tier scores */}
      {((effectiveTier === 'tier1' && showFeedback) ||
        (isOpenText && scoringStatus === 'done')) && (
        <button
          onClick={nextScenario}
          style={{
            width: '100%',
            marginTop: 20,
            padding: '16px',
            background: colors.accent,
            color: colors.bg,
            border: 'none',
            borderRadius: radii.md,
            fontSize: fontSizes.bodyLg,
            fontFamily: fonts.sans,
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: `0 6px 20px ${colors.accentSoft}`,
          }}
        >
          {currentIndex + 1 >= scenarios.length ? 'See results' : 'Next scenario'}
        </button>
      )}
    </div>
  );
}
