import { platformEnv, jsonError } from "@/lib/platform-env";
function cookieDomain(request: Request) {
  const host = new URL(request.url).hostname.toLowerCase();
  return host === "dfxsignall.cv" || host.endsWith(".dfxsignall.cv") ? "; Domain=.dfxsignall.cv" : "";
}
export async function POST(request: Request) {
  let body: { email?: string; password?: string };
  try { body = await request.json(); } catch { return jsonError("Invalid request"); }
  if (!body.email || !body.password) return jsonError("Email and password are required.");
  try {
    const { url, anon } = platformEnv();
    const r = await fetch(`${url}/auth/v1/token?grant_type=password`, { method:"POST", headers:{apikey:anon,"Content-Type":"application/json"}, body:JSON.stringify({email:body.email.trim().toLowerCase(),password:body.password}), cache:"no-store" });
    const data = await r.json();
    if (!r.ok || !data.access_token) return jsonError("Email/password invalid, or email confirmation is required.", 401);
    const domain = cookieDomain(request);
    const response = Response.json({ok:true});
    response.headers.append("Set-Cookie", `dfx_access_token=${encodeURIComponent(data.access_token)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${data.expires_in || 3600}${domain}`);
    response.headers.append("Set-Cookie", `dfx_refresh_token=${encodeURIComponent(data.refresh_token)}; Path=/api/auth; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000${domain}`);
    return response;
  } catch { return jsonError("Authentication service is not configured.", 503); }
}
