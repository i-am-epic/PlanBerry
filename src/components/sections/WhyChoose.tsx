"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { whyChoose } from "@/data/whyChoose";

gsap.registerPlugin(ScrollTrigger);

export default function WhyChoose() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".why-row", {
          y: 40,
          opacity: 0,
          duration: 0.9,
          stagger: 0.08,
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
      id="why"
      className="pb-section relative"
      style={{ padding: "clamp(5rem, 10vh, 8rem) 0", background: "#080808" }}
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
          className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-12 lg:gap-24"
          style={{ marginBottom: "clamp(2.5rem, 5vh, 4rem)" }}
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
                marginBottom: "1.5rem",
              }}
            >
              Why Planberry
            </span>
            <h2
              className="text-white"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 400,
                fontSize: "clamp(2rem, 3.8vw, 3.75rem)",
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                fontVariationSettings: "'SOFT' 50, 'WONK' 1",
              }}
            >
              A dependable{" "}
              <span
                className="italic"
                style={{ fontVariationSettings: "'SOFT' 100, 'WONK' 1" }}
              >
                partner
              </span>{" "}
              for events that matter.
            </h2>
          </div>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 300,
              fontSize: "clamp(0.95rem, 1.1vw, 1.1rem)",
              lineHeight: 1.85,
              color: "rgba(255,255,255,0.55)",
              maxWidth: "52ch",
              alignSelf: "end",
            }}
          >
            Successful events are the result of clear planning, disciplined execution, and thoughtful
            attention to every detail. That&apos;s the standard we hold ourselves to — every brief, every time.
          </p>
        </div>

        <div className="flex flex-col">
          {whyChoose.map((item) => (
            <div
              key={item.number}
              className="why-row grid grid-cols-[auto_1fr] md:grid-cols-[auto_1fr_2fr] gap-6 md:gap-12 items-start py-8"
              style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
            >
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.72rem",
                  letterSpacing: "0.15em",
                  color: "#555",
                  marginTop: "0.6rem",
                }}
              >
                {item.number}
              </span>
              <h3
                className="text-white"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 400,
                  fontSize: "clamp(1.3rem, 2vw, 1.8rem)",
                  lineHeight: 1.15,
                  letterSpacing: "-0.01em",
                  fontVariationSettings: "'SOFT' 50, 'WONK' 0",
                }}
              >
                {item.title}
              </h3>
              <p
                className="col-span-2 md:col-span-1"
                style={{
                  fontFamily: "var(--font-body)",
                  fontWeight: 300,
                  fontSize: "clamp(0.88rem, 1vw, 1rem)",
                  lineHeight: 1.8,
                  color: "rgba(255,255,255,0.55)",
                  maxWidth: "52ch",
                }}
              >
                {item.description}
              </p>
            </div>
          ))}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }} />
        </div>
      </div>
    </section>
  );
}
