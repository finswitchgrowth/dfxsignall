import Link from "next/link";
import { ArrowLeft, BellRing } from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { ButtonLink } from "@/components/ui/Interactive";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/content/site";

type Props = { area: string; title: string; description: string };

/** Shared "Coming soon" screen for client, admin, auth and payment routes. */
export function ComingSoon({ area, title, description }: Props) {
  const mailto = `mailto:${site.contact.email}?subject=${encodeURIComponent(`Notify me when ${title} launches`)}`;
  return (
    <section className="relative isolate flex min-h-[100svh] items-center overflow-hidden py-32">
      <div className="grid-bg absolute inset-0 -z-10" aria-hidden />
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[44rem] w-[44rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(31_216_255/0.14),rgb(43_107_255/0.06)_55%,transparent)]" aria-hidden />
      <svg className="pointer-events-none absolute left-1/2 top-1/2 -z-10 w-[56rem] max-w-none -translate-x-1/2 -translate-y-1/2 opacity-40" viewBox="0 0 800 800" aria-hidden>
        {[160, 240, 320].map((r, i) => (
          <circle key={r} cx="400" cy="400" r={r} fill="none" stroke={i === 1 ? "#34f08c" : "#1fd8ff"} strokeOpacity={0.28 - i * 0.06} strokeDasharray={i === 1 ? "3 9" : undefined}>
            <animateTransform attributeName="transform" type="rotate" from={`0 400 400`} to={`${i % 2 ? -360 : 360} 400 400`} dur={`${60 + i * 30}s`} repeatCount="indefinite" />
          </circle>
        ))}
      </svg>

      <div className="container-x flex flex-col items-center text-center">
        <Reveal>
          <BrandLogo variant="lockup" width={230} priority />
        </Reveal>
        <Reveal delay={0.1}>
          <p className="chip mt-10 border-[var(--color-cyan)]/30 text-[var(--color-cyan)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-cyan)] shadow-[0_0_10px_var(--color-cyan)]" /> {area} · Coming soon
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <h1 className="t-display mt-6 text-[clamp(2.1rem,1.2rem+3vw,3.6rem)]">
            <span className="text-silver">{title}</span>
          </h1>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="t-lead mx-auto mt-5 max-w-xl">{description}</p>
        </Reveal>
        <Reveal delay={0.3} className="mt-10 flex flex-wrap justify-center gap-3">
          <ButtonLink href={mailto}>
            <BellRing size={16} /> Notify me at launch
          </ButtonLink>
          <ButtonLink href="/platform" variant="ghost">
            Explore the platform
          </ButtonLink>
        </Reveal>
        <Reveal delay={0.4}>
          <Link href="/" className="link-u mt-10 inline-flex items-center gap-2 text-sm text-[var(--color-muted)]">
            <ArrowLeft size={14} /> Back to home
          </Link>
          <p className="mx-auto mt-10 max-w-md text-xs leading-relaxed text-[var(--color-dim)]">
            DFXSIGNALL does not accept sign-ups, logins or payments on this website yet. Never share passwords or send money to anyone claiming
            to offer early access.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
