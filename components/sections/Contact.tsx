"use client";

import { Mail, Phone, Linkedin, Github, MapPin, ArrowUp, Download } from "lucide-react";
import BlurText from "@/components/ui/BlurText";
import Reveal from "@/components/ui/Reveal";
import GlowButton from "@/components/ui/GlowButton";
import { siteConfig } from "@/lib/siteConfig";

const { contact, cvPath } = siteConfig;

const links = [
  { icon: Mail, label: contact.email, href: `mailto:${contact.email}` },
  { icon: Phone, label: contact.phone, href: contact.phoneHref },
  { icon: Linkedin, label: contact.linkedin, href: contact.linkedinHref, external: true },
  { icon: Github, label: contact.github, href: contact.githubHref, external: true },
  { icon: MapPin, label: contact.location, href: undefined },
];

export default function Contact() {
  return (
    <section
      id="contact"
      className="field-readable relative z-10 scroll-mt-24 pb-16 pt-28 md:pt-36"
    >
      <div className="shell">
        <Reveal y={16}>
          <span className="eyebrow">05 — Contact</span>
        </Reveal>

        <BlurText
          as="h2"
          text="Let's build something solid."
          stagger={0.03}
          className="mt-6 max-w-4xl font-display text-[clamp(2.2rem,7vw,5rem)] font-bold leading-[1.02] tracking-tightest text-text"
        />

        <Reveal delay={0.1}>
          <p className="mt-6 max-w-xl hyphens-auto text-left md:text-justify text-[1.05rem] leading-relaxed text-text/75">
            Open to entry-level roles in Network Support, Cloud Operations, or
            Cybersecurity. The fastest way to reach me is email.
          </p>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <GlowButton href={`mailto:${contact.email}`} variant="solid">
              <Mail size={15} /> Get in touch
            </GlowButton>
            <GlowButton href={cvPath} variant="ghost" download>
              <Download size={15} /> Download CV
            </GlowButton>
          </div>
        </Reveal>

        <Reveal delay={0.25}>
          <ul className="mt-16 grid gap-x-10 gap-y-5 border-t border-white/[0.08] pt-10 sm:grid-cols-2">
            {links.map(({ icon: Icon, label, href, external }) => {
              const inner = (
                <span className="flex items-center gap-3.5">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-accent">
                    <Icon size={15} />
                  </span>
                  <span className="font-mono text-[0.86rem] text-text/85">
                    {label}
                  </span>
                </span>
              );
              return (
                <li key={label}>
                  {href ? (
                    <a
                      href={href}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noopener noreferrer" : undefined}
                      className="group inline-flex transition-opacity hover:opacity-100 [&_span.font-mono]:transition-colors [&_span.font-mono]:duration-200 hover:[&_span.font-mono]:text-accent"
                    >
                      {inner}
                    </a>
                  ) : (
                    inner
                  )}
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>

      <footer className="shell mt-24 flex flex-col items-center justify-between gap-5 border-t border-white/[0.07] pt-8 sm:flex-row">
        <p className="font-mono text-[0.72rem] tracking-wide text-muted">
          © {new Date().getFullYear()} Ayan Malik · Network · Cloud · Security
        </p>
        <a
          href="#home"
          className="group inline-flex items-center gap-2 font-mono text-[0.72rem] uppercase tracking-[0.16em] text-muted transition-colors hover:text-text"
        >
          Back to top
          <span className="grid h-7 w-7 place-items-center rounded-full border border-white/10 transition-transform duration-300 group-hover:-translate-y-0.5">
            <ArrowUp size={13} />
          </span>
        </a>
      </footer>
    </section>
  );
}
