import { currentUser, accessToken, jsonError, userRest } from "@/lib/platform-env";
export async function GET(request:Request){
 const user=await currentUser(request);if(!user)return jsonError("Sign in required.",401);
 const token=accessToken(request);if(!token)return jsonError("Session missing.",401);
 const r=await userRest("market_signals?select=id,symbol,market,direction,entry_price,stop_loss,take_profit,timeframe,confidence,status,summary,published_at,closed_at,created_at&status=in.(published,closed,cancelled)&order=published_at.desc.nullslast,created_at.desc&limit=100",token);
 if(!r.ok)return jsonError("Could not load market signals.",503);
 return Response.json({signals:await r.json()},{headers:{"Cache-Control":"no-store"}});
}
