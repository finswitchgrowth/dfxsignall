"use client";
import { useState, type FormEvent } from "react";

export default function AccountManagementForm() {
  const [busy,setBusy]=useState(false); const [message,setMessage]=useState(""); const [error,setError]=useState("");
  async function submit(e:FormEvent<HTMLFormElement>){
    e.preventDefault();setBusy(true);setMessage("");setError("");
    const form=e.currentTarget;const values=Object.fromEntries(new FormData(form).entries());
    try { const r=await fetch("/api/account-management",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(values)});const d=await r.json();if(!r.ok)throw new Error(d.error||"Could not send your request.");setMessage("Your request has been received. Please do not send broker passwords or one-time codes in follow-up messages.");form.reset(); }
    catch(err){setError(err instanceof Error?err.message:"Could not send request.");}finally{setBusy(false);}
  }
  const input="mt-2 w-full rounded-lg border border-[var(--line-strong)] bg-black/25 px-4 py-3 text-[var(--color-fg)] outline-none focus:border-[var(--color-cyan)]";
  return <form onSubmit={submit} className="panel space-y-4 p-6 md:p-8">
    <div><h2 className="text-xl font-semibold">Account management request</h2><p className="t-body mt-2 text-sm">All fields marked * are required. We will contact you to verify eligibility and scope.</p></div>
    <label className="block text-sm">Full name *<input className={input} name="name" autoComplete="name" required minLength={2} maxLength={100}/></label>
    <label className="block text-sm">Trading account number *<input className={input} name="account_number" required minLength={2} maxLength={100} autoComplete="off"/></label>
    <div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm">Broker *<input className={input} name="broker" required maxLength={100}/></label><label className="block text-sm">Broker server *<input className={input} name="server" required maxLength={120}/></label></div>
    <label className="block text-sm">Platform *<select className={input} name="platform" required defaultValue=""><option value="" disabled>Select platform</option><option>MT4</option><option>MT5</option><option>Other / unsure</option></select></label>
    <label className="block text-sm">Email *<input className={input} type="email" name="email" required maxLength={254} autoComplete="email"/></label>
    <div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm">WhatsApp / mobile *<input className={input} name="mobile" required maxLength={30} autoComplete="tel"/></label><label className="block text-sm">Telegram (optional)<input className={input} name="telegram" maxLength={80} placeholder="@username"/></label></div>
    <label className="flex items-start gap-3 text-sm leading-5"><input type="checkbox" name="security_acknowledgement" value="confirmed" required className="mt-1"/><span>I understand that I must never provide a trading password, OTP, private key, or remote-access code, and that this form does not authorize trades.</span></label>
    <label className="hidden" aria-hidden="true">Leave blank<input name="website" tabIndex={-1} autoComplete="off"/></label>
    {error&&<p role="alert" className="rounded-lg border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-200">{error}</p>}
    {message&&<p role="status" className="rounded-lg border border-emerald-400/30 bg-emerald-400/10 p-3 text-sm text-emerald-100">{message}</p>}
    <button disabled={busy} className="w-full rounded-lg bg-[var(--color-cyan)] px-5 py-3 font-semibold text-slate-950 disabled:opacity-50">{busy?"Sending securely…":"Submit account management request"}</button>
    <p className="text-xs leading-5 text-[var(--color-dim)]">Requests are handled only if the verified Web3Forms service is configured. We do not request or store broker passwords.</p>
  </form>;
}
