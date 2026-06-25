"use client";

import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import CountUp from "@/components/ui/CountUp";
import Rich from "@/components/ui/Rich";
import { summaryRich, stats } from "@/lib/siteConfig";

export default function About() {
  return (
    <section id="about" className="field-readable shell relative z-10 scroll-mt-24 py-28 md:py-36">
      <SectionHeading eyebrow="01 — Profile" title="Engineering across the stack — from packets to policy." />

      <div className="mt-12 grid gap-12 md:grid-cols-[1.4fr_1fr] md:gap-16">
        <Reveal>
          <p className="max-w-2xl hyphens-auto text-left md:text-justify text-[clamp(1rem,1.4vw,1.18rem)] leading-[1.85] text-text/85">
            <Rich text={summaryRich} />
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <ul className="flex flex-col divide-y divide-white/[0.07] border-t border-white/[0.07]">
            {stats.map((s) => (
              <li key={s.label} className="flex items-baseline gap-4 py-5">
                <span className="font-display text-4xl font-semibold tabular-nums text-accent md:text-5xl">
                  <CountUp to={s.value} suffix={s.suffix} />
                </span>
                <span className="font-mono text-[0.72rem] uppercase leading-snug tracking-[0.16em] text-muted">
                  {s.label}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
