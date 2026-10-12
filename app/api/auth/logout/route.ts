function cookieDomain(request: Request) {
 const host=new URL(request.url).hostname.toLowerCase();
 return host==="dfxsignall.cv"||host.endsWith(".dfxsignall.cv")?"; Domain=.dfxsignall.cv":"";
}
export async function POST(request:Request){
 const domain=cookieDomain(request);
 const r=Response.json({ok:true},{headers:{"Cache-Control":"no-store"}});
 r.headers.append("Set-Cookie",`dfx_access_token=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0${domain}`);
 r.headers.append("Set-Cookie",`dfx_refresh_token=; Path=/api/auth; HttpOnly; Secure; SameSite=Lax; Max-Age=0${domain}`);
 return r;
}
