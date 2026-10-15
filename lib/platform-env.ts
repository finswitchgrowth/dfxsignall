export function platformEnv() {
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL||process.env.SUPABASE_URL;
 const anon=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY||process.env.SUPABASE_ANON_KEY;
 if(!url||!anon) throw new Error("Supabase environment is not configured");
 return {url:url.replace(/\/$/,""),anon};
}
export function jsonError(message:string,status=400){return Response.json({error:message},{status});}
export function accessToken(request:Request){
 const bearer=request.headers.get("authorization")?.replace(/^Bearer\s+/i,"");
 const cookie=request.headers.get("cookie")?.split(";").map(v=>v.trim()).find(v=>v.startsWith("dfx_access_token="))?.slice("dfx_access_token=".length);
 const token=bearer||cookie;
 return token?decodeURIComponent(token):null;
}
export async function currentUser(request:Request){
 const {url,anon}=platformEnv();
 const token=accessToken(request);
 if(!token)return null;
 const r=await fetch(`${url}/auth/v1/user`,{headers:{apikey:anon,Authorization:`Bearer ${token}`},cache:"no-store"});
 if(!r.ok)return null;
 return await r.json() as {id:string;email?:string};
}
export async function userRest(path:string,token:string,init:RequestInit={}){
 const {url,anon}=platformEnv();
 return fetch(`${url}/rest/v1/${path}`,{...init,headers:{apikey:anon,Authorization:`Bearer ${token}`,"Content-Type":"application/json",...(init.headers||{})},cache:"no-store"});
}
