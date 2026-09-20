"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

/** Infinite-feeling perspective grid with an expanding scan pulse. */
export function TradingGrid({ y = -3, size = 70, opacity = 1 }: { y?: number; size?: number; opacity?: number }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uOpacity: { value: opacity } }), [opacity]);
  useFrame((_, dt) => {
    if (mat.current) mat.current.uniforms.uTime.value += dt;
  });
  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, y, 0]}>
      <planeGeometry args={[size, size, 1, 1]} />
      <shaderMaterial
        ref={mat}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={uniforms}
        vertexShader={/* glsl */ `
          varying vec2 vP;
          void main(){ vP = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`}
        fragmentShader={/* glsl */ `
          uniform float uTime, uOpacity; varying vec2 vP;
          float gridLine(vec2 p, float scale){
            vec2 g = abs(fract(p / scale - 0.5) - 0.5) / fwidth(p / scale);
            return 1.0 - min(min(g.x, g.y), 1.0);
          }
          void main(){
            vec2 p = vP + vec2(0.0, uTime * 0.6);
            float minor = gridLine(p, 1.0) * 0.35;
            float major = gridLine(p, 5.0) * 0.8;
            float dist = length(vP);
            float fade = smoothstep(32.0, 4.0, dist);
            float r = mod(uTime * 5.0, 38.0);
            float ring = smoothstep(1.4, 0.0, abs(dist - r)) * smoothstep(38.0, 10.0, r);
            vec3 col = mix(vec3(0.17,0.42,1.0), vec3(0.12,0.85,1.0), ring);
            float a = (minor + major) * fade * (0.22 + ring * 0.9);
            gl_FragColor = vec4(col, a * uOpacity);
          }`}
      />
    </mesh>
  );
}
