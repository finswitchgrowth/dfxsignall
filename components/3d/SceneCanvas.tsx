"use client";

import { Canvas } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { Component, createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type Tier = "high" | "low";
type SceneEnv = { tier: Tier; reduced: boolean; mobile: boolean };

const SceneEnvContext = createContext<SceneEnv>({ tier: "high", reduced: false, mobile: false });
export const useSceneEnv = () => useContext(SceneEnvContext);

let webglSupport: boolean | null = null;
function hasWebGL() {
  if (webglSupport !== null) return webglSupport;
  try {
    const c = document.createElement("canvas");
    webglSupport = !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    webglSupport = false;
  }
  return webglSupport;
}

function detectEnv(): SceneEnv {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mobile = window.matchMedia("(max-width: 767px)").matches;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  const cores = nav.hardwareConcurrency ?? 8;
  const mem = nav.deviceMemory ?? 8;
  const saveData = !!nav.connection?.saveData;
  const low = saveData || cores <= 4 || mem <= 4 || (mobile && coarse);
  return { tier: low ? "low" : "high", reduced, mobile };
}

class CanvasBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(err: unknown) {
    console.warn("[DFXSIGNALL] 3D scene disabled:", err);
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

type Props = {
  children: ReactNode;
  fallback: ReactNode;
  className?: string;
  camera?: { position: [number, number, number]; fov: number };
  /** Mount immediately (hero) instead of waiting for the viewport */
  eager?: boolean;
  label?: string;
};

/**
 * Resilient WebGL host:
 * - lazy-mounts near the viewport and pauses rendering off-screen
 * - falls back to a static visual without WebGL, on errors, or on context loss
 * - renders a single still frame for reduced-motion users
 * - lowers DPR and scene density on low-power devices
 */
export function SceneCanvas({ children, fallback, className, camera = { position: [0, 0, 9], fov: 40 }, eager, label }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [env, setEnv] = useState<SceneEnv | null>(null);
  const [supported, setSupported] = useState<boolean | null>(null);
  const [near, setNear] = useState(!!eager);
  const [visible, setVisible] = useState(true);
  const [dpr, setDpr] = useState(1.5);
  const [lost, setLost] = useState(false);

  useEffect(() => {
    const e = detectEnv();
    setEnv(e);
    setSupported(hasWebGL());
    setDpr(e.tier === "high" ? Math.min(window.devicePixelRatio, 1.75) : 1);
  }, []);

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
        if (entry.isIntersecting) setNear(true);
      },
      { rootMargin: "250px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const showCanvas = env && supported && near && !lost;

  return (
    <div ref={hostRef} className={cn("relative h-full w-full", className)} aria-hidden={label ? undefined : true} role={label ? "img" : undefined} aria-label={label}>
      {!showCanvas && <div className="absolute inset-0">{fallback}</div>}
      {showCanvas && (
        <CanvasBoundary fallback={<div className="absolute inset-0">{fallback}</div>}>
          <SceneEnvContext.Provider value={env}>
            <Canvas
              className="!absolute inset-0"
              dpr={dpr}
              camera={{ position: camera.position, fov: camera.fov, near: 0.1, far: 100 }}
              frameloop={env.reduced ? "demand" : visible ? "always" : "never"}
              gl={{ antialias: env.tier === "high", alpha: true, powerPreference: "high-performance", stencil: false, depth: true }}
              onCreated={({ gl }) => {
                gl.setClearColor(0x000000, 0);
                gl.domElement.addEventListener("webglcontextlost", (ev) => {
                  ev.preventDefault();
                  setLost(true);
                });
              }}
            >
              <PerformanceMonitor onDecline={() => setDpr(1)} flipflops={2}>
                {children}
              </PerformanceMonitor>
            </Canvas>
          </SceneEnvContext.Provider>
        </CanvasBoundary>
      )}
    </div>
  );
}
