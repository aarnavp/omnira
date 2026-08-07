import { cn } from "@/lib/utils/cn";

export interface MagnitudeBarItem {
  key: string;
  label: string;
  value: number;
  valueLabel: string;
  detail: string;
}

// Sequential ramp, darkest → lightest, reused from the token system. Rank
// carries the color; the label and numbers carry identity, so this reads
// fine for readers who can't distinguish the hues at all.
const RAMP = [
  "var(--color-forest-500)",
  "var(--color-signal-600)",
  "var(--color-signal-400)",
  "var(--color-lime-400)",
  "var(--color-lime-300)",
];

/** Horizontal magnitude bars ranked by value, one hue ramp, direct labels. */
export function MagnitudeBars({ items, className }: { items: MagnitudeBarItem[]; className?: string }) {
  const max = Math.max(...items.map((i) => i.value), 1);

  return (
    <ul className={cn("flex flex-col gap-5", className)}>
      {items.map((item, index) => (
        <li key={item.key}>
          <div className="flex items-baseline justify-between gap-4">
            <span className="text-sm font-medium text-(--color-text)">{item.label}</span>
            <span className="shrink-0 font-mono text-xs text-(--color-text-faint)">{item.detail}</span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-(--radius-full) bg-(--color-surface-sunken)">
            <div
              className="h-full rounded-(--radius-full)"
              style={{
                width: `${Math.max((item.value / max) * 100, 2)}%`,
                backgroundColor: RAMP[Math.min(index, RAMP.length - 1)],
              }}
            />
          </div>
          <p className="mt-1.5 font-mono text-xs text-(--color-text-muted)">{item.valueLabel}</p>
        </li>
      ))}
    </ul>
  );
}
