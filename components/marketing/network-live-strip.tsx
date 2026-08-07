"use client";

import { motion } from "framer-motion";
import { useNetworkSnapshot } from "@/hooks/use-network";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Stat } from "@/components/ui/stat";
import { CountUp } from "@/components/ui/count-up";
import { Sparkline } from "@/components/ui/sparkline";
import { MagnitudeBars } from "@/components/ui/magnitude-bars";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/state-views";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";
import { formatCompactNumber, formatDateTime, formatNumber, formatUsd } from "@/lib/utils/format";
import type { NetworkStatsWindow } from "@/types/network";

const WINDOWS: { value: NetworkStatsWindow; label: string }[] = [
  { value: "10m", label: "10m" },
  { value: "30m", label: "30m" },
  { value: "1h", label: "1h" },
  { value: "1w", label: "1w" },
  { value: "30d", label: "30d" },
  { value: "all", label: "All" },
];

export function NetworkLiveStrip({ variant = "full" }: { variant?: "full" | "compact" }) {
  const { data, error, isLoading, refetch, window, setWindow } = useNetworkSnapshot("all");

  return (
    <Card>
      <CardHeader
        eyebrow="Live · the Omnira network"
        title="Real devices, serving real traffic."
        description="Phones, computers, and servers contributing right now, plus everything the network has earned so far."
        action={
          <Badge tone="positive" dot pulse>
            {data ? `${data.totals.devicesOnlineNow} online now` : "—"}
          </Badge>
        }
      />
      <CardBody>
        <div className="mb-4 rounded-(--radius-md) border border-(--color-amber-500)/30 bg-(--color-amber-100) px-4 py-3 text-xs text-(--color-ink-800)">
          Limited pilot — the figures below are <strong>indicative projections</strong> of what
          devices could earn if paid services launch, not actual payouts. No cash is paid during
          the pilot.
        </div>

        {error ? (
          <ErrorState
            message="We couldn't reach network stats. This is a display issue only — the network is still running."
            onRetry={refetch}
          />
        ) : (
          <>
            <div className="grid grid-cols-2 gap-6 border-b border-(--color-border) pb-6 sm:grid-cols-4">
              {isLoading || !data ? (
                Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)
              ) : (
                <>
                  <Stat
                    label="Network earned (indicative)"
                    value={
                      <CountUp
                        value={data.totals.networkEarnedIndicativeUsd}
                        format={(v) => formatUsd(v, { precise: true })}
                      />
                    }
                    tone="positive"
                  />
                  <Stat
                    label="Requests served"
                    value={<CountUp value={data.totals.requestsServedAllTime} format={formatNumber} />}
                  />
                  <Stat
                    label="Devices, all-time"
                    value={<CountUp value={data.totals.devicesAllTime} format={formatNumber} />}
                  />
                  <Stat
                    label="Services live"
                    value={<CountUp value={data.totals.servicesLive} format={formatNumber} />}
                  />
                </>
              )}
            </div>

            <div className="flex items-center gap-1.5 py-4">
              <span className="mr-2 font-mono text-xs uppercase tracking-wider text-(--color-text-faint)">
                Window
              </span>
              {WINDOWS.map((w) => (
                <button
                  key={w.value}
                  onClick={() => setWindow(w.value)}
                  className={cn(
                    "relative rounded-(--radius-full) px-3 py-1 font-mono text-xs transition-colors",
                    window === w.value
                      ? "text-(--color-paper-white)"
                      : "text-(--color-text-muted) hover:text-(--color-text)",
                  )}
                >
                  {window === w.value ? (
                    <motion.span
                      layoutId="network-window-pill"
                      className="absolute inset-0 rounded-(--radius-full) bg-(--color-ink-900)"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  ) : null}
                  <span className="relative">{w.label}</span>
                </button>
              ))}
            </div>

            {variant === "full" ? (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div>
                  <p className="mb-2 font-mono text-xs uppercase tracking-wider text-(--color-text-faint)">
                    Money earned · recent
                  </p>
                  {isLoading || !data ? (
                    <Skeleton className="h-40 w-full" />
                  ) : (
                    <Sparkline
                      data={data.timeseries.map((p) => ({ x: p.timestamp, y: p.earningsUsd }))}
                      formatValue={(v) => formatUsd(v, { precise: true })}
                      formatX={formatDateTime}
                    />
                  )}
                </div>
                <div>
                  <p className="mb-2 font-mono text-xs uppercase tracking-wider text-(--color-text-faint)">
                    Requests served · recent
                  </p>
                  {isLoading || !data ? (
                    <Skeleton className="h-40 w-full" />
                  ) : (
                    <Sparkline
                      data={data.timeseries.map((p) => ({ x: p.timestamp, y: p.requestsServed }))}
                      formatValue={(v) => formatCompactNumber(v)}
                      formatX={formatDateTime}
                    />
                  )}
                </div>
              </div>
            ) : null}

            {variant === "full" ? (
              <div className="mt-8 border-t border-(--color-border) pt-6">
                <p className="font-mono text-xs uppercase tracking-wider text-(--color-text-faint)">
                  Earnings by device type · last 365 days
                </p>
                <p className="mt-1 text-sm text-(--color-text-muted)">
                  Every kind of device earns — no data center required.
                </p>
                <div className="mt-5">
                  {isLoading || !data ? (
                    <div className="flex flex-col gap-4">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-10 w-full" />
                      ))}
                    </div>
                  ) : (
                    <MagnitudeBars
                      items={[...data.byDeviceKind]
                        .sort((a, b) => b.earnedUsd - a.earnedUsd)
                        .map((item) => ({
                          key: item.kind,
                          label: item.label,
                          value: item.earnedUsd,
                          valueLabel: `${formatUsd(item.earnedUsd, { precise: true })} earned · ${formatNumber(item.requestsServed)} requests`,
                          detail:
                            item.devicesServingNow > 0
                              ? `${item.devicesServingNow} serving now · ${item.devicesAllTime} all-time`
                              : `${item.devicesAllTime} all-time · none online now`,
                        }))}
                    />
                  )}
                </div>
              </div>
            ) : null}
          </>
        )}
      </CardBody>
    </Card>
  );
}
