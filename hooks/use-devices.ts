"use client";

import { useCallback, useState } from "react";
import { getDevice, getDeviceActivity, listDevices, updateDevice } from "@/lib/api/devices";
import type { UpdateDeviceInput } from "@/types/device";
import { useAsyncData } from "./use-async";

export function useDevices(userId: string, page = 1) {
  return useAsyncData(() => listDevices(userId, { page }), [userId, page]);
}

export function useDevice(deviceId: string) {
  return useAsyncData(() => getDevice(deviceId), [deviceId]);
}

export function useDeviceActivity(deviceId: string) {
  return useAsyncData(() => getDeviceActivity(deviceId), [deviceId]);
}

export function useUpdateDevice(deviceId: string) {
  const [isSaving, setIsSaving] = useState(false);
  const save = useCallback(
    async (input: UpdateDeviceInput) => {
      setIsSaving(true);
      try {
        return await updateDevice(deviceId, input);
      } finally {
        setIsSaving(false);
      }
    },
    [deviceId],
  );
  return { save, isSaving };
}
