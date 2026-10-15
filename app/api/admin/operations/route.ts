import { accessToken, currentUser, jsonError, userRest } from "@/lib/platform-env";

type Body = { action?: string; ticketId?: string; status?: string; assignedTo?: string | null; entitlementId?: string; planId?: string; active?: boolean; priceMinor?: number; signalLimit?: number | null; entitlementDays?: number | null };
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function POST(request: Request) {
  const user = await currentUser(request);
  if (!user) return jsonError("Authentication required.", 401);
  const token = accessToken(request);
  if (!token) return jsonError("Session missing.", 401);
  const roleRes = await userRest(`user_roles?user_id=eq.${user.id}&role=eq.admin&select=role`, token);
  if (!roleRes.ok || !(await roleRes.json()).length) return jsonError("Administrator access required.", 403);
  const body = await request.json().catch(() => null) as Body | null;
  if (!body?.action) return jsonError("Action is required.");
  let rpc = "";
  let payload: Record<string, unknown> = {};

  if (body.action === "ticket") {
    if (!body.ticketId || !UUID.test(body.ticketId) || !["open","in_progress","waiting_customer","resolved","closed"].includes(body.status || "")) return jsonError("Valid ticket and status are required.");
    if (body.assignedTo && !UUID.test(body.assignedTo)) return jsonError("Assigned user ID is invalid.");
    rpc = "admin_update_support_ticket";
    payload = { p_ticket_id: body.ticketId, p_status: body.status, p_assigned_to: body.assignedTo || null };
  } else if (body.action === "entitlement") {
    if (!body.entitlementId || !UUID.test(body.entitlementId) || !["active","suspended","cancelled","expired","pending"].includes(body.status || "")) return jsonError("Valid entitlement and status are required.");
    rpc = "admin_update_entitlement";
    payload = { p_entitlement_id: body.entitlementId, p_status: body.status };
  } else if (body.action === "plan") {
    if (!body.planId || body.planId.length > 100 || typeof body.active !== "boolean" || !Number.isInteger(body.priceMinor) || (body.priceMinor ?? -1) < 0 || (body.signalLimit !== null && (!Number.isInteger(body.signalLimit) || (body.signalLimit ?? -1) < 0)) || (body.entitlementDays !== null && (!Number.isInteger(body.entitlementDays) || (body.entitlementDays ?? 0) < 1))) return jsonError("Plan values are invalid.");
    rpc = "admin_update_plan";
    payload = { p_plan_id: body.planId, p_active: body.active, p_price_minor: body.priceMinor, p_signal_limit: body.signalLimit, p_entitlement_days: body.entitlementDays };
  } else return jsonError("Unknown admin action.");

  const response = await userRest(`rpc/${rpc}`, token, { method: "POST", body: JSON.stringify(payload) });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) return jsonError((result as {message?:string}).message || "Admin operation failed.", response.status === 401 ? 401 : response.status === 403 ? 403 : 400);
  return Response.json({ ok: true, result });
}
