"use client";

import { useState, type ReactNode } from "react";
import { SidebarNav } from "./sidebar-nav";
import { UserMenu } from "./user-menu";
import { Icon } from "@/components/ui/icon";
import type { User } from "@/types/user";

export function DashboardShell({ user, children }: { user: User; children: ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex min-h-full bg-(--color-surface)">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-(--color-border) bg-(--color-surface-raised) lg:block">
        <div className="sticky top-0 h-screen overflow-y-auto">
          <SidebarNav />
        </div>
      </aside>

      {/* Mobile sidebar drawer */}
      {mobileNavOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-(--color-ink-950)/50"
            onClick={() => setMobileNavOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-(--color-surface-raised) shadow-xl">
            <SidebarNav onNavigate={() => setMobileNavOpen(false)} />
          </div>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-(--color-border) bg-(--color-surface)/95 px-4 backdrop-blur sm:px-6">
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setMobileNavOpen(true)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-(--radius-md) text-(--color-text) lg:hidden"
          >
            <Icon name="menu" size={20} />
          </button>
          <div className="hidden lg:block" />
          <UserMenu user={user} />
        </header>

        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
