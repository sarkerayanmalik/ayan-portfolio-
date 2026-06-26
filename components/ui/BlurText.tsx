"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ElementType } from "react";

type Props = {
  text: string;
  className?: string;
  /** seconds before the first segment starts */
  delay?: number;
  /** seconds between each segment */
  stagger?: number;
  as?: ElementType;
  /** play on mount (hero) or when scrolled into view (headings) */
  trigger?: "mount" | "inView";
  once?: boolean;
  /** animate each letter (default) or whole words as single units */
  animateBy?: "letters" | "words";
  /** which side the segments fade in from (default rises from below) */
  from?: "below" | "above";
  /** class applied to every animated segment (e.g. a gradient text fill) */
  segmentClassName?: string;
};

const container = (delay: number, stagger: number): Variants => ({
  hidden: {},
  show: {
    transition: { staggerChildren: stagger, delayChildren: delay },
  },
});

// directional fade + rise. Uses only opacity + transform (compositor-friendly)
// so per-letter reveals stay smooth on mobile — animating filter:blur across
// dozens of glyphs was the cause of the text-load jank.
const makeSegment = (from: "below" | "above"): Variants => ({
  hidden: { opacity: 0, y: from === "above" ? "-0.5em" : "0.5em" },
  show: {
    opacity: 1,
    y: "0em",
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
});

export default function BlurText({
  text,
  className,
  delay = 0,
  stagger = 0.04,
  as = "span",
  trigger = "inView",
  once = true,
  animateBy = "letters",
  from = "below",
  segmentClassName,
}: Props) {
  const reduce = useReducedMotion();
  const segment = makeSegment(from);
  // motion is a proxy: motion.h2 / motion.span etc. Index it for a dynamic tag.
  const MotionTag = (motion as unknown as Record<string, ElementType>)[
    as as string
  ];
  const words = text.split(" ");

  // Respect prefers-reduced-motion: render the text sharp, no animation.
  if (reduce) {
    const Tag = as as ElementType;
    return (
      <Tag className={[className, segmentClassName].filter(Boolean).join(" ")}>
        {text}
      </Tag>
    );
  }

  const animateProps =
    trigger === "mount"
      ? { animate: "show" as const }
      : {
          whileInView: "show" as const,
          viewport: { once, amount: 0.5 } as const,
        };

  return (
    <MotionTag
      className={className}
      variants={container(delay, stagger)}
      initial="hidden"
      {...animateProps}
      aria-label={text}
    >
      {animateBy === "words"
        ? words.map((word, wi) => (
            <motion.span
              key={wi}
              variants={segment}
              aria-hidden
              className={segmentClassName}
              style={{
                display: "inline-block",
                whiteSpace: "pre",
                willChange: "transform",
              }}
            >
              {word}
              {wi < words.length - 1 ? " " : ""}
            </motion.span>
          ))
        : words.map((word, wi) => (
            <span
              key={wi}
              aria-hidden
              style={{ display: "inline-block", whiteSpace: "nowrap" }}
            >
              {Array.from(word).map((char, ci) => (
                <motion.span
                  key={ci}
                  variants={segment}
                  className={segmentClassName}
                  style={{
                    display: "inline-block",
                    willChange: "transform",
                  }}
                >
                  {char}
                </motion.span>
              ))}
              {wi < words.length - 1 && (
                <span style={{ display: "inline-block", width: "0.28em" }}>
                  &nbsp;
                </span>
              )}
            </span>
          ))}
    </MotionTag>
  );
}
