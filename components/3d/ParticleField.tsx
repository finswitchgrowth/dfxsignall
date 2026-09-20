"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { mulberry32 } from "@/lib/utils";
import { useSceneEnv } from "./SceneCanvas";

type Props = { count?: number; area?: [number, number, number]; size?: number; speed?: number; seed?: number; opacity?: number };

/** Drifting ambient particles with depth-attenuated size. */
export function ParticleField({ count = 1400, area = [26, 16, 14], size = 26, speed = 0.12, seed = 11, opacity = 0.7 }: Props) {
  const { tier } = useSceneEnv();
  const n = tier === "low" ? Math.round(count * 0.45) : count;
  const dpr = useThree((s) => s.viewport.dpr);
  const mat = useRef<THREE.ShaderMaterial>(null);

  const geometry = useMemo(() => {
    const rand = mulberry32(seed);
    const pos = new Float32Array(n * 3);
    const scale = new Float32Array(n);
    const hue = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      pos[i * 3] = (rand() - 0.5) * area[0];
      pos[i * 3 + 1] = (rand() - 0.5) * area[1];
      pos[i * 3 + 2] = (rand() - 0.5) * area[2] - 2;
      scale[i] = 0.25 + Math.pow(rand(), 3) * 1.6;
      hue[i] = rand();
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aScale", new THREE.BufferAttribute(scale, 1));
    g.setAttribute("aHue", new THREE.BufferAttribute(hue, 1));
    return g;
  }, [n, area, seed]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSize: { value: size },
      uDpr: { value: dpr },
      uHeight: { value: area[1] },
      uSpeed: { value: speed },
      uOpacity: { value: opacity },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useFrame((_, dt) => {
    if (mat.current) mat.current.uniforms.uTime.value += dt;
  });

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={mat}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={uniforms}
        vertexShader={/* glsl */ `
          attribute float aScale; attribute float aHue;
          uniform float uTime, uSize, uDpr, uHeight, uSpeed;
          varying float vHue; varying float vAlpha;
          void main(){
            vec3 p = position;
            p.y = mod(p.y + uTime * uSpeed * (0.4 + aScale) + uHeight*0.5, uHeight) - uHeight*0.5;
            p.x += sin(uTime*0.2 + position.y*0.5) * 0.15;
            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            gl_Position = projectionMatrix * mv;
            gl_PointSize = uSize * aScale * uDpr / -mv.z;
            vHue = aHue;
            float edge = 1.0 - smoothstep(uHeight*0.35, uHeight*0.5, abs(p.y));
            vAlpha = edge * (0.35 + 0.65 * sin(uTime*1.3 + aHue*40.0)*0.5 + 0.5);
          }`}
        fragmentShader={/* glsl */ `
          uniform float uOpacity; varying float vHue; varying float vAlpha;
          void main(){
            float d = length(gl_PointCoord - 0.5);
            float a = smoothstep(0.5, 0.0, d);
            vec3 blue = vec3(0.17,0.42,1.0); vec3 cyan = vec3(0.12,0.85,1.0); vec3 green = vec3(0.2,0.94,0.55);
            vec3 col = vHue < 0.55 ? mix(blue, cyan, vHue/0.55) : mix(cyan, green, (vHue-0.55)/0.45);
            gl_FragColor = vec4(col, a * a * vAlpha * uOpacity);
          }`}
      />
    </points>
  );
}
