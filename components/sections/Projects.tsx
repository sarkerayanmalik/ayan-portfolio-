"use client";

import SectionHeading from "@/components/ui/SectionHeading";
import OrbitalTimeline from "@/components/ui/OrbitalTimeline";

export default function Projects() {
  return (
    <section
      id="projects"
      className="field-readable shell relative z-10 scroll-mt-24 py-28 md:py-36"
    >
      <SectionHeading
        eyebrow="03 — Projects"
        title="Builds that turned theory into running systems."
      />

      <OrbitalTimeline />
    </section>
  );
}
