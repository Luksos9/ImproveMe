// Daily Drill selection algorithm.
// Inspired by Readwise's stochastic resurfacing model: prioritize what the
// user hasn't seen, then what they're forgetting, then top up with seeds.
//
// Pure function, no React state, no side effects.

import { getCapturedScenarios } from './storage';
import { FISHER_SCENARIOS } from '../data/fisher-scenarios';
import { shuffle } from './shuffle';

const TARGET_SIZE = 5;
const MAX_FROM_CAPTURES = 3;
const STALE_THRESHOLD_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

// Build today's drill: 5 scenarios mixing user captures and Fisher seeds.
//
// Priority order for capture slots (up to 3):
//   1. Never-practiced captures (practiceCount === 0) — newest first
//   2. Stale captures (last practiced > 7 days ago) — oldest lastPracticed first
//
// The remainder is filled with random Fisher seeds. The whole thing is
// outer-shuffled so order varies day to day.
//
// Returns an array of scenario objects ready to feed into ScenarioExercise.
export function buildDailyDrill() {
  const captured = getCapturedScenarios();

  // Priority 1: never-practiced captures, newest createdAt first
  // (so the thing you just dumped surfaces in your next drill).
  const neverPracticed = captured
    .filter((s) => !s.practiceCount || s.practiceCount === 0)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Priority 2: stale captures (practiced before, but not in 7+ days),
  // oldest lastPracticed first.
  const cutoff = Date.now() - STALE_THRESHOLD_MS;
  const stale = captured
    .filter(
      (s) =>
        s.practiceCount > 0 &&
        s.lastPracticed &&
        new Date(s.lastPracticed).getTime() < cutoff
    )
    .sort((a, b) => new Date(a.lastPracticed) - new Date(b.lastPracticed));

  // Take up to 3 from captures, never-practiced first.
  const fromCaptures = [...neverPracticed, ...stale].slice(0, MAX_FROM_CAPTURES);

  // Fill the remainder from random Fisher seeds.
  const fillCount = Math.max(0, TARGET_SIZE - fromCaptures.length);
  const fisherFill = shuffle(FISHER_SCENARIOS).slice(0, fillCount);

  // Outer-shuffle so capture/seed positions vary.
  return shuffle([...fromCaptures, ...fisherFill]);
}

// How many captures will appear in the next drill (for the menu CTA subline).
// Doesn't actually build the drill — just counts.
export function previewCaptureCount() {
  const captured = getCapturedScenarios();
  const neverPracticed = captured.filter((s) => !s.practiceCount || s.practiceCount === 0);
  const cutoff = Date.now() - STALE_THRESHOLD_MS;
  const stale = captured.filter(
    (s) =>
      s.practiceCount > 0 &&
      s.lastPracticed &&
      new Date(s.lastPracticed).getTime() < cutoff
  );
  return Math.min(MAX_FROM_CAPTURES, neverPracticed.length + stale.length);
}
