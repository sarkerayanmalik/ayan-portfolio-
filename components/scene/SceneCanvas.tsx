"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { bindPointer, pointerState, scrollState } from "@/lib/sceneState";
import ParticleTunnel from "./ParticleTunnel";

type Tier = {
  count: number;
  bloom: boolean;
  sizeScale: number;
};

function detectTier(): Tier {
  if (typeof window === "undefined") {
    return { count: 9000, bloom: true, sizeScale: 1 };
  }
  const w = window.innerWidth;
  const dpr = window.devicePixelRatio || 1;
  const lowPower = dpr < 1.3 && w >= 768;

  if (w < 768) {
    // mobile budget: drastically reduced, bloom off
    return { count: 2200, bloom: false, sizeScale: 0.95 };
  }
  if (w < 1280) {
    return { count: 4800, bloom: !lowPower, sizeScale: 1 };
  }
  // desktop, max cinematic
  return { count: 7600, bloom: true, sizeScale: 1 };
}

/** Camera parallax sway tied to pointer + gentle scroll dolly. */
function Rig({ animate }: { animate: boolean }) {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3(0, 0, -24));

  useFrame(() => {
    if (!animate) {
      camera.position.set(0, 0, 7);
      camera.lookAt(0, 0, -24);
      return;
    }
    const px = pointerState.x;
    const py = pointerState.y;
    // subtle dolly inward as the page scrolls
    const dollyZ = 7 - scrollState.progress * 2.2;

    camera.position.x += (px * 1.5 - camera.position.x) * 0.045;
    camera.position.y += (-py * 0.95 - camera.position.y) * 0.045;
    camera.position.z += (dollyZ - camera.position.z) * 0.06;

    target.current.set(px * 0.6, -py * 0.4, -24);
    camera.lookAt(target.current);
  });

  return null;
}

export default function SceneCanvas({ animate }: { animate: boolean }) {
  const [tier, setTier] = useState<Tier | null>(null);

  useEffect(() => {
    setTier(detectTier());
    if (animate) return bindPointer();
  }, [animate]);

  if (!tier) return null;

  return (
    <Canvas
      frameloop={animate ? "always" : "demand"}
      dpr={[1, 2]}
      gl={{
        antialias: false,
        alpha: true,
        powerPreference: "high-performance",
        stencil: false,
        depth: false,
      }}
      camera={{ position: [0, 0, 7], fov: 62, near: 0.1, far: 220 }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x060b14, 0);
      }}
    >
      <Rig animate={animate} />
      <ParticleTunnel
        count={tier.count}
        animate={animate}
        sizeScale={tier.sizeScale}
      />
      {tier.bloom && (
        <EffectComposer multisampling={0}>
          <Bloom
            intensity={0.32}
            luminanceThreshold={0.5}
            luminanceSmoothing={0.85}
            mipmapBlur
            radius={0.6}
          />
        </EffectComposer>
      )}
    </Canvas>
  );
}
