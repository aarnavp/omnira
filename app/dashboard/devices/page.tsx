"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "@/hooks/use-session";
import { useDevices } from "@/hooks/use-devices";
import { updateDevice } from "@/lib/api/devices";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardBody } from "@/components/ui/card";
import { Table, Thead, Th, Tbody, Td } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Pagination } from "@/components/ui/pagination";
import { SkeletonText } from "@/components/ui/skeleton";
import { ErrorState, EmptyState } from "@/components/ui/state-views";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Reveal } from "@/components/ui/reveal";
import { formatNumber, formatRelativeTime, formatUsd } from "@/lib/utils/format";
import { deviceStatusTone } from "@/lib/utils/status";
import type { Device, DeviceKind } from "@/types/device";

const KIND_ICON: Record<DeviceKind, "laptop" | "desktop" | "server" | "phone"> = {
  laptop: "laptop",
  desktop: "desktop",
  server: "server",
  phone: "phone",
};

export default function DevicesPage() {
  const session = useSession();
  const userId = session.data?.user.id ?? "user_1";
  const [page, setPage] = useState(1);
  const { data, error, isLoading, refetch } = useDevices(userId, page);
  const [pending, setPending] = useState<Record<string, boolean>>({});
  const [rows, setRows] = useState<Record<string, Device>>({});

  const devices = data?.items.map((d) => rows[d.id] ?? d) ?? [];

  async function togglePause(device: Device) {
    const isOnline = device.status === "online" || device.status === "idle";
    setPending((p) => ({ ...p, [device.id]: true }));
    try {
      const updated = await updateDevice(device.id, { status: isOnline ? "paused" : "online" });
      setRows((r) => ({ ...r, [device.id]: updated }));
    } finally {
      setPending((p) => ({ ...p, [device.id]: false }));
    }
  }

  return (
    <Reveal>
      <PageHeader
        title="Devices"
        description="Every device connected to the network, and what it's contributing right now."
      />

      <Card>
        <CardBody className="pt-6">
          {error ? (
            <ErrorState message={error.message} onRetry={refetch} />
          ) : isLoading || !data ? (
            <SkeletonText lines={5} />
          ) : devices.length === 0 ? (
            <EmptyState
              title="No devices connected"
              message="Connect a laptop, desktop, server, or phone to start earning from idle capacity."
              action={
                <Button href="/contribute" size="sm">
                  Connect a device
                </Button>
              }
            />
          ) : (
            <>
              <Table>
                <Thead>
                  <Th>Device</Th>
                  <Th>Status</Th>
                  <Th>Utilization</Th>
                  <Th>Earned</Th>
                  <Th>Requests</Th>
                  <Th>Last seen</Th>
                  <Th>
                    <span className="sr-only">Actions</span>
                  </Th>
                </Thead>
                <Tbody>
                  {devices.map((device) => {
                    const isOnline = device.status === "online" || device.status === "idle";
                    return (
                      <tr key={device.id} className="transition-colors hover:bg-(--color-surface-sunken)">
                        <Td>
                          <Link
                            href={`/dashboard/devices/${device.id}`}
                            className="flex items-center gap-2.5 font-medium text-(--color-text) hover:underline"
                          >
                            <Icon name={KIND_ICON[device.kind]} size={16} className="text-(--color-text-faint)" />
                            {device.name}
                          </Link>
                          <p className="mt-0.5 text-xs text-(--color-text-muted)">{device.location}</p>
                        </Td>
                        <Td>
                          <Badge tone={deviceStatusTone(device.status)}>{device.status}</Badge>
                        </Td>
                        <Td className="font-mono">{device.utilizationPercent}%</Td>
                        <Td className="font-mono">{formatUsd(device.totalEarnedUsd)}</Td>
                        <Td className="font-mono">{formatNumber(device.totalRequestsServed)}</Td>
                        <Td className="text-(--color-text-muted)">{formatRelativeTime(device.lastSeenAt)}</Td>
                        <Td>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={isOnline}
                              disabled={pending[device.id] || device.status === "offline"}
                              onChange={() => togglePause(device)}
                              label={isOnline ? `Pause ${device.name}` : `Resume ${device.name}`}
                            />
                          </div>
                        </Td>
                      </tr>
                    );
                  })}
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
