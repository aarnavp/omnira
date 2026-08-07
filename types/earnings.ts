import type { DeviceKind } from "./device";
import type { Timestamp } from "./api";

export type PayoutStatus = "pending" | "paid" | "failed";

export interface EarningsSummary {
  totalEarnedUsd: number;
  last30DaysUsd: number;
  pendingPayoutUsd: number;
  nextPayoutDate: Timestamp;
  lifetimeRequestsServed: number;
}

export interface EarningsByDeviceKind {
  kind: DeviceKind;
  earnedUsd: number;
  requestsServed: number;
  deviceCount: number;
}

export interface EarningsTimeseriesPoint {
  timestamp: Timestamp;
  earningsUsd: number;
}

export interface PayoutRecord {
  id: string;
  amountUsd: number;
  status: PayoutStatus;
  initiatedAt: Timestamp;
  settledAt: Timestamp | null;
  method: string;
}
