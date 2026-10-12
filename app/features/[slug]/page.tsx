import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Bell, BrainCircuit, CandlestickChart, Gauge, Newspaper, Radar } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { RiskNote } from "@/components/ui/Primitives";
import { ButtonLink } from "@/components/ui/Interactive";
import { buildMetadata } from "@/lib/seo";

const features = {
  signals: {
    title: "Signals",
    eyebrow: "Trade ideas, clearly structured",
    description: "A complete signal format explains the instrument, direction, entry zone, stop loss, take-profit levels, timeframe, confidence, rationale and status. Confidence is a setup-quality rating, not a probability of profit.",
    status: "Illustrative examples only",
    statusDetail: "The sample BTC setup on this site is not a live or historical recommendation. A verified automated signal-generation and publishing feed is not connected yet.",
    bullets: ["Entry and invalidation levels are shown together", "Timeframe, rationale and status are part of the signal format", "No guaranteed returns and no automatic order execution"],
    href: "/signals",
    action: "View signal format",
    icon: Radar,
  },
  charts: {
    title: "Charts",
    eyebrow: "Market charts from TradingView",
    description: "Explore covered forex, metals, indices, crypto and energy instruments with selectable timeframes. Charts are embedded from TradingView; symbol coverage, exchange permissions and data delays vary.",
    status: "Available on Markets",
    statusDetail: "The chart view is live-connected to TradingView embeds. It is a market-information view, not a brokerage account or order-entry terminal.",
    bullets: ["Switch instruments and chart timeframes", "Use the full chart link for more TradingView tools", "No broker connection or trade execution is implied"],
    href: "/markets",
    action: "Open live market charts",
    icon: CandlestickChart,
  },
  alerts: {
    title: "Alerts",
    eyebrow: "Know what needs attention",
    description: "The intended alert experience covers newly published signals, entry-zone touches, stop or target status changes, watchlist levels and account updates, with a mobile-friendly notification feed.",
    status: "Planned — not yet verified live",
    statusDetail: "The cards illustrate alert categories. Do not treat the sample messages as current market events; end-to-end push/email alert delivery still needs production validation.",
    bullets: ["Signal publication and status-change notifications", "Watchlist level and volatility alerts", "Notification preferences and delivery status"],
    href: "/register",
    action: "Create an account",
    icon: Bell,
  },
  analytics: {
    title: "Analytics",
    eyebrow: "Measure what can be verified",
    description: "The intended analytics layer will report signal history, outcome distribution, drawdown and performance using timestamped, auditable records rather than promotional estimates.",
    status: "Verified performance feed not connected",
    statusDetail: "No unverified win rate, return, user count or track record is claimed here. The available trading tool is a position-sizing calculator, not a performance report.",
    bullets: ["Signal history and status audit trail", "Outcome and risk metrics from recorded data", "Risk/reward and position-size calculations"],
    href: "/trading-tools",
    action: "Open risk calculator",
    icon: Gauge,
  },
  "market-intelligence": {
    title: "Market intelligence",
    eyebrow: "Put price action in context",
    description: "A market workspace for comparing covered instruments, observing chart structure and following key levels across forex, metals, indices, crypto and energy.",
    status: "Charts available; analysis feed is limited",
    statusDetail: "TradingView charts are available now. This does not mean DFXSIGNALL has a verified AI analyst, sentiment engine or real-time signal engine running in the background.",
    bullets: ["Explore market charts and timeframes", "Compare instruments by asset category", "Use independent analysis and manage risk carefully"],
    href: "/markets",
    action: "Explore markets",
    icon: BrainCircuit,
  },
  "trading-information": {
    title: "Trading information",
    eyebrow: "Learn the context behind the move",
    description: "The information layer is designed to explain market terminology, risk management, macroeconomic events and how traders can assess a setup without confusing commentary with a guaranteed forecast.",
    status: "Education and articles",
    statusDetail: "Published material is informational and educational. Always check current event times and source data independently before making a trading decision.",
    bullets: ["Educational articles and explainers", "Economic-event awareness and market context", "Risk management, position sizing and trading discipline"],
    href: "/blog",
    action: "Read insights",
    icon: Newspaper,
  },
} as const;

type FeatureSlug = keyof typeof features;

export function generateStaticParams() {
  return Object.keys(features).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!(slug in features)) return {};
  const feature = features[slug as FeatureSlug];
  return buildMetadata({
    title: feature.title,
    description: feature.description,
    path: `/features/${slug}`,
  });
}

export default async function FeatureDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!(slug in features)) notFound();
  const feature = features[slug as FeatureSlug];
  const Icon = feature.icon;

  return (
    <>
      <PageHero eyebrow={feature.eyebrow} title={feature.title} lead={feature.description}>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href={feature.href}>{feature.action} <ArrowUpRight size={16} /></ButtonLink>
          <ButtonLink href="/platform" variant="ghost"><ArrowLeft size={16} /> Back to platform</ButtonLink>
        </div>
      </PageHero>
      <section className="section-y pt-0">
        <div className="container-x">
          <div className="panel mx-auto max-w-4xl p-6 sm:p-9">
            <div className="flex items-start gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-[var(--line-strong)] bg-white/[0.03] text-[var(--color-cyan)]">
                <Icon size={22} />
              </span>
              <div>
                <p className="text-sm font-semibold text-[var(--color-fg)]">{feature.status}</p>
                <p className="t-body mt-2 text-sm">{feature.statusDetail}</p>
              </div>
            </div>
            <h2 className="t-h3 mt-8">What this feature is built for</h2>
            <ul className="mt-4 grid gap-3">
              {feature.bullets.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-[var(--color-muted)]">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-green)]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-4 border-t border-[var(--line)] pt-6 text-sm">
              <Link href="/markets" className="link-u text-[var(--color-cyan)]">Markets</Link>
              <Link href="/signals" className="link-u text-[var(--color-cyan)]">Signal format</Link>
              <Link href="/trading-tools" className="link-u text-[var(--color-cyan)]">Trading tools</Link>
              <Link href="/risk-disclosure" className="link-u text-[var(--color-cyan)]">Risk disclosure</Link>
            </div>
          </div>
          <RiskNote className="mx-auto mt-8 max-w-4xl">
            Trading involves substantial risk, including loss of capital. This feature description is not financial advice. DFXSIGNALL does not guarantee outcomes.
          </RiskNote>
        </div>
      </section>
    </>
  );
}
