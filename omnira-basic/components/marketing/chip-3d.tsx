"use client";

import { motion, useReducedMotion, type MotionValue, useTransform } from "framer-motion";

const PIN_COUNT = 7;

function PinRow({ vertical = false }: { vertical?: boolean }) {
  return (
    <div className={vertical ? "flex flex-col justify-around gap-[6%]" : "flex justify-around gap-[6%]"}>
      {Array.from({ length: PIN_COUNT }).map((_, i) => (
        <span
          key={i}
          className={vertical ? "h-[10%] w-3 rounded-[1px]" : "h-3 w-[10%] rounded-[1px]"}
          style={{
            background:
              "linear-gradient(to bottom, var(--color-signal-400), var(--color-ink-700) 60%)",
          }}
        />
      ))}
    </div>
  );
}

/**
 * The hero's signature object: a CSS-3D chip package that rotates as the
 * page scrolls. `progress` is a 0-1 MotionValue driven by the parent's
 * scroll-linked useScroll — this component only maps that progress to
 * transforms, so the scroll mechanics live in one place (the hero section).
 */
export function Chip3D({ progress, className }: { progress: MotionValue<number>; className?: string }) {
  const reduceMotion = useReducedMotion();

  const rotateY = useTransform(progress, [0, 1], [-24, 300]);
  const rotateX = useTransform(progress, [0, 0.5, 1], [12, -6, 8]);
  const scale = useTransform(progress, [0, 0.15, 0.85, 1], [0.86, 1, 1, 0.92]);
  const glow = useTransform(progress, [0, 0.5, 1], [0.5, 1, 0.6]);

  if (reduceMotion) {
    return (
      <div className={className} style={{ perspective: 1200 }}>
        <ChipBody rotateX={0} rotateY={-18} glowOpacity={0.7} />
      </div>
    );
  }

  return (
    <div className={className} style={{ perspective: 1200 }}>
      <motion.div style={{ rotateX, rotateY, scale, transformStyle: "preserve-3d" }}>
        <ChipBodyAnimated glowOpacity={glow} />
      </motion.div>
    </div>
  );
}

function ChipBodyAnimated({ glowOpacity }: { glowOpacity: MotionValue<number> }) {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[340px]" style={{ transformStyle: "preserve-3d" }}>
      <motion.div
        aria-hidden
        className="absolute -inset-10 rounded-full blur-3xl"
        style={{
          background: "radial-gradient(circle, var(--color-signal-500), transparent 70%)",
          opacity: glowOpacity,
          transform: "translateZ(-80px)",
        }}
      />
      <ChipLayers />
    </div>
  );
}

function ChipBody({ rotateX, rotateY, glowOpacity }: { rotateX: number; rotateY: number; glowOpacity: number }) {
  return (
    <div
      className="relative mx-auto aspect-square w-full max-w-[340px]"
      style={{ transformStyle: "preserve-3d", transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)` }}
    >
      <div
        aria-hidden
        className="absolute -inset-10 rounded-full blur-3xl"
        style={{
          background: "radial-gradient(circle, var(--color-signal-500), transparent 70%)",
          opacity: glowOpacity,
          transform: "translateZ(-80px)",
        }}
      />
      <ChipLayers />
    </div>
  );
}

function ChipLayers() {
  return (
    <>
      {/* Pins — top & bottom */}
      <div className="absolute inset-x-[14%] -top-4" style={{ transform: "translateZ(2px)" }}>
        <PinRow />
      </div>
      <div className="absolute inset-x-[14%] -bottom-4" style={{ transform: "translateZ(2px)" }}>
        <PinRow />
      </div>
      {/* Pins — left & right */}
      <div className="absolute inset-y-[14%] -left-4 h-[72%]" style={{ transform: "translateZ(2px)" }}>
        <PinRow vertical />
      </div>
      <div className="absolute inset-y-[14%] -right-4 h-[72%]" style={{ transform: "translateZ(2px)" }}>
        <PinRow vertical />
      </div>

      {/* Substrate */}
      <div
        className="absolute inset-0 rounded-2xl border border-(--color-canvas-border)"
        style={{
          transform: "translateZ(0px)",
          background: "linear-gradient(155deg, var(--color-ink-800), var(--color-ink-950) 70%)",
          boxShadow: "0 40px 80px -30px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}
      />

      {/* Die surface, raised */}
      <div
        className="absolute inset-[14%] overflow-hidden rounded-lg border border-(--color-signal-500)/20"
        style={{
          transform: "translateZ(22px)",
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 11%, color-mix(in srgb, var(--color-signal-500) 10%, transparent) 11.5%), repeating-linear-gradient(90deg, transparent, transparent 11%, color-mix(in srgb, var(--color-signal-500) 10%, transparent) 11.5%), radial-gradient(circle at 50% 50%, var(--color-ink-800), var(--color-ink-950))",
        }}
      >
        <div
          className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background: "var(--color-signal-400)",
            boxShadow: "0 0 18px 4px var(--color-signal-500)",
          }}
        />
      </div>
    </>
  );
}
