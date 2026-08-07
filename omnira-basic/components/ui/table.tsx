import type { HTMLAttributes, ReactNode, TableHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export function Table({ className, ...props }: TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="overflow-x-auto">
      <table className={cn("w-full min-w-[560px] border-collapse text-sm", className)} {...props} />
    </div>
  );
}

export function Thead({ children }: { children: ReactNode }) {
  return (
    <thead className="border-b border-(--color-border)">
      <tr>{children}</tr>
    </thead>
  );
}

export function Th({ className, ...props }: HTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      scope="col"
      className={cn(
        "px-4 py-3 text-left font-mono text-xs font-medium uppercase tracking-wider text-(--color-text-faint)",
        className,
      )}
      {...props}
    />
  );
}

export function Tbody({ children }: { children: ReactNode }) {
  return <tbody className="divide-y divide-(--color-border)">{children}</tbody>;
}

export function Td({ className, ...props }: HTMLAttributes<HTMLTableCellElement>) {
  return <td className={cn("px-4 py-3 align-middle text-(--color-text)", className)} {...props} />;
}
