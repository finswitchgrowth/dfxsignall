# DFXSIGNALL Platform Blueprint

Status: implementation blueprint for the next platform release. This file is not proof that features are deployed or enabled.

## Product roles
- Customer/trader: account, profile, plan entitlements, signal feed, saved watchlists, broker connection status, notifications, support requests, privacy/security settings.
- Affiliate/partner: referral link/code, clicks and qualified referrals, conversion state, commission ledger, payout requests, fraud/dispute status. Commission is credited only after a payment is verified and cleared; no self-referrals.
- Support staff: scoped support queue and customer communication; no access to secrets, payment credentials, or trading execution controls.
- Finance reviewer: payment-proof queue, reconciliation, refund/dispute status, exportable audit trail; dual approval for sensitive financial actions.
- Admin: user/role management, plans/entitlements, signals, content, payment verification, affiliate configuration, audit log and feature flags.
- Security owner: MFA/role review, incident logs, session revocation and global trading kill switch. High-risk actions require step-up authentication and audit reason.

## Product tiers (prior user-approved draft; confirm before public checkout)
- Free: 1 quality signal/day.
- Premium: USD $25/month, up to 5 signals/day.
- Auto Trading: USD $199/month.
These are product requirements, not currently live prices or a promise of returns. Checkout must remain disabled until provider, tax, refund, jurisdiction and compliance checks are completed.

## Trading and broker safety
- Support demo first; live mode disabled by default and requires explicit opt-in, eligibility checks where applicable, verified broker/account capability and risk acknowledgement.
- MT4/MT5 connectivity must use a secure integration/bridge; never collect or store broker passwords in this app.
- Validate signed webhooks, replay protection, account ownership, subscription entitlement and idempotency before processing.
- Risk controls: broker-supported instruments/timeframes, position sizing, SL/TP, max positions, daily loss shutdown, exposure/margin/spread/slippage limits, connection-loss fail-safe, emergency close and immutable audit events.
- No guaranteed profits, fabricated performance, martingale, or automatic deposits/withdrawals.
- Keep signal examples and market values labelled demo until a licensed provider is connected and independently tested.

## Architecture principles
- Next.js web app; Supabase Auth + Postgres with RLS; server-only service-role key; provider webhooks verified server-side; email through verified provider; observable logs and backups.
- Deny-by-default RLS. Clients can read/update only their own safe profile and submit requests; financial state, entitlements, roles, affiliate commissions and audit rows are server/admin controlled.
- Use append-only ledger events instead of mutating balances. Never trust a browser-provided amount, role, payment status, referral commission or trade result.
- Secrets only in Vercel/Supabase environment variables; never commit .env, API keys or broker credentials.

## Release gates
1. Schema review and migration on non-production branch/project.
2. Configure Supabase Auth, redirect URLs, email templates, MFA policy and server environment variables.
3. Add authenticated API routes with validation, origin protection where applicable, rate limits, idempotency and audit events.
4. Build customer, admin and affiliate screens on server-verified roles.
5. Integrate a payment provider in test mode; manual proof review is a fallback, never a simulated success.
6. Automated unit/integration/RLS tests, security review, mobile accessibility and backup/restore rehearsal.
7. Test demo broker integration, risk limits and kill switch before considering any live execution.
8. Promote to production only after preview build and end-to-end tests pass.

## Current verified gap
The current repository README and content/site.ts explicitly describe login, registration, dashboard, admin, payments and support tickets as coming soon. The contact form currently opens the visitor's mail app; it does not persist enquiries. This blueprint and the proposed schema do not change that until the application code, secrets and deployment are implemented and tested.
