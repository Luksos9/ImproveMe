import { FISHER_SCENARIOS } from './fisher-scenarios';
import { BOOK_SCENARIOS } from './book-scenarios';

export const ALL_SEED_SCENARIOS = [...FISHER_SCENARIOS, ...BOOK_SCENARIOS];

function sourceFilterKey(source) {
  const author = source?.author || '';
  if (author.includes('Robert Greene')) return 'Robert Greene';
  return author || null;
}

export function supportsTier(scenario, tier) {
  if (tier === 'tier1') return true;
  if (scenario?.isCapture) return true;
  return scenario?.openTextReady !== false;
}

export function matchesSource(scenario, sourceAuthor = null) {
  if (!sourceAuthor) return true;
  return sourceFilterKey(scenario?.source) === sourceAuthor;
}

export function getSourceOptions(scenarios = ALL_SEED_SCENARIOS) {
  const grouped = new Map();

  scenarios.forEach((scenario) => {
    const key = sourceFilterKey(scenario?.source);
    if (!key) return;

    const current =
      grouped.get(key) || {
        key,
        label: key,
        count: 0,
      };

    current.count += 1;
    grouped.set(key, current);
  });

  return Array.from(grouped.values()).sort((a, b) => {
    if (b.count !== a.count) return b.count - a.count;
    return a.label.localeCompare(b.label);
  });
}
