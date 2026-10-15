-- Add audience targeting for signal publications.
-- Signal feed access applies to Free and recurring signal plans only.
alter table public.market_signals
  add column if not exists plan_tier text not null default 'free';

alter table public.market_signals
  drop constraint if exists market_signals_plan_tier_check;

alter table public.market_signals
  add constraint market_signals_plan_tier_check
  check (plan_tier in ('free', 'starter', 'pro', 'elite'));

create index if not exists market_signals_audience_status_idx
  on public.market_signals(plan_tier, status, published_at desc);
