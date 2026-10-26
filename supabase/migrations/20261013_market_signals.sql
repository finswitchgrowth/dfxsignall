create table if not exists public.market_signals (
  id uuid primary key default gen_random_uuid(),
  symbol text not null,
  market text not null default 'FX',
  direction text not null check (direction in ('BUY','SELL','NEUTRAL')),
  entry_price numeric,
  stop_loss numeric,
  take_profit numeric,
  timeframe text not null default 'Intraday',
  confidence text not null default 'Watchlist' check (confidence in ('Watchlist','Setup','Confirmed')),
  status text not null default 'published' check (status in ('draft','published','closed','cancelled')),
  summary text not null default '',
  published_at timestamptz,
  closed_at timestamptz,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists market_signals_status_published_idx on public.market_signals(status, published_at desc);
alter table public.market_signals enable row level security;
drop policy if exists "Clients can read published signals" on public.market_signals;
create policy "Clients can read published signals" on public.market_signals for select to authenticated using (status in ('published','closed','cancelled'));
drop policy if exists "Staff can manage market signals" on public.market_signals;
create policy "Staff can manage market signals" on public.market_signals for all to authenticated using (exists (select 1 from public.user_roles ur where ur.user_id = auth.uid() and ur.role in ('admin','finance'))) with check (exists (select 1 from public.user_roles ur where ur.user_id = auth.uid() and ur.role in ('admin','finance')));
