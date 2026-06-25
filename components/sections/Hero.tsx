"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import BlurText from "@/components/ui/BlurText";
import { siteConfig } from "@/lib/siteConfig";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 140]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const nameLine =
    "block font-display font-bold uppercase leading-[0.82] tracking-tightest text-[clamp(3.5rem,12vw,9.5rem)]";

  return (
    <section
      ref={ref}
      id="home"
      className="relative flex min-h-[100svh] flex-col items-center pb-8 pt-24 sm:pt-28"
    >
      <motion.div
        style={{ y, opacity }}
        className="relative z-10 flex w-full flex-1 flex-col items-center justify-center px-4"
      >
        {/* soft radial backing — keeps the column legible over the tunnel */}
        <span
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[125%] w-[150%] max-w-[1100px] -translate-x-1/2 -translate-y-1/2 rounded-[50%]"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(6,11,20,0.7) 0%, rgba(6,11,20,0.32) 45%, transparent 72%)",
          }}
        />

        <div className="flex flex-col items-center text-center">
          {/* ── Status chip ── */}
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="mb-7 inline-flex items-center gap-2 rounded-full border border-accent-2/30 bg-accent-2/[0.06] px-3.5 py-1.5 font-mono text-[0.62rem] uppercase tracking-[0.24em] text-accent-2/90 backdrop-blur-sm"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-accent-2 opacity-75 motion-safe:animate-ping" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent-2" />
            </span>
            Open to work
          </motion.span>

          {/* ── Portrait with orbiting nodes + gradient ring ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.82, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="group relative mb-9 sm:mb-10"
          >
            {/* ambient glow */}
            <span
              aria-hidden
              className="pointer-events-none absolute -inset-6 rounded-full bg-accent/20 blur-3xl transition-opacity duration-500 group-hover:bg-accent/35"
            />

            {/* orbiting network nodes */}
            <div
              aria-hidden
              className="absolute -inset-[14px] rounded-full motion-safe:animate-[spin_18s_linear_infinite] motion-reduce:hidden"
            >
              <span className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_12px_3px_rgba(77,163,255,0.75)]" />
              <span className="absolute bottom-[10%] right-[4%] h-2 w-2 rounded-full bg-accent-2 shadow-[0_0_12px_3px_rgba(124,245,208,0.6)]" />
              <span className="absolute left-[6%] top-[42%] h-1.5 w-1.5 rounded-full bg-gold/90 shadow-[0_0_10px_2px_rgba(212,154,58,0.55)]" />
            </div>

            {/* one-shot pulse ring on entrance */}
            <motion.span
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-full border border-accent/70 motion-reduce:hidden"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: [0.85, 1.7], opacity: [0, 0.7, 0] }}
              transition={{ duration: 1.3, delay: 0.95, ease: "easeOut" }}
            />

            {/* gradient ring + photo. siteConfig.heroMark is the single source —
                set it back to "/monogram.svg" to restore the monogram. */}
            <div className="relative rounded-full bg-gradient-to-b from-accent via-accent/35 to-accent-2/70 p-[2.5px] shadow-[0_0_60px_-12px_rgba(77,163,255,0.7)] transition-transform duration-300 group-hover:scale-[1.04]">
              <div className="relative h-[150px] w-[150px] overflow-hidden rounded-full bg-navy sm:h-[170px] sm:w-[170px] md:h-[190px] md:w-[190px] lg:h-[204px] lg:w-[204px]">
                <Image
                  src={siteConfig.heroMark}
                  alt={siteConfig.heroMarkAlt}
                  fill
                  priority
                  sizes="210px"
                  className="object-cover"
                  style={{ objectPosition: "center 32%" }}
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset ring-white/15"
                />
              </div>
            </div>
          </motion.div>

          {/* ── Name, glossy gradient fill ── */}
          <h1 aria-label="Ayan Malik">
            <BlurText
              as="span"
              text="AYAN"
              trigger="mount"
              animateBy="letters"
              stagger={0.07}
              delay={0.72}
              className={`${nameLine} drop-shadow-[0_2px_20px_rgba(6,11,20,0.5)]`}
              segmentClassName="bg-gradient-to-b from-white via-white to-[#B7C9DF] bg-clip-text text-transparent"
            />
            <BlurText
              as="span"
              text="MALIK"
              trigger="mount"
              animateBy="letters"
              stagger={0.07}
              delay={0.9}
              className={`${nameLine} drop-shadow-[0_6px_30px_rgba(77,163,255,0.45)]`}
              segmentClassName="bg-gradient-to-b from-[#BFE0FF] via-[#4DA3FF] to-[#2C6BC4] bg-clip-text text-transparent"
            />
          </h1>
        </div>

        {/* Sub-tagline — word-by-word blur reveal, with a hairline above */}
        <motion.span
          aria-hidden
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-9 h-px w-40 origin-center bg-gradient-to-r from-transparent via-accent/60 to-transparent sm:mt-11"
        />
        <BlurText
          as="p"
          text="NETWORK · CLOUD · SECURITY ENGINEER"
          trigger="mount"
          animateBy="words"
          stagger={0.09}
          delay={1.35}
          className="mt-5 text-center font-mono text-[clamp(0.72rem,2vw,1.05rem)] uppercase tracking-[0.34em] text-muted"
        />
      </motion.div>

      {/* Scroll cue */}
      <motion.a
        href="#about"
        aria-label="Scroll to content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.9, duration: 1 }}
        className="z-10 mt-6 flex flex-col items-center gap-2 text-muted"
      >
        <span className="font-mono text-[0.6rem] uppercase tracking-[0.3em]">
          Scroll
        </span>
        <ChevronDown size={18} className="motion-safe:animate-scroll-cue" />
      </motion.a>
    </section>
  );
}
