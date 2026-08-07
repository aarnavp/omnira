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
        "rounded-(--radius-lg) bg-(--color-surface-raised) shadow-(--shadow-hairline)",
        hoverLift &&
          "transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-(--shadow-hairline-raised)",
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
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-start justify-between gap-4 p-5 pb-3", className)}>
      <div className="min-w-0">
        {eyebrow ? (
          <p className="font-mono text-[11px] uppercase tracking-wider text-(--color-text-faint)">
            {eyebrow}
          </p>
        ) : null}
        <h3 className="mt-0.5 font-(family-name:--font-display) text-base font-semibold text-(--color-text)">
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
  return <div className={cn("px-5 pb-5", className)} {...props} />;
}
