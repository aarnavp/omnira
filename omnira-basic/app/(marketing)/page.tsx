import Link from "next/link";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { HeroPinned } from "@/components/marketing/hero-pinned";
import { NetworkLiveStrip } from "@/components/marketing/network-live-strip";
import { DoorsSection } from "@/components/marketing/doors-section";
import { StepsSection } from "@/components/marketing/steps-section";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader dark />

      <HeroPinned />

      <DoorsSection />

      {/* Live network strip: transparency as a landing-page feature. */}
      <section className="bg-(--color-surface)">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
          <Reveal>
            <NetworkLiveStrip variant="compact" />
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-4 text-center">
              <Link href="/network" className="text-sm font-medium text-(--color-accent) hover:underline">
                See the full network breakdown →
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <StepsSection />

      {/* Closing CTA */}
      <section className="bg-(--color-canvas)">
        <div className="mx-auto flex max-w-4xl flex-col items-start gap-6 px-4 py-20 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="font-(family-name:--font-display) text-3xl font-semibold text-(--color-canvas-text) sm:text-4xl">
              Pick your side of the network.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button href="/signup" variant="on-dark" size="lg">
                Create your account
              </Button>
              <Button href="/network" variant="outline-on-dark" size="lg">
                Watch the network live
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
