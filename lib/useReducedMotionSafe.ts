"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Hydration-safe reduced-motion flag: always `false` for the server render and the first
 * client render, then the real preference. (MotionConfig reducedMotion="user" additionally
 * disables transform animations for users who prefer reduced motion.)
 */
export function useReducedMotionSafe() {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? !!reduce : false;
}
