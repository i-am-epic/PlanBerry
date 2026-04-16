"use client";

import { useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { testimonials as testimonialsData } from "@/data/testimonials";

gsap.registerPlugin(ScrollTrigger);

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
      className="relative overflow-hidden grid content-center"
      style={{ background: "#080808", height: "100dvh", minHeight: 580 }}
    >
      {/* Section label */}
      <div
        className="absolute top-0 left-0 z-10"
        style={{
          paddingTop: "clamp(2rem, 3.5vh, 3rem)",
          paddingLeft: "var(--pad-x)",
        }}
      >
        <span
          className="testimonials-label text-xs uppercase tracking-[0.2em] text-[#666] block"
          style={{ fontFamily: "var(--font-body)", fontWeight: 400 }}
        >
          Client Stories
        </span>
      </div>

      <div
        ref={trackRef}
        className="flex md:flex-nowrap flex-wrap items-center gap-6 md:gap-8 will-change-transform"
        style={{
          paddingLeft: "max(var(--pad-x), calc(50vw - min(17vw, 220px)))",
          paddingRight: "max(var(--pad-x), calc(50vw - min(17vw, 220px)))",
        }}
      >
          {testimonialsData.map((t) => (
            <TiltCard key={t.author}>
              <div
                className="testimonial-card rounded-[10px] p-7 md:p-9 lg:p-10 flex flex-col justify-between"
                style={{
                  background: "#111",
                  border: "1px solid rgba(255,255,255,0.06)",
                  width: "clamp(280px, 34vw, 440px)",
                  flexShrink: 0,
                  minHeight: "300px",
                }}
              >
                <blockquote
                  className="text-[0.95rem] md:text-base leading-[1.8] mb-8 text-white"
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
                    {t.author}
                  </p>
                  <p
                    className="text-xs text-[#666] mt-1"
                    style={{ fontFamily: "var(--font-body)", fontWeight: 300 }}
                  >
                    {t.role}, {t.company}
                  </p>
                </div>
              </div>
            </TiltCard>
          ))}
        </div>
    </section>
  );
}
