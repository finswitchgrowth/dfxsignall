import { ComingSoon } from "@/components/layout/ComingSoon";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ title: "Client login", description: "Secure sign-in to the DFXSIGNALL client platform is launching soon.", path: "/login", noindex: true });

export default function Page() {
  return <ComingSoon area="Client platform" title="Client login" description="Secure sign-in to the DFXSIGNALL client platform is launching soon." />;
}
