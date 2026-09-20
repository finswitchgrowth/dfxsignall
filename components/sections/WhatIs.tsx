import { BookOpen, LineChart, Radar, TrendingUp } from "lucide-react";
import { LazyEcosystemCanvas } from "@/components/3d/LazyScenes";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { SpotlightCard } from "@/components/ui/Interactive";
import { SectionHeading } from "@/components/ui/Primitives";
import { Reveal } from "@/components/ui/Reveal";

const pillars = [
  { icon: Radar, title: "Signals", text: "Structured trade ideas with entry, stop loss, targets, timeframe and rationale — built to be evaluated, not blindly followed." },
  { icon: LineChart, title: "Analysis", text: "Market context behind every idea: structure, volatility, key levels and the events that move price." },
  { icon: BookOpen, title: "Education", text: "Practical learning on risk, position sizing and market structure, so decisions improve over time." },
  { icon: TrendingUp, title: "Growth", text: "Tools and habits for disciplined, long-term development as a trader — not shortcuts or promises." },
];

export function WhatIs() {
  return (
    <section className="section-y relative overflow-hidden" aria-labelledby="whatis">
      <div className="pointer-events-none absolute right-0 top-20 h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(closest-side,rgb(31_216_255/0.08),transparent)]" aria-hidden />
      <div className="container-x">
        <SectionHeading
          eyebrow="What is DFXSIGNALL?"
          title="One ecosystem connecting signals, insight and skill."
          lead="DFXSIGNALL brings the pieces a disciplined trader needs into one place — so information arrives structured, explained and ready to evaluate against your own plan."
        />

        <div className="mt-16 grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
          <Reveal className="relative">
            <div className="panel relative aspect-[5/4] overflow-hidden">
              <div className="grid-bg absolute inset-0 opacity-50" aria-hidden />
              <LazyEcosystemCanvas />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgb(3_6_13/0.75))]" aria-hidden />
              <div className="absolute left-5 top-5 flex items-center gap-3">
                <BrandLogo variant="mark" width={38} />
                <span className="t-eyebrow text-[0.6rem] text-[var(--color-fg-soft)]">Ecosystem map</span>
              </div>
              <div className="t-eyebrow pointer-events-none absolute inset-0 text-[0.58rem] text-[var(--color-fg-soft)] max-sm:hidden" aria-hidden>
                <span className="absolute left-[12%] top-[22%]">Signals</span>
                <span className="absolute right-[12%] top-[24%]">Analysis</span>
                <span className="absolute bottom-[20%] left-[13%]">Education</span>
                <span className="absolute bottom-[19%] right-[14%]">Growth</span>
              </div>
            </div>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2">
            {pillars.map((p, i) => (
              <Reveal key={p.title} delay={0.08 * i}>
                <SpotlightCard as="article" className="panel h-full p-6">
                  <div className="mb-5 grid h-11 w-11 place-items-center rounded-xl border border-[var(--line-strong)] bg-gradient-to-br from-[var(--color-blue)]/20 to-[var(--color-green)]/10 text-[var(--color-cyan)]">
                    <p.icon size={20} />
                  </div>
                  <h3 className="t-h3">{p.title}</h3>
                  <p className="t-body mt-2 text-sm">{p.text}</p>
                </SpotlightCard>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
