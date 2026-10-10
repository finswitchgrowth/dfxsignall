"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseConfigured } from "@/lib/supabase-browser";

type Mode = "login" | "register" | "reset";
const providers = [
  { id: "google", label: "Continue with Google", mark: "G" },
  { id: "azure", label: "Continue with Microsoft", mark: "M" },
  { id: "apple", label: "Continue with Apple", mark: "A" },
  { id: "github", label: "Continue with GitHub", mark: "GH" },
];

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [name,setName]=useState("");
  const [busy,setBusy]=useState(false); const [message,setMessage]=useState(""); const [error,setError]=useState("");

  async function submit(event:FormEvent<HTMLFormElement>) {
    event.preventDefault();setBusy(true);setMessage("");setError("");
    try {
      if(mode==="reset") {
        const response=await fetch("/api/auth/recover",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,redirectTo:`${window.location.origin}/login`})});
        const data=await response.json();if(!response.ok)throw new Error(data.error||"Could not send recovery email.");
        setMessage("If an account exists for this email, recovery instructions will be sent.");
      } else if(mode==="register") {
        const response=await fetch("/api/auth/register",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,password,displayName:name})});
        const data=await response.json();if(!response.ok)throw new Error(data.error||"Registration failed.");
        setMessage(data.message||"Account created. Check your email to verify it.");
      } else {
        const response=await fetch("/api/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,password})});
        const data=await response.json();if(!response.ok)throw new Error(data.error||"Sign in failed.");
        const destination=await fetch("/api/auth/destination",{cache:"no-store",credentials:"same-origin"});const route=await destination.json();router.push(destination.ok&&route.destination==="/admin"?"/admin":"/dashboard");router.refresh();
      }
    } catch(e){setError(e instanceof Error?e.message:"Something went wrong.");}
    finally{setBusy(false);}
  }

  function oauth(provider:string) {
    if(!supabaseConfigured()){setError("Authentication is not configured for this deployment.");return;}
    const base=process.env.NEXT_PUBLIC_SUPABASE_URL;
    if(!base){setError("Authentication is not configured for this deployment.");return;}
    const redirectTo=`${window.location.origin}/auth/callback`;
    window.location.href=`${base.replace(/\/$/,"")}/auth/v1/authorize?provider=${encodeURIComponent(provider)}&redirect_to=${encodeURIComponent(redirectTo)}`;
  }

  const title=mode==="register"?"Create your account":mode==="reset"?"Reset your password":"Welcome back";
  return <section className="mx-auto w-full max-w-lg rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl sm:p-8">
    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">DFXSIGNALL · Client portal</p>
    <h1 className="text-3xl font-semibold tracking-tight text-white">{title}</h1>
    <p className="mt-2 text-sm leading-6 text-white/65">{mode==="register"?"Create your customer workspace with Google or your email address.":mode==="reset"?"We’ll send recovery instructions if the account exists.":"Sign in securely to continue to your workspace."}</p>
    {!supabaseConfigured()&&<p className="mt-5 rounded-lg border border-amber-400/30 bg-amber-400/10 p-3 text-sm text-amber-100">Authentication configuration is missing for this deployment.</p>}
    {mode!=="reset"&&<><div className="mt-6 grid grid-cols-1 gap-3">{providers.map(p=><button key={p.id} type="button" onClick={()=>oauth(p.id)} className="flex w-full items-center justify-center gap-3 rounded-lg border border-white/15 bg-white/[0.03] px-4 py-3 font-medium text-white transition hover:border-cyan-300/60 hover:bg-white/[0.07]"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-bold text-slate-900">{p.mark}</span>{p.label}</button>)}</div><div className="my-6 flex items-center gap-3 text-xs text-white/40"><span className="h-px flex-1 bg-white/10"/><span>OR USE EMAIL</span><span className="h-px flex-1 bg-white/10"/></div></>}
    <form onSubmit={submit} className="space-y-4">
      {mode==="register"&&<label className="block text-sm text-white/80">Full name<input autoComplete="name" value={name} onChange={e=>setName(e.target.value)} required minLength={2} maxLength={80} className="mt-2 w-full rounded-lg border border-white/15 bg-black/30 px-4 py-3 text-white outline-none focus:border-cyan-300"/></label>}
      <label className="block text-sm text-white/80">Email address<input type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} required className="mt-2 w-full rounded-lg border border-white/15 bg-black/30 px-4 py-3 text-white outline-none focus:border-cyan-300"/></label>
      {mode!=="reset"&&<label className="block text-sm text-white/80">Password<input type="password" autoComplete={mode==="register"?"new-password":"current-password"} value={password} onChange={e=>setPassword(e.target.value)} required minLength={mode==="register"?10:8} className="mt-2 w-full rounded-lg border border-white/15 bg-black/30 px-4 py-3 text-white outline-none focus:border-cyan-300"/><span className="mt-1 block text-xs text-white/45">{mode==="register"?"Use at least 10 characters.":"Use your account password."}</span></label>}
      {error&&<p role="alert" className="rounded-lg border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-200">{error}</p>}
      {message&&<p role="status" className="rounded-lg border border-emerald-400/30 bg-emerald-400/10 p-3 text-sm text-emerald-100">{message}</p>}
      <button disabled={busy||!supabaseConfigured()} className="w-full rounded-lg bg-cyan-300 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-50">{busy?"Please wait…":mode==="register"?"Create account with email":mode==="reset"?"Send recovery email":"Sign in with email"}</button>
    </form>
    <div className="mt-5 flex flex-wrap justify-between gap-3 text-sm text-cyan-200">{mode!=="login"&&<a href="/login" className="hover:underline">Sign in</a>}{mode!=="register"&&<a href="/register" className="hover:underline">Create account</a>}{mode!=="reset"&&<a href="/forgot-password" className="hover:underline">Forgot password?</a>}</div>
    <p className="mt-6 text-xs leading-5 text-white/40">Google, Microsoft, Apple and GitHub sign-in must be enabled in the Supabase authentication provider settings. Account creation does not activate paid features; paid access requires independent payment verification.</p>
  </section>;
}
