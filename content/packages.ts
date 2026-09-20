/**
 * Signal packages. Editable here until the admin panel launches.
 * Prices are indicative and confirmed at launch. Packages are informational — no checkout on this site.
 */
export type PackageStatus = "coming-soon" | "available" | "paused";

export type SignalPackage = {
  id: string;
  name: string;
  tier: string;
  description: string;
  price: number;
  currency: "USD";
  duration: string;
  features: string[];
  signalAccess: string;
  marketAccess: string;
  status: PackageStatus;
  featured: boolean;
  order: number;
};

export const packages: SignalPackage[] = [
  {
    id: "start",
    name: "DFX START",
    tier: "Discovery",
    description: "A disciplined introduction to the DFXSIGNALL ecosystem.",
    price: 0,
    currency: "USD",
    duration: "month",
    features: ["Selected market insights", "Basic alerts", "Educational content", "Community updates"],
    signalAccess: "Selected signals",
    marketAccess: "Majors watchlist",
    status: "coming-soon",
    featured: false,
    order: 1,
  },
  {
    id: "pro",
    name: "DFX PRO",
    tier: "Most popular",
    description: "Precision signals for traders who want a clean decision layer.",
    price: 39,
    currency: "USD",
    duration: "month",
    features: [
      "Real-time entry / SL / TP",
      "Risk rating + rationale",
      "Signal history & analytics",
      "Telegram / app alert-ready",
    ],
    signalAccess: "Full signal feed",
    marketAccess: "Forex, metals, crypto",
    status: "coming-soon",
    featured: true,
    order: 2,
  },
  {
    id: "elite",
    name: "DFX ELITE",
    tier: "Advanced",
    description: "Higher-touch intelligence for serious market participants.",
    price: 99,
    currency: "USD",
    duration: "month",
    features: [
      "Everything in PRO",
      "Advanced market commentary",
      "Portfolio risk dashboard",
      "Priority support",
    ],
    signalAccess: "Full feed + commentary",
    marketAccess: "All covered markets",
    status: "coming-soon",
    featured: false,
    order: 3,
  },
];

export const sortedPackages = [...packages].sort((a, b) => a.order - b.order);
