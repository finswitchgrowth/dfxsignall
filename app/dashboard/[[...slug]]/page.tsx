import type { Metadata } from "next";
import { ComingSoon } from "@/components/layout/ComingSoon";

const LABELS: Record<string, string> = {
  signals: "Signals", markets: "Markets", packages: "Packages", wallet: "Wallet", payments: "Payments", transactions: "Transactions",
  referrals: "Referrals", documents: "Documents", notifications: "Notifications", support: "Support", profile: "Profile", security: "Security",
};

export function generateStaticParams() {
  return [{ slug: [] }, ...Object.keys(LABELS).map((k) => ({ slug: [k] }))];
}

type Props = { params: Promise<{ slug?: string[] }> };

function label(slug?: string[]) {
  const key = slug?.[0];
  return key ? `Dashboard · ${LABELS[key] ?? "Workspace"}` : "Client dashboard";
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return { title: label(slug), robots: { index: false, follow: false } };
}

export default async function DashboardPage({ params }: Props) {
  const { slug } = await params;
  return (
    <ComingSoon
      area="Client platform"
      title={label(slug)}
      description="The DFXSIGNALL client dashboard — signals, markets, packages and account tools — is launching soon."
    />
  );
}
