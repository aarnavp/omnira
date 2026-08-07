import { cn } from "@/lib/utils/cn";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-(--animate-shimmer) rounded-(--radius-sm) bg-(--color-surface-sunken) bg-[length:200%_100%]",
        className,
      )}
      style={{
        backgroundImage:
          "linear-gradient(90deg, var(--color-surface-sunken) 25%, var(--color-paper-200) 50%, var(--color-surface-sunken) 75%)",
      }}
      aria-hidden
    />
  );
}

export function SkeletonText({ lines = 1, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-2", className)} aria-hidden>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={cn("h-3", i === lines - 1 && lines > 1 ? "w-2/3" : "w-full")} />
      ))}
    </div>
  );
}
