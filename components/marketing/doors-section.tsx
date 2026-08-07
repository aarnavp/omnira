"use client";

import Link from "next/link";
import { TiltCard } from "@/components/ui/tilt-card";
import { Card, CardBody } from "@/components/ui/card";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";
import { fadeUpItem } from "@/lib/motion";

const DOORS = [
  {
    eyebrow: "For device owners",
    title: "Contribute your hardware",
    body: "Turn spare CPU, GPU, and bandwidth into income. You choose what's shared, when, and how much — the off switch is never buried.",
    href: "/contribute",
    cta: "See how earning works",
    tone: "signal" as const,
  },
  {
    eyebrow: "For builders",
    title: "Deploy onto the network",
    body: "Ship websites, APIs, and models onto distributed hardware instead of a traditional cloud — global by default, priced by what you use.",
    href: "/deploy",
    cta: "See deploy targets",
    tone: "ink" as const,
  },
];

export function DoorsSection() {
  return (
    <section className="border-b border-(--color-border) bg-(--color-surface)">
      <RevealGroup
        className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-16 sm:px-6 md:grid-cols-2 lg:px-8"
        stagger={0.12}
      >
        {DOORS.map((door) => (
          <RevealItem key={door.href} variants={fadeUpItem}>
            <TiltCard>
              <Card className={door.tone === "signal" ? "border-(--color-signal-500)/30" : undefined}>
                <CardBody className="flex h-full flex-col pt-6">
                  <p className="font-mono text-xs uppercase tracking-wider text-(--color-text-faint)">
                    {door.eyebrow}
                  </p>
                  <h3 className="mt-2 font-(family-name:--font-display) text-2xl font-semibold text-(--color-text)">
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
                </CardBody>
              </Card>
            </TiltCard>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
