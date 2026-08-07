"use client";

import { useState } from "react";
import Link from "next/link";
import { useDevice, useDeviceActivity, useUpdateDevice } from "@/hooks/use-devices";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Stat } from "@/components/ui/stat";
import { Sparkline } from "@/components/ui/sparkline";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/state-views";
import { Icon } from "@/components/ui/icon";
import { formatDateTime, formatNumber, formatRelativeTime, formatUsd } from "@/lib/utils/format";
import { deviceStatusTone } from "@/lib/utils/status";
import { Reveal } from "@/components/ui/reveal";
import type { DeviceKind } from "@/types/device";

const KIND_ICON: Record<DeviceKind, "laptop" | "desktop" | "server" | "phone"> = {
  laptop: "laptop",
  desktop: "desktop",
  server: "server",
  phone: "phone",
};

const KIND_LABEL: Record<DeviceKind, string> = {
  laptop: "Laptop",
  desktop: "Desktop",
  server: "Server",
  phone: "Phone",
};

export function DeviceDetail({ deviceId }: { deviceId: string }) {
  const { data: device, error, isLoading, refetch } = useDevice(deviceId);
  const activity = useDeviceActivity(deviceId);
  const { save, isSaving } = useUpdateDevice(deviceId);

  const [limit, setLimit] = useState<number | null>(null);
  const [acceptsGeneral, setAcceptsGeneral] = useState<boolean | null>(null);
  const [status, setStatus] = useState<"online" | "paused" | null>(null);

  if (error) {
    return (
      <div>
        <BackLink />
        <ErrorState title="Couldn't load this device" message={error.message} onRetry={refetch} />
      </div>
    );
  }

  if (isLoading || !device) {
    return (
      <div>
        <BackLink />
        <Skeleton className="h-8 w-64" />
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
        <Skeleton className="mt-6 h-56 w-full" />
      </div>
    );
  }

  const effectiveLimit = limit ?? device.contributionLimitPercent;
  const effectiveAccepts = acceptsGeneral ?? device.acceptsGeneralWorkloads;
  const effectiveStatus = status ?? device.status;
  const isOnline = effectiveStatus === "online" || effectiveStatus === "idle";

  async function handleToggleStatus() {
    const next = isOnline ? "paused" : "online";
    setStatus(next);
    await save({ status: next });
  }

  async function handleLimitCommit(next: number) {
    setLimit(next);
    await save({ contributionLimitPercent: next });
  }

  async function handleAcceptsToggle(next: boolean) {
    setAcceptsGeneral(next);
    await save({ acceptsGeneralWorkloads: next });
  }

  return (
    <Reveal>
      <BackLink />

      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-(--radius-md) bg-(--color-surface-sunken) text-(--color-text-muted)">
            <Icon name={KIND_ICON[device.kind]} size={20} />
          </span>
          <div>
            <h1 className="font-(family-name:--font-display) text-2xl font-semibold text-(--color-text)">
              {device.name}
            </h1>
            <p className="text-sm text-(--color-text-muted)">
              {KIND_LABEL[device.kind]} · {device.location}
            </p>
          </div>
        </div>
        <Badge tone={deviceStatusTone(effectiveStatus)}>{effectiveStatus}</Badge>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Utilization now" value={`${device.utilizationPercent}%`} />
        <Stat label="Total earned" value={formatUsd(device.totalEarnedUsd)} tone="positive" />
        <Stat label="Requests served" value={formatNumber(device.totalRequestsServed)} />
        <Stat label="Connected since" value={formatRelativeTime(device.connectedAt)} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader eyebrow="Last 24 hours" title="Utilization & earnings" />
          <CardBody>
            {activity.error ? (
              <ErrorState message={activity.error.message} onRetry={activity.refetch} />
            ) : activity.isLoading || !activity.data ? (
              <Skeleton className="h-40 w-full" />
            ) : (
              <Sparkline
                data={activity.data.map((p) => ({ x: p.timestamp, y: p.earningsUsd }))}
                formatValue={(v) => formatUsd(v, { precise: true })}
                formatX={formatDateTime}
              />
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader eyebrow="Specs" title="Hardware" />
          <CardBody className="flex flex-col gap-3 text-sm">
            <SpecRow label="CPU" value={device.specs.cpuModel} />
            <SpecRow label="Cores" value={String(device.specs.cpuCores)} />
            <SpecRow label="RAM" value={`${device.specs.ramGb} GB`} />
            <SpecRow label="GPU" value={device.specs.gpuModel ?? "None"} />
          </CardBody>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader eyebrow="Controls" title="How much this device contributes" description="Changes apply immediately." />
        <CardBody className="flex flex-col gap-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-(--color-text)">
                {isOnline ? "Contributing to the network" : "Paused"}
              </p>
              <p className="text-xs text-(--color-text-muted)">
                {isOnline
                  ? "This device can pick up work within your limits below."
                  : "This device won't receive any workloads until you resume it."}
              </p>
            </div>
            <Switch
              checked={isOnline}
              disabled={isSaving}
              onChange={handleToggleStatus}
              label={isOnline ? "Pause this device" : "Resume this device"}
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="contribution-limit" className="text-sm font-medium text-(--color-text)">
                Contribution ceiling
              </label>
              <span className="font-mono text-sm text-(--color-text)">{effectiveLimit}%</span>
            </div>
            <input
              id="contribution-limit"
              type="range"
              min={10}
              max={100}
              step={5}
              value={effectiveLimit}
              disabled={isSaving}
              onChange={(e) => setLimit(Number(e.target.value))}
              onMouseUp={(e) => handleLimitCommit(Number(e.currentTarget.value))}
              onTouchEnd={(e) => handleLimitCommit(Number(e.currentTarget.value))}
              className="mt-2 w-full accent-(--color-signal-600)"
            />
            <p className="mt-1.5 text-xs text-(--color-text-muted)">
              Omnira never uses more than this share of CPU, GPU, memory, and bandwidth.
            </p>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-(--color-text)">Accept general workloads</p>
              <p className="text-xs text-(--color-text-muted)">
                Allow this device to run third-party jobs from the Deploy side of the network.
              </p>
            </div>
            <Switch
              checked={effectiveAccepts}
              disabled={isSaving}
              onChange={handleAcceptsToggle}
              label="Accept general workloads"
            />
          </div>
        </CardBody>
      </Card>
    </Reveal>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-(--color-border) pb-3 last:border-0 last:pb-0">
      <span className="text-(--color-text-muted)">{label}</span>
      <span className="font-medium text-(--color-text)">{value}</span>
    </div>
  );
}

function BackLink() {
  return (
    <Link
      href="/dashboard/devices"
      className="mb-6 inline-flex items-center gap-1.5 text-sm text-(--color-text-muted) hover:text-(--color-text)"
    >
      ← All devices
    </Link>
  );
}
