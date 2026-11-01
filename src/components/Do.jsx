import { useState } from 'react';
import { colors, fonts, fontSizes, spacing, radii } from '../styles/theme';
import { DO_ACTIONS, DO_AREAS, AREA_IDENTITY, SIZES, genericLevels } from '../data/do-actions';
import {
  getDoState,
  logAction,
  setMoodAfter,
  removeAction,
  setTodayFrog,
  todayKey,
  levelFor,
  pointsForLevel,
} from '../utils/doStorage';
import { isApiConfigured, shrinkAction } from '../utils/claudeApi';

// Do tab. Behavioral activation: motivation is the effect of action, not the cause.
// Pick something, shrink it until it feels doable, do it, notice how you feel after.
// The ember only grows. Missing days never costs you anything. You just resume.

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

const input = {
  width: '100%',
  boxSizing: 'border-box',
  background: colors.surfaceDark,
  border: `1px solid ${colors.border}`,
  borderRadius: radii.md,
  color: colors.textPrimary,
  fontFamily: fonts.sans,
  fontSize: fontSizes.body,
  padding: '10px 12px',
  outline: 'none',
};

function buttonStyle(variant = 'ghost') {
  const base = {
    fontFamily: fonts.sans,
    fontSize: fontSizes.meta,
    fontWeight: 600,
    borderRadius: radii.md,
    padding: '10px 14px',
    cursor: 'pointer',
    border: `1px solid ${colors.border}`,
    background: 'transparent',
    color: colors.textBody,
  };
  if (variant === 'primary') {
    return { ...base, background: colors.accent, border: `1px solid ${colors.accent}`, color: '#1a1410' };
  }
  if (variant === 'soft') {
    return { ...base, background: colors.accentSoft, border: `1px solid ${colors.accentBorder}`, color: colors.accentGlow };
  }
  return base;
}

function chipStyle(active) {
  return {
    fontFamily: fonts.sans,
    fontSize: fontSizes.label,
    fontWeight: 500,
    padding: '6px 12px',
    borderRadius: radii.pill,
    border: `1px solid ${active ? colors.accent : colors.border}`,
    background: active ? colors.accentSoft : 'transparent',
    color: active ? colors.accentGlow : colors.textMuted,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  };
}

