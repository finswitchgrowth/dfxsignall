import Link from "next/link";
import { ArrowUpRight, BookOpen, Headphones, HelpCircle, Mail, Ticket } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { FaqSection } from "@/components/sections/FaqSection";
import { SpotlightCard } from "@/components/ui/Interactive";
import { ComingSoonBadge } from "@/components/ui/Primitives";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/content/site";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Support",
  description: "Get help with DFXSIGNALL: FAQs, educational insights and email support. Live support desk and client tickets launch with the platform.",
  path: "/support",
});

const options = [
  { icon: HelpCircle, title: "Help centre", text: "Answers to common questions about signals, the platform and safety.", href: "/faq", cta: "Browse FAQ" },
  { icon: BookOpen, title: "Learn", text: "Articles on risk, structure and evaluating trade ideas.", href: "/blog", cta: "Read insights" },
  { icon: Mail, title: "Email support", text: "Write to the team for anything not covered here.", href: `mailto:${site.contact.email}?subject=${encodeURIComponent("Support request")}`, cta: site.contact.email },
  { icon: Headphones, title: "Live support desk", text: "Real-time help inside the client platform.", soon: true },
  { icon: Ticket, title: "Support tickets", text: "Raise and track requests from your dashboard.", soon: true },
];

export default function SupportPage() {
  return (
    <>
      <PageHero eyebrow="Support" title="How can we help?" lead="Find answers fast, or reach the DFXSIGNALL team directly." />
      <section className="pb-10">
        <div className="container-x grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {options.map((o, i) => (
            <Reveal key={o.title} delay={i * 0.06}>
              <SpotlightCard className="panel flex h-full flex-col p-6">
                <div className="flex items-center justify-between">
                  <o.icon size={20} className="text-[var(--color-cyan)]" />
                  {o.soon && <ComingSoonBadge />}
                </div>
                <h2 className="t-h3 mt-6">{o.title}</h2>
                <p className="t-body mt-2 flex-1 text-sm">{o.text}</p>
                {o.href && (
                  <Link href={o.href} className="link-u mt-6 inline-flex w-fit items-center gap-1.5 break-all text-sm text-[var(--color-fg-soft)]">
                    {o.cta} <ArrowUpRight size={14} />
                  </Link>
                )}
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </section>
      <FaqSection />
    </>
  );
}
