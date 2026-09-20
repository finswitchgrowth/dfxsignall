import { ComingSoon } from "@/components/layout/ComingSoon";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ title: "Create your account", description: "Account registration opens when the DFXSIGNALL client platform launches.", path: "/register", noindex: true });

export default function Page() {
  return <ComingSoon area="Client platform" title="Create your account" description="Account registration opens when the DFXSIGNALL client platform launches." />;
}
