"use client";

import { getSession } from "@/lib/api/auth";
import { useAsyncData } from "./use-async";

export function useSession() {
  return useAsyncData(() => getSession(), []);
}
