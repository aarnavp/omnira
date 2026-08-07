"use client";

import { useId, useRef, useState, type PointerEvent } from "react";
import { cn } from "@/lib/utils/cn";

export interface SparklinePoint {
  x: string;
  y: number;
}

/**
 * Single-series line + area chart. One hue, a hairline baseline, and a
 * crosshair that snaps to the nearest point on hover/focus — the tooltip
 * value is also always visible as the end label, so hovering only adds
 * detail, it never gates it.
 */
export function Sparkline({
  data,
  formatValue,
  formatX,
  className,
  height = 160,
}: {
  data: SparklinePoint[];
  formatValue: (value: number) => string;
  formatX: (value: string) => string;
  className?: string;
  height?: number;
}) {
  const gradientId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (data.length === 0) return null;

  const width = 480;
  const padding = 8;
  const values = data.map((d) => d.y);
  const max = Math.max(...values, 0);
  const min = Math.min(...values, 0);
  const range = max - min || 1;

  const points = data.map((d, i) => {
    const px = padding + (i / Math.max(data.length - 1, 1)) * (width - padding * 2);
    const py = height - padding - ((d.y - min) / range) * (height - padding * 2);
    return { px, py, label: d.x, value: d.y };
  });

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.px},${p.py}`).join(" ");
  const areaPath = `${linePath} L${points[points.length - 1].px},${height - padding} L${points[0].px},${height - padding} Z`;
  const baselineY = height - padding - ((0 - min) / range) * (height - padding * 2);

  const active = activeIndex !== null ? points[activeIndex] : null;

  function handlePointerMove(event: PointerEvent<SVGRectElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = (event.clientX - rect.left) / rect.width;
    const index = Math.round(ratio * (data.length - 1));
    setActiveIndex(Math.min(Math.max(index, 0), data.length - 1));
  }

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        style={{ height }}
        role="img"
        aria-label={`Trend from ${formatValue(values[0])} to ${formatValue(values[values.length - 1])}`}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-signal-500)" stopOpacity="0.18" />
            <stop offset="100%" stopColor="var(--color-signal-500)" stopOpacity="0" />
          </linearGradient>
        </defs>

        <line
          x1={padding}
          y1={baselineY}
          x2={width - padding}
          y2={baselineY}
          stroke="var(--color-border)"
          strokeWidth="1"
        />

        <path d={areaPath} fill={`url(#${gradientId})`} stroke="none" />
        <path
          d={linePath}
          fill="none"
          stroke="var(--color-signal-600)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {active ? (
          <line
            x1={active.px}
            y1={padding}
            x2={active.px}
            y2={height - padding}
            stroke="var(--color-ink-400)"
            strokeWidth="1"
            strokeDasharray="2 3"
          />
        ) : null}

        <circle
          cx={points[points.length - 1].px}
          cy={points[points.length - 1].py}
          r="4"
          fill="var(--color-signal-600)"
          stroke="var(--color-surface-raised)"
          strokeWidth="2"
        />
        {active ? (
          <circle
            cx={active.px}
            cy={active.py}
            r="4"
            fill="var(--color-signal-600)"
            stroke="var(--color-surface-raised)"
            strokeWidth="2"
          />
        ) : null}

        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill="transparent"
          onPointerMove={handlePointerMove}
          onPointerLeave={() => setActiveIndex(null)}
          tabIndex={0}
          onFocus={() => setActiveIndex(points.length - 1)}
          onBlur={() => setActiveIndex(null)}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") setActiveIndex((i) => Math.max((i ?? 0) - 1, 0));
            if (event.key === "ArrowRight")
              setActiveIndex((i) => Math.min((i ?? 0) + 1, points.length - 1));
          }}
        />
      </svg>

      {active ? (
        <div
          className="pointer-events-none absolute top-0 -translate-x-1/2 rounded-(--radius-sm) border border-(--color-border) bg-(--color-surface-raised) px-2.5 py-1.5 text-xs shadow-sm"
          style={{ left: `${(active.px / width) * 100}%` }}
          role="status"
        >
          <p className="font-mono font-semibold text-(--color-text)">{formatValue(active.value)}</p>
          <p className="text-(--color-text-faint)">{formatX(active.label)}</p>
        </div>
      ) : null}
    </div>
  );
}
