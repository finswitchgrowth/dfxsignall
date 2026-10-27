CREATE TABLE IF NOT EXISTS published_signals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  symbol TEXT NOT NULL,
  market TEXT NOT NULL,
  direction TEXT NOT NULL CHECK (direction IN ('BUY', 'SELL')),
  candle_time INTEGER NOT NULL,
  entry REAL NOT NULL,
  stop_loss REAL NOT NULL,
  take_profit REAL NOT NULL,
  rsi REAL NOT NULL,
  risk_reward REAL NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING'
    CHECK (status IN ('PENDING', 'SENT', 'OPEN', 'TP_HIT', 'SL_HIT', 'ERROR')),
  telegram_message_id INTEGER,
  published_at TEXT,
  closed_at TEXT,
  exit_price REAL,
  error TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(symbol, candle_time, direction)
);

CREATE INDEX IF NOT EXISTS idx_published_signals_status
  ON published_signals(status);

CREATE TABLE IF NOT EXISTS bot_runs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  run_time TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  market TEXT,
  symbol TEXT,
  outcome TEXT NOT NULL,
  details TEXT
);