function Ember({ level }) {
  const scale = Math.min(0.55 + level * 0.09, 1.3);
  return (
    <svg width="96" height="96" viewBox="0 0 96 96" aria-hidden="true">
      <defs>
        <radialGradient id="emberGlow" cx="50%" cy="65%" r="50%">
          <stop offset="0%" stopColor={colors.accentGlow} stopOpacity="0.55" />
          <stop offset="100%" stopColor={colors.accent} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="48" cy="58" r="40" fill="url(#emberGlow)" />
      <g transform={`translate(48 84) scale(${scale}) translate(-48 -84)`}>
        <path
          d="M48 14c4 14 22 22 22 42a22 22 0 0 1-44 0c0-9 4-15 9-20 0 9 4 13 9 13 0-13-5-22 4-35z"
          fill={colors.accent}
        />
        <path d="M48 46c2 7 10 10 10 19a10 10 0 0 1-20 0c0-6 5-9 10-19z" fill={colors.accentGlow} />
      </g>
    </svg>
  );
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
  const [areaFilter, setAreaFilter] = useState(null);
  const [active, setActive] = useState(null);
  const [moodBefore, setMoodBefore] = useState(null);
  const [justLogged, setJustLogged] = useState(null);
  const [customText, setCustomText] = useState('');
  const [customArea, setCustomArea] = useState('Personal');
  const [frogText, setFrogText] = useState('');
  const [frogArea, setFrogArea] = useState('ServiceNow');
  const [shrinking, setShrinking] = useState(false);
  const apiOk = isApiConfigured();

  const today = todayKey();
  const frog = state.frogs[today] || null;
  const todayLog = state.log.filter((e) => todayKey(new Date(e.at)) === today);
  const totalPoints = state.log.reduce((sum, e) => sum + e.points, 0);
  const level = levelFor(totalPoints);
  const nextLevelAt = pointsForLevel(level + 1);
  const thisLevelAt = pointsForLevel(level);
  const progressPct = Math.round(((totalPoints - thisLevelAt) / (nextLevelAt - thisLevelAt)) * 100);
  const activeDays = new Set(state.log.map((e) => todayKey(new Date(e.at))));

  const withMood = state.log.filter((e) => e.moodBefore && e.moodAfter);
  const avg = (arr) => arr.reduce((s, v) => s + v, 0) / arr.length;
  const lowStarts = withMood.filter((e) => e.moodBefore <= 2);

  const identityCounts = Object.entries(
    state.log.reduce((acc, e) => {
      acc[e.identity] = (acc[e.identity] || 0) + 1;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]);

  const visibleActions = areaFilter ? DO_ACTIONS.filter((a) => a.area === areaFilter) : DO_ACTIONS;

  const openAction = (action) => {
    setActive(action);
    setMoodBefore(null);
    setJustLogged(null);
  };

  const openCustom = () => {
    if (!customText.trim()) return;
    openAction({ id: null, area: customArea, levels: genericLevels(customText), isCustom: true });
    setCustomText('');
  };

  const shrinkWithClaude = async () => {
    if (!active) return;
    setShrinking(true);
    try {
      const { small, tiny } = await shrinkAction({ text: active.levels.full });
      setActive({ ...active, levels: { ...active.levels, small, tiny } });
    } catch (err) {
      console.warn('[Do] shrink failed, keeping generic levels:', err);
    } finally {
      setShrinking(false);
    }
  };

  const complete = (sizeId) => {
    const size = SIZES.find((s) => s.id === sizeId);
    const points = active.isFrog ? size.points * 2 : size.points;
    const next = logAction({
      actionId: active.id,
      label: active.levels[sizeId],
      area: active.area,
      identity: AREA_IDENTITY[active.area],
      size: sizeId,
      points,
      isFrog: Boolean(active.isFrog),
      moodBefore,
      moodAfter: null,
    });
    setState(next);
    setJustLogged(next.log[next.log.length - 1]);
    setActive(null);
  };

  const recordMoodAfter = (value) => {
    const next = setMoodAfter(justLogged.id, value);
    setState(next);
    setJustLogged({ ...justLogged, moodAfter: value });
  };

  const saveFrog = () => {
    if (!frogText.trim()) return;
    setState(setTodayFrog({ label: frogText.trim(), area: frogArea, levels: genericLevels(frogText) }));
    setFrogText('');
  };

  const undo = (id) => {
    setState(removeAction(id));
    if (justLogged?.id === id) setJustLogged(null);
  };

  return (
    <div style={{ padding: '32px 20px 24px 20px' }}>
      <p style={eyebrow}>Behavioral activation</p>
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
      <p
        style={{
          fontFamily: fonts.serif,
          fontSize: fontSizes.bodyLg,
          color: colors.textMuted,
          margin: `0 0 ${spacing.lg}px 0`,
          lineHeight: 1.5,
        }}
      >
        Motivation is the effect of action. If it feels too big, shrink it until you can do it.
      </p>

      <div style={{ ...card, display: 'flex', alignItems: 'center', gap: spacing.md }}>
        <Ember level={level} />
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: fonts.serif, fontSize: fontSizes.h2, color: colors.textPrimary, fontWeight: 700 }}>
            Ember level {level}
          </div>
          <div style={{ fontFamily: fonts.sans, fontSize: fontSizes.meta, color: colors.textMuted, margin: '4px 0 8px 0' }}>
            {totalPoints} points · {todayLog.length} done today
          </div>
          <div style={{ height: 6, background: colors.surfaceDark, borderRadius: radii.pill, overflow: 'hidden' }}>
            <div style={{ width: `${progressPct}%`, height: '100%', background: colors.accent }} />
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
            {weekDays().map((d, i) => (
              <div key={i} style={{ textAlign: 'center', fontFamily: fonts.sans, fontSize: 10, color: colors.textDim }}>
                <div
                  style={{
                    width: 14,
                    height: 14,
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
        </div>
      </div>

      {justLogged && (
        <div style={{ ...card, borderColor: colors.accentBorder, background: colors.surfaceFeedbackPositive }}>
          <p style={{ ...eyebrow, color: colors.accentGlow }}>+{justLogged.points} · one vote for</p>
          <div style={{ fontFamily: fonts.serif, fontSize: fontSizes.scenario, color: colors.textPrimary, marginBottom: spacing.md }}>
            {justLogged.identity}
          </div>
          {justLogged.moodAfter == null ? (
            <>
              <div style={{ fontFamily: fonts.sans, fontSize: fontSizes.meta, color: colors.textMuted, marginBottom: 8 }}>
                How do you feel now?
              </div>
              <MoodRow value={null} onPick={recordMoodAfter} />
            </>
          ) : (
            <div style={{ fontFamily: fonts.sans, fontSize: fontSizes.body, color: colors.textBody }}>
              {justLogged.moodBefore
                ? `Before ${justLogged.moodBefore}, after ${justLogged.moodAfter}. ${
                    justLogged.moodAfter > justLogged.moodBefore
                      ? 'Action came first, the feeling followed.'
                      : 'Same or lower is fine. You still did it, and it still counts.'
                  }`
                : 'Logged. Next time rate how you feel before too, so you can see the pattern.'}
            </div>
          )}
        </div>
      )}

      {active && (
        <div style={{ ...card, borderColor: colors.accent }}>
          <p style={{ ...eyebrow, color: colors.accentGlow }}>
            {active.isFrog ? 'The frog · double points' : active.area}
          </p>
          <div style={{ fontFamily: fonts.sans, fontSize: fontSizes.meta, color: colors.textMuted, marginBottom: 8 }}>
            How do you feel right now? (optional)
          </div>
          <MoodRow value={moodBefore} onPick={setMoodBefore} />
          <div style={{ fontFamily: fonts.sans, fontSize: fontSizes.meta, color: colors.textMuted, margin: '16px 0 8px 0' }}>
            Pick the size you can do now. Tap it once you have done it.
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {SIZES.map((s) => (
              <button
                key={s.id}
                onClick={() => complete(s.id)}
                style={{
                  ...buttonStyle(s.id === 'full' ? 'soft' : 'ghost'),
                  textAlign: 'left',
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: 12,
                }}
              >
                <span>
                  <span style={{ color: colors.textDim, marginRight: 8 }}>{s.label}</span>
                  {active.levels[s.id]}
                </span>
                <span style={{ color: colors.textDim }}>+{active.isFrog ? s.points * 2 : s.points}</span>
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            {(active.isCustom || active.isFrog) && apiOk && (
              <button onClick={shrinkWithClaude} disabled={shrinking} style={buttonStyle()}>
                {shrinking ? 'Shrinking...' : 'Shrink it smarter'}
              </button>
            )}
            <button onClick={() => setActive(null)} style={buttonStyle()}>
              Not now
            </button>
          </div>
        </div>
      )}

      <div style={card}>
        <p style={eyebrow}>Eat the frog</p>
        {!frog && (
          <>
            <div style={{ fontFamily: fonts.serif, fontSize: fontSizes.bodyLg, color: colors.textBody, marginBottom: 12 }}>
              What is the one important thing you are avoiding today?
            </div>
            <input
              value={frogText}
              onChange={(e) => setFrogText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && saveFrog()}
              placeholder="e.g. Finish the PwC catalog item"
              style={{ ...input, marginBottom: 8 }}
            />
            <div style={{ display: 'flex', gap: 8 }}>
              <select value={frogArea} onChange={(e) => setFrogArea(e.target.value)} style={{ ...input, flex: 1 }}>
                {DO_AREAS.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
              <button onClick={saveFrog} style={buttonStyle('primary')}>
                Set frog
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
              <button onClick={() => openAction({ id: 'frog', area: frog.area, levels: frog.levels, isFrog: true })} style={buttonStyle('primary')}>
                Do it now
              </button>
              <button onClick={() => setState(setTodayFrog(null))} style={buttonStyle()}>
                Change
              </button>
            </div>
          </>
        )}
        {frog && frog.done && (
          <div style={{ fontFamily: fonts.serif, fontSize: fontSizes.bodyLg, color: colors.textBody }}>
            <span style={{ textDecoration: 'line-through', color: colors.textMuted }}>{frog.label}</span>
            <div style={{ fontFamily: fonts.sans, fontSize: fontSizes.meta, color: colors.scoreGreen, marginTop: 6 }}>
              Frog eaten. Everything else today is a bonus.
            </div>
          </div>
        )}
      </div>

      <p style={eyebrow}>Pick something</p>
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 8, marginBottom: 8 }}>
        <button onClick={() => setAreaFilter(null)} style={chipStyle(areaFilter === null)}>
          All
        </button>
        {DO_AREAS.map((a) => (
          <button key={a} onClick={() => setAreaFilter(a)} style={chipStyle(areaFilter === a)}>
            {a}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: spacing.md }}>
        {visibleActions.map((a) => (
          <button
            key={a.id}
            onClick={() => openAction(a)}
            style={{
              ...card,
              marginBottom: 0,
              textAlign: 'left',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <span>
              <span style={{ display: 'block', fontFamily: fonts.serif, fontSize: fontSizes.bodyLg, color: colors.textPrimary }}>
                {a.levels.full}
              </span>
              <span style={{ fontFamily: fonts.sans, fontSize: fontSizes.label, color: colors.textDim }}>
                or tiny: {a.levels.tiny}
              </span>
            </span>
            <span style={{ fontFamily: fonts.sans, fontSize: fontSizes.label, color: colors.textDim, whiteSpace: 'nowrap' }}>
              {a.area}
            </span>
          </button>
        ))}
      </div>

      <div style={card}>
        <p style={eyebrow}>Something else</p>
        <input
          value={customText}
          onChange={(e) => setCustomText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && openCustom()}
          placeholder="Type any action"
          style={{ ...input, marginBottom: 8 }}
        />
        <div style={{ display: 'flex', gap: 8 }}>
          <select value={customArea} onChange={(e) => setCustomArea(e.target.value)} style={{ ...input, flex: 1 }}>
            {DO_AREAS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
          <button onClick={openCustom} style={buttonStyle('soft')}>
            Start
          </button>
        </div>
      </div>

      {withMood.length > 0 && (
        <div style={card}>
          <p style={eyebrow}>Your own evidence</p>
          <div style={{ fontFamily: fonts.serif, fontSize: fontSizes.bodyLg, color: colors.textBody, lineHeight: 1.5 }}>
            Across {withMood.length} rated actions you went from {avg(withMood.map((e) => e.moodBefore)).toFixed(1)} to{' '}
            {avg(withMood.map((e) => e.moodAfter)).toFixed(1)}.
            {lowStarts.length > 0 &&
              ` When you started low (1 or 2), you ended at ${avg(lowStarts.map((e) => e.moodAfter)).toFixed(1)} on average.`}
          </div>
        </div>
      )}

      {identityCounts.length > 0 && (
        <div style={card}>
          <p style={eyebrow}>Identity follows action</p>
          {identityCounts.map(([identity, count]) => (
            <div
              key={identity}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontFamily: fonts.sans,
                fontSize: fontSizes.body,
                color: colors.textBody,
                padding: '6px 0',
                borderBottom: `1px solid ${colors.borderSubtle}`,
              }}
            >
              <span>{identity}</span>
              <span style={{ color: colors.accentGlow }}>{count} {count === 1 ? 'vote' : 'votes'}</span>
            </div>
          ))}
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
                  <span style={{ color: colors.textDim }}> · +{e.points}</span>
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
