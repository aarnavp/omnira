"use client";

import { useReducedMotion } from "framer-motion";
import { mulberry32, seededInt, seededPick } from "@/lib/utils/random";
import { Icon, type IconName } from "@/components/ui/icon";
import { cn } from "@/lib/utils/cn";

const KINDS: IconName[] = ["laptop", "desktop", "phone", "server"];
const COLUMNS = 6;
const ROWS = 5;

interface Tile {
  kind: IconName;
  earning: boolean;
  delay: number;
  amount: string;
}

function buildTiles(): Tile[] {
  const rng = mulberry32(9182731);
  return Array.from({ length: COLUMNS * ROWS }, () => ({
    kind: seededPick(rng, KINDS),
    earning: rng() > 0.72,
    delay: rng() * 4,
    amount: `+$0.00${seededInt(rng, 2, 9)}`,
  }));
}

const TILES = buildTiles();

/**
 * Contribute's signature: a field of ordinary devices, a few of them
 * visibly earning right now. Where the home hero shows the network as
 * infrastructure, this shows it as *your* hardware — personal, legible,
 * small numbers ticking up instead of one large abstract object.
 */
export function DeviceEarningGrid({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <div className={cn("grid grid-cols-6 gap-2.5", className)} aria-hidden="true">
      {TILES.map((tile, i) => (
        <div
          key={i}
          className={cn(
            "relative flex aspect-square items-center justify-center rounded-(--radius-md) transition-colors duration-700",
            tile.earning ? "bg-(--color-signal-500)/10 text-(--color-brand)" : "bg-(--color-surface-sunken) text-(--color-text-faint)",
          )}
        >
          <Icon name={tile.kind} size={16} />
          {tile.earning && !reduceMotion ? (
            <span
              aria-hidden
              className="absolute -top-1 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[9px] font-medium text-(--color-brand) opacity-0"
              style={{
                animation: `earn-float 3.6s ease-in-out ${tile.delay}s infinite`,
              }}
            >
              {tile.amount}
            </span>
          ) : null}
        </div>
      ))}
    </div>
  );
}
