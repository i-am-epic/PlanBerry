"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SECTIONS: { id: string; label: string }[] = [
  { id: "hero", label: "Intro" },
  { id: "services", label: "Services" },
  { id: "why", label: "Why" },
  { id: "approach", label: "Approach" },
  { id: "work", label: "Work" },
  { id: "media-production", label: "Production" },
  { id: "about", label: "Philosophy" },
  { id: "testimonials", label: "Stories" },
  { id: "contact", label: "Contact" },
];

/**
 * ScrollProgress — right-edge section indicator + top scrub line.
 *
 * Rail: one dot per section; the active section's dot is enlarged + its
 * label reveals. A vertical fill-line connects the top of the rail down
 * to the active dot, so the "progress" always lines up with the
 * currently-viewed section (no mismatched decoupled scroll head).
 *
 * Hidden on touch / <md where a side rail would crowd the UI, and during
 * hero immersive mode.
 */
export default function ScrollProgress() {
  const topBarRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => setHidden((e as CustomEvent).detail.hidden);
    window.addEventListener("hero-immersive", handler);
    return () => window.removeEventListener("hero-immersive", handler);
  }, []);

  useEffect(() => {
    const topBar = topBarRef.current;
    if (!topBar) return;

    const progressTrigger = ScrollTrigger.create({
      trigger: document.documentElement,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        gsap.set(topBar, { scaleX: self.progress });
      },
    });

    const sectionTriggers = SECTIONS.map((s, i) =>
      ScrollTrigger.create({
        trigger: `#${s.id}`,
        start: "top 45%",
        end: "bottom 45%",
        onToggle: (self) => {
          if (self.isActive) setActive(i);
        },
      })
    );

    return () => {
      progressTrigger.kill();
      sectionTriggers.forEach((t) => t.kill());
    };
  }, []);

  // Animate fill-line to reach the active dot's center
  useEffect(() => {
    const fill = fillRef.current;
    const rail = railRef.current;
    const activeDot = dotsRef.current[active];
    if (!fill || !rail || !activeDot) return;
    const railRect = rail.getBoundingClientRect();
    const dotRect = activeDot.getBoundingClientRect();
    const targetH = dotRect.top + dotRect.height / 2 - railRect.top;
    gsap.to(fill, {
      height: targetH,
      duration: 0.7,
      ease: "expo.out",
      overwrite: "auto",
    });
  }, [active]);

  return (
    <>
      {/* Top thin scrub bar */}
      <div className="fixed top-0 left-0 right-0 z-[100] h-[2px] pointer-events-none">
        <div
          ref={topBarRef}
          className="h-full w-full origin-left"
          style={{
            transform: "scaleX(0)",
            background:
              "linear-gradient(90deg, rgba(245,245,240,0.15) 0%, rgba(245,245,240,0.55) 100%)",
          }}
        />
      </div>

      {/* Right-edge rail — desktop only */}
      <div
        className={`fixed right-0 top-0 h-dvh z-[90] pointer-events-none hidden md:flex items-center transition-opacity duration-700 ${
          hidden ? "opacity-0" : "opacity-100"
        }`}
        style={{ paddingRight: "clamp(1.25rem, 2vw, 2rem)" }}
        aria-hidden
      >
        <div ref={railRef} className="relative flex flex-col items-end gap-[clamp(0.75rem,1.4vh,1rem)]">
          {/* Base guide line */}
          <div
            className="absolute right-[3px] top-0 bottom-0 w-[1px]"
            style={{ background: "rgba(255,255,255,0.07)" }}
          />
          {/* Filled progress line — grows from top down to active dot */}
          <div
            ref={fillRef}
            className="absolute right-[3px] top-0 w-[1px]"
            style={{
              height: 0,
              background:
                "linear-gradient(to bottom, rgba(245,245,240,0.65) 0%, rgba(245,245,240,0.85) 100%)",
              willChange: "height",
            }}
          />
          {SECTIONS.map((s, i) => {
            const isActive = active === i;
            const isPassed = i < active;
            return (
              <div
                key={s.id}
                className="relative flex items-center gap-3"
                style={{ transition: "all 0.5s var(--ease-out-expo)" }}
              >
                <span
                  className="text-[10px] uppercase"
                  style={{
                    fontFamily: "var(--font-body)",
                    letterSpacing: "0.18em",
                    color: isActive ? "rgba(245,245,240,0.95)" : "rgba(255,255,255,0.35)",
                    opacity: isActive ? 1 : 0,
                    transform: isActive ? "translateX(0)" : "translateX(8px)",
                    transition: "all 0.5s var(--ease-out-expo)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {s.label}
                </span>
                <span
                  ref={(el) => { dotsRef.current[i] = el; }}
                  className="block rounded-full"
                  style={{
                    width: isActive ? 9 : 5,
                    height: isActive ? 9 : 5,
                    marginRight: isActive ? 0 : 2,
                    background: isActive
                      ? "#f5f5f0"
                      : isPassed
                      ? "rgba(245,245,240,0.55)"
                      : "rgba(255,255,255,0.2)",
                    boxShadow: isActive ? "0 0 10px rgba(245,245,240,0.5)" : "none",
                    transition: "all 0.5s var(--ease-out-expo)",
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
