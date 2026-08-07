"use client";

import { RevealGroup, RevealItem } from "@/components/ui/reveal";
import { Card } from "@/components/ui/card";
import { fadeUpItem } from "@/lib/motion";
import { cn } from "@/lib/utils/cn";

export interface FeatureGridItem {
  title: string;
  body: string;
}

const COLUMN_CLASS: Record<3 | 4, string> = {
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
};

/** One unified panel with internal hairline dividers, instead of N separate
 * bordered cards competing for attention — the grid reads as a single
 * surface with structure, not a wall of boxes. */
export function FeatureGrid({ items, columns = 3 }: { items: FeatureGridItem[]; columns?: 3 | 4 }) {
  return (
    <RevealGroup as="ul">
      <Card className="overflow-hidden p-0">
        <div className={cn("grid grid-cols-1 divide-y divide-(--color-border) sm:divide-y-0 sm:divide-x", COLUMN_CLASS[columns])}>
          {items.map((item) => (
            <RevealItem key={item.title} as="li" variants={fadeUpItem} className="p-6 sm:p-7">
              <p className="font-medium text-(--color-text)">{item.title}</p>
              <p className="mt-1.5 text-sm text-(--color-text-muted)">{item.body}</p>
            </RevealItem>
          ))}
        </div>
      </Card>
    </RevealGroup>
  );
}
