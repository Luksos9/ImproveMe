// Behavioral activation quick picks.
// Every action has three sizes. When the full thing feels too heavy,
// you shrink it until it feels doable. Doing the tiny version still counts.

export const SIZE_LABELS = { full: 'Full', small: 'Smaller', tiny: 'Tiny' };
export const SIZE_ORDER = ['full', 'small', 'tiny'];

export const QUICK_PICKS = [
  { full: 'Full gym session', small: '20-minute workout at home', tiny: 'Put on training clothes' },
  { full: 'Walk 30 minutes outside', small: 'Walk 10 minutes', tiny: 'Step outside for 2 minutes' },
  { full: 'Clean the flat', small: 'Clean one room', tiny: 'Take out the trash' },
  { full: 'Read 30 pages', small: 'Read 10 pages', tiny: 'Read one page' },
  { full: 'Post-gym voice journal, 5 minutes', small: 'Voice note, 1 minute', tiny: 'Say one sentence about today' },
  { full: 'Plan a date with Alicja', small: 'Do something nice for Alicja', tiny: 'Tell Alicja she is beautiful' },
];

// Shrink for actions you type yourself.
export function genericLevels(text) {
  const t = text.trim();
  return {
    full: t,
    small: `10 minutes of: ${t}`,
    tiny: `Only the first 2-minute step of: ${t}`,
  };
}
