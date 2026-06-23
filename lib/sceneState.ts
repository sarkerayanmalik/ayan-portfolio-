/**
 * sceneState — mutable singletons that bridge scroll/pointer input to the R3F
 * render loop WITHOUT triggering React re-renders. GSAP/ScrollTrigger and the
 * pointer listener write here; useFrame reads here. One object, no subscriptions.
 */

export const scrollState = {
  /** 0 → 1 across the whole document */
  progress: 0,
  /** smoothed absolute scroll velocity, roughly 0 → 1 */
  velocity: 0,
};

export const pointerState = {
  /** -1 → 1, normalised pointer position for camera parallax */
  x: 0,
  y: 0,
};

let pointerBound = false;

/** Attach the global pointer listener once (idempotent). Returns a cleanup fn. */
export function bindPointer(): () => void {
  if (typeof window === "undefined" || pointerBound) return () => {};
  pointerBound = true;

  const onMove = (e: PointerEvent) => {
    pointerState.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointerState.y = (e.clientY / window.innerHeight) * 2 - 1;
  };
  window.addEventListener("pointermove", onMove, { passive: true });

  return () => {
    window.removeEventListener("pointermove", onMove);
    pointerBound = false;
  };
}
