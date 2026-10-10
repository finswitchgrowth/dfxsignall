import { jsonError } from "@/lib/platform-env";

export const runtime = "nodejs";
const clean = (v: unknown, max=200) => typeof v === "string" ? v.trim().slice(0,max) : "";

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin) {
    try { if (new URL(origin).host !== new URL(request.url).host) return jsonError("Invalid request origin.", 403); }
    catch { return jsonError("Invalid request origin.", 403); }
  }
  const body = await request.json().catch(()=>null);
  if (!body || typeof body !== "object") return jsonError("Invalid form submission.");
  if (clean((body as Record<string,unknown>).website,200)) return Response.json({ok:true});
  const b=body as Record<string,unknown>;
  const fields={
    name:clean(b.name,100),account_number:clean(b.account_number,100),broker:clean(b.broker,100),
    server:clean(b.server,120),platform:clean(b.platform,40),email:clean(b.email,254).toLowerCase(),
    mobile:clean(b.mobile,30),telegram:clean(b.telegram,80),security_acknowledgement:clean(b.security_acknowledgement,20)
  };
  if(!fields.name||!fields.account_number||!fields.broker||!fields.server||!fields.platform||!fields.email||!fields.mobile||fields.security_acknowledgement!=="confirmed") return jsonError("Complete all required fields and the security acknowledgement.");
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) return jsonError("Enter a valid email address.");
  if (!["MT4","MT5","Other / unsure"].includes(fields.platform)) return jsonError("Select a valid platform.");
  const key=process.env.WEB3FORMS_ACCESS_KEY;
  if(!key) return jsonError("Account request delivery is not configured yet. Please contact support.",503);
  const payload=new FormData();
  payload.set("access_key",key);
  payload.set("subject","DFXSIGNALL Account Management Request");
  payload.set("from_name","DFXSIGNALL Website");
  payload.set("name",fields.name);payload.set("email",fields.email);
  payload.set("message",[
    "New account management request",
    `Name: ${fields.name}`,`Trading account number: ${fields.account_number}`,
    `Broker: ${fields.broker}`,`Server: ${fields.server}`,`Platform: ${fields.platform}`,
    `Email: ${fields.email}`,`WhatsApp/mobile: ${fields.mobile}`,`Telegram: ${fields.telegram||"Not provided"}`,
    "Security acknowledgement: confirmed",
    "Do not request or store broker passwords or OTPs."
  ].join("\n"));
  try {
    const response=await fetch("https://api.web3forms.com/submit",{method:"POST",body:payload,cache:"no-store"});
    const data=await response.json().catch(()=>({}));
    if(!response.ok||data.success!==true)return jsonError("The request could not be delivered. Please try again later.",502);
    return Response.json({ok:true,message:"Request delivered."},{status:201});
  } catch { return jsonError("Request delivery is temporarily unavailable.",502); }
}
