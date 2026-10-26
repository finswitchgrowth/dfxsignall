"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window { TradingView?: unknown }
}

export function TickerTape() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = host.current;
    if (!node) return;
    node.innerHTML = "";
    const container = document.createElement("div");
    container.className = "tradingview-widget-container";
    container.style.width = "100%";
    container.style.height = "46px";
    const widget = document.createElement("div");
    widget.className = "tradingview-widget-container__widget";
    widget.style.width = "100%";
    widget.style.height = "46px";
    container.appendChild(widget);
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.text = JSON.stringify({
      symbols: [
        { proName: "FX:EURUSD", title: "EUR/USD" },
        { proName: "FX:GBPUSD", title: "GBP/USD" },
        { proName: "OANDA:XAUUSD", title: "Gold" },
        { proName: "OANDA:XAGUSD", title: "Silver" },
        { proName: "COINBASE:BTCUSD", title: "Bitcoin" },
        { proName: "COINBASE:ETHUSD", title: "Ethereum" },
        { proName: "FOREXCOM:SPXUSD", title: "S&P 500" },
        { proName: "TVC:USOIL", title: "WTI Crude" },
      ],
      showSymbolLogo: true,
      isTransparent: true,
      displayMode: "adaptive",
      colorTheme: "dark",
      locale: "en",
    });
    container.appendChild(script);
    node.appendChild(container);
    return () => { if (node.contains(container)) node.removeChild(container); };
  }, []);

  return <section aria-label="TradingView market ticker" className="relative overflow-hidden border-y border-[var(--line)] bg-[var(--color-ink-950)]/80"><div ref={host} className="min-h-[46px] w-full" /><p className="px-4 pb-2 text-center text-[10px] text-[var(--color-dim)]">Market quotes provided by TradingView; data availability and delays vary by symbol and exchange.</p></section>;
}
