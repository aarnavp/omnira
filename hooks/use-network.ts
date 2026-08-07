"use client";

import { useState } from "react";
import { getNetworkSnapshot } from "@/lib/api/network";
import type { NetworkStatsWindow } from "@/types/network";
import { useAsyncData } from "./use-async";

export function useNetworkSnapshot(initialWindow: NetworkStatsWindow = "all") {
  const [window, setWindow] = useState<NetworkStatsWindow>(initialWindow);
  const state = useAsyncData(() => getNetworkSnapshot(window), [window]);
  return { ...state, window, setWindow };
}
