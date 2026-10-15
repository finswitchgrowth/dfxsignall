const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function supabaseConfigured() { return Boolean(url && key); }

export async function authRequest(path: string, body: Record<string, unknown>) {
  if (!url || !key) throw new Error("Authentication is not configured yet. Please contact support.");
  const response = await fetch(`${url}/auth/v1/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: key },
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.msg || data.message || data.error_description || "Request failed. Please try again.");
  return data;
}
