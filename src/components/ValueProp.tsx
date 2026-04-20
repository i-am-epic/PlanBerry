"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ValueProp() {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const paraRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });

      tl.from(labelRef.current, { y: 20, opacity: 0, duration: 0.6, ease: "expo.out" })
        .from(headingRef.current, { y: 35, opacity: 0, duration: 1, ease: "expo.out" }, "-=0.3")
        .from(paraRef.current, { y: 20, opacity: 0, duration: 0.8, ease: "expo.out" }, "-=0.5");
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="valueprop"
      className="panel relative flex items-center justify-center overflow-hidden"
      style={{ height: "100dvh", minHeight: 600 }}
    >
      {/* data-speed: content drifts slightly slower than scroll = depth / floating feel */}
      <div data-speed="0.92" className="section-center pad-x">
        <span
          ref={labelRef}
          style={{
            fontFamily: "var(--font-body)",
            fontWeight: 400,
            fontSize: "0.72rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#666",
            display: "block",
            marginBottom: "2.5rem",
          }}
        >
          Who We Are
        </span>
        <h2
          ref={headingRef}
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 400,
            fontSize: "clamp(2.2rem, 4.5vw, 4.5rem)",
            fontVariationSettings: "'SOFT' 50, 'WONK' 1",
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
            maxWidth: "26ch",
            marginBottom: "2.5rem",
            textAlign: "center",
          }}
        >
          At Planberry Events, every event has a story to tell — corporate
          experiences and wedding{" "}
          <span className="italic" style={{ fontVariationSettings: "'SOFT' 100, 'WONK' 1" }}>
            celebrations
          </span>{" "}
          designed with purpose.
        </h2>
        <p
          ref={paraRef}
          style={{
            fontFamily: "var(--font-body)",
            fontWeight: 300,
            fontSize: "clamp(0.9rem, 1.1vw, 1.1rem)",
            color: "rgba(255,255,255,0.6)",
            lineHeight: 1.8,
            maxWidth: "48ch",
            textAlign: "center",
          }}
        >
          We don&apos;t just organize events — we design experiences that reflect
          your purpose, your people, and your vision, delivered with creativity,
          precision, and professionalism.
        </p>
      </div>
    </section>
  );
}
