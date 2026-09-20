/**
 * Instrument coverage list and DEMO reference prices.
 * Prices here are NOT live — they seed the simulated demo feed only.
 */
export type MarketCategory = "Forex" | "Metals" | "Indices" | "Crypto" | "Energy";

export type Instrument = {
  symbol: string;
  name: string;
  category: MarketCategory;
  demoPrice: number;
  decimals: number;
  volatility: number; // relative per-candle volatility used by the simulator
};

export const marketCategories: MarketCategory[] = ["Forex", "Metals", "Indices", "Crypto", "Energy"];

export const instruments: Instrument[] = [
  { symbol: "EUR/USD", name: "Euro / US Dollar", category: "Forex", demoPrice: 1.17284, decimals: 5, volatility: 0.0009 },
  { symbol: "GBP/USD", name: "British Pound / US Dollar", category: "Forex", demoPrice: 1.3512, decimals: 5, volatility: 0.0011 },
  { symbol: "USD/JPY", name: "US Dollar / Japanese Yen", category: "Forex", demoPrice: 147.82, decimals: 3, volatility: 0.0012 },
  { symbol: "AUD/USD", name: "Australian Dollar / US Dollar", category: "Forex", demoPrice: 0.6624, decimals: 5, volatility: 0.0012 },
  { symbol: "XAU/USD", name: "Gold / US Dollar", category: "Metals", demoPrice: 3498.2, decimals: 2, volatility: 0.0022 },
  { symbol: "XAG/USD", name: "Silver / US Dollar", category: "Metals", demoPrice: 40.12, decimals: 3, volatility: 0.003 },
  { symbol: "US500", name: "US 500 Index", category: "Indices", demoPrice: 6482.5, decimals: 1, volatility: 0.0016 },
  { symbol: "NAS100", name: "US Tech 100 Index", category: "Indices", demoPrice: 23610, decimals: 1, volatility: 0.002 },
  { symbol: "BTC/USD", name: "Bitcoin / US Dollar", category: "Crypto", demoPrice: 111842, decimals: 0, volatility: 0.004 },
  { symbol: "ETH/USD", name: "Ethereum / US Dollar", category: "Crypto", demoPrice: 4312.4, decimals: 1, volatility: 0.005 },
  { symbol: "WTI", name: "WTI Crude Oil", category: "Energy", demoPrice: 64.38, decimals: 2, volatility: 0.003 },
  { symbol: "BRENT", name: "Brent Crude Oil", category: "Energy", demoPrice: 67.91, decimals: 2, volatility: 0.0028 },
];

export const timeframes = ["1m", "5m", "15m", "1H", "4H", "1D"] as const;
export type Timeframe = (typeof timeframes)[number];

/** Set to true only when a licensed live data provider is connected server-side. */
export const LIVE_DATA_ENABLED = false;
