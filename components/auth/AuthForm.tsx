"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { authRequest, supabaseConfigured } from "@/lib/supabase-browser";

type Mode = "login" | "register" | "reset";

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage(""); setError("");
    try {
      if (mode === "reset") {
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) throw new Error("Password recovery is not configured yet.");
        const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/recover`, {
          method: "POST", headers: { "Content-Type": "application/json", apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY },
          body: JSON.stringify({ email, redirect_to: `${window.location.origin}/login` })
        });
        if (!response.ok) throw new Error("Could not send recovery email. Check the email address and try again.");
        setMessage("If an account exists for this email, password recovery instructions will be sent.");
      } else if (mode === "register") {
        await authRequest("signup", { email, password, data: { display_name: name } });
        setMessage("Registration submitted. Check your email for a verification link before signing in.");
      } else {
        const data = await authRequest("token?grant_type=password", { email, password });
        if (data.access_token) {
          sessionStorage.setItem("dfxsignall_access_token", data.access_token);
          if (data.refresh_token) sessionStorage.setItem("dfxsignall_refresh_token", data.refresh_token);
          if (data.user?.id) sessionStorage.setItem("dfxsignall_user_id", data.user.id);
          router.push("/dashboard");
          router.refresh();
        } else setMessage("Check your email to verify the account before signing in.");
      }
    } catch (e) { setError(e instanceof Error ? e.message : "Something went wrong."); }
    finally { setBusy(false); }
  }

  const title = mode === "register" ? "Create your account" : mode === "reset" ? "Reset your password" : "Welcome back";
  return <section className="mx-auto w-full max-w-lg rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl sm:p-8">
    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">DFXSIGNALL · Client portal</p>
    <h1 className="text-3xl font-semibold tracking-tight text-white">{title}</h1>
    <p className="mt-2 text-sm leading-6 text-white/65">{mode === "register" ? "Create an account to access your customer workspace." : mode === "reset" ? "We’ll send recovery instructions if the account exists." : "Sign in to continue to your workspace."}</p>
    {!supabaseConfigured() && <p className="mt-5 rounded-lg border border-amber-400/30 bg-amber-400/10 p-3 text-sm text-amber-100">Authentication configuration is missing for this deployment.</p>}
    <form onSubmit={submit} className="mt-6 space-y-4">
      {mode === "register" && <label className="block text-sm text-white/80">Full name<input autoComplete="name" value={name} onChange={e=>setName(e.target.value)} required minLength={2} className="mt-2 w-full rounded-lg border border-white/15 bg-black/30 px-4 py-3 text-white outline-none focus:border-cyan-300" /></label>}
      <label className="block text-sm text-white/80">Email address<input type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} required className="mt-2 w-full rounded-lg border border-white/15 bg-black/30 px-4 py-3 text-white outline-none focus:border-cyan-300" /></label>
      {mode !== "reset" && <label className="block text-sm text-white/80">Password<input type="password" autoComplete={mode === "register" ? "new-password" : "current-password"} value={password} onChange={e=>setPassword(e.target.value)} required minLength={8} className="mt-2 w-full rounded-lg border border-white/15 bg-black/30 px-4 py-3 text-white outline-none focus:border-cyan-300" /><span className="mt-1 block text-xs text-white/45">Use at least 8 characters.</span></label>}
      {error && <p role="alert" className="rounded-lg border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-200">{error}</p>}
      {message && <p role="status" className="rounded-lg border border-emerald-400/30 bg-emerald-400/10 p-3 text-sm text-emerald-100">{message}</p>}
      <button disabled={busy || !supabaseConfigured()} className="w-full rounded-lg bg-cyan-300 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-50">{busy ? "Please wait…" : mode === "register" ? "Create account" : mode === "reset" ? "Send recovery email" : "Sign in"}</button>
    </form>
    <div className="mt-5 flex flex-wrap justify-between gap-3 text-sm text-cyan-200">
      {mode !== "login" && <a href="/login" className="hover:underline">Sign in</a>}
      {mode !== "register" && <a href="/register" className="hover:underline">Create account</a>}
      {mode !== "reset" && <a href="/forgot-password" className="hover:underline">Forgot password?</a>}
    </div>
    <p className="mt-6 text-xs leading-5 text-white/40">Account creation does not activate paid features. Payment and subscription status are subject to independent verification.</p>
  </section>;
}
