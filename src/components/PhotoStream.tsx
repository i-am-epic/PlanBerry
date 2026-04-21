"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { photoStreamRow1, photoStreamRow2, photoStreamRow3 } from "@/data/media";

gsap.registerPlugin(ScrollTrigger);

const row1 = photoStreamRow1;
const row2 = photoStreamRow2;
const row3 = photoStreamRow3;

function Row({ images, reverse = false, speed = 40 }: { images: string[]; reverse?: boolean; speed?: number }) {
  return (
    <div className="relative overflow-hidden" style={{ maskImage: "linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)", WebkitMaskImage: "linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)" }}>
      <div
        className="flex gap-4 md:gap-6 w-max"
        style={{
          animation: `photostream-${reverse ? "r" : "l"} ${speed}s linear infinite`,
        }}
      >
        {[...images, ...images].map((src, i) => (
          <div
            key={i}
            className="shrink-0 rounded-[10px] overflow-hidden"
            style={{
              width: "clamp(220px, 28vw, 380px)",
              aspectRatio: "4/5",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt=""
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PhotoStream() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".photostream-head",
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.9, ease: "expo.out",
          immediateRender: false,
          scrollTrigger: {
            trigger: sectionRef.current,
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
      id="photos"
      className="pb-section relative overflow-hidden"
      style={{ minHeight: "200dvh", paddingTop: "clamp(5.5rem, 10vh, 8rem)", paddingBottom: "clamp(4.5rem, 8vh, 7rem)", background: "var(--bg-primary)" }}
    >
      <style>{`
        @keyframes photostream-l { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes photostream-r { from { transform: translateX(-50%); } to { transform: translateX(0); } }
      `}</style>

      <div className="photostream-head w-full mb-10 md:mb-14" style={{ paddingLeft: "var(--pad-x)", paddingRight: "var(--pad-x)" }}>
        <span
          className="block"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.7rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--text-muted)",
            marginBottom: "1rem",
          }}
        >
          Moments, frame by frame
        </span>
        <h2
          className="text-white"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 400,
            fontSize: "clamp(1.8rem, 3.4vw, 3.2rem)",
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            fontVariationSettings: "'SOFT' 50, 'WONK' 1",
            maxWidth: "22ch",
          }}
        >
          Every event tells a{" "}
          <span className="italic" style={{ fontVariationSettings: "'SOFT' 100, 'WONK' 1" }}>
            story
          </span>
          .
        </h2>
      </div>

      <div className="flex flex-col gap-4 md:gap-6">
        <Row images={row1} speed={55} />
        <Row images={row2} reverse speed={70} />
        <Row images={row3} speed={60} />
      </div>
    </section>
  );
}
