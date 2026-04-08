import { colors, fonts, fontSizes, spacing } from '../styles/theme';
import IconDashboard from './icons/IconDashboard';

// Placeholder tab. Future: practice counts, streaks, per-category mastery,
// and your strongest pillars (Control / Confidence / Connection).
export default function Dashboard() {
  return (
    <div
      style={{
        padding: '120px 24px 32px 24px',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          color: colors.textDim,
          marginBottom: spacing.md,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <IconDashboard size={48} />
      </div>
      <h2
        style={{
          fontFamily: fonts.serif,
          fontSize: fontSizes.h2,
          fontWeight: 700,
          color: colors.textPrimary,
          margin: `0 0 ${spacing.sm}px 0`,
        }}
      >
        Your dashboard
      </h2>
      <p
        style={{
          fontFamily: fonts.serif,
          fontSize: fontSizes.bodyLg,
          color: colors.textMuted,
          margin: 0,
          lineHeight: 1.5,
          maxWidth: 320,
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        Coming soon. Practice counts, streaks, and your strongest categories will live here.
      </p>
    </div>
  );
}
