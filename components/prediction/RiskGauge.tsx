"use client";
// Signature element: arc gauge for risk score.
// SVG-based — no library dependency, precise control.

interface RiskGaugeProps {
  score: number;      // 0–100
  label: string;
  size?: number;
}

export function RiskGauge({ score, label, size = 120 }: RiskGaugeProps) {
  const R     = size * 0.38;
  const cx    = size / 2;
  const cy    = size * 0.56;
  const start = Math.PI;           // 180° — left
  const end   = 2 * Math.PI;      // 360° — right (bottom arc)
  const angle = start + (score / 100) * Math.PI;

  const arcX = (a: number) => cx + R * Math.cos(a);
  const arcY = (a: number) => cy + R * Math.sin(a);

  const trackD = `M ${arcX(start)} ${arcY(start)} A ${R} ${R} 0 0 1 ${arcX(end)} ${arcY(end)}`;
  const fillD  = score > 0
    ? `M ${arcX(start)} ${arcY(start)} A ${R} ${R} 0 ${score > 50 ? 1 : 0} 1 ${arcX(angle)} ${arcY(angle)}`
    : "";

  const color = score < 30 ? "#16A34A" : score < 55 ? "#2563EB" : score < 75 ? "#D97706" : "#DC2626";

  return (
    <div className="flex flex-col items-center select-none">
      <svg width={size} height={size * 0.65} viewBox={`0 0 ${size} ${size * 0.65}`}>
        {/* Track */}
        <path d={trackD} fill="none" stroke="#E2E5EA" strokeWidth="6" strokeLinecap="round" />
        {/* Fill */}
        {fillD && (
          <path d={fillD} fill="none" stroke={color} strokeWidth="6" strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.6s ease" }} />
        )}
        {/* Needle dot */}
        <circle cx={arcX(angle)} cy={arcY(angle)} r="4" fill={color} />
        {/* Score label */}
        <text x={cx} y={cy - 2} textAnchor="middle" fontSize="20" fontWeight="600"
          fontFamily="JetBrains Mono, monospace" fill="#0D0F12">
          {score}
        </text>
        <text x={cx} y={cy + 14} textAnchor="middle" fontSize="9" fill="#6B7280"
          fontFamily="Inter, sans-serif" letterSpacing="0.08em" textTransform="uppercase">
          / 100
        </text>
      </svg>
      <span className="text-xs font-medium mt-0.5" style={{ color }}>{label}</span>
    </div>
  );
}
