import { currentUser, accessToken, platformEnv, jsonError, userRest } from "@/lib/platform-env";
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
 return Response.json({ok:true,status:"pending",id,message:"Receipt submitted for manual review. Access stays locked until the transaction is verified and approved."},{status:201});
}
