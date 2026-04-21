"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const footerNav = [
  { label: "Home", href: "/#hero" },
  { label: "Services", href: "/#services" },
  { label: "About", href: "/#about" },
  { label: "Gallery", href: "/gallery" },
  { label: "Stories", href: "/#testimonials" },
  { label: "Contact", href: "/#contact" },
];

const socials = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/planberry_events",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/planberry-events-a18786404",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/share/1HRQxrmcUg/",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.77l-.44 2.89h-2.33v6.99A10 10 0 0 0 22 12z" />
      </svg>
    ),
  },
];

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".footer-col",
        { y: 25, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "expo.out",
          immediateRender: false,
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 95%",
            toggleActions: "play none none none",
            once: true,
          },
        }
      );
    }, footerRef);
    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={footerRef}
      className="relative border-t mt-auto"
      style={{ background: "var(--bg-primary)", borderColor: "var(--border-subtle)" }}
    >
      <div
        className="w-full"
        style={{
          paddingLeft: "var(--pad-x)",
          paddingRight: "var(--pad-x)",
          paddingTop: "clamp(4rem, 8vh, 7rem)",
          paddingBottom: "clamp(4rem, 8vh, 7rem)",
        }}
      >
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1.2fr] gap-14 lg:gap-16 xl:gap-24">
          {/* Brand — data-lag staggers each column's inertia for a cascade effect */}
          <div data-lag="0.05" className="footer-col">
            <a href="#hero" className="block mb-8">
              <img
                src="/logo.png"
                alt="Planberry Events"
                style={{ width: "48px", height: "auto" }}
              />
            </a>
            <p
              className="text-sm leading-[1.8] mb-10"
              style={{ fontFamily: "var(--font-body)", fontWeight: 300, maxWidth: "32ch", color: "var(--text-secondary)" }}
            >
              Crafting experiences. Delivering moments. Full-service event management for corporate experiences and wedding celebrations — based in Bangalore.
            </p>
            <div className="flex items-center gap-4">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
                  style={{ background: "var(--bg-card)", color: "var(--text-muted)" }}
                  aria-label={s.label}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Navigate */}
          <div data-lag="0.1" className="footer-col">
            <h4 className="text-xs uppercase tracking-[0.15em] mb-8" style={{ fontFamily: "var(--font-body)", fontWeight: 500, color: "var(--text-muted)" }}>
              Navigate
            </h4>
            <ul className="space-y-4">
              {footerNav.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent-cream)] link-hover transition-colors duration-300"
                    style={{ fontFamily: "var(--font-body)", fontWeight: 300 }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div data-lag="0.15" className="footer-col">
            <h4 className="text-xs uppercase tracking-[0.15em] mb-8" style={{ fontFamily: "var(--font-body)", fontWeight: 500, color: "var(--text-muted)" }}>
              Get in Touch
            </h4>
            <ul className="space-y-4">
              <li>
                <a href="mailto:contact@planberryevents.com" className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent-cream)] link-hover transition-colors duration-300" style={{ fontFamily: "var(--font-body)", fontWeight: 300 }}>
                  contact@planberryevents.com
                </a>
              </li>
              <li>
                <a href="tel:+918867659549" className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent-cream)] link-hover transition-colors duration-300" style={{ fontFamily: "var(--font-body)", fontWeight: 300 }}>
                  Jayanth &middot; +91 88676 59549
                </a>
              </li>
              <li>
                <a href="tel:+919731737771" className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent-cream)] link-hover transition-colors duration-300" style={{ fontFamily: "var(--font-body)", fontWeight: 300 }}>
                  Revanth &middot; +91 97317 37771
                </a>
              </li>
            </ul>
            <div className="mt-12">
              <h4 className="text-xs uppercase tracking-[0.15em] mb-4" style={{ fontFamily: "var(--font-body)", fontWeight: 500, color: "var(--text-muted)" }}>
                Office
              </h4>
              <p className="text-sm leading-[1.8]" style={{ fontFamily: "var(--font-body)", fontWeight: 300, color: "var(--text-secondary)" }}>
                #211, 4th C Cross, HRBR 3rd Block,<br />Kalyan Nagar, Bangalore<br />Karnataka 560043
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="w-full flex flex-col md:flex-row items-center justify-between gap-4 border-t"
        style={{ paddingLeft: "var(--pad-x)", paddingRight: "var(--pad-x)", paddingTop: "2rem", paddingBottom: "2rem", borderColor: "var(--border-subtle)" }}
      >
        <p className="text-xs" style={{ fontFamily: "var(--font-body)", fontWeight: 300, color: "var(--text-muted)" }}>
          &copy; {new Date().getFullYear()} Planberry Events. All rights reserved.
        </p>
        <div className="flex items-center gap-6">
          <a href="#" className="text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] link-hover transition-colors duration-300">Privacy Policy</a>
          <a href="#" className="text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] link-hover transition-colors duration-300">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
