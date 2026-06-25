"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  Cloud,
  Network,
  Share2,
  Code,
  X,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { useReducedMotion } from "framer-motion";

type Tone = "accent" | "accent2" | "gold";

type Node = {
  id: string;
  label: string;
  title: string;
  Icon: LucideIcon;
  tags: string[];
  desc: string;
  related: string;
  tone: Tone;
  /** entrance keyframe for this node's card */
  anim: string;
};

// 4 real projects as orbiting nodes (all completed).
const NODES: Node[] = [
  {
    id: "aws",
    label: "AWS",
    title: "AWS Cloud Architecture & Security",
    Icon: Cloud,
    tags: ["VPC", "EC2", "RDS", "S3", "IAM", "HA"],
    desc: "Multi-tier AWS environment with subnet segmentation, IAM least-privilege, encryption at rest, and VPC flow logging.",
    related: "cisco",
    tone: "accent",
    anim: "cardUp",
  },
  {
    id: "cisco",
    label: "Cisco",
    title: "Cisco Network Design",
    Icon: Network,
    tags: ["Cisco IOS", "VLANs", "ACLs", "Inter-VLAN Routing"],
    desc: "Segmented enterprise LAN with VLAN trunking and inter-VLAN routing; granular ACL policy and L2/L3 fault resolution.",
    related: "aws",
    tone: "accent",
    anim: "cardRight",
  },
  {
    id: "osint",
    label: "OSINT",
    title: "OSINT Analysis System",
    Icon: Share2,
    tags: ["MongoDB", "Neo4j", "ACH", "Graph DB"],
    desc: "Dual-database intelligence tool correlating global datasets via ACH methodology over a graph DB.",
    related: "java",
    tone: "accent2",
    anim: "cardPop",
  },
  {
    id: "java",
    label: "Java",
    title: "Job Management System",
    Icon: Code,
    tags: ["Java", "OOP", "JUnit", "Swing", "Git"],
    desc: "Full OOP desktop app for project & cost management with file persistence and a JUnit test suite.",
    related: "osint",
    tone: "gold",
    anim: "cardLeft",
  },
];

// Literal class strings only — Tailwind's JIT must see them in source.
const TONE: Record<
  Tone,
  { border: string; text: string; dot: string; glow: string; hoverGlow: string }
> = {
  accent: {
    border: "border-accent/70",
    text: "text-accent",
    dot: "bg-accent",
    glow: "shadow-[0_0_26px_-2px_rgba(77,163,255,0.6)]",
    hoverGlow: "hover:shadow-[0_0_26px_-2px_rgba(77,163,255,0.6)]",
  },
  accent2: {
    border: "border-accent-2/70",
    text: "text-accent-2",
    dot: "bg-accent-2",
    glow: "shadow-[0_0_26px_-2px_rgba(124,245,208,0.55)]",
    hoverGlow: "hover:shadow-[0_0_26px_-2px_rgba(124,245,208,0.55)]",
  },
  gold: {
    border: "border-gold/70",
    text: "text-gold",
    dot: "bg-gold",
    glow: "shadow-[0_0_26px_-2px_rgba(212,154,58,0.55)]",
    hoverGlow: "hover:shadow-[0_0_26px_-2px_rgba(212,154,58,0.55)]",
  },
};

const SPEED = 7; // degrees / second — slow, cinematic
const TWEEN_MS = 900; // spin-to-top duration (longer = more graceful)

type Mode = "auto" | "tween" | "idle";

