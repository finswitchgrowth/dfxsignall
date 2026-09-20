"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { randomSpherePoints, sphereArc } from "./common";
import { DataNodes } from "./DataNodes";
import { FloatingCharts } from "./FloatingCharts";
import { MarketSphere } from "./MarketSphere";
import { ParticleField } from "./ParticleField";
import { useSceneEnv } from "./SceneCanvas";
import { SignalBeam } from "./SignalBeam";
import { TradingGrid } from "./TradingGrid";

const R = 2.35;

function OrbitRings() {
  const a = useRef<THREE.Mesh>(null);
  const b = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (a.current) a.current.rotation.z += dt * 0.08;
    if (b.current) b.current.rotation.z -= dt * 0.05;
  });
  return (
    <group rotation={[1.05, 0.35, -0.5]}>
      <mesh ref={a}>
        <torusGeometry args={[R * 1.28, 0.006, 8, 220, Math.PI * 1.35]} />
        <meshBasicMaterial color="#1fd8ff" transparent opacity={0.55} toneMapped={false} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh ref={b} rotation={[0.25, 0.1, 1.4]}>
        <torusGeometry args={[R * 1.46, 0.004, 8, 220, Math.PI * 0.9]} />
        <meshBasicMaterial color="#34f08c" transparent opacity={0.4} toneMapped={false} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh rotation={[0, 0, 0]}>
        <torusGeometry args={[R * 1.7, 0.002, 6, 260]} />
        <meshBasicMaterial color="#2b6bff" transparent opacity={0.22} depthWrite={false} />
      </mesh>
    </group>
  );
}

function Globe() {
  const spin = useRef<THREE.Group>(null);
  const { tier } = useSceneEnv();

  const nodes = useMemo(() => randomSpherePoints(tier === "low" ? 16 : 26, R * 1.01, 21), [tier]);
  const arcs = useMemo(() => {
    const pairs: [number, number][] = [];
    for (let i = 0; i < nodes.length; i++) {
      // connect each node to its nearest non-adjacent neighbour for elegant, short arcs
      let best = -1;
      let bestD = Infinity;
      for (let j = 0; j < nodes.length; j++) {
        if (i === j) continue;
        const d = nodes[i].distanceTo(nodes[j]);
        if (d > R * 0.55 && d < bestD) {
          bestD = d;
          best = j;
        }
      }
      if (best >= 0 && i % 2 === 0) pairs.push([i, best]);
    }
    return pairs.map(([i, j]) => sphereArc(nodes[i], nodes[j], R, 0.55));
  }, [nodes]);

  useFrame((_, dt) => {
    if (spin.current) spin.current.rotation.y += dt * 0.055;
  });

  return (
    <group rotation={[0.28, 0, 0.12]}>
      <group ref={spin}>
        <MarketSphere radius={R} />
        <DataNodes nodes={nodes} />
        {arcs.map((c, i) => (
          <SignalBeam key={i} curve={c} speed={0.22 + (i % 5) * 0.05} offset={(i * 0.37) % 1} color={i % 3 === 0 ? "#34f08c" : "#1fd8ff"} head="#eafff4" />
        ))}
      </group>
      <OrbitRings />
    </group>
  );
}

/** Camera rig: pointer parallax, device-orientation tilt and scroll-driven dolly. */
function Rig({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);
  const tilt = useRef({ x: 0, y: 0 });
  const { camera } = useThree();
  const { reduced } = useSceneEnv();

  useEffect(() => {
    const onOrient = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      tilt.current.x = THREE.MathUtils.clamp(e.gamma / 35, -1, 1);
      tilt.current.y = THREE.MathUtils.clamp((e.beta - 45) / 35, -1, 1);
    };
    window.addEventListener("deviceorientation", onOrient, { passive: true });
    return () => window.removeEventListener("deviceorientation", onOrient);
  }, []);

  useFrame((state, dt) => {
    if (reduced || !group.current) return;
    const px = state.pointer.x || tilt.current.x;
    const py = state.pointer.y || tilt.current.y;
    const k = 1 - Math.exp(-dt * 2.2);
    group.current.rotation.y += (px * 0.22 - group.current.rotation.y) * k;
    group.current.rotation.x += (-py * 0.12 - group.current.rotation.x) * k;
    const scroll = Math.min(window.scrollY / window.innerHeight, 1.5);
    camera.position.z += (9 + scroll * 3 - camera.position.z) * k;
    camera.position.y += (-scroll * 1.1 - camera.position.y) * k;
    camera.lookAt(0, -scroll * 0.6, 0);
  });

  return <group ref={group}>{children}</group>;
}

export default function HeroScene() {
  const { viewport } = useThree();
  const { tier } = useSceneEnv();
  const wide = viewport.width > 9.5;
  const globePos: [number, number, number] = wide ? [viewport.width * 0.235, -0.05, -0.6] : [0, 1.35, -1.2];
  const globeScale = wide ? 0.8 : Math.min(0.82, viewport.width / 7.2);

  return (
    <Rig>
      <group position={globePos} scale={globeScale}>
        <Globe />
      </group>
      {wide && tier === "high" && (
        <group position={[viewport.width * 0.36, -1.9, 1.2]} rotation={[-0.12, -0.5, 0.04]} scale={0.42}>
          <FloatingCharts />
        </group>
      )}
      <TradingGrid y={-3.4} />
      <ParticleField count={1500} />
    </Rig>
  );
}
