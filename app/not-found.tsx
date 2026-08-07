import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <section className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
        <p className="font-mono text-sm text-(--color-text-faint)">404</p>
        <h1 className="mt-3 font-(family-name:--font-display) text-3xl font-semibold text-(--color-text)">
          This page went idle.
        </h1>
        <p className="mt-2 max-w-md text-(--color-text-muted)">
          Nothing lives at this address. It may have moved, or the link might be off.
        </p>
        <div className="mt-8 flex gap-3">
          <Button href="/">Back to home</Button>
          <Button href="/network" variant="secondary">
            See the live network
          </Button>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
