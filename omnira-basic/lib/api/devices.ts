import { simulateRequest } from "./mock-transport";
import { mulberry32, seededInt, seededPick } from "@/lib/utils/random";
import { ApiError } from "@/types/api";
import type { Paginated } from "@/types/api";
import type {
  Device,
  DeviceActivityPoint,
  DeviceKind,
  DeviceStatus,
  UpdateDeviceInput,
} from "@/types/device";

const DEVICE_NAMES: Record<DeviceKind, string[]> = {
  laptop: ["Aarnav's ThinkPad", "Studio MacBook Pro", "Guest Room Laptop"],
  desktop: ["Workshop Tower", "Living Room Rig", "Basement Build"],
  server: ["Rack Node 3", "Home Server", "Colo Spare"],
  phone: ["Pixel Spare", "Old iPhone 13", "Overnight Charger Phone"],
};

const LOCATIONS = ["Austin, US", "Berlin, DE", "Singapore, SG", "Toronto, CA", "São Paulo, BR"];
const CPU_MODELS = ["Apple M2", "Ryzen 7 7700X", "Intel i7-13700K", "Snapdragon 8 Gen 2"];
const GPU_MODELS: (string | null)[] = ["RTX 4070", "RTX 3060", null, null];
const STATUS_WEIGHTS: DeviceStatus[] = ["online", "online", "idle", "paused", "offline"];

function buildDevice(seed: number, userId: string): Device {
  const rng = mulberry32(seed);
  const kind = seededPick(rng, ["laptop", "desktop", "server", "phone"] as const);
  const status = seededPick(rng, STATUS_WEIGHTS);
  const connectedDaysAgo = seededInt(rng, 4, 220);
  const limit = seededInt(rng, 30, 90);
  return {
    id: `dev_${seed.toString(36)}`,
    userId,
    name: seededPick(rng, DEVICE_NAMES[kind]),
    kind,
    status,
    location: seededPick(rng, LOCATIONS),
    specs: {
      cpuModel: seededPick(rng, CPU_MODELS),
      cpuCores: seededInt(rng, 4, 24),
      ramGb: seededPick(rng, [8, 16, 32, 64]),
      gpuModel: seededPick(rng, GPU_MODELS),
    },
    utilizationPercent: status === "online" ? seededInt(rng, 15, 80) : 0,
    contributionLimitPercent: limit,
    totalEarnedUsd: Number((seededInt(rng, 200, 42000) / 100).toFixed(2)),
    totalRequestsServed: seededInt(rng, 800, 620000),
    lastSeenAt: new Date(Date.now() - seededInt(rng, 0, 6) * 3600 * 1000).toISOString(),
    connectedAt: new Date(Date.now() - connectedDaysAgo * 24 * 3600 * 1000).toISOString(),
    acceptsGeneralWorkloads: rng() > 0.3,
  };
}

function allDevicesForUser(userId: string): Device[] {
  const count = 7;
  return Array.from({ length: count }, (_, i) => buildDevice(1000 + i, userId));
}

export async function listDevices(
  userId: string,
  params: { page?: number; pageSize?: number } = {},
): Promise<Paginated<Device>> {
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 10;
  const all = allDevicesForUser(userId);
  const start = (page - 1) * pageSize;
  const items = all.slice(start, start + pageSize);

  return simulateRequest(
    {
      items,
      page,
      pageSize,
      totalItems: all.length,
      totalPages: Math.max(1, Math.ceil(all.length / pageSize)),
    },
    { failureRate: 0.08, failure: { code: "server_error", message: "Couldn't load your devices. Try again in a moment." } },
  );
}

export async function getDevice(deviceId: string, userId = "user_1"): Promise<Device> {
  const device = allDevicesForUser(userId).find((d) => d.id === deviceId);
  if (!device) {
    throw new ApiError({ code: "not_found", message: "This device isn't connected to your account." });
  }
  return simulateRequest(device);
}

export async function getDeviceActivity(
  deviceId: string,
  points = 24,
): Promise<DeviceActivityPoint[]> {
  const rng = mulberry32(hashDeviceId(deviceId));
  const now = Date.now();
  const series: DeviceActivityPoint[] = Array.from({ length: points }, (_, i) => {
    const hoursAgo = points - i;
    return {
      timestamp: new Date(now - hoursAgo * 3600 * 1000).toISOString(),
      utilizationPercent: seededInt(rng, 5, 85),
      earningsUsd: Number((rng() * 4).toFixed(4)),
      requestsServed: seededInt(rng, 40, 4200),
    };
  });
  return simulateRequest(series, { latencyMs: [200, 420] });
}

export async function updateDevice(deviceId: string, input: UpdateDeviceInput): Promise<Device> {
  const device = await getDevice(deviceId);
  return simulateRequest(
    {
      ...device,
      ...input,
      status: input.status ?? device.status,
    },
    { latencyMs: [180, 360] },
  );
}

export async function removeDevice(deviceId: string): Promise<{ id: string }> {
  return simulateRequest({ id: deviceId }, { latencyMs: [220, 420] });
}

function hashDeviceId(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) hash = (hash << 5) - hash + id.charCodeAt(i);
  return hash || 7;
}
