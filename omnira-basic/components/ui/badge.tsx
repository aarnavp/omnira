import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type Tone = "neutral" | "positive" | "warning" | "danger" | "accent" | "on-dark";

const tones: Record<Tone, string> = {
  neutral: "bg-(--color-surface-sunken) text-(--color-text-muted)",
  positive: "bg-[color-mix(in_srgb,var(--color-signal-500)_16%,transparent)] text-(--color-positive-text)",
  warning: "bg-(--color-amber-100) text-(--color-warning-text)",
  danger: "bg-(--color-red-100) text-(--color-danger)",
  accent: "bg-(--color-ink-900) text-(--color-paper-white)",
  "on-dark": "bg-(--color-ink-800) text-(--color-signal-400)",
};

export function Badge({
  tone = "neutral",
  dot = false,
  pulse = false,
  children,
  className,
}: {
  tone?: Tone;
  dot?: boolean;
  /** Adds a radar-ping animation to the dot — reserve for genuinely live/real-time state. */
  pulse?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-(--radius-full) px-2.5 py-1 font-mono text-xs uppercase tracking-wide",
        tones[tone],
        className,
      )}
    >
      {dot ? (
        <span className="relative flex h-1.5 w-1.5" aria-hidden>
          {pulse ? (
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-60 motion-reduce:hidden" />
          ) : null}
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-current" />
        </span>
      ) : null}
      {children}
    </span>
  );
}
