"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signup } from "@/lib/api/auth";
import { ApiError } from "@/types/api";
import { Field, TextInput } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function SignupForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setFormError(null);
    setFieldErrors({});
    try {
      await signup({ name, email, password });
      router.push("/dashboard");
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      {formError ? (
        <p role="alert" className="rounded-(--radius-md) bg-(--color-red-100) px-3 py-2 text-sm text-(--color-danger)">
          {formError}
        </p>
      ) : null}

      <Field label="Full name" error={fieldErrors.name}>
        {(id, describedBy) => (
          <TextInput
            id={id}
            type="text"
            autoComplete="name"
            required
            value={name}
            hasError={Boolean(fieldErrors.name)}
            aria-describedby={describedBy}
            onChange={(e) => setName(e.target.value)}
          />
        )}
      </Field>

      <Field label="Email" error={fieldErrors.email}>
        {(id, describedBy) => (
          <TextInput
            id={id}
            type="email"
            autoComplete="email"
            required
            value={email}
            hasError={Boolean(fieldErrors.email)}
            aria-describedby={describedBy}
            onChange={(e) => setEmail(e.target.value)}
          />
        )}
      </Field>

      <Field label="Password" hint="At least 8 characters." error={fieldErrors.password}>
        {(id, describedBy) => (
          <TextInput
            id={id}
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            hasError={Boolean(fieldErrors.password)}
            aria-describedby={describedBy}
            onChange={(e) => setPassword(e.target.value)}
          />
        )}
      </Field>

      <Button type="submit" disabled={isSubmitting} className="mt-2">
        {isSubmitting ? "Creating account…" : "Create account"}
      </Button>
    </form>
  );
}
