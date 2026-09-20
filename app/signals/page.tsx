import { PageHero } from "@/components/layout/PageHero";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { SignalExperience } from "@/components/sections/SignalExperience";
import { Accordion } from "@/components/ui/Accordion";
import { SpotlightCard } from "@/components/ui/Interactive";
import { RiskNote, SectionHeading } from "@/components/ui/Primitives";
import { Reveal } from "@/components/ui/Reveal";
import { faqs } from "@/content/faq";
import { buildMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata = buildMetadata({
  title: "Signals",
  description: "How DFXSIGNALL signals are structured: asset, direction, entry, stop loss, take profit, timeframe, confidence, rationale and status.",
  path: "/signals",
});

const anatomy = [
  ["Asset", "The instrument, e.g. XAU/USD or BTC/USDT."],
  ["Direction", "Buy or sell — the side of the idea."],
  ["Entry", "The price or zone where the idea becomes actionable."],
  ["Stop loss", "Where the idea is invalid. Always included."],
  ["Take profit", "One or more target levels."],
  ["Timeframe", "The chart horizon the analysis is built on."],
  ["Confidence", "A 0–100 rating of setup quality — not a probability of profit."],
  ["Rationale", "A short explanation of why the idea exists."],
  ["Timestamp", "When the signal was published."],
  ["Status", "Its live state from publication to close."],
];

const statuses = [
  { s: "Pending", c: "bg-[var(--color-amber)]", t: "Published; price has not reached the entry zone yet." },
  { s: "Active", c: "bg-[var(--color-green)]", t: "Entry reached; the idea is live." },
  { s: "TP reached", c: "bg-[var(--color-cyan)]", t: "A take-profit level has been hit." },
  { s: "SL reached", c: "bg-[var(--color-red)]", t: "The stop loss was hit; the idea is invalidated." },
  { s: "Closed", c: "bg-[var(--color-dim)]", t: "The signal has completed or been closed." },
  { s: "Cancelled", c: "bg-[var(--color-muted)]", t: "Withdrawn before activation, with a reason." },
];

export default function SignalsPage() {
  return (
    <>
      <PageHero
        eyebrow="Signals"
        title="Structured ideas. Defined risk. Clear status."
        lead="A DFXSIGNALL signal is a complete, evaluable trade idea — never just an arrow on a chart."
      />
      <SignalExperience />

      <section className="section-y pt-0">
        <div className="container-x grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Anatomy" title="Ten fields in every signal." />
            <Reveal delay={0.1}>
              <dl className="mt-10 divide-y divide-[var(--line)] border-y border-[var(--line)]">
                {anatomy.map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[130px_1fr] gap-4 py-4">
                    <dt className="t-num text-sm text-[var(--color-fg)]">{k}</dt>
                    <dd className="text-sm text-[var(--color-muted)]">{v}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
          <div>
            <SectionHeading eyebrow="Lifecycle" title="Every signal has a visible status." />
            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              {statuses.map((x, i) => (
                <Reveal key={x.s} delay={i * 0.05}>
                  <SpotlightCard className="panel h-full p-5">
                    <p className="flex items-center gap-2.5 text-sm font-medium">
                      <span className={cn("h-2 w-2 rounded-full", x.c)} /> {x.s}
                    </p>
                    <p className="t-body mt-2 text-sm">{x.t}</p>
                  </SpotlightCard>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-y pt-0">
        <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading eyebrow="Signals FAQ" title="Questions traders ask most." />
          <Reveal>
            <Accordion items={faqs.filter((f) => f.category === "Signals" || f.q.includes("financial advice"))} />
            <RiskNote className="mt-8" />
          </Reveal>
        </div>
      </section>
      <FinalCTA />
    </>
  );
}
