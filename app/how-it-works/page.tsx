import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { SignalExperience } from "@/components/sections/SignalExperience";
import { ComingSoonBadge, SectionHeading } from "@/components/ui/Primitives";
import { Reveal } from "@/components/ui/Reveal";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "How it works",
  description: "The DFXSIGNALL journey: create an account, verify, choose a package, activate, and receive structured signals and market intelligence.",
  path: "/how-it-works",
});

const dos = [
  "Only use the official DFXSIGNALL website and platform.",
  "Check payment instructions inside your signed-in account.",
  "Decide your maximum risk per trade before acting on any signal.",
];
const donts = [
  "Share passwords or one-time codes with anyone.",
  "Send money to individuals offering “early access” or “guaranteed returns”.",
  "Treat any signal or analysis as a promise of profit.",
];

export default function HowItWorksPage() {
  return (
    <>
      <PageHero eyebrow="How it works" title="From sign-up to your first signal." lead="The planned DFXSIGNALL client journey, step by step.">
        <ComingSoonBadge />
      </PageHero>
      <HowItWorks showHeading={false} />
      <SignalExperience />
      <section className="section-y pt-0">
        <div className="container-x">
          <SectionHeading eyebrow="Stay safe" title="A few rules that protect you." />
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            <Reveal>
              <div className="panel h-full p-7">
                <p className="flex items-center gap-2 font-medium text-[var(--color-green)]">
                  <CheckCircle2 size={18} /> Always
                </p>
                <ul className="mt-5 space-y-3">
                  {dos.map((d) => (
                    <li key={d} className="text-sm text-[var(--color-fg-soft)]">
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="panel h-full p-7">
                <p className="flex items-center gap-2 font-medium text-[var(--color-red)]">
                  <AlertTriangle size={18} /> Never
                </p>
                <ul className="mt-5 space-y-3">
                  {donts.map((d) => (
                    <li key={d} className="text-sm text-[var(--color-fg-soft)]">
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
      <FinalCTA />
    </>
  );
}
