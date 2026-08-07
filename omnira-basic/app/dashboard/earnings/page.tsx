"use client";

import { useState } from "react";
import { useSession } from "@/hooks/use-session";
import {
  useEarningsByDeviceKind,
  useEarningsSummary,
  useEarningsTimeseries,
  usePayouts,
} from "@/hooks/use-earnings";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Stat } from "@/components/ui/stat";
import { Sparkline } from "@/components/ui/sparkline";
import { MagnitudeBars } from "@/components/ui/magnitude-bars";
import { Table, Thead, Th, Tbody, Td } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/ui/pagination";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { ErrorState, EmptyState } from "@/components/ui/state-views";
import { Reveal } from "@/components/ui/reveal";
import { formatDate, formatDateTime, formatNumber, formatUsd } from "@/lib/utils/format";
import type { PayoutStatus } from "@/types/earnings";

const KIND_LABEL: Record<string, string> = {
  desktop: "Computers",
  laptop: "Laptops",
  phone: "Phones",
  server: "Servers",
};

const PAYOUT_TONE: Record<PayoutStatus, "positive" | "neutral" | "danger"> = {
  paid: "positive",
  pending: "neutral",
  failed: "danger",
};

export default function EarningsPage() {
  const session = useSession();
  const userId = session.data?.user.id ?? "user_1";
  const summary = useEarningsSummary(userId);
  const byKind = useEarningsByDeviceKind(userId);
  const timeseries = useEarningsTimeseries(userId);
  const [page, setPage] = useState(1);
  const payouts = usePayouts(userId, page);

  return (
    <Reveal>
      <PageHeader title="Earnings" description="What your devices have made, and when it's paid out." />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {summary.error ? (
          <div className="col-span-full">
            <ErrorState message={summary.error.message} onRetry={summary.refetch} />
          </div>
        ) : summary.isLoading || !summary.data ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)
        ) : (
          <>
            <Stat label="Lifetime earned" value={formatUsd(summary.data.totalEarnedUsd)} tone="positive" />
            <Stat label="Last 30 days" value={formatUsd(summary.data.last30DaysUsd)} />
            <Stat label="Pending payout" value={formatUsd(summary.data.pendingPayoutUsd)} />
            <Stat label="Next payout" value={formatDate(summary.data.nextPayoutDate)} />
          </>
        )}
      </div>

      <Card className="mt-6">
        <CardHeader eyebrow="Last 30 days" title="Earnings over time" />
        <CardBody>
          {timeseries.error ? (
            <ErrorState message={timeseries.error.message} onRetry={timeseries.refetch} />
          ) : timeseries.isLoading || !timeseries.data ? (
            <Skeleton className="h-48 w-full" />
          ) : (
            <Sparkline
              data={timeseries.data.map((p) => ({ x: p.timestamp, y: p.earningsUsd }))}
              formatValue={(v) => formatUsd(v)}
              formatX={formatDateTime}
              height={200}
            />
          )}
        </CardBody>
      </Card>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader eyebrow="By device type" title="What's earning the most" />
          <CardBody>
            {byKind.error ? (
              <ErrorState message={byKind.error.message} onRetry={byKind.refetch} />
            ) : byKind.isLoading || !byKind.data ? (
              <SkeletonText lines={4} />
            ) : (
              <MagnitudeBars
                items={[...byKind.data]
                  .sort((a, b) => b.earnedUsd - a.earnedUsd)
                  .map((item) => ({
                    key: item.kind,
                    label: KIND_LABEL[item.kind] ?? item.kind,
                    value: item.earnedUsd,
                    valueLabel: `${formatUsd(item.earnedUsd)} earned · ${formatNumber(item.requestsServed)} requests`,
                    detail: `${item.deviceCount} device${item.deviceCount === 1 ? "" : "s"}`,
                  }))}
              />
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader eyebrow="Payouts" title="Payout history" />
          <CardBody>
            {payouts.error ? (
              <ErrorState message={payouts.error.message} onRetry={payouts.refetch} />
            ) : payouts.isLoading || !payouts.data ? (
              <SkeletonText lines={5} />
            ) : payouts.data.items.length === 0 ? (
              <EmptyState title="No payouts yet" message="Payouts appear here once your first payout cycle completes." />
            ) : (
              <>
                <Table>
                  <Thead>
                    <Th>Date</Th>
                    <Th>Amount</Th>
                    <Th>Method</Th>
                    <Th>Status</Th>
                  </Thead>
                  <Tbody>
                    {payouts.data.items.map((payout) => (
                      <tr key={payout.id} className="transition-colors hover:bg-(--color-surface-sunken)">
                        <Td>{formatDate(payout.initiatedAt)}</Td>
                        <Td className="font-mono">{formatUsd(payout.amountUsd)}</Td>
                        <Td>{payout.method}</Td>
                        <Td>
                          <Badge tone={PAYOUT_TONE[payout.status]}>{payout.status}</Badge>
                        </Td>
                      </tr>
                    ))}
                  </Tbody>
                </Table>
                <Pagination page={payouts.data.page} totalPages={payouts.data.totalPages} onChange={setPage} />
              </>
            )}
          </CardBody>
        </Card>
      </div>
    </Reveal>
  );
}
