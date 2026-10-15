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
  if (!body || typeof body !== "object" || Array.isArray(body)) return jsonError("Invalid form submission.");
  const b=body as Record<string,unknown>;
  if (clean(b.website,200)) return Response.json({ok:true});
  const fields={
    name:clean(b.name,100),service_interest:clean(b.service_interest,40),broker:clean(b.broker,100),
    platform:clean(b.platform,40),email:clean(b.email,254).toLowerCase(),
    mobile:clean(b.mobile,30),telegram:clean(b.telegram,80),security_acknowledgement:clean(b.security_acknowledgement,20)
  };
  if(!fields.name||!fields.service_interest||!fields.platform||!fields.email||!fields.mobile||fields.security_acknowledgement!=="confirmed") return jsonError("Complete all required fields and the security acknowledgement.");
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) return jsonError("Enter a valid email address.");
  if (!["account-management","mt4-mt5-support","risk-process-review","other"].includes(fields.service_interest)) return jsonError("Select a valid support type.");
  if (!["MT4","MT5","Other / unsure"].includes(fields.platform)) return jsonError("Select a valid platform.");
  const key=process.env.WEB3FORMS_ACCESS_KEY;
  if(!key) return jsonError("Enquiry delivery is not configured yet. Please contact support.",503);
  const payload=new FormData();
  payload.set("access_key",key);
  payload.set("subject","DFXSIGNALL Account Management Enquiry");
  payload.set("from_name","DFXSIGNALL Website");
  payload.set("name",fields.name);payload.set("email",fields.email);
  payload.set("message",[
    "New account-management enquiry",
    `Name: ${fields.name}`,`Support requested: ${fields.service_interest}`,
    `Broker: ${fields.broker||"Not provided"}`,`Platform: ${fields.platform}`,
    `Email: ${fields.email}`,`WhatsApp/mobile: ${fields.mobile}`,`Telegram: ${fields.telegram||"Not provided"}`,
    "Security acknowledgement: confirmed",
    "Enquiry only: no trading authorization, execution or performance guarantee.",
    "Do not request or store passwords, OTPs, API secrets, private keys or identity documents via email."
  ].join("\n"));
  try {
    const response=await fetch("https://api.web3forms.com/submit",{method:"POST",body:payload,cache:"no-store"});
    const data=await response.json().catch(()=>({}));
    if(!response.ok||data.success!==true)return jsonError("The enquiry could not be delivered. Please try again later.",502);
    return Response.json({ok:true,message:"Enquiry delivered."},{status:201});
  } catch { return jsonError("Enquiry delivery is temporarily unavailable.",502); }
}
