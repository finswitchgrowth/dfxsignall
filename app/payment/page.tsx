import { ComingSoon } from "@/components/layout/ComingSoon";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ title: "Payments", description: "Payments and package checkout will be available only inside the authenticated DFXSIGNALL client platform.", path: "/payment", noindex: true });

export default function Page() {
  return <ComingSoon area="Payments" title="Payments" description="Payments and package checkout will be available only inside the authenticated DFXSIGNALL client platform." />;
}
