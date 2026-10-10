export async function POST() {
 const r=Response.json({ok:true});
 r.headers.append("Set-Cookie","dfx_access_token=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0");
 r.headers.append("Set-Cookie","dfx_refresh_token=; Path=/api/auth; HttpOnly; Secure; SameSite=Lax; Max-Age=0");
 return r;
}
