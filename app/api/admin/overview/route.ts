import { accessToken, currentUser, jsonError, platformEnv, userRest } from "@/lib/platform-env";

const selections = {
  profiles: "profiles?select=id,display_name,email,created_at&order=created_at.desc&limit=500",
  roles: "user_roles?select=user_id,role,granted_at&limit=1000",
  entitlements: "entitlements?select=id,user_id,plan_id,status,starts_at,ends_at,created_at&order=created_at.desc&limit=1000",
  payments: "payment_reviews?select=id,user_id,plan_id,amount_minor,currency,provider,provider_reference,proof_storage_path,status,reviewer_note,reviewed_by,reviewed_at,created_at&order=created_at.desc&limit=1000",
  plans: "plans?select=id,name,currency,price_minor,signal_limit_per_day,auto_trading_enabled,active,billing_interval,entitlement_days&order=price_minor.asc",
  tickets: "support_tickets?select=id,user_id,subject,body,status,assigned_to,created_at,updated_at&order=updated_at.desc&limit=500",
  affiliates: "affiliate_profiles?select=user_id,referral_code,status,commission_basis_points,created_at&order=created_at.desc&limit=500",
  affiliateEvents: "affiliate_events?select=id,affiliate_user_id,referred_user_id,payment_id,amount_minor,currency,status,created_at&order=created_at.desc&limit=500",
  audit: "audit_events?select=id,actor_user_id,action,entity_type,entity_id,reason,metadata,created_at&order=created_at.desc&limit=300",
} as const;

export async function GET(request: Request) {
  const user = await currentUser(request);
  if (!user) return jsonError("Authentication required.", 401);
  const token = accessToken(request);
  if (!token) return jsonError("Session missing.", 401);
  const roleRes = await userRest(`user_roles?user_id=eq.${user.id}&role=eq.admin&select=role`, token);
  if (!roleRes.ok || !(await roleRes.json()).length) return jsonError("Administrator access required.", 403);

  const entries = Object.entries(selections);
  const results = await Promise.all(entries.map(async ([key, path]) => {
    try {
      const response = await userRest(path, token);
      if (!response.ok) return [key, { data: [], error: `Could not load ${key}.` }] as const;
      return [key, { data: await response.json(), error: null }] as const;
    } catch {
      return [key, { data: [], error: `Could not load ${key}.` }] as const;
    }
  }));
  const data = Object.fromEntries(results.map(([key, value]) => [key, value.data]));
  const { url, anon } = platformEnv();
  const paymentRows = (data.payments || []) as Array<{ proof_storage_path?: string | null; [key:string]: unknown }>;
  data.payments = await Promise.all(paymentRows.map(async (payment) => {
    const path = payment.proof_storage_path;
    if (!path) return { ...payment, proof_url: null };
    try {
      const encodedPath = path.split("/").map(encodeURIComponent).join("/");
      const signed = await fetch(url + "/storage/v1/object/sign/payment-proofs/" + encodedPath, {
        method: "POST",
        headers: { apikey: anon, Authorization: "Bearer " + token, "Content-Type": "application/json" },
        body: JSON.stringify({ expiresIn: 600 }),
        cache: "no-store",
      });
      const result = await signed.json().catch(() => ({})) as { signedURL?: string };
      return { ...payment, proof_url: signed.ok && result.signedURL ? url + "/storage/v1" + (result.signedURL.startsWith("/") ? result.signedURL : "/" + result.signedURL) : null };
    } catch { return { ...payment, proof_url: null }; }
  }));
  const warnings = results.filter(([, value]) => value.error).map(([, value]) => value.error);
  const profiles = data.profiles as Array<{id:string}>;
  const entitlements = data.entitlements as Array<{status:string}>;
  const payments = data.payments as Array<{status:string;amount_minor:number}>;
  const tickets = data.tickets as Array<{status:string}>;
  const totals = {
    clients: profiles.length,
    activeEntitlements: entitlements.filter(x => x.status === "active").length,
    pendingPayments: payments.filter(x => x.status === "pending").length,
    openTickets: tickets.filter(x => !["resolved","closed"].includes(x.status)).length,
    reviewedPayments: payments.filter(x => x.status === "approved").length,
    approvedVolumeMinor: payments.filter(x => x.status === "approved").reduce((sum,x)=>sum+(x.amount_minor||0),0),
  };
  return Response.json({ data, totals, warnings, generatedAt: new Date().toISOString(), viewer: { id:user.id, email:user.email } }, { headers: { "Cache-Control": "no-store" } });
}
