import type { ReactNode } from "react";
import Link from "next/link";
import { Logo } from "./logo";
import { DeviceLattice } from "./device-lattice";
import { AnimatedHeroText } from "./animated-hero-text";

export function AuthShell({
  eyebrow,
  title,
  subtitle,
  children,
  footer,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="grid min-h-full grid-cols-1 lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-(--color-canvas) lg:flex lg:flex-col lg:justify-between lg:p-10">
        <div className="pointer-events-none absolute inset-0 opacity-60">
          <DeviceLattice className="h-full w-full" />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-(--color-canvas) via-(--color-canvas)/40 to-(--color-canvas)/10" />
        <Link href="/" className="relative z-10">
          <Logo dark />
        </Link>
        <blockquote className="relative z-10 max-w-md">
          <p className="font-(family-name:--font-display) text-2xl font-medium leading-snug text-(--color-canvas-text)">
            &ldquo;The world&apos;s idle devices are a computer no one has turned on yet.&rdquo;
          </p>
          <p className="mt-4 text-sm text-(--color-canvas-text-muted)">
            Decentralized compute, built from hardware people already own.
          </p>
        </blockquote>
      </div>

      <div className="flex flex-col justify-center px-6 py-16 sm:px-12 lg:px-16">
        <AnimatedHeroText>
          <div className="mx-auto w-full max-w-sm">
            <Link href="/" className="lg:hidden">
              <Logo />
            </Link>
            <p className="mt-8 font-mono text-xs uppercase tracking-wider text-(--color-text-faint) lg:mt-0">
              {eyebrow}
            </p>
            <h1 className="mt-2 font-(family-name:--font-display) text-2xl font-semibold text-(--color-text)">
              {title}
            </h1>
            <p className="mt-1.5 text-sm text-(--color-text-muted)">{subtitle}</p>

            <div className="mt-8">{children}</div>

            <p className="mt-8 text-sm text-(--color-text-muted)">{footer}</p>
          </div>
        </AnimatedHeroText>
      </div>
    </div>
  );
}
