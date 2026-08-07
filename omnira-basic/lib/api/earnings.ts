import { simulateRequest } from "./mock-transport";
import { mulberry32, seededInt, seededPick } from "@/lib/utils/random";
import type { Paginated } from "@/types/api";
import type {
  EarningsByDeviceKind,
  EarningsSummary,
  EarningsTimeseriesPoint,
  PayoutRecord,
  PayoutStatus,
} from "@/types/earnings";
import type { DeviceKind } from "@/types/device";

export async function getEarningsSummary(userId: string): Promise<EarningsSummary> {
  const rng = mulberry32(hash(`summary-${userId}`));
  return simulateRequest({
    totalEarnedUsd: Number((seededInt(rng, 80000, 240000) / 100).toFixed(2)),
    last30DaysUsd: Number((seededInt(rng, 1200, 8000) / 100).toFixed(2)),
    pendingPayoutUsd: Number((seededInt(rng, 200, 4000) / 100).toFixed(2)),
    nextPayoutDate: new Date(Date.now() + 6 * 24 * 3600 * 1000).toISOString(),
    lifetimeRequestsServed: seededInt(rng, 400000, 2200000),
  });
}

const KINDS: DeviceKind[] = ["desktop", "laptop", "phone", "server"];

export async function getEarningsByDeviceKind(userId: string): Promise<EarningsByDeviceKind[]> {
  const rng = mulberry32(hash(`bykind-${userId}`));
  return simulateRequest(
    KINDS.map((kind) => ({
      kind,
      earnedUsd: Number((seededInt(rng, 500, 60000) / 100).toFixed(2)),
      requestsServed: seededInt(rng, 2000, 400000),
      deviceCount: seededInt(rng, 1, 3),
    })),
  );
}

export async function getEarningsTimeseries(userId: string): Promise<EarningsTimeseriesPoint[]> {
  const rng = mulberry32(hash(`series-${userId}`));
  const now = Date.now();
  let cumulative = 0;
  return simulateRequest(
    Array.from({ length: 30 }, (_, i) => {
      cumulative += rng() * 18;
      return {
        timestamp: new Date(now - (29 - i) * 24 * 3600 * 1000).toISOString(),
        earningsUsd: Number(cumulative.toFixed(2)),
      };
    }),
  );
}

const PAYOUT_STATUSES: PayoutStatus[] = ["paid", "paid", "paid", "pending", "failed"];
const PAYOUT_METHODS = ["Bank transfer", "PayPal", "USDC wallet"];

export async function listPayouts(
  userId: string,
  params: { page?: number; pageSize?: number } = {},
): Promise<Paginated<PayoutRecord>> {
  const rng = mulberry32(hash(`payouts-${userId}`));
  const all: PayoutRecord[] = Array.from({ length: 16 }, (_, i) => {
    const status = seededPick(rng, PAYOUT_STATUSES);
    const initiatedAt = new Date(Date.now() - i * 14 * 24 * 3600 * 1000).toISOString();
    return {
      id: `pay_${userId}_${i}`,
      amountUsd: Number((seededInt(rng, 400, 6000) / 100).toFixed(2)),
      status,
      initiatedAt,
      settledAt:
        status === "paid"
          ? new Date(new Date(initiatedAt).getTime() + 2 * 24 * 3600 * 1000).toISOString()
          : null,
      method: seededPick(rng, PAYOUT_METHODS),
    };
  });

  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 8;
  const start = (page - 1) * pageSize;
  return simulateRequest(
    {
      items: all.slice(start, start + pageSize),
      page,
      pageSize,
      totalItems: all.length,
      totalPages: Math.max(1, Math.ceil(all.length / pageSize)),
    },
    { failureRate: 0.08, failure: { code: "server_error", message: "Couldn't load payout history. Try again in a moment." } },
  );
}

function hash(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i += 1) h = (h << 5) - h + input.charCodeAt(i);
  return h || 3;
}
