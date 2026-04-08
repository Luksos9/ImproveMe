import { useState } from 'react';
import { colors, fonts, fontSizes, spacing, radii } from '../styles/theme';
import { SKILL_CATEGORIES } from '../data/fisher-scenarios';
import {
  ALL_SEED_SCENARIOS,
  getSourceOptions,
  matchesSource,
  supportsTier,
} from '../data/all-scenarios';
import { getCapturedScenarios } from '../utils/storage';
import { isApiConfigured } from '../utils/claudeApi';
import { previewCaptureCount } from '../utils/dailyDrill';

const TIERS = [
  {
    id: 'tier1',
    label: 'Quick',
    blurb: 'Multiple choice. Pick the best response. Instant feedback.',
  },
  {
    id: 'tier2',
    label: 'Type it',
    blurb: 'Open text. Type your real response. Claude scores it against the Fisher framework.',
  },
  {
    id: 'tier3',
    label: 'Timed',
    blurb: '30 seconds on the clock. Type fast, no second-guessing, just like a real conversation.',
  },
];

export default function Drill({ onStart, onDailyDrill, onCapture }) {
  const [tier, setTier] = useState('tier1');
  const [sourceAuthor, setSourceAuthor] = useState(null);

  const apiOk = isApiConfigured();
  const tierBlurb = TIERS.find((t) => t.id === tier)?.blurb || '';
  const tierNeedsApi = (tier === 'tier2' || tier === 'tier3') && !apiOk;
  const drillNeedsApi = !apiOk;
  const showApiWarning = !apiOk;
  const drillCaptureCount = previewCaptureCount();

  const captured = getCapturedScenarios();
  const allScenarios = [...ALL_SEED_SCENARIOS, ...captured];
  const sourceOptions = getSourceOptions(ALL_SEED_SCENARIOS);
  const sourceScoped = allScenarios.filter((scenario) => matchesSource(scenario, sourceAuthor));
  const tierEligible = sourceScoped.filter((scenario) => supportsTier(scenario, tier));
  const allCount = sourceScoped.length;
  const allDisabled = tierEligible.length === 0 || tierNeedsApi;

  return (
    <div style={{ padding: `${spacing.xl}px 20px ${spacing.lg}px 20px` }}>
      <div style={{ marginBottom: spacing.xl }}>
        <p
          style={{
            fontFamily: fonts.sans,
            fontSize: fontSizes.eyebrow,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: colors.textDim,
            marginBottom: spacing.sm + 4,
          }}
        >
          Drill
        </p>
        <h1
          style={{
            fontFamily: fonts.serif,
            fontSize: fontSizes.h1,
            fontWeight: 700,
            lineHeight: 1.15,
            margin: `0 0 ${spacing.md}px 0`,
            color: colors.textPrimary,
          }}
        >
          The next
          <br />
          conversation
        </h1>
        <p
          style={{
            fontFamily: fonts.serif,
            fontSize: fontSizes.scenario,
            lineHeight: 1.6,
            color: colors.textMuted,
            margin: 0,
          }}
        >
          Capture moments from your life. Drill them daily until the next conversation goes the way you want.
        </p>
      </div>

      <button
        onClick={onDailyDrill}
        disabled={drillNeedsApi}
        style={{
          width: '100%',
          padding: '20px 24px',
          background: drillNeedsApi ? colors.surface : colors.accent,
          color: drillNeedsApi ? colors.textDim : colors.bg,
          border: drillNeedsApi ? `1px solid ${colors.border}` : 'none',
          borderRadius: radii.md,
          fontFamily: fonts.sans,
          fontWeight: 600,
          cursor: drillNeedsApi ? 'not-allowed' : 'pointer',
          marginBottom: spacing.sm + 4,
          textAlign: 'left',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 4,
          transition: 'transform 0.15s, box-shadow 0.15s',
          boxShadow: drillNeedsApi ? 'none' : `0 6px 20px ${colors.accentSoft}`,
        }}
        onMouseOver={(e) => {
          if (!drillNeedsApi) {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = `0 10px 28px ${colors.accentSoft}`;
          }
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          if (!drillNeedsApi) e.currentTarget.style.boxShadow = `0 6px 20px ${colors.accentSoft}`;
        }}
      >
        <span style={{ fontSize: 17 }}>Daily drill (5)</span>
        <span
          style={{
            fontSize: fontSizes.label,
            fontWeight: 500,
            opacity: 0.85,
            textTransform: 'none',
            letterSpacing: 0,
          }}
        >
          {drillCaptureCount > 0
            ? `${drillCaptureCount} from your life`
            : 'Fisher seeds only. Capture a moment to personalize.'}
        </span>
      </button>

      <button
        onClick={onCapture}
        style={{
          width: '100%',
          padding: '16px 24px',
          background: 'transparent',
          color: colors.accent,
          border: `1px solid ${colors.accent}`,
          borderRadius: radii.md,
          fontFamily: fonts.sans,
          fontSize: fontSizes.bodyLg,
          fontWeight: 600,
          cursor: 'pointer',
          marginBottom: spacing.xl,
          transition: 'all 0.15s',
          textAlign: 'center',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background = colors.accentSoft;
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = 'transparent';
        }}
      >
        + Capture a moment
      </button>

      {showApiWarning && (
        <div
          style={{
            marginBottom: spacing.lg,
            padding: '10px 12px',
            background: colors.surfaceAlt,
            border: `1px solid ${colors.scoreYellowBorder}`,
            borderRadius: radii.md,
            fontFamily: fonts.sans,
            fontSize: fontSizes.label,
            color: colors.scoreYellow,
            lineHeight: 1.5,
          }}
        >
          API key not set. Edit <code>.env.local</code> and paste your <code>VITE_ANTHROPIC_API_KEY</code>, then restart the dev server. Tier 1 still works without it.
        </div>
      )}

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: spacing.md,
          margin: `${spacing.lg}px 0 ${spacing.lg}px 0`,
        }}
      >
        <div style={{ flex: 1, height: 1, background: colors.borderSubtle }} />
        <span
          style={{
            fontFamily: fonts.sans,
            fontSize: fontSizes.eyebrow,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: colors.textVeryDim,
          }}
        >
          more
        </span>
        <div style={{ flex: 1, height: 1, background: colors.borderSubtle }} />
      </div>

      <div style={{ marginBottom: spacing.lg }}>
        <p
          style={{
            fontFamily: fonts.sans,
            fontSize: fontSizes.eyebrow,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: colors.textVeryDim,
            marginBottom: spacing.sm,
          }}
        >
          Difficulty
        </p>
        <div style={{ display: 'flex', gap: spacing.sm, marginBottom: spacing.sm }}>
          {TIERS.map((t) => {
            const selected = tier === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTier(t.id)}
                style={{
                  flex: 1,
                  padding: '8px 10px',
                  background: selected ? colors.accent : colors.surface,
                  color: selected ? colors.bg : colors.textCool,
                  border: `1px solid ${selected ? colors.accent : colors.border}`,
                  borderRadius: radii.pill,
                  fontFamily: fonts.sans,
                  fontSize: fontSizes.meta,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {t.label}
              </button>
            );
          })}
        </div>
        <p
          style={{
            fontFamily: fonts.serif,
            fontSize: fontSizes.meta,
            lineHeight: 1.5,
            color: colors.textMuted,
            margin: 0,
            minHeight: 32,
          }}
        >
          {tierBlurb}
        </p>
        {(tier === 'tier2' || tier === 'tier3') && (
          <p
            style={{
              fontFamily: fonts.sans,
              fontSize: fontSizes.label,
              color: colors.textDim,
              margin: `${spacing.sm}px 0 0 0`,
              lineHeight: 1.5,
            }}
          >
            Open-text tiers currently use Fisher plus your captures.
          </p>
        )}
      </div>

      <div style={{ marginBottom: spacing.lg }}>
        <p
          style={{
            fontFamily: fonts.sans,
            fontSize: fontSizes.eyebrow,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: colors.textVeryDim,
            marginBottom: spacing.sm,
          }}
        >
          Source
        </p>
        <div
          style={{
            display: 'flex',
            gap: spacing.sm,
            flexWrap: 'wrap',
          }}
        >
          <button
            onClick={() => setSourceAuthor(null)}
            style={sourceChipStyle(sourceAuthor === null)}
          >
            All sources
          </button>
          {sourceOptions.map((source) => (
            <button
              key={source.key}
              onClick={() => setSourceAuthor(source.key)}
              style={sourceChipStyle(sourceAuthor === source.key)}
            >
              {source.label} ({source.count})
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => onStart(null, tier, sourceAuthor)}
        disabled={allDisabled}
        style={{
          width: '100%',
          padding: '12px 16px',
          background: 'transparent',
          color: allDisabled ? colors.textDim : colors.textCool,
          border: `1px dashed ${colors.border}`,
          borderRadius: radii.md,
          fontSize: fontSizes.body,
          fontFamily: fonts.sans,
          fontWeight: 500,
          cursor: allDisabled ? 'not-allowed' : 'pointer',
          marginBottom: spacing.lg,
          transition: 'border-color 0.15s, color 0.15s',
        }}
        onMouseOver={(e) => {
          if (!allDisabled) {
            e.currentTarget.style.borderColor = colors.accent;
            e.currentTarget.style.color = colors.accent;
          }
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.borderColor = colors.border;
          if (!allDisabled) e.currentTarget.style.color = colors.textCool;
        }}
      >
        All scenarios ({allCount})
      </button>

      <p
        style={{
          fontFamily: fonts.sans,
          fontSize: fontSizes.eyebrow,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: colors.textVeryDim,
          marginBottom: spacing.sm + 4,
        }}
      >
        Or pick a skill
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: spacing.sm,
        }}
      >
        {[...SKILL_CATEGORIES]
          .map((skill) => ({
            skill,
            count: sourceScoped.filter((s) => s.skillCategory === skill).length,
            tierCount: tierEligible.filter((s) => s.skillCategory === skill).length,
          }))
          .sort((a, b) => {
            if (a.count > 0 && b.count === 0) return -1;
            if (a.count === 0 && b.count > 0) return 1;
            return 0;
          })
          .map(({ skill, count, tierCount }) => {
            const empty = count === 0;
            const disabled = empty || tierCount === 0 || tierNeedsApi;
            return (
              <button
                key={skill}
                onClick={() => (empty ? null : onStart(skill, tier, sourceAuthor))}
                disabled={disabled}
                style={{
                  padding: '12px 14px',
                  background: colors.surface,
                  border: `1px solid ${empty ? colors.borderSubtle : colors.border}`,
                  borderRadius: radii.md,
                  color: disabled ? colors.textDim : colors.textCool,
                  fontFamily: fonts.sans,
                  fontSize: fontSizes.meta,
                  fontWeight: 500,
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 6,
                  transition: 'border-color 0.2s, color 0.2s',
                  opacity: empty ? 0.5 : tierNeedsApi ? 0.55 : 1,
                }}
                onMouseOver={(e) => {
                  if (!disabled) {
                    e.currentTarget.style.borderColor = colors.accent;
                    e.currentTarget.style.color = colors.accent;
                  }
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = empty ? colors.borderSubtle : colors.border;
                  if (!disabled) e.currentTarget.style.color = colors.textCool;
                }}
              >
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    minWidth: 0,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: empty ? colors.textVeryDim : colors.accent,
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {skill}
                  </span>
                </span>
                <span
                  style={{
                    color: colors.textVeryDim,
                    fontSize: fontSizes.label,
                    flexShrink: 0,
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
      </div>
    </div>
  );
}

function sourceChipStyle(selected) {
  return {
    padding: '8px 12px',
    background: selected ? colors.accent : colors.surface,
    color: selected ? colors.bg : colors.textCool,
    border: `1px solid ${selected ? colors.accent : colors.border}`,
    borderRadius: radii.pill,
    fontFamily: fonts.sans,
    fontSize: fontSizes.meta,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.15s',
  };
}
