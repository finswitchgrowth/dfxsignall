"use client";
import {useEffect,useState} from "react";
import {useRouter} from "next/navigation";
export default function AuthCallbackPage(){
 const router=useRouter();const [message,setMessage]=useState("Verifying your secure sign-in…");
 useEffect(()=>{let cancelled=false;(async()=>{
  const params=new URLSearchParams(window.location.hash.replace(/^#/,""));
  const error=params.get("error_description")||params.get("error");
  if(error){if(!cancelled){setMessage("Sign-in was not completed. Return to login and try again.");window.history.replaceState(null,"",window.location.pathname);}return;}
  const access_token=params.get("access_token"),refresh_token=params.get("refresh_token");
  if(!access_token){if(!cancelled)setMessage("No sign-in session was returned. Check that this provider is enabled in Supabase and try again.");return;}
  try{
   const r=await fetch("/api/auth/session",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({access_token,refresh_token})});
   const data=await r.json();if(!r.ok)throw new Error(data.error||"Could not establish a secure session.");
   window.history.replaceState(null,"",window.location.pathname);
   if(!cancelled){setMessage("Signed in successfully. Opening your dashboard…");router.replace("/dashboard");router.refresh();}
  }catch(e){if(!cancelled)setMessage(e instanceof Error?e.message:"Sign-in failed.");}
 })();return()=>{cancelled=true;};},[router]);
 return <main className="flex min-h-[70vh] items-center justify-center bg-slate-950 px-4 py-16"><section className="w-full max-w-lg rounded-2xl border border-white/10 bg-white/[0.04] p-8 text-center"><p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">DFXSIGNALL · Secure sign-in</p><h1 className="mt-4 text-2xl font-semibold text-white">Account authentication</h1><p role="status" className="mt-4 text-sm leading-6 text-white/70">{message}</p><a href="/login" className="mt-6 inline-block text-sm text-cyan-200 underline">Return to login</a></section></main>;
}
