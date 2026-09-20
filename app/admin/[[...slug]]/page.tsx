import type { Metadata } from "next";
import { ComingSoon } from "@/components/layout/ComingSoon";

export const metadata: Metadata = { title: "Administration", robots: { index: false, follow: false } };

export default function AdminPage() {
  return (
    <ComingSoon
      area="Administration"
      title="Admin console"
      description="The DFXSIGNALL administration console is not available on this website yet."
    />
  );
}
