"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * One-shot cinematic intro: an ink curtain holds, a light seam draws across the
 * centre and blooms, then the curtain parts vertically to reveal the hero.
 * Skipped entirely under prefers-reduced-motion.
 */
export default function IntroOverlay() {
  const reduce = useReducedMotion();
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (reduce) {
      setDone(true);
      return;
    }
    const t = setTimeout(() => setDone(true), 1500);
    return () => clearTimeout(t);
  }, [reduce]);

  if (reduce || done) return null;

  const curtainEase = [0.76, 0, 0.24, 1] as const;

  return (
    <div className="pointer-events-none fixed inset-0 z-[90] overflow-hidden">
      {/* top curtain */}
      <motion.div
        className="absolute inset-x-0 top-0 h-1/2 bg-ink"
        initial={{ y: 0 }}
        animate={{ y: "-100%" }}
        transition={{ duration: 0.85, delay: 0.45, ease: curtainEase }}
      />
      {/* bottom curtain */}
      <motion.div
        className="absolute inset-x-0 bottom-0 h-1/2 bg-ink"
        initial={{ y: 0 }}
        animate={{ y: "100%" }}
        transition={{ duration: 0.85, delay: 0.45, ease: curtainEase }}
      />

      {/* centre bloom */}
      <motion.div
        className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(77,163,255,0.55), transparent 70%)",
        }}
        initial={{ scale: 0.2, opacity: 0 }}
        animate={{ scale: [0.2, 1.5], opacity: [0, 0.9, 0] }}
        transition={{ duration: 1, ease: "easeOut" }}
      />

      {/* light seam that draws then snaps off as the curtain parts */}
      <motion.div
        className="absolute left-0 right-0 top-1/2 h-[2px] -translate-y-1/2 origin-center"
        style={{
          background:
            "linear-gradient(90deg, transparent, #4DA3FF 35%, #7CF5D0 50%, #4DA3FF 65%, transparent)",
          boxShadow: "0 0 24px rgba(77,163,255,0.7)",
        }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: [0, 1, 1], opacity: [0, 1, 0] }}
        transition={{ duration: 1.2, times: [0, 0.45, 1], ease: "easeInOut" }}
      />
    </div>
  );
}
