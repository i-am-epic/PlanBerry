"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { reels, INSTA_URL } from "@/data/reels";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

gsap.registerPlugin(ScrollTrigger);

/* ── Fullscreen reel viewer ─────────────────────────────────────────────────── */

function ReelViewer({
  reel,
  onClose,
  onPrev,
  onNext,
}: {
  reel: (typeof reels)[0];
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, onPrev, onNext]);

  return (
    <div
      className="fixed inset-0 z-300 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.92)", backdropFilter: "blur(20px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full mx-4"
        style={{ aspectRatio: "9/16", maxWidth: "380px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <video
          key={reel.src}
          src={reel.src}
          poster={reel.poster}
          autoPlay
          loop
          playsInline
          controls
          className="w-full h-full object-cover rounded-2xl"
        />
        <div
          className="absolute bottom-0 left-0 right-0 p-5 rounded-b-2xl pointer-events-none"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)" }}
        >
          <h3
            className="text-lg"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              fontVariationSettings: "'SOFT' 50, 'WONK' 1",
              color: "var(--accent-cream)",
            }}
          >
            {reel.title}
          </h3>
          <p className="text-sm mt-1" style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}>
            {reel.caption}
          </p>
        </div>
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-200"
        style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "var(--accent-cream)" }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-200"
        style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "var(--accent-cream)" }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
      </button>

      <button
        onClick={onClose}
        className="absolute top-5 right-5 w-11 h-11 rounded-full flex items-center justify-center transition-colors duration-200"
        style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "var(--accent-cream)" }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
      </button>
    </div>
  );
}

/* ── Reel card ──────────────────────────────────────────────────────────────── */

function ReelCard({
  reel,
  index,
  onClick,
}: {
  reel: (typeof reels)[0];
  index: number;
  onClick: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) video.play().catch(() => {});
          else video.pause();
        });
      },
      { threshold: 0.25 }
    );
    io.observe(video);
    return () => io.disconnect();
  }, []);

  return (
    <button
      onClick={onClick}
      className="gallery-reel group relative block overflow-hidden rounded-xl text-left w-full"
      style={{
        aspectRatio: "9/16",
        background: "var(--bg-secondary)",
        border: "1px solid var(--border-subtle)",
      }}
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
      <div className="absolute inset-0 bg-linear-to-t from-[rgba(0,0,0,0.85)] via-[rgba(0,0,0,0.1)] to-[rgba(0,0,0,0.3)] pointer-events-none" />
      <span
        className="absolute top-3 left-3 text-[10px] tracking-[0.15em] px-2 py-1 rounded-full backdrop-blur-sm"
        style={{ fontFamily: "var(--font-body)", color: "var(--text-muted)", background: "rgba(0,0,0,0.35)" }}
      >
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 400,
            fontSize: "clamp(1rem, 1.4vw, 1.25rem)",
            lineHeight: 1.2,
            fontVariationSettings: "'SOFT' 50, 'WONK' 1",
            color: "var(--accent-cream)",
          }}
        >
          {reel.title}
        </h3>
        <p
          className="mt-1"
          style={{ fontFamily: "var(--font-body)", fontSize: "0.72rem", letterSpacing: "0.04em", color: "var(--text-secondary)" }}
        >
          {reel.caption}
        </p>
      </div>
    </button>
  );
}

/* ── Page ────────────────────────────────────────────────────────────────────── */

export default function GalleryPage() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeReel, setActiveReel] = useState<number | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".gallery-reel", {
          y: 50,
          opacity: 0,
          duration: 0.8,
          stagger: 0.06,
          ease: "expo.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });
        gsap.from(".gallery-header", { y: 24, opacity: 0, duration: 0.8, ease: "expo.out" });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const openReel = useCallback((i: number) => setActiveReel(i), []);
  const closeReel = useCallback(() => setActiveReel(null), []);
  const nextReel = useCallback(() => setActiveReel((p) => (p !== null ? (p + 1) % reels.length : null)), []);
  const prevReel = useCallback(() => setActiveReel((p) => (p !== null ? (p - 1 + reels.length) % reels.length : null)), []);

  return (
    <>
      <Navbar />
      <main ref={sectionRef} className="min-h-dvh" style={{ background: "var(--bg-primary)" }}>
        <div
          className="gallery-header"
          style={{
            paddingLeft: "var(--pad-x)",
            paddingRight: "var(--pad-x)",
            paddingTop: "clamp(7rem, 14vh, 10rem)",
            paddingBottom: "clamp(2.5rem, 5vh, 4rem)",
          }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 mb-8 transition-colors duration-300"
            style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", letterSpacing: "0.04em", color: "var(--text-muted)" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to home
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
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
              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 400,
                  fontSize: "clamp(2rem, 4vw, 3.8rem)",
                  lineHeight: 1.05,
                  letterSpacing: "-0.02em",
                  fontVariationSettings: "'SOFT' 50, 'WONK' 1",
                  color: "var(--accent-cream)",
                  maxWidth: "22ch",
                }}
              >
                Live from the floor.{" "}
                <span className="italic" style={{ fontVariationSettings: "'SOFT' 100, 'WONK' 1" }}>
                  Every
                </span>{" "}
                moment captured.
              </h1>
            </div>
            <a
              href={INSTA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="self-start lg:self-end inline-flex items-center gap-2 text-[13px] transition-colors duration-300"
              style={{ fontFamily: "var(--font-body)", letterSpacing: "0.05em", color: "var(--text-secondary)" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="5" />
                <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" />
              </svg>
              @planberryevents
            </a>
          </div>
        </div>

        <div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 md:gap-4"
          style={{
            paddingLeft: "var(--pad-x)",
            paddingRight: "var(--pad-x)",
            paddingBottom: "clamp(5rem, 10vh, 8rem)",
          }}
        >
          {reels.map((reel, i) => (
            <ReelCard key={i} reel={reel} index={i} onClick={() => openReel(i)} />
          ))}
        </div>
      </main>
      <Footer />

      {activeReel !== null && (
        <ReelViewer
          reel={reels[activeReel]}
          onClose={closeReel}
          onPrev={prevReel}
          onNext={nextReel}
        />
      )}
    </>
  );
}
