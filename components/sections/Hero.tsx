"use client";

import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import Link from "next/link";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { useRef, type MouseEvent } from "react";
import { LazyHeroCanvas } from "@/components/3d/LazyScenes";
import { ButtonLink } from "@/components/ui/Interactive";
import { site } from "@/content/site";

const ease = [0.16, 1, 0.3, 1] as const;

function SignalGlassCard() {
  return (
    <div className="glass w-[272px] rounded-2xl p-4 shadow-[0_30px_80px_-30px_rgb(0_0_0/0.9)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-[var(--color-amber)]/15 text-[0.62rem] font-bold text-[var(--color-amber)]">₿</span>
          <div>
            <p className="t-num text-sm font-semibold">BTC/USDT</p>
            <p className="text-[0.66rem] text-[var(--color-dim)]">4H · Illustrative example</p>
          </div>
        </div>
        <span className="rounded-md bg-[var(--color-green)]/12 px-2 py-1 text-[0.66rem] font-bold tracking-wider text-[var(--color-green)]">BUY</span>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 text-[0.66rem]">
        {[
          ["Entry", "111,420"],
          ["Stop", "109,880"],
          ["Target", "114,600"],
        ].map(([k, v]) => (
          <div key={k} className="rounded-lg border border-[var(--line)] bg-white/[0.02] px-2 py-1.5">
            <p className="text-[var(--color-dim)]">{k}</p>
            <p className="t-num mt-0.5 text-[0.78rem] text-[var(--color-fg)]">{v}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-1 w-20 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-[68%] rounded-full bg-gradient-to-r from-[var(--color-cyan)] to-[var(--color-green)]" />
          </div>
          <span className="t-num text-[0.66rem] text-[var(--color-muted)]">Confidence 68</span>
        </div>
        <span className="text-[0.58rem] text-[var(--color-muted)]">Illustrative only</span>
      </div>
    </div>
  );
}

function MiniTickerCard() {
  const bars = [38, 52, 44, 61, 57, 70, 64, 78, 72, 86];
  return (
    <div className="glass w-[200px] rounded-2xl p-3.5">
      <div className="flex items-center justify-between">
        <p className="t-num text-xs font-semibold">XAU/USD</p>
        <span className="t-num text-[0.66rem] text-[var(--color-green)]">+0.74%</span>
      </div>
      <p className="t-num mt-1 text-lg">3,498.20</p>
      <div className="mt-2 flex h-9 items-end gap-1">
        {bars.map((b, i) => (
          <motion.span
            key={i}
            className="flex-1 rounded-sm bg-gradient-to-t from-[var(--color-blue)]/40 to-[var(--color-cyan)]"
            initial={{ height: 0 }}
            animate={{ height: `${b}%` }}
            transition={{ delay: 1.6 + i * 0.05, duration: 0.8, ease }}
          />
        ))}
      </div>
      <p className="mt-2 text-[0.6rem] uppercase tracking-[0.18em] text-[var(--color-dim)]">Illustrative visual · live charts on Markets</p>
    </div>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotionSafe();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -120]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 60, damping: 18 });
  const smy = useSpring(my, { stiffness: 60, damping: 18 });
  const cardX = useTransform(smx, (v) => v * -26);
  const cardY = useTransform(smy, (v) => v * -18);
  const card2X = useTransform(smx, (v) => v * 18);
  const card2Y = useTransform(smy, (v) => v * 14);

  const onMove = (e: MouseEvent) => {
    if (reduce) return;
    mx.set(e.clientX / window.innerWidth - 0.5);
    my.set(e.clientY / window.innerHeight - 0.5);
  };

  return (
    <section ref={ref} onMouseMove={onMove} className="relative isolate flex min-h-[100svh] items-end overflow-hidden pb-16 pt-28 md:items-center md:pb-24" aria-labelledby="hero-title">
      {/* 3D environment */}
      <div className="absolute inset-0 -z-10">
        <LazyHeroCanvas />
      </div>
      {/* legibility + depth gradients */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_55%_at_18%_55%,rgb(3_6_13/0.85),transparent_70%)] max-md:bg-[linear-gradient(to_top,rgb(3_6_13/0.97)_30%,rgb(3_6_13/0.55)_62%,transparent_85%)]" aria-hidden />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-[var(--color-ink-900)] to-transparent" aria-hidden />
      <div className="pointer-events-none absolute -left-40 top-1/4 -z-10 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(closest-side,rgb(43_107_255/0.16),transparent)]" aria-hidden />

      <motion.div style={{ y: contentY, opacity: contentOpacity }} className="container-x relative">
        <div className="max-w-[50rem]">
          <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.8, ease }} className="chip mb-7 border-[var(--color-cyan)]/25 bg-[var(--color-cyan)]/[0.05] text-[var(--color-cyan)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-cyan)] shadow-[0_0_10px_var(--color-cyan)]" />
            {site.name} — {site.concept}
          </motion.p>

          <h1 id="hero-title" className="t-display">
            {["Trade Smarter.", "See More.", "Move Faster."].map((line, i) => (
              <span key={line} className="block overflow-hidden pb-[0.06em]">
                <motion.span
                  className={i === 2 ? "text-brand block" : "text-silver block"}
                  initial={{ y: "110%", rotate: 2 }}
                  animate={{ y: "0%", rotate: 0 }}
                  transition={{ delay: 0.35 + i * 0.12, duration: 1.1, ease }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85, duration: 0.9, ease }} className="t-lead mt-7 max-w-xl">
            An intelligent trading and market-information ecosystem. Structured signals, market analysis and education — engineered to help
            you see more of the market and act with discipline.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0, duration: 0.9, ease }} className="mt-9 flex flex-wrap items-center gap-3">
            <ButtonLink href="/platform">
              Explore Platform <ArrowUpRight size={16} />
            </ButtonLink>
            <ButtonLink href="/register" variant="ghost">
              Get Started
            </ButtonLink>
            <ButtonLink href="/account-management" variant="ghost">
              Account Management Services <ArrowUpRight size={16} />
            </ButtonLink>
            <Link href="/login" className="link-u ml-2 px-1 text-sm text-[var(--color-fg-soft)]">
              Login
            </Link>
          </motion.div>

          <motion.ul initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.25, duration: 1 }} className="mt-12 flex flex-wrap items-center gap-x-4 gap-y-2 sm:gap-x-5" aria-label="DFXSIGNALL pillars">
            {site.pillars.map((p, i) => (
              <li key={p} className="t-eyebrow flex items-center gap-4 text-[0.62rem] tracking-[0.16em] text-[var(--color-muted)] sm:gap-5 sm:text-[0.66rem] sm:tracking-[0.22em]">
                {i > 0 && <span className="inline-block h-3 w-px bg-[var(--color-green)]/60" aria-hidden />}
                {p}
              </li>
            ))}
          </motion.ul>
        </div>
      </motion.div>

      {/* floating glass panels */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 1.1, ease }}
        style={{ x: cardX, y: cardY }}
        className="pointer-events-none absolute bottom-[14%] right-[6%] hidden xl:block"
        aria-hidden
      >
        <SignalGlassCard />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.55, duration: 1.1, ease }}
        style={{ x: card2X, y: card2Y }}
        className="pointer-events-none absolute right-[31%] top-[20%] hidden xl:block"
        aria-hidden
      >
        <MiniTickerCard />
      </motion.div>

      <motion.a
        href="#intelligence"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[0.62rem] uppercase tracking-[0.3em] text-[var(--color-dim)] md:flex"
      >
        Scroll
        <motion.span animate={reduce ? undefined : { y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}>
          <ArrowDown size={14} />
        </motion.span>
      </motion.a>
    </section>
  );
}
