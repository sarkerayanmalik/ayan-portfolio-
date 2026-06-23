"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Download } from "lucide-react";
import { siteConfig } from "@/lib/siteConfig";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // scroll-spy
  useEffect(() => {
    const ids = siteConfig.nav.map((n) => n.href.slice(1));
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "border-b border-white/[0.06] bg-ink/70 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <nav className="shell flex h-16 items-center justify-between md:h-[4.6rem]">
          <a
            href="#home"
            aria-label="Ayan Malik — home"
            className="flex items-center gap-2.5"
          >
            <Image
              src="/monogram.svg"
              alt=""
              width={34}
              height={34}
              className="h-[34px] w-[34px]"
              priority
            />
            <span className="hidden font-display text-sm font-semibold tracking-wide text-text sm:inline">
              Ayan<span className="text-muted"> Malik</span>
            </span>
          </a>

          <div className="hidden items-center gap-8 md:flex">
            <ul className="flex items-center gap-7 font-mono text-[0.72rem] uppercase tracking-[0.16em]">
              {siteConfig.nav.map((item) => {
                const id = item.href.slice(1);
                const on = active === id;
                return (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className={`relative transition-colors duration-300 hover:text-text ${
                        on ? "text-text" : "text-muted"
                      }`}
                    >
                      {item.label}
                      <span
                        className={`absolute -bottom-1.5 left-0 h-px bg-accent transition-all duration-300 ${
                          on ? "w-full" : "w-0"
                        }`}
                      />
                    </a>
                  </li>
                );
              })}
            </ul>
            <a
              href={siteConfig.cvPath}
              download
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-text transition-colors duration-300 hover:border-accent/60 hover:bg-accent/[0.08]"
            >
              <Download size={13} /> CV
            </a>
          </div>

          <button
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen(true)}
            className="grid h-10 w-10 place-items-center rounded-lg text-text md:hidden"
          >
            <Menu size={22} />
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-ink/80 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.aside
              className="absolute right-0 top-0 flex h-full w-[78%] max-w-xs flex-col border-l border-white/[0.07] bg-navy/95 px-7 py-6 backdrop-blur-2xl"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mb-10 flex items-center justify-between">
                <Image src="/monogram.svg" alt="" width={32} height={32} />
                <button
                  aria-label="Close menu"
                  onClick={() => setOpen(false)}
                  className="grid h-10 w-10 place-items-center rounded-lg text-text"
                >
                  <X size={22} />
                </button>
              </div>
              <ul className="flex flex-col gap-1">
                {siteConfig.nav.map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                  >
                    <a
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="block border-b border-white/[0.05] py-4 font-display text-2xl text-text"
                    >
                      <span className="mr-3 font-mono text-xs text-accent">
                        0{i + 1}
                      </span>
                      {item.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
              <a
                href={siteConfig.cvPath}
                download
                onClick={() => setOpen(false)}
                className="mt-auto inline-flex items-center justify-center gap-2 rounded-full bg-accent px-5 py-3.5 font-mono text-[0.74rem] uppercase tracking-[0.16em] text-[#04121f]"
              >
                <Download size={15} /> Download CV
              </a>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
