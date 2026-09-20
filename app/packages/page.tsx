import { PageHero } from "@/components/layout/PageHero";
import { FaqSection } from "@/components/sections/FaqSection";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Packages } from "@/components/sections/Packages";
import { ButtonLink } from "@/components/ui/Interactive";
import { ComingSoonBadge } from "@/components/ui/Primitives";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Packages",
  description: "DFX START, DFX PRO and DFX ELITE — DFXSIGNALL signal packages for different goals. Subscriptions open at launch.",
  path: "/packages",
});

export default function PackagesPage() {
  return (
    <>
      <PageHero
        eyebrow="Packages"
        title="Choose the depth of intelligence you need."
        lead="Three packages, from a disciplined introduction to advanced commentary and risk tooling. Every package is editable and will open for subscription when the platform launches."
      >
        <div className="flex flex-wrap items-center gap-3">
          <ComingSoonBadge />
          <ButtonLink href="/pricing" variant="ghost" size="sm">
            Compare pricing
          </ButtonLink>
        </div>
      </PageHero>
      <Packages showHeading={false} />
      <FaqSection limit={5} />
      <FinalCTA />
    </>
  );
}
