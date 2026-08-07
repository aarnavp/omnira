"use client";

import { motion, useReducedMotion, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Animates a number counting up to `value` whenever it changes, instead of
 * snapping — used for live/ticking stats so updates read as motion, not a
 * jump cut. Renders through `format` so callers keep control of currency /
 * compact-number formatting. Falls back to the plain formatted value under
 * reduced motion.
 */
export function CountUp({
  value,
  format,
  className,
}: {
  value: number;
  format: (value: number) => string;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const spring = useSpring(value, { stiffness: 90, damping: 24, mass: 1 });
  const [display, setDisplay] = useState(() => format(value));

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  useEffect(() => {
    // The endorsed shape for this rule: subscribe to an external system
    // (the spring) and call setState from its change callback, not from
    // the effect body itself.
    return spring.on("change", (latest) => setDisplay(format(latest)));
  }, [spring, format]);

  if (reduceMotion) {
    return <span className={className}>{format(value)}</span>;
  }

  return <motion.span className={className}>{display}</motion.span>;
}
