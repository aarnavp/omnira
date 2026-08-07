"use client";

import { useState } from "react";
import { useSession } from "@/hooks/use-session";
import { useUpdateUserSettings, useUserSettings } from "@/hooks/use-settings";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { SkeletonText } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/state-views";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import type { NotificationPreferences, UserSettings } from "@/types/user";

const NOTIFICATION_COPY: { key: keyof NotificationPreferences; label: string; body: string }[] = [
  { key: "payoutEmails", label: "Payout receipts", body: "An email each time a payout is sent." },
  { key: "deploymentAlerts", label: "Deployment alerts", body: "Status changes on your deployments." },
  { key: "deviceOfflineAlerts", label: "Device offline alerts", body: "When a connected device drops offline unexpectedly." },
  { key: "productUpdates", label: "Product updates", body: "Occasional news about new Omnira features." },
];

const CURRENCIES: UserSettings["payoutCurrency"][] = ["USD", "EUR", "GBP"];

export default function SettingsPage() {
  const session = useSession();
  const userId = session.data?.user.id ?? "user_1";
  const { data, error, isLoading, refetch } = useUserSettings(userId);
  const { save, isSaving } = useUpdateUserSettings(userId);

  // Optimistic overrides layered on top of fetched data, the same pattern
  // used on the device detail page — avoids syncing server data into state
  // via an effect just to allow local edits.
  const [notificationOverrides, setNotificationOverrides] = useState<Partial<NotificationPreferences>>({});
  const [currencyOverride, setCurrencyOverride] = useState<UserSettings["payoutCurrency"] | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const local: UserSettings | null = data
    ? {
        ...data,
        payoutCurrency: currencyOverride ?? data.payoutCurrency,
        notifications: { ...data.notifications, ...notificationOverrides },
      }
    : null;

  async function handleNotificationToggle(key: keyof NotificationPreferences, value: boolean) {
    if (!local) return;
    setNotificationOverrides((prev) => ({ ...prev, [key]: value }));
    await save({ notifications: { ...local.notifications, [key]: value } });
  }

  async function handleCurrencyChange(value: UserSettings["payoutCurrency"]) {
    setCurrencyOverride(value);
    await save({ payoutCurrency: value });
  }

  return (
    <Reveal>
      <PageHeader title="Settings" description="Your profile, notifications, and payout preferences." />

      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader eyebrow="Profile" title="Account" />
          <CardBody>
            {session.error ? (
              <ErrorState message={session.error.message} onRetry={session.refetch} />
            ) : session.isLoading || !session.data ? (
              <SkeletonText lines={2} />
            ) : (
              <div className="flex flex-col gap-4 text-sm sm:flex-row sm:gap-12">
                <div>
                  <p className="text-(--color-text-faint)">Name</p>
                  <p className="mt-1 font-medium text-(--color-text)">{session.data.user.name}</p>
                </div>
                <div>
                  <p className="text-(--color-text-faint)">Email</p>
                  <p className="mt-1 font-medium text-(--color-text)">{session.data.user.email}</p>
                </div>
              </div>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader eyebrow="Notifications" title="What we email you about" />
          <CardBody>
            {error ? (
              <ErrorState message={error.message} onRetry={refetch} />
            ) : isLoading || !local ? (
              <SkeletonText lines={4} />
            ) : (
              <div className="flex flex-col divide-y divide-(--color-border)">
                {NOTIFICATION_COPY.map((item) => (
                  <div key={item.key} className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
                    <div>
                      <p className="text-sm font-medium text-(--color-text)">{item.label}</p>
                      <p className="text-xs text-(--color-text-muted)">{item.body}</p>
                    </div>
                    <Switch
                      checked={local.notifications[item.key]}
                      disabled={isSaving}
                      onChange={(value) => handleNotificationToggle(item.key, value)}
                      label={item.label}
                    />
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader eyebrow="Payouts" title="How you get paid" />
          <CardBody>
            {isLoading || !local ? (
              <SkeletonText lines={2} />
            ) : (
              <div className="max-w-xs">
                <label htmlFor="payout-currency" className="text-sm font-medium text-(--color-text)">
                  Payout currency
                </label>
                <select
                  id="payout-currency"
                  value={local.payoutCurrency}
                  disabled={isSaving}
                  onChange={(e) => handleCurrencyChange(e.target.value as UserSettings["payoutCurrency"])}
                  className="mt-1.5 h-10 w-full rounded-(--radius-md) border border-(--color-border) bg-(--color-surface-raised) px-3 text-sm text-(--color-text) outline-none focus:border-(--color-accent)"
                >
                  {CURRENCIES.map((currency) => (
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </CardBody>
        </Card>

        <Card className="bg-[color-mix(in_srgb,var(--color-danger)_3%,var(--color-surface-raised))]">
          <CardHeader
            eyebrow={<span className="text-(--color-danger)">Danger zone</span>}
            title="Close your account"
            description="Pauses every device and deployment you own."
          />
          <CardBody>
            {showDeleteConfirm ? (
              <div className="rounded-(--radius-md) bg-(--color-surface-sunken) p-4 text-sm text-(--color-text-muted)">
                Account closure isn&apos;t available during the pilot. Reach out to support if you need your data
                removed sooner.
                <div className="mt-3">
                  <Button variant="secondary" size="sm" onClick={() => setShowDeleteConfirm(false)}>
                    Dismiss
                  </Button>
                </div>
              </div>
            ) : (
              <Button variant="danger" size="sm" onClick={() => setShowDeleteConfirm(true)}>
                Close account
              </Button>
            )}
          </CardBody>
        </Card>
      </div>
    </Reveal>
  );
}
