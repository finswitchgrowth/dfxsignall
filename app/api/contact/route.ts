import { jsonError } from "@/lib/platform-env";
export const runtime = "nodejs";
const clean = (v: unknown, max = 1000) => typeof v === "string" ? v.trim().slice(0, max) : "";
export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin) {
    try { if (new URL(origin).host !== new URL(request.url).host) return jsonError("Invalid request origin.", 403); }
    catch { return jsonError("Invalid request origin.", 403); }
  }
  const raw = await request.json().catch(() => null);
  if (!raw || typeof raw !== "object") return jsonError("Invalid form submission.");
  const b = raw as Record<string, unknown>;
  if (clean(b.website)) return Response.json({ ok: true });
  const name = clean(b.name, 100), email = clean(b.email, 254).toLowerCase(), topic = clean(b.topic, 80), message = clean(b.message, 4000);
  if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || message.length < 5)
    return jsonError("Enter a valid name, email and message.");
  const allowed = ["General enquiry", "Business & partnerships", "Platform launch updates", "Security report", "Compliance & legal"];
  if (!allowed.includes(topic)) return jsonError("Select a valid topic.");
  const key = process.env.WEB3FORMS_ACCESS_KEY;
  if (!key) return jsonError("Contact delivery is not configured yet. Please email dfxsignall@gmail.com directly.", 503);
  const form = new FormData();
  form.set("access_key", key);
  form.set("subject", `[DFXSIGNALL] ${topic} from ${name}`);
  form.set("from_name", "DFXSIGNALL Website");
  form.set("name", name); form.set("email", email); form.set("message", message);
  try {
    const r = await fetch("https://api.web3forms.com/submit", { method: "POST", body: form, cache: "no-store" });
    const data = await r.json().catch(() => ({}));
    if (!r.ok || data.success !== true) {
      const providerMessage = clean((data as Record<string, unknown>)?.message, 300);
      console.error("[contact] Web3Forms rejected submission", { status: r.status, providerMessage: providerMessage || "No provider message" });
      const safeMessage = (providerMessage || "The email provider rejected the submission.").replace(/[^a-zA-Z0-9 .,;:'()_\-/]/g, " ").replace(/\s+/g, " ").slice(0, 180);
      return jsonError(`Contact delivery failed: ${safeMessage} Please email dfxsignall@gmail.com if the issue continues.`, 502);
    }
    return Response.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("[contact] Web3Forms request failed", error instanceof Error ? error.message : "unknown error");
    return jsonError("Contact delivery is temporarily unavailable. Please email dfxsignall@gmail.com directly.", 502);
  }
}
