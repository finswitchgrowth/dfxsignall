import { instruments, marketCategories, timeframes } from "./markets";

/**
 * DFXSIGNALL — central site configuration.
 * Edit this file to change brand copy, navigation, contact channels and metrics.
 * (An admin panel is planned; until it launches, this file is the source of truth.)
 */

export const site = {
  name: "DFXSIGNALL",
  tagline: "Trade Smarter Together",
  concept: "Intelligence in Motion",
  pillars: ["Signals", "Analysis", "Education", "Growth"] as const,
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://dfxsignall.cv",
  description:
    "DFXSIGNALL is a trading intelligence ecosystem — structured market signals, analysis, education and tools designed to help traders see more and decide with discipline.",
  keywords: [
    "DFXSIGNALL",
    "trading signals",
    "forex signals",
    "market intelligence",
    "trading analysis",
    "crypto market analysis",
    "gold XAU/USD analysis",
    "trading education",
  ],
  contact: {
    email: "dfxsignall@gmail.com",
  },
  /** Account-management enquiries are available; trading execution remains disabled. */
  platformStatus: "account-management-enquiries" as const,
};

export type NavItem = { label: string; href: string };

export const primaryNav: NavItem[] = [
  { label: "Account Management", href: "/account-management" },
  { label: "Platform", href: "/platform" },
  { label: "Signals", href: "/signals" },
  { label: "Markets", href: "/markets" },
  { label: "Trading Tools", href: "/trading-tools" },
  { label: "Packages", href: "/packages" },
  { label: "Security", href: "/security" },
  { label: "Insights", href: "/blog" },
];

export const footerNav: { title: string; links: NavItem[] }[] = [
  {
    title: "Ecosystem",
    links: [
      { label: "Platform", href: "/platform" },
      { label: "Signals", href: "/signals" },
      { label: "Markets", href: "/markets" },
      { label: "Packages", href: "/packages" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "How it works", href: "/how-it-works" },
      { label: "Security", href: "/security" },
      { label: "Insights", href: "/blog" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Help & Legal",
    links: [
      { label: "Support", href: "/support" },
      { label: "FAQ", href: "/faq" },
      { label: "Terms", href: "/terms" },
      { label: "Privacy", href: "/privacy" },
      { label: "Risk disclosure", href: "/risk-disclosure" },
    ],
  },
];

/**
 * Homepage metrics.
 * `value: null` renders "At launch" — never replace with invented numbers.
 * Only publish operating figures (signals delivered, users, uptime) once they are measured and verifiable.
 */
export type Metric = {
  label: string;
  value: number | null;
  suffix?: string;
  prefix?: string;
  note: string;
};

export const metricsAreSample = true;

export const metrics: Metric[] = [
  { label: "Markets monitored", value: marketCategories.length, note: marketCategories.join(" · ") },
  { label: "Supported instruments", value: instruments.length, note: "Current coverage list (configurable)" },
  { label: "Chart timeframes", value: timeframes.length, note: timeframes.join(" · ") },
  { label: "Signals delivered", value: null, note: "Published once the platform is live" },
  { label: "Active users", value: null, note: "Published once the platform is live" },
];
