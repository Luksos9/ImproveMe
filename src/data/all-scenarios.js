import { FISHER_SCENARIOS } from './fisher-scenarios';
import { BOOK_SCENARIOS } from './book-scenarios';

export const ALL_SEED_SCENARIOS = [...FISHER_SCENARIOS, ...BOOK_SCENARIOS];

export function supportsTier(scenario, tier) {
  if (tier === 'tier1') return true;
  if (scenario?.isCapture) return true;
  return scenario?.openTextReady !== false;
}
