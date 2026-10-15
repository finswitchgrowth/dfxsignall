"use client";

import { useMemo, useState } from "react";
import { Calculator, ShieldCheck, Target, TrendingDown, TrendingUp } from "lucide-react";

const money = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(n);
const number = (n: number, digits = 2) => new Intl.NumberFormat("en-US", { maximumFractionDigits: digits }).format(n);

export function TradingTools() {
  const [balance, setBalance] = useState("1000");
  const [riskPct, setRiskPct] = useState("1");
  const [entry, setEntry] = useState("2350");
  const [stop, setStop] = useState("2340");
  const [target, setTarget] = useState("2370");
  const [unitsPerLot, setUnitsPerLot] = useState("100");
  const [direction, setDirection] = useState<"buy" | "sell">("buy");

  const calc = useMemo(() => {
    const b = Number(balance), rp = Number(riskPct), e = Number(entry), s = Number(stop), t = Number(target), units = Number(unitsPerLot);
    const valid = [b, rp, e, s, t, units].every(Number.isFinite) && b > 0 && rp > 0 && rp <= 100 && e > 0 && s > 0 && t > 0 && units > 0;
    const stopDistance = Math.abs(e - s);
    const rewardDistance = Math.abs(t - e);
    const stopIsCorrect = direction === "buy" ? s < e && t > e : s > e && t < e;
    const riskAmount = b * rp / 100;
    const riskReward = stopDistance > 0 ? rewardDistance / stopDistance : 0;
    const estimatedLots = stopDistance > 0 ? riskAmount / (stopDistance * units) : 0;
    const rewardAmount = riskAmount * riskReward;
    return { valid, stopIsCorrect, riskAmount, riskReward, estimatedLots, rewardAmount, lossPct: rp };
  }, [balance, riskPct, entry, stop, target, unitsPerLot, direction]);

  const fields = [
    { label: "Account balance (USD)", value: balance, set: setBalance, step: "any", min: "0.01" },
    { label: "Risk per trade (%)", value: riskPct, set: setRiskPct, step: "0.1", min: "0.1", max: "100" },
    { label: "Entry price", value: entry, set: setEntry, step: "any", min: "0.000001" },
    { label: "Stop-loss price", value: stop, set: setStop, step: "any", min: "0.000001" },
    { label: "Take-profit price", value: target, set: setTarget, step: "any", min: "0.000001" },
    { label: "Contract units per lot", value: unitsPerLot, set: setUnitsPerLot, step: "any", min: "0.000001" },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_.95fr]">
      <section className="panel p-5 sm:p-7" aria-labelledby="trade-inputs-title">
        <div className="flex items-center gap-3">
          <div className="grid size-11 place-items-center rounded-xl border border-[var(--line)] bg-white/[0.03]"><Calculator className="size-5 text-cyan-300" /></div>
          <div><p className="t-eyebrow">TRADE PLANNER</p><h2 id="trade-inputs-title" className="mt-1 text-xl font-semibold text-silver">Define the setup</h2></div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-2 rounded-xl border border-[var(--line)] p-1">
          {(["buy", "sell"] as const).map((side) => <button key={side} onClick={() => setDirection(side)} className={`rounded-lg px-4 py-2.5 text-sm font-semibold capitalize transition-colors ${direction === side ? "bg-cyan-400/15 text-cyan-200" : "text-[var(--color-muted)] hover:text-white"}`} aria-pressed={direction === side}>{side === "buy" ? <TrendingUp className="mr-2 inline size-4" /> : <TrendingDown className="mr-2 inline size-4" />}{side} position</button>)}
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {fields.map((f) => <label key={f.label} className="block text-sm text-[var(--color-muted)]">{f.label}<input type="number" inputMode="decimal" min={f.min} max={f.max} step={f.step} value={f.value} onChange={(e) => f.set(e.target.value)} className="mt-2 w-full rounded-xl border border-[var(--line)] bg-black/20 px-3 py-3 text-base text-silver outline-none transition focus:border-cyan-400" /></label>)}
        </div>
        <p className="mt-4 text-xs leading-5 text-[var(--color-dim)]">Contract units vary by broker and instrument. Enter the correct contract multiplier for your product. This calculator does not fetch broker specifications.</p>
      </section>

      <section className="panel p-5 sm:p-7" aria-labelledby="trade-results-title" aria-live="polite">
        <p className="t-eyebrow">RISK INTELLIGENCE</p>
        <h2 id="trade-results-title" className="mt-1 text-xl font-semibold text-silver">Your trade plan</h2>
        {!calc.valid ? <p className="mt-6 rounded-xl border border-amber-400/30 bg-amber-400/5 p-4 text-sm text-amber-200">Enter positive numbers for every field and keep risk between 0 and 100%.</p> : !calc.stopIsCorrect ? <p className="mt-6 rounded-xl border border-amber-400/30 bg-amber-400/5 p-4 text-sm text-amber-200">Check your levels: for a {direction} setup, stop-loss and take-profit should be on opposite sides of entry.</p> : <div className="mt-5 space-y-3">
          <div className="rounded-xl border border-[var(--line)] bg-white/[0.025] p-4"><p className="text-xs text-[var(--color-muted)]">Maximum planned loss</p><p className="t-num mt-1 text-3xl text-rose-300">{money(calc.riskAmount)}</p><p className="mt-1 text-xs text-[var(--color-dim)]">{number(calc.lossPct)}% of account balance</p></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-[var(--line)] p-4"><p className="text-xs text-[var(--color-muted)]">Potential reward</p><p className="t-num mt-2 text-xl text-emerald-300">{money(calc.rewardAmount)}</p></div>
            <div className="rounded-xl border border-[var(--line)] p-4"><p className="text-xs text-[var(--color-muted)]">Risk : reward</p><p className="t-num mt-2 text-xl text-silver">{number(calc.riskReward)} : 1</p></div>
          </div>
          <div className="rounded-xl border border-cyan-400/25 bg-cyan-400/5 p-4"><p className="text-xs text-cyan-100/70">Estimated position size</p><p className="t-num mt-1 text-2xl text-cyan-200">{number(calc.estimatedLots, 4)} lots</p><p className="mt-1 text-xs text-[var(--color-muted)]">Using entered contract units and price distance</p></div>
          <div className="flex items-start gap-3 rounded-xl border border-[var(--line)] p-4"><ShieldCheck className="mt-0.5 size-5 shrink-0 text-emerald-300" /><p className="text-xs leading-5 text-[var(--color-muted)]">Fees, spread, slippage, leverage, currency conversion and gaps can increase actual losses.</p></div>
        </div>}
        <div className="mt-5 flex items-start gap-3 border-t border-[var(--line)] pt-4"><Target className="mt-0.5 size-4 shrink-0 text-cyan-300" /><p className="text-xs leading-5 text-[var(--color-dim)]">A calculator is not a signal or an order. Confirm levels, contract size and risk with your broker before acting.</p></div>
      </section>
    </div>
  );
}
