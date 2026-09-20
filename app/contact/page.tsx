import { Briefcase, Mail, ShieldAlert } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { ContactForm } from "@/components/sections/ContactForm";
import { SpotlightCard } from "@/components/ui/Interactive";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/content/site";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Contact",
  description: "Contact DFXSIGNALL for general enquiries, partnerships, launch updates, security reports and compliance correspondence.",
  path: "/contact",
});

const channels = [
  { icon: Mail, title: "General enquiries", text: "Questions about DFXSIGNALL and the upcoming platform.", subject: "General enquiry" },
  { icon: Briefcase, title: "Business & partnerships", text: "Partnership, media and institutional enquiries.", subject: "Business & partnerships" },
  { icon: ShieldAlert, title: "Compliance & security", text: "Legal correspondence, security reports and impersonation.", subject: "Compliance & security" },
];

export default function ContactPage() {
  return (
    <>
      <PageHero eyebrow="Contact" title="Let’s talk." lead="Reach the DFXSIGNALL team through our official email. We typically respond on business days." />
      <section className="pb-24">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.3fr]">
          <div className="flex flex-col gap-3">
            {channels.map((c, i) => (
              <Reveal key={c.title} delay={i * 0.07}>
                <SpotlightCard className="panel flex gap-4 p-6">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-[var(--line-strong)] text-[var(--color-cyan)]">
                    <c.icon size={18} />
                  </span>
                  <div className="min-w-0">
                    <h2 className="text-base font-medium">{c.title}</h2>
                    <p className="t-body mt-1 text-sm">{c.text}</p>
                    <a href={`mailto:${site.contact.email}?subject=${encodeURIComponent(c.subject)}`} className="link-u mt-3 inline-block break-all text-sm text-[var(--color-cyan)]">
                      {site.contact.email}
                    </a>
                  </div>
                </SpotlightCard>
              </Reveal>
            ))}
            <Reveal delay={0.25}>
              <p className="mt-3 rounded-2xl border border-[var(--color-amber)]/25 bg-[var(--color-amber)]/[0.05] p-5 text-xs leading-relaxed text-[var(--color-fg-soft)]">
                <strong className="text-[var(--color-amber)]">Official channels only.</strong> DFXSIGNALL will never ask for your password, one-time
                codes, or for payment through personal accounts, chats or social media.
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
