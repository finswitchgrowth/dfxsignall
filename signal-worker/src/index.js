const FOREX_SYMBOLS = ["EUR/USD", "GBP/USD", "USD/JPY"];
const CRYPTO_SYMBOLS = ["BTCUSDT", "ETHUSDT", "SOLUSDT"];
const INTERVAL_MS = 15 * 60 * 1000;
const CANDLE_LIMIT = 120;

function ema(values, period) {
  if (values.length < period) return null;
  const alpha = 2 / (period + 1);
  let value = values[0];
  for (let i = 1; i < values.length; i++) {
    value = values[i] * alpha + value * (1 - alpha);
  }
  return value;
}

function rsi(values, period = 14) {
  if (values.length < period + 1) return null;
  let gains = 0;
  let losses = 0;
  for (let i = values.length - period; i < values.length; i++) {
    const change = values[i] - values[i - 1];
    if (change > 0) gains += change;
    else losses -= change;
  }
  if (losses === 0) return gains > 0 ? 100 : 50;
  return 100 - 100 / (1 + gains / losses);
}

function atr(candles, period = 14) {
  if (candles.length < period + 1) return null;
  const ranges = [];
  for (let i = 1; i < candles.length; i++) {
    const current = candles[i];
    const previous = candles[i - 1];
    ranges.push(Math.max(
      current.high - current.low,
      Math.abs(current.high - previous.close),
      Math.abs(current.low - previous.close)
    ));
  }
  const recent = ranges.slice(-period);
  return recent.reduce((sum, value) => sum + value, 0) / recent.length;
}

async function getCandles(symbol, market, env) {
  let rows;
  if (market === "CRYPTO") {
    const url = new URL("https://api.binance.com/api/v3/klines");
    url.searchParams.set("symbol", symbol);
    url.searchParams.set("interval", "15m");
    url.searchParams.set("limit", String(CANDLE_LIMIT));
    const response = await fetch(url);
    if (!response.ok) throw new Error("Binance HTTP " + response.status);
    rows = (await response.json())
      .filter(k => Number(k[6]) < Date.now())
      .map(k => ({
        time: Number(k[0]),
        closeTime: Number(k[6]),
        open: Number(k[1]),
        high: Number(k[2]),
        low: Number(k[3]),
        close: Number(k[4])
      }));
  } else {
    if (!env.TWELVEDATA_API_KEY) throw new Error("TWELVEDATA_API_KEY secret is missing");
    const url = new URL("https://api.twelvedata.com/time_series");
    url.searchParams.set("symbol", symbol);
    url.searchParams.set("interval", "15min");
    url.searchParams.set("outputsize", String(CANDLE_LIMIT));
    url.searchParams.set("timezone", "UTC");
    url.searchParams.set("apikey", env.TWELVEDATA_API_KEY);
    const response = await fetch(url);
    if (!response.ok) throw new Error("Twelve Data HTTP " + response.status);
    const data = await response.json();
    if (!Array.isArray(data.values)) {
      throw new Error(data.message || data.status || "Forex candle data unavailable");
    }
    rows = data.values.map(v => {
      const time = Date.parse(v.datetime.endsWith("Z") ? v.datetime : v.datetime + "Z");
      return {
        time,
        closeTime: time + INTERVAL_MS,
        open: Number(v.open),
        high: Number(v.high),
        low: Number(v.low),
        close: Number(v.close)
      };
    }).filter(c => Number.isFinite(c.time) &&
      [c.open, c.high, c.low, c.close].every(Number.isFinite) &&
      c.closeTime <= Date.now()).sort((a, b) => a.time - b.time);
  }

  const candles = rows.sort((a, b) => a.time - b.time);
  if (candles.length < 60) throw new Error("Not enough completed candles");
  const latest = candles[candles.length - 1];
  const age = Date.now() - latest.closeTime;
  const maxAge = Number(env.MAX_CANDLE_AGE_MINUTES || 30) * 60_000;
  if (age < 0 || age > maxAge) throw new Error("Latest completed candle is stale");
  return candles;
}

function analyze(candles, minRiskReward) {
  const closes = candles.map(c => c.close);
  const latest = candles[candles.length - 1];
  const previous = candles[candles.length - 2];
  const fast = ema(closes, 20);
  const slow = ema(closes, 50);
  const previousFast = ema(closes.slice(0, -1), 20);
  const momentum = rsi(closes);
  const volatility = atr(candles);

  if (![fast, slow, previousFast, momentum, volatility].every(Number.isFinite) ||
      volatility <= 0) return null;

  let direction = null;
  if (fast > slow && previous.close <= previousFast &&
      latest.close > fast && momentum >= 52 && momentum <= 68) {
    direction = "BUY";
  } else if (fast < slow && previous.close >= previousFast &&
      latest.close < fast && momentum >= 32 && momentum <= 48) {
    direction = "SELL";
  }
  if (!direction) return null;

  const entry = latest.close;
  const distance = volatility * 1.5;
  const stop = direction === "BUY" ? entry - distance : entry + distance;
  const target = direction === "BUY"
    ? entry + distance * minRiskReward
    : entry - distance * minRiskReward;
  const rr = Math.abs(target - entry) / Math.abs(entry - stop);
  if (![entry, stop, target, rr].every(Number.isFinite) ||
      entry <= 0 || stop <= 0 || target <= 0 || rr < minRiskReward) return null;

  return {
    direction, entry, stop, target, rr, rsi: momentum,
    candleTime: latest.time
  };
}

