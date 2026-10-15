import { EyeOff, FileLock2, Globe2, KeyRound, MailWarning, ShieldCheck } from "lucide-react";
import { LazySecurityCanvas } from "@/components/3d/LazyScenes";
import { SpotlightCard } from "@/components/ui/Interactive";
import { SectionHeading } from "@/components/ui/Primitives";
import { Reveal } from "@/components/ui/Reveal";

/** Describe current controls without implying an independent security certification. */
export const securityToday = [
  { icon: Globe2, title: "HTTPS delivery", text: "The public website is served over HTTPS. This protects data in transit, but does not by itself guarantee that every account or workflow is secure." },
  { icon: ShieldCheck, title: "Access controls", text: "Authenticated API routes check account sessions and role permissions. Access is still subject to ongoing testing and monitoring." },
  { icon: EyeOff, title: "No password sharing", text: "Never send your login password, trading password or one-time codes to support. Payment-proof review does not require your broker credentials." },
];

export const securityPrinciples = [
  { icon: KeyRound, title: "Protect account sessions", text: "Use a unique password and sign out on shared devices." },
  { icon: FileLock2, title: "Restricted administration", text: "Administrative features are intended for authorized roles and should be reviewed through audit records." },
  { icon: MailWarning, title: "Official channels only", text: "Submit payment proof only through the authenticated official website and keep your transaction reference." },
];

export function Security() {
  return (
    <section className="section-y relative overflow-hidden" aria-labelledby="security">
      <div className="container-x">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.05fr]">
          <div>
            <SectionHeading
              eyebrow="Security & account safety"
              title="Clear controls. Honest limits."
              lead="We describe the controls currently in use without claiming a security certification or promising that any online service is risk-free."
            />
            <div className="mt-10 grid gap-3">
              {securityToday.map((s, i) => (
                <Reveal key={s.title} delay={i * 0.08}>
                  <SpotlightCard className="panel flex gap-4 p-5">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[var(--color-green)]/10 text-[var(--color-green)]">
                      <s.icon size={18} />
                    </span>
                    <div>
                      <h3 className="text-[0.98rem] font-medium">{s.title}</h3>
                      <p className="t-body mt-1 text-sm">{s.text}</p>
                    </div>
                  </SpotlightCard>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal className="relative">
            <div className="relative aspect-square overflow-hidden rounded-[2rem] border border-[var(--line)] bg-[radial-gradient(circle_at_50%_50%,rgb(12_28_60/0.9),rgb(3_6_13)_70%)]">
              <LazySecurityCanvas />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,transparent_50%,rgb(3_6_13/0.8))]" aria-hidden />
              <div className="absolute bottom-5 left-5 right-5 flex flex-wrap gap-2">
                {securityPrinciples.map((p) => (
                  <span key={p.title} className="chip bg-[var(--color-ink-950)]/70 backdrop-blur">
                    <p.icon size={12} className="text-[var(--color-cyan)]" /> {p.title}
                  </span>
                ))}
              </div>
            </div>
            <p className="mt-3 text-center text-[0.7rem] text-[var(--color-dim)]">These are account-safety principles, not a third-party security certification.</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
