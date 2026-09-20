"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { randomSpherePoints } from "./common";
import { DataNodes } from "./DataNodes";
import { ParticleField } from "./ParticleField";
import { useSceneEnv } from "./SceneCanvas";
import { SignalBeam } from "./SignalBeam";

/** Secure data core: faceted core, shield shell, gimbal rings and encrypted links. */
export default function SecurityCore() {
  const root = useRef<THREE.Group>(null);
  const core = useRef<THREE.Mesh>(null);
  const shell = useRef<THREE.LineSegments>(null);
  const r1 = useRef<THREE.Mesh>(null);
  const r2 = useRef<THREE.Mesh>(null);
  const r3 = useRef<THREE.Mesh>(null);
  const { reduced } = useSceneEnv();

  const shellGeo = useMemo(() => new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(2.05, 1)), []);
  const innerGeo = useMemo(() => new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(0.95, 0)), []);

  const outer = useMemo(() => randomSpherePoints(14, 3.3, 99), []);
  const links = useMemo(() => outer.map((p) => new THREE.LineCurve3(p, p.clone().normalize().multiplyScalar(1.0))), [outer]);

  const coreUniforms = useMemo(() => ({ uTime: { value: 0 } }), []);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    coreUniforms.uTime.value = t;
    if (reduced) return;
    if (root.current) {
      root.current.rotation.y += (state.pointer.x * 0.35 - root.current.rotation.y) * 0.04;
      root.current.rotation.x += (-state.pointer.y * 0.2 - root.current.rotation.x) * 0.04;
    }
    if (core.current) core.current.rotation.set(t * 0.3, t * 0.4, 0);
    if (shell.current) shell.current.rotation.y -= dt * 0.12;
    if (r1.current) r1.current.rotation.z += dt * 0.6;
    if (r2.current) r2.current.rotation.x += dt * 0.45;
    if (r3.current) r3.current.rotation.y += dt * 0.35;
  });

  return (
    <group>
      <group ref={root}>
        {/* faceted core */}
        <mesh ref={core}>
          <icosahedronGeometry args={[0.92, 0]} />
          <shaderMaterial
            transparent
            uniforms={coreUniforms}
            vertexShader={/* glsl */ `
              varying vec3 vN; varying vec3 vV;
              void main(){ vec4 mv = modelViewMatrix*vec4(position,1.0); vN = normalize(normalMatrix*normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix*mv; }`}
            fragmentShader={/* glsl */ `
              uniform float uTime; varying vec3 vN; varying vec3 vV;
              void main(){
                float f = pow(1.0 - abs(dot(vN, vV)), 1.6);
                vec3 deep = vec3(0.02,0.06,0.16);
                vec3 glow = mix(vec3(0.12,0.85,1.0), vec3(0.2,0.94,0.55), 0.5+0.5*sin(uTime*0.8));
                gl_FragColor = vec4(mix(deep, glow, f), 0.92);
              }`}
          />
        </mesh>
        <lineSegments geometry={innerGeo} scale={1.02}>
          <lineBasicMaterial color="#9ff7ff" transparent opacity={0.7} />
        </lineSegments>

        {/* shield shell */}
        <lineSegments ref={shell} geometry={shellGeo}>
          <lineBasicMaterial color="#2b6bff" transparent opacity={0.35} blending={THREE.AdditiveBlending} depthWrite={false} />
        </lineSegments>
        <mesh scale={2.05}>
          <sphereGeometry args={[1, 48, 48]} />
          <shaderMaterial
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            vertexShader={/* glsl */ `
              varying vec3 vN; varying vec3 vV;
              void main(){ vec4 mv = modelViewMatrix*vec4(position,1.0); vN = normalize(normalMatrix*normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix*mv; }`}
            fragmentShader={/* glsl */ `
              varying vec3 vN; varying vec3 vV;
              void main(){ float f = pow(1.0 - max(dot(vN, vV),0.0), 3.0); gl_FragColor = vec4(vec3(0.12,0.6,1.0), f*0.5); }`}
          />
        </mesh>

        {/* gimbal rings */}
        <mesh ref={r1}>
          <torusGeometry args={[1.45, 0.012, 8, 160, Math.PI * 1.6]} />
          <meshBasicMaterial color="#1fd8ff" toneMapped={false} />
        </mesh>
        <mesh ref={r2} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.62, 0.008, 8, 160, Math.PI * 1.2]} />
          <meshBasicMaterial color="#34f08c" toneMapped={false} />
        </mesh>
        <mesh ref={r3} rotation={[0.6, 0, Math.PI / 3]}>
          <torusGeometry args={[2.6, 0.005, 8, 200, Math.PI * 1.8]} />
          <meshBasicMaterial color="#2b6bff" transparent opacity={0.7} toneMapped={false} />
        </mesh>

        {/* encrypted links */}
        <DataNodes nodes={outer} size={0.9} />
        {links.map((c, i) => (
          <SignalBeam key={i} curve={c} speed={0.5} offset={(i * 0.23) % 1} thickness={0.008} base={0.1} color="#2b6bff" head="#34f08c" />
        ))}
      </group>
      <ParticleField count={600} area={[14, 10, 8]} size={20} speed={0.08} seed={5} opacity={0.5} />
    </group>
  );
}
