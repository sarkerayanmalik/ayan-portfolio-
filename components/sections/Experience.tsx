"use client";

import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import Rich from "@/components/ui/Rich";
import { experience } from "@/lib/siteConfig";

export default function Experience() {
  return (
    <section
      id="experience"
      className="field-readable shell relative z-10 scroll-mt-24 py-28 md:py-36"
    >
      <SectionHeading eyebrow="02 — Experience" title="Where the work has happened." />

      <ol className="relative mt-16 border-l border-white/[0.08] pl-8 md:pl-12">
        {experience.map((job, i) => (
          <li key={i} className="relative pb-14 last:pb-0">
            {/* diamond node */}
            <span className="absolute -left-[calc(2rem+5px)] top-1.5 h-2.5 w-2.5 rotate-45 border border-gold bg-ink md:-left-[calc(3rem+5px)]" />
            <Reveal y={32}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <h3 className="font-display text-xl font-semibold text-text md:text-2xl">
                  {job.role}
                </h3>
                <span className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-gold">
                  {job.date}
                </span>
              </div>
              <p className="mt-1.5 font-mono text-[0.8rem] tracking-wide text-accent">
                {job.org}
                <span className="text-muted"> · {job.meta}</span>
              </p>
              <ul className="mt-5 flex flex-col gap-3">
                {job.bullets.map((b, bi) => (
                  <li
                    key={bi}
                    className="relative pl-6 hyphens-auto text-justify text-[0.95rem] leading-relaxed text-text/80"
                  >
                    <span className="absolute left-0 top-0 font-mono text-accent">
                      ›
                    </span>
                    <Rich text={b} />
                  </li>
                ))}
              </ul>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}
