"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { ButtonLink } from "@/components/ui/Interactive";
import { primaryNav } from "@/content/site";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    setHidden(y > 480 && y > prev && !open);
  });

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => { document.documentElement.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <motion.header initial={{ y: -90, opacity: 0 }} animate={{ y: hidden ? -100 : 0, opacity: 1 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className="fixed inset-x-0 top-0 z-50 px-2.5 pt-3 sm:px-5">
        <nav aria-label="Primary" className={cn("mx-auto flex h-[60px] max-w-[1280px] items-center justify-between gap-2 rounded-full pl-3 pr-2 transition-all duration-500 sm:pl-5", scrolled || open ? "glass shadow-[0_20px_60px_-30px_rgb(0_0_0/0.9)]" : "border border-transparent bg-transparent")}>
          <Link href="/" aria-label="DFXSIGNALL home" className="flex min-w-0 max-w-[calc(100%-54px)] shrink items-center gap-1">
            <BrandLogo variant="mark" width={48} priority className="w-[clamp(34px,10vw,48px)]" alt="DFXSIGNALL emblem" />
            <BrandLogo variant="wordmark" width={124} priority className="hidden min-[400px]:inline-block min-[400px]:w-[clamp(92px,28vw,124px)]" alt="DFXSIGNALL" />
          </Link>
          <ul className="hidden items-center gap-1 lg:flex">
            {primaryNav.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + "/");
              return <li key={item.href}><Link href={item.href} className={cn("relative rounded-full px-3.5 py-2 text-[0.88rem] transition-colors", active ? "text-white" : "text-[var(--color-muted)] hover:text-white")}>{active && <motion.span layoutId="nav-active" className="absolute inset-0 -z-10 rounded-full border border-[var(--line-strong)] bg-white/[0.05]" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}{item.label}</Link></li>;
            })}
          </ul>
          <div className="flex shrink-0 items-center gap-2">
            <Link href="/login" className="link-u hidden px-2 text-[0.88rem] text-[var(--color-fg-soft)] sm:inline">Login</Link>
            <span className="hidden sm:inline-flex"><ButtonLink href="/register" size="sm">Get started <ArrowUpRight size={15} /></ButtonLink></span>
            <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? "Close menu" : "Open menu"} className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[var(--line-strong)] bg-white/[0.03] lg:hidden">{open ? <X size={18} /> : <Menu size={18} />}</button>
          </div>
        </nav>
      </motion.header>
      <AnimatePresence>
        {open && <motion.div id="mobile-nav" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }} className="fixed inset-0 z-40 bg-[var(--color-ink-950)]/95 backdrop-blur-xl lg:hidden">
          <div className="grid-bg absolute inset-0 opacity-60" aria-hidden />
          <div className="relative flex h-full flex-col overflow-y-auto px-6 pb-10 pt-28">
            <ul className="flex flex-col">
              {[{ label: "Home", href: "/" }, ...primaryNav, { label: "About", href: "/about" }, { label: "Contact", href: "/contact" }].map((item, i) => <motion.li key={item.href} initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.04 * i + 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="border-b border-[var(--line)]"><Link href={item.href} className={cn("flex items-center justify-between py-4 font-[family-name:var(--font-display)] text-2xl tracking-tight", pathname === item.href ? "text-white" : "text-[var(--color-fg-soft)]")}>{item.label}<ArrowUpRight size={18} className="text-[var(--color-dim)]" /></Link></motion.li>)}
            </ul>
            <div className="mt-auto flex flex-col gap-3"><ButtonLink href="/register" full magnetic={false}>Get started</ButtonLink><ButtonLink href="/login" variant="ghost" full magnetic={false}>Login</ButtonLink></div>
          </div>
        </motion.div>}
      </AnimatePresence>
    </>
  );
}
