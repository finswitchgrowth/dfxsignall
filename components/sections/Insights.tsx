import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/Interactive";
import { SectionHeading } from "@/components/ui/Primitives";
import { Reveal } from "@/components/ui/Reveal";
import { sortedPosts, type BlogPost } from "@/content/blog";
import { formatDate } from "@/lib/utils";

/** Procedural editorial cover art (no stock imagery). Uses post.image when a real asset is supplied. */
export function BlogCover({ post, className = "" }: { post: BlogPost; className?: string }) {
  if (post.image) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <Image src={post.image} alt="" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
      </div>
    );
  }
  const art = {
    signal: (
      <>
        <path d="M0 150 C 60 140, 90 90, 150 100 S 240 150, 300 80 S 380 30, 400 40" fill="none" stroke="#1fd8ff" strokeWidth="2" />
        <line x1="0" x2="400" y1="100" y2="100" stroke="#34f08c" strokeDasharray="4 6" opacity=".6" />
        <line x1="0" x2="400" y1="150" y2="150" stroke="#ff5470" strokeDasharray="4 6" opacity=".5" />
        <line x1="0" x2="400" y1="48" y2="48" stroke="#34f08c" strokeDasharray="4 6" opacity=".8" />
        <circle cx="150" cy="100" r="6" fill="#34f08c" />
        <circle cx="150" cy="100" r="16" fill="none" stroke="#34f08c" opacity=".4" />
      </>
    ),
    risk: (
      <>
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <rect key={i} x={40 + i * 48} y={170 - (i + 1) * 18} width="30" height={(i + 1) * 18} rx="4" fill={i === 3 ? "#34f08c" : "#2b6bff"} opacity={i === 3 ? 0.9 : 0.25 + i * 0.05} />
        ))}
        <line x1="20" x2="380" y1="98" y2="98" stroke="#1fd8ff" strokeDasharray="3 5" />
      </>
    ),
    structure: (
      <>
        <path d="M10 170 L70 110 L110 135 L180 70 L220 100 L300 40 L340 70 L390 30" fill="none" stroke="#1fd8ff" strokeWidth="2.5" strokeLinejoin="round" />
        {[
          [70, 110],
          [180, 70],
          [300, 40],
        ].map(([x, y]) => (
          <circle key={x} cx={x} cy={y} r="5" fill="#34f08c" />
        ))}
        {[
          [110, 135],
          [220, 100],
          [340, 70],
        ].map(([x, y]) => (
          <circle key={x} cx={x} cy={y} r="5" fill="#2b6bff" />
        ))}
      </>
    ),
    evaluate: (
      <>
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <rect x="60" y={30 + i * 38} width="280" height="26" rx="8" fill="rgb(150 180 255 / .06)" stroke="rgb(150 180 255 / .15)" />
            <circle cx="80" cy={43 + i * 38} r="6" fill={i === 3 ? "#ff5470" : "#34f08c"} opacity=".9" />
            <rect x="100" y={40 + i * 38} width={160 - i * 25} height="6" rx="3" fill="#c3cbd9" opacity=".3" />
          </g>
        ))}
      </>
    ),
  }[post.cover];
  return (
    <div className={`relative overflow-hidden bg-[radial-gradient(ellipse_at_30%_20%,rgb(43_107_255/0.28),transparent_60%),radial-gradient(ellipse_at_80%_90%,rgb(52_240_140/0.12),transparent_55%)] ${className}`} aria-hidden>
      <div className="grid-bg absolute inset-0 opacity-60" />
      <svg viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-[1.06]">
        {art}
      </svg>
    </div>
  );
}

export function PostCard({ post, large = false }: { post: BlogPost; large?: boolean }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group spotlight panel flex h-full flex-col overflow-hidden transition-transform duration-500 hover:-translate-y-1">
      <BlogCover post={post} className={large ? "aspect-[16/9]" : "aspect-[16/10]"} />
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-3 text-xs text-[var(--color-dim)]">
          <span className="chip h-6 text-[0.58rem] text-[var(--color-cyan)]">{post.category}</span>
          <span>{formatDate(post.date)}</span>
          <span>· {post.readMinutes} min</span>
        </div>
        <h3 className={large ? "t-h3 mt-4 text-2xl" : "t-h3 mt-4"}>{post.title}</h3>
        <p className="t-body mt-2 line-clamp-3 text-sm">{post.excerpt}</p>
        <span className="mt-auto flex items-center gap-1.5 pt-6 text-sm text-[var(--color-fg-soft)] transition-colors group-hover:text-white">
          Read article <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}

export function Insights() {
  const [first, ...rest] = sortedPosts;
  return (
    <section className="section-y relative" aria-labelledby="insights">
      <div className="container-x">
        <SectionHeading
          eyebrow="Insights"
          title="Learn the craft behind every signal."
          lead="Education on risk, structure and evaluating trade ideas."
          aside={
            <ButtonLink href="/blog" variant="ghost" size="sm">
              All insights
            </ButtonLink>
          }
        />
        <div className="mt-14 grid gap-5 lg:grid-cols-[1.25fr_1fr]">
          <Reveal>
            <PostCard post={first} large />
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
            {rest.slice(0, 2).map((p, i) => (
              <Reveal key={p.slug} delay={0.1 * (i + 1)}>
                <Link href={`/blog/${p.slug}`} className="group spotlight panel grid h-full grid-cols-1 overflow-hidden sm:grid-cols-1 lg:grid-cols-[180px_1fr]">
                  <BlogCover post={p} className="aspect-[16/9] lg:aspect-auto" />
                  <div className="p-5">
                    <p className="text-xs text-[var(--color-dim)]">
                      {p.category} · {p.readMinutes} min
                    </p>
                    <h3 className="mt-2 text-base font-medium leading-snug">{p.title}</h3>
                    <p className="t-body mt-2 line-clamp-2 text-sm">{p.excerpt}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
