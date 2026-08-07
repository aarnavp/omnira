import type { Transition, Variants } from "framer-motion";

/** Shared spring used anywhere something should feel physical, not linear. */
export const springy: Transition = { type: "spring", stiffness: 260, damping: 26, mass: 0.9 };

export const softSpring: Transition = { type: "spring", stiffness: 120, damping: 18 };

/** Standard scroll-reveal: rise + fade. Used by <Reveal>. */
export const revealVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

/** Parent variant for staggered children reveals. */
export function staggerContainer(stagger = 0.1, delayChildren = 0): Variants {
  return {
    hidden: {},
    show: {
      transition: { staggerChildren: stagger, delayChildren },
    },
  };
}

export const fadeUpItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};
