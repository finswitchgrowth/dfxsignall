"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useId, useState } from "react";
import type { FaqItem } from "@/content/faq";
import { cn } from "@/lib/utils";

export function Accordion({ items, defaultOpen = 0 }: { items: FaqItem[]; defaultOpen?: number | null }) {
  const [open, setOpen] = useState<number | null>(defaultOpen);
  const base = useId();
  return (
    <div className="divide-y divide-[var(--line)] border-y border-[var(--line)]">
      {items.map((it, i) => {
        const isOpen = open === i;
        const id = `${base}-${i}`;
        return (
          <div key={it.q} className="group">
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={id}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-6 py-6 text-left transition-colors hover:text-white"
              >
                <span className="flex items-baseline gap-5">
                  <span className="t-num hidden text-xs text-[var(--color-dim)] sm:inline">{String(i + 1).padStart(2, "0")}</span>
                  <span className={cn("text-[1.05rem] font-medium tracking-tight sm:text-lg", isOpen ? "text-white" : "text-[var(--color-fg-soft)]")}>
                    {it.q}
                  </span>
                </span>
                <span
                  className={cn(
                    "grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[var(--line-strong)] transition-all duration-500",
                    isOpen && "rotate-45 border-[var(--color-cyan)]/50 bg-[var(--color-cyan)]/10 text-[var(--color-cyan)]",
                  )}
                  aria-hidden
                >
                  <Plus size={16} />
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={id}
                  role="region"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <p className="t-body max-w-3xl pb-7 sm:pl-10">{it.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
