"use client";

import Image from "next/image";
import {
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { MouseEvent, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { projects, type Project } from "@/lib/siteConfig";

// Deterministic scatter origins (corners) — cards fly in from these, swing
// through a circle waypoint, then lock into the grid. Kept static so SSR and
// client render the same (no hydration jump).
const SCATTER = [
  { x: -480, y: -320, r: -42 },
  { x: 500, y: -250, r: 36 },
  { x: -450, y: 330, r: 30 },
  { x: 490, y: 300, r: -38 },
];

// Mid-flight circle waypoint — one point on a ring per card, evenly spaced,
// so the set briefly reads as an orbiting circle before collapsing into the grid.
const CIRCLE_RADIUS = 210;
const CIRCLE = SCATTER.map((_, i) => {
  const angle = (i / SCATTER.length) * Math.PI * 2 - Math.PI / 2;
  return {
    x: Math.round(Math.cos(angle) * CIRCLE_RADIUS),
    y: Math.round(Math.sin(angle) * CIRCLE_RADIUS),
  };
});

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const reduce = useReducedMotion();
  const o = SCATTER[index % SCATTER.length];
  const c = CIRCLE[index % CIRCLE.length];
  const initial = reduce
    ? { opacity: 0 }
    : { opacity: 0, x: o.x, y: o.y, rotate: o.r, scale: 0.5, filter: "blur(18px)" };
  // Three-stage keyframes: scatter corner → circle waypoint → grid cell.
  // First entry in each array matches `initial` so the animation continues
  // smoothly rather than snapping.
  const formed = reduce
    ? { opacity: 1 }
    : {
        opacity: [0, 1, 1],
        x: [o.x, c.x, 0],
        y: [o.y, c.y, 0],
        rotate: [o.r, o.r * 0.3, 0],
        scale: [0.5, 0.88, 1],
        filter: ["blur(18px)", "blur(3px)", "blur(0px)"],
      };
  const rx = useSpring(useMotionValue(0), { stiffness: 150, damping: 18 });
  const ry = useSpring(useMotionValue(0), { stiffness: 150, damping: 18 });
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);
  const glow = useMotionTemplate`radial-gradient(420px circle at ${gx}% ${gy}%, rgba(77,163,255,0.14), transparent 60%)`;

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    rx.set((0.5 - py) * 8);
    ry.set((px - 0.5) * 10);
    gx.set(px * 100);
    gy.set(py * 100);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  // Visibility is detected on this plain (untransformed) wrapper, not on the
  // element being animated. The entrance moves cards hundreds of pixels off
  // their layout position — if `whileInView` watched that transformed element
  // directly, its on-screen bounding box could sit outside the trigger zone
  // and the animation would never fire, leaving cards permanently invisible.
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wrapperRef, { once: true, amount: 0.3 });

  return (
    <div ref={wrapperRef} className="h-full">
      <motion.div
        className="h-full"
        initial={initial}
        animate={inView ? formed : initial}
        transition={
          reduce
            ? { duration: 0.5 }
            : {
                duration: 1.5,
                times: [0, 0.55, 1],
                ease: ["easeOut", "easeInOut"],
                delay: index * 0.12,
              }
        }
      >
        <motion.article
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{ rotateX: rx, rotateY: ry, transformPerspective: 1000 }}
        className="group relative h-full overflow-hidden rounded-2xl border border-white/[0.08] bg-navy/40 transition-[border-color,box-shadow,transform] duration-300 [transform-style:preserve-3d] hover:-translate-y-1.5 hover:border-accent/40 hover:shadow-[0_30px_80px_-30px_rgba(77,163,255,0.45)]"
      >
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: glow }}
        />

        <div className="relative aspect-[16/9] overflow-hidden border-b border-white/[0.06]">
          <Image
            src={project.image}
            alt={`${project.name} — cover artwork`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
          <span className="absolute right-4 top-4 grid h-9 w-9 translate-y-1 place-items-center rounded-full border border-white/15 bg-ink/60 text-text opacity-0 backdrop-blur transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <ArrowUpRight size={16} />
          </span>
        </div>

        <div className="p-6 md:p-7">
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-[0.7rem] text-gold">
              {project.index}
            </span>
            <h3 className="font-display text-lg font-semibold leading-snug text-text md:text-xl">
              {project.name}
            </h3>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {project.tags.map((t) => (
              <span
                key={t}
                className="rounded border border-accent/20 bg-accent/[0.07] px-2.5 py-1 font-mono text-[0.62rem] uppercase tracking-[0.08em] text-accent/90"
              >
                {t}
              </span>
            ))}
          </div>

          <p className="mt-5 border-t border-white/[0.06] pt-5 text-[0.92rem] leading-relaxed text-text/75">
            {project.description}
          </p>
        </div>
        </motion.article>
      </motion.div>
    </div>
  );
}

export default function Projects() {
  return (
    <section
      id="projects"
      className="field-readable shell relative z-10 scroll-mt-24 py-28 md:py-36"
    >
      <SectionHeading eyebrow="03 — Projects" title="Builds that turned theory into running systems." />

      <div className="mt-14 grid gap-6 md:grid-cols-2">
        {projects.map((p, i) => (
          <ProjectCard key={p.index} project={p} index={i} />
        ))}
      </div>
    </section>
  );
}
