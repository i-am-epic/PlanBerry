"use client";

import { useState, useEffect } from "react";

const navLinks = [
  { label: "Corporates", href: "#services" },
  { label: "Celebrations", href: "#portfolio" },
  { label: "Stories", href: "#testimonials" },
];

export default function Navbar({ onCtaClick }: { onCtaClick?: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      setHidden((e as CustomEvent).detail.hidden);
    };
    window.addEventListener("hero-immersive", handler);
    return () => window.removeEventListener("hero-immersive", handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-opacity duration-700 ${
          hidden ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        style={{ padding: "28px 0", background: "transparent" }}
      >
        {/* Inner container */}
        <div
          className="flex items-center justify-between"
          style={{ paddingLeft: "clamp(1.5rem, 7vw, 7rem)", paddingRight: "clamp(1.5rem, 7vw, 7rem)" }}
        >
          {/* Logo */}
          <a href="#hero" className="flex items-center gap-3 shrink-0">
            <span
              className="text-white tracking-tight"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.3rem, 2vw, 1.75rem)",
                fontVariationSettings: "'SOFT' 30, 'WONK' 0",
              }}
            >
              planberry
            </span>
            <div className="flex gap-[3px] opacity-50 mt-[2px]">
              <div className="w-[2.5px] h-5 bg-white rounded-sm" />
              <div className="w-[2.5px] h-5 bg-white rounded-sm" />
              <div className="w-[2.5px] h-5 bg-white rounded-sm" />
            </div>
          </a>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-10 lg:gap-14">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="link-hover text-[rgba(255,255,255,0.65)] hover:text-white transition-colors duration-300"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "clamp(0.9rem, 1vw, 1.05rem)",
                  fontWeight: 400,
                  letterSpacing: "0.01em",
                }}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA button */}
          <div className="hidden md:flex items-center shrink-0">
            <button
              onClick={onCtaClick}
              className="inline-flex items-center gap-2.5 rounded-full bg-[#f5f5f0] text-[#080808] hover:bg-white hover:-translate-y-[1px] transition-all duration-300"
              style={{
                fontFamily: "var(--font-body)",
                fontWeight: 500,
                fontSize: "clamp(0.85rem, 0.95vw, 1rem)",
                letterSpacing: "0.01em",
                padding: "clamp(0.6rem, 0.8vw, 0.875rem) clamp(1.25rem, 1.8vw, 2rem)",
                border: "none",
                cursor: "pointer",
              }}
            >
              Build the future
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
              <span className={`block w-6 h-[1.5px] bg-white transition-all duration-500 origin-center ${menuOpen ? "rotate-45 translate-y-[6.5px]" : ""}`} />
              <span className={`block w-6 h-[1.5px] bg-white transition-all duration-500 ${menuOpen ? "opacity-0 scale-0" : ""}`} />
              <span className={`block w-6 h-[1.5px] bg-white transition-all duration-500 origin-center ${menuOpen ? "-rotate-45 -translate-y-[6.5px]" : ""}`} />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`menu-overlay fixed inset-0 z-[55] bg-[#0a0a0a] ${menuOpen ? "open" : ""}`}>
        <div className="flex flex-col items-center justify-center h-full gap-10">
          {navLinks.map((link, i) => (
            <a
              key={link.label}
              href={link.href}
              className="text-3xl font-light tracking-wide text-[#f5f5f0] hover:text-white transition-colors duration-300"
              style={{
                fontFamily: "var(--font-display)",
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? "translateY(0)" : "translateY(20px)",
                transition: `all 0.5s var(--ease-out-expo) ${0.1 + i * 0.08}s`,
              }}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={() => { setMenuOpen(false); onCtaClick?.(); }}
            className="mt-4 inline-flex items-center gap-2.5 px-8 py-4 rounded-full text-base bg-[#f5f5f0] text-[#080808]"
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 500,
              border: "none",
              cursor: "pointer",
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? "translateY(0)" : "translateY(20px)",
              transition: "all 0.5s var(--ease-out-expo) 0.4s",
            }}
          >
            Build the future
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
