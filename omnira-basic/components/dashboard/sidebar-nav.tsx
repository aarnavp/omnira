"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { NAV_GROUPS } from "./nav-config";
import { Icon } from "@/components/ui/icon";
import { Logo } from "@/components/marketing/logo";
import { cn } from "@/lib/utils/cn";

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col gap-8 px-4 py-6">
      <Link href="/" className="px-2">
        <Logo />
      </Link>

      <nav className="flex flex-1 flex-col gap-6" aria-label="Dashboard">
        {NAV_GROUPS.map((group, i) => (
          <div key={group.label ?? `group-${i}`}>
            {group.label ? (
              <p className="px-2 pb-2 font-mono text-xs uppercase tracking-wider text-(--color-text-faint)">
                {group.label}
              </p>
            ) : null}
            <ul className="flex flex-col gap-0.5">
              {group.items.map((item) => {
                const active = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "relative flex items-center gap-2.5 rounded-(--radius-md) px-2.5 py-2 text-sm font-medium transition-colors",
                        active
                          ? "text-(--color-paper-white)"
                          : "text-(--color-text-muted) hover:bg-(--color-surface-sunken) hover:text-(--color-text)",
                      )}
                    >
                      {active ? (
                        <motion.span
                          layoutId="sidebar-active-pill"
                          className="absolute inset-0 rounded-(--radius-md) bg-(--color-ink-900)"
                          transition={{ type: "spring", stiffness: 420, damping: 34 }}
                        />
                      ) : null}
                      <span className="relative">
                        <Icon name={item.icon} size={16} />
                      </span>
                      <span className="relative">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </div>
  );
}
