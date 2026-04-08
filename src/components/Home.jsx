import { colors, fonts, fontSizes, spacing, radii } from '../styles/theme';
import { FISHER_SCENARIOS, SKILL_CATEGORIES } from '../data/fisher-scenarios';
import { getCapturedScenarios } from '../utils/storage';
import { isApiConfigured } from '../utils/claudeApi';

// Home tab — skill hub. Eight top-level skill categories are the primary
// organization. Each card shows the count of scenarios (seeds + captures)
// that train that skill, a thin progress bar, and three tier buttons
// (Quick / Type it / Timed). Skill cards with zero scenarios render an
// empty-state message and are pushed to the bottom at reduced opacity —
// aspirational scaffolding for skills you can grow into.
const TIERS = [
  { id: 'tier1', label: 'Quick', needsApi: false },
  { id: 'tier2', label: 'Type it', needsApi: true },
  { id: 'tier3', label: 'Timed', needsApi: true },
];

export default function Home({ onStart }) {
  const captured = getCapturedScenarios();
  const apiOk = isApiConfigured();
  const allScenarios = [...FISHER_SCENARIOS, ...captured];

  // Build one entry per skill category with count + practiced count.
  // Practiced count only applies to captures (seed scenarios don't track it).
  const cards = SKILL_CATEGORIES.map((skill) => {
    const scenarios = allScenarios.filter((s) => s.skillCategory === skill);
    const capturesInSkill = scenarios.filter((s) => s.isCapture);
    const practicedCaptures = capturesInSkill.filter((c) => c.practiceCount > 0).length;
    const progressPct =
      capturesInSkill.length > 0
        ? Math.round((practicedCaptures / capturesInSkill.length) * 100)
        : 0;
    return {
      skill,
      count: scenarios.length,
      progressPct,
    };
  });

  // Non-empty skills first, then empty alphabetical (they're already alpha
  // in SKILL_CATEGORIES order, so a stable sort on count > 0 is enough).
  cards.sort((a, b) => {
    if (a.count > 0 && b.count === 0) return -1;
    if (a.count === 0 && b.count > 0) return 1;
    return 0;
  });

  return (
    <div style={{ padding: '32px 20px 24px 20px' }}>
      {/* Hero */}
      <p
        style={{
          fontFamily: fonts.sans,
          fontSize: fontSizes.eyebrow,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: colors.textDim,
          margin: 0,
        }}
      >
        Personal Coach
      </p>
      <h1
        style={{
          fontFamily: fonts.serif,
          fontSize: fontSizes.h1,
          fontWeight: 700,
          color: colors.textPrimary,
          margin: `${spacing.sm}px 0 ${spacing.xs}px 0`,
          lineHeight: 1.1,
        }}
      >
        Your skills
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
        Pick a skill to drill.
      </p>

      {cards.map((card) => (
        <SkillCard
          key={card.skill}
          title={card.skill}
          scenarioCount={card.count}
          progressPct={card.progressPct}
          apiOk={apiOk}
          onStartTier={(tier) => onStart(card.skill, tier)}
        />
      ))}
    </div>
  );
}

function SkillCard({ title, scenarioCount, progressPct, apiOk, onStartTier }) {
  const empty = scenarioCount === 0;
  return (
    <div
      style={{
        background: colors.surface,
        border: `1px solid ${empty ? colors.borderSubtle : colors.border}`,
        borderRadius: radii.xl,
        padding: '18px 18px',
        marginBottom: spacing.md,
        opacity: empty ? 0.55 : 1,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
        }}
      >
        <h2
          style={{
            fontFamily: fonts.serif,
            fontSize: fontSizes.h2,
            fontWeight: 700,
            color: colors.textPrimary,
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          {title}
        </h2>
        {!empty && (
          <span
            style={{
              fontFamily: fonts.sans,
              fontSize: fontSizes.label,
              color: colors.accent,
              fontWeight: 600,
              letterSpacing: '0.05em',
            }}
          >
            {scenarioCount} {scenarioCount === 1 ? 'scenario' : 'scenarios'}
          </span>
        )}
      </div>

      {empty ? (
        <p
          style={{
            fontFamily: fonts.serif,
            fontSize: fontSizes.body,
            color: colors.textMuted,
            margin: `${spacing.xs + 2}px 0 0 0`,
            lineHeight: 1.5,
          }}
        >
          No scenarios yet. Capture a moment or add a book that targets this.
        </p>
      ) : (
        <>
          {/* Slim progress bar — only meaningful once captures exist */}
          <div
            style={{
              height: 4,
              background: colors.surfaceAlt,
              borderRadius: radii.pill,
              overflow: 'hidden',
              margin: `${spacing.sm + 2}px 0 ${spacing.md}px 0`,
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

          {/* Three tier buttons */}
          <div style={{ display: 'flex', gap: spacing.sm }}>
            {TIERS.map((t) => {
              const disabled = t.needsApi && !apiOk;
              return (
                <button
                  key={t.id}
                  onClick={() => onStartTier(t.id)}
                  disabled={disabled}
                  style={{
                    flex: 1,
                    padding: '11px 8px',
                    background: colors.surfaceAlt,
                    color: disabled ? colors.textDim : colors.textBody,
                    border: `1px solid ${colors.border}`,
                    borderRadius: radii.md,
                    fontFamily: fonts.sans,
                    fontSize: fontSizes.meta,
                    fontWeight: 600,
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    transition: 'all 0.15s',
                  }}
                  onMouseOver={(e) => {
                    if (!disabled) {
                      e.currentTarget.style.borderColor = colors.accent;
                      e.currentTarget.style.color = colors.accent;
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!disabled) {
                      e.currentTarget.style.borderColor = colors.border;
                      e.currentTarget.style.color = colors.textBody;
                    }
                  }}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
