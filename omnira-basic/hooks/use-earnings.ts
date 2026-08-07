"use client";

import {
  getEarningsByDeviceKind,
  getEarningsSummary,
  getEarningsTimeseries,
  listPayouts,
} from "@/lib/api/earnings";
import { useAsyncData } from "./use-async";

export function useEarningsSummary(userId: string) {
  return useAsyncData(() => getEarningsSummary(userId), [userId]);
}

export function useEarningsByDeviceKind(userId: string) {
  return useAsyncData(() => getEarningsByDeviceKind(userId), [userId]);
}

export function useEarningsTimeseries(userId: string) {
  return useAsyncData(() => getEarningsTimeseries(userId), [userId]);
}

export function usePayouts(userId: string, page = 1) {
  return useAsyncData(() => listPayouts(userId, { page }), [userId, page]);
}
