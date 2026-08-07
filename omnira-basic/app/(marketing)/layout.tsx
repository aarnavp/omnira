import type { ReactNode } from "react";
import { RouteTransition } from "@/components/system/route-transition";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return <RouteTransition>{children}</RouteTransition>;
}
