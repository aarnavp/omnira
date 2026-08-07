import { simulateRequest } from "./mock-transport";
import { mulberry32 } from "@/lib/utils/random";
import type {
  NetworkEarningsByKind,
  NetworkSnapshot,
  NetworkStatsWindow,
  NetworkTimeseriesPoint,
} from "@/types/network";

const WINDOW_POINTS: Record<NetworkStatsWindow, number> = {
  "10m": 10,
  "30m": 30,
  "1h": 60,
  "1w": 7,
  "30d": 30,
  all: 42,
};

const WINDOW_STEP_MS: Record<NetworkStatsWindow, number> = {
  "10m": 60 * 1000,
  "30m": 60 * 1000,
  "1h": 60 * 1000,
  "1w": 24 * 60 * 60 * 1000,
  "30d": 24 * 60 * 60 * 1000,
  all: 24 * 60 * 60 * 1000,
};

function hashSeed(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return hash || 42;
}

function buildTimeseries(window: NetworkStatsWindow): NetworkTimeseriesPoint[] {
  const rng = mulberry32(hashSeed(`timeseries-${window}`));
  const points = WINDOW_POINTS[window];
  const stepMs = WINDOW_STEP_MS[window];
  const now = Date.now();
  const series: NetworkTimeseriesPoint[] = [];
  let earnings = 4.5;
  let requests = 1200;
  for (let i = points; i >= 0; i -= 1) {
    const growth = 1 + (points - i) / points;
    earnings += rng() * 12 * growth;
    requests += rng() * 90000 * growth;
    series.push({
      timestamp: new Date(now - i * stepMs).toISOString(),
      earningsUsd: Number(earnings.toFixed(4)),
      requestsServed: Math.round(requests),
    });
  }
  return series;
}

const DEVICE_KIND_META: { kind: NetworkEarningsByKind["kind"]; label: string; share: number }[] = [
  { kind: "desktop", label: "Computers", share: 0.42 },
  { kind: "phone", label: "Phones", share: 0.28 },
  { kind: "laptop", label: "Laptops", share: 0.16 },
  { kind: "server", label: "Servers", share: 0.1 },
  { kind: "cloud", label: "Cloud fallback", share: 0.04 },
];

function buildTotalsAndBreakdown(window: NetworkStatsWindow): {
  totals: NetworkSnapshot["totals"];
  byDeviceKind: NetworkEarningsByKind[];
} {
  const rng = mulberry32(hashSeed(`totals-${window}`));
  const networkEarnedIndicativeUsd = 1489.11 + rng() * 40;
  const requestsServedAllTime = 23_900_000 + Math.round(rng() * 40000);

  const byDeviceKind = DEVICE_KIND_META.map(({ kind, label, share }) => ({
    kind,
    label,
    earnedUsd: Number((networkEarnedIndicativeUsd * share).toFixed(4)),
    requestsServed: Math.round(requestsServedAllTime * share),
    devicesServingNow: kind === "cloud" ? 0 : Math.round(rng() * 8),
    devicesAllTime: kind === "cloud" ? Math.round(rng() * 3) : Math.round(4 + rng() * 40),
  }));

  return {
    totals: {
      devicesOnlineNow: byDeviceKind.reduce((sum, item) => sum + item.devicesServingNow, 0),
      devicesAllTime: byDeviceKind.reduce((sum, item) => sum + item.devicesAllTime, 0),
      servicesLive: 170 + Math.round(rng() * 12),
      networkEarnedIndicativeUsd,
      requestsServedAllTime,
    },
    byDeviceKind,
  };
}

export async function getNetworkSnapshot(
  window: NetworkStatsWindow = "all",
): Promise<NetworkSnapshot> {
  const { totals, byDeviceKind } = buildTotalsAndBreakdown(window);
  return simulateRequest(
    {
      window,
      totals,
      timeseries: buildTimeseries(window),
      byDeviceKind,
      generatedAt: new Date().toISOString(),
    },
    {
      latencyMs: [220, 480],
      failureRate: 0.05,
      failure: { code: "server_error", message: "Network stats are temporarily unavailable." },
    },
  );
}
