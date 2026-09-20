"use client";

import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import { AnimatePresence, motion, useInView} from "framer-motion";
import { BellRing, Cpu, Database, ShieldCheck, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { DemoBadge, RiskNote, SectionHeading } from "@/components/ui/Primitives";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

const stages = [
  { icon: Database, title: "Market data", text: "Price, volatility and calendar inputs are collected across covered instruments." },
  { icon: Cpu, title: "Analysis", text: "Structure, levels and conditions are assessed on the chosen timeframe." },
  { icon: ShieldCheck, title: "Risk check", text: "Every idea must define a stop loss and an acceptable reward-to-risk before release." },
  { icon: Send, title: "Signal published", text: "Entry, stop loss, targets, timeframe, confidence and rationale are packaged." },
  { icon: BellRing, title: "Alert delivered", text: "Subscribers are notified and can track the signal status until it closes." },
];

const statusFlow = ["Pending", "Active", "TP1 reached", "Closed"] as const;

function SignalCard({ stage }: { stage: number }) {
  const status = statusFlow[Math.min(Math.max(stage - 2, 0), statusFlow.length - 1)];
  const rows: [string, string, string?][] = [
    ["Entry", "111,420.00"],
    ["Stop loss", "109,880.00", "text-[var(--color-red)]"],
    ["Take profit 1", "113,100.00", "text-[var(--color-green)]"],
    ["Take profit 2", "114,600.00", "text-[var(--color-green)]"],
  ];
  return (
    <div className="relative">
      <div className="absolute -inset-6 rounded-[2rem] bg-[radial-gradient(closest-side,rgb(31_216_255/0.18),transparent)] blur-2xl" aria-hidden />
      <div className="glass relative overflow-hidden rounded-3xl">
        <div className="flex items-center justify-between border-b border-[var(--line)] px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--color-amber)]/12 text-lg text-[var(--color-amber)]">₿</span>
            <div>
              <p className="t-num text-lg font-semibold tracking-tight">BTC/USDT</p>
              <p className="text-xs text-[var(--color-dim)]">Crypto · Sample signal</p>
            </div>
          </div>
          <DemoBadge label="Example" />
        </div>

        <div className="grid grid-cols-2 gap-px bg-[var(--line)]">
          <div className="bg-[var(--color-ink-850)] px-6 py-5">
            <p className="text-xs text-[var(--color-dim)]">Direction</p>
            <p className="mt-1 font-[family-name:var(--font-display)] text-3xl text-[var(--color-green)]">BUY</p>
          </div>
          <div className="bg-[var(--color-ink-850)] px-6 py-5">
            <p className="text-xs text-[var(--color-dim)]">Status</p>
            <AnimatePresence mode="wait">
              <motion.p key={status} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="mt-2 flex items-center gap-2 text-lg">
                <span className={cn("h-2 w-2 rounded-full", status === "Pending" ? "bg-[var(--color-amber)]" : status === "Closed" ? "bg-[var(--color-dim)]" : "dot-live")} />
                {status}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        <dl className="divide-y divide-[var(--line)] px-6">
          {rows.map(([k, v, c]) => (
            <div key={k} className="flex items-center justify-between py-3.5">
              <dt className="text-sm text-[var(--color-muted)]">{k}</dt>
              <dd className={cn("t-num text-base", c)}>{v}</dd>
            </div>
          ))}
        </dl>

        <div className="grid grid-cols-3 gap-px border-t border-[var(--line)] bg-[var(--line)]">
          {[
            ["Timeframe", "4H"],
            ["R:R", "1 : 2.1"],
            ["Confidence", "68 / 100"],
          ].map(([k, v]) => (
            <div key={k} className="bg-[var(--color-ink-850)] px-4 py-4 sm:px-6">
              <p className="text-[0.68rem] text-[var(--color-dim)]">{k}</p>
              <p className="t-num mt-1 text-sm">{v}</p>
            </div>
          ))}
        </div>
        <div className="border-t border-[var(--line)] px-6 py-4">
          <p className="text-xs leading-relaxed text-[var(--color-muted)]">
            <span className="text-[var(--color-fg-soft)]">Rationale · </span>Higher-low structure holding above the prior range; invalidated below the
            stop level.
          </p>
        </div>
      </div>
    </div>
  );
}

export function SignalExperience() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.35 });
  const reduce = useReducedMotionSafe();
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (!inView || reduce) return;
    const id = setInterval(() => setStage((s) => (s + 1) % (stages.length + 1)), 1700);
    return () => clearInterval(id);
  }, [inView, reduce]);

  const active = Math.min(stage, stages.length - 1);

  return (
    <section className="section-y relative overflow-hidden" aria-labelledby="signal-exp">
      <div className="pointer-events-none absolute -left-40 bottom-0 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(closest-side,rgb(52_240_140/0.07),transparent)]" aria-hidden />
      <div className="container-x">
        <SectionHeading
          eyebrow="Signal experience"
          title="From raw market data to a signal you can evaluate."
          lead="Every DFXSIGNALL signal follows the same disciplined path — and always ships with its own invalidation level."
        />

        <div ref={ref} className="mt-16 grid items-center gap-12 lg:grid-cols-[1fr_1.05fr]">
          <ol className="relative flex flex-col gap-2">
            <div className="absolute bottom-6 left-[23px] top-6 w-px bg-[var(--line-strong)]" aria-hidden />
            <motion.div
              className="absolute left-[23px] top-6 w-px bg-gradient-to-b from-[var(--color-cyan)] to-[var(--color-green)]"
              animate={{ height: `calc(${(active / (stages.length - 1)) * 100}% - ${(active / (stages.length - 1)) * 48}px)` }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              aria-hidden
            />
            {stages.map((s, i) => {
              const on = i <= active;
              const current = i === active;
              return (
                <li key={s.title}>
                  <button
                    type="button"
                    onClick={() => setStage(i)}
                    className={cn("relative flex w-full gap-5 rounded-2xl p-3 text-left transition-colors", current && "bg-white/[0.03]")}
                    aria-current={current ? "step" : undefined}
                  >
                    <span
                      className={cn(
                        "relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-2xl border transition-all duration-500",
                        on ? "border-[var(--color-cyan)]/50 bg-[var(--color-ink-800)] text-[var(--color-cyan)] shadow-[0_0_30px_-8px_var(--color-cyan)]" : "border-[var(--line-strong)] bg-[var(--color-ink-900)] text-[var(--color-dim)]",
                      )}
                    >
                      <s.icon size={19} />
                    </span>
                    <span className="pt-1">
                      <span className={cn("block text-base font-medium transition-colors", on ? "text-white" : "text-[var(--color-muted)]")}>
                        <span className="t-num mr-2 text-xs text-[var(--color-dim)]">0{i + 1}</span>
                        {s.title}
                      </span>
                      <span className={cn("mt-1 block text-sm leading-relaxed transition-colors", current ? "text-[var(--color-muted)]" : "text-[var(--color-dim)]")}>{s.text}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          <Reveal>
            <SignalCard stage={stage} />
          </Reveal>
        </div>
        <RiskNote className="mt-10 max-w-3xl">
          Example shown for illustration only — not a live or historical signal. Signals are general information, not financial advice, and any
          trade can result in a loss. DFXSIGNALL does not guarantee returns.
        </RiskNote>
      </div>
    </section>
  );
}
