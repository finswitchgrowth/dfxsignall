import type { Metadata } from "next";
import { site } from "@/content/site";

type SeoInput = {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
  type?: "website" | "article";
};

export function buildMetadata({ title, description, path, noindex, type = "website" }: SeoInput): Metadata {
  const url = new URL(path, site.url).toString();
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} · ${site.name}`,
      description,
      url,
      siteName: site.name,
      type,
      images: [{ url: "/brand/dfxsignall-logo.png", width: 1254, height: 1254, alt: "DFXSIGNALL logo" }],
    },
    twitter: {
      card: "summary",
      title: `${title} · ${site.name}`,
      description,
      images: ["/brand/dfxsignall-logo.png"],
    },
    robots: noindex ? { index: false, follow: false } : { index: true, follow: true },
  };
}
