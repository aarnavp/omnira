"use client";

import { useReducedMotion } from "framer-motion";

const SATELLITE_COUNT = 8;
const CENTER = 100;
const RADIUS = 78;

function satellitePosition(index: number) {
  const angle = (index / SATELLITE_COUNT) * Math.PI * 2 - Math.PI / 2;
  return {
    x: CENTER + Math.cos(angle) * RADIUS,
    y: CENTER + Math.sin(angle) * RADIUS,
  };
}

/**
 * Deploy's signature: one deployment at the center, requests routing out to
 * the nearest devices on the network. Where Contribute's grid is personal
 * and legible, this is systemic — a single app, distributed.
 */
export function RoutingDiagram({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion();
  const satellites = Array.from({ length: SATELLITE_COUNT }, (_, i) => satellitePosition(i));

  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-label="Requests routing from a single deployment to devices across the network">
      {satellites.map((point, i) => (
        <line
          key={`line-${i}`}
          id={`route-path-${i}`}
          x1={CENTER}
          y1={CENTER}
          x2={point.x}
          y2={point.y}
          stroke="var(--color-border)"
          strokeWidth="1"
        />
      ))}

      {!reduceMotion
        ? satellites.map((_, i) => (
            <circle key={`dot-${i}`} cx={CENTER} cy={CENTER} r="2.2" fill="var(--color-brand)" opacity="0">
              <animateMotion
                dur={`${2.4 + (i % 3) * 0.6}s`}
                begin={`${i * 0.35}s`}
                repeatCount="indefinite"
                keyPoints="0;1"
                keyTimes="0;1"
                calcMode="linear"
              >
                <mpath href={`#route-path-${i}`} />
              </animateMotion>
              <animate
                attributeName="opacity"
                values="0;1;1;0"
                keyTimes="0;0.1;0.85;1"
                dur={`${2.4 + (i % 3) * 0.6}s`}
                begin={`${i * 0.35}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))
        : null}

      {satellites.map((point, i) => (
        <rect
          key={`node-${i}`}
          x={point.x - 5}
          y={point.y - 5}
          width="10"
          height="10"
          rx="2.5"
          fill="var(--color-surface-raised)"
          stroke="var(--color-border)"
          strokeWidth="1"
        />
      ))}

      <circle cx={CENTER} cy={CENTER} r="14" fill="var(--color-ink-900)" />
      <rect x={CENTER - 5} y={CENTER - 5} width="10" height="10" rx="2" fill="var(--color-signal-400)" />
    </svg>
  );
}
