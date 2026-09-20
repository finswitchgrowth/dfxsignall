import type { Instrument } from "@/content/markets";
import { hashString, mulberry32 } from "@/lib/utils";

export type Candle = { o: number; h: number; l: number; c: number };

/** Simulated OHLC series — DEMO ONLY. Deterministic per instrument + timeframe. */
export function generateCandles(inst: Instrument, count = 64, salt = "15m"): Candle[] {
  const rand = mulberry32(hashString(inst.symbol + salt));
  const tfScale = { "1m": 0.35, "5m": 0.6, "15m": 1, "1H": 1.6, "4H": 2.6, "1D": 4 }[salt] ?? 1;
  const vol = inst.volatility * tfScale;
  const candles: Candle[] = [];
  // walk backwards-compatible: start slightly away from reference so the last close lands near it
  let price = inst.demoPrice * (1 - vol * 6 + rand() * vol * 12);
  let drift = (rand() - 0.5) * vol * 0.4;
  for (let i = 0; i < count; i++) {
    if (i % 16 === 0) drift = (rand() - 0.48) * vol * 0.5;
    const o = price;
    const change = (rand() - 0.5) * vol * 2 + drift;
    const c = o * (1 + change);
    const h = Math.max(o, c) * (1 + rand() * vol * 0.8);
    const l = Math.min(o, c) * (1 - rand() * vol * 0.8);
    candles.push({ o, h, l, c });
    price = c;
  }
  // rescale so the final close equals the configured demo reference price
  const k = inst.demoPrice / candles[candles.length - 1].c;
  return candles.map((x) => ({ o: x.o * k, h: x.h * k, l: x.l * k, c: x.c * k }));
}

export function ema(values: number[], period: number) {
  const k = 2 / (period + 1);
  const out: number[] = [];
  values.forEach((v, i) => out.push(i === 0 ? v : v * k + out[i - 1] * (1 - k)));
  return out;
}

export function rsi(values: number[], period = 14) {
  if (values.length <= period) return 50;
  let gains = 0;
  let losses = 0;
  for (let i = 1; i <= period; i++) {
    const d = values[i] - values[i - 1];
    if (d >= 0) gains += d;
    else losses -= d;
  }
  let avgG = gains / period;
  let avgL = losses / period;
  for (let i = period + 1; i < values.length; i++) {
    const d = values[i] - values[i - 1];
    avgG = (avgG * (period - 1) + Math.max(d, 0)) / period;
    avgL = (avgL * (period - 1) + Math.max(-d, 0)) / period;
  }
  if (avgL === 0) return 100;
  return 100 - 100 / (1 + avgG / avgL);
}

/** Next simulated tick for an existing series (mutates nothing). */
export function nextTick(series: Candle[], inst: Instrument, rand: () => number): Candle[] {
  const last = series[series.length - 1];
  const vol = inst.volatility * 0.35;
  const c = last.c * (1 + (rand() - 0.5) * vol);
  const updated = { ...last, c, h: Math.max(last.h, c), l: Math.min(last.l, c) };
  return [...series.slice(0, -1), updated];
}
