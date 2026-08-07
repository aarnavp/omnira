"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Icon } from "./icon";

export interface AccordionEntry {
  q: string;
  a: string;
}

/** A single-open FAQ accordion. Framer Motion animates height to `auto`
 * directly — no manual measuring — and rotates the chevron in sync. */
export function Accordion({ items }: { items: AccordionEntry[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <dl className="flex flex-col divide-y divide-(--color-border)">
      {items.map((item, index) => {
        const open = openIndex === index;
        return (
          <div key={item.q} className="py-2">
            <dt>
              <button
                type="button"
                onClick={() => setOpenIndex(open ? null : index)}
                aria-expanded={open}
                className="flex w-full items-center justify-between gap-4 py-3 text-left"
              >
                <span className="font-medium text-(--color-text)">{item.q}</span>
                <motion.span
                  animate={{ rotate: open ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="shrink-0 text-(--color-text-faint)"
                >
                  <Icon name="chevron-down" size={16} />
                </motion.span>
              </button>
            </dt>
            <AnimatePresence initial={false}>
              {open ? (
                <motion.dd
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <p className="pb-4 text-sm text-(--color-text-muted)">{item.a}</p>
                </motion.dd>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </dl>
  );
}
