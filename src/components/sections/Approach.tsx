"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { approach } from "@/data/approach";

gsap.registerPlugin(ScrollTrigger);

export default function Approach() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(".approach-head",
          { y: 20, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.7, ease: "expo.out",
            immediateRender: false,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 90%",
              toggleActions: "play none none none",
              once: true,
            },
          }
        );

        gsap.fromTo(".approach-card",
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.8, stagger: 0.08, ease: "expo.out",
            immediateRender: false,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
              once: true,
            },
          }
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="approach"
      className="panel pb-section relative"
      style={{ paddingBottom: "clamp(2rem, 4vh, 3rem)", background: "var(--bg-primary)" }}
    >
      <div
        className="w-full"
        style={{ paddingLeft: "var(--pad-x)", paddingRight: "var(--pad-x)" }}
      >
        {/* Header */}
        <div className="approach-head" style={{ marginBottom: "clamp(2rem, 4vh, 3.5rem)" }}>
          <span
            className="block"
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 400,
              fontSize: "0.7rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
              marginBottom: "1.25rem",
            }}
          >
            Our Approach
          </span>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              fontSize: "clamp(1.8rem, 3.4vw, 3.2rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              maxWidth: "18ch",
              fontVariationSettings: "'SOFT' 50, 'WONK' 1",
              color: "var(--accent-cream)",
            }}
          >
            Structured.{" "}
            <span
              className="italic"
              style={{ fontVariationSettings: "'SOFT' 100, 'WONK' 1" }}
            >
              Transparent.
            </span>{" "}
            Seamless.
          </h2>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {approach.map((step) => (
            <div
              key={step.number}
              className="approach-card group relative rounded-[10px] flex flex-col transition-all duration-500"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-subtle)",
                padding: "clamp(1.75rem, 2.5vw, 2.25rem)",
              }}
            >
              {/* Number */}
              <span
                className="block mb-4 transition-colors duration-500 group-hover:text-[var(--accent-gold)]"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 400,
                  fontSize: "clamp(2rem, 2.5vw, 2.8rem)",
                  fontVariationSettings: "'SOFT' 100, 'WONK' 1",
                  fontStyle: "italic",
                  color: "rgba(218, 216, 204, 0.15)",
                  lineHeight: 1,
                }}
              >
                {step.number}
              </span>

              {/* Title */}
              <h3
                className="mb-3 transition-colors duration-500 group-hover:text-[var(--accent-cream)]"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 400,
                  fontSize: "clamp(1.05rem, 1.2vw, 1.2rem)",
                  letterSpacing: "-0.01em",
                  lineHeight: 1.2,
                  fontVariationSettings: "'SOFT' 50, 'WONK' 0",
                  color: "var(--accent-cream-dim)",
                }}
              >
                {step.title}
              </h3>

              {/* Description */}
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontWeight: 300,
                  fontSize: "0.82rem",
                  lineHeight: 1.7,
                  color: "var(--text-secondary)",
                }}
              >
                {step.description}
              </p>

              {/* Hover accent line at bottom */}
              <div
                className="absolute bottom-0 left-0 right-0 h-[2px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700"
                style={{
                  background: "var(--accent-gold)",
                  borderRadius: "0 0 8px 8px",
                  transitionTimingFunction: "var(--ease-out-expo)",
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
