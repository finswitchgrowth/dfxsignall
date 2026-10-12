import { currentUser, accessToken, jsonError, platformEnv, userRest } from "@/lib/platform-env";
import { sendNotice, safeEmail } from "@/lib/notifications";
function tokenFrom(request:Request){return accessToken(request)||"";}
export async function GET(request:Request){
 const user=await currentUser(request);if(!user)return jsonError("Authentication required.",401);
 const token=tokenFrom(request);if(!token)return jsonError("Session missing.",401);
 const role=await userRest(`user_roles?user_id=eq.${user.id}&role=in.(admin,finance)&select=role`,token);
 if(!role.ok||!(await role.json()).length)return jsonError("Administrator/finance access required.",403);
 const rows=await userRest("payment_reviews?select=id,user_id,plan_id,amount_minor,currency,provider,created_at,proof_storage_path,status,reviewer_note,reviewed_by,reviewed_at&order=created_at.desc&limit=1000",token);
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
 const paymentResponse=await userRest(`payment_reviews?id=eq.${encodeURIComponent(body.id)}&select=user_id,plan_id,amount_minor,currency`,token);
 const paymentRows=paymentResponse.ok?await paymentResponse.json() as Array<{user_id:string;plan_id:string;amount_minor:number;currency:string}>:[];
 const payment=paymentRows[0];
 const r=await userRest("rpc/review_payment",token,{method:"POST",body:JSON.stringify({p_payment_id:body.id,p_decision:body.decision,p_note:(body.note||"").slice(0,1000)})});
 if(!r.ok){const e=await r.json().catch(()=>({}));return jsonError(e.message||"Payment review failed.",r.status===401?401:403);}
 const result=await r.json();
 if(payment){
  const profileResponse=await userRest(`profiles?id=eq.${encodeURIComponent(payment.user_id)}&select=email`,token);
  const profiles=profileResponse.ok?await profileResponse.json() as Array<{email?:string}>:[];
  const clientEmail=profiles[0]?.email;
  if(clientEmail){
   const approved=body.decision==="approved";
   await sendNotice({to:clientEmail,subject:approved?"DFXSIGNALL: payment reviewed":"DFXSIGNALL: payment proof update",text:approved?"Your payment proof was approved after review. Your account access should now reflect the approved entitlement.":"Your payment proof was not approved. Please review the dashboard for details or contact support.",html:approved?"<h2>Payment proof approved</h2><p>Your payment proof has been approved after review. Your account access should now reflect the approved entitlement.</p>":"<h2>Payment proof update</h2><p>Your payment proof was not approved. Please review your dashboard or contact support for next steps.</p>"});
  }
 }
 return Response.json(result);
}
