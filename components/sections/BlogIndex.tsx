"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { sortedPosts, type BlogPost } from "@/content/blog";
import { cn } from "@/lib/utils";
import { PostCard } from "./Insights";

export function BlogIndex() {
  const cats = ["All", ...Array.from(new Set(sortedPosts.map((p) => p.category)))] as ("All" | BlogPost["category"])[];
  const [cat, setCat] = useState<(typeof cats)[number]>("All");
  const list = sortedPosts.filter((p) => cat === "All" || p.category === cat);
  return (
    <section className="pb-24">
      <div className="container-x">
        <div className="scrollbar-none mb-10 flex gap-2 overflow-x-auto" role="group" aria-label="Filter by category">
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              aria-pressed={cat === c}
              className={cn("chip h-9 shrink-0 px-4 text-[0.68rem] transition-colors", cat === c ? "border-[var(--color-cyan)]/50 bg-[var(--color-cyan)]/10 text-[var(--color-cyan)]" : "hover:text-white")}
            >
              {c}
            </button>
          ))}
        </div>
        <motion.div layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {list.map((p) => (
              <motion.div key={p.slug} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}>
                <PostCard post={p} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
