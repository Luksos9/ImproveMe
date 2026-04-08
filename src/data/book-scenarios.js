const MODELS_SOURCE = {
  book: 'Models',
  author: 'Mark Manson',
};

const CARNEGIE_SOURCE = {
  book: 'How to Win Friends and Influence People',
  author: 'Dale Carnegie',
};

const POWER_SOURCE = {
  book: 'The 48 Laws of Power',
  author: 'Robert Greene',
};

const MASTERY_SOURCE = {
  book: 'Mastery',
  author: 'Robert Greene',
};

const HUMAN_NATURE_SOURCE = {
  book: 'The Laws of Human Nature',
  author: 'Robert Greene',
};

const FIFTYTH_SOURCE = {
  book: 'The 50th Law',
  author: 'Robert Greene and 50 Cent',
};

const VOSS_SOURCE = {
  book: 'Never Split the Difference',
  author: 'Chris Voss',
};

const CRUCIAL_SOURCE = {
  book: 'Crucial Conversations',
  author: 'Kerry Patterson et al.',
};

export const BOOK_SCENARIOS = [
  {
    id: 'models-001',
    skillCategory: 'Relationships',
    subSkill: 'Honest intent',
    source: MODELS_SOURCE,
    openTextReady: false,
    principle: 'Say what you want early',
    situation:
      "You had easy chemistry with a woman at a friend's birthday. The next day you've traded a few playful messages, and now you're tempted to keep the banter going instead of asking her out directly.",
    options: [
      {
        text: "Haha you're dangerous. We should definitely cause trouble sometime if our schedules ever magically line up.",
        score: 0,
        feedback:
          "This hides your intent behind playful fog. It protects your ego, but it also forces her to do the work of guessing what you actually want.",
      },
      {
        text: "No pressure at all, but if you're ever bored one evening and happen to want a drink, let me know.",
        score: 1,
        feedback:
          "Soft and polite, but it reads like you are asking permission to exist. Non-neediness is not vagueness. It is being clear without clutching.",
      },
      {
        text: "I liked talking to you. Want to grab a drink this week and see if the in-person version is as good as the birthday version?",
        score: 2,
        feedback:
          "Direct and grounded, which is good. The only thing missing is cleaner leadership on time and place, so she can answer the real question instead of a fuzzy maybe.",
      },
      {
        text: "I liked talking to you last night. Want to grab wine on Thursday and keep it going?",
        score: 3,
        feedback:
          "Clear intent, no performance, no weird hedging. You made it easy to say yes or no, which is what honest dating looks like.",
      },
    ],
    idealResponse:
      "I liked talking to you last night. Want to grab wine on Thursday and keep it going? Clear invite, low drama, no hiding behind banter.",
    scoringFramework: ['Honesty', 'Non-neediness', 'Standards'],
  },
  {
    id: 'models-002',
    skillCategory: 'Relationships',
    subSkill: 'Non-neediness',
    source: MODELS_SOURCE,
    openTextReady: false,
    principle: 'Do not chase mixed signals',
    situation:
      "You had one strong date, but for the last eight days she has only replied late at night with short messages. Part of you wants to keep pushing because the first date felt rare.",
    options: [
      {
        text: "All good, just say if you're still interested because I hate guessing and this hot-cold thing is kind of messing with my head.",
        score: 0,
        feedback:
          "Now she is managing your state. That is the opposite of grounded. The message leaks neediness before it ever gets to clarity.",
      },
      {
        text: "No worries, I know you're busy. I'll leave the ball in your court and hope we can make something work soon.",
        score: 1,
        feedback:
          "You called it graceful, but it still hangs around waiting. Hope is doing the work here, not self-respect.",
      },
      {
        text: "You seem stretched, so I'll step back. If you want to meet again, send me a day that actually works for you.",
        score: 2,
        feedback:
          "Good spine and decent clarity. The score-3 answer is a little cleaner because it exits without sounding like a quiet lecture.",
      },
      {
        text: "You seem busy, so I'll leave it here. If you want to meet again, reach out.",
        score: 3,
        feedback:
          "Short, calm, and self-respecting. You did not punish, persuade, or cling. You made space for interest to show itself or disappear.",
      },
    ],
    idealResponse:
      "You seem busy, so I'll leave it here. If you want to meet again, reach out. Then actually let go instead of monitoring your phone.",
    scoringFramework: ['Honesty', 'Non-neediness', 'Standards'],
  },
  {
    id: 'models-003',
    skillCategory: 'Relationships',
    subSkill: 'Rejection with self-respect',
    source: MODELS_SOURCE,
    openTextReady: false,
    principle: 'Take the no and keep your dignity',
    situation:
      'After two dates, she texts: "You are great, but I am not feeling the romantic part." You are disappointed and tempted to make one more case for yourself.',
    options: [
      {
        text: "I think you're writing this off too early. Chemistry builds. If you gave it one more date, you'd probably feel the difference.",
        score: 0,
        feedback:
          "You turned rejection into a sales call. The second you start arguing with a no, your value drops fast.",
      },
      {
        text: "Got it. Can I at least ask what I did wrong so I can understand why this keeps happening?",
        score: 1,
        feedback:
          "Understandable, but this puts your self-worth in her hands. She does not need to coach you through your disappointment.",
      },
      {
        text: "Thanks for being straight. I was excited about it, but I respect it. Wishing you well.",
        score: 2,
        feedback:
          "Solid. Honest and clean. The score-3 version is just a touch lighter, which keeps it from sounding like a formal exit letter.",
      },
      {
        text: "Thanks for being straight with me. I enjoyed meeting you. All good, take care.",
        score: 3,
        feedback:
          "Graceful, brief, and done. You kept your self-respect because you did not turn a clear answer into a courtroom.",
      },
    ],
    idealResponse:
      "Thanks for being straight with me. I enjoyed meeting you. All good, take care. That is enough.",
    scoringFramework: ['Honesty', 'Non-neediness', 'Standards'],
  },
  {
    id: 'carnegie-001',
    skillCategory: 'Social Skills',
    subSkill: 'Genuine interest',
    source: CARNEGIE_SOURCE,
    openTextReady: false,
    principle: 'Lead with interest, not self-display',
    situation:
      'At a networking event, you meet a product lead from Allegro. You want to make a strong impression, and you can feel yourself lining up your own story before she finishes hers.',
    options: [
      {
        text: "Nice, Allegro is huge. I actually help enterprise teams clean up messy ServiceNow environments. Let me tell you about the Generali rebuild I led.",
        score: 0,
        feedback:
          "You used her sentence as a trampoline into your own pitch. People feel that instantly, even when the story is good.",
      },
      {
        text: "Sounds interesting. What exactly do you do there day to day? I never fully know what product leads actually own.",
        score: 1,
        feedback:
          "At least you asked, but it still sounds like an interview question from someone waiting for their turn. Curiosity needs warmth, not just a question mark.",
      },
      {
        text: "Allegro at that scale must be chaos in a fun way. What part of the job do you actually enjoy most?",
        score: 2,
        feedback:
          "Good curiosity and a better emotional angle. The green answer goes one step further by making her feel seen before asking anything.",
      },
      {
        text: "That sounds like a lot of moving parts. What part of it do you actually like most?",
        score: 3,
        feedback:
          "Simple, interested, and centered on her world. Carnegie works because people open up when they feel your attention is real.",
      },
    ],
    idealResponse:
      "That sounds like a lot of moving parts. What part of it do you actually like most? Real interest is more memorable than a polished mini-speech.",
    scoringFramework: ['Warmth', 'Curiosity', 'Respect'],
  },
  {
    id: 'carnegie-002',
    skillCategory: 'Leadership',
    subSkill: 'Let them save face',
    source: CARNEGIE_SOURCE,
    openTextReady: false,
    principle: 'Correct without cornering them',
    situation:
      "A junior on your team presented the wrong slide deck to a client. The meeting recovered, but now you're debriefing one-on-one and you want to make sure it does not happen again.",
    options: [
      {
        text: "That was sloppy. You need to get more serious about prep because that kind of mistake makes the whole team look amateur.",
        score: 0,
        feedback:
          "You made the person smaller to make the lesson bigger. That usually gets you shame and defensiveness, not better habits.",
      },
      {
        text: "You know that could have gone badly, right? I'm not mad, but we really cannot have that happen with a client again.",
        score: 1,
        feedback:
          "Better tone, same pressure. They still leave feeling pinned to the mistake instead of coached through the fix.",
      },
      {
        text: "Let's tighten the pre-call routine. The wrong deck slipped in today, so next time let's do a two-minute final check together before we join.",
        score: 2,
        feedback:
          "Good move toward process instead of blame. The best answer also protects their dignity by sharing ownership of the fix.",
      },
      {
        text: "Let's make the pre-call routine a little tighter. The wrong deck slipped in today, so next time we'll do a two-minute final check before we join.",
        score: 3,
        feedback:
          "Same lesson, no humiliation. You corrected the behavior and left their self-respect intact, which makes change easier to accept.",
      },
    ],
    idealResponse:
      "Let's make the pre-call routine a little tighter. The wrong deck slipped in today, so next time we'll do a two-minute final check before we join. Fix the process and protect the person.",
    scoringFramework: ['Warmth', 'Respect', 'Influence'],
  },
  {
    id: 'carnegie-003',
    skillCategory: 'Communication',
    subSkill: 'Do not argue to win',
    source: CARNEGIE_SOURCE,
    openTextReady: false,
    principle: 'Leave room for the other person to stay whole',
    situation:
      'At dinner, your uncle confidently explains how your industry works, and almost everything he says is wrong. Everyone at the table looks at you because they know you do this for a living.',
    options: [
      {
        text: "That is not how any of it works. You're mixing three different things together and none of them are even close.",
        score: 0,
        feedback:
          "You may be correct, but now the real game is pride. Once that starts, facts stop mattering.",
      },
      {
        text: "It is a bit more nuanced than that, but I get what you mean. The reality is more complicated than people think.",
        score: 1,
        feedback:
          "Softer, but still vague and a little superior. You are still broadcasting that he is wrong in front of an audience.",
      },
      {
        text: "There is some overlap there. In my world it usually plays out a little differently, mostly because the client side changes the incentives.",
        score: 2,
        feedback:
          "Decent. You sidestepped the duel and added perspective. The green answer makes the shift even easier for him to accept.",
      },
      {
        text: "I can see why it looks that way from the outside. In practice it usually works a bit differently on the client side.",
        score: 3,
        feedback:
          "You gave him a bridge instead of a public correction. Carnegie would take that trade every time.",
      },
    ],
    idealResponse:
      "I can see why it looks that way from the outside. In practice it usually works a bit differently on the client side. You kept the relationship above the ego hit.",
    scoringFramework: ['Warmth', 'Respect', 'Influence'],
  },
  {
    id: 'power-001',
    skillCategory: 'Leadership',
    subSkill: "Don't outshine the boss",
    source: POWER_SOURCE,
    openTextReady: false,
    principle: 'Let the senior person keep the spotlight',
    situation:
      'You just nailed the hardest answer in a client workshop, and everyone in the room is now looking to you instead of your manager. Your manager is the kind who gets insecure when that happens.',
    options: [
      {
        text: "I can take the rest from here if that's helpful, because I think this part sits more naturally with me than with most people in the room.",
        score: 0,
        feedback:
          "You may as well have announced a coup. Publicly stepping over an insecure boss is a quick way to create a private enemy.",
      },
      {
        text: "Sure, happy to explain more. I actually built the core of this approach, so it probably makes sense if I walk everyone through the logic myself.",
        score: 1,
        feedback:
          "Still too much self-display. You are making the room compare you to your manager in real time, which is exactly the trap.",
      },
      {
        text: "Happy to add detail. The framing [manager name] set is exactly right, and the implementation piece underneath it looks like this.",
        score: 2,
        feedback:
          "Smart. You gave credit upward and still showed competence. The best answer is slightly cleaner and hands the room back even faster.",
      },
      {
        text: "Happy to add detail. [manager name] framed the decision well, and the implementation piece underneath it looks like this.",
        score: 3,
        feedback:
          "You stayed useful without making the hierarchy wobble. Power is often about avoiding unnecessary enemies, not winning obvious moments.",
      },
    ],
    idealResponse:
      "Happy to add detail. [manager name] framed the decision well, and the implementation piece underneath it looks like this. Be useful, not flashy.",
    scoringFramework: ['Positioning', 'Timing', 'Restraint'],
  },
  {
    id: 'power-002',
    skillCategory: 'Business Thinking',
    subSkill: 'Say less than necessary',
    source: POWER_SOURCE,
    openTextReady: false,
    principle: 'Do not volunteer strategic detail',
    situation:
      'A competitor-friendly consultant asks what your next product move is while three people are listening nearby at a conference drinks table. He sounds casual, but the timing feels deliberate.',
    options: [
      {
        text: "We're probably pushing harder into exam simulations, more AI scoring, and a cleaner mobile flow. Nothing final, but that is where my head is right now.",
        score: 0,
        feedback:
          "You filled the silence with free intelligence. Once details are out, they do not come back.",
      },
      {
        text: "A few directions are on the table. I do not want to say too much yet because nothing is locked and people tend to run with half-heard things.",
        score: 1,
        feedback:
          "Better, but still a little nervous and over-explained. You can be shorter than this and lose nothing.",
      },
      {
        text: "We are tightening the core product before adding anything noisy. Still early, so I am keeping the rest close for now.",
        score: 2,
        feedback:
          "Good signal, limited exposure. The green answer is even calmer because it gives less while sounding more settled.",
      },
      {
        text: "We are focused on tightening the core right now. I will talk more once it is live.",
        score: 3,
        feedback:
          "Short, composed, nothing useful to mine. Saying less is often less about mystery and more about not giving away leverage for free.",
      },
    ],
    idealResponse:
      "We are focused on tightening the core right now. I will talk more once it is live. Calm, brief, done.",
    scoringFramework: ['Positioning', 'Timing', 'Restraint'],
  },
  {
    id: 'power-003',
    skillCategory: 'Assertiveness',
    subSkill: 'Guard your reputation early',
    source: POWER_SOURCE,
    openTextReady: false,
    principle: 'Correct the story before it hardens',
    situation:
      'A rumor starts on Slack that you missed a deadline because you were busy recording courses. The real delay came from a blocked client dependency, but the story is starting to stick.',
    options: [
      {
        text: "That is a lie. If people want to gossip instead of checking facts, that says more about them than it does about me.",
        score: 0,
        feedback:
          "Hot and defensive. You corrected the rumor by creating a second problem called your tone.",
      },
      {
        text: "Just so everyone knows, I was not the blocker here. There were client dependencies outside my control and I do not want my name attached to the wrong story.",
        score: 1,
        feedback:
          "Understandable, but it still sounds rattled. The room can smell when you feel accused, which keeps the rumor alive.",
      },
      {
        text: "Quick correction so the thread stays accurate: the delay came from the client dependency, not course work on my side. Happy to share the timeline if useful.",
        score: 2,
        feedback:
          "Good correction and good temperature. The score-3 answer is even cleaner because it leads with accuracy rather than self-protection.",
      },
      {
        text: "Quick correction so the thread stays accurate: the delay came from the client dependency, not my side. Happy to share the timeline if useful.",
        score: 3,
        feedback:
          "Calm, factual, and early. That is how you protect reputation without sounding like you are pleading your case.",
      },
    ],
    idealResponse:
      "Quick correction so the thread stays accurate: the delay came from the client dependency, not my side. Happy to share the timeline if useful. You fix the story before it grows teeth.",
    scoringFramework: ['Positioning', 'Timing', 'Restraint'],
  },
  {
    id: 'mastery-001',
    skillCategory: 'Business Thinking',
    subSkill: 'Choose apprenticeship over glamour',
    source: MASTERY_SOURCE,
    openTextReady: false,
    principle: 'Do not trade depth for fast applause',
    situation:
      "A well-connected founder offers you a flashy partnership that would put your face on the front page, but it would also pull you away from the deep work that is actually making you better at your craft.",
    options: [
      {
        text: "This is exactly the kind of shortcut I have earned. Visibility matters more than another quiet year polishing the same skill in the dark.",
        score: 0,
        feedback:
          "You are chasing the surface reward and calling it strategy. Greene's point is that depth compounds while shortcuts make you shallow faster.",
      },
      {
        text: "I should probably say yes because opportunities like this do not come around often, even if the timing is messy and it pulls me in ten directions.",
        score: 1,
        feedback:
          "This is fear of missing out dressed up as ambition. You are letting rarity make the decision for you.",
      },
      {
        text: "Tempting, but I need to protect the work I am building right now. If there is a version later that does not break the apprenticeship, we can revisit it.",
        score: 2,
        feedback:
          "Good instinct. You protected the path. The best answer is a little firmer and less eager to keep the door emotionally open.",
      },
      {
        text: "Appreciate it, but I am staying focused on the work I am building right now. It is the wrong move for this phase.",
        score: 3,
        feedback:
          "Clear choice, no glamour-chasing, no apology. Mastery comes from protecting the right decade, not winning the right week.",
      },
    ],
    idealResponse:
      "Appreciate it, but I am staying focused on the work I am building right now. It is the wrong move for this phase. Depth first.",
    scoringFramework: ['Depth', 'Discipline', 'Long game'],
  },
  {
    id: 'mastery-002',
    skillCategory: 'Leadership',
    subSkill: "Use the mentor's eye",
    source: MASTERY_SOURCE,
    openTextReady: false,
    principle: 'Take the hard note without defending',
    situation:
      'A mentor you respect reviews your course landing page and says, "This is polished, but it still feels like you are hiding behind polish instead of saying something sharp." Your first instinct is to explain what you were trying to do.',
    options: [
      {
        text: "I get that, but you are missing the strategy. The polish is there on purpose because the audience needs trust first before I go sharper.",
        score: 0,
        feedback:
          "You turned feedback into a courtroom. The defensive explanation protects your ego and blocks the lesson.",
      },
      {
        text: "Fair enough. I have been trying a lot of different directions, so maybe it just needs another pass and more time to settle.",
        score: 1,
        feedback:
          "Not defensive, but too vague. You accepted the note without pulling out anything useful from it.",
      },
      {
        text: "That makes sense. What line or section feels most hidden to you, so I can sharpen the exact place instead of guessing?",
        score: 2,
        feedback:
          "Good. You stayed open and turned critique into specifics. The score-3 answer is slightly stronger because it drops the self-protective preface entirely.",
      },
      {
        text: "What part feels hidden to you? I want the sharpest version, so point me at the exact place.",
        score: 3,
        feedback:
          "That is the apprentice move. No defense, just extraction of signal. Mastery grows faster when the ego sits down.",
      },
    ],
    idealResponse:
      "What part feels hidden to you? I want the sharpest version, so point me at the exact place. The goal is signal, not self-protection.",
    scoringFramework: ['Depth', 'Discipline', 'Coachability'],
  },
  {
    id: 'mastery-003',
    skillCategory: 'Business Thinking',
    subSkill: 'Choose depth over novelty',
    source: MASTERY_SOURCE,
    openTextReady: false,
    principle: 'Stay long enough to get dangerous',
    situation:
      'A friend says you should stop refining one thing and launch three new offers at once because "the market rewards speed." You know you are on the edge of something good, but the pressure to scatter is real.',
    options: [
      {
        text: "You are right, maybe I am overthinking it. More surface area probably means more luck, so I should just flood the market and see what sticks.",
        score: 0,
        feedback:
          "That is not strategy, it is impatience. Scatter can feel productive while quietly killing depth.",
      },
      {
        text: "I hear you, but I kind of want to keep both paths alive just in case. I will probably keep refining this while starting two smaller tests on the side.",
        score: 1,
        feedback:
          "Classic split focus. You kept the comforting option of depth while choosing the reality of dilution.",
      },
      {
        text: "Speed matters, but right now my edge comes from going deeper where I already have traction. I would rather finish one sharp thing than release three thin ones.",
        score: 2,
        feedback:
          "Good reasoning. The best answer is just a touch cleaner and less like a debate club statement.",
      },
      {
        text: "Right now the edge is depth, not volume. I would rather finish one sharp thing than release three thin ones.",
        score: 3,
        feedback:
          "Clear, calm, disciplined. That is how you protect the long game when other people are addicted to motion.",
      },
    ],
    idealResponse:
      "Right now the edge is depth, not volume. I would rather finish one sharp thing than release three thin ones. Stay with the work until it has teeth.",
    scoringFramework: ['Depth', 'Discipline', 'Long game'],
  },
  {
    id: 'human-001',
    skillCategory: 'Emotional Intelligence',
    subSkill: 'Read the emotion under the comment',
    source: HUMAN_NATURE_SOURCE,
    openTextReady: false,
    principle: 'Look past the surface jab',
    situation:
      'You share a win, and a colleague smiles then says, "Must be nice to have time for side projects when the rest of us are buried." Everyone laughs a little, but the tone is not clean.',
    options: [
      {
        text: "If you managed your time better, maybe you would have room for side projects too.",
        score: 0,
        feedback:
          "You hit the envy directly and made it uglier. Once you answer a disguised jab with a clean jab, the room turns sour fast.",
      },
      {
        text: "Relax, it was just one course update. You are making it sound like I am on a beach somewhere while you are doing all the work.",
        score: 1,
        feedback:
          "Defensive and too literal. You heard the words but missed the emotion driving them.",
      },
      {
        text: "I know the team is under pressure right now. If the timing of that landed badly, that was not my aim.",
        score: 2,
        feedback:
          "Good read on the pressure in the room. The green answer keeps that read while also drawing a quiet line around the jab.",
      },
      {
        text: "I know the team is under pressure right now. That was a win I was sharing, not a comparison.",
        score: 3,
        feedback:
          "You read the insecurity underneath the comment and answered the room, not just the sentence. That is the stronger move.",
      },
    ],
    idealResponse:
      "I know the team is under pressure right now. That was a win I was sharing, not a comparison. You respond to the deeper feeling without rolling over.",
    scoringFramework: ['Observation', 'Self-command', 'Perspective'],
  },
  {
    id: 'human-002',
    skillCategory: 'Leadership',
    subSkill: 'Watch patterns, not charm',
    source: HUMAN_NATURE_SOURCE,
    openTextReady: false,
    principle: 'Do not let charm do your thinking',
    situation:
      'A candidate interviews brilliantly. They are warm, sharp, and instantly liked by everyone. One teammate raises a concern that the examples were all polished but strangely light on specifics.',
    options: [
      {
        text: "The room loved them. At some point you have to trust your instinct and stop looking for problems that probably are not there.",
        score: 0,
        feedback:
          "Charm just replaced evidence. That is exactly how people talk themselves into preventable mistakes.",
      },
      {
        text: "Maybe. But being polished is part of the job, so I do not want to over-penalize someone for interviewing well.",
        score: 1,
        feedback:
          "Reasonable on the surface, but it still lets charisma set the terms. You are defending the impression instead of testing it.",
      },
      {
        text: "The polish was strong, which is why I want one extra pass on specifics before we get carried away. Let's do a reference call focused on execution details.",
        score: 2,
        feedback:
          "Good skepticism without cynicism. The best answer is just a bit cleaner because it turns the next step into a direct discipline, not an emotional correction.",
      },
      {
        text: "The polish was strong. Let's test specifics before we decide, because charm is not the same as evidence.",
        score: 3,
        feedback:
          "Sharp and grounded. Greene's point here is not to become cold. It is to stop letting the first impression do the deciding for you.",
      },
    ],
    idealResponse:
      "The polish was strong. Let's test specifics before we decide, because charm is not the same as evidence. Pattern over impression.",
    scoringFramework: ['Observation', 'Self-command', 'Discernment'],
  },
  {
    id: 'human-003',
    skillCategory: 'Relationships',
    subSkill: 'Do not personalize every mood',
    source: HUMAN_NATURE_SOURCE,
    openTextReady: false,
    principle: 'Get curious before you get wounded',
    situation:
      'Alicja has been quieter since a hard weekend with family. She answers short, pulls inward, and you can feel yourself making it about you.',
    options: [
      {
        text: "If I did something, just say it, because this cold energy is exhausting and I cannot keep guessing what is wrong.",
        score: 0,
        feedback:
          "You turned her internal state into your accusation. That usually creates the exact distance you fear.",
      },
      {
        text: "You have been off since Sunday. I am trying not to take it personally, but it kind of feels personal when you go this quiet.",
        score: 1,
        feedback:
          "Honest, but still centered on your discomfort. You are half curious and half asking her to regulate you.",
      },
      {
        text: "You seem a little pulled in. Is this about us, or are you still carrying the family weekend?",
        score: 2,
        feedback:
          "Good read and good question. The green answer eases the pressure a little more by not making her pick between two loaded buckets.",
      },
      {
        text: "You seem a little pulled in. Do you want space, or do you want company?",
        score: 3,
        feedback:
          "Strong because it does not assume motive and it offers two safe ways to answer. Curiosity first, self-story second.",
      },
    ],
    idealResponse:
      "You seem a little pulled in. Do you want space, or do you want company? Stay out of the fantasy that every shift in mood is about you.",
    scoringFramework: ['Observation', 'Self-command', 'Perspective'],
  },
  {
    id: '50th-001',
    skillCategory: 'Assertiveness',
    subSkill: 'Negotiate without fear',
    source: FIFTYTH_SOURCE,
    openTextReady: false,
    principle: 'Do not let urgency borrow your spine',
    situation:
      'A client says they need a decision on a discounted rate by tonight or they will go elsewhere. The deadline sounds designed to make you flinch.',
    options: [
      {
        text: "Fine, I can bend a little just to keep this moving. I do not want to lose the project over timing games, so let's just get it done.",
        score: 0,
        feedback:
          "Fear is running the negotiation now. Once they feel that, the pressure tactic becomes the strategy.",
      },
      {
        text: "That is pretty aggressive, honestly. I am open to a fair deal, but I do not love being pushed into a same-day decision like this.",
        score: 1,
        feedback:
          "You named the manipulation, but you still showed it landed. The stronger move is less emotional and more reality-based.",
      },
      {
        text: "If the fit is real tomorrow, it is real tonight. My rate stands. If you need to pause, I understand.",
        score: 2,
        feedback:
          "Strong frame and low fear. The green answer is slightly better because it drops the cleverness and sounds even more grounded.",
      },
      {
        text: "My rate stands. If the fit is there, we can move. If not, no hard feelings.",
        score: 3,
        feedback:
          "Fearless without performing fearlessness. Calm reality beats deadline theater almost every time.",
      },
    ],
    idealResponse:
      "My rate stands. If the fit is there, we can move. If not, no hard feelings. Hold your ground without trying to look hard.",
    scoringFramework: ['Reality', 'Fearlessness', 'Self-possession'],
  },
  {
    id: '50th-002',
    skillCategory: 'Leadership',
    subSkill: 'Move before you feel ready',
    source: FIFTYTH_SOURCE,
    openTextReady: false,
    principle: 'Step toward the hard thing cleanly',
    situation:
      'A messy project needs an owner. Everyone stays quiet. You know you could lead it, but you also know it would stretch you hard in public.',
    options: [
      {
        text: "I can do it if nobody else can, but I should say now that I have never run something this tangled and I do not want it on me if it slips.",
        score: 0,
        feedback:
          "You reached for the opportunity and undercut yourself in the same sentence. That is fear trying to buy insurance.",
      },
      {
        text: "I could take it, I guess, but I would need a lot of support and a bit more time to think before I commit in front of everyone.",
        score: 1,
        feedback:
          "Still fear-first. The room does not need fake confidence, but it does need someone who sounds like they can hold pressure.",
      },
      {
        text: "I can take point on it. I will need clear decision rights and one weekly unblock with you so it does not stall.",
        score: 2,
        feedback:
          "Good. You stepped up and named conditions instead of excuses. The best answer is just slightly cleaner in the first line.",
      },
      {
        text: "I will take it. I need clear decision rights and one weekly unblock with you so it does not stall.",
        score: 3,
        feedback:
          "Direct, grounded, no self-protective throat clearing. That is what fearlessness looks like in a real room.",
      },
    ],
    idealResponse:
      "I will take it. I need clear decision rights and one weekly unblock with you so it does not stall. Step forward, then shape the conditions.",
    scoringFramework: ['Reality', 'Fearlessness', 'Self-possession'],
  },
  {
    id: '50th-003',
    skillCategory: 'Business Thinking',
    subSkill: 'Stay with reality',
    source: FIFTYTH_SOURCE,
    openTextReady: false,
    principle: 'Do not let intimidation rewrite the facts',
    situation:
      'A louder, more senior consultant tells the room your estimate is naive. You checked it twice. He has status. You have the numbers.',
    options: [
      {
        text: "You are wrong. I did the math properly, and if you want to challenge it then challenge the numbers instead of acting like your title settles it.",
        score: 0,
        feedback:
          "You made it a dominance fight. Now the numbers are secondary and the room is watching posture instead of reality.",
      },
      {
        text: "Maybe I am off, but I do not think it is as naive as that. I can walk through my logic if that helps.",
        score: 1,
        feedback:
          "Too much retreat before you even speak the facts. You had the numbers and still opened with self-doubt.",
      },
      {
        text: "Happy to walk through the numbers. If I missed something, we'll find it. If not, the estimate stands.",
        score: 2,
        feedback:
          "Good footing. The best answer is a little cleaner because it removes the extra reassuring tone.",
      },
      {
        text: "Let's walk the numbers. If they hold, the estimate holds.",
        score: 3,
        feedback:
          "Reality, not rank. Short, calm, unafraid. That is the whole move.",
      },
    ],
    idealResponse:
      "Let's walk the numbers. If they hold, the estimate holds. You return the room to reality and refuse the intimidation game.",
    scoringFramework: ['Reality', 'Fearlessness', 'Self-possession'],
  },
  {
    id: 'voss-001',
    skillCategory: 'Communication',
    subSkill: 'Label the emotion',
    source: VOSS_SOURCE,
    openTextReady: false,
    principle: 'Name the feeling before the solution',
    situation:
      'A stakeholder says, "This timeline is ridiculous." You can already feel yourself wanting to defend the plan point by point.',
    options: [
      {
        text: "It is not ridiculous. We already compressed the schedule twice and there is no more slack without breaking the build.",
        score: 0,
        feedback:
          "You argued with the emotion before the emotion was heard. That usually makes the other side louder, not wiser.",
      },
      {
        text: "I get that you do not like the timeline, but these are the constraints we are dealing with and they are not going away.",
        score: 1,
        feedback:
          "You nodded at the feeling and then hurried back to your own point. The label needs room to land.",
      },
      {
        text: "It sounds like this feels late enough to make you worry we are already behind.",
        score: 2,
        feedback:
          "Good label. You named the concern instead of fighting the word ridiculous. The best answer is just a touch more natural and less diagnostic.",
      },
      {
        text: "Sounds like the timeline feels later than you can comfortably defend on your side.",
        score: 3,
        feedback:
          "Strong label. It lowers resistance because you did not argue the adjective. You translated the heat into the real concern.",
      },
    ],
    idealResponse:
      "Sounds like the timeline feels later than you can comfortably defend on your side. Once they feel heard, you can talk about the actual plan.",
    scoringFramework: ['Tactical empathy', 'Calm', 'Leverage'],
  },
  {
    id: 'voss-002',
    skillCategory: 'Assertiveness',
    subSkill: 'Calibrated no',
    source: VOSS_SOURCE,
    openTextReady: false,
    principle: 'Let them solve the impossible ask',
    situation:
      'A client asks you to add a new dashboard and two flows for free because "it should only take a few hours." You want to hold the boundary without sounding rigid.',
    options: [
      {
        text: "No, that is out of scope. If you want more work, you need to pay for it. I cannot keep absorbing extras every sprint.",
        score: 0,
        feedback:
          "True, but too blunt. You shut the door and made them the problem, which invites a fight over fairness.",
      },
      {
        text: "I understand why it seems small, but it is more work than it looks. Maybe I can squeeze part of it in if we leave something else out.",
        score: 1,
        feedback:
          "You started bargaining against yourself before they earned it. The request still owns the frame.",
      },
      {
        text: "How am I supposed to add that without moving the date or the budget?",
        score: 2,
        feedback:
          "Good calibrated question. You pushed the problem back where it belongs. The best answer adds a little more structure around the trade-off.",
      },
      {
        text: "How am I supposed to add that without moving the date or the budget? Which one would you like to change?",
        score: 3,
        feedback:
          "That is clean. No fight, no free yes. You turned an unreasonable ask into a decision with visible costs.",
      },
    ],
    idealResponse:
      "How am I supposed to add that without moving the date or the budget? Which one would you like to change? A strong no often sounds like a question.",
    scoringFramework: ['Tactical empathy', 'Calm', 'Leverage'],
  },
  {
    id: 'voss-003',
    skillCategory: 'Business Thinking',
    subSkill: 'Mirror to draw them out',
    source: VOSS_SOURCE,
    openTextReady: false,
    principle: 'Use the last words as a lever',
    situation:
      'A prospect says, "We had a bad experience with consultants before." The statement is vague, and if you answer too fast you may solve the wrong problem.',
    options: [
      {
        text: "We are not like most consultants. We are practical, fast, and we actually understand the platform instead of just selling slides.",
        score: 0,
        feedback:
          "You defended yourself against a story they have not even told yet. That is how you miss the real objection.",
      },
      {
        text: "Sorry to hear that. Was it a delivery issue, a communication issue, or just a general fit problem with the last team?",
        score: 1,
        feedback:
          "Better, but still too eager to structure their answer for them. You may box them into your categories instead of theirs.",
      },
      {
        text: "Bad experience with consultants before?",
        score: 2,
        feedback:
          "Simple mirror, strong move. The score-3 answer adds one quiet beat that makes it feel even more inviting.",
      },
      {
        text: "A bad experience with consultants before?",
        score: 3,
        feedback:
          "Short, curious, and open. Sometimes the best next line is just enough to make them keep talking.",
      },
    ],
    idealResponse:
      "A bad experience with consultants before? Then stay quiet. Let them do the heavy lifting.",
    scoringFramework: ['Tactical empathy', 'Calm', 'Leverage'],
  },
  {
    id: 'crucial-001',
    skillCategory: 'Communication',
    subSkill: 'Start with mutual purpose',
    source: CRUCIAL_SOURCE,
    openTextReady: false,
    principle: 'Make safety visible first',
    situation:
      'You need to tell a collaborator that their habit of going silent for three days is breaking momentum. The topic is touchy, and they get defensive fast.',
    options: [
      {
        text: "We need to talk about your disappearing act because it keeps slowing everything down and I am tired of chasing updates.",
        score: 0,
        feedback:
          "Straight into blame. The problem may be real, but safety just left the room before the real conversation began.",
      },
      {
        text: "I am not trying to attack you here, but the long gaps in communication have become a real issue for the project.",
        score: 1,
        feedback:
          "Better intention, but 'I am not attacking you' often lands like a warning that an attack is coming.",
      },
      {
        text: "I want us moving faster without this turning into blame. Can we look at what happens when messages sit for three days?",
        score: 2,
        feedback:
          "Good mutual-purpose setup. The green answer is slightly stronger because it anchors the shared goal even more clearly.",
      },
      {
        text: "I want us moving faster and I want this to stay good between us. Can we look at what happens when messages sit for three days?",
        score: 3,
        feedback:
          "That is the right opening. Shared goal, shared relationship, then the hard fact. Safety first makes candor possible.",
      },
    ],
    idealResponse:
      "I want us moving faster and I want this to stay good between us. Can we look at what happens when messages sit for three days? Safety first, then candor.",
    scoringFramework: ['Safety', 'Candor', 'Mutual purpose'],
  },
  {
    id: 'crucial-002',
    skillCategory: 'Leadership',
    subSkill: 'Facts before story',
    source: CRUCIAL_SOURCE,
    openTextReady: false,
    principle: 'State what happened before what it means',
    situation:
      'A teammate has been late to your one-on-ones three weeks in a row. You are starting to tell yourself a story that they do not respect your time.',
    options: [
      {
        text: "I get the feeling these meetings are not a priority for you, because being late every week says a lot even if nobody says it out loud.",
        score: 0,
        feedback:
          "You jumped straight to motive. Once you do that, they stop hearing the pattern and start defending their character.",
      },
      {
        text: "You have been late a few times and I am trying not to read into it, but it is hard not to wonder what is going on there.",
        score: 1,
        feedback:
          "A little softer, but still moving too quickly into your story. Facts need more space before interpretation shows up.",
      },
      {
        text: "You were seven minutes late this week, nine last week, and five the week before. I want to talk about what is behind that pattern.",
        score: 2,
        feedback:
          "Good. Concrete facts first, meaning second. The best answer adds one small piece of shared intent so the conversation feels less prosecutorial.",
      },
      {
        text: "You were seven minutes late this week, nine last week, and five the week before. I want to understand what is behind that pattern so we can fix it.",
        score: 3,
        feedback:
          "That is the move. Facts first, then curiosity, then shared repair. Hard to argue with and easy to respond to.",
      },
    ],
    idealResponse:
      "You were seven minutes late this week, nine last week, and five the week before. I want to understand what is behind that pattern so we can fix it. Facts first, then meaning.",
    scoringFramework: ['Safety', 'Candor', 'Mutual purpose'],
  },
  {
    id: 'crucial-003',
    skillCategory: 'Relationships',
    subSkill: 'Restore safety',
    source: CRUCIAL_SOURCE,
    openTextReady: false,
    principle: 'When heat rises, make it safer to stay',
    situation:
      'Alicja says, "Forget it, this is why I do not bring things up." You can feel the conversation closing right in front of you.',
    options: [
      {
        text: "That is unfair. I am literally sitting here trying to talk and you are the one shutting it down right now.",
        score: 0,
        feedback:
          "You answered shutdown with accusation. That almost always finishes the shutdown instead of reopening it.",
      },
      {
        text: "No, come on, do not do this. I want to solve it, but I cannot if you just pull the plug every time it gets uncomfortable.",
        score: 1,
        feedback:
          "You tried to keep it open, but it still sounds like pressure. Safety does not grow when the other person feels chased.",
      },
      {
        text: "I do want to hear it, and I can tell this does not feel safe right now. What would help this feel easier to say?",
        score: 2,
        feedback:
          "Good read on the climate and good invitation. The green answer is slightly stronger because it also owns your part in the current moment.",
      },
      {
        text: "I do want to hear it, and I can tell I am part of why this does not feel safe right now. What would make it easier to say?",
        score: 3,
        feedback:
          "Strong. You restored safety by lowering your own ego first. Once safety returns, the truth usually follows.",
      },
    ],
    idealResponse:
      "I do want to hear it, and I can tell I am part of why this does not feel safe right now. What would make it easier to say? Repair the climate before you chase the content.",
    scoringFramework: ['Safety', 'Candor', 'Mutual purpose'],
  },
];
