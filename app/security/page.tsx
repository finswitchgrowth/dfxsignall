import { Bug, MailWarning, Phone, UserX } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Security, securityPrinciples } from "@/components/sections/Security";
import { SpotlightCard } from "@/components/ui/Interactive";
import { SectionHeading } from "@/components/ui/Primitives";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/content/site";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Security",
  description: "How DFXSIGNALL protects this website today, the security principles behind the client platform, and how to stay safe from impersonation scams.",
  path: "/security",
});

const scams = [
  { icon: UserX, title: "Impersonation", text: "Fake profiles or groups using the DFXSIGNALL name. We never ask you to pay individuals or private accounts." },
  { icon: MailWarning, title: "Phishing links", text: "Messages pushing you to log in through a link. Type the official address yourself instead." },
  { icon: Phone, title: "Guaranteed-return offers", text: "Any promise of fixed or guaranteed profit is a warning sign — DFXSIGNALL never makes one." },
];

export default function SecurityPage() {
  return (
    <>
      <PageHero
        eyebrow="Security"
        title="Honest security, clearly explained."
        lead="We only describe protections that are actually in place, and we label platform principles as exactly that until the client platform launches."
      />
      <Security />
      <section className="section-y pt-0">
        <div className="container-x">
          <SectionHeading
            eyebrow="Client platform principles"
            title="How the platform is being built."
            lead="These principles guide the client platform. They describe design commitments for launch, not features available on this website today."
          />
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {securityPrinciples.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.08}>
                <SpotlightCard className="panel h-full p-6">
                  <s.icon size={20} className="text-[var(--color-cyan)]" />
                  <h3 className="t-h3 mt-5">{s.title}</h3>
                  <p className="t-body mt-2 text-sm">{s.text}</p>
                </SpotlightCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y pt-0">
        <div className="container-x">
          <SectionHeading eyebrow="Stay safe" title="Recognise common scams." />
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {scams.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.08}>
                <SpotlightCard className="panel h-full p-6">
                  <s.icon size={20} className="text-[var(--color-amber)]" />
                  <h3 className="t-h3 mt-5">{s.title}</h3>
                  <p className="t-body mt-2 text-sm">{s.text}</p>
                </SpotlightCard>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-6">
            <div className="panel flex flex-col gap-4 p-7 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-4">
                <Bug size={20} className="mt-0.5 shrink-0 text-[var(--color-cyan)]" />
                <div>
                  <h3 className="font-medium">Report a security issue or impersonation</h3>
                  <p className="t-body mt-1 text-sm">If you find a vulnerability or a fake DFXSIGNALL account, please tell us.</p>
                </div>
              </div>
              <a href={`mailto:${site.contact.email}?subject=${encodeURIComponent("Security report")}`} className="btn btn-ghost btn-sm shrink-0">
                {site.contact.email}
              </a>
            </div>
          </Reveal>
        </div>
      </section>
      <FinalCTA />
    </>
  );
}
