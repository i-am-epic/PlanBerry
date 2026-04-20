"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const HERO_HLS_SRC =
  "https://stream.mux.com/BLC6VVUBEBHvYTC7x02S5iULppqcdMmsUmGHVXq02y8W8.m3u8?max_resolution=1080p&min_resolution=720p";

const WARMUP_IMAGES = [
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=480&q=45",
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=480&q=45",
  "https://images.unsplash.com/photo-1519741497674-611481863552?w=480&q=45",
  "https://images.unsplash.com/photo-1511578314322-379afb476865?w=480&q=45",
  "https://images.unsplash.com/photo-1530023367847-a683933f4172?w=480&q=45",
  "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=480&q=45",
];

const WARMUP_VIDEO_POSTERS = [
  "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=480&q=45",
  "https://images.unsplash.com/photo-1478146059778-26028b07395a?w=480&q=45",
  "https://images.unsplash.com/photo-1549451371-64aa98a6f660?w=480&q=45",
];

function warmImage(url: string) {
  return new Promise<void>((resolve) => {
    const img = new Image();
    img.decoding = "async";
    img.loading = "eager";
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = url;
  });
}

export default function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let disposed = false;
    let timelineDone = false;
    let warmupDone = false;

    const tryClose = () => {
      if (!timelineDone || !warmupDone || disposed) return;
      document.body.style.overflow = "";
      root.style.display = "none";
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.style.display = "none";
      return;
    }

    document.body.style.overflow = "hidden";

    const tl = gsap.timeline({
      onComplete: () => {
        timelineDone = true;
        tryClose();
      },
    });

    const warmup = Promise.allSettled([
      fetch(HERO_HLS_SRC, { mode: "no-cors" }).catch(() => undefined),
      ...WARMUP_IMAGES.map((url) => warmImage(url)),
      ...WARMUP_VIDEO_POSTERS.map((url) => warmImage(url)),
    ]);

    Promise.race([
      warmup,
      new Promise((resolve) => setTimeout(resolve, 2200)),
    ]).then(() => {
      warmupDone = true;
      tryClose();
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
      disposed = true;
      tl.kill();
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-200 pointer-events-none"
      style={{ background: "var(--bg-primary)" }}
      aria-hidden
    >
      <div ref={linesRef} className="absolute inset-0 flex">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 h-full"
            style={{
              background: i % 2 === 0 ? "var(--bg-secondary)" : "var(--bg-card)",
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
          <img
            src="/logo.png"
            alt="Planberry"
            style={{
              width: "clamp(48px, 8vw, 72px)",
              height: "auto",
            }}
          />
          <span
            ref={countRef}
            className="tabular-nums"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.7rem",
              letterSpacing: "0.3em",
              color: "var(--accent-gold)",
            }}
          >
            00
          </span>
        </div>
      </div>
    </div>
  );
}
