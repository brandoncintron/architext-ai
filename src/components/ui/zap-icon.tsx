export function ZapIcon({ className }: { className?: string }) {
  return (
    <svg
      fill="none"
      height="1em"
      className={className}
      viewBox="0 0 24 24"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          id="lobe-icons-zap-fill"
          x1="0%"
          x2="68.73%"
          y1="100%"
          y2="25.395%"
        >
          <stop offset="0%" stopColor="#1C7DFF"></stop>
          <stop offset="52.021%" stopColor="#1C69FF"></stop>
          <stop offset="100%" stopColor="#F0DCD6"></stop>
        </linearGradient>
      </defs>
      <path
        d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
        stroke="url(#lobe-icons-zap-fill)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
