-- Enforce signal audience at the database boundary, not only in the Next.js API.
-- Paid tiers inherit lower-tier feeds: Starter = Free+Starter, Pro = Free+Starter+Pro, Elite = all.
drop policy if exists "Clients can read published signals" on public.market_signals;
create policy "Clients can read entitled published signals"
on public.market_signals
for select
to authenticated
using (
  status in ('published','closed','cancelled')
  and (
    exists (
      select 1
      from public.user_roles ur
      where ur.user_id = (select auth.uid())
        and ur.role in ('admin','finance')
    )
    or
    case market_signals.plan_tier
      when 'free' then 0
      when 'starter' then 1
      when 'pro' then 2
      when 'elite' then 3
      else 99
    end <= coalesce((
      select max(
        case e.plan_id
          when 'starter' then 1
          when 'pro' then 2
          when 'elite' then 3
          else 0
        end
      )
      from public.entitlements e
      where e.user_id = (select auth.uid())
        and e.status = 'active'
        and (e.starts_at is null or e.starts_at <= now())
        and (e.ends_at is null or e.ends_at > now())
    ), 0)
  )
);
