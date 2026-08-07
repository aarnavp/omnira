"use client";

import { RevealGroup, RevealItem } from "@/components/ui/reveal";
import { TiltCard } from "@/components/ui/tilt-card";
import { Card, CardBody } from "@/components/ui/card";
import { fadeUpItem } from "@/lib/motion";
import { cn } from "@/lib/utils/cn";

export interface FeatureGridItem {
  title: string;
  body: string;
}

/** A staggered, tilt-interactive grid of small feature cards — used across
 * the Contribute/Deploy pages wherever the old page had a flat 3-up or 2-up
 * grid of plain text. */
export function FeatureGrid({
  items,
  columns = 3,
  card = true,
}: {
  items: FeatureGridItem[];
  columns?: 2 | 3;
  card?: boolean;
}) {
  return (
    <RevealGroup
      className={cn("grid grid-cols-1 gap-6", columns === 3 ? "md:grid-cols-3" : "sm:grid-cols-2")}
      stagger={0.1}
    >
      {items.map((item) => (
        <RevealItem key={item.title} variants={fadeUpItem}>
          {card ? (
            <TiltCard glow={false}>
              <Card className="h-full transition-shadow duration-300 hover:shadow-lg">
                <CardBody className="pt-6">
                  <h3 className="font-(family-name:--font-display) text-lg font-semibold text-(--color-text)">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-(--color-text-muted)">{item.body}</p>
                </CardBody>
              </Card>
            </TiltCard>
          ) : (
            <div className="rounded-(--radius-lg) border border-(--color-border) bg-(--color-surface-raised) p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <p className="font-medium text-(--color-text)">{item.title}</p>
              <p className="mt-1.5 text-sm text-(--color-text-muted)">{item.body}</p>
            </div>
          )}
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
