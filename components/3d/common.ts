import * as THREE from "three";
import { mulberry32 } from "@/lib/utils";

export const BRAND = {
  blue: new THREE.Color("#2b6bff"),
  cyan: new THREE.Color("#1fd8ff"),
  green: new THREE.Color("#34f08c"),
  white: new THREE.Color("#eef2f8"),
  red: new THREE.Color("#ff5470"),
};

/** Evenly distributed points on a sphere (Fibonacci lattice). */
export function fibonacciSphere(count: number, radius: number) {
  const out = new Float32Array(count * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const t = golden * i;
    out[i * 3] = Math.cos(t) * r * radius;
    out[i * 3 + 1] = y * radius;
    out[i * 3 + 2] = Math.sin(t) * r * radius;
  }
  return out;
}

/** Random points on a sphere surface, deterministic by seed. */
export function randomSpherePoints(count: number, radius: number, seed = 7) {
  const rand = mulberry32(seed);
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i < count; i++) {
    const u = rand() * 2 - 1;
    const th = rand() * Math.PI * 2;
    const s = Math.sqrt(1 - u * u);
    pts.push(new THREE.Vector3(s * Math.cos(th), u, s * Math.sin(th)).multiplyScalar(radius));
  }
  return pts;
}

/** Arc lifted above a sphere between two surface points. */
export function sphereArc(a: THREE.Vector3, b: THREE.Vector3, radius: number, lift = 0.45) {
  const dist = a.distanceTo(b);
  const mid = a.clone().add(b).normalize().multiplyScalar(radius * (1 + (dist / (radius * 2)) * lift));
  return new THREE.QuadraticBezierCurve3(a, mid, b);
}

export const NOISE_GLSL = /* glsl */ `
float hash31(vec3 p){ p = fract(p*0.3183099 + .1); p *= 17.0; return fract(p.x*p.y*p.z*(p.x+p.y+p.z)); }
float vnoise(vec3 x){
  vec3 i = floor(x); vec3 f = fract(x); f = f*f*(3.0-2.0*f);
  return mix(mix(mix(hash31(i+vec3(0,0,0)),hash31(i+vec3(1,0,0)),f.x),
                 mix(hash31(i+vec3(0,1,0)),hash31(i+vec3(1,1,0)),f.x),f.y),
             mix(mix(hash31(i+vec3(0,0,1)),hash31(i+vec3(1,0,1)),f.x),
                 mix(hash31(i+vec3(0,1,1)),hash31(i+vec3(1,1,1)),f.x),f.y),f.z);
}
float fbm(vec3 p){ float v=0.0; float a=0.5; for(int i=0;i<4;i++){ v+=a*vnoise(p); p*=2.02; a*=0.5; } return v; }
`;

/** Soft round point sprite fragment helper. */
export const POINT_FRAG = /* glsl */ `
float softPoint(vec2 uv){ float d = length(uv - 0.5); return smoothstep(0.5, 0.0, d); }
`;
