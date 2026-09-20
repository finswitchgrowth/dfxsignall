"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article" | "span" | "p" | "h2" | "h1";
  amount?: number;
} & Omit<HTMLMotionProps<"div">, "children">;

export function Reveal({ children, delay = 0, y = 28, className, as = "div", amount = 0.25, ...rest }: Props) {
  const Comp = motion[as] as typeof motion.div;
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      {...rest}
    >
      {children}
    </Comp>
  );
}

/** Staggered word reveal for headings */
export function RevealWords({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  const words = text.split(" ");
  const child = {
    hidden: { y: "105%" },
    show: (i: number) => ({
      y: "0%",
      transition: { duration: 0.95, delay: delay + i * 0.06, ease: [0.16, 1, 0.3, 1] as const },
    }),
  };
  // The observer sits on the (unclipped) wrapper; children are clipped while hidden.
  return (
    <motion.span className={className} aria-label={text} role="text" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom" aria-hidden>
          <motion.span className="inline-block" variants={child} custom={i}>
            {w}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
