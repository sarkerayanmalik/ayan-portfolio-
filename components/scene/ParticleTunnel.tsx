"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { scrollState } from "@/lib/sceneState";

const RADIUS = 12;
const LENGTH = 130;
const SCROLL_TRAVEL = 84; // how far a full-page scroll pushes the flow

const COL_BLUE = new THREE.Color("#4da3ff");
const COL_TEAL = new THREE.Color("#7cf5d0");
const COL_GOLD = new THREE.Color("#d49a3a");

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  uniform float uScrollFlow;
  uniform float uSpread;
  uniform float uLength;
  attribute float aSpeed;
  attribute float aScale;
  attribute vec3 aColor;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vColor = aColor;
    vec3 p = position;

    // continuous flow toward the camera, plus scroll-driven travel, wrapped
    float flow = uTime * aSpeed * 1.6 + uScrollFlow * aSpeed;
    float z = mod(p.z + flow, uLength) - uLength; // (-uLength, 0]

    // radial spread reacts to scroll velocity ("open up" on fast scroll)
    float spread = 1.0 + uSpread * (0.45 + aScale * 0.5);
    vec2 xy = p.xy * spread;

    vec4 mv = modelViewMatrix * vec4(xy, z, 1.0);
    gl_Position = projectionMatrix * mv;

    gl_PointSize = aScale * uSize * (220.0 / max(-mv.z, 0.1));

    // depth fog — fade both the far wall and particles right on the lens
    float depth = (z + uLength) / uLength; // 0 far -> 1 near
    float farFade = smoothstep(0.0, 0.34, depth);
    float nearFade = 1.0 - smoothstep(0.82, 1.0, depth);
    vAlpha = farFade * nearFade * 0.34;
  }
`;

const fragmentShader = /* glsl */ `
  precision mediump float;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    float soft = smoothstep(0.5, 0.0, d);
    float core = smoothstep(0.18, 0.0, d);
    vec3 col = vColor + core * 0.22;
    gl_FragColor = vec4(col, soft * vAlpha);
  }
`;

type Props = {
  count: number;
  animate: boolean;
  /** desktop gets a touch more glow headroom */
  sizeScale?: number;
};

export default function ParticleTunnel({ count, animate, sizeScale = 1 }: Props) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const progress = useRef(0);

  const { geometry, uniforms } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    const scales = new Float32Array(count);

    const tmp = new THREE.Color();
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      // shell-weighted radius so the tunnel walls read; inner bound kept high so
      // the central pocket where text sits stays dark and readable
      const r = RADIUS * (0.5 + Math.pow(Math.random(), 0.5) * 0.5);
      positions[i * 3] = Math.cos(angle) * r;
      positions[i * 3 + 1] = Math.sin(angle) * r;
      positions[i * 3 + 2] = Math.random() * LENGTH;

      const radialT = THREE.MathUtils.clamp(r / RADIUS, 0, 1);
      if (Math.random() < 0.05) {
        tmp.copy(COL_GOLD); // rare warm sparks (résumé identity)
      } else {
        tmp.copy(COL_BLUE).lerp(COL_TEAL, radialT * 0.85 + Math.random() * 0.15);
      }
      colors[i * 3] = tmp.r;
      colors[i * 3 + 1] = tmp.g;
      colors[i * 3 + 2] = tmp.b;

      speeds[i] = 0.6 + Math.random() * 0.9;
      scales[i] = 0.45 + Math.pow(Math.random(), 2) * 1.7;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
    geo.setAttribute("aSpeed", new THREE.BufferAttribute(speeds, 1));
    geo.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), LENGTH);

    const uni = {
      uTime: { value: 0 },
      uSize: { value: 5 * sizeScale },
      uScrollFlow: { value: 0 },
      uSpread: { value: 0 },
      uLength: { value: LENGTH },
    };

    return { geometry: geo, uniforms: uni };
  }, [count, sizeScale]);

  useFrame((_, delta) => {
    const m = matRef.current;
    if (!m) return;
    const d = Math.min(delta, 0.05);

    if (animate) {
      m.uniforms.uTime.value += d;
    }

    // Smoothed scroll PROGRESS drives a continuous, directional zoom:
    // scrolling down eases the camera deeper into the tunnel, scrolling up
    // eases it back out. No velocity term, so it never pulses in-and-out.
    progress.current += (scrollState.progress - progress.current) * 0.06;
    m.uniforms.uScrollFlow.value = progress.current * SCROLL_TRAVEL;
    m.uniforms.uSpread.value = 0;
  });

  return (
    <points frustumCulled={false}>
      <primitive object={geometry} attach="geometry" />
      <shaderMaterial
        ref={matRef}
        args={[
          {
            uniforms,
            vertexShader,
            fragmentShader,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
          },
        ]}
      />
    </points>
  );
}
