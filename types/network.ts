import type { DeviceKind } from "./device";
import type { Timestamp } from "./api";

export type NetworkStatsWindow = "10m" | "30m" | "1h" | "1w" | "30d" | "all";

export interface NetworkTotals {
  devicesOnlineNow: number;
  devicesAllTime: number;
  servicesLive: number;
  networkEarnedIndicativeUsd: number;
  requestsServedAllTime: number;
}

export interface NetworkTimeseriesPoint {
  timestamp: Timestamp;
  earningsUsd: number;
  requestsServed: number;
}

export interface NetworkEarningsByKind {
  kind: DeviceKind | "cloud";
  label: string;
  earnedUsd: number;
  requestsServed: number;
  devicesServingNow: number;
  devicesAllTime: number;
}

export interface NetworkSnapshot {
  window: NetworkStatsWindow;
  totals: NetworkTotals;
  timeseries: NetworkTimeseriesPoint[];
  byDeviceKind: NetworkEarningsByKind[];
  generatedAt: Timestamp;
}
