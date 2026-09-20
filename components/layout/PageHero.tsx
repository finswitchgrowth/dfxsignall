import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { Reveal, RevealWords } from "@/components/ui/Reveal";
import { site } from "@/content/site";

type Props = {
  eyebrow: string;
  title: string;
  lead?: ReactNode;
  crumbs?: { label: string; href?: string }[];
  children?: ReactNode;
  visual?: ReactNode;
};

export function PageHero({ eyebrow, title, lead, crumbs, children, visual }: Props) {
  const trail = [{ label: "Home", href: "/" }, ...(crumbs ?? [{ label: eyebrow }])];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.label, ...(c.href ? { item: new URL(c.href, site.url).toString() } : {}) })),
  };
  return (
    <section className="relative isolate overflow-hidden pb-16 pt-36 sm:pb-20 sm:pt-44">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="grid-bg absolute inset-0 -z-10" aria-hidden />
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[40rem] w-[70rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(43_107_255/0.18),rgb(31_216_255/0.05)_50%,transparent)]" aria-hidden />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-px divider-glow opacity-40" aria-hidden />
      {visual && <div className="pointer-events-none absolute inset-y-0 right-0 -z-10 hidden w-1/2 lg:block">{visual}</div>}

      <div className="container-x">
        <Reveal>
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-1.5 text-xs text-[var(--color-dim)]">
              {trail.map((c, i) => (
                <li key={i} className="flex items-center gap-1.5">
                  {i > 0 && <ChevronRight size={12} aria-hidden />}
                  {c.href && i < trail.length - 1 ? (
                    <Link href={c.href} className="link-u">
                      {c.label}
                    </Link>
                  ) : (
                    <span aria-current={i === trail.length - 1 ? "page" : undefined} className="text-[var(--color-muted)]">
                      {c.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
          <p className="t-eyebrow mb-5 flex items-center gap-3">
            <span className="inline-block h-px w-8 bg-gradient-to-r from-transparent to-[var(--color-cyan)]" aria-hidden />
            {eyebrow}
          </p>
        </Reveal>
        <h1 className="t-display max-w-4xl text-[clamp(2.2rem,1.2rem+3.6vw,4rem)]">
          <RevealWords text={title} className="text-silver" />
        </h1>
        {lead && (
          <Reveal delay={0.2}>
            <p className="t-lead mt-7 max-w-2xl">{lead}</p>
          </Reveal>
        )}
        {children && (
          <Reveal delay={0.3} className="mt-9">
            {children}
          </Reveal>
        )}
      </div>
    </section>
  );
}
