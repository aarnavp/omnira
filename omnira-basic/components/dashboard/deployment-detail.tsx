"use client";

import { useState } from "react";
import Link from "next/link";
import { useDeployment, useDeploymentLogs } from "@/hooks/use-deployments";
import { pauseDeployment } from "@/lib/api/deployments";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Stat } from "@/components/ui/stat";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { ErrorState, EmptyState } from "@/components/ui/state-views";
import { formatCompactNumber, formatDateTime, formatUsd } from "@/lib/utils/format";
import { deploymentStatusTone } from "@/lib/utils/status";
import { Reveal } from "@/components/ui/reveal";
import type { DeploymentTarget, DeploymentLogLevel } from "@/types/deployment";

const TARGET_LABEL: Record<DeploymentTarget, string> = {
  web: "Web app",
  api: "API",
  model: "AI model",
};

const LOG_TONE: Record<DeploymentLogLevel, string> = {
  info: "text-(--color-text-muted)",
  warn: "text-(--color-warning-text)",
  error: "text-(--color-danger)",
};

export function DeploymentDetail({ deploymentId }: { deploymentId: string }) {
  const { data: deployment, error, isLoading, refetch } = useDeployment(deploymentId);
  const logs = useDeploymentLogs(deploymentId);
  const [status, setStatus] = useState<"paused" | null>(null);
  const [isPausing, setIsPausing] = useState(false);

  if (error) {
    return (
      <div>
        <BackLink />
        <ErrorState title="Couldn't load this deployment" message={error.message} onRetry={refetch} />
      </div>
    );
  }

  if (isLoading || !deployment) {
    return (
      <div>
        <BackLink />
        <Skeleton className="h-8 w-64" />
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </div>
    );
  }

  const effectiveStatus = status ?? deployment.status;

  async function handlePause() {
    setIsPausing(true);
    try {
      await pauseDeployment(deploymentId);
      setStatus("paused");
    } finally {
      setIsPausing(false);
    }
  }

  return (
    <Reveal>
      <BackLink />

      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-(family-name:--font-display) text-2xl font-semibold text-(--color-text)">
              {deployment.name}
            </h1>
            <Badge tone={deploymentStatusTone(effectiveStatus)}>{effectiveStatus}</Badge>
          </div>
          <p className="mt-1 text-sm text-(--color-text-muted)">
            {TARGET_LABEL[deployment.target]} · {deployment.primaryDomain}
          </p>
        </div>
        {effectiveStatus !== "paused" ? (
          <Button variant="secondary" size="sm" onClick={handlePause} disabled={isPausing}>
            {isPausing ? "Pausing…" : "Pause deployment"}
          </Button>
        ) : null}
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Requests / mo" value={formatCompactNumber(deployment.monthlyRequestCount)} />
        <Stat label="Cost / mo" value={formatUsd(deployment.monthlyCostUsd)} />
        <Stat label="p50 latency" value={`${deployment.p50LatencyMs} ms`} />
        <Stat label="Uptime" value={`${deployment.uptimePercent}%`} tone="positive" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader eyebrow="Footprint" title="Regions" />
          <CardBody className="flex flex-col gap-3">
            {deployment.regions.map((region) => (
              <div key={region.region} className="flex items-center justify-between text-sm">
                <span className="font-medium text-(--color-text)">{region.region}</span>
                <span className="font-mono text-(--color-text-muted)">{region.nodeCount} nodes</span>
              </div>
            ))}
          </CardBody>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader eyebrow="Activity" title="Recent logs" />
          <CardBody>
            {logs.error ? (
              <ErrorState message={logs.error.message} onRetry={logs.refetch} />
            ) : logs.isLoading || !logs.data ? (
              <SkeletonText lines={6} />
            ) : logs.data.length === 0 ? (
              <EmptyState title="No activity yet" message="Logs will appear here once traffic starts arriving." />
            ) : (
              <ul className="flex flex-col gap-2 font-mono text-xs">
                {logs.data.map((log) => (
                  <li key={log.id} className="flex gap-3">
                    <span className="shrink-0 text-(--color-text-faint)">{formatDateTime(log.timestamp)}</span>
                    <span className={LOG_TONE[log.level]}>{log.message}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>
      </div>
    </Reveal>
  );
}

function BackLink() {
  return (
    <Link
      href="/dashboard/deployments"
      className="mb-6 inline-flex items-center gap-1.5 text-sm text-(--color-text-muted) hover:text-(--color-text)"
    >
      ← All deployments
    </Link>
  );
}
