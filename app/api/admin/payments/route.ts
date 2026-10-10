import { currentUser, jsonError, userRest } from "@/lib/platform-env";
function tokenFrom(request:Request){return request.headers.get("authorization")?.replace(/^Bearer\s+/i,"")||"";}
export async function GET(request:Request){
 const user=await currentUser(request);if(!user)return jsonError("Authentication required.",401);
 const token=tokenFrom(request);const role=await userRest(`user_roles?user_id=eq.${user.id}&role=in.(admin,finance)&select=role`,token);
 if(!role.ok||!(await role.json()).length)return jsonError("Administrator/finance access required.",403);
 const rows=await userRest("payment_reviews?status=eq.pending&select=id,user_id,plan_id,amount_minor,currency,provider,created_at,proof_storage_path&order=created_at.asc",token);
 if(!rows.ok)return jsonError("Could not load review queue.",503);
 return Response.json({payments:await rows.json()});
}
export async function PATCH(request:Request){
 const user=await currentUser(request);if(!user)return jsonError("Authentication required.",401);
 const token=tokenFrom(request);
 const body=await request.json().catch(()=>null) as {id?:string;decision?:string;note?:string}|null;
 if(!body?.id||!["approved","rejected"].includes(body.decision||""))return jsonError("Valid payment ID and decision are required.");
 const r=await userRest("rpc/review_payment",token,{method:"POST",body:JSON.stringify({p_payment_id:body.id,p_decision:body.decision,p_note:(body.note||"").slice(0,1000)})});
 if(!r.ok){const e=await r.json().catch(()=>({}));return jsonError(e.message||"Payment review failed.",r.status===401?401:403);}
 return Response.json(await r.json());
}
