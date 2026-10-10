"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Upload, Clock3, ShieldCheck } from "lucide-react";

const methods = [
  { id: "BTC", name: "Bitcoin (BTC)", network: "Bitcoin network", address: "bc1qp8ahsegt3w8grx6v7lh7j3dx8yl2ffdntwtdes" },
  { id: "USDT-ERC20", name: "USDT", network: "ERC-20 · Ethereum", address: "0x0a1A77202Ae32E593AC527C9B095f370Cc1d4517" },
  { id: "USDT-TRC20", name: "USDT", network: "TRC-20 · Tron", address: "TWwXuCMDeqkLCxMFNcwQ8eJRQmxHRicJNf3" },
];

const plans = [
  { id: "starter", label: "DFX STARTER — $9 / month" },
  { id: "pro", label: "DFX PRO — $25 / month" },
  { id: "elite", label: "DFX ELITE — $49 / month" },
  { id: "auto-trading-tools", label: "AUTO TRADING TOOLS — $199 / month (tools only; live execution disabled)" },
  { id: "market-starter-pack", label: "MARKET STARTER PACK — $19 one-time" },
];

export function ManualCryptoPayment() {
  const [method, setMethod] = useState(methods[0].id);
  const [copied, setCopied] = useState(false);
  const [receipt, setReceipt] = useState<File | null>(null);
  const [plan, setPlan] = useState("pro");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  useEffect(() => { const requested = new URLSearchParams(window.location.search).get("plan"); if (requested && plans.some(p => p.id === requested)) setPlan(requested); }, []);
  const selected = methods.find((m) => m.id === method)!;

  async function submitProof() {
    setBusy(true); setMessage(""); setError("");
    try {
      const token = sessionStorage.getItem("dfxsignall_access_token");
      if (!token) throw new Error("Please sign in first, then return to this page.");
      if (!receipt) throw new Error("Choose your transaction screenshot first.");
      const body = new FormData();
      body.set("planId", plan); body.set("network", method); body.set("proof", receipt);
      const response = await fetch("/api/payments", { method: "POST", headers: { Authorization: `Bearer ${token}` }, body });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not submit payment.");
      setMessage(data.message || "Payment proof submitted for review.");
      setReceipt(null);
    } catch (e) { setError(e instanceof Error ? e.message : "Submission failed."); }
    finally { setBusy(false); }
  }

  async function copyAddress() {
    try { await navigator.clipboard.writeText(selected.address); setCopied(true); window.setTimeout(() => setCopied(false), 1800); }
    catch { setCopied(false); }
  }

  return (
    <main className="container-x min-h-[80svh] py-28">
      <div className="mx-auto max-w-3xl">
        <p className="chip border-[var(--color-cyan)]/30 text-[var(--color-cyan)]">MANUAL CRYPTO PAYMENT</p>
        <h1 className="t-display mt-5 text-4xl md:text-6xl">Pay in USD <span className="text-[var(--color-cyan)]">·</span> Crypto only</h1>
        <p className="t-lead mt-5 max-w-2xl">Package prices are in USD. Send the exact amount using the selected network, then submit your transaction screenshot for manual review.</p>
        <section className="glass-panel mt-10 rounded-2xl p-5 md:p-8">
          <h2 className="text-xl font-semibold">1. Select package (USD)</h2>
          <select value={plan} onChange={e=>setPlan(e.target.value)} className="mt-4 w-full rounded-xl border border-white/15 bg-black/30 p-3 text-white">
            {plans.map(p=><option key={p.id} value={p.id}>{p.label}</option>)}
          </select>
          {plan === "auto-trading-tools" && <p className="mt-2 text-xs text-amber-200">This plan covers tools and educational features only. No broker execution, automated orders, or guaranteed returns are enabled.</p>}
          <h2 className="mt-7 text-xl font-semibold">2. Choose payment network</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {methods.map(m=><button key={m.id} type="button" onClick={()=>{setMethod(m.id);setCopied(false);}} className={`rounded-xl border p-4 text-left transition ${method===m.id?"border-[var(--color-cyan)] bg-[var(--color-cyan)]/10":"border-white/10 bg-white/[0.02]"}`}><span className="block font-semibold">{m.name}</span><span className="mt-1 block text-xs text-[var(--color-muted)]">{m.network}</span>{method===m.id&&<span className="mt-3 inline-flex items-center gap-1 text-xs text-[var(--color-cyan)]"><Check size={13}/> Selected</span>}</button>)}
          </div>
          <h2 className="mt-8 text-xl font-semibold">3. Send payment</h2>
          <p className="mt-2 text-sm text-[var(--color-muted)]">Crypto transfers are generally irreversible. Confirm the address and network before sending. The system records the USD package amount; confirm the exact crypto amount with support before transfer if the checkout summary is not shown.</p>
          <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-4"><p className="text-xs uppercase tracking-wider text-[var(--color-muted)]">{selected.network} address</p><p className="mt-2 break-all font-mono text-sm leading-6">{selected.address}</p><button type="button" onClick={copyAddress} className="mt-4 inline-flex items-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-sm hover:border-[var(--color-cyan)]">{copied?<Check size={15}/>:<Copy size={15}/>} {copied?"Copied":"Copy address"}</button></div>
          <h2 className="mt-8 text-xl font-semibold">4. Upload payment screenshot</h2>
          <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-white/20 p-8 text-center hover:border-[var(--color-cyan)]"><Upload size={25} className="text-[var(--color-cyan)]"/><span className="mt-3 font-medium">{receipt?receipt.name:"Choose transaction screenshot"}</span><span className="mt-1 text-xs text-[var(--color-muted)]">PNG, JPG or WEBP · max 5 MB</span><input className="sr-only" type="file" accept="image/png,image/jpeg,image/webp" onChange={e=>{const f=e.target.files?.[0]??null;if(f&&f.size<=5*1024*1024&&["image/png","image/jpeg","image/webp"].includes(f.type))setReceipt(f);else{setReceipt(null);setError("Choose a PNG, JPG or WEBP image up to 5 MB.");}}}/></label>
          <div className="mt-5 flex items-start gap-3 rounded-xl border border-amber-300/20 bg-amber-300/5 p-4 text-sm"><Clock3 size={19} className="mt-0.5 shrink-0 text-amber-200"/><p>Review target: 30 minutes–2 hours after submission, not a guarantee. Paid features activate only after an administrator independently verifies the blockchain transaction and approves it.</p></div>
          <div className="mt-5 flex items-start gap-3 text-sm text-[var(--color-muted)]"><ShieldCheck size={18} className="mt-0.5 shrink-0"/><p>Never upload seed phrases or private keys. A screenshot alone is not proof of settlement. Auto-trading execution remains disabled.</p></div>
          {error&&<p role="alert" className="mt-5 rounded-lg border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-200">{error}</p>}
          {message&&<p role="status" className="mt-5 rounded-lg border border-emerald-400/30 bg-emerald-400/10 p-3 text-sm text-emerald-100">{message} You can track access from your dashboard.</p>}
          <button type="button" onClick={submitProof} disabled={busy||!receipt} className="mt-7 w-full rounded-xl bg-[var(--color-cyan)] px-5 py-4 font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-50">{busy?"Submitting securely…":"Submit payment proof for review"}</button>
          <p className="mt-3 text-xs leading-5 text-[var(--color-muted)]">Submission stores the receipt privately and places the payment in the administrator review queue. Do not submit multiple times for the same transfer.</p>
        </section>
      </div>
    </main>
  );
}
