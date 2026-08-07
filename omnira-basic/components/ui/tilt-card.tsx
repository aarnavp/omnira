"use client";

import { motion, useMotionTemplate, useReducedMotion, useSpring } from "framer-motion";
import { type PointerEvent, type ReactNode, useRef } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * A card that tilts toward the cursor in 3D and carries a soft light that
 * follows the pointer — the interactive equivalent of the flat door cards on
 * the old page. Falls back to a flat card (no tilt) under reduced motion.
 */
export function TiltCard({
  children,
  className,
  glow = true,
}: {
  children: ReactNode;
  className?: string;
  glow?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const rotateX = useSpring(0, { stiffness: 300, damping: 30 });
  const rotateY = useSpring(0, { stiffness: 300, damping: 30 });
  const glowX = useSpring(50, { stiffness: 200, damping: 30 });
  const glowY = useSpring(50, { stiffness: 200, damping: 30 });
  const background = useMotionTemplate`radial-gradient(320px circle at ${glowX}% ${glowY}%, color-mix(in srgb, var(--color-signal-500) 14%, transparent), transparent 70%)`;

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (reduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    rotateY.set((px - 0.5) * 10);
    rotateX.set((0.5 - py) * 10);
    glowX.set(px * 100);
    glowY.set(py * 100);
  }

  function handlePointerLeave() {
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      whileHover={reduceMotion ? undefined : { scale: 1.015 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={cn("group relative", className)}
    >
      {glow ? (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-(--radius-lg) opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background }}
        />
      ) : null}
      {children}
    </motion.div>
  );
}
