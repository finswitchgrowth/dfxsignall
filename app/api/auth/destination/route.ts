import { accessToken, currentUser, jsonError, userRest } from "@/lib/platform-env";
export async function GET(request:Request){
 const user=await currentUser(request);const token=accessToken(request);
 if(!user||!token)return jsonError("Sign in required.",401);
 const r=await userRest(`user_roles?user_id=eq.${user.id}&select=role`,token);
 if(!r.ok)return jsonError("Could not verify account permissions.",503);
 const rows=await r.json() as {role:string}[];
 return Response.json({destination:rows.some(row=>row.role==="admin"||row.role==="finance")?"/admin":"/dashboard"},{headers:{"Cache-Control":"no-store"}});
}
