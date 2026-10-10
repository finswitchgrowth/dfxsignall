export function platformEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !anon || !service) throw new Error("Supabase environment is not configured");
  return { url: url.replace(/\/$/, ""), anon, service };
}
export function jsonError(message: string, status = 400) {
  return Response.json({ error: message }, { status });
}
export async function currentUser(request: Request) {
  const { url, anon } = platformEnv();
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ||
    request.headers.get("cookie")?.split(";").map(v => v.trim()).find(v => v.startsWith("dfx_access_token="))?.slice("dfx_access_token=".length);
  if (!token) return null;
  const response = await fetch(`${url}/auth/v1/user`, { headers: { apikey: anon, Authorization: `Bearer ${decodeURIComponent(token)}` }, cache: "no-store" });
  if (!response.ok) return null;
  return await response.json() as { id: string; email?: string };
}
export async function supabaseRest(path: string, init: RequestInit = {}) {
  const { url, service } = platformEnv();
  return fetch(`${url}/rest/v1/${path}`, {
    ...init, headers: { apikey: service, Authorization: `Bearer ${service}`, "Content-Type": "application/json", ...(init.headers || {}) }, cache: "no-store",
  });
}
