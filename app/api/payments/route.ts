import { currentUser, accessToken, platformEnv, jsonError, userRest } from "@/lib/platform-env";
import { sendNotice, safeEmail } from "@/lib/notifications";
export const runtime="nodejs";
const networks=new Set(["BTC","USDT-ERC20","USDT-TRC20"]);
export async function POST(request:Request){
 const user=await currentUser(request); if(!user)return jsonError("Sign in before submitting payment proof.",401);
 const token=accessToken(request); if(!token)return jsonError("Sign-in session missing.",401);
 const form=await request.formData().catch(()=>null); if(!form)return jsonError("Invalid form data.");
 const planId=String(form.get("planId")||""),network=String(form.get("network")||""),file=form.get("proof");
 if(!networks.has(network))return jsonError("Unsupported payment network.");
 if(!(file instanceof File)||file.size<1||file.size>5*1024*1024)return jsonError("Upload a payment screenshot up to 5 MB.");
 if(!["image/png","image/jpeg","image/webp"].includes(file.type))return jsonError("Only PNG, JPG or WEBP screenshots are accepted.");
 const {url,anon}=platformEnv(); const ext=file.type==="image/png"?"png":file.type==="image/webp"?"webp":"jpg";
 const objectPath=`${user.id}/${crypto.randomUUID()}.${ext}`;
 const upload=await fetch(`${url}/storage/v1/object/payment-proofs/${objectPath}`,{method:"POST",headers:{apikey:anon,Authorization:`Bearer ${token}`,"Content-Type":file.type,"x-upsert":"false"},body:await file.arrayBuffer(),cache:"no-store"});
 if(!upload.ok)return jsonError("Could not store receipt. Ensure your session is valid and retry.",503);
 const submission=await userRest("rpc/submit_payment_review",token,{method:"POST",body:JSON.stringify({p_plan_id:planId,p_network:network,p_proof_path:objectPath})});
 if(!submission.ok){await fetch(`${url}/storage/v1/object/payment-proofs/${objectPath}`,{method:"DELETE",headers:{apikey:anon,Authorization:`Bearer ${token}`},cache:"no-store"}); const e=await submission.json().catch(()=>({}));return jsonError(e.message||"Payment could not be registered.",400);}
 const id=await submission.json();
 const adminEmail=process.env.DFXSIGNALL_ADMIN_EMAIL||"dfxsignall@gmail.com";
 const userEmail=typeof user.email==="string"?user.email:"";
 const planLabel=planId.replace(/[-_]/g," ").toUpperCase();
 await Promise.all([
  sendNotice({to:adminEmail,subject:"DFXSIGNALL: payment proof needs review",text:`A payment proof was submitted. Plan: ${planLabel}. Network: ${network}. Review it in the admin portal.`,html:`<h2>Payment proof submitted</h2><p>A client submitted a payment proof for <strong>${safeEmail(planLabel)}</strong>.</p><p>Network: ${safeEmail(network)}</p><p>Review the transaction in the DFXSIGNALL admin portal. Verify the transaction independently before approval.</p>`}),
  userEmail?sendNotice({to:userEmail,subject:"DFXSIGNALL received your payment proof",text:"We received your payment proof. Your request is pending manual verification; access remains locked until approved.",html:"<h2>Payment proof received</h2><p>Your submission is pending manual verification. Access remains locked until the transaction is independently verified and approved.</p>"}):Promise.resolve(false)
 ]);
 return Response.json({ok:true,status:"pending",id,message:"Receipt submitted for manual review. Access stays locked until the transaction is verified and approved."},{status:201});
}
