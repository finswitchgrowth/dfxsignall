-- DFXSIGNALL platform foundation — REVIEW FIRST, NOT APPLIED.
-- Apply only to a dedicated development Supabase project after peer review.
-- No client-side writes to roles, entitlements, payments, commissions, trades, or audit rows.

create extension if not exists pgcrypto;
create type public.platform_role as enum ('customer','affiliate','support','finance','admin','security');
create type public.payment_review_status as enum ('pending','approved','rejected','refunded','disputed');
create type public.entitlement_status as enum ('pending','active','expired','suspended','cancelled');
create type public.affiliate_event_status as enum ('pending','qualified','rejected','reversed','paid');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.user_roles (
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.platform_role not null,
  granted_by uuid references auth.users(id),
  granted_at timestamptz not null default now(),
  primary key (user_id, role)
);
create table public.plans (
  id text primary key, name text not null, currency text not null default 'USD' check (currency = 'USD'),
  price_minor integer not null check (price_minor >= 0),
  signal_limit_per_day integer check (signal_limit_per_day is null or signal_limit_per_day >= 0),
  auto_trading_enabled boolean not null default false, active boolean not null default false,
  created_at timestamptz not null default now()
);
create table public.entitlements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete restrict,
  plan_id text not null references public.plans(id) on delete restrict,
  status public.entitlement_status not null default 'pending',
  starts_at timestamptz, ends_at timestamptz, source_payment_id uuid,
  created_at timestamptz not null default now(),
  check (ends_at is null or starts_at is null or ends_at > starts_at)
);
create table public.payment_reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete restrict,
  plan_id text not null references public.plans(id) on delete restrict,
  amount_minor integer not null check (amount_minor > 0),
  currency text not null check (currency = 'USD'),
  provider text, provider_reference text, proof_storage_path text,
  status public.payment_review_status not null default 'pending',
  reviewed_by uuid references auth.users(id), reviewed_at timestamptz, reviewer_note text,
  created_at timestamptz not null default now(),
  unique (provider, provider_reference)
);
alter table public.entitlements add constraint entitlements_source_payment_fk
  foreign key (source_payment_id) references public.payment_reviews(id) on delete restrict;

create table public.affiliate_profiles (
  user_id uuid primary key references auth.users(id) on delete restrict,
  referral_code text not null unique,
  status text not null default 'pending' check (status in ('pending','active','paused','rejected')),
  commission_basis_points integer not null default 0 check (commission_basis_points between 0 and 5000),
  created_at timestamptz not null default now()
);
create table public.affiliate_events (
  id uuid primary key default gen_random_uuid(),
  affiliate_user_id uuid not null references public.affiliate_profiles(user_id) on delete restrict,
  referred_user_id uuid references auth.users(id) on delete restrict,
  payment_id uuid references public.payment_reviews(id) on delete restrict,
  amount_minor integer not null default 0 check (amount_minor >= 0),
  currency text not null default 'USD' check (currency = 'USD'),
  status public.affiliate_event_status not null default 'pending',
  created_at timestamptz not null default now(),
  unique (payment_id)
);
create table public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete restrict,
  subject text not null check (char_length(subject) between 3 and 180),
  body text not null check (char_length(body) between 1 and 10000),
  status text not null default 'open' check (status in ('open','in_progress','waiting_customer','resolved','closed')),
  assigned_to uuid references auth.users(id), created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.audit_events (
  id bigint generated always as identity primary key,
  actor_user_id uuid references auth.users(id) on delete set null,
  action text not null, entity_type text not null, entity_id text, reason text, request_id text,
  metadata jsonb not null default '{}'::jsonb, created_at timestamptz not null default now()
);

create index entitlements_user_status_idx on public.entitlements(user_id, status);
create index payment_reviews_user_status_idx on public.payment_reviews(user_id, status, created_at desc);
create index affiliate_events_affiliate_status_idx on public.affiliate_events(affiliate_user_id, status, created_at desc);
create index support_tickets_owner_status_idx on public.support_tickets(user_id, status, created_at desc);
create index audit_events_created_idx on public.audit_events(created_at desc);

create or replace function public.has_platform_role(required_role public.platform_role)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.user_roles ur
    where ur.user_id = (select auth.uid()) and ur.role = required_role);
$$;
create or replace function public.is_staff()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.user_roles ur
    where ur.user_id = (select auth.uid())
      and ur.role in ('support','finance','admin','security'));
$$;

alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.plans enable row level security;
alter table public.entitlements enable row level security;
alter table public.payment_reviews enable row level security;
alter table public.affiliate_profiles enable row level security;
alter table public.affiliate_events enable row level security;
alter table public.support_tickets enable row level security;
alter table public.audit_events enable row level security;

create policy "profiles read own or staff" on public.profiles for select to authenticated
using (id = (select auth.uid()) or (select public.is_staff()));
create policy "profiles update own" on public.profiles for update to authenticated
using (id = (select auth.uid())) with check (id = (select auth.uid()));
create policy "roles read own or admin" on public.user_roles for select to authenticated
using (user_id = (select auth.uid()) or (select public.has_platform_role('admin')));
create policy "active plans readable" on public.plans for select to authenticated
using (active = true or (select public.has_platform_role('admin')));
create policy "entitlements read own or staff" on public.entitlements for select to authenticated
using (user_id = (select auth.uid()) or (select public.is_staff()));
create policy "payment reviews read own or finance staff" on public.payment_reviews for select to authenticated
using (user_id = (select auth.uid()) or (select public.has_platform_role('finance')) or (select public.has_platform_role('admin')));
create policy "customer submits pending payment review" on public.payment_reviews for insert to authenticated
with check (user_id = (select auth.uid()) and status = 'pending' and reviewed_by is null and reviewed_at is null);
create policy "affiliate profile read own or admin" on public.affiliate_profiles for select to authenticated
using (user_id = (select auth.uid()) or (select public.has_platform_role('admin')));
create policy "affiliate events read own or finance/admin" on public.affiliate_events for select to authenticated
using (affiliate_user_id = (select auth.uid()) or (select public.has_platform_role('finance')) or (select public.has_platform_role('admin')));
create policy "tickets read own or support staff" on public.support_tickets for select to authenticated
using (user_id = (select auth.uid()) or (select public.has_platform_role('support')) or (select public.has_platform_role('admin')));
create policy "customer creates own ticket" on public.support_tickets for insert to authenticated
with check (user_id = (select auth.uid()) and status = 'open' and assigned_to is null);
create policy "customer updates own ticket text while open" on public.support_tickets for update to authenticated
using (user_id = (select auth.uid()) and status = 'open')
with check (user_id = (select auth.uid()) and status = 'open' and assigned_to is null);
create policy "audit read security admin" on public.audit_events for select to authenticated
using ((select public.has_platform_role('security')) or (select public.has_platform_role('admin')));

revoke all on public.user_roles, public.entitlements, public.affiliate_profiles, public.affiliate_events, public.audit_events from anon, authenticated;
grant select on public.user_roles, public.entitlements, public.affiliate_profiles, public.affiliate_events to authenticated;
grant select on public.plans to authenticated;
grant select, update on public.profiles to authenticated;
grant select, insert on public.payment_reviews to authenticated;
grant select, insert, update on public.support_tickets to authenticated;

-- Intentionally omitted: wallet balances, deposits/withdrawals, live broker secrets,
-- automatic trading execution and public affiliate payout. Add only with reviewed ledger,
-- provider reconciliation, permissions, risk controls and compliance approval.
