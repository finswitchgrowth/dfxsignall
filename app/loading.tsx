import { BrandLogo } from "@/components/brand/BrandLogo";

export default function Loading() {
  return (
    <div className="grid min-h-[100svh] place-items-center" role="status" aria-live="polite">
      <div className="flex flex-col items-center gap-6">
        <BrandLogo variant="mark" width={88} priority />
        <div className="h-px w-40 overflow-hidden bg-white/10">
          <div className="h-full w-1/2 animate-shimmer bg-[linear-gradient(90deg,transparent,var(--color-cyan),var(--color-green),transparent)] bg-[length:200%_100%]" />
        </div>
        <span className="sr-only">Loading…</span>
      </div>
    </div>
  );
}
