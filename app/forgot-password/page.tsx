import { ComingSoon } from "@/components/layout/ComingSoon";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ title: "Password recovery", description: "Password recovery will be available with the DFXSIGNALL client platform.", path: "/forgot-password", noindex: true });

export default function Page() {
  return <ComingSoon area="Client platform" title="Password recovery" description="Password recovery will be available with the DFXSIGNALL client platform." />;
}
