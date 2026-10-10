"use client";
import {useEffect,useState} from "react";
import {useRouter} from "next/navigation";
export default function AuthCallbackPage(){
 const router=useRouter();const [message,setMessage]=useState("Verifying your email and establishing a secure session…");
 useEffect(()=>{let cancelled=false;(async()=>{
  const url=new URL(window.location.href);const hash=new URLSearchParams(url.hash.replace(/^#/,""));
  const error=hash.get("error_description")||hash.get("error")||url.searchParams.get("error_description")||url.searchParams.get("error");
  if(error){if(!cancelled){setMessage("Verification could not be completed. The link may have expired; request a new email and try again.");window.history.replaceState(null,"",url.pathname);}return;}
  try{
   let accessToken=hash.get("access_token"),refreshToken=hash.get("refresh_token");
   const tokenHash=url.searchParams.get("token_hash"),type=url.searchParams.get("type");
   if(!accessToken&&tokenHash){
    const verify=await fetch("/api/auth/verify-email",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({token_hash:tokenHash,type:type||"signup"})});
    const data=await verify.json();if(!verify.ok)throw new Error(data.error||"Email verification failed.");
    accessToken=data.access_token;refreshToken=data.refresh_token;
   }
   if(!accessToken){if(!cancelled)setMessage("No valid verification token was returned. Confirm the Supabase email template uses the confirmation URL and that the callback URL is allow-listed.");return;}
   const session=await fetch("/api/auth/session",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({access_token:accessToken,refresh_token:refreshToken})});
   const sessionData=await session.json();if(!session.ok)throw new Error(sessionData.error||"Could not establish a secure session.");
   window.history.replaceState(null,"",url.pathname);
   if(!cancelled){setMessage("Verification successful. Opening your account…");const dest=await fetch("/api/auth/destination",{cache:"no-store",credentials:"same-origin"});const route=dest.ok?await dest.json():{destination:"/dashboard"};router.replace(route.destination==="/admin"?"/admin":"/dashboard");router.refresh();}
  }catch(e){if(!cancelled)setMessage(e instanceof Error?e.message:"Verification failed. Please try again.");}
 })();return()=>{cancelled=true;};},[router]);
 return <main className="flex min-h-[70vh] items-center justify-center bg-slate-950 px-4 py-16"><section className="w-full max-w-lg rounded-2xl border border-white/10 bg-white/[0.04] p-8 text-center"><p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">DFXSIGNALL · Secure account verification</p><h1 className="mt-4 text-2xl font-semibold text-white">Account verification</h1><p role="status" className="mt-4 text-sm leading-6 text-white/70">{message}</p><a href="/login" className="mt-6 inline-block text-sm text-cyan-200 underline">Return to login</a></section></main>;
}
