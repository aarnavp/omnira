import type { DeviceStatus } from "@/types/device";
import type { DeploymentStatus } from "@/types/deployment";

type BadgeTone = "neutral" | "positive" | "warning" | "danger" | "accent" | "on-dark";

export function deviceStatusTone(status: DeviceStatus): BadgeTone {
  switch (status) {
    case "online":
      return "positive";
    case "idle":
      return "neutral";
    case "paused":
      return "warning";
    case "offline":
      return "neutral";
  }
}

export function deploymentStatusTone(status: DeploymentStatus): BadgeTone {
  switch (status) {
    case "live":
      return "positive";
    case "building":
      return "neutral";
    case "degraded":
      return "warning";
    case "failed":
      return "danger";
    case "paused":
      return "neutral";
  }
}
