import type { Metadata } from "next";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { NetworkLiveStrip } from "@/components/marketing/network-live-strip";
import { AnimatedHeroText } from "@/components/marketing/animated-hero-text";

export const metadata: Metadata = {
  title: "Network status",
  description: "Live devices, requests served, and earnings across the Omnira network.",
};

export default function NetworkPage() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <section className="flex-1 bg-(--color-surface-sunken)">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
          <AnimatedHeroText>
            <p className="font-mono text-xs uppercase tracking-wider text-(--color-text-faint)">
              Transparency
            </p>
            <h1 className="mt-2 font-(family-name:--font-display) text-3xl font-semibold text-(--color-text) sm:text-4xl">
              The network, as it runs right now
            </h1>
            <p className="mt-3 max-w-2xl text-(--color-text-muted)">
              Every figure below comes from the same devices you can connect from the Contribute
              side, and the same infrastructure the Deploy side ships onto. Nothing here is a demo
              environment.
            </p>
          </AnimatedHeroText>
          <div className="mt-10">
            <NetworkLiveStrip variant="full" />
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
