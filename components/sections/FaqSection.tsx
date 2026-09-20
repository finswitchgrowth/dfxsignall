import Link from "next/link";
import { Accordion } from "@/components/ui/Accordion";
import { SectionHeading } from "@/components/ui/Primitives";
import { Reveal } from "@/components/ui/Reveal";
import { faqs, type FaqItem } from "@/content/faq";
import { site } from "@/content/site";

export function faqJsonLd(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

export function FaqSection({ limit, showHeading = true }: { limit?: number; showHeading?: boolean }) {
  const items = limit ? faqs.slice(0, limit) : faqs;
  return (
    <section className="section-y relative" aria-labelledby="faq">
      <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        {showHeading ? (
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading eyebrow="FAQ" title="Clear answers, before anything else." lead="Straight answers about signals, the platform and staying safe." />
            <Reveal delay={0.2}>
              <p className="mt-8 text-sm text-[var(--color-muted)]">
                Still have a question?{" "}
                <Link href="/contact" className="link-u text-[var(--color-cyan)]">
                  Contact us
                </Link>{" "}
                or email <span className="text-[var(--color-fg-soft)]">{site.contact.email}</span>.
              </p>
              {limit && (
                <Link href="/faq" className="btn btn-ghost btn-sm mt-6">
                  View all questions
                </Link>
              )}
            </Reveal>
          </div>
        ) : (
          <div />
        )}
        <Reveal amount={0.1}>
          <Accordion items={items} />
        </Reveal>
      </div>
    </section>
  );
}
