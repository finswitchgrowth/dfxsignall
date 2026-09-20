import { EyeOff, FileLock2, Globe2, KeyRound, MailWarning, ShieldCheck } from "lucide-react";
import { LazySecurityCanvas } from "@/components/3d/LazyScenes";
import { SpotlightCard } from "@/components/ui/Interactive";
import { SectionHeading } from "@/components/ui/Primitives";
import { Reveal } from "@/components/ui/Reveal";

/** Only statements that are true of this website today, plus clearly-labelled platform principles. */
export const securityToday = [
  { icon: Globe2, title: "Encrypted in transit", text: "The website is served over HTTPS so pages travel encrypted between our servers and your browser." },
  { icon: ShieldCheck, title: "Hardened headers", text: "Security headers restrict framing, MIME sniffing, referrer leakage and access to camera, microphone and location." },
  { icon: EyeOff, title: "No accounts or payments here", text: "This website does not collect passwords, payment details or deposits — there is nothing to steal from a sign-in form." },
];

export const securityPrinciples = [
  { icon: KeyRound, title: "Strong authentication", text: "Hashed passwords, secure session cookies and optional two-factor authentication for the client platform." },
  { icon: FileLock2, title: "Least-privilege access", text: "Role-based permissions and audit logs for any administrative action." },
  { icon: MailWarning, title: "Official channels only", text: "Payment details will only ever appear inside your authenticated account — never in chats or DMs." },
];

export function Security() {
  return (
    <section className="section-y relative overflow-hidden" aria-labelledby="security">
      <div className="container-x">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.05fr]">
          <div>
            <SectionHeading
              eyebrow="Security"
              title="Security designed in, not bolted on."
              lead="We are careful about what we claim. Here is what protects this website today — and the principles the client platform is being built on."
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
            <p className="mt-3 text-center text-[0.7rem] text-[var(--color-dim)]">Platform principles apply to the client platform when it launches.</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
