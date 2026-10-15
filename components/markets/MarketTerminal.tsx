"use client";

import { useMemo, useState } from "react";
import { Activity, ExternalLink, Radio } from "lucide-react";
import { instruments, marketCategories, timeframes, type Timeframe } from "@/content/markets";

const tvSymbols: Record<string, string> = {
  "EUR/USD": "FX:EURUSD",
  "GBP/USD": "FX:GBPUSD",
  "USD/JPY": "FX:USDJPY",
  "AUD/USD": "FX:AUDUSD",
  "XAU/USD": "OANDA:XAUUSD",
  "XAG/USD": "OANDA:XAGUSD",
  US500: "FOREXCOM:SPXUSD",
  NAS100: "FOREXCOM:NSXUSD",
  "BTC/USD": "COINBASE:BTCUSD",
  "ETH/USD": "COINBASE:ETHUSD",
  WTI: "TVC:USOIL",
  BRENT: "TVC:UKOIL",
};

const intervals: Record<Timeframe, string> = { "1m": "1", "5m": "5", "15m": "15", "1H": "60", "4H": "240", "1D": "D" };

export function MarketTerminal({ compact = false }: { compact?: boolean }) {
  const [category, setCategory] = useState<string>("All");
  const [symbol, setSymbol] = useState("XAU/USD");
  const [timeframe, setTimeframe] = useState<Timeframe>("1H");
  const available = useMemo(() => instruments.filter((i) => category === "All" || i.category === category), [category]);
  const active = instruments.find((i) => i.symbol === symbol) ?? instruments[0];
  const tvSymbol = tvSymbols[active.symbol] ?? "OANDA:XAUUSD";
  const chartUrl = useMemo(() => {
    const params = new URLSearchParams({
      symbol: tvSymbol,
      interval: intervals[timeframe],
      theme: "dark",
      style: "1",
      timezone: "Asia/Kolkata",
      withdateranges: "1",
      hide_side_toolbar: compact ? "1" : "0",
      allow_symbol_change: "1",
      save_image: "0",
      details: "1",
      hotlist: "0",
      calendar: "0",
      locale: "en",
    });
    return `https://s.tradingview.com/widgetembed/?${params.toString()}`;
  }, [tvSymbol, timeframe, compact]);

  return (
    <section className="panel overflow-hidden" aria-label="TradingView live market chart">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] px-4 py-4 sm:px-5">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl border border-emerald-400/20 bg-emerald-400/10"><Activity className="size-5 text-emerald-300" /></span>
          <div><p className="t-eyebrow">MARKET TERMINAL</p><h2 className="mt-1 text-lg font-semibold text-silver">{active.name} <span className="text-[var(--color-muted)]">· {active.symbol}</span></h2></div>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/5 px-3 py-1.5 text-xs text-emerald-200"><Radio className="size-3.5" /> TradingView chart</span>
      </div>
      <div className="flex flex-wrap items-center gap-2 border-b border-[var(--line)] p-3 sm:px-5">
        <label className="sr-only" htmlFor="market-category">Asset category</label>
        <select id="market-category" value={category} onChange={(e) => { const next = e.target.value; setCategory(next); const first = instruments.find((i) => next === "All" || i.category === next); if (first) setSymbol(first.symbol); }} className="min-w-32 rounded-lg border border-[var(--line)] bg-[var(--color-ink-950)] px-3 py-2.5 text-sm text-silver">
          <option value="All">All markets</option>{marketCategories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <label className="sr-only" htmlFor="market-symbol">Instrument</label>
        <select id="market-symbol" value={symbol} onChange={(e) => setSymbol(e.target.value)} className="min-w-36 flex-1 rounded-lg border border-[var(--line)] bg-[var(--color-ink-950)] px-3 py-2.5 text-sm text-silver">
          {available.map((i) => <option key={i.symbol} value={i.symbol}>{i.symbol} — {i.name}</option>)}
        </select>
        <label className="sr-only" htmlFor="market-timeframe">Chart timeframe</label>
        <select id="market-timeframe" value={timeframe} onChange={(e) => setTimeframe(e.target.value as Timeframe)} className="rounded-lg border border-[var(--line)] bg-[var(--color-ink-950)] px-3 py-2.5 text-sm text-silver">
          {timeframes.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <a href={`https://www.tradingview.com/chart/?symbol=${encodeURIComponent(tvSymbol)}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-[var(--line)] px-3 py-2.5 text-sm text-[var(--color-muted)] transition hover:text-white"><ExternalLink className="size-4" /><span className="hidden sm:inline">Open full chart</span></a>
      </div>
      <div className={compact ? "h-[410px] w-full sm:h-[460px]" : "h-[520px] w-full sm:h-[620px]"}>
        <iframe key={chartUrl} title={`TradingView chart for ${active.symbol}`} src={chartUrl} className="size-full border-0" loading="lazy" allow="fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" referrerPolicy="strict-origin-when-cross-origin" />
      </div>
      <div className="flex flex-col gap-1 border-t border-[var(--line)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <p className="text-xs text-[var(--color-muted)]">Chart supplied by TradingView. Quotes may be delayed or unavailable for some symbols depending on exchange permissions.</p>
        <p className="text-xs text-[var(--color-dim)]">Market information only · Not a trade execution service</p>
      </div>
    </section>
  );
}
