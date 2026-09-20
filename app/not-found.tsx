import Link from "next/link";
import { BrandLogo } from "@/components/brand/BrandLogo";

export default function NotFound() {
  return (
    <section className="relative grid min-h-[100svh] place-items-center overflow-hidden px-6 py-32 text-center">
      <div className="grid-bg absolute inset-0 -z-10" aria-hidden />
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(43_107_255/0.16),transparent)]" aria-hidden />
      <div className="flex max-w-lg flex-col items-center">
        <BrandLogo variant="mark" width={96} />
        <p className="t-num mt-8 text-7xl text-silver">404</p>
        <h1 className="t-h2 mt-4">Signal lost.</h1>
        <p className="t-body mt-4">The page you’re looking for doesn’t exist or has moved.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-primary">Back to home</Link>
          <Link href="/contact" className="btn btn-ghost">Contact us</Link>
        </div>
      </div>
    </section>
  );
}
