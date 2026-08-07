"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ApiError } from "@/types/api";

export interface AsyncState<T> {
  data: T | null;
  error: ApiError | null;
  isLoading: boolean;
  refetch: () => void;
}

/**
 * Runs an async `lib/api` call and exposes loading/error/data state, the
 * three states every async surface in this product must render.
 */
export function useAsyncData<T>(fetcher: () => Promise<T>, deps: unknown[]): AsyncState<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tick, setTick] = useState(0);

  // Keep the latest fetcher available to the effect below without adding it
  // to the dependency array (callers pass a fresh closure every render).
  const fetcherRef = useRef(fetcher);
  useEffect(() => {
    fetcherRef.current = fetcher;
  });

  useEffect(() => {
    let cancelled = false;
    // Resetting loading/error at the start of a fetch is the standard data-
    // fetching effect shape; there's no external system to defer this to.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);
    setError(null);
    fetcherRef
      .current()
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(
          err instanceof ApiError
            ? err
            : new ApiError({
                code: "network_error",
                message: "Couldn't reach the network. Check your connection and try again.",
              }),
        );
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick]);

  const refetch = useCallback(() => setTick((t) => t + 1), []);

  return { data, error, isLoading, refetch };
}
