import { Bell, CandlestickChart, FileText, LayoutDashboard, LifeBuoy, Package, Radar, ShieldCheck, UserRound, Users, Wallet } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { PlatformPreview } from "@/components/sections/PlatformPreview";
import { TradingIntelligence } from "@/components/sections/TradingIntelligence";
import { ButtonLink, SpotlightCard } from "@/components/ui/Interactive";
import { ComingSoonBadge, SectionHeading } from "@/components/ui/Primitives";
import { Reveal } from "@/components/ui/Reveal";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Platform",
  description: "A first look at the DFXSIGNALL client platform: dashboard, signals, markets, packages, alerts and account security. Launching soon.",
  path: "/platform",
});

const modules = [
  { icon: LayoutDashboard, title: "Dashboard", text: "Account status, active package, signals and notifications at a glance." },
  { icon: Radar, title: "Signals", text: "Asset, direction, entry, stop loss, take profit, timeframe, confidence and status." },
  { icon: CandlestickChart, title: "Markets", text: "Premium charting with watchlists, categories and key indicators." },
  { icon: Package, title: "Packages", text: "Compare, subscribe and manage your DFXSIGNALL package." },
  { icon: Wallet, title: "Wallet & payments", text: "Clear records of subscriptions, payments and transactions — all calculated server-side." },
  { icon: Bell, title: "Notifications", text: "Signal alerts, status changes and account updates in one feed." },
  { icon: Users, title: "Referrals", text: "Share DFXSIGNALL and track referrals transparently." },
  { icon: FileText, title: "Documents", text: "Account documents and statements, stored securely." },
  { icon: LifeBuoy, title: "Support", text: "Raise and track support requests with the DFXSIGNALL team." },
  { icon: UserRound, title: "Profile", text: "Manage personal details and communication preferences." },
  { icon: ShieldCheck, title: "Security", text: "Password management, sessions and two-factor authentication." },
];

export default function PlatformPage() {
  return (
    <>
      <PageHero
        eyebrow="Platform"
        title="Your trading intelligence workspace."
        lead="One authenticated home for signals, markets, packages and account tools — designed with the clarity of a professional terminal. Launching soon."
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/register">Join at launch</ButtonLink>
          <ButtonLink href="/signals" variant="ghost">
            How signals work
          </ButtonLink>
        </div>
      </PageHero>
      <PlatformPreview />
      <section className="section-y pt-0">
        <div className="container-x">
          <SectionHeading eyebrow="Modules" title="Everything inside the client platform." aside={<ComingSoonBadge />} />
          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {modules.map((m, i) => (
              <Reveal key={m.title} delay={(i % 4) * 0.06}>
                <SpotlightCard className="panel h-full p-6">
                  <m.icon size={20} className="text-[var(--color-cyan)]" />
                  <h3 className="mt-5 text-base font-medium">{m.title}</h3>
                  <p className="t-body mt-1.5 text-sm">{m.text}</p>
                </SpotlightCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <TradingIntelligence />
      <FinalCTA />
    </>
  );
}
