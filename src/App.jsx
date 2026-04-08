import { useState } from 'react';
import AppShell from './components/AppShell';
import ScenarioExercise from './components/ScenarioExercise';
import Results from './components/Results';
import Capture from './components/Capture';
import { FISHER_SCENARIOS } from './data/fisher-scenarios';
import { shuffle } from './utils/shuffle';
import { getCapturedScenarios, markPracticed } from './utils/storage';
import { buildDailyDrill } from './utils/dailyDrill';
import { colors, fonts } from './styles/theme';

// Top-level mode router.
// State machine:
//   'menu' → 'practice' → 'results' → 'menu'   (category / all-scenarios flow)
//   'menu' → 'practice'(daily) → 'results' → 'menu' (daily drill always Tier 2)
//   'menu' → 'capture' → 'menu'  (capture form)
export default function App() {
  const [mode, setMode] = useState('menu');
  const [activeScenarios, setActiveScenarios] = useState([]);
  const [sessionResults, setSessionResults] = useState([]);
  const [activeTier, setActiveTier] = useState('tier1');
  // Cache the captured list so the menu can show counts without re-reading
  // localStorage on every render. Re-read on save/drill completion.
  const [captured, setCaptured] = useState(() => getCapturedScenarios());

  // Start a session for a specific skill category (or null for "All") at a given tier.
  // Pool includes all seed scenarios + captures. Filtering is by top-level skillCategory.
  const startPractice = (skillCategory, tier = 'tier1') => {
    const merged = [...FISHER_SCENARIOS, ...captured];
    const filtered =
      skillCategory === null
        ? merged
        : merged.filter((s) => s.skillCategory === skillCategory);
    setActiveScenarios(shuffle(filtered));
    setSessionResults([]);
    setActiveTier(tier);
    setMode('practice');
  };

  // Daily drill — always Tier 2, prioritizes captures via dailyDrill.js algorithm.
  const startDailyDrill = () => {
    const pool = buildDailyDrill();
    setActiveScenarios(pool);
    setActiveTier('tier2');
    setSessionResults([]);
    setMode('practice');
  };

  // Open the capture form.
  const startCapture = () => setMode('capture');

  // After Capture.jsx saves a new entry, re-read storage so the menu count updates.
  const finishCapture = () => {
    setCaptured(getCapturedScenarios());
    setMode('menu');
  };

  const finishSession = (results) => {
    // Stamp practiceCount/lastPracticed on every captured scenario in this session.
    results.forEach((r) => {
      if (r.scenario?.isCapture) {
        markPracticed(r.scenario.id);
      }
    });
    // Re-read so the next menu mount has fresh counts.
    setCaptured(getCapturedScenarios());
    setSessionResults(results);
    setMode('results');
  };

  const resetToMenu = () => {
    setActiveScenarios([]);
    setSessionResults([]);
    setCaptured(getCapturedScenarios());
    setMode('menu');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: colors.bg,
        color: colors.textBody,
        fontFamily: fonts.serif,
      }}
    >
      {mode === 'menu' && (
        <AppShell
          onStart={startPractice}
          onDailyDrill={startDailyDrill}
          onCapture={startCapture}
          capturedCount={captured.length}
        />
      )}

      {mode === 'capture' && <Capture onBack={finishCapture} />}

      {mode === 'practice' && (
        <ScenarioExercise
          scenarios={activeScenarios}
          tier={activeTier}
          onExit={resetToMenu}
          onComplete={finishSession}
        />
      )}

      {mode === 'results' && (
        <Results
          results={sessionResults}
          tier={activeTier}
          onRestart={() => startPractice(null, activeTier)}
          onBackToMenu={resetToMenu}
        />
      )}
    </div>
  );
}
