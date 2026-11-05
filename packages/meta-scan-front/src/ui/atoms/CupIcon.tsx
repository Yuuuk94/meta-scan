// Custom cup drawing from the donation design (issue #63) — not lucide's
// `Coffee` glyph (different outline). Size via className (`size-*`).
interface CupIconProps {
  className?: string;
  strokeWidth?: number;
}

export const CupIcon = ({ className, strokeWidth = 2 }: CupIconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    <path d="M4 8h12v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V8z" />
    <path d="M16 10h2a3 3 0 0 1 0 6h-2" />
    <path d="M8 3v2M12 3v2" />
  </svg>
);
