/**
 * Instrument coverage labels and TradingView symbol mapping.
 * These entries are identifiers only, not price data.
 */
export type MarketCategory = "Forex" | "Metals" | "Indices" | "Crypto" | "Energy";
export type Instrument = { symbol: string; name: string; category: MarketCategory; decimals: number };
export const marketCategories: MarketCategory[] = ["Forex", "Metals", "Indices", "Crypto", "Energy"];
export const instruments: Instrument[] = [
  { symbol: "EUR/USD", name: "Euro / US Dollar", category: "Forex", decimals: 5 },
  { symbol: "GBP/USD", name: "British Pound / US Dollar", category: "Forex", decimals: 5 },
  { symbol: "USD/JPY", name: "US Dollar / Japanese Yen", category: "Forex", decimals: 3 },
  { symbol: "AUD/USD", name: "Australian Dollar / US Dollar", category: "Forex", decimals: 5 },
  { symbol: "XAU/USD", name: "Gold / US Dollar", category: "Metals", decimals: 2 },
  { symbol: "XAG/USD", name: "Silver / US Dollar", category: "Metals", decimals: 3 },
  { symbol: "US500", name: "US 500 Index", category: "Indices", decimals: 1 },
  { symbol: "NAS100", name: "US Tech 100 Index", category: "Indices", decimals: 1 },
  { symbol: "BTC/USD", name: "Bitcoin / US Dollar", category: "Crypto", decimals: 0 },
  { symbol: "ETH/USD", name: "Ethereum / US Dollar", category: "Crypto", decimals: 1 },
  { symbol: "WTI", name: "WTI Crude Oil", category: "Energy", decimals: 2 },
  { symbol: "BRENT", name: "Brent Crude Oil", category: "Energy", decimals: 2 },
];
export const timeframes = ["1m", "5m", "15m", "1H", "4H", "1D"] as const;
export type Timeframe = (typeof timeframes)[number];
export const LIVE_DATA_ENABLED = true;
