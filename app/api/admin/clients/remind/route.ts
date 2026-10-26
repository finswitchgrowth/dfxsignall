import { currentUser, accessToken, jsonError, userRest } from "@/lib/platform-env";
import { sendNotice, safeEmail } from "@/lib/notifications";

export async function POST(request: Request) {
  const user = await currentUser(request);
  if (!user) return jsonError("Authentication required.", 401);
  const token = accessToken(request);
  if (!token) return jsonError("Session missing.", 401);
  const role = await userRest(`user_roles?user_id=eq.${encodeURIComponent(user.id)}&role=in.(admin,finance)&select=role`, token);
  if (!role.ok || !(await role.json()).length) return jsonError("Administrator/finance access required.", 403);

  const body = await request.json().catch(() => null) as { userId?: string; subject?: string; message?: string } | null;
  if (!body?.userId || !body.subject?.trim() || !body.message?.trim()) return jsonError("Client, subject and message are required.");
  if (body.subject.length > 160 || body.message.length > 5000) return jsonError("Subject or message is too long.");

  const profileResponse = await userRest(`profiles?id=eq.${encodeURIComponent(body.userId)}&select=id,email,display_name`, token);
  if (!profileResponse.ok) return jsonError("Could not load client profile.", 503);
  const profiles = await profileResponse.json() as Array<{ id: string; email?: string; display_name?: string }>;
  const client = profiles[0];
  if (!client?.email) return jsonError("This client has no email address on their profile.", 404);

  const subject = body.subject.trim();
  const message = body.message.trim();
  const html = `<h2>${safeEmail(subject)}</h2><p>Hello ${safeEmail(client.display_name || "there")},</p><p>${safeEmail(message).replace(/\n/g, "<br>")}</p><p>Regards,<br>DFXSIGNALL</p>`;
  const sent = await sendNotice({ to: client.email, subject, text: `Hello ${client.display_name || "there"},\n\n${message}\n\nRegards,\nDFXSIGNALL`, html });
  if (!sent) return jsonError("Email could not be sent. Check RESEND_API_KEY and RESEND_FROM_EMAIL in this deployment.", 502);
  const audit = await userRest("audit_events", token, { method: "POST", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ actor_user_id: user.id, action: "client_reminder_sent", entity_type: "profile", entity_id: client.id, reason: subject, metadata: { recipient: client.email } }) });
  return Response.json({ ok: true, sent: true, auditRecorded: audit.ok });
}
