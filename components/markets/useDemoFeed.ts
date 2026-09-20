"use client";

import { useEffect, useMemo, useState } from "react";
import { instruments, type Instrument } from "@/content/markets";
import { hashString, mulberry32 } from "@/lib/utils";
import { generateCandles, nextTick, type Candle } from "./demoData";

/** Simulated ticking series for one instrument — DEMO ONLY. */
export function useDemoSeries(inst: Instrument, tf: string, count = 72) {
  const initial = useMemo(() => generateCandles(inst, count, tf), [inst, tf, count]);
  const [series, setSeries] = useState<Candle[]>(initial);

  useEffect(() => {
    setSeries(initial);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rand = mulberry32(hashString(inst.symbol + tf + "tick"));
    let n = 0;
    const id = setInterval(() => {
      n++;
      setSeries((s) => {
        const ticked = nextTick(s, inst, rand);
        if (n % 12 === 0) {
          const c = ticked[ticked.length - 1].c;
          return [...ticked.slice(1), { o: c, h: c, l: c, c }];
        }
        return ticked;
      });
    }, 1100);
    return () => clearInterval(id);
  }, [initial, inst, tf]);

  return series;
}

export type Quote = { symbol: string; price: number; change: number; decimals: number };

/** Simulated quotes for a watchlist/ticker — DEMO ONLY. Deterministic first render. */
export function useDemoQuotes(list: Instrument[] = instruments) {
  const initial = useMemo<Quote[]>(
    () =>
      list.map((i) => {
        const r = mulberry32(hashString(i.symbol))();
        return { symbol: i.symbol, price: i.demoPrice, change: (r - 0.45) * 1.6, decimals: i.decimals };
      }),
    [list],
  );
  const [quotes, setQuotes] = useState(initial);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rand = mulberry32(99);
    const id = setInterval(() => {
      setQuotes((q) =>
        q.map((x, idx) => {
          if (rand() > 0.45) return x;
          const vol = list[idx].volatility * 0.25;
          const d = (rand() - 0.5) * vol;
          return { ...x, price: x.price * (1 + d), change: x.change + d * 100 };
        }),
      );
    }, 1400);
    return () => clearInterval(id);
  }, [list]);

  return quotes;
}
