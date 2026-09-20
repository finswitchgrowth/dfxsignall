"use client";

import dynamic from "next/dynamic";
import { GridFallback, OrbFallback } from "./Fallbacks";

/** Heavy WebGL code is split out of the main bundle and never server-rendered. */
export const LazyHeroCanvas = dynamic(() => import("./Canvases").then((m) => m.HeroCanvas), {
  ssr: false,
  loading: () => (
    <>
      <GridFallback />
      <OrbFallback className="md:translate-x-[22%] opacity-60" />
    </>
  ),
});

export const LazySecurityCanvas = dynamic(() => import("./Canvases").then((m) => m.SecurityCanvas), {
  ssr: false,
  loading: () => <OrbFallback className="opacity-60" />,
});

export const LazyEcosystemCanvas = dynamic(() => import("./Canvases").then((m) => m.EcosystemCanvas), {
  ssr: false,
  loading: () => <OrbFallback className="opacity-60" />,
});
