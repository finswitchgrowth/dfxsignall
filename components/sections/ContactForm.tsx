"use client";

import { Send } from "lucide-react";
import { useState, type FormEvent } from "react";

const topics = ["General enquiry", "Business & partnerships", "Platform launch updates", "Security report", "Compliance & legal"];
export function ContactForm() {
  const [busy,setBusy]=useState(false);const [message,setMessage]=useState("");const [error,setError]=useState("");
  async function onSubmit(e:FormEvent<HTMLFormElement>){
    e.preventDefault();setBusy(true);setMessage("");setError("");
    const form=e.currentTarget;const data=Object.fromEntries(new FormData(form).entries());
    try{const r=await fetch("/api/contact",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});const result=await r.json();if(!r.ok)throw new Error(result.error||"Could not send your message.");setMessage("Your message has been delivered to the DFXSIGNALL team.");form.reset();}
    catch(err){setError(err instanceof Error?err.message:"Could not send your message.");}finally{setBusy(false);}
  }
  const field="mt-2 w-full rounded-xl border border-[var(--line-strong)] bg-[var(--color-ink-950)]/60 px-4 py-3 text-sm text-[var(--color-fg)] outline-none transition-colors placeholder:text-[var(--color-dim)] focus:border-[var(--color-cyan)]/60";
  return <form onSubmit={onSubmit} className="panel grid gap-5 p-6 sm:p-8">
    <div className="grid gap-5 sm:grid-cols-2"><label className="text-xs text-[var(--color-muted)]">Name<input name="name" required minLength={2} maxLength={100} autoComplete="name" className={field} placeholder="Your name"/></label><label className="text-xs text-[var(--color-muted)]">Email<input name="email" type="email" required maxLength={254} autoComplete="email" className={field} placeholder="you@example.com"/></label></div>
    <label className="text-xs text-[var(--color-muted)]">Topic<select name="topic" className={field} defaultValue={topics[0]}>{topics.map(t=><option key={t}>{t}</option>)}</select></label>
    <label className="text-xs text-[var(--color-muted)]">Message<textarea name="message" required minLength={5} maxLength={4000} rows={5} className={field} placeholder="How can we help?"/></label>
    <label className="hidden" aria-hidden="true">Leave blank<input name="website" tabIndex={-1} autoComplete="off"/></label>
    {error&&<p role="alert" className="rounded-lg border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-200">{error}</p>}
    {message&&<p role="status" className="rounded-lg border border-emerald-400/30 bg-emerald-400/10 p-3 text-sm text-emerald-100">{message}</p>}
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><p className="max-w-sm text-[0.7rem] leading-relaxed text-[var(--color-dim)]">Do not include passwords, one-time codes, private keys or payment credentials.</p><button disabled={busy} type="submit" className="btn btn-primary shrink-0 disabled:opacity-50"><Send size={15}/>{busy?"Sending…":"Send message"}</button></div>
  </form>;
}
