import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal, RevealWords } from "./Reveal";

export function DemoBadge({ label = "Demo mode", className }: { label?: string; className?: string }) {
  return (
    <span className={cn("chip chip-demo", className)} title="Simulated data for demonstration — not live market data">
      <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-amber)]" aria-hidden />
      {label}
    </span>
  );
}

export function ComingSoonBadge({ className }: { className?: string }) {
  return (
    <span className={cn("chip", className)}>
      <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-cyan)]" aria-hidden />
      Coming soon
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
  className,
  aside,
}: {
  eyebrow: string;
  title: string;
  lead?: ReactNode;
  align?: "left" | "center";
  className?: string;
  aside?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6",
        align === "center" ? "items-center text-center" : "md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className={cn("max-w-3xl", align === "center" && "mx-auto")}>
        <Reveal>
          <p className="t-eyebrow mb-5 flex items-center gap-3">
            <span className="inline-block h-px w-8 bg-gradient-to-r from-transparent to-[var(--color-cyan)]" aria-hidden />
            {eyebrow}
          </p>
        </Reveal>
        <h2 className="t-h2">
          <RevealWords text={title} />
        </h2>
        {lead && (
          <Reveal delay={0.15}>
            <p className={cn("t-lead mt-6", align === "center" ? "mx-auto max-w-2xl" : "max-w-2xl")}>{lead}</p>
          </Reveal>
        )}
      </div>
      {aside && <Reveal delay={0.2}>{aside}</Reveal>}
    </div>
  );
}

export function RiskNote({ children, className }: { children?: ReactNode; className?: string }) {
  return (
    <p className={cn("text-xs leading-relaxed text-[var(--color-dim)]", className)}>
      {children ??
        "Trading involves substantial risk, including the possible loss of all capital. Signals and analysis are general information and education — not financial advice and not a guarantee of any outcome."}
    </p>
  );
}
