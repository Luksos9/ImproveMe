import { colors, fonts, fontSizes, spacing, radii } from '../styles/theme';

// Results — end-of-session breakdown.
// Props:
//   results: Array of { scenario, chosen, maxScore }.
//   onRestart(): start a fresh "All scenarios" session.
//   onBackToMenu(): return to the menu screen.
export default function Results({ results, onRestart, onBackToMenu }) {
  const totalScore = results.reduce((sum, r) => sum + r.chosen.score, 0);
  const maxPossible = results.length * 3;
  const percentage = maxPossible > 0 ? Math.round((totalScore / maxPossible) * 100) : 0;

  let percentageColor = colors.scoreRed;
  if (percentage >= 80) percentageColor = colors.scoreGreen;
  else if (percentage >= 50) percentageColor = colors.scoreYellow;

  // Surface weak spots by sub-skill (the specific tactic, e.g. "The Pause")
  // rather than the top-level skillCategory — it's more actionable feedback.
  const weakCategories = Array.from(
    new Set(
      results
        .filter((r) => r.chosen.score < 3)
        .map((r) => r.scenario.subSkill || r.scenario.skillCategory)
        .filter(Boolean)
    )
  );

  return (
    <div
      style={{
        maxWidth: 480,
        margin: '0 auto',
        padding: `${spacing.xxl}px 20px ${spacing.xxl}px 20px`,
        minHeight: '100vh',
        background: colors.bg,
      }}
    >
      <p
        style={{
          fontFamily: fonts.sans,
          fontSize: fontSizes.eyebrow,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: colors.textDim,
          marginBottom: spacing.sm + 4,
          textAlign: 'center',
        }}
      >
        Session complete
      </p>

      <h2
        style={{
          fontFamily: fonts.serif,
          fontSize: fontSizes.resultsPercent,
          fontWeight: 700,
          color: percentageColor,
          margin: '0 0 4px 0',
          textAlign: 'center',
        }}
      >
        {percentage}%
      </h2>
      <p
        style={{
          fontFamily: fonts.sans,
          fontSize: fontSizes.body,
          color: colors.textDim,
          margin: '0 0 36px 0',
          textAlign: 'center',
        }}
      >
        {totalScore} / {maxPossible} points across {results.length} scenarios
      </p>

      {/* Breakdown card */}
      <div
        style={{
          background: colors.surface,
          border: `1px solid ${colors.border}`,
          borderRadius: radii.xl,
          padding: spacing.lg,
          marginBottom: spacing.md,
        }}
      >
        <p
          style={{
            fontFamily: fonts.sans,
            fontSize: fontSizes.eyebrow,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: colors.textVeryDim,
            margin: `0 0 ${spacing.md}px 0`,
          }}
        >
          Breakdown
        </p>
        {results.map((r, i) => {
          let scoreColor = colors.scoreRed;
          if (r.chosen.score === 3) scoreColor = colors.scoreGreen;
          else if (r.chosen.score === 2) scoreColor = colors.scoreYellow;
          const label =
            r.scenario.subSkill ||
            r.scenario.skillCategory ||
            (r.scenario.isCapture ? 'Captured' : 'Scenario');
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 0',
                borderBottom: i < results.length - 1 ? `1px solid ${colors.borderSubtle}` : 'none',
              }}
            >
              <span
                style={{
                  fontFamily: fonts.sans,
                  fontSize: fontSizes.meta,
                  color: colors.textBody,
                }}
              >
                {label}
              </span>
              <span
                style={{
                  fontFamily: fonts.sans,
                  fontSize: fontSizes.meta,
                  fontWeight: 700,
                  color: scoreColor,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {r.chosen.score}/3
              </span>
            </div>
          );
        })}
      </div>

      {/* Areas to drill */}
      {percentage < 100 && weakCategories.length > 0 && (
        <div
          style={{
            background: colors.surfaceDark,
            border: `1px solid ${colors.accentBorder}`,
            borderRadius: radii.xl,
            padding: spacing.lg,
            marginBottom: spacing.lg,
          }}
        >
          <p
            style={{
              fontFamily: fonts.sans,
              fontSize: fontSizes.eyebrow,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: colors.accent,
              margin: `0 0 ${spacing.sm + 4}px 0`,
            }}
          >
            Areas to drill
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
            {weakCategories.join(', ')}
          </p>
        </div>
      )}

      {/* CTAs */}
      <div style={{ display: 'flex', gap: 10, marginTop: spacing.lg }}>
        <button
          onClick={onRestart}
          style={{
            flex: 1,
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
            transition: 'transform 0.15s, box-shadow 0.15s',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = `0 10px 28px ${colors.accentSoft}`;
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = `0 6px 20px ${colors.accentSoft}`;
          }}
        >
          Try again
        </button>
        <button
          onClick={onBackToMenu}
          style={{
            flex: 1,
            padding: '16px',
            background: 'transparent',
            color: colors.textBody,
            border: `1px solid ${colors.border}`,
            borderRadius: radii.md,
            fontSize: fontSizes.bodyLg,
            fontFamily: fonts.sans,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'border-color 0.15s, color 0.15s',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.borderColor = colors.accent;
            e.currentTarget.style.color = colors.accent;
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.borderColor = colors.border;
            e.currentTarget.style.color = colors.textBody;
          }}
        >
          Menu
        </button>
      </div>
    </div>
  );
}
