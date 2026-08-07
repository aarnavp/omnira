import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

/** A labeled mono-numeral stat — the recurring "big number, small label" unit
 * used across the network page, dashboard, and marketing strips. */
export function Stat({
  label,
  value,
  trend,
  tone = "default",
  className,
}: {
  label: ReactNode;
  value: ReactNode;
  trend?: ReactNode;
  tone?: "default" | "positive" | "on-dark";
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <p
        className={cn(
          "font-mono text-xs uppercase tracking-wider",
          tone === "on-dark" ? "text-(--color-canvas-text-muted)" : "text-(--color-text-faint)",
        )}
      >
        {label}
      </p>
      <p
        className={cn(
          "font-mono text-2xl font-medium sm:text-3xl",
          tone === "positive"
            ? "text-(--color-positive-text)"
            : tone === "on-dark"
              ? "text-(--color-canvas-text)"
              : "text-(--color-text)",
        )}
      >
        {value}
      </p>
      {trend ? (
        <p className="font-mono text-xs text-(--color-text-muted)">{trend}</p>
      ) : null}
    </div>
  );
}
