// ImproveMe design tokens.
// Warm dark palette + Lucky X orange accent + cream text.
// Every component imports from here so future tweaks live in one place.

export const colors = {
  // Warm dark surfaces (brown-black, not blue-black)
  bg: '#1a1410',
  surface: '#221b15',
  surfaceAlt: '#2a2218',
  surfaceDark: '#15100c',
  surfaceFeedbackPositive: '#1d1a12',
  border: '#3a2e22',
  borderSubtle: '#2e251b',

  // Cream text (warm, paper-like, not pure white)
  textPrimary: '#f5ede0',
  textBody: '#e8dfd0',
  textCool: '#d8cfbf',
  textMuted: '#a8998a',
  textDim: '#7a6d5e',
  textVeryDim: '#5a4f42',

  // Orange accent system (Lucky X brand color)
  accent: '#f97316',
  accentSoft: '#f9731640',
  accentBorder: '#f9731630',
  accentDeep: '#c35a0f',
  accentGlow: '#fb923c',

  // Scoring stays semantic but warmed slightly to fit the new bg
  scoreGreen: '#65a30d',
  scoreYellow: '#eab308',
  scoreRed: '#dc2626',

  // Semi-transparent versions for subtle borders
  scoreGreenSoft: '#65a30d40',
  scoreGreenBorder: '#65a30d30',
  scoreYellowBorder: '#eab30830',
  scoreRedBorder: '#dc262630',

  // Categories all share the orange accent now (no more rainbow)
  category: {
    'De-escalation': '#f97316',
    'Boundaries': '#f97316',
    'Understanding over winning': '#f97316',
    'The Pause': '#f97316',
    'Delivering hard news': '#f97316',
    'Assertiveness': '#f97316',
    'No absolutes': '#f97316',
    'Validation first': '#f97316',
  },

  // Areas-to-drill accent on the results screen
  drillAccent: '#f97316',
};

export const fonts = {
  serif: "'Newsreader', Georgia, serif", // scenario text, options
  sans: "'DM Sans', system-ui, sans-serif", // UI chrome, labels, metadata
};

export const fontSizes = {
  eyebrow: 11,
  label: 12,
  meta: 13,
  body: 14,
  bodyLg: 15,
  scenario: 17,
  scenarioLg: 22, // redesigned scenario card
  scenarioXl: 26, // largest scenario text on tall screens
  h1: 36,
  h2: 24, // module card titles
  resultsPercent: 48,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radii = {
  sm: 6,
  md: 8,
  lg: 10,
  xl: 12,
  pill: 999,
};

// Helper: pick the score color from a 0–3 integer.
export const colorForScore = (score) => {
  if (score === 3) return colors.scoreGreen;
  if (score === 2) return colors.scoreYellow;
  return colors.scoreRed;
};

// Helper: pick the softer border color (for feedback panels) from a 0–3 integer.
export const borderForScore = (score) => {
  if (score === 3) return colors.scoreGreenBorder;
  if (score === 2) return colors.scoreYellowBorder;
  return colors.scoreRedBorder;
};

// Helper: pick the label text for a scored answer.
export const labelForScore = (score) => {
  if (score === 3) return 'FISHER APPROVED';
  if (score === 2) return 'CLOSE';
  return 'MISSED';
};

// Helper: pick the encouragement headline for the feedback panel.
export const headlineForScore = (score) => {
  if (score === 3) return 'Nailed it';
  if (score === 2) return 'Almost there';
  return 'Think again next time';
};
