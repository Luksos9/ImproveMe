// Claude API wrapper for Tier 2/3 open-text scoring.
//
// This is a personal local-only app, so we use dangerouslyAllowBrowser:true
// and read the key from VITE_ANTHROPIC_API_KEY in .env.local.
// Never deploy this app publicly with the key bundled.

import Anthropic from '@anthropic-ai/sdk';
import { FISHER_RUBRIC, FISHER_ANTI_PATTERNS } from '../data/scoring';
import { FISHER_CATEGORIES } from '../data/fisher-scenarios';

const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

let _client = null;
function getClient() {
  if (!apiKey || apiKey.includes('PASTE-YOUR-KEY')) {
    throw new Error(
      'VITE_ANTHROPIC_API_KEY is not set. Edit .env.local and paste your key, then restart the dev server.'
    );
  }
  if (!_client) {
    _client = new Anthropic({
      apiKey,
      dangerouslyAllowBrowser: true,
    });
  }
  return _client;
}

// Build the system prompt that teaches Claude the Fisher framework + how to score.
function buildSystemPrompt() {
  const pillarsBlock = FISHER_RUBRIC.pillars
    .map(
      (p) =>
        `- ${p.name}: ${p.definition}\n  Tells: ${p.tells.join('; ')}`
    )
    .join('\n');

  const bandsBlock = FISHER_RUBRIC.scoreBands
    .map((b) => `- ${b.score} (${b.label}): ${b.meaning}`)
    .join('\n');

  return `You are a strict but fair evaluator trained on Jefferson Fisher's "The Next Conversation" framework. Your job is to score how well a typed response would actually work in a real conversation.

THE THREE PILLARS:
${pillarsBlock}

SCORE BANDS:
${bandsBlock}

ANTI-PATTERNS (any of these caps the score at 1 or below):
${FISHER_ANTI_PATTERNS.map((p) => `- ${p}`).join('\n')}

SCORING RULES:
- Compare the user's response to the provided idealResponse, but do NOT require the same words. Reward the same intent and posture.
- If the response is much shorter than the ideal but still hits Control + Confidence + Connection, give it a 3.
- If the response is reactive or attacks back, the score is 0 regardless of length.
- Be honest. Do not inflate scores. The user explicitly asked for tough feedback.
- Feedback must reference the pillars by name and explain WHY the response landed where it did.
- Keep feedback to 2-4 sentences. Conversational tone, not corporate.

OUTPUT FORMAT:
Respond with valid JSON only — no markdown fences, no preamble. Schema:
{
  "score": 0 | 1 | 2 | 3,
  "label": "Fisher approved" | "Close" | "Needs work" | "Missed",
  "feedback": "2-4 sentence explanation referencing pillars by name",
  "pillars": {
    "control": "hit" | "miss",
    "confidence": "hit" | "miss",
    "connection": "hit" | "miss"
  }
}`;
}

// Score a user's open-text response against a scenario.
// Returns a parsed result object, or throws on failure.
export async function scoreOpenResponse({ scenario, userResponse }) {
  if (!userResponse || !userResponse.trim()) {
    return {
      score: 0,
      label: 'Missed',
      feedback: 'You did not type anything. In a real conversation, silence sometimes works — but here, the exercise is to find the words.',
      pillars: { control: 'miss', confidence: 'miss', connection: 'miss' },
    };
  }

  const client = getClient();

  // Raw captures may not have subSkill/principle/idealResponse yet — only situation.
  // Build the prompt with whatever fields are present and let Claude grade
  // against the generic Fisher rubric in the system prompt.
  const lines = [];
  if (scenario.skillCategory) lines.push(`SKILL CATEGORY: ${scenario.skillCategory}`);
  if (scenario.subSkill) lines.push(`SUB-SKILL: ${scenario.subSkill}`);
  if (scenario.principle) lines.push(`PRINCIPLE: ${scenario.principle}`);
  lines.push('', 'SITUATION:', scenario.situation || '(no situation provided)');
  if (scenario.idealResponse) {
    lines.push(
      '',
      'IDEAL RESPONSE (do not require these exact words — use it as a benchmark for posture and intent):',
      scenario.idealResponse
    );
  } else {
    lines.push(
      '',
      '(No benchmark response is provided. Score the user against the generic Fisher rubric only.)'
    );
  }
  lines.push('', "USER'S TYPED RESPONSE:", userResponse.trim(), '', 'Score it.');
  const userPrompt = lines.join('\n');

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 600,
    system: buildSystemPrompt(),
    messages: [{ role: 'user', content: userPrompt }],
  });

  // Extract text from the response.
  const text = message.content
    .filter((block) => block.type === 'text')
    .map((block) => block.text)
    .join('')
    .trim();

  // Strip code fences if Claude added them despite instructions.
  const cleaned = text
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error(
      `Could not parse Claude's response as JSON. Raw text: ${text.slice(0, 200)}`
    );
  }

  // Coerce score to integer 0-3.
  const score = Math.max(0, Math.min(3, parseInt(parsed.score, 10) || 0));
  const labels = ['Missed', 'Needs work', 'Close', 'Fisher approved'];

  return {
    score,
    label: parsed.label || labels[score],
    feedback: parsed.feedback || '(no feedback returned)',
    pillars: parsed.pillars || { control: 'miss', confidence: 'miss', connection: 'miss' },
  };
}

