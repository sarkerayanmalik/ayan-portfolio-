"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { scrollState } from "@/lib/sceneState";

const SceneCanvas = dynamic(() => import("./SceneCanvas"), {
  ssr: false,
  loading: () => <SceneLoader />,
});

function SceneLoader() {
  return (
    <div className="absolute inset-0 grid place-items-center">
      <div className="flex items-center gap-3 font-mono text-[0.7rem] uppercase tracking-[0.3em] text-muted">
        <span className="h-2 w-2 animate-pulse-glow rounded-full bg-accent" />
        Initialising
      </div>
    </div>
  );
}

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

export default function Background() {
  const reduce = useReducedMotion();
  const [webgl, setWebgl] = useState<boolean | null>(null);

  useEffect(() => {
    setWebgl(hasWebGL());
  }, []);

  // Global scroll driver — writes progress/velocity for the render loop to read.
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const st = ScrollTrigger.create({
      trigger: document.documentElement,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        scrollState.progress = self.progress;
        scrollState.velocity = Math.min(
          Math.abs(self.getVelocity()) / 1800,
          1.2,
        );
      },
    });
    return () => st.kill();
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[1]"
      style={{
        // graceful fallback that always sits behind the canvas
        background:
          "radial-gradient(58% 50% at 72% 30%, rgba(77,163,255,0.16) 0%, transparent 70%), radial-gradient(45% 45% at 20% 80%, rgba(124,245,208,0.08) 0%, transparent 70%)",
      }}
    >
      {webgl === true && <SceneCanvas animate={!reduce} />}
    </div>
  );
}
