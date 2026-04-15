"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.style.display = "none";
      return;
    }

    document.body.style.overflow = "hidden";

    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = "";
        root.style.display = "none";
      },
    });

    const counter = { v: 0 };
    tl.to(counter, {
      v: 100,
      duration: 1.4,
      ease: "power2.inOut",
      onUpdate: () => {
        if (countRef.current)
          countRef.current.textContent = Math.floor(counter.v)
            .toString()
            .padStart(2, "0");
      },
    });

    tl.to(
      markRef.current,
      { opacity: 1, y: 0, duration: 0.9, ease: "expo.out" },
      0,
    );

    tl.to(linesRef.current?.children ?? [], {
      scaleY: 0,
      transformOrigin: "bottom",
      duration: 1.1,
      stagger: 0.05,
      ease: "expo.inOut",
    }, "-=0.2");

    tl.to(root, {
      yPercent: -100,
      duration: 1,
      ease: "expo.inOut",
    }, "-=0.6");

    return () => {
      tl.kill();
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[200] pointer-events-none"
      style={{ background: "#080808" }}
      aria-hidden
    >
      <div ref={linesRef} className="absolute inset-0 flex">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 h-full"
            style={{
              background: i % 2 === 0 ? "#0a0a0a" : "#0c0c0c",
              transformOrigin: "bottom",
            }}
          />
        ))}
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          ref={markRef}
          className="relative flex flex-col items-center gap-6"
          style={{ opacity: 0, transform: "translateY(20px)" }}
        >
          <span
            className="text-white"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 4vw, 3.25rem)",
              fontVariationSettings: "'SOFT' 50, 'WONK' 1",
              letterSpacing: "-0.01em",
            }}
          >
            planberry
          </span>
          <span
            ref={countRef}
            className="tabular-nums text-[rgba(255,255,255,0.45)]"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.7rem",
              letterSpacing: "0.3em",
            }}
          >
            00
          </span>
        </div>
      </div>
    </div>
  );
}
