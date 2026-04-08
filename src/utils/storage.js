// Storage layer for captured scenarios.
// Personal local-only app, so we use localStorage as the only persistence.
// Seed scenarios (Fisher + future books) stay hardcoded in the data/ folder.
//
// Captured scenario shape (superset of the seed schema):
// {
//   id:             'capture-' + Date.now(),
//   skillCategory:  one of SKILL_CATEGORIES (user picks on capture),
//   subSkill:       short label (Claude-inferred, Fisher-style tactic name),
//   source:         { book, author } | null,   // optional — user may leave blank
//   principle:      short imperative (Claude-inferred),
//   situation:      user's raw text, later Claude-rewritten in 2nd person,
//   idealResponse:  Claude-generated benchmark,
//   options:        []                          // empty — captures are Tier 2/3 only
//   scoringFramework: ['Control','Confidence','Connection'],
//   status:         'raw' | 'ready',            // 'raw' = saved, Claude hasn't processed yet
//   createdAt:      ISO string,
//   lastPracticed:  ISO string | null,
//   practiceCount:  integer,
//   sourceLang:     'en' | 'pl',                // captured text language
//   isCapture:      true                        // discriminator used by dailyDrill / practice loop
// }

import { SKILL_CATEGORIES } from '../data/fisher-scenarios';

const STORAGE_KEY = 'improveme.captured';

// Silently migrate legacy captures to the new shape. Old shape had
// `module: 'captured'` and `category: '<Fisher sub-skill>'`. We map that
// to `isCapture: true`, `subSkill: <old category>`, and `skillCategory`
// defaulting to 'Communication' unless the old value matches a new top-level.
function migrateLegacy(item) {
  if (!item || typeof item !== 'object') return item;
  if (item.skillCategory) return item; // already migrated

  const legacyCategory = item.category || null;
  const matchesTopLevel = legacyCategory && SKILL_CATEGORIES.includes(legacyCategory);

  return {
    ...item,
    skillCategory: matchesTopLevel ? legacyCategory : 'Communication',
    subSkill: item.subSkill || legacyCategory || null,
    source: item.source || null,
    isCapture: true,
    // Leave the legacy `module` and `category` fields in place for defensive
    // reads elsewhere, but they are no longer the canonical axes.
  };
}

// Read all captured scenarios. Returns an empty array on first run / corruption.
// Applies silent migration to any legacy-shaped entries.
export function getCapturedScenarios() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(migrateLegacy);
  } catch (err) {
    console.warn('[storage] could not parse captured scenarios:', err);
    return [];
  }
}

// Persist the entire array. Internal helper.
function writeAll(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (err) {
    console.error('[storage] write failed:', err);
  }
}

// Save a brand-new captured scenario. Returns the saved object (with defaults filled in).
export function saveCapturedScenario(scenario) {
  const list = getCapturedScenarios();
  const now = new Date().toISOString();
  const complete = {
    id: scenario.id || `capture-${Date.now()}`,
    isCapture: true,
    skillCategory: scenario.skillCategory || 'Communication',
    subSkill: scenario.subSkill || null,
    source: scenario.source || null,
    principle: scenario.principle || null,
    situation: scenario.situation || '',
    idealResponse: scenario.idealResponse || null,
    options: scenario.options || [],
    scoringFramework: scenario.scoringFramework || ['Control', 'Confidence', 'Connection'],
    status: scenario.status || 'raw',
    createdAt: scenario.createdAt || now,
    lastPracticed: scenario.lastPracticed || null,
    practiceCount: scenario.practiceCount || 0,
    sourceLang: scenario.sourceLang || 'en',
  };
  list.push(complete);
  writeAll(list);
  return complete;
}

// Patch one scenario by id. Used by the background Claude generation
// to flip status from 'raw' to 'ready' once it has subSkill/principle/idealResponse.
export function updateCapturedScenario(id, patch) {
  const list = getCapturedScenarios();
  const idx = list.findIndex((s) => s.id === id);
  if (idx === -1) return null;
  list[idx] = { ...list[idx], ...patch };
  writeAll(list);
  return list[idx];
}

// Remove a captured scenario by id. Returns true if something was removed.
export function deleteCapturedScenario(id) {
  const list = getCapturedScenarios();
  const next = list.filter((s) => s.id !== id);
  if (next.length === list.length) return false;
  writeAll(next);
  return true;
}

// Increment practiceCount and stamp lastPracticed. Used after each captured-scenario drill.
// Seed scenarios don't go through this — only captures track resurfacing data.
export function markPracticed(id) {
  return updateCapturedScenario(id, {
    practiceCount: (getCapturedScenarios().find((s) => s.id === id)?.practiceCount || 0) + 1,
    lastPracticed: new Date().toISOString(),
  });
}
