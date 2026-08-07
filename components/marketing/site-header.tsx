"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Logo } from "./logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

const NAV_LINKS = [
  { href: "/contribute", label: "Contribute" },
  { href: "/deploy", label: "Deploy" },
  { href: "/network", label: "Network" },
];

export function SiteHeader({ dark = false }: { dark?: boolean }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b backdrop-blur",
        dark
          ? "border-(--color-canvas-border) bg-(--color-canvas)/90"
          : "border-(--color-border) bg-(--color-surface)/90",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" aria-label="Omnira home">
            <Logo dark={dark} />
          </Link>
          <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "text-sm font-medium transition-colors",
                    dark
                      ? active
                        ? "text-(--color-canvas-text)"
                        : "text-(--color-canvas-text-muted) hover:text-(--color-canvas-text)"
                      : active
                        ? "text-(--color-text)"
                        : "text-(--color-text-muted) hover:text-(--color-text)",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className={cn(
              "text-sm font-medium",
              dark ? "text-(--color-canvas-text-muted) hover:text-(--color-canvas-text)" : "text-(--color-text-muted) hover:text-(--color-text)",
            )}
          >
            Sign in
          </Link>
          <Button href="/signup" variant={dark ? "on-dark" : "primary"} size="sm">
            Get started
          </Button>
        </div>

        <button
          type="button"
          className={cn(
            "inline-flex h-9 w-9 items-center justify-center rounded-(--radius-md) md:hidden",
            dark ? "text-(--color-canvas-text)" : "text-(--color-text)",
          )}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
            {open ? (
              <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            ) : (
              <path d="M2.5 5h15M2.5 10h15M2.5 15h15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {open ? (
        <div
          className={cn(
            "border-t px-4 py-4 md:hidden",
            dark ? "border-(--color-canvas-border) bg-(--color-canvas)" : "border-(--color-border) bg-(--color-surface)",
          )}
        >
          <nav className="flex flex-col gap-4" aria-label="Primary">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn("text-base font-medium", dark ? "text-(--color-canvas-text)" : "text-(--color-text)")}
              >
                {link.label}
              </Link>
            ))}
            <div className={cn("my-1 h-px", dark ? "bg-(--color-canvas-border)" : "bg-(--color-border)")} />
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className={cn("text-base font-medium", dark ? "text-(--color-canvas-text)" : "text-(--color-text)")}
            >
              Sign in
            </Link>
            <Button href="/signup" variant={dark ? "on-dark" : "primary"} className="w-full">
              Get started
            </Button>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
