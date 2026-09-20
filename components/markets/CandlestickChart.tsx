"use client";

import { useMemo, useRef, useState, type PointerEvent } from "react";
import type { Instrument } from "@/content/markets";
import { formatPrice } from "@/lib/utils";
import { ema, type Candle } from "./demoData";

type Props = { candles: Candle[]; inst: Instrument; showEma?: boolean; height?: number };

const W = 900;

export function CandlestickChart({ candles, inst, showEma = true, height = 380 }: Props) {
  const H = height;
  const padR = 78;
  const padT = 18;
  const padB = 26;
  const plotW = W - padR;
  const plotH = H - padT - padB;
  const svgRef = useRef<SVGSVGElement>(null);
  const [hover, setHover] = useState<number | null>(null);

  const geo = useMemo(() => {
    const lo = Math.min(...candles.map((c) => c.l));
    const hi = Math.max(...candles.map((c) => c.h));
    const pad = (hi - lo) * 0.08;
    const min = lo - pad;
    const max = hi + pad;
    const y = (v: number) => padT + (1 - (v - min) / (max - min)) * plotH;
    const step = plotW / candles.length;
    const closes = candles.map((c) => c.c);
    const e9 = ema(closes, 9);
    const e21 = ema(closes, 21);
    const path = (arr: number[]) => arr.map((v, i) => `${i ? "L" : "M"}${(i + 0.5) * step},${y(v).toFixed(2)}`).join("");
    const ticks = Array.from({ length: 5 }, (_, i) => min + ((max - min) * i) / 4);
    return { y, step, e9: path(e9), e21: path(e21), ticks, min, max };
  }, [candles, plotH, plotW]);

  const last = candles[candles.length - 1];
  const up = last.c >= candles[0].o;

  const onMove = (e: PointerEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const r = svg.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * W;
    if (x > plotW) return setHover(null);
    setHover(Math.max(0, Math.min(candles.length - 1, Math.floor(x / geo.step))));
  };

  const h = hover != null ? candles[hover] : null;

  return (
    <div className="relative">
      {h && (
        <div className="t-num pointer-events-none absolute left-3 top-2 z-10 flex flex-wrap gap-x-3 text-[0.68rem] text-[var(--color-muted)]">
          {(["o", "h", "l", "c"] as const).map((k) => (
            <span key={k}>
              {k.toUpperCase()} <b className={h.c >= h.o ? "text-[var(--color-green)]" : "text-[var(--color-red)]"}>{formatPrice(h[k], inst.decimals)}</b>
            </span>
          ))}
        </div>
      )}
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full touch-pan-y select-none"
        onPointerMove={onMove}
        onPointerLeave={() => setHover(null)}
        role="img"
        aria-label={`${inst.symbol} simulated candlestick chart (demo data)`}
      >
        <defs>
          <linearGradient id="area-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={up ? "#34f08c" : "#ff5470"} stopOpacity="0.14" />
            <stop offset="100%" stopColor={up ? "#34f08c" : "#ff5470"} stopOpacity="0" />
          </linearGradient>
        </defs>

        {geo.ticks.map((t, i) => (
          <g key={i}>
            <line x1={0} x2={plotW} y1={geo.y(t)} y2={geo.y(t)} stroke="rgb(150 180 255 / 0.07)" strokeDasharray="3 5" />
            <text x={plotW + 10} y={geo.y(t) + 4} className="t-num" fontSize="11" fill="#5d6880">
              {formatPrice(t, inst.decimals)}
            </text>
          </g>
        ))}

        {candles.map((c, i) => {
          const x = (i + 0.5) * geo.step;
          const bull = c.c >= c.o;
          const col = bull ? "#34f08c" : "#ff5470";
          const top = geo.y(Math.max(c.o, c.c));
          const bh = Math.max(1.2, Math.abs(geo.y(c.o) - geo.y(c.c)));
          const bw = Math.max(2, geo.step * 0.58);
          return (
            <g key={i} opacity={hover == null || hover === i ? 1 : 0.55}>
              <line x1={x} x2={x} y1={geo.y(c.h)} y2={geo.y(c.l)} stroke={col} strokeWidth={1} opacity={0.8} />
              <rect x={x - bw / 2} y={top} width={bw} height={bh} rx={1} fill={bull ? col : "transparent"} stroke={col} strokeWidth={1} fillOpacity={0.85} />
            </g>
          );
        })}

        {showEma && (
          <>
            <path d={geo.e21} fill="none" stroke="#2b6bff" strokeWidth={1.6} opacity={0.9} />
            <path d={geo.e9} fill="none" stroke="#1fd8ff" strokeWidth={1.6} />
          </>
        )}

        {/* last price line */}
        <line x1={0} x2={plotW} y1={geo.y(last.c)} y2={geo.y(last.c)} stroke={up ? "#34f08c" : "#ff5470"} strokeDasharray="2 4" opacity={0.7} />
        <rect x={plotW + 2} y={geo.y(last.c) - 10} width={padR - 4} height={20} rx={4} fill={up ? "#34f08c" : "#ff5470"} />
        <text x={plotW + 8} y={geo.y(last.c) + 4} fontSize="11" fontWeight="600" fill="#02060c" className="t-num">
          {formatPrice(last.c, inst.decimals)}
        </text>

        {hover != null && (
          <line x1={(hover + 0.5) * geo.step} x2={(hover + 0.5) * geo.step} y1={padT} y2={H - padB} stroke="rgb(238 242 248 / 0.25)" strokeDasharray="3 3" />
        )}
      </svg>
    </div>
  );
}
