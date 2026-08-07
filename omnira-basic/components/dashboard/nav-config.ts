export interface NavItem {
  href: string;
  label: string;
  icon: "grid" | "cpu" | "wallet" | "box" | "settings";
}

export interface NavGroup {
  label: string | null;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    label: null,
    items: [{ href: "/dashboard", label: "Overview", icon: "grid" }],
  },
  {
    label: "Contribute",
    items: [
      { href: "/dashboard/devices", label: "Devices", icon: "cpu" },
      { href: "/dashboard/earnings", label: "Earnings", icon: "wallet" },
    ],
  },
  {
    label: "Deploy",
    items: [{ href: "/dashboard/deployments", label: "Deployments", icon: "box" }],
  },
  {
    label: "Account",
    items: [{ href: "/dashboard/settings", label: "Settings", icon: "settings" }],
  },
];