// Helper for components to check if the API is configured before rendering Tier 2/3.
export function isApiConfigured() {
  return Boolean(apiKey && !apiKey.includes('PASTE-YOUR-KEY'));
}

// Build the system prompt for capture-to-scenario generation.
// The user has already picked the skill category they're training. Claude's
// job is to transform the raw moment into a structured scenario WITHIN that
// chosen skill: name the specific tactic (subSkill), write a principle,
// rewrite the situation in second person, and draft a model response.
function buildGenerationSystemPrompt(skillCategory) {
  const pillarsBlock = FISHER_RUBRIC.pillars
    .map((p) => `- ${p.name}: ${p.definition}`)
    .join('\n');

  const fisherSubSkillList = FISHER_CATEGORIES.map((c) => `- ${c}`).join('\n');

  return `You are an authoring assistant trained on Jefferson Fisher's "The Next Conversation" framework. The user just captured a real moment from their life — a conversation that went sideways, a moment they want to handle better next time. They have already chosen the skill category they want to train: "${skillCategory}". Your job is to turn that raw capture into a structured practice scenario within that chosen skill.

THE FISHER FRAMEWORK (the three pillars they're trying to embody):
${pillarsBlock}

FISHER-STYLE SUB-SKILLS (use these as reference for naming the tactic; you may pick one from this list OR invent a short Fisher-style phrase if none fits cleanly):
${fisherSubSkillList}

YOUR TASK — produce four fields from the user's raw text:
1. subSkill: the SPECIFIC tactic this moment teaches. Short noun phrase (≤4 words) in Fisher style, e.g. "De-escalation", "The Pause", "Validation first". Pick from the reference list above if any fits, otherwise invent one.
2. principle: a short (≤10 words) Fisher-style principle that captures the lesson. Imperative voice, e.g. "Validate before you advocate" or "Lower your volume, slow your pace".
3. situation: rewrite the user's raw text in clean second person ("You're talking to your mom and she says..."). Preserve specific names and facts. ~2-4 sentences. Keep the exact thing the other person said in quotes if the user provided it.
4. idealResponse: write a 1-3 sentence model response the user could realistically say in this exact moment. Hits all three pillars (Control, Confidence, Connection). Should sound like something a real person would actually say out loud, not corporate-speak.

LANGUAGE: regardless of what language the user typed in, output ALL four fields in English. Names of people should be preserved as written.

OUTPUT FORMAT:
Respond with valid JSON only — no markdown fences, no preamble, no commentary. Schema:
{
  "subSkill": "<short noun phrase>",
  "principle": "<short imperative>",
  "situation": "<2-4 sentences in second person>",
  "idealResponse": "<1-3 sentences the user could actually say>"
}`;
}

// Transform a raw capture (the user's "what just happened" dump) into a
// fully-formed practice scenario. Used by the Capture flow in the background
// after the user has already navigated back to the menu.
//
// The user picks the skill category on the capture form; Claude fills in
// the subSkill, principle, rewritten situation, and ideal response.
//
// Returns: { subSkill, principle, situation, idealResponse }
// Throws on API failure or unparseable JSON. Callers should leave the capture
// in 'raw' status if this throws, so it's still drillable in Tier 2 fallback.
export async function generateScenarioFromCapture({ rawText, skillCategory, sourceLang = 'en' }) {
  if (!rawText || !rawText.trim()) {
    throw new Error('Cannot generate a scenario from empty text.');
  }
  if (!skillCategory) {
    throw new Error('skillCategory is required — user must pick it on the capture form.');
  }

  const client = getClient();

  const userPrompt = `User's raw capture (language: ${sourceLang}):
"""
${rawText.trim()}
"""

The user chose to train this as "${skillCategory}". Generate the structured scenario now.`;

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 800,
    system: buildGenerationSystemPrompt(skillCategory),
    messages: [{ role: 'user', content: userPrompt }],
  });

  const text = message.content
    .filter((block) => block.type === 'text')
    .map((block) => block.text)
    .join('')
    .trim();

  // Strip markdown fences if Claude added them despite instructions.
  const cleaned = text
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error(
      `Could not parse Claude's generation response as JSON. Raw text: ${text.slice(0, 200)}`
    );
  }

  return {
    subSkill: parsed.subSkill || 'Captured',
    principle: parsed.principle || 'Stay in control of yourself',
    situation: parsed.situation || rawText.trim(),
    idealResponse: parsed.idealResponse || '',
  };
}
