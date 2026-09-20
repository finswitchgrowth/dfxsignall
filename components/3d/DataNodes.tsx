"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

/** Bright market nodes with pulsing halos, placed on a sphere surface. */
export function DataNodes({ nodes, color = "#1fd8ff", accent = "#34f08c", size = 1 }: { nodes: THREE.Vector3[]; color?: string; accent?: string; size?: number }) {
  const dpr = useThree((s) => s.viewport.dpr);
  const mat = useRef<THREE.ShaderMaterial>(null);

  const geometry = useMemo(() => {
    const pos = new Float32Array(nodes.length * 3);
    const seed = new Float32Array(nodes.length);
    nodes.forEach((v, i) => {
      pos.set([v.x, v.y, v.z], i * 3);
      seed[i] = (i * 0.6180339) % 1;
    });
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    return g;
  }, [nodes]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uDpr: { value: dpr },
      uSize: { value: size },
      uColor: { value: new THREE.Color(color) },
      uAccent: { value: new THREE.Color(accent) },
    }),
    [dpr, size, color, accent],
  );

  useFrame((_, dt) => {
    if (mat.current) mat.current.uniforms.uTime.value += dt;
  });

  return (
    <points geometry={geometry}>
      <shaderMaterial
        ref={mat}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={uniforms}
        vertexShader={/* glsl */ `
          attribute float aSeed; uniform float uTime, uDpr, uSize;
          varying float vSeed; varying float vPulse; varying float vFacing;
          void main(){
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * mv;
            vPulse = fract(uTime * 0.45 + aSeed);
            vSeed = aSeed;
            vFacing = normalize(normalMatrix * normalize(position)).z;
            gl_PointSize = 150.0 * uSize * uDpr / -mv.z * (0.8 + vPulse * 0.6);
          }`}
        fragmentShader={/* glsl */ `
          uniform vec3 uColor, uAccent; varying float vSeed; varying float vPulse; varying float vFacing;
          void main(){
            vec2 uv = gl_PointCoord - 0.5; float d = length(uv);
            float core = smoothstep(0.09, 0.0, d);
            float ring = smoothstep(0.02, 0.0, abs(d - vPulse * 0.45)) * (1.0 - vPulse);
            float halo = smoothstep(0.5, 0.0, d) * 0.18;
            vec3 col = mix(uColor, uAccent, step(0.62, vSeed));
            float facing = smoothstep(-0.3, 0.3, vFacing);
            gl_FragColor = vec4(mix(col, vec3(1.0), core*0.6), (core + ring*0.9 + halo) * facing);
          }`}
      />
    </points>
  );
}
