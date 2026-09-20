"use client";

import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { Bell, CandlestickChart, LayoutDashboard, Package, Radar, Settings, Wallet } from "lucide-react";
import { useRef } from "react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { ComingSoonBadge, SectionHeading } from "@/components/ui/Primitives";
import { cn } from "@/lib/utils";

const nav = [
  { icon: LayoutDashboard, label: "Overview", on: true },
  { icon: Radar, label: "Signals" },
  { icon: CandlestickChart, label: "Markets" },
  { icon: Wallet, label: "Wallet" },
  { icon: Package, label: "Packages" },
  { icon: Bell, label: "Notifications" },
  { icon: Settings, label: "Security" },
];

const signals = [
  { s: "XAU/USD", d: "BUY", tf: "1H", st: "Active" },
  { s: "EUR/USD", d: "SELL", tf: "4H", st: "Pending" },
  { s: "BTC/USDT", d: "BUY", tf: "4H", st: "TP1 reached" },
  { s: "US500", d: "SELL", tf: "15m", st: "Closed" },
];

function Spark() {
  const pts = [22, 30, 26, 38, 34, 46, 40, 52, 49, 60, 56, 70];
  const d = pts.map((p, i) => `${i ? "L" : "M"}${(i / (pts.length - 1)) * 300},${80 - p}`).join("");
  return (
    <svg viewBox="0 0 300 80" className="h-full w-full" preserveAspectRatio="none" aria-hidden>
      <defs>
        <linearGradient id="pp-a" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#1fd8ff" stopOpacity=".35" />
          <stop offset="1" stopColor="#1fd8ff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${d}L300,80L0,80Z`} fill="url(#pp-a)" />
      <path d={d} fill="none" stroke="#1fd8ff" strokeWidth="2" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export function PlatformPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotionSafe();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const p = useSpring(scrollYProgress, { stiffness: 80, damping: 22 });
  const rotateX = useTransform(p, [0, 1], [reduce ? 0 : 28, 0]);
  const scale = useTransform(p, [0, 1], [reduce ? 1 : 0.88, 1]);
  const y = useTransform(p, [0, 1], [reduce ? 0 : 80, 0]);

  return (
    <section className="section-y relative overflow-hidden" aria-labelledby="pp">
      <div className="container-x">
        <SectionHeading
          align="center"
          eyebrow="Platform preview"
          title="A trading workspace built for clarity."
          lead="A first look at the DFXSIGNALL client platform. The interface below is a design preview with sample content — the platform is launching soon."
        />
      </div>

      <div ref={ref} className="container-x mt-16" style={{ perspective: 1600 }}>
        <motion.div style={{ rotateX, scale, y, transformOrigin: "50% 0%" }} className="relative">
          <div className="absolute -inset-x-10 -top-10 bottom-0 rounded-[3rem] bg-[radial-gradient(ellipse_at_top,rgb(43_107_255/0.25),transparent_60%)] blur-2xl" aria-hidden />
          <div className="relative overflow-hidden rounded-[1.6rem] border border-[var(--line-strong)] bg-[var(--color-ink-950)] shadow-[0_60px_140px_-40px_rgb(0_0_0/1)]" role="img" aria-label="Preview of the DFXSIGNALL client dashboard with sample data">
            {/* window chrome */}
            <div className="flex items-center justify-between border-b border-[var(--line)] bg-[var(--color-ink-900)] px-4 py-3">
              <div className="flex gap-1.5" aria-hidden>
                <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
              </div>
              <span className="t-num hidden rounded-full border border-[var(--line)] px-4 py-1 text-[0.66rem] text-[var(--color-dim)] sm:block">app.dfxsignall · preview</span>
              <ComingSoonBadge />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[210px_1fr]">
              <aside className="hidden flex-col gap-1 border-r border-[var(--line)] bg-[var(--color-ink-900)]/60 p-4 md:flex" aria-hidden>
                <div className="mb-5 flex items-center gap-2 px-2">
                  <BrandLogo variant="mark" width={32} />
                  <BrandLogo variant="wordmark" width={98} />
                </div>
                {nav.map((n) => (
                  <div key={n.label} className={cn("flex items-center gap-3 rounded-lg px-3 py-2 text-xs", n.on ? "bg-white/[0.06] text-white" : "text-[var(--color-muted)]")}>
                    <n.icon size={14} className={n.on ? "text-[var(--color-cyan)]" : ""} /> {n.label}
                  </div>
                ))}
              </aside>

              <div className="p-4 sm:p-6" aria-hidden>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-[0.7rem] text-[var(--color-dim)]">Account overview</p>
                    <p className="text-lg font-medium">Welcome back</p>
                  </div>
                  <span className="chip chip-demo">Sample data</span>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
                  {[
                    { k: "Account status", v: "Verified", tone: "text-[var(--color-green)]" },
                    { k: "Active package", v: "DFX PRO" },
                    { k: "Wallet balance", v: "$ 0.00" },
                    { k: "Signals today", v: "4" },
                  ].map((c) => (
                    <div key={c.k} className="rounded-xl border border-[var(--line)] bg-[var(--color-ink-850)] p-3.5">
                      <p className="text-[0.66rem] text-[var(--color-dim)]">{c.k}</p>
                      <p className={cn("t-num mt-1.5 text-base sm:text-lg", c.tone)}>{c.v}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-3 grid gap-3 lg:grid-cols-[1.5fr_1fr]">
                  <div className="rounded-xl border border-[var(--line)] bg-[var(--color-ink-850)] p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-[var(--color-muted)]">Signals</p>
                      <p className="text-[0.66rem] text-[var(--color-dim)]">Asset · Direction · TF · Status</p>
                    </div>
                    <div className="mt-3 divide-y divide-[var(--line)]">
                      {signals.map((s) => (
                        <div key={s.s} className="flex items-center justify-between py-2.5 text-xs">
                          <span className="t-num w-20">{s.s}</span>
                          <span className={cn("t-num w-12 font-semibold", s.d === "BUY" ? "text-[var(--color-green)]" : "text-[var(--color-red)]")}>{s.d}</span>
                          <span className="t-num w-10 text-[var(--color-muted)]">{s.tf}</span>
                          <span className="w-24 text-right text-[var(--color-fg-soft)]">{s.st}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="rounded-xl border border-[var(--line)] bg-[var(--color-ink-850)] p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-[var(--color-muted)]">Markets · XAU/USD</p>
                        <p className="t-num text-[0.7rem] text-[var(--color-green)]">+0.74%</p>
                      </div>
                      <div className="mt-2 h-20">
                        <Spark />
                      </div>
                    </div>
                    <div className="rounded-xl border border-[var(--line)] bg-[var(--color-ink-850)] p-4">
                      <p className="text-xs text-[var(--color-muted)]">Notifications</p>
                      <div className="mt-2 space-y-2">
                        {["New signal: XAU/USD BUY", "EUR/USD reached entry zone"].map((n) => (
                          <p key={n} className="flex items-center gap-2 text-[0.7rem] text-[var(--color-fg-soft)]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-cyan)]" /> {n}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 rounded-b-[1.6rem] bg-gradient-to-t from-[var(--color-ink-900)] to-transparent" aria-hidden />
        </motion.div>
      </div>
    </section>
  );
}
