"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Activity, BarChart3, Layers } from "lucide-react";
import { useMemo, useState } from "react";
import { DemoBadge } from "@/components/ui/Primitives";
import { instruments, LIVE_DATA_ENABLED, marketCategories, timeframes, type MarketCategory, type Timeframe } from "@/content/markets";
import { cn, formatPrice } from "@/lib/utils";
import { CandlestickChart } from "./CandlestickChart";
import { ema, rsi } from "./demoData";
import { useDemoQuotes, useDemoSeries } from "./useDemoFeed";

function RsiGauge({ value }: { value: number }) {
  const angle = (value / 100) * 180 - 90;
  const label = value >= 70 ? "Overbought zone" : value <= 30 ? "Oversold zone" : "Neutral range";
  return (
    <div className="flex items-center gap-4">
      <svg viewBox="0 0 120 68" className="w-28" aria-hidden>
        <path d="M10 60 A50 50 0 0 1 110 60" fill="none" stroke="rgb(150 180 255 / 0.12)" strokeWidth="8" strokeLinecap="round" />
        <path d="M10 60 A50 50 0 0 1 36 17" fill="none" stroke="#1fd8ff" strokeOpacity=".5" strokeWidth="8" strokeLinecap="round" />
        <path d="M84 17 A50 50 0 0 1 110 60" fill="none" stroke="#34f08c" strokeOpacity=".5" strokeWidth="8" strokeLinecap="round" />
        <g transform={`rotate(${angle} 60 60)`} style={{ transition: "transform .8s cubic-bezier(.16,1,.3,1)" }}>
          <line x1="60" y1="60" x2="60" y2="18" stroke="#eef2f8" strokeWidth="2" strokeLinecap="round" />
        </g>
        <circle cx="60" cy="60" r="4" fill="#eef2f8" />
      </svg>
      <div>
        <p className="t-num text-2xl">{value.toFixed(1)}</p>
        <p className="text-xs text-[var(--color-muted)]">RSI(14) · {label}</p>
      </div>
    </div>
  );
}

