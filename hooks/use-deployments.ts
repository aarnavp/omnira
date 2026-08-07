"use client";

import { getDeployment, getDeploymentLogs, listDeployments } from "@/lib/api/deployments";
import { useAsyncData } from "./use-async";

export function useDeployments(userId: string, page = 1) {
  return useAsyncData(() => listDeployments(userId, { page }), [userId, page]);
}

export function useDeployment(deploymentId: string) {
  return useAsyncData(() => getDeployment(deploymentId), [deploymentId]);
}

export function useDeploymentLogs(deploymentId: string) {
  return useAsyncData(() => getDeploymentLogs(deploymentId), [deploymentId]);
}
