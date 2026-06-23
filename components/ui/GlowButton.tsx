"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useRef, MouseEvent, ReactNode } from "react";

type Props = {
  href: string;
  children: ReactNode;
  variant?: "solid" | "ghost";
  className?: string;
  download?: boolean;
  external?: boolean;
};

export default function GlowButton({
  href,
  children,
  variant = "solid",
  className = "",
  download,
  external,
}: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduce = useReducedMotion();

  const onMove = (e: MouseEvent<HTMLAnchorElement>) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * 0.18;
    const y = (e.clientY - r.top - r.height / 2) * 0.28;
    ref.current.style.transform = `translate(${x}px, ${y}px)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "translate(0,0)";
  };

  const base =
    "group relative inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 font-mono text-[0.78rem] uppercase tracking-[0.18em] transition-[transform,box-shadow,background-color] duration-300 will-change-transform";

  const styles =
    variant === "solid"
      ? "bg-accent text-[#04121f] hover:shadow-[0_0_0_1px_rgba(77,163,255,0.6),0_14px_50px_-8px_rgba(77,163,255,0.65)]"
      : "border border-white/15 bg-white/[0.03] text-text hover:border-accent/60 hover:bg-accent/[0.07] hover:shadow-[0_0_36px_-8px_rgba(77,163,255,0.45)]";

  return (
    <motion.a
      ref={ref}
      href={href}
      download={download}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`${base} ${styles} ${className}`}
    >
      {variant === "solid" && (
        <span className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-accent blur-xl opacity-40 transition-opacity duration-300 group-hover:opacity-70" />
      )}
      {children}
    </motion.a>
  );
}
