"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";

export interface StepEntry {
  step: string;
  title: string;
  body: string;
}

/** A numbered, real-sequence step list with a connecting line that draws
 * itself in as the reader scrolls past it. Reused wherever a page has an
 * actual ordered process (onboarding, deploy flow) — not decorative
 * numbering. */
export function NumberedSteps({ heading, steps }: { heading?: string; steps: StepEntry[] }) {
  const measureRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: measureRef,
    offset: ["start 0.85", "end 0.6"],
  });
  const lineProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 24 });

  return (
    <div>
      {heading ? (
        <Reveal>
          <h3 className="font-(family-name:--font-display) text-xl font-semibold text-(--color-text)">{heading}</h3>
        </Reveal>
      ) : null}
      <div ref={measureRef} className={heading ? "relative mt-6" : "relative"}>
        {!reduceMotion ? (
          <div className="absolute left-[15px] top-2 bottom-2 w-px bg-(--color-border)">
            <motion.div
              className="w-full origin-top bg-(--color-signal-600)"
              style={{ scaleY: lineProgress, height: "100%" }}
            />
          </div>
        ) : null}
        <RevealGroup as="ol" className="flex flex-col gap-8" stagger={0.15}>
          {steps.map((item, i) => (
            <RevealItem key={item.step} as="li" className="relative flex gap-5">
              <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-(--color-border) bg-(--color-surface) font-mono text-xs text-(--color-text-faint)">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="pt-1">
                <p className="font-medium text-(--color-text)">{item.title}</p>
                <p className="mt-1 text-sm text-(--color-text-muted)">{item.body}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </div>
  );
}
