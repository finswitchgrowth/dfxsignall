"use client";

import { useDemoQuotes } from "@/components/markets/useDemoFeed";
import { cn, formatPrice } from "@/lib/utils";

export function TickerTape() {
  const quotes = useDemoQuotes();
  const row = (
    <>
      {quotes.map((q) => (
        <span key={q.symbol} className="flex shrink-0 items-center gap-3 px-7">
          <span className="t-num text-xs text-[var(--color-fg-soft)]">{q.symbol}</span>
          <span className="t-num text-xs text-[var(--color-fg)]">{formatPrice(q.price, q.decimals)}</span>
          <span className={cn("t-num text-[0.7rem]", q.change >= 0 ? "text-[var(--color-green)]" : "text-[var(--color-red)]")}>
            {q.change >= 0 ? "▲" : "▼"} {Math.abs(q.change).toFixed(2)}%
          </span>
          <span className="h-3 w-px bg-[var(--line-strong)]" aria-hidden />
        </span>
      ))}
    </>
  );
  return (
    <section aria-label="Demo market ticker (simulated prices)" className="relative border-y border-[var(--line)] bg-[var(--color-ink-950)]/80">
      <div className="flex items-center">
        <span className="chip chip-demo relative z-10 ml-3 shrink-0 bg-[var(--color-ink-950)] sm:ml-6">Demo feed</span>
        <div className="relative flex-1 overflow-hidden py-3.5 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
          <div className="flex w-max animate-marquee hover:[animation-play-state:paused] motion-reduce:animate-none">
            {row}
            <span aria-hidden className="flex">
              {row}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
