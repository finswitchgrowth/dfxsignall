/**
 * DFXSIGNALL plan catalogue. Approved prices and deliverables are preserved.
 * Paid access is granted only after manual crypto payment review.
 * Auto Trading Tools is tools-only; live execution remains disabled.
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
    id: "starter",
    name: "DFX STARTER",
    tier: "Build a trading routine",
    description: "A practical starting point for building a consistent trading-learning routine.",
    price: 9,
    currency: "USD",
    duration: "month",
    features: [
      "Daily market briefs",
      "Forex learning library",
      "Basic journal templates",
    ],
    signalAccess: "Starter market briefs and learning",
    marketAccess: "Forex learning resources",
    status: "available",
    featured: false,
    order: 1,
  },
  {
    id: "pro",
    name: "DFX PRO",
    tier: "Most popular",
    description: "Expanded daily insights, research archives and workflow support for active users.",
    price: 25,
    currency: "USD",
    duration: "month",
    features: [
      "Up to 5 daily insights, subject to availability",
      "Expanded research and archives",
      "Advanced workflow and risk tools",
      "Priority product support",
    ],
    signalAccess: "Up to 5 daily insights, subject to availability",
    marketAccess: "Expanded research and archives",
    status: "available",
    featured: true,
    order: 2,
  },
  {
    id: "elite",
    name: "DFX ELITE",
    tier: "For serious individual users",
    description: "Deeper research and advanced review workflows for serious individual users.",
    price: 49,
    currency: "USD",
    duration: "month",
    features: [
      "All Pro features",
      "Deeper research briefings",
      "Advanced review templates",
      "Early access to eligible tools",
    ],
    signalAccess: "All Pro features",
    marketAccess: "Deeper research briefings",
    status: "available",
    featured: false,
    order: 3,
  },
  {
    id: "auto-trading-tools",
    name: "AUTO TRADING TOOLS",
    tier: "Tools only · live execution disabled",
    description: "Automation workspace and configuration support; live execution is disabled.",
    price: 199,
    currency: "USD",
    duration: "month",
    features: [
      "Automation workspace and configuration support",
      "Risk settings and execution logs where supported",
      "Compatible platform integration required",
      "No guaranteed execution outcomes or profits",
      "Tools only — live execution disabled",
    ],
    signalAccess: "Tools and configuration only",
    marketAccess: "Compatible platforms where supported",
    status: "available",
    featured: false,
    order: 4,
  },
  {
    id: "market-starter-pack",
    name: "MARKET STARTER PACK",
    tier: "One-time purchase",
    description: "Foundational market resources for planning, analysis and risk management.",
    price: 19,
    currency: "USD",
    duration: "one-time",
    features: [
      "Forex market basics",
      "Trading plan and journal templates",
      "Risk-management checklist",
    ],
    signalAccess: "Educational resources",
    marketAccess: "Forex market basics",
    status: "available",
    featured: false,
    order: 5,
  },
];

export const sortedPackages = [...packages].sort((a, b) => a.order - b.order);