export default function OrbitalTimeline() {
  const reduce = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRefs = useRef<(HTMLDivElement | null)[]>([]);

  const angleRef = useRef(0);
  const tweenRef = useRef({ from: 0, to: 0, start: 0 });
  const pendingRef = useRef<string | null>(null);

  const [width, setWidth] = useState(0);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [inView, setInView] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mode, setMode] = useState<Mode>("auto");

  const active = NODES.find((n) => n.id === activeId) ?? null;
  const relatedId = active?.related ?? null;

  // Write the orbit rotation + node counter-rotation directly to the DOM.
  const apply = useCallback((a: number) => {
    if (containerRef.current) {
      containerRef.current.style.transform = `rotate(${a}deg)`;
    }
    const counter = `rotate(${-a}deg)`;
    for (const el of innerRefs.current) {
      if (el) el.style.transform = counter;
    }
  }, []);

  // ── Measure container (drives responsive radius; not per-frame) ──
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width));
    ro.observe(el);
    setWidth(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  const radius = width * 0.38;
  const positions = useMemo(
    () =>
      NODES.map((_, i) => {
        const a = ((-90 + i * 90) * Math.PI) / 180;
        return { x: Math.cos(a) * radius, y: Math.sin(a) * radius };
      }),
    [radius],
  );

  // ── Pause when off-screen / tab blur ──
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), {
      threshold: 0.15,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const onVis = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  // ── Single rAF loop. mode === "auto" spins continuously; mode === "tween"
  //    eases to a target angle (clicked node → 12 o'clock); mode === "idle"
  //    is frozen (no loop). No React state is set per frame, so the spin
  //    itself causes zero re-renders. ──
  useEffect(() => {
    if (reduce) {
      apply(0);
      return;
    }
    const live = inView && !hidden && (mode === "auto" || mode === "tween");
    if (!live) return;

    let raf = 0;
    let last = 0;
    let running = true;

    const loop = (t: number) => {
      if (!running) return;

      if (mode === "auto") {
        const dt = last ? (t - last) / 1000 : 0;
        last = t;
        angleRef.current = (angleRef.current + dt * SPEED) % 360;
        apply(angleRef.current);
        raf = requestAnimationFrame(loop);
        return;
      }

      // tween → ease to top
      const tw = tweenRef.current;
      if (tw.start === 0) tw.start = t;
      const p = Math.min((t - tw.start) / TWEEN_MS, 1);
      // easeInOutCubic — starts and ends at zero velocity, so there's no jerk
      // when the continuous spin hands off to the tween or when it settles.
      const e =
        p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      apply(tw.from + (tw.to - tw.from) * e);
      if (p >= 1) {
        angleRef.current = ((tw.to % 360) + 360) % 360;
        if (pendingRef.current) setActiveId(pendingRef.current);
        setMode("idle");
        return; // stop; effect re-runs and freezes
      }
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
    };
  }, [inView, hidden, reduce, mode, width, apply]);

  // Spin the clicked node to 12 o'clock (counter-clockwise), then open its card.
  const focusNode = useCallback(
    (id: string) => {
      const i = NODES.findIndex((n) => n.id === id);
      if (i < 0) return;
      if (reduce) {
        setActiveId(id);
        return;
      }
      // angle that places node i at the top
      const desired = (((-i * 90) % 360) + 360) % 360;
      const cur = ((angleRef.current % 360) + 360) % 360;
      const delta = (cur - desired + 360) % 360; // CCW distance to target
      angleRef.current = cur;
      pendingRef.current = id;
      setActiveId(null);
      if (delta < 0.5) {
        // already at top — just open
        setActiveId(id);
        setMode("idle");
        return;
      }
      tweenRef.current = { from: cur, to: cur - delta, start: 0 };
      setMode("tween");
    },
    [reduce],
  );

  const collapse = useCallback(() => {
    setActiveId(null);
    pendingRef.current = null;
    setMode("auto");
  }, []);

  const onNodeClick = (id: string) => {
    if (activeId === id) collapse();
    else focusNode(id);
  };

  return (
    <div className="mt-12 flex flex-col items-center">
      <div
        ref={wrapRef}
        onClick={collapse}
        className="relative mx-auto aspect-square w-full max-w-[340px] select-none sm:max-w-[460px] md:max-w-[560px]"
      >
        {/* Static orbit rings */}
        <div
          aria-hidden
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/15"
          style={{ width: radius * 2, height: radius * 2 }}
        />
        <div
          aria-hidden
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.05]"
          style={{ width: radius * 1.4, height: radius * 1.4 }}
        />

        {/* Center hub */}
        <div className="absolute left-1/2 top-1/2 z-[5] -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            <span
              aria-hidden
              className="absolute -inset-4 rounded-full bg-accent/20 blur-2xl"
            />
            <div className="relative grid h-16 w-16 place-items-center rounded-full border border-accent/40 bg-navy shadow-[0_0_40px_-6px_rgba(77,163,255,0.6)] md:h-[76px] md:w-[76px]">
              <Image
                src="/monogram.svg"
                alt="Ayan Malik"
                width={44}
                height={44}
                className="h-9 w-9 md:h-11 md:w-11"
              />
            </div>
          </div>
        </div>

        {/* Rotating layer (GPU-composited) */}
        <div
          ref={containerRef}
          className="absolute inset-0 will-change-transform [transform:translateZ(0)]"
        >
          {NODES.map((n, i) => {
            const t = TONE[n.tone];
            const isActive = activeId === n.id;
            const isRelated = relatedId === n.id;
            return (
              <div
                key={n.id}
                className="absolute left-1/2 top-1/2"
                style={{
                  transform: `translate(calc(-50% + ${positions[i].x}px), calc(-50% + ${positions[i].y}px))`,
                }}
              >
                <div
                  ref={(el) => {
                    innerRefs.current[i] = el;
                  }}
                  className="relative will-change-transform"
                >
                  <button
                    type="button"
                    aria-label={n.title}
                    onClick={(e) => {
                      e.stopPropagation();
                      onNodeClick(n.id);
                    }}
                    className={`grid h-14 w-14 place-items-center rounded-full border bg-navy/90 transition-[transform,box-shadow,background-color] duration-300 hover:scale-110 md:h-16 md:w-16 ${
                      t.border
                    } ${
                      isActive
                        ? `scale-110 ${t.glow}`
                        : isRelated
                          ? "ring-2 ring-accent-2/60 ring-offset-2 ring-offset-ink"
                          : t.hoverGlow
                    }`}
                  >
                    <n.Icon size={22} className={t.text} />
                  </button>
                  <span className="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap font-mono text-[0.6rem] uppercase tracking-[0.18em] text-muted [text-shadow:0_2px_10px_rgba(6,11,20,0.9)]">
                    {n.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Expanded card */}
        {active && (
          <>
            <div
              aria-hidden
              className="absolute inset-0 z-10 rounded-[28px] bg-ink/60"
            />
            <div className="absolute left-1/2 top-1/2 z-20 w-[min(90%,330px)] -translate-x-1/2 -translate-y-1/2">
              <div
                key={active.id}
                role="dialog"
                onClick={(e) => e.stopPropagation()}
                style={{
                  animation: reduce
                    ? undefined
                    : `${active.anim} 0.5s cubic-bezier(0.22,1,0.36,1) both`,
                }}
                className="relative rounded-2xl border border-white/10 bg-navy/95 p-5 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)]"
              >
                <button
                  type="button"
                  aria-label="Close"
                  onClick={collapse}
                  className="absolute right-3 top-3 grid h-7 w-7 place-items-center rounded-full text-muted transition-colors hover:bg-white/5 hover:text-text"
                >
                  <X size={15} />
                </button>

                <div className="flex items-center gap-2.5">
                  <span
                    className={`grid h-9 w-9 place-items-center rounded-full border ${TONE[active.tone].border} bg-ink/60`}
                  >
                    <active.Icon size={16} className={TONE[active.tone].text} />
                  </span>
                  <h3 className="pr-6 font-display text-base font-semibold leading-tight text-text">
                    {active.title}
                  </h3>
                </div>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {active.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded border border-accent/20 bg-accent/[0.08] px-2 py-0.5 font-mono text-[0.6rem] uppercase tracking-wide text-accent/90"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <p className="mt-4 hyphens-auto text-left text-[0.85rem] leading-relaxed text-text/75">
                  {active.desc}
                </p>

                {(() => {
                  const rel = NODES.find((n) => n.id === active.related);
                  if (!rel) return null;
                  return (
                    <div className="mt-5 border-t border-white/[0.07] pt-4">
                      <p className="mb-2 font-mono text-[0.58rem] uppercase tracking-[0.2em] text-muted">
                        Connected
                      </p>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          focusNode(rel.id);
                        }}
                        className="group inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-left text-[0.8rem] text-text transition-colors hover:border-accent/50 hover:bg-accent/[0.07]"
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${TONE[rel.tone].dot}`}
                        />
                        {rel.title}
                        <ArrowRight
                          size={14}
                          className="text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-accent"
                        />
                      </button>
                    </div>
                  );
                })()}
              </div>
            </div>
          </>
        )}
      </div>

      <p className="mt-8 text-center font-mono text-[0.62rem] uppercase tracking-[0.22em] text-muted [text-shadow:0_2px_10px_rgba(6,11,20,0.9)]">
        {active ? "Tap empty space to resume orbit" : "Tap a node to explore"}
      </p>
    </div>
  );
}
