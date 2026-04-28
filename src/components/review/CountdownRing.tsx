import type { ReactNode } from "react";

export function CountdownRing({
  totalMs,
  remainingMs,
  onClick,
  center,
  size = 120,
  strokeWidth = 8,
  color,
}: {
  totalMs: number;
  remainingMs: number;
  onClick?: () => void;
  center?: ReactNode;
  size?: number;
  strokeWidth?: number;
  color?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (remainingMs / totalMs) * circumference;

  return (
    <div
      className="relative flex items-center justify-center select-none"
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default", width: size, height: size }}
    >
      <svg className="-rotate-90 transform" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-slate-200 dark:text-slate-800"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color || "currentColor"}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={`transition-all duration-[250ms] ease-linear ${!color && "text-[#165DFF]"}`}
        />
      </svg>
      {center && <div className="absolute inset-0 flex items-center justify-center">{center}</div>}
    </div>
  );
}

