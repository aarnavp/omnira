import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import { Accordion } from "@/components/ui/accordion";
import { FeatureGrid } from "@/components/marketing/feature-grid";
import { NumberedSteps } from "@/components/marketing/numbered-steps";
import { AnimatedHeroText } from "@/components/marketing/animated-hero-text";

export const metadata: Metadata = {
  title: "Contribute your hardware",
  description:
    "Turn spare CPU, GPU, and bandwidth into income. Connect a device, set your limits, and get paid for capacity you were never using.",
};

const DEVICE_KINDS = [
  {
    title: "Laptops & desktops",
    body: "CPU and GPU cycles you're not using while you sleep, work, or step away.",
  },
  {
    title: "Servers & home labs",
    body: "Rack space and always-on uptime become the network's most dependable capacity.",
  },
  {
    title: "Phones & tablets",
    body: "Short bursts of spare compute while charging, contributing without draining your battery.",
  },
];

const CONTROLS = [
  {
    title: "You set the ceiling",
    body: "Cap contribution at a fixed percentage of CPU, GPU, memory, and bandwidth. Omnira never goes above it.",
  },
  {
    title: "Pause anytime, instantly",
    body: "One switch, no cooldown, no penalty. Gaming, rendering, or just want quiet — your call, every time.",
  },
  {
    title: "Choose your workloads",
    body: "Opt in or out of general third-party workloads independently from your own deployments.",
  },
  {
    title: "Schedule quiet hours",
    body: "Automatically go idle during hours you define — no need to remember to pause manually.",
  },
];

const STEPS = [
  {
    step: "01",
    title: "Install and connect",
    body: "Download Omnira for your platform. It detects your hardware and shows what it could realistically contribute before you commit to anything.",
  },
  {
    step: "02",
    title: "Set your limits",
    body: "Pick a contribution ceiling per resource, decide which workload types you'll accept, and set quiet hours if you want them.",
  },
  {
    step: "03",
    title: "The network routes work to you",
    body: "When there's demand nearby and your device is idle within your limits, it picks up requests — website traffic, API calls, model inference.",
  },
  {
    step: "04",
    title: "Earnings accrue and pay out",
    body: "Track earnings live on your dashboard, broken down by device. Payouts run on a fixed schedule to the method you choose.",
  },
];

const FAQ = [
  {
    q: "What actually runs on my device?",
    a: "Sandboxed compute jobs from the Deploy side of the network — web requests, API calls, and model inference. Nothing runs outside the resource ceiling you set, and nothing gets access to your files.",
  },
  {
    q: "How is what I earn calculated?",
    a: "Based on the capacity you actually contribute — utilization and requests served — tracked per device and visible on your dashboard in real time.",
  },
  {
    q: "Will it slow my device down?",
    a: "Only if you let it. Your contribution limit is a hard ceiling, and pausing takes effect immediately, so your own work always comes first.",
  },
  {
    q: "What hardware qualifies?",
    a: "Most laptops, desktops, servers, and phones from the last several years. During onboarding, Omnira checks your device and tells you what it can realistically contribute.",
  },
];

export default function ContributePage() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />

      <section className="border-b border-(--color-border) bg-(--color-surface)">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <AnimatedHeroText>
            <Badge tone="positive" dot className="mx-auto">
              For device owners
            </Badge>
            <h1 className="mt-6 font-(family-name:--font-display) text-4xl font-semibold tracking-tight text-(--color-text) sm:text-5xl">
              Your hardware works while you don&apos;t.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-(--color-text-muted)">
              Connect a device, set a limit, and start earning from capacity that was sitting idle
              anyway. No lock-in, no long-term contract — just an off switch you control.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button href="/signup" size="lg">
                Connect your first device
              </Button>
              <Button href="/network" variant="secondary" size="lg">
                See what the network pays
              </Button>
            </div>
          </AnimatedHeroText>
        </div>
      </section>

      {/* What contributes */}
      <section className="border-b border-(--color-border) bg-(--color-surface-sunken)">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="font-(family-name:--font-display) text-2xl font-semibold text-(--color-text)">
              Every kind of device earns
            </h2>
            <p className="mt-2 max-w-2xl text-(--color-text-muted)">
              No data center required — the network is built from hardware people already own.
            </p>
          </Reveal>
          <div className="mt-10">
            <FeatureGrid items={DEVICE_KINDS} columns={3} />
          </div>
        </div>
      </section>

      {/* How earning works — a real sequence */}
      <section className="border-b border-(--color-border) bg-(--color-surface)">
        <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="font-(family-name:--font-display) text-2xl font-semibold text-(--color-text)">
              How earning works
            </h2>
          </Reveal>
          <div className="mt-10">
            <NumberedSteps steps={STEPS} />
          </div>
        </div>
      </section>

      {/* Controls & privacy */}
      <section className="border-b border-(--color-border) bg-(--color-surface-sunken)">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="font-(family-name:--font-display) text-2xl font-semibold text-(--color-text)">
              You control the hardware, always
            </h2>
            <p className="mt-2 max-w-2xl text-(--color-text-muted)">
              Empowerment isn&apos;t a slogan here — it&apos;s the design constraint. The off switch is
              never more than one tap away.
            </p>
          </Reveal>
          <div className="mt-10">
            <FeatureGrid items={CONTROLS} columns={2} card={false} />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-(--color-surface)">
        <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="font-(family-name:--font-display) text-2xl font-semibold text-(--color-text)">
              Questions device owners ask
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-8">
              <Accordion items={FAQ} />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-(--color-canvas)">
        <div className="mx-auto flex max-w-4xl flex-col items-start gap-6 px-4 py-20 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="font-(family-name:--font-display) text-3xl font-semibold text-(--color-canvas-text) sm:text-4xl">
              Your first device can be earning today.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button href="/signup" variant="on-dark" size="lg">
                Create your account
              </Button>
              <Button href="/deploy" variant="outline-on-dark" size="lg">
                Curious about deploying instead?
              </Button>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <Link href="/network" className="text-sm text-(--color-canvas-text-muted) hover:text-(--color-canvas-text)">
              Or see the live network first →
            </Link>
          </Reveal>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
