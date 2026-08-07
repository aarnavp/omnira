"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createDeployment } from "@/lib/api/deployments";
import { ApiError } from "@/types/api";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardBody } from "@/components/ui/card";
import { Field, TextInput } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import type { DeploymentTarget } from "@/types/deployment";

const TARGETS: { value: DeploymentTarget; label: string; body: string }[] = [
  { value: "web", label: "Web app", body: "A static site or server-rendered frontend." },
  { value: "api", label: "API", body: "A stateless backend service." },
  { value: "model", label: "AI model", body: "An inference workload." },
];

const REGIONS = [
  { value: "us-east", label: "US East" },
  { value: "eu-west", label: "EU West" },
  { value: "ap-southeast", label: "Asia Pacific" },
  { value: "sa-east", label: "South America" },
];

export default function NewDeploymentPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [target, setTarget] = useState<DeploymentTarget>("web");
  const [sourceRepo, setSourceRepo] = useState("");
  const [regions, setRegions] = useState<string[]>(["us-east"]);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function toggleRegion(value: string) {
    setRegions((prev) => (prev.includes(value) ? prev.filter((r) => r !== value) : [...prev, value]));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setFormError(null);
    setFieldErrors({});
    try {
      const deployment = await createDeployment({
        name,
        target,
        sourceRepo,
        preferredRegions: regions.length > 0 ? regions : ["us-east"],
      });
      router.push(`/dashboard/deployments/${deployment.id}`);
    } catch (err) {
      if (err instanceof ApiError) {
        setFieldErrors(err.fieldErrors ?? {});
        setFormError(err.fieldErrors ? null : err.message);
      } else {
        setFormError("Something went wrong. Try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Reveal>
      <Link
        href="/dashboard/deployments"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-(--color-text-muted) hover:text-(--color-text)"
      >
        ← All deployments
      </Link>
      <PageHeader title="New deployment" description="Ship a website, API, or model onto the network." />

      <Card className="max-w-2xl">
        <CardBody className="pt-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
            {formError ? (
              <p role="alert" className="rounded-(--radius-md) bg-(--color-red-100) px-3 py-2 text-sm text-(--color-danger)">
                {formError}
              </p>
            ) : null}

            <Field label="Deployment name" error={fieldErrors.name} hint="Lowercase letters, numbers, and hyphens.">
              {(id, describedBy) => (
                <TextInput
                  id={id}
                  required
                  placeholder="marketing-site"
                  value={name}
                  hasError={Boolean(fieldErrors.name)}
                  aria-describedby={describedBy}
                  onChange={(e) => setName(e.target.value)}
                />
              )}
            </Field>

            <fieldset>
              <legend className="text-sm font-medium text-(--color-text)">What are you deploying?</legend>
              <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {TARGETS.map((option) => (
                  <label
                    key={option.value}
                    className={`cursor-pointer rounded-(--radius-md) border p-3 text-sm transition-colors ${
                      target === option.value
                        ? "border-(--color-ink-900) bg-(--color-surface-sunken)"
                        : "border-(--color-border) hover:border-(--color-ink-400)"
                    }`}
                  >
                    <input
                      type="radio"
                      name="target"
                      value={option.value}
                      checked={target === option.value}
                      onChange={() => setTarget(option.value)}
                      className="sr-only"
                    />
                    <span className="font-medium text-(--color-text)">{option.label}</span>
                    <span className="mt-1 block text-xs text-(--color-text-muted)">{option.body}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <Field label="Source repository" error={fieldErrors.sourceRepo} hint="Optional — you can also push an image later.">
              {(id, describedBy) => (
                <TextInput
                  id={id}
                  placeholder="github.com/you/project"
                  value={sourceRepo}
                  hasError={Boolean(fieldErrors.sourceRepo)}
                  aria-describedby={describedBy}
                  onChange={(e) => setSourceRepo(e.target.value)}
                />
              )}
            </Field>

            <fieldset>
              <legend className="text-sm font-medium text-(--color-text)">Preferred regions</legend>
              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {REGIONS.map((region) => (
                  <label
                    key={region.value}
                    className="flex items-center gap-2 rounded-(--radius-md) border border-(--color-border) px-3 py-2 text-sm has-checked:border-(--color-ink-900) has-checked:bg-(--color-surface-sunken)"
                  >
                    <input
                      type="checkbox"
                      checked={regions.includes(region.value)}
                      onChange={() => toggleRegion(region.value)}
                      className="h-4 w-4 accent-(--color-signal-600)"
                    />
                    {region.label}
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="flex gap-3">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Deploying…" : "Deploy"}
              </Button>
              <Button href="/dashboard/deployments" variant="secondary">
                Cancel
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </Reveal>
  );
}
