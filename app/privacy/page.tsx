import { LegalPage } from "@/components/layout/LegalPage";
import { LEGAL_UPDATED, privacy } from "@/content/legal";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ title: "Privacy Policy", description: "How the DFXSIGNALL website handles information.", path: "/privacy" });

export default function PrivacyPage() {
  return <LegalPage eyebrow="Legal" title="Privacy Policy" lead="What information this website handles, and how." updated={LEGAL_UPDATED} sections={privacy} />;
}
