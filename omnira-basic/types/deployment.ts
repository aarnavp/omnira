import type { Timestamp } from "./api";

export type DeploymentTarget = "web" | "api" | "model";

export type DeploymentStatus =
  | "building"
  | "live"
  | "degraded"
  | "failed"
  | "paused";

export type DeploymentLogLevel = "info" | "warn" | "error";

export interface DeploymentRegionSpread {
  region: string;
  nodeCount: number;
}

export interface Deployment {
  id: string;
  userId: string;
  name: string;
  target: DeploymentTarget;
  status: DeploymentStatus;
  primaryDomain: string;
  sourceRepo: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  regions: DeploymentRegionSpread[];
  monthlyRequestCount: number;
  monthlyCostUsd: number;
  p50LatencyMs: number;
  uptimePercent: number;
}

export interface DeploymentLogLine {
  id: string;
  timestamp: Timestamp;
  level: DeploymentLogLevel;
  message: string;
}

export interface CreateDeploymentInput {
  name: string;
  target: DeploymentTarget;
  sourceRepo: string;
  preferredRegions: string[];
}
