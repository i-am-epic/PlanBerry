"use client";

import { useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    quote:
      "PlanBerry didn't just plan our product launch — they created a theatrical experience that had the tech press talking for weeks. The attention to detail was otherworldly.",
    name: "Priya Sharma",
    title: "Series A, TechFlow",
  },
  {
    quote:
      "Our wedding felt like stepping into a dream we never knew we had. Every flower, every light, every note of music was placed with intention. 11 out of 10.",
    name: "Arjun & Meera Reddy",
    title: "Wedding, December 2025",
  },
  {
    quote:
      "They transformed our annual gala from a routine corporate dinner into an immersive journey through our company's history. Standing ovation from 2,000 guests.",
    name: "Vikram Mehta",
    title: "CEO, Meridian Group",
  },
];

// ─── Tilt card ────────────────────────────────────────────────────────────────

function TiltCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const isTouch =
    typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;

  const onMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isTouch) return;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const rx = ((e.clientY - rect.top - rect.height / 2) / rect.height) * -3;
      const ry = ((e.clientX - rect.left - rect.width / 2) / rect.width) * 3;
      gsap.to(el, {
        rotateX: rx,
        rotateY: ry,
        duration: 0.35,
        ease: "power2.out",
        transformPerspective: 800,
      });
    },
    [isTouch]
  );

  const onLeave = useCallback(() => {
    if (isTouch) return;
    if (ref.current)
      gsap.to(ref.current, { rotateX: 0, rotateY: 0, duration: 0.5, ease: "power2.out" });
  }, [isTouch]);

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ transformStyle: isTouch ? "flat" : "preserve-3d" }}
    >
      {children}
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const section = sectionRef.current;
      const track = trackRef.current;
      if (!section || !track) return;

      // Label entrance (same on mobile + desktop)
      gsap.from(".testimonials-label", {
        y: 15,
        opacity: 0,
        duration: 0.6,
        ease: "expo.out",
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });

      const mm = gsap.matchMedia();

      // ── Desktop: horizontal pin scroll ────────────────────────────────────
      mm.add("(min-width: 768px)", () => {
        const getScrollDist = () => track.scrollWidth - window.innerWidth;

        gsap.to(track, {
          x: () => -getScrollDist(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            pin: true,
            scrub: 1,
            start: "top top",
            end: () => `+=${getScrollDist()}`,
            invalidateOnRefresh: true,
          },
        });

        // Each card scales up from slightly dim/small as it enters from the right
        Array.from(track.children).forEach((child, i) => {
          if (i === 0) return; // first card is already in view
          const card = child.querySelector(".testimonial-card") as HTMLElement;
          if (!card) return;
          gsap.fromTo(
            card,
            { opacity: 0.25, scale: 0.94 },
            {
              opacity: 1,
              scale: 1,
              ease: "power2.out",
              scrollTrigger: {
                trigger: section,
                start: `${25 + (i - 1) * 28}% top`,
                end: `${42 + (i - 1) * 28}% top`,
                scrub: 0.8,
              },
            }
          );
        });
      });

      // ── Mobile: vertical stagger ──────────────────────────────────────────
      mm.add("(max-width: 767px)", () => {
        gsap.from(".testimonial-card", {
          y: 40,
          opacity: 0,
          duration: 1,
          stagger: 0.12,
          ease: "expo.out",
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className="relative"
      style={{ background: "#080808" }}
    >
      {/* Section header — stays stationary while cards scroll horizontally */}
      <div
        style={{
          paddingTop: "clamp(6rem, 10vh, 10rem)",
          paddingLeft: "var(--pad-x)",
          paddingBottom: "clamp(2.5rem, 5vh, 4rem)",
        }}
      >
        <span
          className="testimonials-label text-xs uppercase tracking-[0.2em] text-[#666] block"
          style={{ fontFamily: "var(--font-body)", fontWeight: 400 }}
        >
          Client Stories
        </span>
      </div>

      {/*
       * Horizontal track — flex row, no wrap.
       * On desktop: GSAP translates this element left as the section is pinned.
       * On mobile:  it wraps naturally into a vertical stack.
       */}
      <div
        ref={trackRef}
        className="flex md:flex-nowrap flex-wrap gap-6 will-change-transform"
        style={{
          paddingLeft: "var(--pad-x)",
          paddingRight: "var(--pad-x)",
          paddingBottom: "clamp(6rem, 10vh, 10rem)",
        }}
      >
        {testimonials.map((t) => (
          <TiltCard key={t.name}>
            <div
              className="testimonial-card rounded-[10px] p-8 md:p-10 lg:p-12 flex flex-col justify-between"
              style={{
                background: "#111",
                /* Fixed card width on desktop so the horizontal distance is predictable */
                width: "clamp(300px, 38vw, 520px)",
                flexShrink: 0,
                minHeight: "340px",
              }}
            >
              <blockquote
                className="text-base md:text-lg leading-[1.8] mb-10 text-white"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 400,
                  fontStyle: "italic",
                  fontVariationSettings: "'SOFT' 80, 'WONK' 1",
                }}
              >
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              <div>
                <p
                  className="text-sm text-[#f5f5f0]"
                  style={{ fontFamily: "var(--font-body)", fontWeight: 500 }}
                >
                  {t.name}
                </p>
                <p
                  className="text-xs text-[#666] mt-1.5"
                  style={{ fontFamily: "var(--font-body)", fontWeight: 300 }}
                >
                  {t.title}
                </p>
              </div>
            </div>
          </TiltCard>
        ))}
      </div>
    </section>
  );
}
