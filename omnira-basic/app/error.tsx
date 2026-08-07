"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // In production this would report to an error-tracking service.
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-full flex-col items-center justify-center px-4 py-24 text-center">
      <p className="font-mono text-sm text-(--color-text-faint)">Error</p>
      <h1 className="mt-3 font-(family-name:--font-display) text-3xl font-semibold text-(--color-text)">
        Something broke on our end.
      </h1>
      <p className="mt-2 max-w-md text-(--color-text-muted)">
        The page hit an unexpected error. Try again, or head back to the dashboard.
      </p>
      <div className="mt-8 flex gap-3">
        <Button onClick={reset}>Try again</Button>
        <Button href="/" variant="secondary">
          Back to home
        </Button>
      </div>
    </div>
  );
}
