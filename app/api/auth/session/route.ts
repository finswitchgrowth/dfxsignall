import { platformEnv, jsonError } from "@/lib/platform-env";
export async function POST(request:Request){
 const body=await request.json().catch(()=>null) as {access_token?:string;refresh_token?:string}|null;
 if(!body?.access_token||body.access_token.length>10000)return jsonError("Invalid authentication session.",401);
 try{
  const {url,anon}=platformEnv();
  const verify=await fetch(`${url}/auth/v1/user`,{headers:{apikey:anon,Authorization:`Bearer ${body.access_token}`},cache:"no-store"});
  if(!verify.ok)return jsonError("Could not verify the sign-in session.",401);
  const response=Response.json({ok:true});
  response.headers.append("Set-Cookie",`dfx_access_token=${encodeURIComponent(body.access_token)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=3600`);
  if(body.refresh_token)response.headers.append("Set-Cookie",`dfx_refresh_token=${encodeURIComponent(body.refresh_token)}; Path=/api/auth; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000`);
  return response;
 }catch{return jsonError("Authentication service is unavailable.",503);}
}
