"use client";

import { useState, useEffect, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { useContactModal } from "@/components/providers/ModalProvider";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "Approach", href: "#approach" },
  { label: "Work", href: "#work" },
  { label: "Gallery", href: "/gallery" },
  { label: "Stories", href: "#testimonials" },
];

export default function Navbar() {
  const { openContact } = useContactModal();
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      setHidden((e as CustomEvent).detail.hidden);
    };
    window.addEventListener("hero-immersive", handler);
    return () => window.removeEventListener("hero-immersive", handler);
  }, []);

  // Toggle opaque nav once user scrolls past ~70% of the hero viewport height.
  // Keep this lightweight; expensive RAF loops here cause visible jank.
  useEffect(() => {
    const threshold = () => Math.max(window.innerHeight * 0.7, 400);
    const update = () => {
      const y = ScrollSmoother.get()?.scrollTop() ?? window.scrollY;
      setScrolled(y > threshold());
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    ScrollTrigger.addEventListener("refresh", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      ScrollTrigger.removeEventListener("refresh", update);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  const scrollTo = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith("#")) return;
    e.preventDefault();

    if (window.location.pathname !== "/") {
      window.location.assign(`/${href}`);
      return;
    }

    const smoother = ScrollSmoother.get();
    if (smoother) {
      smoother.scrollTo(href, true, "top top");
    } else {
      const el = document.querySelector(href);
      el?.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          hidden ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        style={{
          padding: scrolled ? "16px 0" : "28px 0",
          background: scrolled ? "rgba(20, 30, 28, 0.85)" : "transparent",
          backdropFilter: scrolled ? "blur(14px) saturate(140%)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(14px) saturate(140%)" : "none",
          borderBottom: scrolled ? "1px solid rgba(190,160,84,0.18)" : "1px solid transparent",
        }}
      >
        {/* Inner container */}
        <div
          className="flex items-center justify-between"
          style={{ paddingLeft: "clamp(1.5rem, 7vw, 7rem)", paddingRight: "clamp(1.5rem, 7vw, 7rem)" }}
        >
          {/* Logo */}
          <a href="#hero" onClick={(e) => scrollTo(e, "#hero")} className="flex items-center gap-3 shrink-0">
            <img
              src="/logo.png"
              alt="Planberry Events"
              style={{ width: "clamp(32px, 3vw, 42px)", height: "auto" }}
            />
            <span
              className="hidden sm:inline-block"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.6rem",
                letterSpacing: "0.35em",
                textTransform: "uppercase",
                color: "var(--accent-gold)",
                fontWeight: 500,
              }}
            >
              Events
            </span>
          </a>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-10 lg:gap-14">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => scrollTo(e, link.href)}
                className="link-hover transition-colors duration-300 hover:text-[var(--accent-gold)]"
                style={{
                  color: "rgba(218,216,204,0.75)",
                  fontFamily: "var(--font-body)",
                  fontSize: "clamp(0.9rem, 1vw, 1rem)",
                  fontWeight: 400,
                  letterSpacing: "0.02em",
                }}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA button */}
          <div className="hidden md:flex items-center shrink-0">
            <button
              onClick={openContact}
              className="inline-flex items-center gap-2.5 rounded-full hover:-translate-y-[1px] transition-all duration-300"
              style={{
                fontFamily: "var(--font-body)",
                fontWeight: 600,
                fontSize: "clamp(0.85rem, 0.95vw, 0.95rem)",
                letterSpacing: "0.04em",
                padding: "12px 26px",
                background: "var(--accent-gold)",
                color: "var(--bg-primary)",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 4px 18px rgba(0,0,0,0.25)",
              }}
            >
              Plan my event
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden relative w-11 h-11 flex items-center justify-center z-[60]"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <div className="flex flex-col gap-[5px]">
              <span className={`block w-6 h-[1.5px] bg-[var(--accent-cream)] transition-all duration-500 origin-center ${menuOpen ? "rotate-45 translate-y-[6.5px]" : ""}`} />
              <span className={`block w-6 h-[1.5px] bg-[var(--accent-cream)] transition-all duration-500 ${menuOpen ? "opacity-0 scale-0" : ""}`} />
              <span className={`block w-6 h-[1.5px] bg-[var(--accent-cream)] transition-all duration-500 origin-center ${menuOpen ? "-rotate-45 -translate-y-[6.5px]" : ""}`} />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`menu-overlay fixed inset-0 z-[55] ${menuOpen ? "open" : ""}`} style={{ background: "var(--bg-primary)" }}>
        <div className="flex flex-col items-center justify-center h-full gap-10">
          {navLinks.map((link, i) => (
            <a
              key={link.label}
              href={link.href}
              className="text-3xl font-light tracking-wide hover:text-[var(--accent-gold)] transition-colors duration-300"
              style={{
                color: "var(--accent-cream)",
                fontFamily: "var(--font-display)",
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? "translateY(0)" : "translateY(20px)",
                transition: `all 0.5s var(--ease-out-expo) ${0.1 + i * 0.08}s`,
              }}
              onClick={(e) => {
                setMenuOpen(false);
                scrollTo(e, link.href);
              }}
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={() => { setMenuOpen(false); openContact(); }}
            className="mt-4 inline-flex items-center gap-2.5 px-8 py-4 rounded-full text-base"
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 600,
              background: "var(--accent-gold)",
              color: "var(--bg-primary)",
              border: "none",
              cursor: "pointer",
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? "translateY(0)" : "translateY(20px)",
              transition: "all 0.5s var(--ease-out-expo) 0.4s",
            }}
          >
            Plan my event
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
