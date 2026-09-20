import Link from "next/link";
import { Mail } from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { footerNav, site } from "@/content/site";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative mt-10 overflow-hidden border-t border-[var(--line)] bg-[var(--color-ink-950)]">
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 divider-glow" aria-hidden />
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[60rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(43_107_255/0.12),transparent)]"
        aria-hidden
      />
      <div className="container-x relative py-16 sm:py-20">
        <div className="grid gap-14 lg:grid-cols-[1.3fr_2fr]">
          <div className="flex flex-col gap-6">
            <Link href="/" aria-label="DFXSIGNALL home" className="w-fit">
              <BrandLogo variant="lockup" width={220} />
            </Link>
            <p className="t-body max-w-sm text-sm">{site.description}</p>
            <a href={`mailto:${site.contact.email}`} className="link-u inline-flex w-fit items-center gap-2 text-sm text-[var(--color-fg-soft)]">
              <Mail size={15} className="text-[var(--color-cyan)]" /> {site.contact.email}
            </a>
          </div>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            {footerNav.map((col) => (
              <div key={col.title}>
                <p className="t-eyebrow mb-5 text-[var(--color-dim)]">{col.title}</p>
                <ul className="flex flex-col gap-3">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="link-u text-sm text-[var(--color-muted)]">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 rounded-2xl border border-[var(--line)] bg-white/[0.015] p-5 sm:p-6">
          <p className="text-xs leading-relaxed text-[var(--color-dim)]">
            <strong className="font-semibold text-[var(--color-muted)]">Risk warning.</strong> Trading forex, metals, indices, commodities and
            digital assets carries a high level of risk and may not be suitable for everyone. You could lose some or all of your capital.
            DFXSIGNALL provides general market information, signals and education only — not investment, financial, legal or tax advice, and
            not a guarantee of any result. Market data and signal examples on this website are simulated demo content. This website does not
            accept payments or deposits. Read the{" "}
            <Link href="/risk-disclosure" className="link-u text-[var(--color-fg-soft)]">
              full risk disclosure
            </Link>
            .
          </p>
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-4 border-t border-[var(--line)] pt-8 text-xs text-[var(--color-dim)] sm:flex-row sm:items-center">
          <p>
            © {year} {site.name}. All rights reserved.
          </p>
          <p className="t-eyebrow text-[0.62rem] text-[var(--color-dim)]">{site.pillars.join("  ·  ")}</p>
        </div>
      </div>
    </footer>
  );
}
