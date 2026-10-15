import { ArrowUpRight } from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { ButtonLink } from "@/components/ui/Interactive";
import { Reveal, RevealWords } from "@/components/ui/Reveal";

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden py-28 sm:py-40" aria-labelledby="final-cta">
      <div className="grid-bg absolute inset-0 opacity-70" aria-hidden />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[46rem] w-[46rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(31_216_255/0.16),rgb(43_107_255/0.08)_50%,transparent)]" aria-hidden />
      <svg className="pointer-events-none absolute left-1/2 top-1/2 w-[70rem] max-w-none -translate-x-1/2 -translate-y-1/2 opacity-40" viewBox="0 0 1000 1000" aria-hidden>
        {[180, 260, 340, 420].map((r, i) => (
          <circle key={r} cx="500" cy="500" r={r} fill="none" stroke={i % 2 ? "#2b6bff" : "#1fd8ff"} strokeOpacity={0.35 - i * 0.07} strokeDasharray={i % 2 ? "2 10" : "none"} />
        ))}
      </svg>
      <div className="container-x relative flex flex-col items-center text-center">
        <Reveal>
          <BrandLogo variant="mark" width={116} />
        </Reveal>
        <h2 id="final-cta" className="t-display mt-8 max-w-4xl">
          <RevealWords text="Start with a clear account-management plan." className="text-silver" />
        </h2>
        <Reveal delay={0.2}>
          <p className="t-lead mx-auto mt-6 max-w-xl">Tell us about your broker platform and the support you need. We review each enquiry before agreeing scope. No profit guarantees, no broker passwords and no automatic trade execution.</p>
        </Reveal>
        <Reveal delay={0.3} className="mt-10 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/account-management">
            Request Account Management <ArrowUpRight size={16} />
          </ButtonLink>
          <ButtonLink href="/contact" variant="ghost">
            Ask a Question
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}
