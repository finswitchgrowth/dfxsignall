"use client";

import EcosystemNetwork from "./EcosystemNetwork";
import { GridFallback, OrbFallback } from "./Fallbacks";
import HeroScene from "./HeroScene";
import { SceneCanvas } from "./SceneCanvas";
import SecurityCore from "./SecurityCore";

export function HeroCanvas() {
  return (
    <SceneCanvas eager fallback={<><GridFallback /><OrbFallback className="md:translate-x-[22%]" /></>} camera={{ position: [0, 0, 9], fov: 40 }}>
      <HeroScene />
    </SceneCanvas>
  );
}

export function SecurityCanvas() {
  return (
    <SceneCanvas fallback={<OrbFallback />} camera={{ position: [0, 0, 8.5], fov: 42 }}>
      <SecurityCore />
    </SceneCanvas>
  );
}

export function EcosystemCanvas() {
  return (
    <SceneCanvas fallback={<OrbFallback />} camera={{ position: [0, 0, 9.5], fov: 42 }}>
      <EcosystemNetwork />
    </SceneCanvas>
  );
}
