import { simulateRequest } from "./mock-transport";
import { mulberry32, seededInt, seededPick } from "@/lib/utils/random";
import { ApiError } from "@/types/api";
import type { Paginated } from "@/types/api";
import type {
  CreateDeploymentInput,
  Deployment,
  DeploymentLogLine,
  DeploymentStatus,
  DeploymentTarget,
} from "@/types/deployment";

const NAMES = ["marketing-site", "checkout-api", "recsys-model", "docs-portal", "status-page"];
const REGIONS = ["us-east", "eu-west", "ap-southeast", "sa-east"];
const STATUS_WEIGHTS: DeploymentStatus[] = ["live", "live", "live", "degraded", "building", "paused"];
const TARGETS: DeploymentTarget[] = ["web", "api", "model"];

function buildDeployment(seed: number, userId: string): Deployment {
  const rng = mulberry32(seed);
  const name = seededPick(rng, NAMES);
  const target = seededPick(rng, TARGETS);
  const status = seededPick(rng, STATUS_WEIGHTS);
  const regionCount = seededInt(rng, 1, 3);
  const regions = [...REGIONS]
    .sort(() => rng() - 0.5)
    .slice(0, regionCount)
    .map((region) => ({ region, nodeCount: seededInt(rng, 2, 18) }));

  return {
    id: `dep_${seed.toString(36)}`,
    userId,
    name: `${name}`,
    target,
    status,
    primaryDomain: `${name}.omnira.app`,
    sourceRepo: rng() > 0.2 ? `github.com/aarnav/${name}` : null,
    createdAt: new Date(Date.now() - seededInt(rng, 5, 300) * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - seededInt(rng, 0, 48) * 3600 * 1000).toISOString(),
    regions,
    monthlyRequestCount: seededInt(rng, 4000, 4200000),
    monthlyCostUsd: Number((seededInt(rng, 200, 18000) / 100).toFixed(2)),
    p50LatencyMs: seededInt(rng, 18, 220),
    uptimePercent: Number((99 + rng()).toFixed(2)),
  };
}

function allDeploymentsForUser(userId: string): Deployment[] {
  return Array.from({ length: 5 }, (_, i) => buildDeployment(2000 + i, userId));
}

export async function listDeployments(
  userId: string,
  params: { page?: number; pageSize?: number } = {},
): Promise<Paginated<Deployment>> {
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 10;
  const all = allDeploymentsForUser(userId);
  const start = (page - 1) * pageSize;
  return simulateRequest(
    {
      items: all.slice(start, start + pageSize),
      page,
      pageSize,
      totalItems: all.length,
      totalPages: Math.max(1, Math.ceil(all.length / pageSize)),
    },
    { failureRate: 0.08, failure: { code: "server_error", message: "Couldn't load your deployments. Try again in a moment." } },
  );
}

export async function getDeployment(deploymentId: string, userId = "user_1"): Promise<Deployment> {
  const deployment = allDeploymentsForUser(userId).find((d) => d.id === deploymentId);
  if (!deployment) {
    throw new ApiError({ code: "not_found", message: "This deployment doesn't exist, or it was removed." });
  }
  return simulateRequest(deployment);
}

const LOG_MESSAGES: { level: DeploymentLogLine["level"]; message: string }[] = [
  { level: "info", message: "Build completed in 34s" },
  { level: "info", message: "Routed 1,204 requests across 3 regions" },
  { level: "info", message: "Health check passed on ap-southeast" },
  { level: "warn", message: "p95 latency in eu-west rose to 340ms" },
  { level: "info", message: "Scaled to 12 nodes to match demand" },
  { level: "error", message: "Node dev_9x failed health check and was drained" },
  { level: "info", message: "New deployment promoted to primary" },
];

export async function getDeploymentLogs(deploymentId: string): Promise<DeploymentLogLine[]> {
  const rng = mulberry32(hashId(deploymentId));
  const now = Date.now();
  const logs = Array.from({ length: 14 }, (_, i) => {
    const entry = seededPick(rng, LOG_MESSAGES);
    return {
      id: `log_${deploymentId}_${i}`,
      timestamp: new Date(now - i * seededInt(rng, 40, 900) * 1000).toISOString(),
      level: entry.level,
      message: entry.message,
    };
  });
  return simulateRequest(logs, { latencyMs: [200, 420] });
}

export async function createDeployment(input: CreateDeploymentInput): Promise<Deployment> {
  if (!input.name.trim()) {
    throw new ApiError({
      code: "validation_error",
      message: "Fix the highlighted fields and try again.",
      fieldErrors: { name: "Give your deployment a name." },
    });
  }
  const rng = mulberry32(hashId(input.name));
  return simulateRequest(
    {
      id: `dep_${Date.now().toString(36)}`,
      userId: "user_1",
      name: input.name,
      target: input.target,
      status: "building",
      primaryDomain: `${input.name}.omnira.app`,
      sourceRepo: input.sourceRepo || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      regions: input.preferredRegions.map((region) => ({ region, nodeCount: seededInt(rng, 2, 8) })),
      monthlyRequestCount: 0,
      monthlyCostUsd: 0,
      p50LatencyMs: 0,
      uptimePercent: 100,
    },
    { latencyMs: [500, 900] },
  );
}

export async function pauseDeployment(deploymentId: string): Promise<Deployment> {
  const deployment = await getDeployment(deploymentId);
  return simulateRequest({ ...deployment, status: "paused" as const }, { latencyMs: [200, 380] });
}

function hashId(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) hash = (hash << 5) - hash + id.charCodeAt(i);
  return hash || 11;
}
