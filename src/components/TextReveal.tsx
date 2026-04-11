"use client";

import { useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ─── Constants ────────────────────────────────────────────────────────────────

const WORDS = [
  "We", "don't", "just", "plan", "events.", "We", "architect",
  "moments", "that", "become", "memories,", "engineer", "atmospheres",
  "that", "shift", "perspectives,", "and", "craft", "stories",
  "that", "outlive", "the", "night.",
];

const SCATTER_RADIUS = 220;
const SCATTER_FORCE = 140;

// Background image — replace with your own event photo in /public
// e.g. /images/text-reveal-bg.jpg
const BG_IMAGE_URL =
  "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1920&q=80";

// ─── Component ────────────────────────────────────────────────────────────────

export default function TextReveal() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const isRevealed = useRef(false);
  const isTouch = useRef(false);

  // Detect touch device once
  useEffect(() => {
    isTouch.current = window.matchMedia("(pointer: coarse)").matches;
  }, []);

  // Word reveal animation (staggered opacity on scroll enter)
  useEffect(() => {
    const ctx = gsap.context(() => {
      const wordEls = sectionRef.current?.querySelectorAll(".reveal-word");
      if (!wordEls?.length) return;

      gsap.to(Array.from(wordEls), {
        opacity: 1,
        stagger: 0.055,
        duration: 0.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 55%",
          toggleActions: "play none none none",
          onEnter: () => {
            isRevealed.current = true;
          },
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Background image clip-path widening on scroll
  useEffect(() => {
    const bg = bgRef.current;
    const section = sectionRef.current;
    if (!bg || !section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        bg,
        { clipPath: "inset(0 35% 0 35%)" },
        {
          clipPath: "inset(0 0% 0 0%)",
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "bottom 20%",
            scrub: 1.2,
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  // Scatter physics on mouse move
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (isTouch.current || !isRevealed.current) return;
    const wordEls = sectionRef.current?.querySelectorAll<HTMLElement>(".reveal-word");
    if (!wordEls?.length) return;

    wordEls.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = cx - e.clientX;
      const dy = cy - e.clientY;
      const dist = Math.hypot(dx, dy);

      if (dist < SCATTER_RADIUS) {
        const force = Math.pow(1 - dist / SCATTER_RADIUS, 1.6);
        const angle = Math.atan2(dy, dx);
        // Slight perpendicular randomisation for organic feel
        const perpOffset = (Math.random() - 0.5) * 0.6;
        const pushX = Math.cos(angle + perpOffset) * force * SCATTER_FORCE * (0.6 + Math.random() * 0.8);
        const pushY = Math.sin(angle + perpOffset) * force * SCATTER_FORCE * (0.6 + Math.random() * 0.8);
        const rot = (Math.random() - 0.5) * force * 28;

        gsap.to(el, {
          x: pushX,
          y: pushY,
          rotation: rot,
          opacity: Math.max(0.08, 1 - force * 0.75),
          duration: 0.35,
          ease: "power3.out",
          overwrite: "auto",
        });
      }
    });
  }, []);

  // Elastic spring return on mouse leave
  const handleMouseLeave = useCallback(() => {
    if (isTouch.current || !isRevealed.current) return;
    const wordEls = sectionRef.current?.querySelectorAll<HTMLElement>(".reveal-word");
    if (!wordEls?.length) return;

    wordEls.forEach((el, i) => {
      gsap.to(el, {
        x: 0,
        y: 0,
        rotation: 0,
        opacity: 1,
        duration: 1.5,
        ease: "elastic.out(1.1, 0.45)",
        delay: i * 0.012,
        overwrite: "auto",
      });
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex items-center justify-center overflow-hidden"
      style={{ height: "100vh", minHeight: 600 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* ── Scroll-widening background image ── */}
      <div
        ref={bgRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          clipPath: "inset(0 35% 0 35%)",
          willChange: "clip-path",
          borderRadius: "clamp(0px, 1.5vw, 16px)",
        }}
      >
        {/* Event atmosphere photo */}
        <img
          src={BG_IMAGE_URL}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ userSelect: "none" }}
        />
        {/* Dark scrim so text stays readable at all widths */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(8,8,8,0.78) 0%, rgba(8,8,8,0.68) 50%, rgba(8,8,8,0.82) 100%)",
          }}
        />
      </div>

      {/* ── Text content ── */}
      <div
        className="relative z-10 w-full flex justify-center"
        style={{ paddingLeft: "var(--pad-x)", paddingRight: "var(--pad-x)" }}
      >
        <p
          className="text-center"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 400,
            fontSize: "clamp(1.6rem, 3.2vw, 3.4rem)",
            fontVariationSettings: "'SOFT' 60, 'WONK' 1",
            lineHeight: 1.55,
            maxWidth: "18ch",
          }}
        >
          {WORDS.flatMap((word, i) => {
            const el = (
              <span
                key={i}
                className="reveal-word text-[#f5f5f0]"
                style={{
                  opacity: 0.08,
                  display: "inline-block",
                  willChange: "transform",
                  transformOrigin: "center center",
                }}
              >
                {word}
              </span>
            );
            return i < WORDS.length - 1 ? [el, " "] : [el];
          })}
        </p>
      </div>
    </section>
  );
}
