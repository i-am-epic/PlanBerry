"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { mediaProduction } from "@/data/services";

gsap.registerPlugin(ScrollTrigger);

export default function MediaProductionSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(".mp-head",
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

        gsap.fromTo(".mp-card",
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
      id="media-production"
      className="panel pb-section relative"
      style={{ background: "var(--bg-primary)", justifyContent: "flex-start" }}
    >
      <div
        className="w-full"
        style={{ paddingLeft: "var(--pad-x)", paddingRight: "var(--pad-x)" }}
      >
        {/* Header */}
        <div
          className="mp-head grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-8 lg:gap-16"
          style={{ marginBottom: "clamp(2rem, 4vh, 3.5rem)" }}
        >
          <div>
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
              Media & Production
            </span>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 400,
                fontSize: "clamp(1.8rem, 3.2vw, 3rem)",
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                fontVariationSettings: "'SOFT' 50, 'WONK' 1",
                color: "var(--accent-cream)",
              }}
            >
              Every technical{" "}
              <span
                className="italic"
                style={{ fontVariationSettings: "'SOFT' 100, 'WONK' 1" }}
              >
                detail
              </span>
              , handled.
            </h2>
          </div>
          <p
            className="hidden lg:block"
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 300,
              fontSize: "clamp(0.9rem, 1vw, 1rem)",
              lineHeight: 1.8,
              color: "var(--text-secondary)",
              maxWidth: "52ch",
              alignSelf: "end",
            }}
          >
            AV, stage, photography, and entertainment — production is where concepts become
            experiences. Our in-house team covers every pillar so nothing falls through the cracks.
          </p>
        </div>

        {/* Grid of cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {mediaProduction.map((pillar) => (
            <div
              key={pillar.id}
              className="mp-card group rounded-[10px] transition-all duration-500"
              style={{
                padding: "clamp(1.85rem, 2.8vw, 2.5rem)",
                background: "var(--bg-card)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <h3
                className="transition-colors duration-500 group-hover:text-[var(--accent-cream)]"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 400,
                  fontSize: "clamp(1.15rem, 1.5vw, 1.4rem)",
                  letterSpacing: "-0.01em",
                  marginBottom: "0.75rem",
                  fontVariationSettings: "'SOFT' 50, 'WONK' 0",
                  color: "var(--accent-cream-dim)",
                }}
              >
                {pillar.title}
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontWeight: 300,
                  fontSize: "0.88rem",
                  lineHeight: 1.7,
                  color: "var(--text-secondary)",
                  maxWidth: "44ch",
                  marginBottom: "1.25rem",
                }}
              >
                {pillar.summary}
              </p>
              <ul className="space-y-2">
                {pillar.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5"
                    style={{
                      fontFamily: "var(--font-body)",
                      fontWeight: 400,
                      fontSize: "0.82rem",
                      letterSpacing: "0.01em",
                      color: "var(--text-secondary)",
                    }}
                  >
                    <span
                      className="inline-block shrink-0"
                      style={{
                        width: "4px",
                        height: "4px",
                        borderRadius: "50%",
                        background: "var(--accent-gold)",
                        marginTop: "0.5rem",
                        opacity: 0.6,
                      }}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
