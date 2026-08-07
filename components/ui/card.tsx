import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export function Card({
  className,
  hoverLift = false,
  ...props
}: HTMLAttributes<HTMLDivElement> & { hoverLift?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-(--radius-lg) border border-(--color-border) bg-(--color-surface-raised)",
        hoverLift &&
          "transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_20px_40px_-24px_rgba(0,0,0,0.25)]",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({
  eyebrow,
  title,
  description,
  action,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-start justify-between gap-4 p-6 pb-4", className)}>
      <div className="min-w-0">
        {eyebrow ? (
          <p className="font-mono text-xs uppercase tracking-wider text-(--color-text-faint)">
            {eyebrow}
          </p>
        ) : null}
        <h3 className="mt-1 font-(family-name:--font-display) text-lg font-semibold text-(--color-text)">
          {title}
        </h3>
        {description ? (
          <p className="mt-1 text-sm text-(--color-text-muted)">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function CardBody({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-6 pb-6", className)} {...props} />;
}
