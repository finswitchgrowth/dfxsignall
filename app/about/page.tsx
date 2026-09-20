import { Ban, BookOpenCheck, Eye, ShieldAlert } from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { PageHero } from "@/components/layout/PageHero";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { WhatIs } from "@/components/sections/WhatIs";
import { SpotlightCard } from "@/components/ui/Interactive";
import { SectionHeading } from "@/components/ui/Primitives";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/content/site";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "About",
  description: "DFXSIGNALL — Trade Smarter Together. A trading intelligence ecosystem built on signals, analysis, education and disciplined growth.",
  path: "/about",
});

const principles = [
  { icon: Eye, title: "Transparency first", text: "Signals ship with their invalidation level and rationale. Performance is only published when it can be verified." },
  { icon: ShieldAlert, title: "Risk before reward", text: "Every idea starts with where it is wrong. Position sizing and risk limits are part of the product, not an afterthought." },
  { icon: BookOpenCheck, title: "Education over dependence", text: "We explain the why behind ideas, so traders grow their own judgement instead of copying blindly." },
];

const wont = [
  "Promise guaranteed, fixed or risk-free returns.",
  "Publish screenshots or performance claims that cannot be verified.",
  "Ask you to send money through chats, DMs or personal accounts.",
  "Present demo or simulated data as live market data.",
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About DFXSIGNALL"
        title="Trade smarter, together."
        lead="DFXSIGNALL exists to make market information clearer, more structured and more honest — for traders who want to see more of the market and act with discipline."
      />

      <section className="section-y">
        <div className="container-x grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <div className="panel relative grid place-items-center overflow-hidden p-10 sm:p-16">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgb(31_216_255/0.12),transparent_60%)]" aria-hidden />
              <BrandLogo variant="full" width={420} className="max-w-full" alt="DFXSIGNALL — Trade Smarter Together. Signals, Analysis, Education, Growth." />
            </div>
          </Reveal>
          <div>
            <SectionHeading eyebrow="Our mission" title={`${site.tagline}.`} />
            <Reveal delay={0.15}>
              <div className="t-body mt-6 space-y-5 text-[1.02rem]">
                <p>
                  Markets move fast and noise moves faster. DFXSIGNALL was created to cut through it: to turn market data into structured, explained
                  ideas that a trader can evaluate against their own plan.
                </p>
                <p>
                  The ecosystem is built on four pillars — <span className="text-[var(--color-fg-soft)]">{site.pillars.join(", ")}</span> — because
                  a signal on its own is not enough. Context, education and disciplined habits are what make information useful.
                </p>
                <p>The client platform is in development. This website introduces what we are building and the standards we hold ourselves to.</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section-y pt-0">
        <div className="container-x">
          <SectionHeading eyebrow="Principles" title="The standards behind every signal." />
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {principles.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08}>
                <SpotlightCard className="panel h-full p-7">
                  <p.icon className="text-[var(--color-cyan)]" size={22} />
                  <h3 className="t-h3 mt-6">{p.title}</h3>
                  <p className="t-body mt-2 text-sm">{p.text}</p>
                </SpotlightCard>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-6">
            <div className="panel grid gap-8 p-7 sm:p-10 md:grid-cols-[0.8fr_1.2fr]">
              <div>
                <Ban className="text-[var(--color-red)]" size={22} />
                <h3 className="t-h3 mt-5">What DFXSIGNALL will never do</h3>
                <p className="t-body mt-2 text-sm">A simple list you can hold us to.</p>
              </div>
              <ul className="grid gap-3 sm:grid-cols-2">
                {wont.map((w) => (
                  <li key={w} className="rounded-xl border border-[var(--line)] bg-white/[0.02] p-4 text-sm text-[var(--color-fg-soft)]">
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      <WhatIs />
      <FinalCTA />
    </>
  );
}
