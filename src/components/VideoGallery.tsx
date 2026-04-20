"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { INSTA_URL, reels } from "@/data/reels";

gsap.registerPlugin(ScrollTrigger);

function ReelCard({ reel, index }: { reel: typeof reels[0]; index: number }) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Only play when the card is within viewport — saves bandwidth + CPU.
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.25 }
    );
    io.observe(video);
    return () => io.disconnect();
  }, []);

  return (
    <a
      ref={cardRef}
      href={INSTA_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="gallery-reel group relative block overflow-hidden rounded-[12px] border border-[rgba(255,255,255,0.07)]"
      style={{ aspectRatio: "9/16", background: "#0c0c0c" }}
    >
      <video
        ref={videoRef}
        src={reel.src}
        poster={reel.poster}
        muted
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]"
      />

      {/* Gradient scrim */}
      <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.85)] via-[rgba(0,0,0,0.1)] to-[rgba(0,0,0,0.3)] pointer-events-none" />

      {/* Index */}
      <span
        className="absolute top-3 left-3 text-[10px] tracking-[0.15em] text-[rgba(255,255,255,0.55)] px-2 py-1 rounded-full backdrop-blur-sm"
        style={{ fontFamily: "var(--font-body)", background: "rgba(0,0,0,0.35)" }}
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* Instagram icon (top-right) */}
      <div
        className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm"
        style={{ background: "rgba(0,0,0,0.35)" }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.6">
          <rect x="2" y="2" width="20" height="20" rx="5" />
          <circle cx="12" cy="12" r="5" />
          <circle cx="17.5" cy="6.5" r="1.2" fill="white" stroke="none" />
        </svg>
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3
          className="text-white"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 400,
            fontSize: "clamp(1rem, 1.4vw, 1.25rem)",
            lineHeight: 1.2,
            fontVariationSettings: "'SOFT' 50, 'WONK' 1",
          }}
        >
          {reel.title}
        </h3>
        <p
          className="text-[rgba(255,255,255,0.6)] mt-1"
          style={{ fontFamily: "var(--font-body)", fontSize: "0.72rem", letterSpacing: "0.04em" }}
        >
          {reel.caption}
        </p>
      </div>
    </a>
  );
}

export default function VideoGallery() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".gallery-reel", {
          y: 60,
          opacity: 0,
          duration: 0.9,
          stagger: 0.08,
          ease: "expo.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        });
        gsap.from(".gallery-head", {
          y: 24,
          opacity: 0,
          duration: 0.8,
          ease: "expo.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
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
      id="gallery"
      className="pb-section relative overflow-hidden"
      style={{ padding: "clamp(4.5rem, 8vh, 7rem) 0", background: "var(--bg-primary)" }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-[1px]"
        style={{ background: "rgba(255,255,255,0.07)" }}
      />

      <div
        className="gallery-head w-full mb-10 md:mb-14 flex flex-col lg:flex-row lg:items-end justify-between gap-6"
        style={{ paddingLeft: "var(--pad-x)", paddingRight: "var(--pad-x)" }}
      >
        <div>
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
            The Reel Gallery
          </span>
          <h2
            className="text-white"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              fontSize: "clamp(2rem, 3.6vw, 3.4rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              fontVariationSettings: "'SOFT' 50, 'WONK' 1",
              maxWidth: "22ch",
            }}
          >
            Live from the floor.{" "}
            <span className="italic" style={{ fontVariationSettings: "'SOFT' 100, 'WONK' 1" }}>
              Straight
            </span>{" "}
            to the grid.
          </h2>
        </div>
        <a
          href={INSTA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="self-start lg:self-end inline-flex items-center gap-2 text-[13px] text-[rgba(255,255,255,0.6)] hover:text-white transition-colors"
          style={{ fontFamily: "var(--font-body)", letterSpacing: "0.05em" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <rect x="2" y="2" width="20" height="20" rx="5" />
            <circle cx="12" cy="12" r="5" />
            <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" />
          </svg>
          @planberryevents — follow for more
        </a>
      </div>

      <div
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 md:gap-4"
        style={{ paddingLeft: "var(--pad-x)", paddingRight: "var(--pad-x)" }}
      >
        {reels.map((reel, i) => (
          <ReelCard key={i} reel={reel} index={i} />
        ))}
      </div>
    </section>
  );
}
