"use client";

import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, type ComponentProps, type MouseEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ── Spotlight card: illuminated border follows the cursor ───────────── */
export function SpotlightCard({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "article" | "li";
}) {
  const ref = useRef<HTMLElement>(null);
  const onMove = (e: MouseEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  const Comp = as as "div";
  return (
    <Comp ref={ref as React.Ref<HTMLDivElement>} onMouseMove={onMove} className={cn("spotlight", className)}>
      {children}
    </Comp>
  );
}

/* ── Tilt card: subtle 3D tilt with depth ─────────────────────────────── */
export function TiltCard({
  children,
  className,
  max = 7,
  glare = true,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
  glare?: boolean;
}) {
  const reduce = useReducedMotionSafe();
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 160, damping: 18, mass: 0.4 });
  const sy = useSpring(py, { stiffness: 160, damping: 18, mass: 0.4 });
  const rotateY = useTransform(sx, [0, 1], [-max, max]);
  const rotateX = useTransform(sy, [0, 1], [max, -max]);
  const glareBg = useTransform(
    [sx, sy] as never,
    ([x, y]: number[]) => `radial-gradient(600px circle at ${x * 100}% ${y * 100}%, rgb(255 255 255 / 0.07), transparent 45%)`,
  );

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  const onLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <div style={{ perspective: 1100 }} className="h-full">
      <motion.div
        ref={ref}
        onMouseMove={reduce ? undefined : onMove}
        onMouseLeave={onLeave}
        style={reduce ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" }}
        whileHover={reduce ? undefined : { y: -6 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className={cn("spotlight relative h-full", className)}
      >
        {children}
        {glare && !reduce && (
          <motion.div aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit]" style={{ background: glareBg }} />
        )}
      </motion.div>
    </div>
  );
}

/* ── Magnetic button / link ───────────────────────────────────────────── */
type BtnProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
  size?: "md" | "sm";
  className?: string;
  magnetic?: boolean;
  full?: boolean;
} & Omit<ComponentProps<typeof Link>, "href" | "children" | "className">;

export function ButtonLink({ href, children, variant = "primary", size = "md", className, magnetic = true, full, ...rest }: BtnProps) {
  const reduce = useReducedMotionSafe();
  const ref = useRef<HTMLSpanElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 15, mass: 0.3 });
  const sy = useSpring(y, { stiffness: 220, damping: 15, mass: 0.3 });

  const onMove = (e: MouseEvent<HTMLSpanElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.22);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.3);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };
  const active = magnetic && !reduce;
  const external = href.startsWith("http") || href.startsWith("mailto:");

  const cls = cn("btn", variant === "primary" ? "btn-primary" : "btn-ghost", size === "sm" && "btn-sm", full && "w-full", className);

  return (
    <motion.span
      ref={ref}
      className={full ? "flex w-full" : "inline-flex"}
      style={active ? { x: sx, y: sy } : undefined}
      onMouseMove={active ? onMove : undefined}
      onMouseLeave={active ? reset : undefined}
    >
      {external ? (
        <a href={href} className={cls}>
          {children}
        </a>
      ) : (
        <Link href={href} className={cls} {...rest}>
          {children}
        </Link>
      )}
    </motion.span>
  );
}
