"use client";

import { useState } from "react";
import { Check, Copy, Upload, Clock3, ShieldCheck } from "lucide-react";

const methods = [
  { id: "BTC", name: "Bitcoin (BTC)", network: "Bitcoin network", address: "bc1qp8ahsegt3w8grx6v7lh7j3dx8yl2ffdntwtdes" },
  { id: "USDT-ERC20", name: "USDT", network: "ERC-20 · Ethereum", address: "0x0a1A77202Ae32E593AC527C9B095f370Cc1d4517" },
  { id: "USDT-TRC20", name: "USDT", network: "TRC-20 · Tron", address: "TWwXuCMDeqkLCxMFNcwQ8eJRQmxHRicJNf3" },
];

export function ManualCryptoPayment() {
  const [method, setMethod] = useState(methods[0].id);
  const [copied, setCopied] = useState(false);
  const [receipt, setReceipt] = useState<File | null>(null);\n  const [plan, setPlan] = useState("pro");\n  const [busy, setBusy] = useState(false);\n  const [message, setMessage] = useState("");\n  const [error, setError] = useState("");
  const selected = methods.find((m) => m.id === method)!;

  async function submitProof() {\n    setBusy(true); setMessage(""); setError("");\n    try {\n      const token = sessionStorage.getItem("dfxsignall_access_token");\n      if (!token) throw new Error("Please sign in first, then return to this page.");\n      if (!receipt) throw new Error("Choose your transaction screenshot first.");\n      const body = new FormData(); body.set("planId", plan); body.set("network", method); body.set("proof", receipt);\n      const response = await fetch("/api/payments", { method: "POST", headers: { Authorization: `Bearer ${token}` }, body });\n      const data = await response.json(); if (!response.ok) throw new Error(data.error || "Could not submit payment.");\n      setMessage(data.message || "Payment proof submitted for review."); setReceipt(null);\n    } catch (e) { setError(e instanceof Error ? e.message : "Submission failed."); } finally { setBusy(false); }\n  }\n\n  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(selected.address);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <main className="container-x min-h-[80svh] py-28">
      <div className="mx-auto max-w-3xl">
        <p className="chip border-[var(--color-cyan)]/30 text-[var(--color-cyan)]">MANUAL CRYPTO PAYMENT</p>
        <h1 className="t-display mt-5 text-4xl md:text-6xl">Pay in USD <span className="text-[var(--color-cyan)]">·</span> Crypto only</h1>
        <p className="t-lead mt-5 max-w-2xl">Package prices are shown in USD. Send the equivalent amount using the exact network below, then upload your transaction screenshot for manual review.</p>

        <section className="glass-panel mt-10 rounded-2xl p-5 md:p-8">
          <h2 className="text-xl font-semibold">1. Select package (USD)</h2>\n          <select value={plan} onChange={e=>setPlan(e.target.value)} className="mt-4 w-full rounded-xl border border-white/15 bg-black/30 p-3 text-white">\n            <option value="pro">DFX PRO — $39 / month</option>\n            <option value="elite">DFX ELITE — $99 / month</option>\n          </select>\n          <h2 className="mt-7 text-xl font-semibold">2. Choose payment network</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {methods.map((m) => (
              <button key={m.id} type="button" onClick={() => { setMethod(m.id); setCopied(false); }}
                className={`rounded-xl border p-4 text-left transition ${method === m.id ? "border-[var(--color-cyan)] bg-[var(--color-cyan)]/10" : "border-white/10 bg-white/[0.02]"}`}>
                <span className="block font-semibold">{m.name}</span>
                <span className="mt-1 block text-xs text-[var(--color-muted)]">{m.network}</span>
                {method === m.id && <span className="mt-3 inline-flex items-center gap-1 text-xs text-[var(--color-cyan)]"><Check size={13}/> Selected</span>}
              </button>
            ))}
          </div>
          <h2 className="mt-8 text-xl font-semibold">3. Send payment</h2>
          <p className="mt-2 text-sm text-[var(--color-muted)]">Verify the network before sending. Crypto transfers are generally irreversible. Send only the amount shown on your selected package's checkout summary.</p>
          <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-4">
            <p className="text-xs uppercase tracking-wider text-[var(--color-muted)]">{selected.network} address</p>
            <p className="mt-2 break-all font-mono text-sm leading-6">{selected.address}</p>
            <button type="button" onClick={copyAddress} className="mt-4 inline-flex items-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-sm hover:border-[var(--color-cyan)]">
              {copied ? <Check size={15}/> : <Copy size={15}/>} {copied ? "Copied" : "Copy address"}
            </button>
          </div>
          <h2 className="mt-8 text-xl font-semibold">4. Upload payment screenshot</h2>
          <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-white/20 p-8 text-center hover:border-[var(--color-cyan)]">
            <Upload size={25} className="text-[var(--color-cyan)]"/>
            <span className="mt-3 font-medium">{receipt ? receipt.name : "Choose transaction screenshot"}</span>
            <span className="mt-1 text-xs text-[var(--color-muted)]">PNG, JPG or WEBP · max 5 MB</span>
            <input className="sr-only" type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => {
              const f = e.target.files?.[0] ?? null;
              if (f && f.size <= 5 * 1024 * 1024 && ["image/png","image/jpeg","image/webp"].includes(f.type)) setReceipt(f);
              else setReceipt(null);
            }} />
          </label>
          <div className="mt-5 flex items-start gap-3 rounded-xl border border-amber-300/20 bg-amber-300/5 p-4 text-sm">
            <Clock3 size={19} className="mt-0.5 shrink-0 text-amber-200"/>
            <p>Admin review target: <strong>30 minutes–2 hours</strong> after a valid submission. Paid features activate only after an admin verifies the transaction and approves the payment.</p>
          </div>
          <div className="mt-5 flex items-start gap-3 text-sm text-[var(--color-muted)]">
            <ShieldCheck size={18} className="mt-0.5 shrink-0"/>
            <p>Never upload seed phrases or private keys. A screenshot alone is not proof of settlement; the admin must verify the transaction on the relevant blockchain.</p>
          </div>
          <button type="button" disabled className="mt-7 w-full cursor-not-allowed rounded-xl bg-white/10 px-5 py-4 font-semibold text-white/50">
            Submission unavailable — secure review service not connected
          </button>
          <p className="mt-3 text-xs leading-5 text-[var(--color-muted)]">The upload selection above is a preview only; it does not send or store your screenshot. Secure submission, admin notification, transaction verification and automatic entitlement activation are not enabled until the backend is configured and tested.</p>
        </section>
      </div>
    </main>
  );
}
