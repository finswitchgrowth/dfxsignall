import Link from "next/link";
import { PageHero } from "./PageHero";

export type LegalSection = { id: string; title: string; body: (string | string[])[] };

export function LegalPage({ eyebrow, title, lead, updated, sections }: { eyebrow: string; title: string; lead: string; updated: string; sections: LegalSection[] }) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} lead={lead} crumbs={[{ label: "Legal" }, { label: title }]}>
        <p className="t-num text-xs text-[var(--color-dim)]">Last updated · {updated}</p>
      </PageHero>
      <section className="pb-24">
        <div className="container-x grid gap-12 lg:grid-cols-[240px_1fr]">
          <aside className="hidden lg:block">
            <nav aria-label="On this page" className="sticky top-28">
              <p className="t-eyebrow mb-4 text-[0.62rem] text-[var(--color-dim)]">On this page</p>
              <ol className="flex flex-col gap-2.5 border-l border-[var(--line)] pl-4">
                {sections.map((s, i) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className="link-u text-sm text-[var(--color-muted)]">
                      {i + 1}. {s.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </aside>
          <article className="prose-legal panel max-w-3xl p-6 sm:p-10">
            {sections.map((s, i) => (
              <section key={s.id} id={s.id} className="scroll-mt-28 first:[&>h2]:mt-0">
                <h2>
                  {i + 1}. {s.title}
                </h2>
                {s.body.map((b, j) =>
                  Array.isArray(b) ? (
                    <ul key={j}>
                      {b.map((li) => (
                        <li key={li}>{li}</li>
                      ))}
                    </ul>
                  ) : (
                    <p key={j} className="mt-3">
                      {b}
                    </p>
                  ),
                )}
              </section>
            ))}
            <p className="mt-12 border-t border-[var(--line)] pt-6 text-sm">
              Questions about this document?{" "}
              <Link href="/contact" className="link-u text-[var(--color-cyan)]">
                Contact us
              </Link>
              .
            </p>
          </article>
        </div>
      </section>
    </>
  );
}
