import { currentUser, jsonError, userRest } from "@/lib/platform-env";
export async function GET(request:Request){
 const user=await currentUser(request);if(!user)return jsonError("Sign in required.",401);
 const token=request.headers.get("authorization")?.replace(/^Bearer\s+/i,"");if(!token)return jsonError("Session missing.",401);
 const [profile,entitlements]=await Promise.all([
  userRest(`profiles?id=eq.${user.id}&select=id,display_name,email,created_at`,token),
  userRest(`entitlements?user_id=eq.${user.id}&select=id,plan_id,status,starts_at,ends_at,created_at&order=created_at.desc`,token)
 ]);
 if(!profile.ok||!entitlements.ok)return jsonError("Could not load account.",503);
 return Response.json({profile:(await profile.json())[0]||null,entitlements:await entitlements.json()});
}