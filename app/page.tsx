import Background from "@/components/scene/Background";
import Nav from "@/components/layout/Nav";
import IntroOverlay from "@/components/sections/IntroOverlay";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Experience from "@/components/sections/Experience";
import Projects from "@/components/sections/Projects";
import Skills from "@/components/sections/Skills";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      {/* Atmosphere layers (fixed, behind content) */}
      <div className="atmosphere" aria-hidden />
      <Background />
      <div className="field-scrim" aria-hidden />
      <div className="vignette" aria-hidden />
      <div className="grain" aria-hidden />

      <IntroOverlay />
      <Nav />

      <main className="relative z-10">
        <Hero />
        <div className="shell hairline" />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Contact />
      </main>
    </>
  );
}
