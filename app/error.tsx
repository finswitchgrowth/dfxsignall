"use client";

import Link from "next/link";
import { RotateCcw } from "lucide-react";
import { useEffect } from "react";
import { BrandLogo } from "@/components/brand/BrandLogo";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <section className="relative grid min-h-[100svh] place-items-center px-6 py-32 text-center">
      <div className="grid-bg absolute inset-0 -z-10" aria-hidden />
      <div className="flex max-w-lg flex-col items-center">
        <BrandLogo variant="mark" width={96} />
        <p className="t-eyebrow mt-8 text-[var(--color-amber)]">Something went wrong</p>
        <h1 className="t-h2 mt-4">This section failed to load.</h1>
        <p className="t-body mt-4">Please try again. If the problem continues, return to the homepage.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button onClick={reset} className="btn btn-primary">
            <RotateCcw size={15} /> Try again
          </button>
          <Link href="/" className="btn btn-ghost">
            Back to home
          </Link>
        </div>
      </div>
    </section>
  );
}
