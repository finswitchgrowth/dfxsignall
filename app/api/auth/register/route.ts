import { platformEnv, jsonError } from "@/lib/platform-env";
function cookieDomain(request: Request) {
  const host = new URL(request.url).hostname.toLowerCase();
  return host === "dfxsignall.cv" || host.endsWith(".dfxsignall.cv") ? "; Domain=.dfxsignall.cv" : "";
}
export async function POST(request: Request) {
  let body: { email?: string; password?: string; displayName?: string };
  try { body = await request.json(); } catch { return jsonError("Invalid request"); }
  const email = body.email?.trim().toLowerCase(), password = body.password, displayName = body.displayName?.trim().slice(0,80);
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !password || password.length < 10) return jsonError("Enter a valid email and password of at least 10 characters.");
  try {
    const { url, anon } = platformEnv();
    const siteUrl=(process.env.NEXT_PUBLIC_SITE_URL||"https://www.dfxsignall.cv").replace(/\/$/,"");
    const r = await fetch(`${url}/auth/v1/signup`, {
      method:"POST",
      headers:{apikey:anon,"Content-Type":"application/json"},
      body:JSON.stringify({email,password,data:{display_name:displayName},options:{emailRedirectTo:`${siteUrl}/auth/callback`}}),
      cache:"no-store"
    });
    const data = await r.json();
    if (!r.ok) return jsonError(data.msg || data.message || "Registration failed.", r.status);
    const response = Response.json({ ok:true, message: data.session ? "Account created. You can sign in." : "Account created. Open the verification email to confirm your address, then return to sign in." });
    response.headers.set("Cache-Control","no-store");
    const domain=cookieDomain(request);
    if (data.session?.access_token) response.headers.append("Set-Cookie", `dfx_access_token=${encodeURIComponent(data.session.access_token)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${data.session.expires_in || 3600}${domain}`);
    if (data.session?.refresh_token) response.headers.append("Set-Cookie", `dfx_refresh_token=${encodeURIComponent(data.session.refresh_token)}; Path=/api/auth; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000${domain}`);
    return response;
  } catch { return jsonError("Authentication service is not configured.", 503); }
}
