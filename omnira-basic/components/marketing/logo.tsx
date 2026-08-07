import { cn } from "@/lib/utils/cn";

export function Logo({ className, dark = false }: { className?: string; dark?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2 font-(family-name:--font-display) font-semibold", className)}>
      <span
        className="h-2.5 w-2.5 rounded-full bg-(--color-signal-500)"
        style={{ boxShadow: "0 0 0 4px color-mix(in srgb, var(--color-signal-500) 18%, transparent)" }}
        aria-hidden
      />
      <span className={dark ? "text-(--color-canvas-text)" : "text-(--color-ink-900)"}>
        Omnira
      </span>
      <sup className={cn("text-[0.5em] font-normal", dark ? "text-(--color-canvas-text-muted)" : "text-(--color-text-faint)")}>
        TM
      </sup>
    </span>
  );
}