function formatPrice(price, market) {
  if (market === "FOREX") return price >= 20 ? price.toFixed(3) : price.toFixed(5);
  return price.toLocaleString("en-US", {
    useGrouping: false,
    maximumFractionDigits: price < 1 ? 8 : 2
  });
}

function signalMessage(asset, signal) {
  return [
    "📊 DFXSIGNALL | " + asset.market,
    "",
    (signal.direction === "BUY" ? "🟢 BUY" : "🔴 SELL") + " — " + asset.symbol,
    "Timeframe: 15m",
    "Entry: " + formatPrice(signal.entry, asset.market),
    "Stop Loss: " + formatPrice(signal.stop, asset.market),
    "Take Profit: " + formatPrice(signal.target, asset.market),
    "Risk/Reward: 1:" + signal.rr.toFixed(2),
    "RSI (14): " + signal.rsi.toFixed(1),
    "Completed candle (UTC): " + new Date(signal.candleTime).toISOString(),
    "",
    "Rule-based setup; not a guarantee of profit.",
    "Verify spread, quote and execution price before trading."
  ].join("\n");
}

async function sendTelegram(env, text) {
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) {
    throw new Error("Telegram secrets are missing");
  }
  const response = await fetch(
    "https://api.telegram.org/bot" + env.TELEGRAM_BOT_TOKEN + "/sendMessage",
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        chat_id: env.TELEGRAM_CHAT_ID,
        text,
        link_preview_options: { is_disabled: true }
      })
    }
  );
  const result = await response.json();
  if (!response.ok || !result.ok) {
    throw new Error(result.description || "Telegram send failed");
  }
  return result.result.message_id;
}

async function recordRun(env, market, symbol, outcome, details) {
  await env.DB.prepare(
    "INSERT INTO bot_runs (market, symbol, outcome, details) VALUES (?, ?, ?, ?)"
  ).bind(market || null, symbol || null, outcome, String(details || "").slice(0, 500))
    .run().catch(error => console.error("Could not write run log", error.message));
}

async function flushPending(env) {
  const pending = await env.DB.prepare(
    "SELECT id, market, symbol, direction, entry, stop_loss, take_profit, rsi, risk_reward, candle_time FROM published_signals WHERE status = 'PENDING' ORDER BY id LIMIT 20"
  ).all();

  for (const row of pending.results || []) {
    try {
      const asset = { market: row.market, symbol: row.symbol };
      const signal = {
        direction: row.direction, entry: row.entry, stop: row.stop_loss,
        target: row.take_profit, rsi: row.rsi, rr: row.risk_reward,
        candleTime: row.candle_time
      };
      const messageId = await sendTelegram(env, signalMessage(asset, signal));
      await env.DB.prepare(
        "UPDATE published_signals SET status = 'SENT', telegram_message_id = ?, published_at = CURRENT_TIMESTAMP, error = NULL WHERE id = ? AND status = 'PENDING'"
      ).bind(messageId, row.id).run();
    } catch (error) {
      await env.DB.prepare(
        "UPDATE published_signals SET error = ? WHERE id = ?"
      ).bind(String(error.message).slice(0, 500), row.id).run().catch(() => {});
      await recordRun(env, row.market, row.symbol, "DELIVERY_ERROR", error.message);
    }
  }
}

async function scanAsset(env, asset) {
  const candles = await getCandles(asset.symbol, asset.market, env);
  const signal = analyze(candles, Number(env.MIN_RISK_REWARD || 1.5));
  if (!signal) {
    await recordRun(env, asset.market, asset.symbol, "NO_SIGNAL", "Rules not met");
    return;
  }

  const result = await env.DB.prepare(
    `INSERT OR IGNORE INTO published_signals
      (symbol, market, direction, candle_time, entry, stop_loss, take_profit, rsi, risk_reward, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING')`
  ).bind(
    asset.symbol, asset.market, signal.direction, signal.candleTime,
    signal.entry, signal.stop, signal.target, signal.rsi, signal.rr
  ).run();

  if (!result.meta || result.meta.changes !== 1) {
    await recordRun(env, asset.market, asset.symbol, "DUPLICATE", "Signal already recorded");
    return;
  }
  await recordRun(env, asset.market, asset.symbol, "QUEUED", "Qualifying setup stored for delivery");
}

async function runScan(env) {
  await flushPending(env);
  const assets = [
    ...FOREX_SYMBOLS.map(symbol => ({ symbol, market: "FOREX" })),
    ...CRYPTO_SYMBOLS.map(symbol => ({ symbol, market: "CRYPTO" }))
  ];
  for (const asset of assets) {
    try {
      await scanAsset(env, asset);
    } catch (error) {
      console.error("Scan failed", asset.symbol, error.message);
      await recordRun(env, asset.market, asset.symbol, "ERROR", error.message);
    }
  }
  await flushPending(env);
}

export default {
  async scheduled(_controller, env, ctx) {
    ctx.waitUntil(runScan(env));
  },
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/health" && request.method === "GET") {
      return Response.json({
        status: "ok",
        service: "DFXSignall signal worker",
        mode: env.SIGNAL_MODE || "publish",
        note: "Health check does not verify market data or Telegram delivery."
      });
    }
    return new Response("Not found", { status: 404 });
  }
};
