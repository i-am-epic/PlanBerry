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
        gsap.from(".approach-step", {
          y: 60,
          opacity: 0,
          duration: 0.9,
          stagger: 0.1,
          ease: "expo.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        });

        gsap.from(".approach-rule", {
          scaleX: 0,
          transformOrigin: "left center",
          duration: 1.4,
          stagger: 0.1,
          ease: "expo.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
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
      id="approach"
      className="pb-section relative"
      style={{ padding: "clamp(6rem, 12vh, 9rem) 0", background: "#080808" }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-[1px]"
        style={{ background: "rgba(255,255,255,0.07)" }}
      />
      <div
        className="w-full"
        style={{ paddingLeft: "var(--pad-x)", paddingRight: "var(--pad-x)" }}
      >
        <div style={{ marginBottom: "clamp(3rem, 6vh, 5rem)" }}>
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
            Our Approach
          </span>
          <h2
            className="text-white"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              fontSize: "clamp(2rem, 4vw, 4.25rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              maxWidth: "18ch",
              fontVariationSettings: "'SOFT' 50, 'WONK' 1",
            }}
          >
            Structured.{" "}
            <span
              className="italic"
              style={{ fontVariationSettings: "'SOFT' 100, 'WONK' 1" }}
            >
              Transparent.
            </span>{" "}
            Seamless from start to finish.
          </h2>
        </div>

        <div className="flex flex-col">
          {approach.map((step) => (
            <div
              key={step.number}
              className="approach-step group grid grid-cols-[auto_1fr] lg:grid-cols-[auto_1.2fr_1.8fr] gap-6 md:gap-12 items-baseline py-10 cursor-default"
              style={{ position: "relative" }}
            >
              <div
                className="approach-rule absolute top-0 left-0 right-0 h-[1px]"
                style={{ background: "rgba(255,255,255,0.1)" }}
              />
              {/* Hover accent sweep */}
              <span
                aria-hidden
                className="absolute top-0 left-0 h-[1px] w-full origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-[900ms]"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(245,245,240,0.85) 0%, rgba(245,245,240,0) 100%)",
                  transitionTimingFunction: "var(--ease-out-expo)",
                }}
              />
              <span
                className="text-white/25 transition-all duration-700 group-hover:text-white/60 group-hover:translate-x-[-4px]"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 400,
                  fontSize: "clamp(1.4rem, 2vw, 1.9rem)",
                  fontVariationSettings: "'SOFT' 100, 'WONK' 1",
                  fontStyle: "italic",
                  transitionTimingFunction: "var(--ease-out-expo)",
                }}
              >
                {step.number}
              </span>
              <h3
                className="text-white transition-transform duration-700 group-hover:translate-x-1"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 400,
                  fontSize: "clamp(1.35rem, 2.1vw, 2rem)",
                  letterSpacing: "-0.01em",
                  lineHeight: 1.15,
                  fontVariationSettings: "'SOFT' 50, 'WONK' 0",
                  transitionTimingFunction: "var(--ease-out-expo)",
                }}
              >
                {step.title}
              </h3>
              <p
                className="col-span-2 lg:col-span-1 transition-colors duration-700 group-hover:text-[rgba(255,255,255,0.75)]"
                style={{
                  fontFamily: "var(--font-body)",
                  fontWeight: 300,
                  fontSize: "clamp(0.9rem, 1vw, 1.02rem)",
                  lineHeight: 1.8,
                  color: "rgba(255,255,255,0.55)",
                  maxWidth: "52ch",
                }}
              >
                {step.description}
              </p>
            </div>
          ))}
          <div
            className="approach-rule h-[1px]"
            style={{ background: "rgba(255,255,255,0.1)" }}
          />
        </div>
      </div>
    </section>
  );
}
