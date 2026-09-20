"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { mulberry32 } from "@/lib/utils";
import { fibonacciSphere, NOISE_GLSL } from "./common";
import { useSceneEnv } from "./SceneCanvas";

/**
 * A living data globe: a Fibonacci point lattice whose density/brightness is shaped by
 * animated noise "market regions", graticule rings and a fresnel atmosphere.
 */
export function MarketSphere({ radius = 2.4 }: { radius?: number }) {
  const { tier } = useSceneEnv();
  const count = tier === "low" ? 1600 : 4200;
  const dpr = useThree((s) => s.viewport.dpr);
  const pointsMat = useRef<THREE.ShaderMaterial>(null);
  const atmoMat = useRef<THREE.ShaderMaterial>(null);

  const pointsGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(fibonacciSphere(count, radius), 3));
    const rand = mulberry32(3);
    const r = new Float32Array(count);
    for (let i = 0; i < count; i++) r[i] = rand();
    g.setAttribute("aRand", new THREE.BufferAttribute(r, 1));
    return g;
  }, [count, radius]);

  const graticule = useMemo(() => {
    const verts: number[] = [];
    const seg = 96;
    // latitudes
    for (let k = 1; k < 8; k++) {
      const phi = (k / 8) * Math.PI;
      const y = Math.cos(phi) * radius;
      const rr = Math.sin(phi) * radius;
      for (let i = 0; i < seg; i++) {
        const a0 = (i / seg) * Math.PI * 2;
        const a1 = ((i + 1) / seg) * Math.PI * 2;
        verts.push(Math.cos(a0) * rr, y, Math.sin(a0) * rr, Math.cos(a1) * rr, y, Math.sin(a1) * rr);
      }
    }
    // longitudes
    for (let k = 0; k < 12; k++) {
      const th = (k / 12) * Math.PI;
      for (let i = 0; i < seg; i++) {
        const p0 = (i / seg) * Math.PI * 2;
        const p1 = ((i + 1) / seg) * Math.PI * 2;
        verts.push(
          Math.cos(th) * Math.sin(p0) * radius, Math.cos(p0) * radius, Math.sin(th) * Math.sin(p0) * radius,
          Math.cos(th) * Math.sin(p1) * radius, Math.cos(p1) * radius, Math.sin(th) * Math.sin(p1) * radius,
        );
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
    return g;
  }, [radius]);

  const pointUniforms = useMemo(() => ({ uTime: { value: 0 }, uDpr: { value: dpr }, uRadius: { value: radius } }), [dpr, radius]);
  const atmoUniforms = useMemo(() => ({ uTime: { value: 0 } }), []);

  useFrame((_, dt) => {
    if (pointsMat.current) pointsMat.current.uniforms.uTime.value += dt;
    if (atmoMat.current) atmoMat.current.uniforms.uTime.value += dt;
  });

  return (
    <group>
      {/* dark core so the far side reads as depth, not noise */}
      <mesh>
        <sphereGeometry args={[radius * 0.985, 64, 64]} />
        <meshBasicMaterial color="#02050c" transparent opacity={0.78} depthWrite={false} />
      </mesh>

      <lineSegments geometry={graticule}>
        <lineBasicMaterial color="#3a78ff" transparent opacity={0.07} depthWrite={false} blending={THREE.AdditiveBlending} />
      </lineSegments>

      <points geometry={pointsGeo}>
        <shaderMaterial
          ref={pointsMat}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          uniforms={pointUniforms}
          vertexShader={/* glsl */ `
            ${NOISE_GLSL}
            attribute float aRand;
            uniform float uTime, uDpr, uRadius;
            varying float vGlow; varying float vFacing; varying float vLat; varying float vRand;
            void main(){
              vec3 n = normalize(position);
              float region = fbm(n * 2.3 + vec3(uTime*0.035, 0.0, uTime*0.02));
              float band = smoothstep(0.46, 0.66, region);
              float pulse = 0.5 + 0.5 * sin(uTime * (1.2 + aRand*2.0) + aRand * 60.0);
              vec3 p = position * (1.0 + band * 0.028 * pulse);
              vec4 mv = modelViewMatrix * vec4(p, 1.0);
              gl_Position = projectionMatrix * mv;
              vec3 vn = normalize(normalMatrix * n);
              vFacing = clamp(vn.z, -1.0, 1.0);
              vGlow = band;
              vLat = n.y;
              vRand = aRand;
              float s = mix(1.3, 3.6, band) * (0.75 + pulse * 0.45);
              gl_PointSize = s * uDpr * (9.0 / -mv.z);
            }`}
          fragmentShader={/* glsl */ `
            varying float vGlow; varying float vFacing; varying float vLat; varying float vRand;
            void main(){
              float d = length(gl_PointCoord - 0.5);
              float a = smoothstep(0.5, 0.05, d);
              vec3 blue = vec3(0.17,0.42,1.0); vec3 cyan = vec3(0.12,0.85,1.0); vec3 green = vec3(0.2,0.94,0.55);
              vec3 base = mix(blue, cyan, smoothstep(-0.8, 0.6, vLat));
              vec3 col = mix(base, green, vGlow * step(0.72, vRand));
              col = mix(col, vec3(0.93), vGlow * step(0.965, vRand) * 0.7);
              float facing = smoothstep(-0.55, 0.35, vFacing);
              float alpha = a * mix(0.10, 1.0, facing) * mix(0.28, 1.0, vGlow);
              gl_FragColor = vec4(col, alpha);
            }`}
        />
      </points>

      {/* fresnel atmosphere */}
      <mesh scale={1.16}>
        <sphereGeometry args={[radius, 64, 64]} />
        <shaderMaterial
          ref={atmoMat}
          transparent
          depthWrite={false}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          uniforms={atmoUniforms}
          vertexShader={/* glsl */ `
            varying vec3 vN; varying vec3 vV;
            void main(){
              vec4 mv = modelViewMatrix * vec4(position,1.0);
              vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz);
              gl_Position = projectionMatrix * mv;
            }`}
          fragmentShader={/* glsl */ `
            uniform float uTime; varying vec3 vN; varying vec3 vV;
            void main(){
              float f = pow(1.0 - abs(dot(vN, vV)), 2.6);
              float i = smoothstep(0.0, 1.0, 1.0 - f) * f;
              vec3 col = mix(vec3(0.12,0.45,1.0), vec3(0.12,0.85,1.0), 0.5 + 0.5*sin(uTime*0.3));
              gl_FragColor = vec4(col, i * 1.25);
            }`}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[radius * 1.002, 64, 64]} />
        <shaderMaterial
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          vertexShader={/* glsl */ `
            varying vec3 vN; varying vec3 vV;
            void main(){
              vec4 mv = modelViewMatrix * vec4(position,1.0);
              vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz);
              gl_Position = projectionMatrix * mv;
            }`}
          fragmentShader={/* glsl */ `
            varying vec3 vN; varying vec3 vV;
            void main(){
              float f = pow(1.0 - max(dot(vN, vV), 0.0), 3.5);
              gl_FragColor = vec4(mix(vec3(0.17,0.42,1.0), vec3(0.2,0.94,0.55), f*0.35), f * 0.55);
            }`}
        />
      </mesh>
    </group>
  );
}
