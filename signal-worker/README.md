# DFXSignall Signal Worker

This worker is kept in the existing `finswitchgrowth/dfxsignall` repository. It deploys separately from the Next.js website, so the current Vercel site remains on its existing deployment path.

## What it does

- Runs every five minutes using Cloudflare Cron Triggers.
- Scans completed 15-minute candles for EUR/USD, GBP/USD, USD/JPY, BTC/USDT, ETH/USDT and SOL/USDT.
- Applies EMA 20/50, RSI 14 and ATR-based stop/target rules.
- Stores qualifying setups in Cloudflare D1 before delivery and retries pending messages on later runs.
- Posts to one Telegram channel and records run outcomes.

This is a prototype strategy, not a claim of profitability. It does not yet monitor SL/TP outcomes or produce verified win-rate reports. Backtest and forward-test before relying on published signals.

## One-time setup

1. In Cloudflare, create a D1 database named `dfxsignall-signals`.
2. Run `schema.sql` against that database.
3. Copy the D1 database ID into `wrangler.jsonc`.
4. In Cloudflare Workers & Pages, create a Worker named `dfxsignall-signal-worker` from the `signal-worker` directory in this repository (or configure the Git integration to use that directory as its root).
5. Add Worker secrets:
   - `TELEGRAM_BOT_TOKEN`: token from BotFather.
   - `TELEGRAM_CHAT_ID`: the combined channel username such as `@yourchannel`.
   - `TWELVEDATA_API_KEY`: Twelve Data API key for forex candles.
6. Add the bot to the channel as an administrator with permission to post.
7. Deploy and verify `/health`, then check Worker logs and confirm a test post before relying on the scheduled scanner.

## Local commands

Run from this directory:

```bash
npm install
npx wrangler d1 execute dfxsignall-signals --remote --file=schema.sql
npm run dev
npm run deploy
npm run tail
```

The database ID must be replaced before deploying. Keep all API keys in Cloudflare Worker secrets; never commit them to GitHub.

## Data caveats

- Binance public klines are used for crypto. Availability and symbol support depend on the exchange.
- Twelve Data is used for forex. Check your account's symbol coverage, quota and UTC timestamp format.
- The worker rejects stale candles, but signal execution price, spread, slippage and market liquidity may differ from candle close.
- A Telegram post and a D1 update cannot be made in one atomic transaction. The pending queue reduces lost messages but cannot guarantee exactly-once delivery if Telegram accepts a post and the database update then fails.
- This worker only publishes signals. It does not place trades or connect to a broker.
