import Link from "next/link";
import { AdminSignalDesk } from "@/components/admin/AdminSignalDesk";

const panelClass = "rounded-2xl border border-white/10 bg-white/[.035] p-5 transition hover:border-cyan-300/40 hover:bg-white/[.055]";

export default function AdminDashboardPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-7 flex flex-col justify-between gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs uppercase tracking-[.24em] text-cyan-300">DFXSIGNALL · CONTROL CENTER</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Admin dashboard</h1>
            <p className="mt-2 max-w-2xl text-sm text-white/60">Manage signal publishing and client purchase history from one workspace.</p>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/5 px-3 py-2 text-xs text-emerald-200">
            <span className="h-2 w-2 rounded-full bg-emerald-300" /> Admin workspace
          </span>
        </header>

        <section aria-label="Admin panels" className="mb-8 grid gap-4 sm:grid-cols-2">
          <Link href="#signal-management" className={panelClass}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[.18em] text-cyan-300">01 · Signal operations</p>
                <h2 className="mt-2 text-xl font-semibold">Signal management</h2>
                <p className="mt-2 text-sm leading-6 text-white/55">Create, publish, edit status, close, or cancel client signals directly below.</p>
              </div>
              <span aria-hidden="true" className="text-2xl text-cyan-200">↗</span>
            </div>
            <p className="mt-4 text-sm font-medium text-cyan-200">Open signal controls ↓</p>
          </Link>
          <Link href="/admin/clients" className={panelClass}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[.18em] text-cyan-300">02 · Customer operations</p>
                <h2 className="mt-2 text-xl font-semibold">Clients & purchase history</h2>
                <p className="mt-2 text-sm leading-6 text-white/55">Review payment history, access entitlements, client records, and follow-up reminders.</p>
              </div>
              <span aria-hidden="true" className="text-2xl text-cyan-200">↗</span>
            </div>
            <p className="mt-4 text-sm font-medium text-cyan-200">Open client report →</p>
          </Link>
        </section>

        <section id="signal-management" className="scroll-mt-6">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[.2em] text-cyan-300">Integrated panel</p>
              <h2 className="mt-1 text-2xl font-semibold">Signal desk</h2>
              <p className="mt-1 text-sm text-white/55">The signal desk is now part of this admin dashboard.</p>
            </div>
            <Link href="/admin/signals" className="rounded-lg border border-white/15 px-3 py-2 text-sm text-white/75 hover:border-cyan-300/50 hover:text-cyan-100">Open standalone view ↗</Link>
          </div>
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950">
            <AdminSignalDesk />
          </div>
        </section>
      </div>
    </main>
  );
}
