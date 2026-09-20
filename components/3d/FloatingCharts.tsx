"use client";

import { useFrame } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { instruments } from "@/content/markets";
import { ema, generateCandles } from "@/components/markets/demoData";
import { BRAND } from "./common";
import { useSceneEnv } from "./SceneCanvas";

/**
 * Floating 3D candlestick structure on a glass panel (simulated demo series).
 */
export function FloatingCharts({ count = 36, width = 4.2, height = 2.2, symbol = "XAU/USD" }: { count?: number; width?: number; height?: number; symbol?: string }) {
  const group = useRef<THREE.Group>(null);
  const bodies = useRef<THREE.InstancedMesh>(null);
  const wicks = useRef<THREE.InstancedMesh>(null);
  const { reduced } = useSceneEnv();
  const grow = useRef(reduced ? 1 : 0);

  const data = useMemo(() => {
    const inst = instruments.find((i) => i.symbol === symbol) ?? instruments[0];
    const candles = generateCandles(inst, count, "1H");
    const min = Math.min(...candles.map((c) => c.l));
    const max = Math.max(...candles.map((c) => c.h));
    const norm = (v: number) => ((v - min) / (max - min) - 0.5) * height * 0.8;
    const step = width / count;
    const closes = candles.map((c) => c.c);
    const e = ema(closes, 9);
    return {
      candles: candles.map((c, i) => ({
        x: -width / 2 + step * (i + 0.5),
        o: norm(c.o),
        c: norm(c.c),
        h: norm(c.h),
        l: norm(c.l),
        up: c.c >= c.o,
      })),
      step,
      emaPts: e.map((v, i) => new THREE.Vector3(-width / 2 + step * (i + 0.5), norm(v), 0.06)),
    };
  }, [count, width, height, symbol]);

  const emaLine = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints(new THREE.CatmullRomCurve3(data.emaPts).getPoints(160));
    return new THREE.Line(geo, new THREE.LineBasicMaterial({ color: "#1fd8ff", transparent: true, opacity: 0.85 }));
  }, [data]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  const apply = (k: number) => {
    const b = bodies.current;
    const w = wicks.current;
    if (!b || !w) return;
    data.candles.forEach((c, i) => {
      const local = THREE.MathUtils.clamp(k * 1.6 - (i / data.candles.length) * 0.6, 0, 1);
      const e = 1 - Math.pow(1 - local, 3);
      const top = Math.max(c.o, c.c);
      const bot = Math.min(c.o, c.c);
      const bh = Math.max(top - bot, 0.012) * e;
      dummy.position.set(c.x, (top + bot) / 2, 0);
      dummy.scale.set(data.step * 0.62, bh, data.step * 0.62);
      dummy.updateMatrix();
      b.setMatrixAt(i, dummy.matrix);
      dummy.position.set(c.x, (c.h + c.l) / 2, 0);
      dummy.scale.set(0.012, (c.h - c.l) * e, 0.012);
      dummy.updateMatrix();
      w.setMatrixAt(i, dummy.matrix);
    });
    b.instanceMatrix.needsUpdate = true;
    w.instanceMatrix.needsUpdate = true;
  };

  useLayoutEffect(() => {
    const b = bodies.current;
    const w = wicks.current;
    if (!b || !w) return;
    data.candles.forEach((c, i) => {
      const col = c.up ? BRAND.green : BRAND.blue;
      b.setColorAt(i, col);
      w.setColorAt(i, col);
    });
    if (b.instanceColor) b.instanceColor.needsUpdate = true;
    if (w.instanceColor) w.instanceColor.needsUpdate = true;
    apply(grow.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useFrame((state, dt) => {
    if (grow.current < 1) {
      grow.current = Math.min(1, grow.current + dt * 0.45);
      apply(grow.current);
    }
    if (group.current) group.current.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.06;
  });

  return (
    <group ref={group}>
      {/* glass panel */}
      <mesh position={[0, 0, -0.08]}>
        <planeGeometry args={[width + 0.5, height + 0.5]} />
        <meshBasicMaterial color="#0b1a36" transparent opacity={0.28} depthWrite={false} />
      </mesh>
      <lineSegments position={[0, 0, -0.07]}>
        <edgesGeometry args={[new THREE.PlaneGeometry(width + 0.5, height + 0.5)]} />
        <lineBasicMaterial color="#1fd8ff" transparent opacity={0.25} />
      </lineSegments>
      {[-0.3, 0, 0.3].map((y) => (
        <mesh key={y} position={[0, y * height, -0.075]}>
          <planeGeometry args={[width + 0.3, 0.004]} />
          <meshBasicMaterial color="#5b8dff" transparent opacity={0.12} />
        </mesh>
      ))}
      <instancedMesh ref={bodies} args={[undefined, undefined, data.candles.length]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial toneMapped={false} transparent opacity={0.92} />
      </instancedMesh>
      <instancedMesh ref={wicks} args={[undefined, undefined, data.candles.length]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial toneMapped={false} transparent opacity={0.7} />
      </instancedMesh>
      <primitive object={emaLine} />
    </group>
  );
}
