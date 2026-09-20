import { Counter } from "@/components/ui/Counter";
import { Reveal } from "@/components/ui/Reveal";
import { metrics, metricsAreSample } from "@/content/site";

export function Metrics() {
  return (
    <section id="intelligence" className="relative py-20 sm:py-28" aria-labelledby="metrics-title">
      <div className="container-x">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <Reveal>
            <p className="t-eyebrow mb-3">Live intelligence layer</p>
            <h2 id="metrics-title" className="t-h3 max-w-md text-[var(--color-fg-soft)]">
              Coverage designed around the markets traders actually watch.
            </h2>
          </Reveal>
          {metricsAreSample && (
            <Reveal delay={0.1}>
              <p className="max-w-xs text-xs text-[var(--color-dim)]">
                Coverage figures reflect the current configuration. Operating results are published only once measured.
              </p>
            </Reveal>
          )}
        </div>
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-card)] border border-[var(--line)] bg-[var(--line)] md:grid-cols-5">
          {metrics.map((m, i) => (
            <Reveal key={m.label} delay={i * 0.07} className={i === metrics.length - 1 ? "col-span-2 md:col-span-1" : ""}>
              <div className="group relative h-full bg-[var(--color-ink-900)] p-5 transition-colors duration-500 hover:bg-[var(--color-ink-850)] sm:p-7">
                <div className="absolute inset-x-0 top-0 h-px scale-x-0 bg-gradient-to-r from-[var(--color-cyan)] to-[var(--color-green)] transition-transform duration-700 group-hover:scale-x-100" aria-hidden />
                <p className="text-xs text-[var(--color-muted)]">{m.label}</p>
                <p className="t-num mt-4 text-4xl text-white sm:text-5xl">
                  {m.value == null ? (
                    <span className="text-2xl text-[var(--color-fg-soft)] sm:text-3xl">At launch</span>
                  ) : (
                    <>
                      {m.prefix}
                      <Counter to={m.value} />
                      {m.suffix}
                    </>
                  )}
                </p>
                <p className="mt-3 text-[0.7rem] leading-relaxed text-[var(--color-dim)]">{m.note}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
