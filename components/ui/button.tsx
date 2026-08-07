import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "on-dark" | "outline-on-dark";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-(--radius-md) font-medium transition-[color,background-color,border-color,transform,box-shadow] duration-200 ease-out disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97]";

const variants: Record<Variant, string> = {
  primary: "bg-(--color-ink-900) text-(--color-paper-white) hover:bg-(--color-ink-700)",
  secondary:
    "bg-(--color-surface-raised) text-(--color-text) border border-(--color-border) hover:border-(--color-ink-400)",
  ghost: "text-(--color-text) hover:bg-(--color-surface-sunken)",
  danger: "bg-(--color-danger) text-(--color-paper-white) hover:opacity-90",
  "on-dark": "bg-(--color-signal-500) text-(--color-ink-950) hover:bg-(--color-lime-300)",
  "outline-on-dark":
    "border border-(--color-canvas-border) bg-transparent text-(--color-canvas-text) hover:border-(--color-canvas-text-muted)",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

interface StyleProps {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
}

type ButtonAsButton = StyleProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & { href?: undefined };

type ButtonAsLink = StyleProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children"> & { href: string };

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const classes = cn(
    base,
    variants[props.variant ?? "primary"],
    sizes[props.size ?? "md"],
    props.className,
  );

  if (isLink(props)) {
    return (
      <Link
        href={props.href}
        target={props.target}
        rel={props.rel}
        className={classes}
        onClick={props.onClick}
      >
        {props.children}
      </Link>
    );
  }

  return (
    <button
      type={props.type ?? "button"}
      onClick={props.onClick}
      disabled={props.disabled}
      className={classes}
      aria-label={props["aria-label"]}
    >
      {props.children}
    </button>
  );
}

function isLink(props: ButtonAsButton | ButtonAsLink): props is ButtonAsLink {
  return typeof props.href === "string";
}
