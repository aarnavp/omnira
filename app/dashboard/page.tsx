"use client";

import Link from "next/link";
import { useSession } from "@/hooks/use-session";
import { useDevices } from "@/hooks/use-devices";
import { useDeployments } from "@/hooks/use-deployments";
import { useEarningsSummary } from "@/hooks/use-earnings";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Stat } from "@/components/ui/stat";
import { CountUp } from "@/components/ui/count-up";
import { Badge } from "@/components/ui/badge";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { ErrorState, EmptyState } from "@/components/ui/state-views";
import { Button } from "@/components/ui/button";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";
import { fadeUpItem } from "@/lib/motion";
import { formatRelativeTime, formatUsd } from "@/lib/utils/format";
import { deviceStatusTone, deploymentStatusTone } from "@/lib/utils/status";

export default function DashboardOverviewPage() {
  const session = useSession();
  const userId = session.data?.user.id ?? "user_1";
  const devices = useDevices(userId, 1);
  const deployments = useDeployments(userId, 1);
  const earnings = useEarningsSummary(userId);

  return (
    <div>
      <PageHeader
        title={session.data ? `Welcome back, ${session.data.user.name.split(" ")[0]}` : "Overview"}
        description="Everything happening across your devices and deployments."
      />

      <RevealGroup className="grid grid-cols-1 gap-6 lg:grid-cols-3" stagger={0.08}>
        <RevealItem variants={fadeUpItem} className="lg:col-span-2">
          <Card hoverLift className="h-full">
            <CardHeader eyebrow="Contribute" title="Earnings" />
            <CardBody>
              {earnings.error ? (
                <ErrorState message={earnings.error.message} onRetry={earnings.refetch} />
              ) : earnings.isLoading || !earnings.data ? (
                <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-14 w-full" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
                  <Stat
                    label="Last 30 days"
                    value={<CountUp value={earnings.data.last30DaysUsd} format={(v) => formatUsd(v)} />}
                    tone="positive"
                  />
                  <Stat
                    label="Lifetime earned"
                    value={<CountUp value={earnings.data.totalEarnedUsd} format={(v) => formatUsd(v)} />}
                  />
                  <Stat
                    label="Pending payout"
                    value={<CountUp value={earnings.data.pendingPayoutUsd} format={(v) => formatUsd(v)} />}
                  />
                </div>
              )}
              <div className="mt-6">
                <Link href="/dashboard/earnings" className="text-sm font-medium text-(--color-accent) hover:underline">
                  View earnings breakdown →
                </Link>
              </div>
            </CardBody>
          </Card>
        </RevealItem>

        <RevealItem variants={fadeUpItem}>
          <Card hoverLift className="h-full">
            <CardHeader eyebrow="Network" title="Your footprint" />
            <CardBody className="flex flex-col gap-4">
              <Stat
                label="Devices connected"
                value={devices.isLoading ? "—" : <CountUp value={devices.data?.totalItems ?? 0} format={(v) => String(Math.round(v))} />}
              />
              <Stat
                label="Deployments live"
                value={deployments.isLoading ? "—" : <CountUp value={deployments.data?.totalItems ?? 0} format={(v) => String(Math.round(v))} />}
              />
            </CardBody>
          </Card>
        </RevealItem>
      </RevealGroup>

      <RevealGroup className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2" stagger={0.08} delayChildren={0.1}>
        <RevealItem variants={fadeUpItem}>
          <Card hoverLift className="h-full">
            <CardHeader
              eyebrow="Contribute"
              title="Recent devices"
              action={
                <Link href="/dashboard/devices" className="text-sm font-medium text-(--color-accent) hover:underline">
                  View all
                </Link>
              }
            />
            <CardBody>
              {devices.error ? (
                <ErrorState message={devices.error.message} onRetry={devices.refetch} />
              ) : devices.isLoading || !devices.data ? (
                <SkeletonText lines={4} />
              ) : devices.data.items.length === 0 ? (
                <EmptyState
                  title="No devices yet"
                  message="Connect a laptop, desktop, server, or phone to start earning from idle capacity."
                  action={<Button href="/dashboard/devices" size="sm">Connect a device</Button>}
                />
              ) : (
                <ul className="flex flex-col divide-y divide-(--color-border)">
                  {devices.data.items.slice(0, 5).map((device) => (
                    <li
                      key={device.id}
                      className="-mx-2 flex items-center justify-between gap-4 rounded-(--radius-md) px-2 py-3 transition-colors hover:bg-(--color-surface-sunken)"
                    >
                      <div className="min-w-0">
                        <Link
                          href={`/dashboard/devices/${device.id}`}
                          className="truncate text-sm font-medium text-(--color-text) hover:underline"
                        >
                          {device.name}
                        </Link>
                        <p className="text-xs text-(--color-text-muted)">
                          Last seen {formatRelativeTime(device.lastSeenAt)}
                        </p>
                      </div>
                      <Badge tone={deviceStatusTone(device.status)}>{device.status}</Badge>
                    </li>
                  ))}
                </ul>
              )}
            </CardBody>
          </Card>
        </RevealItem>

        <RevealItem variants={fadeUpItem}>
          <Card hoverLift className="h-full">
            <CardHeader
              eyebrow="Deploy"
              title="Recent deployments"
              action={
                <Link href="/dashboard/deployments" className="text-sm font-medium text-(--color-accent) hover:underline">
                  View all
                </Link>
              }
            />
            <CardBody>
              {deployments.error ? (
                <ErrorState message={deployments.error.message} onRetry={deployments.refetch} />
              ) : deployments.isLoading || !deployments.data ? (
                <SkeletonText lines={4} />
              ) : deployments.data.items.length === 0 ? (
                <EmptyState
                  title="Nothing deployed yet"
                  message="Ship a website, API, or model onto the network to see it here."
                  action={<Button href="/dashboard/deployments/new" size="sm">New deployment</Button>}
                />
              ) : (
                <ul className="flex flex-col divide-y divide-(--color-border)">
                  {deployments.data.items.slice(0, 5).map((deployment) => (
                    <li
                      key={deployment.id}
                      className="-mx-2 flex items-center justify-between gap-4 rounded-(--radius-md) px-2 py-3 transition-colors hover:bg-(--color-surface-sunken)"
                    >
                      <div className="min-w-0">
                        <Link
                          href={`/dashboard/deployments/${deployment.id}`}
                          className="truncate text-sm font-medium text-(--color-text) hover:underline"
                        >
                          {deployment.name}
                        </Link>
                        <p className="text-xs text-(--color-text-muted)">{deployment.primaryDomain}</p>
                      </div>
                      <Badge tone={deploymentStatusTone(deployment.status)}>{deployment.status}</Badge>
                    </li>
                  ))}
                </ul>
              )}
            </CardBody>
          </Card>
        </RevealItem>
      </RevealGroup>
    </div>
  );
}
