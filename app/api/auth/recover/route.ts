import {platformEnv,jsonError} from "@/lib/platform-env";
export async function POST(request:Request){
 const body=await request.json().catch(()=>null) as {email?:string;redirectTo?:string}|null;
 const email=body?.email?.trim().toLowerCase();
 if(!email||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return jsonError("Enter a valid email address.");
 try{const {url,anon}=platformEnv();const r=await fetch(`${url}/auth/v1/recover`,{method:"POST",headers:{apikey:anon,"Content-Type":"application/json"},body:JSON.stringify({email,redirect_to:body?.redirectTo||undefined}),cache:"no-store"});if(!r.ok)return jsonError("Could not send recovery email. Please try again later.",502);return Response.json({ok:true});}catch{return jsonError("Password recovery is not configured.",503);}
}
