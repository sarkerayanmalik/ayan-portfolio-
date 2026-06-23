"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Award, GraduationCap, Languages as LangIcon } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import {
  skillGroups,
  certifications,
  education,
  languages,
} from "@/lib/siteConfig";

const group: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.03 } },
};

function ChipGroup({ title, items }: { title: string; items: string[] }) {
  const reduce = useReducedMotion();
  const chip: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 10, scale: reduce ? 1 : 0.96 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45 } },
  };

  return (
    <div className="border-t border-white/[0.07] py-6">
      <h4 className="mb-4 font-mono text-[0.68rem] uppercase tracking-[0.2em] text-muted">
        {title}
      </h4>
      <motion.ul
        variants={group}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        className="flex flex-wrap gap-2.5"
      >
        {items.map((item) => (
          <motion.li
            key={item}
            variants={chip}
            className="cursor-default rounded-md border border-white/[0.09] bg-white/[0.03] px-3 py-1.5 font-mono text-[0.78rem] text-text/85 transition-colors duration-200 hover:border-accent/50 hover:bg-accent/[0.08] hover:text-text"
          >
            {item}
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
}

export default function Skills() {
  return (
    <section id="skills" className="field-readable shell relative z-10 scroll-mt-24 py-28 md:py-36">
      <SectionHeading eyebrow="04 — Toolkit" title="The stack behind the work." />

      <div className="mt-12 grid gap-12 lg:grid-cols-[1.55fr_1fr] lg:gap-16">
        <div>
          {skillGroups.map((g) => (
            <ChipGroup key={g.title} title={g.title} items={g.items} />
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="flex flex-col gap-8">
            {/* Certifications */}
            <div className="rounded-2xl border border-white/[0.08] bg-navy/40 p-6 md:p-7">
              <div className="mb-5 flex items-center gap-2.5 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-gold">
                <Award size={15} /> Certifications
              </div>
              <ul className="flex flex-col gap-4">
                {certifications.map((c) => (
                  <li
                    key={c.name}
                    className="border-l border-gold/40 pl-4 leading-snug"
                  >
                    <p className="text-[0.95rem] font-semibold text-text">
                      {c.name}
                    </p>
                    <p className="mt-0.5 text-[0.8rem] text-muted">{c.sub}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Education */}
            <div className="rounded-2xl border border-white/[0.08] bg-navy/40 p-6 md:p-7">
              <div className="mb-5 flex items-center gap-2.5 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-accent">
                <GraduationCap size={16} /> Education
              </div>
              <p className="text-[0.98rem] font-semibold leading-snug text-text">
                {education.degree}
              </p>
              <p className="mt-1 text-[0.85rem] text-accent">{education.uni}</p>
              <p className="mt-0.5 font-mono text-[0.72rem] text-muted">
                {education.dates}
              </p>
              <span className="mt-4 inline-flex items-center gap-2 rounded border border-gold/30 bg-gold/[0.08] px-3 py-1.5 font-mono text-[0.66rem] uppercase tracking-[0.12em] text-gold">
                ★ {education.award}
              </span>
            </div>

            {/* Languages */}
            <div className="rounded-2xl border border-white/[0.08] bg-navy/40 p-6 md:p-7">
              <div className="mb-5 flex items-center gap-2.5 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-accent-2">
                <LangIcon size={15} /> Languages
              </div>
              <ul className="flex flex-col gap-2.5">
                {languages.map((l) => (
                  <li
                    key={l.name}
                    className="flex items-baseline justify-between gap-4 text-[0.9rem]"
                  >
                    <span className="text-text">{l.name}</span>
                    <span className="font-mono text-[0.74rem] text-muted">
                      {l.level}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
