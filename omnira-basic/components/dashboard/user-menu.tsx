"use client";

import { useRef, useState, type FocusEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { logout } from "@/lib/api/auth";
import { Icon } from "@/components/ui/icon";
import type { User } from "@/types/user";

function useOutsideClose(onClose: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  return {
    ref,
    onBlur: (event: FocusEvent<HTMLDivElement>) => {
      if (!event.currentTarget.contains(event.relatedTarget)) onClose();
    },
  };
}

export function UserMenu({ user }: { user: User }) {
  const [open, setOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const { ref, onBlur } = useOutsideClose(() => setOpen(false));

  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      await logout();
      router.push("/");
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <div ref={ref} onBlur={onBlur} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center gap-2 rounded-(--radius-md) py-1 pl-1 pr-2 hover:bg-(--color-surface-sunken)"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-(--color-ink-900) font-mono text-xs font-medium text-(--color-paper-white)">
          {initials}
        </span>
        <span className="hidden text-left sm:block">
          <span className="block text-sm font-medium text-(--color-text)">{user.name}</span>
        </span>
        <Icon name="chevron-down" size={14} className="text-(--color-text-faint)" />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 z-20 mt-2 w-56 rounded-(--radius-md) border border-(--color-border) bg-(--color-surface-raised) p-1.5 shadow-lg"
        >
          <div className="px-2.5 py-2">
            <p className="text-sm font-medium text-(--color-text)">{user.name}</p>
            <p className="truncate text-xs text-(--color-text-muted)">{user.email}</p>
          </div>
          <div className="my-1 h-px bg-(--color-border)" />
          <Link
            href="/dashboard/settings"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 rounded-(--radius-sm) px-2.5 py-2 text-sm text-(--color-text) hover:bg-(--color-surface-sunken)"
          >
            <Icon name="settings" size={16} />
            Settings
          </Link>
          <button
            type="button"
            role="menuitem"
            disabled={isLoggingOut}
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-(--radius-sm) px-2.5 py-2 text-left text-sm text-(--color-text) hover:bg-(--color-surface-sunken) disabled:opacity-50"
          >
            <Icon name="logout" size={16} />
            {isLoggingOut ? "Signing out…" : "Sign out"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
