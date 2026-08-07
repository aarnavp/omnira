import { simulateRequest } from "./mock-transport";
import type { UserSettings } from "@/types/user";

const MOCK_SETTINGS: UserSettings = {
  userId: "user_1",
  timezone: "America/Chicago",
  payoutCurrency: "USD",
  notifications: {
    payoutEmails: true,
    deploymentAlerts: true,
    deviceOfflineAlerts: false,
    productUpdates: false,
  },
};

export async function getUserSettings(userId: string): Promise<UserSettings> {
  return simulateRequest({ ...MOCK_SETTINGS, userId }, { latencyMs: [180, 360] });
}

export async function updateUserSettings(
  userId: string,
  patch: Partial<Omit<UserSettings, "userId">>,
): Promise<UserSettings> {
  return simulateRequest(
    {
      ...MOCK_SETTINGS,
      ...patch,
      userId,
      notifications: { ...MOCK_SETTINGS.notifications, ...patch.notifications },
    },
    { latencyMs: [250, 480] },
  );
}
