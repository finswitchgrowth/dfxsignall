import { PageHero } from "@/components/layout/PageHero";
import { BlogIndex } from "@/components/sections/BlogIndex";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Insights",
  description: "DFXSIGNALL insights: practical education on trading signals, risk management, position sizing and market structure.",
  path: "/blog",
});

export default function BlogPage() {
  return (
    <>
      <PageHero eyebrow="Insights" title="Education for disciplined traders." lead="Practical articles on signals, risk and market structure — no hype, no promises." />
      <BlogIndex />
      <FinalCTA />
    </>
  );
}
