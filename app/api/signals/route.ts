import { currentUser, accessToken, jsonError, userRest } from "@/lib/platform-env";
export async function GET(request:Request){
 const user=await currentUser(request);if(!user)return jsonError("Sign in required.",401);
 const token=accessToken(request);if(!token)return jsonError("Session missing.",401);
 const ent=await userRest(`entitlements?user_id=eq.${encodeURIComponent(user.id)}&status=eq.active&plan_id=eq.elite&select=id,ends_at&limit=10`,token);
 if(!ent.ok)return jsonError("Could not verify signal access.",503);
 const entitlements=await ent.json() as Array<{ends_at:string|null}>;
 const now=Date.now();
 const elite=entitlements.some(e=>!e.ends_at||new Date(e.ends_at).getTime()>now);
 const tierFilter=elite?"":"&plan_tier=eq.free";
 const r=await userRest("market_signals?select=id,symbol,market,direction,entry_price,stop_loss,take_profit,timeframe,confidence,status,summary,plan_tier,published_at,closed_at,created_at&status=in.(published,closed,cancelled)"+tierFilter+"&order=published_at.desc.nullslast,created_at.desc&limit=100",token);
 if(!r.ok)return jsonError("Could not load market signals.",503);
 return Response.json({signals:await r.json(),access:elite?"elite":"free"},{headers:{"Cache-Control":"no-store"}});
}
