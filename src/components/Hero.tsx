"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type HlsType from "hls.js";
import BlueprintOverlay from "./BlueprintOverlay";
import { useContactModal } from "@/components/providers/ModalProvider";

gsap.registerPlugin(ScrollTrigger);

const HLS_SRC =
  "https://stream.mux.com/BLC6VVUBEBHvYTC7x02S5iULppqcdMmsUmGHVXq02y8W8.m3u8?max_resolution=1080p&min_resolution=720p";

export default function Hero() {
  const { openContact } = useContactModal();
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [immersiveMode, setImmersiveMode] = useState(false);

  // HLS video setup — deferred via requestIdleCallback, native HLS on Safari
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let hls: HlsType | null = null;
    let cancelled = false;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = HLS_SRC;
      video.addEventListener("loadedmetadata", () => {
        video.play().catch(() => { });
      });
      return;
    }

    const bootHls = () => {
      if (cancelled) return;
      import("hls.js").then(({ default: Hls }) => {
        if (cancelled || !Hls.isSupported()) return;
        hls = new Hls({ enableWorker: true, lowLatencyMode: false });
        hls.loadSource(HLS_SRC);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch(() => { });
        });
      });
    };

    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (h: number) => void;
    };
    const useRic = typeof w.requestIdleCallback === "function";
    const handle = useRic
      ? w.requestIdleCallback!(bootHls, { timeout: 1500 })
      : (window.setTimeout(bootHls, 300) as unknown as number);

    return () => {
      cancelled = true;
      if (useRic && typeof w.cancelIdleCallback === "function") {
        w.cancelIdleCallback(handle);
      } else {
        clearTimeout(handle);
      }
      hls?.destroy();
    };
  }, []);

  // GSAP entrance animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headingRef.current, {
        y: 40,
        opacity: 0,
        duration: 1.2,
        delay: 0.5,
        ease: "expo.out",
      });
      gsap.from(rightRef.current, {
        y: 25,
        opacity: 0,
        duration: 1,
        delay: 0.8,
        ease: "expo.out",
      });

      // Variable-font SOFT axis entrance — morphs from stiff 0 to soft 50
      const h1s = sectionRef.current?.querySelectorAll("h1.hero-h1");
      if (h1s && h1s.length) {
        gsap.fromTo(
          h1s,
          { "--hero-soft": 0 },
          {
            "--hero-soft": 50,
            duration: 1.8,
            delay: 0.55,
            ease: "expo.out",
          }
        );
        // Scroll-scrub SOFT from 50 → 100 as section scrolls up
        gsap.to(h1s, {
          "--hero-soft": 100,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "40% top",
            scrub: 0.8,
          },
        });
      }

      // Text exits fast — gone by 40% scroll
      gsap.to(headingRef.current, {
        y: -80, opacity: 0,
        scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "40% top", scrub: 0.6 },
      });
      gsap.to(rightRef.current, {
        y: -50, opacity: 0,
        scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "35% top", scrub: 0.6 },
      });

      // Video scale-up crop as user scrolls — creates a zoom-out/crop feel
      gsap.to(sectionRef.current?.querySelector("video") ?? {}, {
        scale: 1.18,
        scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: 0.8 },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Auto-mute on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!isMuted && window.scrollY > 100) {
        const video = videoRef.current;
        if (video) {
          video.muted = true;
          setIsMuted(true);
          setImmersiveMode(false);
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMuted]);

  const handleVideoClick = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isMuted) {
      video.muted = false;
      setIsMuted(false);
      setImmersiveMode(true);
    } else {
      if (video.paused) {
        video.play();
        setIsPlaying(true);
        setImmersiveMode(true);
      } else {
        video.pause();
        setIsPlaying(false);
        setImmersiveMode(false);
      }
    }
  }, [isMuted]);

  const toggleMute = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
    setImmersiveMode(!video.muted);
  }, []);

  const uiHidden = immersiveMode && !isMuted && isPlaying;

  // Broadcast immersive state
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("hero-immersive", { detail: { hidden: uiHidden } })
    );
  }, [uiHidden]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative w-full overflow-hidden cursor-pointer"
      style={{ height: "100dvh", minHeight: 600 }}
      onClick={handleVideoClick}
    >
      {/* Video */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
      />

      {/* Blueprint overlay — amoeba reveal on hover */}
      {!uiHidden && <BlueprintOverlay />}

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-700"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.02) 40%, rgba(0,0,0,0.7) 100%)",
          opacity: uiHidden ? 0.15 : 1,
        }}
      />

      {/* Sound controls */}
      {!isMuted && (
        <div
          className="absolute top-28 md:top-32 z-30 flex items-center gap-3 transition-opacity duration-500"
          style={{ right: "var(--pad-x)", opacity: uiHidden ? 0.4 : 1 }}
        >
          <button
            onClick={toggleMute}
            className="w-11 h-11 rounded-full bg-[rgba(0,0,0,0.4)] backdrop-blur-sm border border-[rgba(255,255,255,0.15)] flex items-center justify-center text-white hover:bg-[rgba(0,0,0,0.6)] transition-all duration-300"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
          </button>
          <span
            className="text-[11px] text-[rgba(255,255,255,0.5)]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {isPlaying ? "Playing" : "Paused"}
          </span>
        </div>
      )}

      {/* Bottom content — bigger text, more inset, higher z-index */}
      <div
        className="absolute bottom-0 left-0 right-0 z-20 transition-all duration-700"
        style={{
          paddingLeft: "var(--pad-x)",
          paddingRight: "var(--pad-x)",
          paddingBottom: "clamp(2.5rem, 6vh, 5rem)",
          opacity: uiHidden ? 0 : 1,
          transform: uiHidden ? "translateY(30px)" : "translateY(0)",
          pointerEvents: uiHidden ? "none" : "auto",
        }}
      >
        {/* ── Mobile layout: centered, CTA prominent ── */}
        <div className="md:hidden flex flex-col items-center text-center gap-5">
          <div ref={headingRef}>
            <h1
              className="hero-h1 text-white leading-[0.9] tracking-[-0.03em]"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 400,
                fontSize: "clamp(3.2rem, 13vw, 5rem)",
                ["--hero-soft" as string]: "50",
                fontVariationSettings: "'SOFT' var(--hero-soft, 50), 'WONK' 1",
              }}
            >
              Your{" "}
              <span className="italic" style={{ fontVariationSettings: "'SOFT' 100, 'WONK' 1" }}>vision</span>
              ,<br />made.
            </h1>
          </div>
          <div ref={rightRef} className="flex flex-col items-center gap-3">
            <button
              onClick={(e) => { e.stopPropagation(); openContact(); }}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full text-[15px] text-[#080808] bg-[#f5f5f0] hover:bg-white transition-all duration-300"
              style={{ fontFamily: "var(--font-body)", fontWeight: 500 }}
            >
              Plan my event
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                const video = videoRef.current;
                if (!video) return;
                video.muted = false;
                setIsMuted(false);
                setImmersiveMode(true);
              }}
              className="inline-flex items-center gap-2 text-[13px] text-[rgba(255,255,255,0.5)] hover:text-white transition-colors duration-300"
              style={{ fontFamily: "var(--font-body)", fontWeight: 400 }}
            >
              <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5,3 19,12 5,21" />
              </svg>
              Watch the film
            </button>
          </div>
        </div>

        {/* ── Desktop layout: two-column ── */}
        <div className="hidden md:flex w-full flex-row items-end justify-between gap-24">
          {/* LEFT — Headline */}
          <div ref={headingRef} className="flex-1 min-w-0 md:pl-[8%] lg:pl-[12%]">
            <h1
              className="hero-h1 text-white leading-[0.88] tracking-[-0.03em]"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 400,
                fontSize: "clamp(3.5rem, 7vw, 9rem)",
                ["--hero-soft" as string]: "50",
                fontVariationSettings: "'SOFT' var(--hero-soft, 50), 'WONK' 1",
              }}
            >
              Your{" "}
              <span className="italic" style={{ fontVariationSettings: "'SOFT' 100, 'WONK' 1" }}>vision</span>
              ,<br />made.
            </h1>
          </div>

          {/* RIGHT — CTA + tagline */}
          <div
            ref={rightRef}
            className="shrink-0 flex flex-col items-end gap-6 max-w-[380px] text-right md:pr-[8%] lg:pr-[12%]"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                const video = videoRef.current;
                if (!video) return;
                video.muted = false;
                setIsMuted(false);
                setImmersiveMode(true);
              }}
              className="inline-flex items-center gap-3 px-10 py-6 rounded-full text-[16px] text-white border border-[rgba(255,255,255,0.3)] bg-[rgba(0,0,0,0.3)] backdrop-blur-sm hover:bg-[rgba(0,0,0,0.5)] transition-all duration-300"
              style={{ fontFamily: "var(--font-body)", fontWeight: 400 }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5,3 19,12 5,21" />
              </svg>
              Watch the film
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); openContact(); }}
              className="inline-flex items-center gap-3 px-14 py-8 rounded-full text-[16px] text-[#080808] bg-[#f5f5f0] hover:bg-white transition-all duration-300"
              style={{ fontFamily: "var(--font-body)", fontWeight: 500 }}
            >
              Plan my event
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
            <p
              className="text-[14px] text-[rgba(255,255,255,0.5)] leading-[1.7]"
              style={{ fontFamily: "var(--font-body)", fontWeight: 300 }}
            >
              Full-service event management for corporate experiences and
              personal celebrations — crafted with creativity, precision, and purpose.
            </p>
          </div>
        </div>
      </div>

      {/* Center unmute hint */}
      {isMuted && (
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
          style={{ opacity: 0.45 }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="absolute w-16 h-16 rounded-full border border-[rgba(255,255,255,0.08)]"
              style={{ animation: "cursor-pulse 2.5s ease-out infinite" }}
            />
            <div
              className="absolute w-16 h-16 rounded-full border border-[rgba(255,255,255,0.05)]"
              style={{ animation: "cursor-pulse 2.5s ease-out infinite 0.8s" }}
            />
          </div>
          <div
            className="relative w-16 h-16 rounded-full bg-[rgba(0,0,0,0.3)] backdrop-blur-sm border border-[rgba(255,255,255,0.1)] flex items-center justify-center"
            style={{ animation: "breathe 3s ease-in-out infinite" }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="white" stroke="none" opacity="0.8" />
              <line x1="22" y1="9" x2="16" y2="15" />
              <line x1="16" y1="9" x2="22" y2="15" />
            </svg>
          </div>
        </div>
      )}
    </section>
  );
}
