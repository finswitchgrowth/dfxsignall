import { PageHero } from "@/components/layout/PageHero";
import { TradingTools } from "@/components/trading/TradingTools";
import { RiskNote } from "@/components/ui/Primitives";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Trading Risk Calculator",
  description: "Plan a trade with a risk and reward calculator, stop-loss validation and estimated position sizing. No broker execution or live prices.",
  path: "/trading-tools",
});

export default function TradingToolsPage() {
  return (
    <>
      <PageHero eyebrow="Specialized trading feature" title="Know the risk before the entry." lead="Build a disciplined trade plan with position-size estimates, maximum planned loss and risk-to-reward analysis — before you place an order." />
      <section className="section-y pt-0">
        <div className="container-x">
          <TradingTools />
          <div className="mt-6"><RiskNote>Illustrative calculations only, not investment advice. Results depend on the contract multiplier and price units you enter. This tool does not connect to a broker, receive live market prices or execute trades.</RiskNote></div>
        </div>
      </section>
    </>
  );
}
