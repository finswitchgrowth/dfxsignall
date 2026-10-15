import { currentUser, accessToken, jsonError, userRest } from "@/lib/platform-env";

const tierRank: Record<string, number> = { free: 0, starter: 1, pro: 2, elite: 3 };
const dailyLimit: Record<string, number> = { free: 1, starter: 2, pro: 5, elite: Number.POSITIVE_INFINITY };

export async function GET(request: Request) {
  const user = await currentUser(request);
  if (!user) return jsonError("Sign in required.", 401);
  const token = accessToken(request);
  if (!token) return jsonError("Session missing.", 401);

  const entitlementResponse = await userRest(
    `entitlements?user_id=eq.${encodeURIComponent(user.id)}&status=eq.active&plan_id=in.(starter,pro,elite)&select=plan_id,starts_at,ends_at&limit=20`,
    token
  );
  if (!entitlementResponse.ok) return jsonError("Could not verify signal access.", 503);

  const now = Date.now();
  const entitlements = await entitlementResponse.json() as Array<{
    plan_id: string;
    starts_at: string | null;
    ends_at: string | null;
  }>;
  const activeTier = entitlements.reduce((highest, entitlement) => {
    const startsAt = entitlement.starts_at ? new Date(entitlement.starts_at).getTime() : 0;
    const endsAt = entitlement.ends_at ? new Date(entitlement.ends_at).getTime() : Number.POSITIVE_INFINITY;
    if (startsAt > now || endsAt <= now) return highest;
    return Math.max(highest, tierRank[entitlement.plan_id] ?? 0);
  }, 0);
  const tier = Object.keys(tierRank).find(key => tierRank[key] === activeTier) || "free";
  const allowedTiers = Object.entries(tierRank).filter(([, rank]) => rank <= activeTier).map(([name]) => name);
  const tierFilter = allowedTiers.map(t => `"${t}"`).join(",");
  const signalsResponse = await userRest(
    `market_signals?select=id,symbol,market,direction,entry_price,stop_loss,take_profit,timeframe,confidence,status,summary,plan_tier,published_at,closed_at,created_at&status=in.(published,closed,cancelled)&plan_tier=in.(${tierFilter})&order=published_at.desc.nullslast,created_at.desc&limit=200`,
    token
  );
  if (!signalsResponse.ok) return jsonError("Could not load market signals.", 503);

  const signals = await signalsResponse.json() as Array<{
    id: string;
    status: string;
    published_at: string | null;
    [key: string]: unknown;
  }>;
  // The daily allowance limits how many newly published signals appear in the current UTC day.
  // Historical closed/cancelled signals remain available for transparent review.
  const utcMidnight = new Date();
  utcMidnight.setUTCHours(0, 0, 0, 0);
  const limit = dailyLimit[tier] ?? 1;
  let todayPublished = 0;
  const visibleSignals = signals.filter(signal => {
    if (signal.status !== "published" || !signal.published_at) return true;
    const publishedAt = new Date(signal.published_at).getTime();
    if (!Number.isFinite(publishedAt) || publishedAt < utcMidnight.getTime()) return true;
    if (todayPublished >= limit) return false;
    todayPublished += 1;
    return true;
  });

  return Response.json(
    { signals: visibleSignals, access: { tier, dailyLimit: Number.isFinite(limit) ? limit : null, todayVisible: todayPublished } },
    { headers: { "Cache-Control": "no-store" } }
  );
}
