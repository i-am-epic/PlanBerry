"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useContactModal } from "@/components/providers/ModalProvider";

gsap.registerPlugin(ScrollTrigger);

const footerNav = [
  { label: "Home", href: "#hero" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Stories", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
  { label: "Careers", href: "#" },
];

const socials = [
  {
    label: "Instagram",
    href: "#",
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
    href: "#",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    label: "X",
    href: "#",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "#",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
        <polygon points="9.75,15.02 15.5,11.75 9.75,8.48" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
];

const timezones = [
  { city: "Bangalore", timezone: "Asia/Kolkata", abbr: "IST" },
  { city: "London", timezone: "Europe/London", abbr: "GMT" },
  { city: "Dubai", timezone: "Asia/Dubai", abbr: "GST" },
];

function TimezoneClock({ city, timezone, abbr }: { city: string; timezone: string; abbr: string }) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const local = new Date(now.toLocaleString("en-US", { timeZone: timezone }));
      setTime(
        `${local.getHours().toString().padStart(2, "0")}:${local.getMinutes().toString().padStart(2, "0")}:${local.getSeconds().toString().padStart(2, "0")}`
      );
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [timezone]);

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs uppercase tracking-[0.1em] text-[#666]" style={{ fontFamily: "var(--font-body)", fontWeight: 400 }}>
        {city}
      </span>
      <div className="flex items-center gap-2">
        <span className="font-mono text-sm tracking-widest tabular-nums text-[#999]" style={{ fontFamily: "var(--font-body)" }}>
          {time || "--:--:--"}
        </span>
        <span className="text-xs text-[#666]">{abbr}</span>
      </div>
    </div>
  );
}

export default function Footer() {
  const { openContact } = useContactModal();
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".footer-col", {
        y: 25,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "expo.out",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
      });
    }, footerRef);
    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={footerRef}
      className="relative border-t border-[rgba(255,255,255,0.1)]"
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
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1.2fr] gap-14 lg:gap-16 xl:gap-24">
          {/* Brand — data-lag staggers each column's inertia for a cascade effect */}
          <div data-lag="0.05" className="footer-col">
            <a href="#hero" className="block mb-8">
              <span className="text-xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                PlanBerry
              </span>
            </a>
            <p
              className="text-sm text-[#999] leading-[1.8] mb-10"
              style={{ fontFamily: "var(--font-body)", fontWeight: 300, maxWidth: "32ch" }}
            >
              Thoughtfully planned events that run seamlessly — from corporate conferences to personal celebrations. Based in Bangalore.
            </p>
            <div className="flex items-center gap-4">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className="w-10 h-10 rounded-full bg-[#202020] flex items-center justify-center text-[#666] hover:text-white hover:bg-[#2a2a2a] transition-all duration-300"
                  aria-label={s.label}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Navigate */}
          <div data-lag="0.1" className="footer-col">
            <h4 className="text-xs uppercase tracking-[0.15em] text-[#666] mb-8" style={{ fontFamily: "var(--font-body)", fontWeight: 500 }}>
              Navigate
            </h4>
            <ul className="space-y-4">
              {footerNav.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-[#999] hover:text-[#f5f5f0] link-hover transition-colors duration-300"
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
            <h4 className="text-xs uppercase tracking-[0.15em] text-[#666] mb-8" style={{ fontFamily: "var(--font-body)", fontWeight: 500 }}>
              Get in Touch
            </h4>
            <ul className="space-y-4">
              <li>
                <button onClick={openContact} className="text-sm text-[#999] hover:text-[#f5f5f0] link-hover transition-colors duration-300 text-left" style={{ fontFamily: "var(--font-body)", fontWeight: 300, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                  hello@planberry.in
                </button>
              </li>
              <li>
                <a href="tel:+918012345678" className="text-sm text-[#999] hover:text-[#f5f5f0] link-hover transition-colors duration-300" style={{ fontFamily: "var(--font-body)", fontWeight: 300 }}>
                  +91 80 1234 5678
                </a>
              </li>
            </ul>
            <div className="mt-12">
              <h4 className="text-xs uppercase tracking-[0.15em] text-[#666] mb-4" style={{ fontFamily: "var(--font-body)", fontWeight: 500 }}>
                Office
              </h4>
              <p className="text-sm text-[#999] leading-[1.8]" style={{ fontFamily: "var(--font-body)", fontWeight: 300 }}>
                Level 12, Prestige Trade Tower,<br />Palace Road, Bangalore<br />Karnataka 560001
              </p>
            </div>
          </div>

          {/* Clocks */}
          <div data-lag="0.2" className="footer-col">
            <h4 className="text-xs uppercase tracking-[0.15em] text-[#666] mb-8" style={{ fontFamily: "var(--font-body)", fontWeight: 500 }}>
              Local Time
            </h4>
            <div className="space-y-7">
              {timezones.map((tz) => (
                <TimezoneClock key={tz.city} {...tz} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="w-full flex flex-col md:flex-row items-center justify-between gap-4 border-t border-[rgba(255,255,255,0.1)]"
        style={{ paddingLeft: "var(--pad-x)", paddingRight: "var(--pad-x)", paddingTop: "2rem", paddingBottom: "2rem" }}
      >
        <p className="text-xs text-[#666]" style={{ fontFamily: "var(--font-body)", fontWeight: 300 }}>
          &copy; {new Date().getFullYear()} PlanBerry Events Pvt. Ltd. All rights reserved.
        </p>
        <div className="flex items-center gap-6">
          <a href="#" className="text-xs text-[#666] hover:text-[#999] link-hover transition-colors duration-300">Privacy Policy</a>
          <a href="#" className="text-xs text-[#666] hover:text-[#999] link-hover transition-colors duration-300">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
