/**
 * Instrument identifiers used by the TradingView embed.
 * Legacy demo seed fields remain only for type compatibility with retired simulator utilities;
 * the live market UI does not read or display those values.
 */
export type MarketCategory = "Forex" | "Metals" | "Indices" | "Crypto" | "Energy";
export type Instrument = { symbol: string; name: string; category: MarketCategory; decimals: number; demoPrice: number; volatility: number };
export const marketCategories: MarketCategory[] = ["Forex", "Metals", "Indices", "Crypto", "Energy"];
export const instruments: Instrument[] = [
  { symbol: "EUR/USD", name: "Euro / US Dollar", category: "Forex", decimals: 5, demoPrice: 1.17284, volatility: 0.0009 },
  { symbol: "GBP/USD", name: "British Pound / US Dollar", category: "Forex", decimals: 5, demoPrice: 1.3512, volatility: 0.0011 },
  { symbol: "USD/JPY", name: "US Dollar / Japanese Yen", category: "Forex", decimals: 3, demoPrice: 147.82, volatility: 0.0012 },
  { symbol: "AUD/USD", name: "Australian Dollar / US Dollar", category: "Forex", decimals: 5, demoPrice: 0.6624, volatility: 0.0012 },
  { symbol: "XAU/USD", name: "Gold / US Dollar", category: "Metals", decimals: 2, demoPrice: 3498.2, volatility: 0.0022 },
  { symbol: "XAG/USD", name: "Silver / US Dollar", category: "Metals", decimals: 3, demoPrice: 40.12, volatility: 0.003 },
  { symbol: "US500", name: "US 500 Index", category: "Indices", decimals: 1, demoPrice: 6482.5, volatility: 0.0016 },
  { symbol: "NAS100", name: "US Tech 100 Index", category: "Indices", decimals: 1, demoPrice: 23610, volatility: 0.002 },
  { symbol: "BTC/USD", name: "Bitcoin / US Dollar", category: "Crypto", decimals: 0, demoPrice: 111842, volatility: 0.004 },
  { symbol: "ETH/USD", name: "Ethereum / US Dollar", category: "Crypto", decimals: 1, demoPrice: 4312.4, volatility: 0.005 },
  { symbol: "WTI", name: "WTI Crude Oil", category: "Energy", decimals: 2, demoPrice: 64.38, volatility: 0.003 },
  { symbol: "BRENT", name: "Brent Crude Oil", category: "Energy", decimals: 2, demoPrice: 67.91, volatility: 0.0028 },
];
export const timeframes = ["1m", "5m", "15m", "1H", "4H", "1D"] as const;
export type Timeframe = (typeof timeframes)[number];
export const LIVE_DATA_ENABLED = true;
