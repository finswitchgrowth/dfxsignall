import { Check, Minus } from "lucide-react";
import { Fragment } from "react";
import { PageHero } from "@/components/layout/PageHero";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Packages } from "@/components/sections/Packages";
import { SectionHeading } from "@/components/ui/Primitives";
import { Reveal } from "@/components/ui/Reveal";
import { sortedPackages } from "@/content/packages";
import { buildMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata = buildMetadata({
  title: "Pricing",
  description: "Indicative DFXSIGNALL package pricing and a side-by-side feature comparison. Pricing is confirmed at launch.",
  path: "/pricing",
});

const rows: { group: string; items: { label: string; values: (boolean | string)[] }[] }[] = [
  {
    group: "Signals",
    items: [
      { label: "Signal access", values: sortedPackages.map((p) => p.signalAccess) },
      { label: "Entry / stop loss / take profit", values: [false, true] },
      { label: "Risk rating + rationale", values: [false, true, true] },
      { label: "Signal history & analytics", values: [false, true, true] },
    ],
  },
  {
    group: "Markets & insight",
    items: [
      { label: "Market access", values: sortedPackages.map((p) => p.marketAccess) },
      { label: "Selected market insights", values: [true, true] },
      { label: "Advanced market commentary", values: [false, true] },
      { label: "Portfolio risk dashboard", values: [false, false, true] },
    ],
  },
  {
    group: "Alerts & support",
    items: [
      { label: "Alerts", values: ["Selected updates", "Expanded updates"] },
      { label: "Educational content", values: [true, true, true] },
      { label: "Priority support", values: [false, false, true] },
    ],
  },
];

function Cell({ v }: { v: boolean | string }) {
  if (v === true) return <Check size={16} className="mx-auto text-[var(--color-green)]" aria-label="Included" />;
  if (v === false) return <Minus size={16} className="mx-auto text-[var(--color-dim)]" aria-label="Not included" />;
  return <span className="text-xs text-[var(--color-fg-soft)]">{v}</span>;
}

export default function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title="Simple, transparent pricing."
        lead="Indicative monthly pricing for each package. Final pricing, billing options and taxes are confirmed at launch — there is no checkout on this website."
      />
      <Packages showHeading={false} />

      <section className="section-y pt-0">
        <div className="container-x">
          <SectionHeading eyebrow="Compare" title="Side-by-side comparison." />
          <Reveal className="mt-12" amount={0.05}>
            <div className="panel overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <caption className="sr-only">Package feature comparison</caption>
                <thead>
                  <tr className="border-b border-[var(--line)]">
                    <th scope="col" className="p-5 font-normal text-[var(--color-muted)]">
                      Feature
                    </th>
                    {sortedPackages.map((p) => (
                      <th key={p.id} scope="col" className={cn("p-5 text-center", p.featured && "bg-[var(--color-cyan)]/[0.05]")}>
                        <span className="block font-[family-name:var(--font-display)] text-base tracking-tight">{p.name}</span>
                        <span className="t-num mt-1 block text-xs text-[var(--color-muted)]">
                          ${p.price} / {p.duration}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((g) => (
                    <Fragment key={g.group}>
                      <tr>
                        <th colSpan={sortedPackages.length + 1} scope="colgroup" className="t-eyebrow bg-white/[0.02] px-5 py-3 text-[0.62rem] text-[var(--color-dim)]">
                          {g.group}
                        </th>
                      </tr>
                      {g.items.map((r) => (
                        <tr key={r.label} className="border-t border-[var(--line)]">
                          <th scope="row" className="p-5 font-normal text-[var(--color-fg-soft)]">
                            {r.label}
                          </th>
                          {r.values.map((v, i) => (
                            <td key={i} className={cn("p-5 text-center", sortedPackages[i].featured && "bg-[var(--color-cyan)]/[0.05]")}>
                              <Cell v={v} />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
          <p className="mt-6 max-w-3xl text-xs leading-relaxed text-[var(--color-dim)]">
            Prices shown in USD and are indicative until launch. A subscription gives access to information and tools; it does not guarantee any
            trading result.
          </p>
        </div>
      </section>
      <FinalCTA />
    </>
  );
}
