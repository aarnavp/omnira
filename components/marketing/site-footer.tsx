import Link from "next/link";
import { Logo } from "./logo";

const COLUMNS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Product",
    links: [
      { href: "/contribute", label: "Contribute" },
      { href: "/deploy", label: "Deploy" },
      { href: "/network", label: "Network status" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/login", label: "Sign in" },
      { href: "/signup", label: "Create account" },
      { href: "/dashboard", label: "Dashboard" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/network", label: "Transparency" },
      { href: "/dashboard/settings", label: "Settings" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-(--color-canvas-border) bg-(--color-canvas)">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <Logo dark />
            <p className="mt-3 max-w-xs text-sm text-(--color-canvas-text-muted)">
              Idle devices, working. A decentralized compute network built from hardware people
              already own.
            </p>
          </div>
          {COLUMNS.map((column) => (
            <div key={column.title}>
              <p className="font-mono text-xs uppercase tracking-wider text-(--color-canvas-text-muted)">
                {column.title}
              </p>
              <ul className="mt-3 flex flex-col gap-2.5">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-(--color-canvas-text) hover:text-(--color-signal-400)"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col gap-2 border-t border-(--color-canvas-border) pt-6 text-xs text-(--color-canvas-text-muted) sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Omnira. All rights reserved.</p>
          <p>Built on idle devices, not idle promises.</p>
        </div>
      </div>
    </footer>
  );
}
