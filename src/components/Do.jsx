import { useState } from 'react';
import { colors, fonts, fontSizes, spacing, radii } from '../styles/theme';
import { QUICK_PICKS, SIZE_LABELS, SIZE_ORDER, genericLevels } from '../data/do-actions';
import { getDoState, logAction, setMoodAfter, removeAction, setTodayFrog, todayKey } from '../utils/doStorage';

// Do tab. Behavioral activation: motivation is the effect of action, not the cause.
// Pick something, shrink it until it feels doable, do it, notice how you feel after.

const MOODS = [
  { value: 1, label: 'Awful' },
  { value: 2, label: 'Low' },
  { value: 3, label: 'Okay' },
  { value: 4, label: 'Good' },
  { value: 5, label: 'Great' },
];

const eyebrow = {
  fontFamily: fonts.sans,
  fontSize: fontSizes.eyebrow,
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  color: colors.textDim,
  margin: `0 0 ${spacing.sm}px 0`,
};

const card = {
  background: colors.surface,
  border: `1px solid ${colors.border}`,
  borderRadius: radii.xl,
  padding: spacing.md,
  marginBottom: spacing.md,
};

const hint = {
  fontFamily: fonts.sans,
  fontSize: fontSizes.meta,
  color: colors.textMuted,
  margin: '0 0 8px 0',
};

const input = {
  width: '100%',
  boxSizing: 'border-box',
  background: colors.surfaceDark,
  border: `1px solid ${colors.border}`,
  borderRadius: radii.md,
  color: colors.textPrimary,
  fontFamily: fonts.sans,
  fontSize: 16,
  padding: '10px 12px',
  outline: 'none',
};

function buttonStyle(variant = 'ghost') {
  const base = {
    fontFamily: fonts.sans,
    fontSize: fontSizes.body,
    fontWeight: 600,
    borderRadius: radii.md,
    padding: '12px 16px',
    cursor: 'pointer',
    border: `1px solid ${colors.border}`,
    background: 'transparent',
    color: colors.textBody,
  };
  if (variant === 'primary') {
    return { ...base, background: colors.accent, border: `1px solid ${colors.accent}`, color: '#1a1410' };
  }
  return base;
}

function chipStyle(active) {
  return {
    fontFamily: fonts.sans,
    fontSize: fontSizes.label,
    fontWeight: 500,
    padding: '8px 12px',
    borderRadius: radii.pill,
    border: `1px solid ${active ? colors.accent : colors.border}`,
    background: active ? colors.accentSoft : 'transparent',
    color: active ? colors.accentGlow : colors.textMuted,
    cursor: 'pointer',
  };
}

function MoodRow({ value, onPick }) {
  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
      {MOODS.map((m) => (
        <button key={m.value} onClick={() => onPick(m.value)} style={chipStyle(value === m.value)}>
          {m.value} {m.label}
        </button>
      ))}
    </div>
  );
}

function weekDays() {
  const now = new Date();
  const mondayOffset = (now.getDay() + 6) % 7;
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now);
    d.setDate(now.getDate() - mondayOffset + i);
    return { key: todayKey(d), label: ['M', 'T', 'W', 'T', 'F', 'S', 'S'][i] };
  });
}

