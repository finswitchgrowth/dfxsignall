import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { faqJsonLd } from "@/components/sections/FaqSection";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Accordion } from "@/components/ui/Accordion";
import { Reveal } from "@/components/ui/Reveal";
import { faqs, type FaqItem } from "@/content/faq";
import { site } from "@/content/site";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "FAQ",
  description: "Answers about DFXSIGNALL signals, the upcoming client platform, demo market data and staying safe.",
  path: "/faq",
});

const order: FaqItem["category"][] = ["General", "Signals", "Platform", "Safety"];

export default function FaqPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(faqs)) }} />
      <PageHero eyebrow="FAQ" title="Frequently asked questions." lead="Clear answers about DFXSIGNALL, signals, the platform and your safety." />
      <section className="pb-24">
        <div className="container-x grid gap-12 lg:grid-cols-[220px_1fr]">
          <nav aria-label="FAQ categories" className="hidden lg:block">
            <ul className="sticky top-28 flex flex-col gap-2.5 border-l border-[var(--line)] pl-4">
              {order.map((c) => (
                <li key={c}>
                  <a href={`#${c.toLowerCase()}`} className="link-u text-sm text-[var(--color-muted)]">
                    {c}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex flex-col gap-16">
            {order.map((c) => (
              <Reveal key={c} amount={0.05}>
                <div id={c.toLowerCase()} className="scroll-mt-28">
                  <p className="t-eyebrow mb-4">{c}</p>
                  <Accordion items={faqs.filter((f) => f.category === c)} defaultOpen={null} />
                </div>
              </Reveal>
            ))}
            <p className="text-sm text-[var(--color-muted)]">
              Didn&apos;t find your answer?{" "}
              <Link href="/contact" className="link-u text-[var(--color-cyan)]">
                Contact us
              </Link>{" "}
              or email {site.contact.email}.
            </p>
          </div>
        </div>
      </section>
      <FinalCTA />
    </>
  );
}
