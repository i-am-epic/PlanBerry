"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const principles = [
  {
    number: "01",
    title: "Obsessive Craft",
    text: "The angle of a spotlight, the weight of stationery, the scent that lingers in a room — we obsess over invisible details so your guests feel something they can't quite name.",
  },
  {
    number: "02",
    title: "Cultural Fluency",
    text: "From heritage weddings to global product launches, we move between worlds — tech, tradition, art, commerce — with equal confidence and deep respect for what each demands.",
  },
  {
    number: "03",
    title: "Radical Collaboration",
    text: "Your story is the north star. We bring the network, the production craft, and years of experience transforming ambitious visions into living, breathing reality.",
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
      gsap.from(".manifesto-principle", {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.14,
        ease: "expo.out",
        scrollTrigger: {
          trigger: ".manifesto-principles",
          start: "top 82%",
          toggleActions: "play none none reverse",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative overflow-hidden"
      style={{ padding: "clamp(6rem, 10vh, 10rem) 0", background: "#080808" }}
    >
      <div className="w-full" style={{ paddingLeft: "var(--pad-x)", paddingRight: "var(--pad-x)" }}>
        {/* data-speed: heading block drifts slower than principles grid for depth */}
        <div data-speed="0.9" className="mb-16 md:mb-20 md:max-w-[60%]">
          <span
            ref={labelRef}
            className="text-xs uppercase tracking-[0.2em] text-[#666] mb-8 block"
            style={{ fontFamily: "var(--font-body)", fontWeight: 400 }}
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
            Every gathering is a story.{" "}
            <span className="italic" style={{ fontVariationSettings: "'SOFT' 100, 'WONK' 1" }}>
              We write
            </span>{" "}
            the ones worth retelling.
          </h2>
        </div>

        <div ref={lineRef} className="h-[1px] w-full origin-left mb-14 md:mb-16" style={{ background: "rgba(255,255,255,0.1)" }} />

        <div className="manifesto-principles grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 lg:gap-16">
          {principles.map((p) => (
            <div key={p.number} className="manifesto-principle group">
              <span className="text-[11px] text-[#555] tracking-[0.15em] uppercase block mb-5" style={{ fontFamily: "var(--font-body)", fontWeight: 500 }}>
                {p.number}
              </span>
              <h3
                className="text-lg md:text-xl mb-4 tracking-tight text-[#f5f5f0] group-hover:text-white transition-colors duration-500"
                style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontVariationSettings: "'SOFT' 50, 'WONK' 1" }}
              >
                {p.title}
              </h3>
              <p className="text-sm text-[#aaa] leading-[1.8]" style={{ fontFamily: "var(--font-body)", fontWeight: 300 }}>
                {p.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
