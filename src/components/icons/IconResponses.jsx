// Inline SVG responses icon. Two stacked chat-bubble shapes so it
// reads as "messages you've sent" without needing text.
export default function IconResponses({ size = 24 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H9l-3 3v-3H6a2 2 0 0 1-2-2z" />
      <path d="M8 17v1a2 2 0 0 0 2 2h6l3 3v-3h0a2 2 0 0 0 2-2v-5" />
    </svg>
  );
}