export function MarketTerminal({ compact = false }: { compact?: boolean }) {
  const [cat, setCat] = useState<MarketCategory | "All">("All");
  const [symbol, setSymbol] = useState("XAU/USD");
  const [tf, setTf] = useState<Timeframe>("1H");
  const inst = instruments.find((i) => i.symbol === symbol) ?? instruments[0];
  const series = useDemoSeries(inst, tf);
  const quotes = useDemoQuotes();

  const list = useMemo(() => instruments.filter((i) => cat === "All" || i.category === cat), [cat]);
  const closes = series.map((c) => c.c);
  const last = closes[closes.length - 1];
  const first = series[0].o;
  const chg = ((last - first) / first) * 100;
  const e9 = ema(closes, 9).at(-1)!;
  const e21 = ema(closes, 21).at(-1)!;
  const r = rsi(closes);
  const hi = Math.max(...series.map((c) => c.h));
  const lo = Math.min(...series.map((c) => c.l));

  return (
    <div className="panel overflow-hidden">
      {/* top bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] px-4 py-3 sm:px-5">
        <div className="scrollbar-none -mx-1 flex max-w-full gap-1 overflow-x-auto px-1" role="tablist" aria-label="Market categories">
          {(["All", ...marketCategories] as const).map((c) => (
            <button
              key={c}
              role="tab"
              aria-selected={cat === c}
              onClick={() => setCat(c)}
              className={cn(
                "relative shrink-0 rounded-full px-3 py-1.5 text-xs transition-colors",
                cat === c ? "text-white" : "text-[var(--color-muted)] hover:text-white",
              )}
            >
              {cat === c && <motion.span layoutId="cat-pill" className="absolute inset-0 -z-0 rounded-full border border-[var(--line-strong)] bg-white/[0.06]" />}
              <span className="relative">{c}</span>
            </button>
          ))}
        </div>
        {LIVE_DATA_ENABLED ? (
          <span className="chip chip-live">
            <span className="dot-live" /> Live
          </span>
        ) : (
          <DemoBadge label="Demo mode · simulated data" />
        )}
      </div>

      <div className={cn("grid", compact ? "lg:grid-cols-[1fr_300px]" : "lg:grid-cols-[1fr_320px]")}>
        {/* chart column */}
        <div className="min-w-0 border-[var(--line)] lg:border-r">
          <div className="flex flex-wrap items-end justify-between gap-4 px-4 pt-5 sm:px-6">
            <div>
              <p className="text-xs text-[var(--color-muted)]">
                {inst.name} · {inst.category}
              </p>
              <div className="mt-1 flex items-baseline gap-3">
                <p className="t-num text-3xl sm:text-4xl">{formatPrice(last, inst.decimals)}</p>
                <span className={cn("t-num text-sm", chg >= 0 ? "text-[var(--color-green)]" : "text-[var(--color-red)]")}>
                  {chg >= 0 ? "+" : ""}
                  {chg.toFixed(2)}%
                </span>
              </div>
            </div>
            <div className="flex gap-1 rounded-full border border-[var(--line)] p-1" role="group" aria-label="Timeframe">
              {timeframes.map((t) => (
                <button
                  key={t}
                  onClick={() => setTf(t)}
                  aria-pressed={tf === t}
                  className={cn("t-num rounded-full px-2.5 py-1 text-[0.7rem] transition-all", tf === t ? "bg-[var(--color-cyan)] text-[#02060c]" : "text-[var(--color-muted)] hover:text-white")}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-2 flex items-center gap-4 px-4 text-[0.68rem] text-[var(--color-muted)] sm:px-6">
            <span className="flex items-center gap-1.5">
              <i className="h-0.5 w-3 bg-[var(--color-cyan)]" /> EMA 9
            </span>
            <span className="flex items-center gap-1.5">
              <i className="h-0.5 w-3 bg-[var(--color-blue)]" /> EMA 21
            </span>
          </div>
          <div className="px-2 pb-3 sm:px-4">
            <AnimatePresence mode="wait">
              <motion.div key={symbol + tf} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
                <CandlestickChart candles={series} inst={inst} height={compact ? 340 : 400} />
              </motion.div>
            </AnimatePresence>
          </div>
          {/* indicators */}
          <div className="grid grid-cols-2 gap-px border-t border-[var(--line)] bg-[var(--line)] sm:grid-cols-4">
            {[
              { k: "Range high", v: formatPrice(hi, inst.decimals), icon: BarChart3 },
              { k: "Range low", v: formatPrice(lo, inst.decimals), icon: BarChart3 },
              { k: "EMA trend", v: e9 >= e21 ? "Bullish bias" : "Bearish bias", icon: Activity, tone: e9 >= e21 },
              { k: "Structure", v: last > (hi + lo) / 2 ? "Upper half" : "Lower half", icon: Layers },
            ].map((m) => (
              <div key={m.k} className="bg-[var(--color-ink-850)] px-4 py-3.5 sm:px-5">
                <p className="flex items-center gap-1.5 text-[0.68rem] text-[var(--color-dim)]">
                  <m.icon size={12} /> {m.k}
                </p>
                <p className={cn("t-num mt-1 text-sm", m.tone === true && "text-[var(--color-green)]", m.tone === false && "text-[var(--color-red)]")}>{m.v}</p>
              </div>
            ))}
          </div>
        </div>

        {/* watchlist */}
        <div className="flex min-w-0 flex-col">
          <div className="border-b border-[var(--line)] px-5 py-4">
            <RsiGauge value={r} />
          </div>
          <p className="t-eyebrow px-5 pb-2 pt-4 text-[0.62rem] text-[var(--color-dim)]">Watchlist</p>
          <ul className={cn("scrollbar-none overflow-y-auto", compact ? "max-h-[340px]" : "max-h-[420px]")}>
            {list.map((i) => {
              const active = i.symbol === symbol;
              const raw = quotes.find((x) => x.symbol === i.symbol)!;
              const q = active ? { ...raw, price: last, change: chg } : raw;
              return (
                <li key={i.symbol}>
                  <button
                    onClick={() => setSymbol(i.symbol)}
                    aria-pressed={active}
                    className={cn(
                      "flex w-full items-center justify-between gap-3 border-l-2 px-5 py-3 text-left transition-colors",
                      active ? "border-[var(--color-cyan)] bg-[var(--color-cyan)]/[0.06]" : "border-transparent hover:bg-white/[0.03]",
                    )}
                  >
                    <span>
                      <span className="t-num block text-sm">{i.symbol}</span>
                      <span className="block text-[0.68rem] text-[var(--color-dim)]">{i.category}</span>
                    </span>
                    <span className="text-right">
                      <span className="t-num block text-sm">{formatPrice(q.price, i.decimals)}</span>
                      <span className={cn("t-num block text-[0.7rem]", q.change >= 0 ? "text-[var(--color-green)]" : "text-[var(--color-red)]")}>
                        {q.change >= 0 ? "+" : ""}
                        {q.change.toFixed(2)}%
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <p className="border-t border-[var(--line)] px-5 py-3 text-[0.68rem] text-[var(--color-dim)]">
        Prices, candles and indicators above are simulated for demonstration and are not live or historical market data. Live data will be
        connected through a licensed provider before launch.
      </p>
    </div>
  );
}
