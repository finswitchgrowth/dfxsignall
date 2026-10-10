import { currentUser, jsonError, supabaseRest } from "@/lib/platform-env";
export async function GET(request: Request) {
 const user=await currentUser(request); if(!user) return jsonError("Authentication required.",401);
 const role=await supabaseRest(`user_roles?user_id=eq.${user.id}&role=in.(admin,finance)&select=role`);
 if(!role.ok || !(await role.json()).length) return jsonError("Administrator/finance access required.",403);
 const rows=await supabaseRest("payment_reviews?status=eq.pending&select=id,user_id,plan_id,amount_minor,currency,provider,created_at,proof_storage_path&order=created_at.asc");
 if(!rows.ok) return jsonError("Could not load review queue.",503);
 return Response.json({payments:await rows.json()});
}
export async function PATCH(request: Request) {
 const user=await currentUser(request); if(!user) return jsonError("Authentication required.",401);
 const role=await supabaseRest(`user_roles?user_id=eq.${user.id}&role=eq.admin&select=role`);
 if(!role.ok || !(await role.json()).length) return jsonError("Admin access required.",403);
 const body=await request.json().catch(()=>null) as {id?:string;decision?:string;note?:string}|null;
 if(!body?.id || !["approved","rejected"].includes(body.decision||"")) return jsonError("Valid payment ID and decision are required.");
 const result=await supabaseRest(`payment_reviews?id=eq.${encodeURIComponent(body.id)}&status=eq.pending`,{method:"PATCH",headers:{Prefer:"return=representation"},body:JSON.stringify({status:body.decision,reviewed_by:user.id,reviewed_at:new Date().toISOString(),reviewer_note:(body.note||"").slice(0,1000)})});
 if(!result.ok) return jsonError("Payment review failed.",503);
 const rows=await result.json();
 if(!rows.length) return jsonError("Payment was already reviewed or does not exist.",409);
 if(body.decision==="approved") {
  const payment=rows[0];
  const plan=await supabaseRest(`plans?id=eq.${encodeURIComponent(payment.plan_id)}&select=id`);
  if(plan.ok && (await plan.json()).length) {
   const end=new Date(); end.setDate(end.getDate()+30);
   const entitlement=await supabaseRest("entitlements",{method:"POST",headers:{Prefer:"return=minimal"},body:JSON.stringify({user_id:payment.user_id,plan_id:payment.plan_id,status:"active",starts_at:new Date().toISOString(),ends_at:end.toISOString(),source_payment_id:payment.id})});
   if(!entitlement.ok) return jsonError("Payment approved, but entitlement activation failed. Reconcile this payment in admin.",503);
  }
 }
 await supabaseRest("audit_events",{method:"POST",body:JSON.stringify({actor_user_id:user.id,action:`payment_${body.decision}`,entity_type:"payment_review",entity_id:body.id,reason:(body.note||"").slice(0,1000)})});
 return Response.json({ok:true,status:body.decision});
}
