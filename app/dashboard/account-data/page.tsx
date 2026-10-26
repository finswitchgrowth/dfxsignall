"use client";
import { useEffect, useState } from "react";

type Entitlement = { id: string; plan_id: string; status: string; starts_at?: string | null; ends_at: string | null; created_at?: string };
type Account = { profile: { id: string; display_name: string | null; email: string | null; created_at?: string } | null; entitlements: Entitlement[] };

export default function AccountDataPage() {
  const [data, setData] = useState<Account | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let live = true;
    fetch("/api/account", { cache: "no-store", credentials: "same-origin" })
      .then(async r => {
        const d = await r.json();
        if (!r.ok) throw new Error(d.error || "Please sign in to view account data.");
        return d as Account;
      })
      .then(d => { if (live) setData(d); })
      .catch(e => { if (live) setError(e instanceof Error ? e.message : "Could not load account data."); })
      .finally(() => { if (live) setLoading(false); });
    return () => { live = false; };
  }, []);
  const date = (value?: string | null) => value ? new Date(value).toLocaleString() : "Not set";
  return <main className="min-h-screen bg-[#05091d] px-4 py-10 text-white"><div className="mx-auto max-w-4xl">
    <p className="text-xs font-semibold uppercase tracking-[.24em] text-cyan-300">DFXSIGNALL · Client account</p>
    <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Account data</h1>
    <p className="mt-2 text-sm text-white/55">Review your registered profile and plan-access records.</p>
    <div className="mt-6 flex flex-wrap gap-3"><a href="/dashboard" className="rounded-lg bg-cyan-300 px-4 py-3 font-semibold text-slate-950">Back to dashboard</a><a href="/payment" className="rounded-lg border border-white/15 px-4 py-3">Plans & payment</a></div>
    {loading && <p role="status" className="mt-6 text-white/60">Loading your account data…</p>}
    {error && <div role="alert" className="mt-6 rounded-xl border border-amber-300/30 bg-amber-300/5 p-4 text-amber-100"><p>{error}</p><a href="/login" className="mt-3 inline-block underline">Go to sign in</a></div>}
    {data && <div className="mt-6 grid gap-4 md:grid-cols-2">
      <section className="rounded-2xl border border-white/10 bg-white/[.035] p-5"><h2 className="text-lg font-semibold">Profile</h2><dl className="mt-4 space-y-4 text-sm"><div><dt className="text-white/45">Name</dt><dd className="mt-1 break-words">{data.profile?.display_name || "Not provided"}</dd></div><div><dt className="text-white/45">Email</dt><dd className="mt-1 break-words">{data.profile?.email || "Not available"}</dd></div><div><dt className="text-white/45">Account created</dt><dd className="mt-1">{date(data.profile?.created_at)}</dd></div><div><dt className="text-white/45">Account ID</dt><dd className="mt-1 break-all text-xs text-white/50">{data.profile?.id || "Not available"}</dd></div></dl></section>
      <section className="rounded-2xl border border-white/10 bg-white/[.035] p-5"><h2 className="text-lg font-semibold">Plans & access</h2>{data.entitlements?.length ? <div className="mt-4 space-y-3">{data.entitlements.map(e=><article key={e.id} className="rounded-xl border border-white/10 p-4"><div className="flex flex-wrap items-center justify-between gap-2"><strong>{e.plan_id.toUpperCase()}</strong><span className="rounded-full border border-white/15 px-2 py-1 text-xs">{e.status}</span></div><p className="mt-2 text-xs text-white/45">Started: {date(e.starts_at)}</p><p className="mt-1 text-xs text-white/45">Expires: {date(e.ends_at)}</p></article>)}</div> : <p className="mt-4 text-sm text-white/55">No plan-access records were returned for this account yet.</p>}</section>
    </div>}
    <p className="mt-8 text-xs leading-5 text-white/35">Your account data is shown only after signing in. Payment review and plan access are handled separately; contact support if a record looks incorrect.</p>
  </div></main>;
}
