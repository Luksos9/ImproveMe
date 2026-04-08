import { colors, fonts, fontSizes, spacing } from '../styles/theme';
import IconResponses from './icons/IconResponses';

// Placeholder tab. Future: list every typed response with the score
// it earned and a re-score button. For now it just proves the four-tab
// nav works.
export default function Responses() {
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
        <IconResponses size={48} />
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
        Your responses
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
        Coming soon. This tab will show every response you've typed, scored, and saved.
      </p>
    </div>
  );
}
