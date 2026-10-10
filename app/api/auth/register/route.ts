import { platformEnv, jsonError } from "@/lib/platform-env";
export async function POST(request: Request) {
  let body: { email?: string; password?: string; displayName?: string };
  try { body = await request.json(); } catch { return jsonError("Invalid request"); }
  const email = body.email?.trim().toLowerCase(), password = body.password, displayName = body.displayName?.trim().slice(0,80);
  if (!email || !password || password.length < 10) return jsonError("Valid email and password of at least 10 characters are required.");
  try {
    const { url, anon } = platformEnv();
    const r = await fetch(`${url}/auth/v1/signup`, { method:"POST", headers:{apikey:anon,"Content-Type":"application/json"}, body:JSON.stringify({email,password,data:{display_name:displayName}}), cache:"no-store" });
    const data = await r.json();
    if (!r.ok) return jsonError(data.msg || data.message || "Registration failed.", r.status);
    const response = Response.json({ ok:true, message: data.session ? "Account created." : "Check your email to confirm your account." });
    if (data.session?.access_token) response.headers.append("Set-Cookie", `dfx_access_token=${encodeURIComponent(data.session.access_token)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${data.session.expires_in || 3600}`);
    if (data.session?.refresh_token) response.headers.append("Set-Cookie", `dfx_refresh_token=${encodeURIComponent(data.session.refresh_token)}; Path=/api/auth; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000`);
    return response;
  } catch { return jsonError("Authentication service is not configured.", 503); }
}