export default function Do() {
  const [state, setState] = useState(() => getDoState());
  const [active, setActive] = useState(null);
  const [sizeIdx, setSizeIdx] = useState(0);
  const [moodBefore, setMoodBefore] = useState(null);
  const [justLogged, setJustLogged] = useState(null);
  const [customText, setCustomText] = useState('');
  const [frogText, setFrogText] = useState('');

  const today = todayKey();
  const frog = state.frogs[today] || null;
  const todayLog = state.log.filter((e) => todayKey(new Date(e.at)) === today);
  const week = weekDays();
  const weekKeys = new Set(week.map((d) => d.key));
  const weekCount = state.log.filter((e) => weekKeys.has(todayKey(new Date(e.at)))).length;
  const activeDays = new Set(state.log.map((e) => todayKey(new Date(e.at))));

  const withMood = state.log.filter((e) => e.moodBefore && e.moodAfter);
  const avg = (arr) => (arr.reduce((s, v) => s + v, 0) / arr.length).toFixed(1);
  const lowStarts = withMood.filter((e) => e.moodBefore <= 2);

  const start = (levels, isFrog = false) => {
    setActive({ levels, isFrog });
    setSizeIdx(0);
    setMoodBefore(null);
    setJustLogged(null);
  };

  const startCustom = () => {
    if (!customText.trim()) return;
    start(genericLevels(customText));
    setCustomText('');
  };

  const saveFrog = () => {
    if (!frogText.trim()) return;
    setState(setTodayFrog(frogText.trim()));
    setFrogText('');
  };

  const complete = () => {
    const next = logAction({
      label: active.levels[SIZE_ORDER[sizeIdx]],
      isFrog: active.isFrog,
      moodBefore,
      moodAfter: null,
    });
    setState(next);
    setJustLogged(next.log[next.log.length - 1]);
    setActive(null);
  };

  const recordMoodAfter = (value) => {
    setState(setMoodAfter(justLogged.id, value));
    setJustLogged({ ...justLogged, moodAfter: value });
  };

  const undo = (id) => {
    setState(removeAction(id));
    if (justLogged?.id === id) setJustLogged(null);
  };

  return (
    <div style={{ padding: '32px 20px 24px 20px' }}>
      <h1
        style={{
          fontFamily: fonts.serif,
          fontSize: fontSizes.h1,
          fontWeight: 700,
          color: colors.textPrimary,
          margin: `0 0 ${spacing.sm}px 0`,
          lineHeight: 1.1,
        }}
      >
        Do something.
      </h1>
      <p style={{ fontFamily: fonts.serif, fontSize: fontSizes.bodyLg, color: colors.textMuted, margin: `0 0 ${spacing.md}px 0`, lineHeight: 1.5 }}>
        Motivation comes after action. If it feels too big, shrink it.
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: spacing.lg }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {week.map((d, i) => (
            <div key={i} style={{ textAlign: 'center', fontFamily: fonts.sans, fontSize: 10, color: colors.textDim }}>
              <div
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: radii.pill,
                  background: activeDays.has(d.key) ? colors.accent : colors.surfaceDark,
                  border: `1px solid ${d.key === today ? colors.accentGlow : colors.border}`,
                  marginBottom: 2,
                }}
              />
              {d.label}
            </div>
          ))}
        </div>
        <span style={{ fontFamily: fonts.sans, fontSize: fontSizes.meta, color: colors.textMuted }}>
          {weekCount} done this week
        </span>
      </div>

      {justLogged && (
        <div style={{ ...card, borderColor: colors.accentBorder, background: colors.surfaceFeedbackPositive }}>
          <p style={{ ...eyebrow, color: colors.accentGlow }}>Done</p>
          <div style={{ fontFamily: fonts.serif, fontSize: fontSizes.scenario, color: colors.textPrimary, marginBottom: spacing.md }}>
            {justLogged.label}
          </div>
          {justLogged.moodAfter == null ? (
            <>
              <p style={hint}>How do you feel now?</p>
              <MoodRow value={null} onPick={recordMoodAfter} />
            </>
          ) : (
            <div style={{ fontFamily: fonts.sans, fontSize: fontSizes.body, color: colors.textBody }}>
              {justLogged.moodBefore
                ? `Before ${justLogged.moodBefore}, after ${justLogged.moodAfter}. ${
                    justLogged.moodAfter > justLogged.moodBefore
                      ? 'Action came first, the feeling followed.'
                      : 'You still did it, and it still counts.'
                  }`
                : 'Logged. Rate how you feel before next time to see the pattern.'}
            </div>
          )}
        </div>
      )}

      {active ? (
        <div style={{ ...card, borderColor: colors.accent }}>
          <p style={{ ...eyebrow, color: colors.accentGlow }}>
            {active.isFrog ? 'Your frog' : 'Now'} · {SIZE_LABELS[SIZE_ORDER[sizeIdx]]}
          </p>
          <div style={{ fontFamily: fonts.serif, fontSize: fontSizes.scenarioLg, color: colors.textPrimary, lineHeight: 1.3, marginBottom: spacing.md }}>
            {active.levels[SIZE_ORDER[sizeIdx]]}
          </div>
          {sizeIdx < SIZE_ORDER.length - 1 && (
            <button onClick={() => setSizeIdx(sizeIdx + 1)} style={{ ...buttonStyle(), width: '100%', marginBottom: spacing.md }}>
              Too big? Shrink it
            </button>
          )}
          <p style={hint}>How do you feel right now? (optional)</p>
          <MoodRow value={moodBefore} onPick={setMoodBefore} />
          <div style={{ display: 'flex', gap: 8, marginTop: spacing.md }}>
            <button onClick={complete} style={{ ...buttonStyle('primary'), flex: 1 }}>
              I did it
            </button>
            <button onClick={() => setActive(null)} style={buttonStyle()}>
              Not now
            </button>
          </div>
        </div>
      ) : (
        <>
          <div style={card}>
            <p style={eyebrow}>Today's frog</p>
            {!frog && (
              <>
                <p style={hint}>The one important thing you are avoiding today.</p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    value={frogText}
                    onChange={(e) => setFrogText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && saveFrog()}
                    placeholder="e.g. Finish the PwC catalog item"
                    style={{ ...input, flex: 1 }}
                  />
                  <button onClick={saveFrog} style={buttonStyle('primary')}>
                    Set
                  </button>
                </div>
              </>
            )}
            {frog && !frog.done && (
              <>
                <div style={{ fontFamily: fonts.serif, fontSize: fontSizes.scenario, color: colors.textPrimary, marginBottom: 12 }}>
                  {frog.label}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => start(genericLevels(frog.label), true)} style={{ ...buttonStyle('primary'), flex: 1 }}>
                    Start
                  </button>
                  <button onClick={() => setState(setTodayFrog(null))} style={buttonStyle()}>
                    Change
                  </button>
                </div>
              </>
            )}
            {frog && frog.done && (
              <>
                <div style={{ fontFamily: fonts.serif, fontSize: fontSizes.bodyLg, textDecoration: 'line-through', color: colors.textMuted }}>
                  {frog.label}
                </div>
                <div style={{ fontFamily: fonts.sans, fontSize: fontSizes.meta, color: colors.scoreGreen, marginTop: 6 }}>
                  Frog eaten. Everything else today is a bonus.
                </div>
              </>
            )}
          </div>

          <div style={card}>
            <p style={eyebrow}>Do something now</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: spacing.md }}>
              {QUICK_PICKS.map((p) => (
                <button key={p.full} onClick={() => start(p)} style={{ ...buttonStyle(), textAlign: 'left', fontWeight: 500 }}>
                  {p.full}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && startCustom()}
                placeholder="Or type your own"
                style={{ ...input, flex: 1 }}
              />
              <button onClick={startCustom} style={buttonStyle('primary')}>
                Go
              </button>
            </div>
          </div>
        </>
      )}

      {withMood.length > 0 && (
        <div style={card}>
          <p style={eyebrow}>Your own evidence</p>
          <div style={{ fontFamily: fonts.serif, fontSize: fontSizes.bodyLg, color: colors.textBody, lineHeight: 1.5 }}>
            Across {withMood.length} rated actions your mood went from {avg(withMood.map((e) => e.moodBefore))} to{' '}
            {avg(withMood.map((e) => e.moodAfter))}.
            {lowStarts.length > 0 && ` When you started low, you ended at ${avg(lowStarts.map((e) => e.moodAfter))}.`}
          </div>
        </div>
      )}

      {todayLog.length > 0 && (
        <div style={card}>
          <p style={eyebrow}>Done today</p>
          {todayLog
            .slice()
            .reverse()
            .map((e) => (
              <div
                key={e.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 12,
                  fontFamily: fonts.sans,
                  fontSize: fontSizes.body,
                  color: colors.textBody,
                  padding: '6px 0',
                  borderBottom: `1px solid ${colors.borderSubtle}`,
                }}
              >
                <span>
                  {e.isFrog ? 'Frog: ' : ''}
                  {e.label}
                </span>
                <button onClick={() => undo(e.id)} style={{ ...buttonStyle(), padding: '4px 8px', fontSize: fontSizes.label }}>
                  Undo
                </button>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
