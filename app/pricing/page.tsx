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
  description: "DFXSIGNALL plans: Starter, Pro, Elite, Auto Trading Tools and Market Starter Pack.",
  path: "/pricing",
});

const rows: { group: string; items: { label: string; values: (boolean | string)[] }[] }[] = [
  { group: "Signals & information", items: [
    { label: "Signal access", values: sortedPackages.map((p) => p.signalAccess) },
    { label: "Entry / stop loss / take profit when supplied", values: [false, true, true, false, false] },
    { label: "Risk notes and signal status", values: [true, true, true, false, false] },
    { label: "Signal history and updates", values: [false, true, true, false, false] },
  ]},
  { group: "Markets & tools", items: [
    { label: "Market access", values: sortedPackages.map((p) => p.marketAccess) },
    { label: "Market learning resources", values: [true, true, true, true, true] },
    { label: "Tools-only access", values: [false, false, false, true, false] },
    { label: "One-time pack", values: [false, false, false, false, true] },
  ]},
  { group: "Access & billing", items: [
    { label: "Billing", values: ["Monthly", "Monthly", "Monthly", "Monthly", "One-time"] },
    { label: "Live trade execution", values: [false, false, false, false, false] },
    { label: "Manual payment review before paid access", values: [true, true, true, true, true] },
  ]},
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
        title="Your plan. Your market toolkit."
        lead="Plan names and prices match the current DFXSIGNALL payment options. Paid access is enabled only after an administrator reviews and approves the payment proof."
      />
      <Packages showHeading={false} />
      <section className="section-y pt-0">
        <div className="container-x">
          <SectionHeading eyebrow="Compare" title="Side-by-side comparison." />
          <Reveal className="mt-12" amount={0.05}>
            <div className="panel overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <caption className="sr-only">DFXSIGNALL package feature comparison</caption>
                <thead>
                  <tr className="border-b border-[var(--line)]">
                    <th scope="col" className="p-5 font-normal text-[var(--color-muted)]">Feature</th>
                    {sortedPackages.map((p) => (
                      <th key={p.id} scope="col" className={cn("p-5 text-center", p.featured && "bg-[var(--color-cyan)]/[0.05]")}>
                        <span className="block font-[family-name:var(--font-display)] text-base tracking-tight">{p.name}</span>
                        <span className="t-num mt-1 block text-xs text-[var(--color-muted)]">
                          ${p.price}{p.duration === "one-time" ? " one-time" : " / month"}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((g) => (
                    <Fragment key={g.group}>
                      <tr><th colSpan={sortedPackages.length + 1} scope="colgroup" className="t-eyebrow bg-white/[0.02] px-5 py-3 text-[0.62rem] text-[var(--color-dim)]">{g.group}</th></tr>
                      {g.items.map((r) => (
                        <tr key={r.label} className="border-t border-[var(--line)]">
                          <th scope="row" className="p-5 font-normal text-[var(--color-fg-soft)]">{r.label}</th>
                          {sortedPackages.map((p, i) => (
                            <td key={p.id} className={cn("p-5 text-center", p.featured && "bg-[var(--color-cyan)]/[0.05]")}><Cell v={r.values[i] ?? false} /></td>
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
            DFXSIGNALL provides informational market signals and tools, not guaranteed results. AUTO TRADING TOOLS does not execute live trades. Verify every transaction and assess risk independently.
          </p>
        </div>
      </section>
      <FinalCTA />
    </>
  );
}
