import { currentUser, accessToken, jsonError, platformEnv, userRest } from "@/lib/platform-env";
function tokenFrom(request:Request){return accessToken(request)||"";}
export async function GET(request:Request){
 const user=await currentUser(request);if(!user)return jsonError("Authentication required.",401);
 const token=tokenFrom(request);if(!token)return jsonError("Session missing.",401);
 const role=await userRest(`user_roles?user_id=eq.${user.id}&role=in.(admin,finance)&select=role`,token);
 if(!role.ok||!(await role.json()).length)return jsonError("Administrator/finance access required.",403);
 const rows=await userRest("payment_reviews?status=eq.pending&select=id,user_id,plan_id,amount_minor,currency,provider,created_at,proof_storage_path&order=created_at.asc",token);
 if(!rows.ok)return jsonError("Could not load review queue.",503);
 const {url,anon}=platformEnv();
 const payments=await rows.json() as Array<{proof_storage_path:string;[key:string]:unknown}>;
 const enriched=await Promise.all(payments.map(async p=>{
  const path=p.proof_storage_path.split("/").map(encodeURIComponent).join("/");
  const signed=await fetch(`${url}/storage/v1/object/sign/payment-proofs/${path}`,{method:"POST",headers:{apikey:anon,Authorization:`Bearer ${token}`,"Content-Type":"application/json"},body:JSON.stringify({expiresIn:600}),cache:"no-store"});
  const result=await signed.json().catch(()=>({}));
  return {...p,proof_url:signed.ok&&result.signedURL?(`${url}/storage/v1${result.signedURL.startsWith("/")?result.signedURL:`/${result.signedURL}`}`):null};
 }));
 return Response.json({payments:enriched});
}
export async function PATCH(request:Request){
 const user=await currentUser(request);if(!user)return jsonError("Authentication required.",401);
 const token=tokenFrom(request);if(!token)return jsonError("Session missing.",401);
 const body=await request.json().catch(()=>null) as {id?:string;decision?:string;note?:string}|null;
 if(!body?.id||!["approved","rejected"].includes(body.decision||""))return jsonError("Valid payment ID and decision are required.");
 const r=await userRest("rpc/review_payment",token,{method:"POST",body:JSON.stringify({p_payment_id:body.id,p_decision:body.decision,p_note:(body.note||"").slice(0,1000)})});
 if(!r.ok){const e=await r.json().catch(()=>({}));return jsonError(e.message||"Payment review failed.",r.status===401?401:403);}
 return Response.json(await r.json());
}
