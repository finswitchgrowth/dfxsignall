import Link from "next/link";
import { ArrowLeft, ArrowRight, Activity, Compass, House, Search } from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";

const destinations = [
  { href: "/markets", label: "Market terminal", detail: "Charts, indicators and market coverage", icon: Activity },
  { href: "/signals", label: "Trading signals", detail: "Understand signal structure and risk levels", icon: Compass },
  { href: "/trading-tools", label: "Trading tools", detail: "Plan risk and reward before a trade", icon: Search },
];

export default function NotFound() {
  return (
    <main className="relative grid min-h-[100svh] place-items-center overflow-hidden px-5 py-24 text-center sm:px-8">
      <div className="grid-bg absolute inset-0 -z-10" aria-hidden />
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(43_107_255/0.18),transparent)]" aria-hidden />
      <div className="w-full max-w-3xl">
        <div className="flex justify-center"><BrandLogo variant="mark" width={76} /></div>
        <p className="t-eyebrow mt-7">NAVIGATION INTERRUPTED · ERROR 404</p>
        <p className="t-num mt-2 text-8xl leading-none text-silver sm:text-9xl">404</p>
        <h1 className="t-h2 mt-5">This page missed its entry.</h1>
        <p className="t-body mx-auto mt-4 max-w-xl">The link may be broken, the address may have changed, or this page may no longer be available. Your next move is still yours to choose.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-primary"><House className="mr-2 inline size-4" /> Return to home</Link>
          <button type="button" onClick={() => window.history.back()} className="btn btn-ghost"><ArrowLeft className="mr-2 inline size-4" /> Go back</button>
        </div>
        <div className="mt-14 grid gap-3 text-left sm:grid-cols-3">
          {destinations.map(({ href, label, detail, icon: Icon }) => (
            <Link key={href} href={href} className="panel group p-5 transition-transform hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-400">
              <Icon className="size-5 text-cyan-300" aria-hidden />
              <p className="mt-4 font-semibold text-silver">{label}</p>
              <p className="mt-2 text-sm text-[var(--color-muted)]">{detail}</p>
              <span className="mt-4 inline-flex items-center text-xs text-cyan-300">Open destination <ArrowRight className="ml-1 size-3" /></span>
            </Link>
          ))}
        </div>
        <p className="mt-8 text-xs text-[var(--color-dim)]">DFXSIGNALL provides trading information and planning tools, not guaranteed outcomes.</p>
      </div>
    </main>
  );
}
