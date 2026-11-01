// Storage for the Do tab (behavioral activation log).
// Shape:
// {
//   log:   [{ id, label, isFrog, moodBefore, moodAfter, at }],
//   frogs: { 'YYYY-MM-DD': { label, done } }
// }

const STORAGE_KEY = 'improveme.do';

export function todayKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getDoState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { log: [], frogs: {} };
    const parsed = JSON.parse(raw);
    return {
      log: Array.isArray(parsed.log) ? parsed.log : [],
      frogs: parsed.frogs && typeof parsed.frogs === 'object' ? parsed.frogs : {},
    };
  } catch (err) {
    console.warn('[doStorage] could not parse state:', err);
    return { log: [], frogs: {} };
  }
}

function writeState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('[doStorage] write failed:', err);
  }
}

export function logAction(entry) {
  const state = getDoState();
  const saved = { id: `do-${Date.now()}`, at: new Date().toISOString(), ...entry };
  state.log.push(saved);
  if (entry.isFrog) {
    const key = todayKey();
    if (state.frogs[key]) state.frogs[key].done = true;
  }
  writeState(state);
  return state;
}

export function setMoodAfter(id, moodAfter) {
  const state = getDoState();
  const item = state.log.find((e) => e.id === id);
  if (item) item.moodAfter = moodAfter;
  writeState(state);
  return state;
}

export function removeAction(id) {
  const state = getDoState();
  const item = state.log.find((e) => e.id === id);
  state.log = state.log.filter((e) => e.id !== id);
  if (item?.isFrog) {
    const key = todayKey(new Date(item.at));
    if (state.frogs[key]) state.frogs[key].done = false;
  }
  writeState(state);
  return state;
}

export function setTodayFrog(label) {
  const state = getDoState();
  const key = todayKey();
  if (label) state.frogs[key] = { label, done: false };
  else delete state.frogs[key];
  writeState(state);
  return state;
}
