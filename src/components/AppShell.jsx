import { useState } from 'react';
import { colors, fonts, fontSizes } from '../styles/theme';
import IconHome from './icons/IconHome';
import IconDrill from './icons/IconDrill';
import IconResponses from './icons/IconResponses';
import IconDashboard from './icons/IconDashboard';
import Home from './Home';
import Drill from './Drill';
import Responses from './Responses';
import Dashboard from './Dashboard';

// Bottom-nav shell. Owns the active tab and renders one of the four
// tab screens above a fixed bottom nav. The practice / capture / results
// overlays are still owned by App.jsx and render full-bleed above this shell.
const TABS = [
  { id: 'home', label: 'Home', Icon: IconHome },
  { id: 'drill', label: 'Drill', Icon: IconDrill },
  { id: 'responses', label: 'Responses', Icon: IconResponses },
  { id: 'dashboard', label: 'Dashboard', Icon: IconDashboard },
];

export default function AppShell({ onStart, onDailyDrill, onCapture }) {
  const [tab, setTab] = useState('home');

  return (
    <div style={{ minHeight: '100vh', background: colors.bg, paddingBottom: 88 }}>
      <div style={{ maxWidth: 480, margin: '0 auto' }}>
        {tab === 'home' && (
          <Home
            onStart={onStart}
            onOpenDrill={() => setTab('drill')}
          />
        )}
        {tab === 'drill' && (
          <Drill
            onStart={onStart}
            onDailyDrill={onDailyDrill}
            onCapture={onCapture}
          />
        )}
        {tab === 'responses' && <Responses />}
        {tab === 'dashboard' && <Dashboard />}
      </div>

      {/* Fixed bottom nav */}
      <nav
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: colors.surface,
          borderTop: `1px solid ${colors.border}`,
          display: 'flex',
          justifyContent: 'space-around',
          padding: '12px 0 16px 0',
          zIndex: 50,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            width: '100%',
            maxWidth: 480,
            margin: '0 auto',
          }}
        >
          {TABS.map((t) => {
            const active = tab === t.id;
            const TabIcon = t.Icon;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 4,
                  color: active ? colors.accent : colors.textDim,
                  fontFamily: fonts.sans,
                  fontSize: fontSizes.label,
                  fontWeight: 500,
                  padding: '4px 12px',
                  transition: 'color 0.15s',
                }}
              >
                <TabIcon size={22} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
