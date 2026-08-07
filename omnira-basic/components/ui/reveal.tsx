"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { revealVariants, staggerContainer } from "@/lib/motion";

type Tag = "div" | "span" | "ol" | "ul" | "li";

/**
 * Scroll-triggered reveal. Wraps `whileInView` (backed by IntersectionObserver
 * under the hood) so a section animates in once, the first time it enters the
 * viewport, and never re-triggers on scroll-up. Respects reduced motion by
 * only fading — no movement.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: Tag;
}) {
  const reduceMotion = useReducedMotion();
  const Component = motion[as];

  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={reduceMotion ? { hidden: { opacity: 0 }, show: { opacity: 1 } } : revealVariants}
      transition={{ delay }}
    >
      {children}
    </Component>
  );
}

/** Reveals children one after another — pair with <RevealItem>. If you need
 * to measure scroll position for this same block, wrap it in your own
 * ref'd element rather than reffing this component directly. */
export function RevealGroup({
  children,
  className,
  stagger = 0.1,
  delayChildren = 0,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delayChildren?: number;
  as?: Tag;
}) {
  const reduceMotion = useReducedMotion();
  const Component = motion[as];

  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={reduceMotion ? { hidden: {}, show: {} } : staggerContainer(stagger, delayChildren)}
    >
      {children}
    </Component>
  );
}

export function RevealItem({
  children,
  className,
  variants,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  variants?: Variants;
  as?: Tag;
}) {
  const reduceMotion = useReducedMotion();
  const Component = motion[as];

  return (
    <Component
      className={className}
      variants={
        reduceMotion
          ? { hidden: { opacity: 0 }, show: { opacity: 1 } }
          : (variants ?? { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } } })
      }
    >
      {children}
    </Component>
  );
}
