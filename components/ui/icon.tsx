import type { SVGAttributes } from "react";

export type IconName =
  | "grid"
  | "cpu"
  | "wallet"
  | "box"
  | "settings"
  | "menu"
  | "close"
  | "chevron-down"
  | "laptop"
  | "desktop"
  | "server"
  | "phone"
  | "pause"
  | "play"
  | "external-link"
  | "alert-circle"
  | "check-circle"
  | "arrow-up-right"
  | "logout"
  | "bell";

const PATHS: Record<IconName, string> = {
  grid: "M3 3h6v6H3V3Zm8 0h6v6h-6V3ZM3 11h6v6H3v-6Zm8 0h6v6h-6v-6Z",
  cpu: "M7 3v3M13 3v3M7 14v3M13 14v3M3 7h3M3 13h3M14 7h3M14 13h3M6 6h8v8H6V6Z",
  wallet: "M3 6a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h11a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1H5",
  box: "M10 2 3 5.5 10 9l7-3.5L10 2Zm-7 3.5v9L10 18l7-3.5v-9M10 9v9",
  settings:
    "M10 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm7-3a6.9 6.9 0 0 0-.15-1.44l1.62-1.26-1.5-2.6-1.9.77a7 7 0 0 0-2.5-1.44L12.2 2h-3l-.37 2.03a7 7 0 0 0-2.5 1.44l-1.9-.77-1.5 2.6L4.55 8.6A6.9 6.9 0 0 0 4.4 10c0 .49.05.97.15 1.44l-1.62 1.26 1.5 2.6 1.9-.77a7 7 0 0 0 2.5 1.44L9.2 18h3l.37-2.03a7 7 0 0 0 2.5-1.44l1.9.77 1.5-2.6-1.62-1.26c.1-.47.15-.95.15-1.44Z",
  menu: "M2.5 5h15M2.5 10h15M2.5 15h15",
  close: "M4 4l12 12M16 4L4 16",
  "chevron-down": "M5 7.5 10 12.5 15 7.5",
  laptop: "M4 4h12v8H4V4Zm-2 10h16l-1.5 2h-13L2 14Z",
  desktop: "M4 4h12v8H4V4Zm4 11h4M10 12v3",
  server: "M4 4h12v4H4V4Zm0 8h12v4H4v-4Zm2.5-6h.01M6.5 14h.01",
  phone: "M7 2h6a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Zm3 13h.01",
  pause: "M6 4h3v12H6V4Zm5 0h3v12h-3V4Z",
  play: "M6 4l10 6-10 6V4Z",
  "external-link": "M8 4H4v12h12v-4M11 3h6v6M9 11 17 3",
  "alert-circle": "M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm0 4v5m0 3h.01",
  "check-circle": "M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm-3.5 8 2.5 2.5 4.5-5",
  "arrow-up-right": "M6 14 14 6M8 6h6v6",
  logout: "M8 15H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h4M14 13l3-3-3-3M6 10h11",
  bell: "M5 8a5 5 0 0 1 10 0c0 3 1 4 1 4H4s1-1 1-4Zm3 7a2 2 0 0 0 4 0",
};

export function Icon({
  name,
  size = 18,
  ...props
}: { name: IconName; size?: number } & SVGAttributes<SVGSVGElement>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
