import { LegalPage } from "@/components/layout/LegalPage";
import { LEGAL_UPDATED, terms } from "@/content/legal";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ title: "Terms & Conditions", description: "Terms governing use of the DFXSIGNALL website.", path: "/terms" });

export default function TermsPage() {
  return <LegalPage eyebrow="Legal" title="Terms & Conditions" lead="The rules for using the DFXSIGNALL website." updated={LEGAL_UPDATED} sections={terms} />;
}
