"use client";

import Link from "next/link";
import { TiltCard } from "@/components/ui/tilt-card";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Reveal } from "@/components/ui/reveal";

const DOORS = [
  {
    icon: "cpu" as const,
    title: "Contribute your hardware",
    body: "Turn spare CPU, GPU, and bandwidth into income — you control what's shared, and when.",
    href: "/contribute",
    cta: "See how earning works",
  },
  {
    icon: "box" as const,
    title: "Deploy onto the network",
    body: "Ship websites, APIs, and models onto distributed hardware — global by default, priced by use.",
    href: "/deploy",
    cta: "See deploy targets",
  },
];

/** One shared panel split down the middle rather than two competing cards —
 * the seam itself is the point: two sides, one network. */
export function DoorsSection() {
  return (
    <section className="bg-(--color-surface)">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal>
          <TiltCard glow={false}>
            <Card className="overflow-hidden">
              <div className="grid grid-cols-1 divide-y divide-(--color-border) md:grid-cols-2 md:divide-x md:divide-y-0">
                {DOORS.map((door) => (
                  <div key={door.href} className="flex flex-col p-8 sm:p-10">
                    <Icon name={door.icon} size={22} className="text-(--color-brand)" />
                    <h3 className="mt-4 font-(family-name:--font-display) text-2xl font-semibold text-(--color-text)">
                      {door.title}
                    </h3>
                    <p className="mt-3 flex-1 text-(--color-text-muted)">{door.body}</p>
                    <Link
                      href={door.href}
                      className="group mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-(--color-accent)"
                    >
                      {door.cta}{" "}
                      <span aria-hidden className="inline-block transition-transform duration-200 group-hover:translate-x-1">
                        →
                      </span>
                    </Link>
                  </div>
                ))}
              </div>
            </Card>
          </TiltCard>
        </Reveal>
      </div>
    </section>
  );
}
