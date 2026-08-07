import { redirect } from "next/navigation";
import { getSession } from "@/lib/api/auth";
import { ApiError } from "@/types/api";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export default async function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  let session;
  try {
    session = await getSession();
  } catch (err) {
    if (err instanceof ApiError && err.code === "unauthorized") {
      redirect("/login");
    }
    throw err;
  }

  return <DashboardShell user={session.user}>{children}</DashboardShell>;
}
