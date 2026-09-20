"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { mulberry32 } from "@/lib/utils";
import { DataNodes } from "./DataNodes";
import { useSceneEnv } from "./SceneCanvas";
import { SignalBeam } from "./SignalBeam";

/**
 * The DFXSIGNALL ecosystem as a living network: a central core, four pillar hubs
 * (Signals · Analysis · Education · Growth) and a halo of market nodes.
 */
export default function EcosystemNetwork() {
  const root = useRef<THREE.Group>(null);
  const { tier, reduced } = useSceneEnv();

  const { hubs, satellites, hubCurves, satCurves, links } = useMemo(() => {
    const rand = mulberry32(42);
    const hubs = [
      new THREE.Vector3(-2.3, 1.25, 0.4),
      new THREE.Vector3(2.4, 1.1, -0.3),
      new THREE.Vector3(-2.1, -1.35, -0.2),
      new THREE.Vector3(2.2, -1.3, 0.5),
    ];
    const satCount = tier === "low" ? 28 : 54;
    const satellites: THREE.Vector3[] = [];
    for (let i = 0; i < satCount; i++) {
      const th = rand() * Math.PI * 2;
      const ph = Math.acos(rand() * 2 - 1);
      const r = 2.6 + rand() * 1.6;
      satellites.push(new THREE.Vector3(Math.sin(ph) * Math.cos(th) * r * 1.35, Math.cos(ph) * r * 0.62, Math.sin(ph) * Math.sin(th) * r * 0.6));
    }
    const origin = new THREE.Vector3(0, 0, 0);
    const bend = (a: THREE.Vector3, b: THREE.Vector3, k: number) => {
      const mid = a.clone().lerp(b, 0.5);
      mid.z += k;
      mid.y += k * 0.4;
      return new THREE.QuadraticBezierCurve3(a, mid, b);
    };
    const hubCurves = hubs.map((h, i) => bend(origin, h, i % 2 ? 0.8 : -0.8));
    const satCurves = satellites
      .filter((_, i) => i % 3 === 0)
      .map((s) => {
        let best = hubs[0];
        hubs.forEach((h) => {
          if (h.distanceTo(s) < best.distanceTo(s)) best = h;
        });
        return bend(best, s, 0.3);
      });
    // faint static mesh of nearest-neighbour links
    const verts: number[] = [];
    const all = [...hubs, ...satellites];
    all.forEach((a, i) => {
      all
        .map((b, j) => ({ j, d: a.distanceTo(b) }))
        .filter((x) => x.j !== i)
        .sort((x, y) => x.d - y.d)
        .slice(0, 2)
        .forEach(({ j }) => verts.push(a.x, a.y, a.z, all[j].x, all[j].y, all[j].z));
    });
    const links = new THREE.BufferGeometry();
    links.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
    return { hubs, satellites, hubCurves, satCurves, links };
  }, [tier]);

  const coreRef = useRef<THREE.Mesh>(null);
  useFrame((state, dt) => {
    if (reduced) return;
    const t = state.clock.elapsedTime;
    if (root.current) {
      root.current.rotation.y += (Math.sin(t * 0.15) * 0.35 + state.pointer.x * 0.25 - root.current.rotation.y) * Math.min(1, dt * 1.5);
      root.current.rotation.x += (-state.pointer.y * 0.15 - root.current.rotation.x) * Math.min(1, dt * 1.5);
    }
    if (coreRef.current) {
      coreRef.current.rotation.y += dt * 0.5;
      coreRef.current.rotation.x += dt * 0.2;
      const s = 1 + Math.sin(t * 2) * 0.04;
      coreRef.current.scale.setScalar(s);
    }
  });

  return (
    <group ref={root}>
      <lineSegments geometry={links}>
        <lineBasicMaterial color="#3a78ff" transparent opacity={0.16} blending={THREE.AdditiveBlending} depthWrite={false} />
      </lineSegments>

      <mesh ref={coreRef}>
        <octahedronGeometry args={[0.55, 0]} />
        <meshBasicMaterial color="#1fd8ff" wireframe toneMapped={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.28, 32, 32]} />
        <meshBasicMaterial color="#eafff4" toneMapped={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.9, 32, 32]} />
        <meshBasicMaterial color="#1fd8ff" transparent opacity={0.06} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>

      {hubs.map((h, i) => (
        <group key={i} position={h}>
          <mesh>
            <sphereGeometry args={[0.13, 24, 24]} />
            <meshBasicMaterial color={i % 2 ? "#34f08c" : "#1fd8ff"} toneMapped={false} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.32, 0.006, 6, 64]} />
            <meshBasicMaterial color="#eef2f8" transparent opacity={0.45} />
          </mesh>
        </group>
      ))}

      <DataNodes nodes={satellites} size={0.7} />
      {hubCurves.map((c, i) => (
        <SignalBeam key={`h${i}`} curve={c} speed={0.4} offset={i * 0.25} thickness={0.014} base={0.18} color="#1fd8ff" head="#34f08c" />
      ))}
      {satCurves.map((c, i) => (
        <SignalBeam key={`s${i}`} curve={c} speed={0.25 + (i % 4) * 0.07} offset={(i * 0.41) % 1} thickness={0.006} base={0.05} color="#2b6bff" head="#1fd8ff" />
      ))}
    </group>
  );
}
