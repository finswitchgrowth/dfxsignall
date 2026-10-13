"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { ArrowUpRight, LogOut, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { ButtonLink } from "@/components/ui/Interactive";
import { primaryNav } from "@/content/site";
import { cn } from "@/lib/utils";

export function Navbar() {
 const pathname=usePathname();const router=useRouter();const {scrollY}=useScroll();
 const [scrolled,setScrolled]=useState(false);const [hidden,setHidden]=useState(false);const [open,setOpen]=useState(false);
 const [accountHref,setAccountHref]=useState("/login");const [signedIn,setSignedIn]=useState(false);const [signingOut,setSigningOut]=useState(false);
 useMotionValueEvent(scrollY,"change",(y)=>{const prev=scrollY.getPrevious()??0;setScrolled(y>24);setHidden(y>480&&y>prev&&!open);});
 useEffect(()=>setOpen(false),[pathname]);
 useEffect(()=>{document.documentElement.style.overflow=open?"hidden":"";return()=>{document.documentElement.style.overflow="";};},[open]);
 useEffect(()=>{
  let cancelled=false;
  if(pathname==="/login"||pathname==="/register"||pathname==="/forgot-password"){setAccountHref("/login");setSignedIn(false);return;}
  (async()=>{try{
   const r=await fetch("/api/account",{cache:"no-store",credentials:"same-origin"});
   if(!r.ok){if(!cancelled){setAccountHref("/login");setSignedIn(false);}return;}
   const d=await fetch("/api/auth/destination",{cache:"no-store",credentials:"same-origin"});
   const data=d.ok?await d.json():{destination:"/dashboard"};
   if(!cancelled){setAccountHref(data.destination==="/admin"?"/admin":"/dashboard");setSignedIn(true);}
  }catch{if(!cancelled){setAccountHref("/login");setSignedIn(false);}}})();
  return()=>{cancelled=true;};
 },[pathname]);
 async function signOut(){setSigningOut(true);try{await fetch("/api/auth/logout",{method:"POST",credentials:"same-origin",cache:"no-store"});}finally{setSignedIn(false);setAccountHref("/login");setOpen(false);router.replace("/login");router.refresh();setSigningOut(false);}}
 const accountLabel=accountHref==="/admin"?"Admin portal":"Dashboard";
 return <>
  <motion.header initial={{y:-90,opacity:0}} animate={{y:hidden?-100:0,opacity:1}} transition={{duration:0.6,ease:[0.16,1,0.3,1]}} className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5">
   <nav aria-label="Primary" className={cn("mx-auto flex h-[60px] max-w-[1280px] items-center justify-between rounded-full pl-4 pr-2 transition-all duration-500 sm:pl-5",scrolled||open?"glass shadow-[0_20px_60px_-30px_rgb(0_0_0/0.9)]":"border border-transparent bg-transparent")}>
    <Link href="/" aria-label="DFXSIGNALL home" className="flex items-center gap-0.5"><BrandLogo variant="mark" width={52} priority alt="DFXSIGNALL emblem"/><BrandLogo variant="wordmark" width={134} priority className="hidden min-[380px]:inline-block" alt="DFXSIGNALL"/></Link>
    <ul className="hidden items-center gap-1 lg:flex">{primaryNav.map(item=>{const active=pathname===item.href||pathname.startsWith(item.href+"/");return <li key={item.href}><Link href={item.href} className={cn("relative rounded-full px-3.5 py-2 text-[0.88rem] transition-colors",active?"text-white":"text-[var(--color-muted)] hover:text-white")}>{active&&<motion.span layoutId="nav-active" className="absolute inset-0 -z-10 rounded-full border border-[var(--line-strong)] bg-white/[0.05]" transition={{type:"spring",stiffness:380,damping:32}}/>}{item.label}</Link></li>;})}</ul>
    <div className="flex items-center gap-2"><div className="hidden min-w-[132px] flex-col items-stretch gap-1.5 sm:flex"><Link href={accountHref} className="inline-flex min-h-9 items-center justify-center rounded-full border border-[var(--line-strong)] px-3 py-2 text-sm text-[var(--color-fg-soft)] transition hover:border-[var(--color-cyan)]/40 hover:text-white">{signedIn?accountLabel:"Sign in"}</Link>{signedIn?<button type="button" onClick={signOut} disabled={signingOut} className="inline-flex min-h-8 items-center justify-center gap-1 rounded-full px-3 py-1.5 text-xs text-[var(--color-muted)] transition hover:bg-white/[0.05] hover:text-white disabled:opacity-60"><LogOut size={14}/>{signingOut?"Signing out…":"Sign out"}</button>:<ButtonLink href="/register" size="sm">Create account <ArrowUpRight size={15}/></ButtonLink>}</div><button type="button" onClick={()=>setOpen(v=>!v)} aria-expanded={open} aria-controls="mobile-nav" aria-label={open?"Close menu":"Open menu"} className="grid h-11 w-11 place-items-center rounded-full border border-[var(--line-strong)] bg-white/[0.03] lg:hidden">{open?<X size={18}/>:<Menu size={18}/>}</button></div>
   </nav>
  </motion.header>
  <AnimatePresence>{open&&<motion.div id="mobile-nav" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.35}} className="fixed inset-0 z-40 bg-[var(--color-ink-950)]/95 backdrop-blur-xl lg:hidden"><div className="grid-bg absolute inset-0 opacity-60" aria-hidden/><div className="relative flex h-full flex-col overflow-y-auto px-6 pb-10 pt-28"><ul className="flex flex-col">{[{label:"Home",href:"/"},...primaryNav,{label:"About",href:"/about"},{label:"Contact",href:"/contact"}].map((item,i)=><motion.li key={item.href} initial={{opacity:0,x:-24}} animate={{opacity:1,x:0}} transition={{delay:0.04*i+0.05,duration:0.5,ease:[0.16,1,0.3,1]}} className="border-b border-[var(--line)]"><Link href={item.href} className={cn("flex items-center justify-between py-4 font-[family-name:var(--font-display)] text-2xl tracking-tight",pathname===item.href?"text-white":"text-[var(--color-fg-soft)]")}>{item.label}<ArrowUpRight size={18} className="text-[var(--color-dim)]"/></Link></motion.li>)}</ul><div className="mt-auto flex flex-col gap-3"><ButtonLink href={accountHref} full magnetic={false}>{signedIn?"Open "+accountLabel:"Sign in"}</ButtonLink>{signedIn?<button type="button" onClick={signOut} disabled={signingOut} className="flex w-full items-center justify-center gap-2 rounded-full border border-[var(--line-strong)] px-4 py-3 text-sm text-[var(--color-fg-soft)] disabled:opacity-60"><LogOut size={16}/>{signingOut?"Signing out…":"Sign out"}</button>:<ButtonLink href="/register" full magnetic={false}>Create account</ButtonLink>}</div></div></motion.div>}</AnimatePresence>
 </>;
}
