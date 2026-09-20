import { MarketTerminal } from "@/components/markets/MarketTerminal";
import { ButtonLink } from "@/components/ui/Interactive";
import { SectionHeading } from "@/components/ui/Primitives";
import { Reveal } from "@/components/ui/Reveal";

export function MarketIntelligence() {
  return (
    <section className="section-y relative" aria-labelledby="mi">
      <div className="container-x">
        <SectionHeading
          eyebrow="Market intelligence"
          title="See the market like a professional desk."
          lead="Switch categories, instruments and timeframes. Explore how DFXSIGNALL presents structure, trend and momentum — here running on simulated demo data."
          aside={
            <ButtonLink href="/markets" variant="ghost" size="sm">
              Open markets page
            </ButtonLink>
          }
        />
        <Reveal className="mt-14" amount={0.1}>
          <MarketTerminal compact />
        </Reveal>
      </div>
    </section>
  );
}
