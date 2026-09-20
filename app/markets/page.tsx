import { PageHero } from "@/components/layout/PageHero";
import { MarketTerminal } from "@/components/markets/MarketTerminal";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { TickerTape } from "@/components/sections/TickerTape";
import { DemoBadge, SectionHeading } from "@/components/ui/Primitives";
import { Reveal } from "@/components/ui/Reveal";
import { instruments, marketCategories } from "@/content/markets";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Markets",
  description: "DFXSIGNALL market coverage across forex, metals, indices, crypto and energy, with an interactive charting preview running on demo data.",
  path: "/markets",
});

export default function MarketsPage() {
  return (
    <>
      <PageHero
        eyebrow="Markets"
        title="Market intelligence across five asset classes."
        lead="Forex, metals, indices, digital assets and energy — presented with structure, trend and momentum in view."
      >
        <DemoBadge label="Charts on this page use simulated demo data" />
      </PageHero>
      <TickerTape />
      <section className="section-y">
        <div className="container-x">
          <Reveal amount={0.05}>
            <MarketTerminal />
          </Reveal>
        </div>
      </section>

      <section className="section-y pt-0">
        <div className="container-x">
          <SectionHeading eyebrow="Coverage" title="Instruments on the current coverage list." lead="The list is configurable and may change as the platform launches." />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {marketCategories.map((cat, i) => (
              <Reveal key={cat} delay={i * 0.06}>
                <div className="panel h-full p-5">
                  <p className="t-eyebrow text-[0.62rem]">{cat}</p>
                  <ul className="mt-4 space-y-3">
                    {instruments
                      .filter((x) => x.category === cat)
                      .map((x) => (
                        <li key={x.symbol}>
                          <p className="t-num text-sm">{x.symbol}</p>
                          <p className="text-xs text-[var(--color-dim)]">{x.name}</p>
                        </li>
                      ))}
                  </ul>
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
