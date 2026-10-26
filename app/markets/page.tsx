import { PageHero } from "@/components/layout/PageHero";
import { MarketTerminal } from "@/components/markets/MarketTerminal";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { TickerTape } from "@/components/sections/TickerTape";
import { SectionHeading } from "@/components/ui/Primitives";
import { Reveal } from "@/components/ui/Reveal";
import { instruments, marketCategories } from "@/content/markets";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Live Markets",
  description: "Explore TradingView market charts across forex, metals, indices, crypto and energy. Quote availability and delays vary by symbol and exchange.",
  path: "/markets",
});

export default function MarketsPage() {
  return (
    <>
      <PageHero eyebrow="Live markets" title="Market charts, connected to TradingView." lead="Explore market structure across forex, metals, indices, digital assets and energy using embedded TradingView charts." >
        <p className="mt-3 text-sm text-[var(--color-muted)]">Quotes may be delayed or unavailable for some symbols depending on exchange permissions. DFXSIGNALL does not execute trades.</p>
      </PageHero>
      <TickerTape />
      <section className="section-y">
        <div className="container-x"><Reveal amount={0.05}><MarketTerminal /></Reveal></div>
      </section>
      <section className="section-y pt-0">
        <div className="container-x">
          <SectionHeading eyebrow="Coverage" title="Instruments on the current coverage list." lead="Choose a symbol in the chart selector to inspect the market on TradingView." />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {marketCategories.map((cat, i) => (
              <Reveal key={cat} delay={i * 0.06}>
                <div className="panel h-full p-5">
                  <p className="t-eyebrow text-[0.62rem]">{cat}</p>
                  <ul className="mt-4 space-y-3">{instruments.filter((x) => x.category === cat).map((x) => <li key={x.symbol}><p className="t-num text-sm">{x.symbol}</p><p className="text-xs text-[var(--color-dim)]">{x.name}</p></li>)}</ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <FinalCTA />
    </>
  );
}
