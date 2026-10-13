import { currentUser, accessToken, jsonError, userRest } from "@/lib/platform-env";
import { sendNotice, safeEmail } from "@/lib/notifications";

async function requireAdmin(request: Request) {
  const user = await currentUser(request);
  if (!user) return { error: jsonError("Authentication required.", 401) };
  const token = accessToken(request) || "";
  if (!token) return { error: jsonError("Session missing.", 401) };
  const roleResponse = await userRest(`user_roles?user_id=eq.${encodeURIComponent(user.id)}&role=in.(admin,finance)&select=role`, token);
  const roles = roleResponse.ok ? await roleResponse.json() as Array<{role:string}> : [];
  if (!roleResponse.ok || !roles.length) return { error: jsonError("Administrator/finance access required.", 403) };
  return { user, token };
}

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if ("error" in auth) return auth.error;
  const [profilesResponse, paymentsResponse, entitlementsResponse, plansResponse] = await Promise.all([
    userRest("profiles?select=id,display_name,email,created_at&order=created_at.desc&limit=2000", auth.token),
    userRest("payment_reviews?select=id,user_id,plan_id,amount_minor,currency,provider,provider_reference,created_at,status,reviewer_note,reviewed_at,proof_storage_path&order=created_at.desc&limit=5000", auth.token),
    userRest("entitlements?select=id,user_id,plan_id,status,starts_at,ends_at,source_payment_id,created_at&order=created_at.desc&limit=5000", auth.token),
    userRest("plans?select=id,name,price_minor,currency,entitlement_days,billing_interval&order=name.asc&limit=200", auth.token)
  ]);
  if (![profilesResponse,paymentsResponse,entitlementsResponse,plansResponse].every(r=>r.ok)) return jsonError("Could not load client report. Check administrator access and database permissions.", 503);
  const [profiles,payments,entitlements,plans] = await Promise.all([
    profilesResponse.json(), paymentsResponse.json(), entitlementsResponse.json(), plansResponse.json()
  ]) as [Array<Record<string, any>>, Array<Record<string, any>>, Array<Record<string, any>>, Array<Record<string, any>>];
  const byUser = new Map<string, any>();
  for (const profile of profiles) byUser.set(profile.id, { ...profile, payments: [], entitlements: [] });
  for (const payment of payments) {
    if (!byUser.has(payment.user_id)) byUser.set(payment.user_id, { id: payment.user_id, display_name: null, email: null, created_at: null, payments: [], entitlements: [] });
    byUser.get(payment.user_id).payments.push(payment);
  }
  for (const entitlement of entitlements) {
    if (!byUser.has(entitlement.user_id)) byUser.set(entitlement.user_id, { id: entitlement.user_id, display_name: null, email: null, created_at: null, payments: [], entitlements: [] });
    byUser.get(entitlement.user_id).entitlements.push(entitlement);
  }
  const planMap = Object.fromEntries(plans.map(p=>[p.id,p.name]));
  const clients = Array.from(byUser.values()).map(client => ({
    ...client,
    payments: client.payments.map((p:any)=>({...p,plan_name:planMap[p.plan_id]||p.plan_id})),
    entitlements: client.entitlements.map((e:any)=>({...e,plan_name:planMap[e.plan_id]||e.plan_id}))
  })).sort((a,b)=>String(b.created_at||b.payments[0]?.created_at||"").localeCompare(String(a.created_at||a.payments[0]?.created_at||"")));
  return Response.json({ clients, totalClients: clients.length, totalPayments: payments.length }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  const auth = await requireAdmin(request);
  if ("error" in auth) return auth.error;
  const body = await request.json().catch(()=>null) as { userId?: string; subject?: string; message?: string } | null;
  if (!body?.userId || typeof body.subject !== "string" || typeof body.message !== "string") return jsonError("Client, subject and message are required.");
  const subject = body.subject.trim().slice(0,160);
  const message = body.message.trim().slice(0,5000);
  if (!subject || !message) return jsonError("Subject and message cannot be empty.");
  const profileResponse = await userRest(`profiles?id=eq.${encodeURIComponent(body.userId)}&select=id,email,display_name`, auth.token);
  if (!profileResponse.ok) return jsonError("Could not find client.", 503);
  const profiles = await profileResponse.json() as Array<{id:string;email:string|null;display_name:string|null}>;
  const profile = profiles[0];
  if (!profile?.email) return jsonError("This client does not have an email address on their profile.", 404);
  const html = `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#101828"><p>Hello ${safeEmail(profile.display_name||"Client")},</p><div style="white-space:pre-wrap">${safeEmail(message)}</div><p style="color:#667085;font-size:12px">DFXSIGNALL client support</p></div>`;
  const sent = await sendNotice({ to: profile.email, subject, text: `Hello ${profile.display_name||"Client"},\n\n${message}\n\nDFXSIGNALL client support`, html });
  if (!sent) return jsonError("Email could not be sent. Check the Resend environment variables and sender verification.", 502);
  return Response.json({ ok: true, message: "Reminder email sent." });
}
