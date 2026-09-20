"use client";

import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import { animate, useInView} from "framer-motion";
import { useEffect, useRef, useState } from "react";

export function Counter({ to, duration = 1.8, decimals = 0, className }: { to: number; duration?: number; decimals?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotionSafe();
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setVal(to);
      return;
    }
    const c = animate(0, to, { duration, ease: [0.16, 1, 0.3, 1], onUpdate: setVal });
    return () => c.stop();
  }, [inView, to, duration, reduce]);

  return (
    <span ref={ref} className={className}>
      {val.toFixed(decimals)}
    </span>
  );
}
