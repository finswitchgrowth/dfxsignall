"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { BadgeCheck, CreditCard, KeyRound, LayoutGrid, Radar, SearchCheck, UserPlus, Zap } from "lucide-react";
import { useRef } from "react";
import { ComingSoonBadge, SectionHeading } from "@/components/ui/Primitives";
import { Reveal } from "@/components/ui/Reveal";

export const journey = [
  { icon: UserPlus, title: "Create account", text: "Register with your email and set a strong password." },
  { icon: BadgeCheck, title: "Verify", text: "Confirm your email and complete any verification required for your region." },
  { icon: LayoutGrid, title: "Choose package", text: "Compare packages and pick the level of signals and tools you need." },
  { icon: CreditCard, title: "Payment", text: "Pay through official checkout inside your authenticated account only." },
  { icon: SearchCheck, title: "Review", text: "Your subscription is confirmed and checked before access is granted." },
  { icon: Zap, title: "Activation", text: "Your package is activated and linked to your account." },
  { icon: KeyRound, title: "Platform access", text: "Sign in to the dashboard, set alerts and personalise your watchlist." },
  { icon: Radar, title: "Signals & intelligence", text: "Receive signals, market context and education — and decide with discipline." },
];

export function HowItWorks({ showHeading = true }: { showHeading?: boolean }) {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });

  return (
    <section className="section-y relative" aria-labelledby="how">
      <div className="container-x">
        {showHeading && (
          <SectionHeading
            eyebrow="How it works"
            title="Your path into the DFXSIGNALL ecosystem."
            lead="The planned client journey, from sign-up to your first signal."
            aside={<ComingSoonBadge />}
          />
        )}

        <ol ref={ref} className="relative mx-auto mt-16 max-w-4xl">
          <div className="absolute bottom-0 left-6 top-0 w-px bg-[var(--line-strong)] md:left-1/2" aria-hidden />
          <motion.div
            style={{ scaleY }}
            className="absolute bottom-0 left-6 top-0 w-px origin-top bg-gradient-to-b from-[var(--color-blue)] via-[var(--color-cyan)] to-[var(--color-green)] md:left-1/2"
            aria-hidden
          />
          {journey.map((s, i) => {
            const right = i % 2 === 1;
            return (
              <li key={s.title} className="relative grid grid-cols-[48px_1fr] gap-6 pb-10 last:pb-0 md:grid-cols-[1fr_48px_1fr] md:gap-10">
                <div className={right ? "hidden md:block" : "hidden md:block md:text-right"}>
                  {!right && (
                    <Reveal y={16}>
                      <StepText i={i} s={s} align="right" />
                    </Reveal>
                  )}
                </div>
                <div className="relative z-10 flex justify-center">
                  <Reveal y={0}>
                    <span className="grid h-12 w-12 place-items-center rounded-2xl border border-[var(--color-cyan)]/30 bg-[var(--color-ink-800)] text-[var(--color-cyan)] shadow-[0_0_40px_-12px_var(--color-cyan)]">
                      <s.icon size={19} />
                    </span>
                  </Reveal>
                </div>
                <div>
                  <Reveal y={16} className={right ? "" : "md:hidden"}>
                    <StepText i={i} s={s} align="left" />
                  </Reveal>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

function StepText({ i, s, align }: { i: number; s: (typeof journey)[number]; align: "left" | "right" }) {
  return (
    <div className={align === "right" ? "md:pt-1" : "pt-1"}>
      <p className="t-num text-xs text-[var(--color-dim)]">STEP {String(i + 1).padStart(2, "0")}</p>
      <h3 className="t-h3 mt-1">{s.title}</h3>
      <p className="t-body mt-1.5 text-sm">{s.text}</p>
    </div>
  );
}
