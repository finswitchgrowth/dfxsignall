type Notice = { to: string; subject: string; html: string; text: string };
export async function sendNotice(notice: Notice): Promise<boolean> {
 const key=process.env.RESEND_API_KEY;
 const from=process.env.RESEND_FROM_EMAIL;
 if(!key||!from) return false;
 try {
  const response=await fetch("https://api.resend.com/emails",{method:"POST",headers:{"Authorization":`Bearer ${key}`,"Content-Type":"application/json"},body:JSON.stringify({from,to:[notice.to],subject:notice.subject,html:notice.html,text:notice.text}),cache:"no-store"});
  return response.ok;
 } catch { return false; }
}
export function safeEmail(value: string) { return value.replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]||c)); }
