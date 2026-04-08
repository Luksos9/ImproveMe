// Jefferson Fisher scoring rubric.
// Used by Tier 2/3 (open text) to give Claude a structured framework
// for grading the user's typed response against the scenario's idealResponse.

export const FISHER_RUBRIC = {
  // The three pillars Fisher uses to evaluate any conversational move.
  pillars: [
    {
      name: 'Control',
      definition:
        "Did the responder stay in command of themselves — voice, pace, breath — instead of matching the other person's energy?",
      tells: [
        'Lowered volume / slowed pace',
        'Took a beat before answering',
        'Did not match anger with anger',
        'Did not get pulled into a tangent',
      ],
    },
    {
      name: 'Confidence',
      definition:
        'Did the responder say what they actually meant — directly, without hedging, apologizing, or softening the substance?',
      tells: [
        'Plain, declarative statements',
        'No "I just" / "sorry but" / "maybe we could"',
        'Owned their position without justifying it to death',
        'Said the hard thing, kindly but clearly',
      ],
    },
    {
      name: 'Connection',
      definition:
        'Did the responder validate the other person before advocating, so the other person feels heard rather than steamrolled?',
      tells: [
        'Named the other person\'s feeling or position first',
        'Used "and" instead of "but"',
        'Sought to understand rather than win',
        'Left the relationship intact even when delivering hard news',
      ],
    },
  ],

  // Score band definitions Claude returns one of these.
  scoreBands: [
    {
      score: 3,
      label: 'Fisher approved',
      meaning:
        'Hits all three pillars cleanly. This is the kind of response Fisher would use as a teaching example.',
    },
    {
      score: 2,
      label: 'Close',
      meaning:
        'Lands two pillars but slips on one — usually validation missing, or a small hedge undermines the confidence.',
    },
    {
      score: 1,
      label: 'Needs work',
      meaning:
        'Hits one pillar but misses two. Either reactive, or hedged, or skips validation entirely.',
    },
    {
      score: 0,
      label: 'Missed',
      meaning:
        'Reactive, defensive, or attacking. Matches the other person\'s energy or surrenders the position.',
    },
  ],
};

// Top-level "anti-patterns" — phrases or moves that auto-cap a response at 1 or below.
export const FISHER_ANTI_PATTERNS = [
  'Matching anger with anger',
  'Sarcasm or contempt',
  'Over-apologizing ("I\'m so sorry, sorry, sorry")',
  'Justifying yourself into a corner',
  'Personal attacks',
  'Stonewalling / refusing to engage',
  'Empty agreement just to make it stop',
];
