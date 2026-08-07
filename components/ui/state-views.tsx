import type { ReactNode } from "react";
import { Button } from "./button";

/**
 * Shared shapes for the error and empty states every async surface needs.
 * Errors say what broke and the next move; empty states invite action.
 */

export function ErrorState({
  title = "Couldn't load this",
  message,
  onRetry,
}: {
  title?: string;
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-start gap-3 rounded-(--radius-lg) border border-(--color-border) bg-(--color-surface-raised) p-8">
      <p className="font-(family-name:--font-display) text-base font-semibold text-(--color-text)">
        {title}
      </p>
      <p className="text-sm text-(--color-text-muted)">{message}</p>
      {onRetry ? (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </div>
  );
}

export function EmptyState({
  title,
  message,
  action,
  icon,
}: {
  title: string;
  message: string;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-start gap-3 rounded-(--radius-lg) border border-dashed border-(--color-border) bg-(--color-surface) p-8">
      {icon ? <div className="text-(--color-text-faint)">{icon}</div> : null}
      <p className="font-(family-name:--font-display) text-base font-semibold text-(--color-text)">
        {title}
      </p>
      <p className="max-w-md text-sm text-(--color-text-muted)">{message}</p>
      {action ? <div className="mt-1">{action}</div> : null}
    </div>
  );
}
