"use client";
import { useState, type FormEvent } from "react";

export default function AccountManagementForm() {
  const [busy,setBusy]=useState(false); const [message,setMessage]=useState(""); const [error,setError]=useState("");
  async function submit(e:FormEvent<HTMLFormElement>){
    e.preventDefault();setBusy(true);setMessage("");setError("");
    const form=e.currentTarget;const values=Object.fromEntries(new FormData(form).entries());
    try { const r=await fetch("/api/account-management",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(values)});const d=await r.json();if(!r.ok)throw new Error(d.error||"Could not send your request.");setMessage("Your enquiry has been sent for review. We will contact you about next steps. Do not send passwords or one-time codes.");form.reset(); }
    catch(err){setError(err instanceof Error?err.message:"Could not send request.");}finally{setBusy(false);}
  }
  const input="mt-2 w-full rounded-lg border border-[var(--line-strong)] bg-black/25 px-4 py-3 text-[var(--color-fg)] outline-none focus:border-[var(--color-cyan)]";
  return <form onSubmit={submit} className="panel space-y-4 p-6 md:p-8">
    <div><h2 className="text-xl font-semibold">Account management enquiry</h2><p className="t-body mt-2 text-sm">Tell us how to reach you and what support you need. Account identifiers are requested only later if necessary and through an agreed secure process.</p></div>
    <label className="block text-sm">Full name *<input className={input} name="name" autoComplete="name" required minLength={2} maxLength={100}/></label>
    <label className="block text-sm">What support do you need? *<select className={input} name="service_interest" required defaultValue=""><option value="" disabled>Select support type</option><option value="account-management">Account management enquiry</option><option value="mt4-mt5-support">MT4 / MT5 platform support</option><option value="risk-process-review">Risk and trading-process review</option><option value="other">Other / not sure yet</option></select></label>
    <div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm">Broker (optional)<input className={input} name="broker" maxLength={100} placeholder="Broker name, if known"/></label><label className="block text-sm">Platform *<select className={input} name="platform" required defaultValue=""><option value="" disabled>Select platform</option><option>MT4</option><option>MT5</option><option>Other / unsure</option></select></label></div>
    <label className="block text-sm">Email *<input className={input} type="email" name="email" required maxLength={254} autoComplete="email"/></label>
    <div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm">WhatsApp / mobile *<input className={input} name="mobile" required maxLength={30} autoComplete="tel"/></label><label className="block text-sm">Telegram (optional)<input className={input} name="telegram" maxLength={80} placeholder="@username"/></label></div>
    <label className="flex items-start gap-3 text-sm leading-5"><input type="checkbox" name="security_acknowledgement" value="confirmed" required className="mt-1"/><span>I understand this enquiry does not authorize trades or guarantee performance. I will never submit a trading password, investor password, OTP, API secret, private key, identity document or remote-access code in this form.</span></label>
    <label className="hidden" aria-hidden="true">Leave blank<input name="website" tabIndex={-1} autoComplete="off"/></label>
    {error&&<p role="alert" className="rounded-lg border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-200">{error}</p>}
    {message&&<p role="status" className="rounded-lg border border-emerald-400/30 bg-emerald-400/10 p-3 text-sm text-emerald-100">{message}</p>}
    <button disabled={busy} className="w-full rounded-lg bg-[var(--color-cyan)] px-5 py-3 font-semibold text-slate-950 disabled:opacity-50">{busy?"Sending…":"Request an account-management consultation"}</button>
    <p className="text-xs leading-5 text-[var(--color-dim)]">This form sends an enquiry to our configured contact channel; it is not a secure client portal and does not activate account access or trading. We do not request or store broker passwords.</p>
  </form>;
}
