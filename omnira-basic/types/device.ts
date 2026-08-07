import type { Timestamp } from "./api";

export type DeviceKind = "laptop" | "desktop" | "server" | "phone";

export type DeviceStatus = "online" | "idle" | "paused" | "offline";

export interface DeviceSpecs {
  cpuModel: string;
  cpuCores: number;
  ramGb: number;
  gpuModel: string | null;
}

export interface Device {
  id: string;
  userId: string;
  name: string;
  kind: DeviceKind;
  status: DeviceStatus;
  location: string;
  specs: DeviceSpecs;
  /** 0–100, how much of the device's spare capacity is being lent right now. */
  utilizationPercent: number;
  /** Owner-set ceiling; the device never contributes above this. */
  contributionLimitPercent: number;
  totalEarnedUsd: number;
  totalRequestsServed: number;
  lastSeenAt: Timestamp;
  connectedAt: Timestamp;
  /** Whether the device is allowed to run untrusted third-party workloads. */
  acceptsGeneralWorkloads: boolean;
}

export interface DeviceActivityPoint {
  timestamp: Timestamp;
  utilizationPercent: number;
  earningsUsd: number;
  requestsServed: number;
}

export interface UpdateDeviceInput {
  contributionLimitPercent?: number;
  acceptsGeneralWorkloads?: boolean;
  status?: Extract<DeviceStatus, "paused" | "online">;
}
