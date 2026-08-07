"use client";

import { useCallback, useState } from "react";
import { getUserSettings, updateUserSettings } from "@/lib/api/settings";
import type { UserSettings } from "@/types/user";
import { useAsyncData } from "./use-async";

export function useUserSettings(userId: string) {
  return useAsyncData(() => getUserSettings(userId), [userId]);
}

export function useUpdateUserSettings(userId: string) {
  const [isSaving, setIsSaving] = useState(false);
  const save = useCallback(
    async (patch: Partial<Omit<UserSettings, "userId">>) => {
      setIsSaving(true);
      try {
        return await updateUserSettings(userId, patch);
      } finally {
        setIsSaving(false);
      }
    },
    [userId],
  );
  return { save, isSaving };
}
