# DFXSIGNALL Trust & Controlled Launch Runbook

Last reviewed: 2026-10-15

## Release policy
- Do not describe a deployment as launch-certified until the checks below have passed in production.
- Do not publish simulated data as live quotes or verified performance.
- Do not promise returns, win rates, capital protection, or guaranteed execution.
- Live broker execution is disabled. Tools-only purchases do not grant signal-feed access.
- Obtain qualified Indian regulatory/legal review for the exact services and instruments before paid promotion at scale.

## Pre-pilot technical checks
- [ ] Register a new user, verify email, sign in, refresh, sign out, and confirm protected routes reject signed-out sessions.
- [ ] Verify role isolation: regular users cannot access admin APIs; finance role cannot create/edit/publish signals.
- [ ] Submit a payment proof, verify the request remains visible in admin history, approve/reject it, and confirm the customer entitlement changes exactly once.
- [ ] Confirm payment review does not erase the customer or submission record and duplicate review attempts are safe.
- [ ] Verify admin and customer notifications arrive, failed sends are observable, and no secrets or full payment data appear in logs.
- [ ] Verify each tier receives only its allowed feed and daily visibility allowance: Free 1, Starter 2, Pro 5, Elite unlimited; historical closed/cancelled signals remain reviewable.
- [ ] Verify BUY/SELL published levels reject stop-loss/take-profit relationships that contradict the direction.
- [ ] Verify signal publication, closure, cancellation, timestamps, audience tier and historical record behavior.
- [ ] Test on a real Android device and desktop viewport; check navigation, forms, error messages, keyboard accessibility and slow connections.
- [ ] Review production error logs after exercising every critical route; do not treat an empty log query as proof of successful tests.
- [ ] Run dependency/security review and confirm environment variables are configured only in the hosting provider.

## Trust and compliance checks
- [ ] Publish a real support contact and expected response window.
- [ ] Publish terms, privacy notice, subscription renewal/expiry details, payment-review timing, refund/cancellation policy and complaint handling.
- [ ] Have qualified counsel review the legal classification and applicable SEBI/RBI/consumer-protection/data-protection obligations before marketing paid recommendations or any investment-related service.
- [ ] Label data source, timestamp and delay where available; label simulations explicitly.
- [ ] Publish a dated methodology for performance reporting; record all signals before outcomes and include losses, costs and drawdowns.
- [ ] Never collect a broker password or trading password for an informational signal service.

## Pilot and expansion gates
- Pilot with a small, invite-only cohort; no broad paid acquisition until critical journeys pass.
- Track registrations, activation, failed payments, approval time, support tickets, signal availability, daily-limit behavior, refunds, renewals and churn.
- Review incidents weekly. Pause onboarding and paid promotion for any critical security issue, lost payment record, incorrect entitlement, misleading market data, or unresolved legal question.
- Expand only after the pilot shows stable operations, transparent performance records, positive customer feedback and sustainable unit economics.

## Evidence record
For each completed check, record date/time, tester, account role (never password), expected result, observed result, screenshot or log reference, and pass/fail. Do not store passwords, full payment credentials or identity documents in this checklist.
