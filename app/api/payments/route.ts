import { currentUser, platformEnv, jsonError, supabaseRest } from "@/lib/platform-env";
export const runtime = "nodejs";
const networks = new Set(["BTC","USDT-ERC20","USDT-TRC20"]);
export async function POST(request: Request) {
  const user = await currentUser(request);
  if (!user) return jsonError("Sign in before submitting payment proof.",401);
  const form = await request.formData().catch(()=>null);
  if (!form) return jsonError("Invalid form data.");
  const planId = String(form.get("planId") || "");
  const network = String(form.get("network") || "");
  const file = form.get("proof");
  if (!networks.has(network)) return jsonError("Unsupported payment network.");
  if (!(file instanceof File) || file.size < 1 || file.size > 5 * 1024 * 1024) return jsonError("Upload a payment screenshot up to 5 MB.");
  if (!["image/png","image/jpeg","image/webp"].includes(file.type)) return jsonError("Only PNG, JPG or WEBP screenshots are accepted.");
  const planResponse = await supabaseRest(`plans?id=eq.${encodeURIComponent(planId)}&active=eq.true&select=id,price_minor,currency`);
  if (!planResponse.ok) return jsonError("Could not verify package price.",503);
  const plans = await planResponse.json();
  if (!plans.length) return jsonError("This package is not available.",400);
  const {url,service}=platformEnv();
  const ext = file.type==="image/png"?"png":file.type==="image/webp"?"webp":"jpg";
  const objectPath = `${user.id}/${crypto.randomUUID()}.${ext}`;
  const bytes = await file.arrayBuffer();
  const upload = await fetch(`${url}/storage/v1/object/payment-proofs/${objectPath}`, {method:"POST",headers:{apikey:service,Authorization:`Bearer ${service}`,"Content-Type":file.type,"x-upsert":"false"},body:bytes,cache:"no-store"});
  if (!upload.ok) return jsonError("Could not store receipt. Please retry later.",503);
  const inserted = await supabaseRest("payment_reviews", {method:"POST",headers:{Prefer:"return=representation"},body:JSON.stringify({user_id:user.id,plan_id:planId,amount_minor:plans[0].price_minor,currency:"USD",provider:network,proof_storage_path:objectPath,status:"pending"})});
  if (!inserted.ok) {
    await fetch(`${url}/storage/v1/object/payment-proofs/${objectPath}`,{method:"DELETE",headers:{apikey:service,Authorization:`Bearer ${service}`},cache:"no-store"});
    return jsonError("Receipt was not registered. Please retry or contact support.",503);
  }
  return Response.json({ok:true,status:"pending",message:"Receipt submitted for manual review. Access stays locked until an administrator verifies the on-chain payment."},{status:201});
}
