import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { BlogCover, PostCard } from "@/components/sections/Insights";
import { RiskNote } from "@/components/ui/Primitives";
import { Reveal, RevealWords } from "@/components/ui/Reveal";
import { getPost, posts, sortedPosts } from "@/content/blog";
import { site } from "@/content/site";
import { buildMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

export const dynamicParams = false;

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return buildMetadata({ title: post.title, description: post.excerpt, path: `/blog/${post.slug}`, type: "article" });
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  const related = sortedPosts.filter((p) => p.slug !== post.slug).slice(0, 3);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: { "@type": "Organization", name: site.name },
    publisher: { "@type": "Organization", name: site.name, logo: { "@type": "ImageObject", url: `${site.url}/brand/dfxsignall-logo.png` } },
    mainEntityOfPage: `${site.url}/blog/${post.slug}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article className="pb-20 pt-32 sm:pt-40">
        <div className="container-x max-w-4xl">
          <Reveal>
            <Link href="/blog" className="link-u inline-flex items-center gap-2 text-sm text-[var(--color-muted)]">
              <ArrowLeft size={14} /> All insights
            </Link>
            <div className="mt-8 flex flex-wrap items-center gap-3 text-xs text-[var(--color-dim)]">
              <span className="chip h-6 text-[0.58rem] text-[var(--color-cyan)]">{post.category}</span>
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <span>· {post.readMinutes} min read</span>
            </div>
          </Reveal>
          <h1 className="t-display mt-6 text-[clamp(2rem,1.2rem+2.8vw,3.4rem)]">
            <RevealWords text={post.title} className="text-silver" />
          </h1>
          <Reveal delay={0.15}>
            <p className="t-lead mt-6">{post.excerpt}</p>
          </Reveal>
        </div>
        <Reveal className="container-x mt-12 max-w-5xl" delay={0.2}>
          <BlogCover post={post} className="panel aspect-[21/9] rounded-[var(--radius-card)]" />
        </Reveal>
        <div className="prose-article container-x mt-14 max-w-3xl">
          {post.body.map((b, i) =>
            b.type === "p" ? (
              <p key={i}>{b.text}</p>
            ) : b.type === "h2" ? (
              <h2 key={i}>{b.text}</h2>
            ) : (
              <ul key={i}>
                {b.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            ),
          )}
          <div className="mt-14 rounded-2xl border border-[var(--line)] bg-white/[0.02] p-5">
            <RiskNote />
          </div>
        </div>
      </article>
      <section className="pb-24">
        <div className="container-x">
          <p className="t-eyebrow mb-8">Keep reading</p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
