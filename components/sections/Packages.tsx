import { Check } from "lucide-react";
import Link from "next/link";
import { TiltCard } from "@/components/ui/Interactive";
import { SectionHeading } from "@/components/ui/Primitives";
import { Reveal } from "@/components/ui/Reveal";
import { sortedPackages, type SignalPackage } from "@/content/packages";
import { cn } from "@/lib/utils";

export function PackageCard({ p }: { p: SignalPackage }) {
  return (
    <TiltCard max={5} className={cn("panel flex h-full flex-col p-7", p.featured && "border-[var(--color-cyan)]/35 bg-[linear-gradient(180deg,rgb(20_40_80/0.6),rgb(5_9_18/0.95))]")}>
      {p.featured && (
        <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-[var(--color-cyan)] to-transparent" aria-hidden />
      )}
      <div className="flex items-center justify-between">
        <p className={cn("t-eyebrow text-[0.62rem]", p.featured ? "text-[var(--color-green)]" : "text-[var(--color-muted)]")}>{p.tier}</p>
      </div>
      <h3 className="mt-5 font-[family-name:var(--font-display)] text-2xl tracking-tight">{p.name}</h3>
      <p className="t-body mt-2 text-sm">{p.description}</p>

      <p className="mt-7 flex items-baseline gap-2">
        <span className="t-num text-5xl text-white">${p.price}</span>
        <span className="text-sm text-[var(--color-muted)]">/ {p.duration}</span>
      </p>
      <p className="mt-1 text-[0.68rem] text-[var(--color-dim)]">{p.price === 0 ? "Free access" : p.duration === "one-time" ? "One-time payment" : "Billed monthly · manual crypto review"}</p>

      <div className="my-6 grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-lg border border-[var(--line)] bg-white/[0.02] p-2.5">
          <p className="text-[var(--color-dim)]">Signal access</p>
          <p className="mt-0.5 text-[var(--color-fg-soft)]">{p.signalAccess}</p>
        </div>
        <div className="rounded-lg border border-[var(--line)] bg-white/[0.02] p-2.5">
          <p className="text-[var(--color-dim)]">Market access</p>
          <p className="mt-0.5 text-[var(--color-fg-soft)]">{p.marketAccess}</p>
        </div>
      </div>

      <ul className="flex flex-1 flex-col gap-3">
        {p.features.map((f) => (
          <li key={f} className="flex items-start gap-3 text-sm text-[var(--color-fg-soft)]">
            <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-[var(--color-green)]/15 text-[var(--color-green)]">
              <Check size={10} strokeWidth={3} />
            </span>
            {f}
          </li>
        ))}
      </ul>

      <Link href={p.price === 0 ? "/register" : `/payment?plan=${p.id}`} className={cn("btn mt-8 w-full text-center", p.featured ? "btn-primary" : "btn-ghost")}>
        {p.price === 0 ? "Create free account" : "Choose package"}
      </Link>
    </TiltCard>
  );
}

export function Packages({ showHeading = true }: { showHeading?: boolean }) {
  return (
    <section className="section-y relative" aria-labelledby="packages">
      <div className="pointer-events-none absolute inset-x-0 top-1/3 mx-auto h-[30rem] max-w-5xl rounded-full bg-[radial-gradient(closest-side,rgb(43_107_255/0.12),transparent)]" aria-hidden />
      <div className="container-x relative">
        {showHeading && (
          <SectionHeading
            align="center"
            eyebrow="Packages"
            title="Signal packages, built for different goals."
            lead="Choose a USD plan. Paid access is activated only after manual verification of your crypto transfer."
          />
        )}
        <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {sortedPackages.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.1}>
              <PackageCard p={p} />
            </Reveal>
          ))}
        </div>
        <p className="mx-auto mt-8 max-w-2xl text-center text-xs leading-relaxed text-[var(--color-dim)]">
          Packages provide access to market information, signals and tools. They are not a promise of profit, and all trading decisions and
          their outcomes remain your own.
        </p>
      </div>
    </section>
  );
}
