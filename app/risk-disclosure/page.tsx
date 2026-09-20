import { LegalPage } from "@/components/layout/LegalPage";
import { LEGAL_UPDATED, riskDisclosure } from "@/content/legal";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Risk Disclosure",
  description: "Important information about trading risk, signals, demo data and the absence of guaranteed results at DFXSIGNALL.",
  path: "/risk-disclosure",
});

export default function RiskDisclosurePage() {
  return (
    <LegalPage
      eyebrow="Important information"
      title="Risk Disclosure"
      lead="Please read this before using any DFXSIGNALL content, signal or analysis."
      updated={LEGAL_UPDATED}
      sections={riskDisclosure}
    />
  );
}
