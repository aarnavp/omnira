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
import { RoutingDiagram } from "@/components/marketing/routing-diagram";

export const metadata: Metadata = {
  title: "Deploy onto the network",
  description:
    "Ship websites, APIs, and AI models onto Omnira's distributed device network instead of a traditional cloud — global by default, priced by what you use.",
};

const TARGETS = [
  {
    title: "Web apps",
    body: "Static and server-rendered apps, served from whichever device sits closest to the request.",
  },
  {
    title: "APIs",
    body: "Stateless services that scale across thousands of small nodes, not a handful of large ones.",
  },
  {
    title: "AI models",
    body: "Inference distributed across contributed CPUs and GPUs, routed to hardware that fits.",
  },
];

const WHY = [
  {
    title: "No idle capacity you paid for",
    body: "Priced by what actually ran, not capacity reserved and left unused.",
  },
  {
    title: "Global by default",
    body: "Devices are already everywhere your users are.",
  },
  {
    title: "Resilient by construction",
    body: "Losing one device loses one node. Traffic reroutes automatically.",
  },
];

const STEPS = [
  {
    step: "01",
    title: "Connect your source",
    body: "Point Omnira at a repo, or push a container image directly — a website, an API, or a packaged model.",
  },
  {
    step: "02",
    title: "Choose your footprint",
    body: "Spread automatically across regions for reach, or pin specific regions where your users actually are.",
  },
  {
    step: "03",
    title: "Go live and watch it route",
    body: "Requests land on the nearest healthy device. Metrics, logs, and cost show up as traffic arrives.",
  },
];

const FAQ = [
  {
    q: "How does pricing compare to a traditional cloud?",
    a: "You pay for requests actually served and capacity actually used, not reserved instances sitting idle. Full pricing detail is available once you connect a project.",
  },
  {
    q: "What happens if a device drops offline mid-request?",
    a: "In-flight requests fail over to the next nearest healthy device. Your deployment's uptime is a network property, not a single-device one.",
  },
  {
    q: "Can I control where my workload runs?",
    a: "Yes — pin a deployment to specific regions, or let Omnira route automatically to the lowest-latency device for each request.",
  },
  {
    q: "Is this suitable for production traffic?",
    a: "Omnira is in limited pilot today. Everything you build works end-to-end; consult the dashboard for the current state of paid, production-grade service.",
  },
];

export default function DeployPage() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />

      {/* Hero: centered text, then the routing diagram beneath — a vertical
          flow (words, then system) rather than Contribute's side-by-side. */}
      <section className="bg-(--color-surface)">
        <div className="mx-auto max-w-4xl px-4 pt-20 text-center sm:px-6 lg:px-8">
          <AnimatedHeroText>
            <Badge tone="accent" dot>
              For builders
            </Badge>
            <h1 className="mt-6 font-(family-name:--font-display) text-4xl font-semibold tracking-tight text-(--color-text) sm:text-5xl">
              Ship it onto a network, not a warehouse.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-(--color-text-muted)">
              Deploy websites, APIs, and models onto thousands of distributed devices — global
              reach without a regional rollout plan.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button href="/signup" size="lg">
                Deploy your first project
              </Button>
              <Button href="/network" variant="secondary" size="lg">
                See the network&apos;s reach
              </Button>
            </div>
          </AnimatedHeroText>
        </div>
        <Reveal delay={0.15}>
          <div className="mx-auto mt-4 w-full max-w-xs sm:max-w-sm">
            <RoutingDiagram className="w-full" />
          </div>
        </Reveal>
      </section>

      {/* Targets */}
      <section className="bg-(--color-surface-sunken)">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="font-(family-name:--font-display) text-2xl font-semibold text-(--color-text)">
              What runs on Omnira
            </h2>
          </Reveal>
          <div className="mt-8">
            <FeatureGrid items={TARGETS} columns={3} />
          </div>
        </div>
      </section>

      {/* How deploying works — a real sequence */}
      <section className="bg-(--color-surface)">
        <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="font-(family-name:--font-display) text-2xl font-semibold text-(--color-text)">
              From repo to running, in three steps
            </h2>
          </Reveal>
          <div className="mt-10">
            <NumberedSteps steps={STEPS} />
          </div>
        </div>
      </section>

      {/* Why */}
      <section className="bg-(--color-surface-sunken)">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="font-(family-name:--font-display) text-2xl font-semibold text-(--color-text)">
              Why builders move workloads here
            </h2>
          </Reveal>
          <div className="mt-8">
            <FeatureGrid items={WHY} columns={3} />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-(--color-surface)">
        <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="font-(family-name:--font-display) text-2xl font-semibold text-(--color-text)">
              Questions builders ask
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
              Your infrastructure doesn&apos;t need a data center.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button href="/signup" variant="on-dark" size="lg">
                Create your account
              </Button>
              <Button href="/contribute" variant="outline-on-dark" size="lg">
                Curious about contributing instead?
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
