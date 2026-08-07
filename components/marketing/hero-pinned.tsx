"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { DeviceLattice } from "./device-lattice";
import { Chip3D } from "./chip-3d";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

/**
 * The hero is a pinned scroll section: the viewport holds still while the
 * section's extra height feeds a scroll-linked rotation into the 3D chip.
 * This is the "Apple product page" pattern — scrolling drives an animation
 * rather than just carrying the page past static content.
 */
export function HeroPinned() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 60, damping: 20, mass: 0.5 });

  const textY = useTransform(smoothProgress, [0, 1], [0, -40]);
  const latticeOpacity = useTransform(smoothProgress, [0, 0.5, 1], [0.7, 0.35, 0.15]);

  return (
    <section ref={sectionRef} className={reduceMotion ? "relative" : "relative lg:h-[220vh]"}>
      <div
        className={
          reduceMotion
            ? "relative bg-(--color-canvas) py-24"
            : "relative overflow-hidden bg-(--color-canvas) py-24 lg:sticky lg:top-0 lg:h-screen lg:py-0"
        }
      >
        <motion.div className="pointer-events-none absolute inset-0" style={{ opacity: reduceMotion ? 0.5 : latticeOpacity }}>
          <DeviceLattice className="h-full w-full" />
        </motion.div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-(--color-canvas)/10 via-(--color-canvas)/60 to-(--color-canvas)" />

        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-4 sm:px-6 lg:h-full lg:grid-cols-2 lg:px-8">
          <motion.div
            className="flex flex-col items-start"
            style={{ y: reduceMotion ? 0 : textY }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <Badge tone="on-dark" dot>
              Idle hardware, becoming infrastructure
            </Badge>
            <h1 className="mt-6 max-w-xl font-(family-name:--font-display) text-4xl font-semibold leading-[1.05] tracking-tight text-(--color-canvas-text) sm:text-5xl lg:text-6xl">
              The world&apos;s idle devices are a computer no one has turned on yet.
            </h1>
            <p className="mt-6 max-w-lg text-lg text-(--color-canvas-text-muted)">
              Omnira turns unused laptops, desktops, servers, and phones into a decentralized
              global computing network — so owners earn from hardware they already have, and
              builders deploy without a data center contract.
            </p>
            <div className="mt-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Button href="/contribute" variant="on-dark" size="lg">
                Start contributing
              </Button>
              <Button href="/deploy" variant="outline-on-dark" size="lg">
                Deploy your app
              </Button>
            </div>
            {!reduceMotion ? (
              <p className="mt-8 hidden items-center gap-2 font-mono text-xs text-(--color-canvas-text-muted) lg:flex">
                <motion.span
                  animate={{ y: [0, 4, 0] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                >
                  ↓
                </motion.span>
                Keep scrolling
              </p>
            ) : null}
          </motion.div>

          <div className="relative hidden items-center justify-center lg:flex lg:h-full">
            <Chip3D progress={smoothProgress} className="w-full max-w-md" />
          </div>
        </div>
      </div>
    </section>
  );
}
