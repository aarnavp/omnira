"use client";

import { Reveal } from "@/components/ui/reveal";
import { NumberedSteps } from "./numbered-steps";

const CONTRIBUTE_STEPS = [
  {
    step: "01",
    title: "Connect a device",
    body: "Laptop, desktop, server, or phone — install Omnira and it joins the network in minutes.",
  },
  {
    step: "02",
    title: "Set your limits",
    body: "Choose how much capacity to lend and when. Pause instantly, anytime, with no penalty.",
  },
  {
    step: "03",
    title: "Get paid for idle time",
    body: "Earn based on what your hardware actually contributes, tracked and paid out on a schedule.",
  },
];

const DEPLOY_STEPS = [
  {
    step: "01",
    title: "Point Omnira at your app",
    body: "Connect a repo or push an image — a website, an API, or a model artifact.",
  },
  {
    step: "02",
    title: "Pick where it runs",
    body: "Spread across regions automatically, or pin it to the hardware that suits your workload.",
  },
  {
    step: "03",
    title: "Serve traffic globally",
    body: "Requests route to the nearest live device. No data center contract, no idle capacity you paid for.",
  },
];

export function StepsSection() {
  return (
    <section className="border-t border-(--color-border) bg-(--color-surface-sunken)">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="font-(family-name:--font-display) text-3xl font-semibold text-(--color-text)">
            Two sides, one network
          </h2>
        </Reveal>
        <div className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-2">
          <NumberedSteps heading="Contributing a device" steps={CONTRIBUTE_STEPS} />
          <NumberedSteps heading="Deploying onto the network" steps={DEPLOY_STEPS} />
        </div>
      </div>
    </section>
  );
}
