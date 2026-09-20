"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const vert = /* glsl */ `
  varying vec2 vUv;
  void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
`;
const frag = /* glsl */ `
  uniform float uTime, uSpeed, uOffset, uBase; uniform vec3 uColor, uHead;
  varying vec2 vUv;
  void main(){
    float t = fract(uTime * uSpeed + uOffset);
    float x = vUv.x;
    float trail = smoothstep(t - 0.28, t, x) * step(x, t);
    float head = smoothstep(0.035, 0.0, abs(x - t));
    float ends = smoothstep(0.0, 0.06, x) * smoothstep(1.0, 0.94, x);
    vec3 col = mix(uColor, uHead, head);
    float a = (uBase + trail * 0.75 + head * 1.4) * ends;
    gl_FragColor = vec4(col, a);
  }
`;

/**
 * Signal pulse travelling along a curve — the visual language for
 * "information moving through the system".
 */
export function SignalBeam({
  curve,
  color = "#1fd8ff",
  head = "#34f08c",
  speed = 0.35,
  offset = 0,
  thickness = 0.012,
  base = 0.08,
}: {
  curve: THREE.Curve<THREE.Vector3>;
  color?: string;
  head?: string;
  speed?: number;
  offset?: number;
  thickness?: number;
  base?: number;
}) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const geometry = useMemo(() => new THREE.TubeGeometry(curve, 64, thickness, 6, false), [curve, thickness]);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSpeed: { value: speed },
      uOffset: { value: offset },
      uBase: { value: base },
      uColor: { value: new THREE.Color(color) },
      uHead: { value: new THREE.Color(head) },
    }),
    [speed, offset, base, color, head],
  );
  useFrame((_, dt) => {
    if (mat.current) mat.current.uniforms.uTime.value += dt;
  });
  return (
    <mesh geometry={geometry}>
      <shaderMaterial ref={mat} transparent depthWrite={false} blending={THREE.AdditiveBlending} uniforms={uniforms} vertexShader={vert} fragmentShader={frag} />
    </mesh>
  );
}
