import { Bell, BrainCircuit, CandlestickChart, Gauge, Newspaper, Radar } from "lucide-react";
import { TiltCard } from "@/components/ui/Interactive";
import { SectionHeading } from "@/components/ui/Primitives";
import { Reveal } from "@/components/ui/Reveal";

function MiniVisual({ kind }: { kind: number }) {
  if (kind === 0)
    return (
      <svg viewBox="0 0 160 60" className="h-full w-full" aria-hidden>
        {[12, 30, 48, 66, 84, 102, 120, 138].map((x, i) => {
          const h = [18, 26, 14, 32, 22, 38, 28, 44][i];
          const up = i % 3 !== 1;
          return <rect key={x} x={x} y={52 - h} width="9" height={h} rx="1.5" fill={up ? "#34f08c" : "#2b6bff"} opacity={0.35 + i * 0.07} />;
        })}
      </svg>
    );
  if (kind === 1)
    return (
      <svg viewBox="0 0 160 60" className="h-full w-full" aria-hidden>
        <path d="M0 46 C 20 40, 30 20, 50 28 S 80 50, 100 30 S 140 8, 160 14" fill="none" stroke="#1fd8ff" strokeWidth="2" />
        <path d="M0 50 C 25 48, 40 36, 60 38 S 100 44, 120 34 S 150 26, 160 24" fill="none" stroke="#2b6bff" strokeWidth="1.5" opacity=".7" />
        <circle cx="100" cy="30" r="3.5" fill="#34f08c" />
      </svg>
    );
  if (kind === 2)
    return (
      <div className="flex h-full flex-col justify-center gap-1.5" aria-hidden>
        {["XAU/USD crossed key level", "EUR/USD volatility rising", "BTC/USD range breakout"].map((t, i) => (
          <div key={t} className="flex items-center gap-2 rounded-md border border-[var(--line)] bg-white/[0.02] px-2 py-1 text-[0.6rem] text-[var(--color-fg-soft)]" style={{ opacity: 1 - i * 0.25 }}>
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-green)]" /> {t}
          </div>
        ))}
      </div>
    );
  if (kind === 3)
    return (
      <svg viewBox="0 0 160 60" className="h-full w-full" aria-hidden>
        {Array.from({ length: 5 }).map((_, r) =>
          Array.from({ length: 12 }).map((__, c) => {
            const v = Math.abs(Math.sin(r * 1.7 + c * 0.9));
            return <rect key={`${r}-${c}`} x={4 + c * 13} y={4 + r * 11} width="11" height="9" rx="2" fill={v > 0.6 ? "#34f08c" : v > 0.3 ? "#1fd8ff" : "#2b6bff"} opacity={0.15 + v * 0.55} />;
          }),
        )}
      </svg>
    );
  if (kind === 4)
    return (
      <svg viewBox="0 0 160 60" className="h-full w-full" aria-hidden>
        <circle cx="80" cy="30" r="24" fill="none" stroke="rgb(150 180 255 / .15)" />
        <circle cx="80" cy="30" r="14" fill="none" stroke="rgb(150 180 255 / .15)" />
        <path d="M80 30 L104 30 A24 24 0 0 0 92 9 Z" fill="#1fd8ff" opacity=".25" />
        <circle cx="96" cy="18" r="2.5" fill="#34f08c" />
        <circle cx="66" cy="40" r="2" fill="#1fd8ff" />
      </svg>
    );
  return (
    <div className="flex h-full flex-col justify-center gap-2" aria-hidden>
      {[80, 62, 45].map((w, i) => (
        <div key={w} className="h-1.5 rounded-full bg-gradient-to-r from-[var(--color-blue)] to-[var(--color-cyan)]" style={{ width: `${w}%`, opacity: 0.8 - i * 0.2 }} />
      ))}
    </div>
  );
}

const items = [
  { icon: Radar, title: "Signals", text: "Clear entry, stop loss and take-profit levels with timeframe, confidence and rationale." },
  { icon: CandlestickChart, title: "Charts", text: "Clean multi-timeframe charting with the indicators that matter — nothing decorative." },
  { icon: Bell, title: "Alerts", text: "Timely notifications for new ideas, level breaks and status changes, built for mobile." },
  { icon: Gauge, title: "Analytics", text: "Transparent signal history and performance analytics — published only from verified data." },
  { icon: BrainCircuit, title: "Market intelligence", text: "Context on structure, volatility and sentiment across forex, metals, indices and crypto." },
  { icon: Newspaper, title: "Trading information", text: "Economic calendar awareness and concise commentary on the events that move price." },
];

export function TradingIntelligence() {
  return (
    <section className="section-y relative" aria-labelledby="ti">
      <div className="container-x">
        <SectionHeading
          eyebrow="Trading intelligence"
          title="Everything you need to read the market — in one layer."
          lead="Six capabilities, designed to work together inside the DFXSIGNALL platform."
        />
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it, i) => (
            <Reveal key={it.title} delay={0.06 * i}>
              <TiltCard className="panel flex h-full flex-col p-6">
                <div className="flex items-center justify-between" style={{ transform: "translateZ(30px)" }}>
                  <span className="grid h-10 w-10 place-items-center rounded-xl border border-[var(--line-strong)] bg-white/[0.03] text-[var(--color-cyan)]">
                    <it.icon size={18} />
                  </span>
                  <span className="t-num text-xs text-[var(--color-dim)]">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <div className="my-6 h-16 rounded-xl border border-[var(--line)] bg-[var(--color-ink-950)]/60 p-2" style={{ transform: "translateZ(20px)" }}>
                  <MiniVisual kind={i} />
                </div>
                <h3 className="t-h3">{it.title}</h3>
                <p className="t-body mt-2 text-sm">{it.text}</p>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
