"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "@/hooks/use-session";
import { useDeployments } from "@/hooks/use-deployments";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardBody } from "@/components/ui/card";
import { Table, Thead, Th, Tbody, Td } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/ui/pagination";
import { SkeletonText } from "@/components/ui/skeleton";
import { ErrorState, EmptyState } from "@/components/ui/state-views";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { formatCompactNumber, formatUsd } from "@/lib/utils/format";
import { deploymentStatusTone } from "@/lib/utils/status";
import { Reveal } from "@/components/ui/reveal";
import type { DeploymentTarget } from "@/types/deployment";

const TARGET_LABEL: Record<DeploymentTarget, string> = {
  web: "Web app",
  api: "API",
  model: "AI model",
};

export default function DeploymentsPage() {
  const session = useSession();
  const userId = session.data?.user.id ?? "user_1";
  const [page, setPage] = useState(1);
  const { data, error, isLoading, refetch } = useDeployments(userId, page);

  return (
    <Reveal>
      <PageHeader
        title="Deployments"
        description="Everything you've shipped onto the network."
        action={
          <Button href="/dashboard/deployments/new" size="sm">
            New deployment
          </Button>
        }
      />

      <Card>
        <CardBody className="pt-6">
          {error ? (
            <ErrorState message={error.message} onRetry={refetch} />
          ) : isLoading || !data ? (
            <SkeletonText lines={5} />
          ) : data.items.length === 0 ? (
            <EmptyState
              title="Nothing deployed yet"
              message="Ship a website, API, or model onto the network to see it here."
              action={
                <Button href="/dashboard/deployments/new" size="sm">
                  New deployment
                </Button>
              }
            />
          ) : (
            <>
              <Table>
                <Thead>
                  <Th>Deployment</Th>
                  <Th>Target</Th>
                  <Th>Status</Th>
                  <Th>Requests / mo</Th>
                  <Th>Cost / mo</Th>
                  <Th>Uptime</Th>
                </Thead>
                <Tbody>
                  {data.items.map((deployment) => (
                    <tr key={deployment.id} className="transition-colors hover:bg-(--color-surface-sunken)">
                      <Td>
                        <Link
                          href={`/dashboard/deployments/${deployment.id}`}
                          className="flex items-center gap-2.5 font-medium text-(--color-text) hover:underline"
                        >
                          <Icon name="box" size={16} className="text-(--color-text-faint)" />
                          {deployment.name}
                        </Link>
                        <p className="mt-0.5 text-xs text-(--color-text-muted)">{deployment.primaryDomain}</p>
                      </Td>
                      <Td>{TARGET_LABEL[deployment.target]}</Td>
                      <Td>
                        <Badge tone={deploymentStatusTone(deployment.status)}>{deployment.status}</Badge>
                      </Td>
                      <Td className="font-mono">{formatCompactNumber(deployment.monthlyRequestCount)}</Td>
                      <Td className="font-mono">{formatUsd(deployment.monthlyCostUsd)}</Td>
                      <Td className="font-mono">{deployment.uptimePercent}%</Td>
                    </tr>
                  ))}
                </Tbody>
              </Table>
              <Pagination page={data.page} totalPages={data.totalPages} onChange={setPage} />
            </>
          )}
        </CardBody>
      </Card>
    </Reveal>
  );
}
