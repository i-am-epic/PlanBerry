"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const principles = [
  {
    number: "Our Vision",
    title: "A trusted event partner.",
    text: "To transform ideas into meaningful and memorable experiences through creativity, excellence, and integrity — in every corporate event and every wedding we deliver.",
  },
  {
    number: "Our Mission",
    title: "Effortless from start to finish.",
    text: "To plan and execute events that run seamlessly. By combining strategic thinking with creative execution, we ensure every event exceeds expectations — so our clients enjoy a stress-free, unforgettable experience.",
  },
  {
    number: "Our Promise",
    title: "Seamless. Elegant. Unforgettable.",
    text: "Whether it's a high-impact corporate event or a once-in-a-lifetime wedding, Planberry Events delivers experiences that are seamless, elegant, and unforgettable.",
  },
];

export default function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Label + heading clip-path entrance
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      });

      tl.from(labelRef.current, { y: 18, opacity: 0, duration: 0.6, ease: "expo.out" })
        .fromTo(
          headingRef.current,
          { clipPath: "inset(100% 0 0 0)", y: 20 },
          { clipPath: "inset(0% 0 0 0)", y: 0, duration: 1.1, ease: "expo.out" },
          "-=0.2"
        );

      // Divider line draws left-to-right, scrubbed to scroll progress
      gsap.fromTo(
        lineRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: lineRef.current,
            start: "top 85%",
            end: "top 40%",
            scrub: 1.5,
          },
        }
      );

      // Principles stagger in — each card slightly offset
      gsap.fromTo(".manifesto-principle",
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1, stagger: 0.14, ease: "expo.out",
          immediateRender: false,
          scrollTrigger: {
            trigger: ".manifesto-principles",
            start: "top 90%",
            toggleActions: "play none none none",
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="panel relative overflow-hidden"
      style={{ background: "var(--bg-primary)", justifyContent: "flex-start" }}
    >
      <div className="w-full" style={{ paddingLeft: "var(--pad-x)", paddingRight: "var(--pad-x)" }}>
        {/* data-speed: heading block drifts slower than principles grid for depth */}
        <div data-speed="0.9" className="mb-16 md:mb-20 md:max-w-[60%]">
          <span
            ref={labelRef}
            className="text-xs uppercase tracking-[0.2em] mb-8 block"
            style={{ fontFamily: "var(--font-body)", fontWeight: 400, color: "var(--text-muted)" }}
          >
            Our Philosophy
          </span>
          <h2
            ref={headingRef}
            className="leading-[1.1] tracking-tight"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              fontSize: "clamp(2.2rem, 4.5vw, 5rem)",
              fontVariationSettings: "'SOFT' 50, 'WONK' 1",
            }}
          >
            Every event has a story to tell.{" "}
            <span className="italic" style={{ fontVariationSettings: "'SOFT' 100, 'WONK' 1" }}>
              We help you
            </span>{" "}
            tell it right.
          </h2>
        </div>

        <div ref={lineRef} className="h-[1px] w-full origin-left mb-14 md:mb-16" style={{ background: "var(--border-subtle)" }} />

        <div className="manifesto-principles grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 lg:gap-16">
          {principles.map((p) => (
            <div key={p.number} className="manifesto-principle group">
              <span className="text-[11px] tracking-[0.15em] uppercase block mb-5" style={{ fontFamily: "var(--font-body)", fontWeight: 500, color: "var(--text-muted)" }}>
                {p.number}
              </span>
              <h3
                className="text-lg md:text-xl mb-4 tracking-tight transition-colors duration-500"
                style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontVariationSettings: "'SOFT' 50, 'WONK' 1", color: "var(--accent-cream)" }}
              >
                {p.title}
              </h3>
              <p className="text-sm leading-[1.8]" style={{ fontFamily: "var(--font-body)", fontWeight: 300, color: "var(--text-secondary)" }}>
                {p.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
