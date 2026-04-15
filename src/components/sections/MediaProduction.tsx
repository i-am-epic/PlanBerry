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
        gsap.from(".mp-card", {
          y: 50,
          opacity: 0,
          duration: 0.9,
          stagger: 0.1,
          ease: "expo.out",
          scrollTrigger: {
            trigger: sectionRef.current,
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
      id="media-production"
      className="pb-section relative"
      style={{ padding: "clamp(6rem, 11vh, 9rem) 0", background: "#0a0a0a" }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-[1px]"
        style={{ background: "rgba(255,255,255,0.07)" }}
      />
      <div
        className="w-full"
        style={{ paddingLeft: "var(--pad-x)", paddingRight: "var(--pad-x)" }}
      >
        <div
          className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-10 lg:gap-20"
          style={{ marginBottom: "clamp(3rem, 6vh, 5rem)" }}
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
                color: "#555",
                marginBottom: "1.25rem",
              }}
            >
              Media & Production
            </span>
            <h2
              className="text-white"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 400,
                fontSize: "clamp(2rem, 3.6vw, 3.5rem)",
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                fontVariationSettings: "'SOFT' 50, 'WONK' 1",
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
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 300,
              fontSize: "clamp(0.95rem, 1.05vw, 1.08rem)",
              lineHeight: 1.85,
              color: "rgba(255,255,255,0.55)",
              maxWidth: "54ch",
              alignSelf: "end",
            }}
          >
            AV, stage, photography, and entertainment — production is where concepts become
            experiences. Our in-house team covers every pillar so nothing falls through the cracks
            and the brief stays intact from kickoff to curtain.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-[rgba(255,255,255,0.07)]">
          {mediaProduction.map((pillar) => (
            <div
              key={pillar.id}
              className="mp-card"
              style={{
                padding: "clamp(2rem, 3.5vw, 3rem)",
                background: "#0a0a0a",
              }}
            >
              <h3
                className="text-white"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 400,
                  fontSize: "clamp(1.3rem, 1.9vw, 1.75rem)",
                  letterSpacing: "-0.01em",
                  marginBottom: "1rem",
                  fontVariationSettings: "'SOFT' 50, 'WONK' 0",
                }}
              >
                {pillar.title}
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontWeight: 300,
                  fontSize: "0.95rem",
                  lineHeight: 1.75,
                  color: "rgba(255,255,255,0.55)",
                  maxWidth: "46ch",
                  marginBottom: "1.75rem",
                }}
              >
                {pillar.summary}
              </p>
              <ul className="space-y-2.5">
                {pillar.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3"
                    style={{
                      fontFamily: "var(--font-body)",
                      fontWeight: 400,
                      fontSize: "0.88rem",
                      letterSpacing: "0.01em",
                      color: "rgba(255,255,255,0.7)",
                    }}
                  >
                    <span
                      className="inline-block"
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background: "rgba(255,255,255,0.3)",
                        marginTop: "0.5rem",
                        flexShrink: 0,
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
