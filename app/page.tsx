import { FaqSection, faqJsonLd } from "@/components/sections/FaqSection";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Insights } from "@/components/sections/Insights";
import { MarketIntelligence } from "@/components/sections/MarketIntelligence";
import { Metrics } from "@/components/sections/Metrics";
import { Packages } from "@/components/sections/Packages";
import { PlatformPreview } from "@/components/sections/PlatformPreview";
import { Security } from "@/components/sections/Security";
import { SignalExperience } from "@/components/sections/SignalExperience";
import { TickerTape } from "@/components/sections/TickerTape";
import { TradingIntelligence } from "@/components/sections/TradingIntelligence";
import { WhatIs } from "@/components/sections/WhatIs";
import { faqs } from "@/content/faq";

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(faqs.slice(0, 6))) }} />
      <Hero />
      <TickerTape />
      <Metrics />
      <WhatIs />
      <TradingIntelligence />
      <SignalExperience />
      <MarketIntelligence />
      <PlatformPreview />
      <Packages />
      <HowItWorks />
      <Security />
      <FaqSection limit={6} />
      <Insights />
      <FinalCTA />
    </>
  );
}
