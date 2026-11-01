// Behavioral activation action library.
// Every action has three sizes. When the full thing feels too heavy,
// you shrink it until it feels doable. Doing the tiny version still counts.

export const DO_AREAS = [
  'Health',
  'Personal',
  'Relationship',
  'ServiceNow',
  'Udemy',
  'Lucky X',
  'Investing',
  'Learning',
  'Social Skills',
];

// Identity follows action. Each completed action is one vote for this identity.
export const AREA_IDENTITY = {
  Health: 'I take care of my body',
  Personal: 'I keep my life in order',
  Relationship: 'I am a loving partner',
  ServiceNow: 'I am a strong ServiceNow architect',
  Udemy: 'I run a course business',
  'Lucky X': 'I create in public',
  Investing: 'I manage my money deliberately',
  Learning: 'I am a reader and a learner',
  'Social Skills': 'I connect with people',
};

export const SIZES = [
  { id: 'full', label: 'Full', points: 20 },
  { id: 'small', label: 'Smaller', points: 10 },
  { id: 'tiny', label: 'Tiny', points: 5 },
];

export const DO_ACTIONS = [
  {
    id: 'gym',
    area: 'Health',
    levels: {
      full: 'Full gym session',
      small: '20-minute workout at home',
      tiny: 'Put on training clothes',
    },
  },
  {
    id: 'walk',
    area: 'Health',
    levels: {
      full: 'Walk 30 minutes outside',
      small: 'Walk 10 minutes',
      tiny: 'Step outside for 2 minutes',
    },
  },
  {
    id: 'cook',
    area: 'Health',
    levels: {
      full: 'Cook a healthy meal',
      small: 'Make a simple healthy snack',
      tiny: 'Drink a full glass of water',
    },
  },
  {
    id: 'sleep',
    area: 'Health',
    levels: {
      full: 'Lights out by 23:00',
      small: 'Screens off 30 minutes before bed',
      tiny: 'Put the phone on the charger outside the bedroom',
    },
  },
  {
    id: 'meditate',
    area: 'Health',
    levels: {
      full: 'Meditate 15 minutes',
      small: 'Meditate 5 minutes',
      tiny: 'Take 10 slow breaths',
    },
  },
  {
    id: 'clean',
    area: 'Personal',
    levels: {
      full: 'Clean the whole flat',
      small: 'Clean one room',
      tiny: 'Take out the trash',
    },
  },
  {
    id: 'bed',
    area: 'Personal',
    levels: {
      full: 'Make the bed and tidy the bedroom',
      small: 'Make the bed',
      tiny: 'Straighten the duvet',
    },
  },
  {
    id: 'shower',
    area: 'Personal',
    levels: {
      full: 'Shower and get properly dressed',
      small: 'Take a shower',
      tiny: 'Wash your face',
    },
  },
  {
    id: 'journal',
    area: 'Personal',
    levels: {
      full: 'Post-gym voice journal, 5 minutes',
      small: 'Voice note, 1 minute',
      tiny: 'Say one sentence about today',
    },
  },
  {
    id: 'admin',
    area: 'Personal',
    levels: {
      full: 'Finish one admin task',
      small: '10 minutes on admin',
      tiny: 'Open the admin list and read it',
    },
  },
  {
    id: 'alicja-date',
    area: 'Relationship',
    levels: {
      full: 'Plan a date with Alicja',
      small: 'Do something nice for Alicja',
      tiny: 'Tell Alicja she is beautiful',
    },
  },
  {
    id: 'alicja-hug',
    area: 'Relationship',
    levels: {
      full: 'Phone-free evening with Alicja',
      small: 'Ask Alicja about her day and listen',
      tiny: 'Give Alicja a long hug and a kiss',
    },
  },
  {
    id: 'sn-deep',
    area: 'ServiceNow',
    levels: {
      full: '90-minute deep work block on the hardest story',
      small: '25-minute focused block',
      tiny: 'Open the story and write the next step',
    },
  },
  {
    id: 'udemy-qa',
    area: 'Udemy',
    levels: {
      full: 'Answer all open student questions',
      small: 'Answer one student question',
      tiny: 'Open the Udemy Q&A inbox',
    },
  },
  {
    id: 'udemy-fix',
    area: 'Udemy',
    levels: {
      full: 'Fix 5 exam questions',
      small: 'Fix one exam question',
      tiny: 'Open the course question list',
    },
  },
  {
    id: 'linkedin',
    area: 'Lucky X',
    levels: {
      full: 'Publish a LinkedIn post',
      small: 'Draft a LinkedIn post',
      tiny: 'Write one hook line',
    },
  },
  {
    id: 'video',
    area: 'Lucky X',
    levels: {
      full: 'Record a full video clip',
      small: 'Record one 30-second take',
      tiny: 'Set up the camera',
    },
  },
  {
    id: 'invest',
    area: 'Investing',
    levels: {
      full: 'Run the weekly investing session',
      small: 'Check portfolio and DCA status',
      tiny: 'Open XTB and look at one position',
    },
  },
  {
    id: 'read',
    area: 'Learning',
    levels: {
      full: 'Read 30 pages',
      small: 'Read 10 pages',
      tiny: 'Read one page',
    },
  },
  {
    id: 'friend',
    area: 'Social Skills',
    levels: {
      full: 'Call a friend',
      small: 'Message a friend to meet up',
      tiny: 'Send one person a kind message',
    },
  },
];

// Fallback shrink for actions you type yourself.
export function genericLevels(text) {
  const t = text.trim();
  return {
    full: t,
    small: `10 minutes of: ${t}`,
    tiny: `Only the first 2-minute step of: ${t}`,
  };
}
