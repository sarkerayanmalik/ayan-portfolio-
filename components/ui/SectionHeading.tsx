"use client";

import Reveal from "./Reveal";
import BlurText from "./BlurText";

type Props = {
  eyebrow: string;
  title: string;
  className?: string;
};

export default function SectionHeading({ eyebrow, title, className }: Props) {
  return (
    <div className={className}>
      <Reveal y={16}>
        <span className="eyebrow">{eyebrow}</span>
      </Reveal>
      <BlurText
        as="h2"
        text={title}
        stagger={0.025}
        className="mt-5 max-w-3xl font-display text-[clamp(1.9rem,5vw,3.4rem)] font-semibold leading-[1.04] tracking-tightest text-text"
      />
    </div>
  );
}
