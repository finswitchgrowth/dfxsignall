import {platformEnv,jsonError} from "@/lib/platform-env";
export async function POST(request:Request){
 const body=await request.json().catch(()=>null) as {token_hash?:string;type?:string}|null;
 const tokenHash=body?.token_hash?.trim();const type=body?.type||"signup";
 if(!tokenHash||tokenHash.length>2048||!["signup","email","recovery","invite","magiclink","email_change"].includes(type))return jsonError("Invalid or expired verification link.",400);
 try{
  const {url,anon}=platformEnv();
  const response=await fetch(`${url}/auth/v1/verify`,{method:"POST",headers:{apikey:anon,"Content-Type":"application/json"},body:JSON.stringify({token_hash:tokenHash,type}),cache:"no-store"});
  const data=await response.json().catch(()=>({}));
  if(!response.ok||!data.access_token)return jsonError("This verification link is invalid or expired. Request a new email and try again.",400);
  return Response.json({ok:true,access_token:data.access_token,refresh_token:data.refresh_token||null},{headers:{"Cache-Control":"no-store"}});
 }catch{return jsonError("Authentication service is temporarily unavailable.",503);}
}
