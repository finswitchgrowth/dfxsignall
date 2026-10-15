import { currentUser, accessToken, jsonError, userRest } from "@/lib/platform-env";
export async function GET(request:Request){const user=await currentUser(request);if(!user)return jsonError("Authentication required.",401);const token=accessToken(request);if(!token)return jsonError("Session missing.",401);const role=await userRest(`user_roles?user_id=eq.${encodeURIComponent(user.id)}&role=in.(admin,finance)&select=role`,token);if(!role.ok||!(await role.json()).length)return jsonError("Administrator/finance access required.",403);const [profilesR,paymentsR,entitlementsR]=await Promise.all([userRest("profiles?select=id,email,display_name,created_at&order=created_at.desc&limit=1000",token),userRest("payment_reviews?select=id,user_id,plan_id,amount_minor,currency,provider,status,created_at,reviewed_at,reviewer_note&order=created_at.desc&limit=2000",token),userRest("entitlements?select=id,user_id,plan_id,status,starts_at,ends_at,source_payment_id,created_at&order=created_at.desc&limit=2000",token)]);if(!profilesR.ok||!paymentsR.ok||!entitlementsR.ok)return jsonError("Could not load client report. Check admin read permissions for profiles, payments and entitlements.",503);return Response.json({clients:await profilesR.json(),payments:await paymentsR.json(),entitlements:await entitlementsR.json()},{headers:{"Cache-Control":"no-store"}});}

export async function POST(request: Request) {
  const user = await currentUser(request);
  if (!user) return jsonError("Authentication required.", 401);
  const token = accessToken(request);
  if (!token) return jsonError("Session missing.", 401);
  const role = await userRest(`user_roles?user_id=eq.${encodeURIComponent(user.id)}&role=in.(admin,finance)&select=role`, token);
  if (!role.ok || !(await role.json()).length) return jsonError("Administrator/finance access required.", 403);
  const body = await request.json().catch(() => null) as { userId?: string; subject?: string; message?: string } | null;
  if (!body?.userId || typeof body.subject !== "string" || typeof body.message !== "string") return jsonError("Client, subject and message are required.");
  const subject = body.subject.trim().slice(0, 160);
  const message = body.message.trim().slice(0, 4000);
  if (subject.length < 3 || message.length < 5) return jsonError("Subject or message is too short.");
  const profile = await userRest(`profiles?id=eq.${encodeURIComponent(body.userId)}&select=id,email&limit=1`, token);
  if (!profile.ok) return jsonError("Could not find this client.", 404);
  const rows = await profile.json() as Array<{ id: string; email: string | null }>;
  if (!rows[0]?.email) return jsonError("This client has no email address on their profile.", 409);
  const { sendNotice, safeEmail } = await import("@/lib/notifications");
  const sent = await sendNotice({to: rows[0].email, subject: subject.startsWith("DFXSIGNALL") ? subject : `DFXSIGNALL: ${subject}`, text: message, html: `<h2>${safeEmail(subject)}</h2><p>${safeEmail(message).replace(/\\n/g, "<br/>")}</p><p>DFXSIGNALL Client Support</p>`});
  if (!sent) return jsonError("Email could not be sent. Check Resend configuration and sender verification.", 502);
  return Response.json({ok:true,sent:true});
}
