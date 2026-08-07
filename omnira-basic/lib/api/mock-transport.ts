import { ApiError, type ApiErrorShape } from "@/types/api";

/**
 * Stand-in for network transport. Every service function in `lib/api` calls
 * `simulateRequest` instead of `fetch` today. Swapping in a real backend
 * means replacing the body of that one function — callers and their return
 * types never change.
 */

interface SimulateOptions {
  /** Roughly how long a real call like this would take. */
  latencyMs?: [number, number];
  /** 0–1 chance the call rejects with `failure` instead of resolving. */
  failureRate?: number;
  failure?: ApiErrorShape;
}

const DEFAULT_LATENCY: [number, number] = [280, 640];

function randomBetween([min, max]: [number, number]): number {
  return min + Math.random() * (max - min);
}

export async function simulateRequest<T>(result: T, options: SimulateOptions = {}): Promise<T> {
  const latency = options.latencyMs ?? DEFAULT_LATENCY;
  await new Promise((resolve) => setTimeout(resolve, randomBetween(latency)));

  if (options.failureRate && Math.random() < options.failureRate) {
    throw new ApiError(
      options.failure ?? {
        code: "server_error",
        message: "Something went wrong on our end. Try again in a moment.",
      },
    );
  }

  return result;
}
