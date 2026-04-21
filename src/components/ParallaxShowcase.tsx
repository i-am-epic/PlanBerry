"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Free stock videos — event/celebration themed, portrait-friendly with cover
const eventVideos = [
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
];

const showcaseItems = [
  {
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=65",
    title: "The Meridian Gala",
    category: "Corporate",
    year: "2025",
    guests: "2,000",
    description: "Annual leadership gala for Meridian Group's senior executives. Full AV production, custom stage design, live jazz quartet, and a three-course curated dining experience.",
    deliverables: ["Stage & AV Production", "Custom Set Design", "Live Entertainment", "Catering Coordination"],
    hashtags: ["#MeridianGala", "#CorporateEvents", "#BangaloreEvents"],
  },
  {
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=65",
    title: "Reddy–Sharma Wedding",
    category: "Celebration",
    year: "2025",
    guests: "600",
    description: "A three-day heritage celebration across two venues in Bangalore and Mysore. Floral design sourced from 8 vendors, traditional décor curated with the family over 4 months.",
    deliverables: ["Venue Curation", "Floral & Décor Design", "Heritage Styling", "Guest Experience"],
    hashtags: ["#ReddySharmaWedding", "#WeddingBangalore", "#LuxuryWedding"],
  },
  {
    image: "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=600&q=65",
    title: "TechFlow Series A",
    category: "Launch",
    year: "2024",
    guests: "350",
    description: "Product launch and investor announcement event for TechFlow's Series A close. Live streaming to 12,000 online viewers, with curated press experience and media wall.",
    deliverables: ["Live Production & Streaming", "Press & Media Setup", "Brand Activation", "Speaker Preparation"],
    hashtags: ["#TechFlowLaunch", "#StartupIndia", "#BrandLaunchBangalore"],
  },
  {
    image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&q=65",
    title: "Neon Arts Festival",
    category: "Cultural",
    year: "2024",
    guests: "4,500",
    description: "Outdoor arts and culture festival across two evenings. Coordinated 22 artists, 4 stages, lighting design team, food vendors, and a 10,000sqft immersive installation.",
    deliverables: ["Multi-Stage Coordination", "Lighting Design", "Artist Logistics", "Large-Scale Production"],
    hashtags: ["#NeonArtsFest", "#BangaloreArts", "#EventsBangalore"],
  },
  {
    image: "https://images.unsplash.com/photo-1478146059778-26028b07395a?w=600&q=65",
    title: "The Grand Pavilion",
    category: "Private",
    year: "2024",
    guests: "80",
    description: "An intimate private dinner for 80 guests in an outdoor pavilion setting. Bespoke table settings, seasonal menu collaboration with a Michelin-trained chef, and string quartet.",
    deliverables: ["Venue Transformation", "Bespoke Table Setting", "Culinary Collaboration", "Curated Entertainment"],
    hashtags: ["#GrandPavilion", "#PrivateDinner", "#LuxuryEvents"],
  },
];

const CARD_VW = 0.32;
const CARD_MIN = 280;
const CARD_MAX = 460;
const GAP = 28;

type ShowcaseItem = typeof showcaseItems[0];

// ── Instagram Reels-style video modal ────────────────────────────────────────
function InstaReel({ item, videoSrc, onClose }: { item: ShowcaseItem; videoSrc: string; onClose: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const reelRef = useRef<HTMLDivElement>(null);
  const [muted, setMuted] = useState(true);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: "power2.out" });
    gsap.fromTo(reelRef.current, { scale: 0.96, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.35, ease: "expo.out", delay: 0.05 });
  }, []);

  const close = useCallback(() => {
    gsap.to(reelRef.current, { scale: 0.95, opacity: 0, duration: 0.2, ease: "power2.in" });
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.2, ease: "power2.in", onComplete: onClose });
  }, [onClose]);

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setPaused(false); }
    else { v.pause(); setPaused(true); }
  }, []);

  const toggleMute = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  }, []);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[150] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.92)" }}
      onClick={(e) => { if (e.target === overlayRef.current) close(); }}
    >
      {/* 9:16 Reel container */}
      <div
        ref={reelRef}
        className="relative bg-black overflow-hidden flex-shrink-0"
        style={{
          width: "min(390px, 100vw)",
          height: "min(692px, 100dvh)",
          borderRadius: "clamp(0px, 5vw, 14px)",
        }}
        onClick={togglePlay}
      >
        {/* Video */}
        <video
          ref={videoRef}
          src={videoSrc}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          onTimeUpdate={() => {
            const v = videoRef.current;
            if (v && v.duration) setProgress(v.currentTime / v.duration);
          }}
        />

        {/* Dark gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.7)] via-transparent to-[rgba(0,0,0,0.3)] pointer-events-none" />

        {/* Progress bar — top */}
        <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-[rgba(255,255,255,0.2)] z-10 pointer-events-none">
          <div
            className="h-full bg-white"
            style={{ width: `${progress * 100}%`, transition: "width 0.1s linear" }}
          />
        </div>

        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between z-10 pointer-events-none"
          style={{ padding: "clamp(1rem, 3vh, 1.5rem) clamp(0.75rem, 2vw, 1rem)" }}>
          <button
            className="w-8 h-8 rounded-full flex items-center justify-center pointer-events-auto"
            style={{ background: "rgba(0,0,0,0.35)" }}
            onClick={(e) => { e.stopPropagation(); close(); }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
          </button>

          <div className="flex items-center gap-2 pointer-events-auto">
            {/* Mute */}
            <button
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: "rgba(0,0,0,0.35)" }}
              onClick={toggleMute}
            >
              {muted ? (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="white" stroke="none" opacity="0.9" />
                  <line x1="22" y1="9" x2="16" y2="15" /><line x1="16" y1="9" x2="22" y2="15" />
                </svg>
              ) : (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="white" stroke="none" opacity="0.9" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Paused indicator */}
        {paused && (
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            <div className="w-16 h-16 rounded-full bg-[rgba(0,0,0,0.5)] flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            </div>
          </div>
        )}

        {/* Right action column */}
        <div
          className="absolute right-0 bottom-0 flex flex-col items-center gap-5 z-10"
          style={{ padding: "0 clamp(0.6rem, 1.5vw, 0.9rem) clamp(5rem, 12vh, 7rem) 0" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Like */}
          <button className="flex flex-col items-center gap-1" onClick={() => setLiked(!liked)}>
            <div className="w-11 h-11 flex items-center justify-center">
              <svg width="26" height="26" viewBox="0 0 24 24" fill={liked ? "#ff3b5c" : "none"} stroke={liked ? "#ff3b5c" : "white"} strokeWidth="1.8">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
            <span style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "rgba(255,255,255,0.85)", fontWeight: 500 }}>
              {liked ? "1.2K" : "1.1K"}
            </span>
          </button>

          {/* Comment */}
          <button className="flex flex-col items-center gap-1">
            <div className="w-11 h-11 flex items-center justify-center">
              <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <span style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "rgba(255,255,255,0.85)", fontWeight: 500 }}>248</span>
          </button>

          {/* Share */}
          <button className="flex flex-col items-center gap-1">
            <div className="w-11 h-11 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </div>
            <span style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "rgba(255,255,255,0.85)", fontWeight: 500 }}>Share</span>
          </button>

          {/* Save */}
          <button className="flex flex-col items-center gap-1" onClick={() => setSaved(!saved)}>
            <div className="w-11 h-11 flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill={saved ? "white" : "none"} stroke="white" strokeWidth="1.8">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
            </div>
          </button>

          {/* Audio note */}
          <a
            href="https://www.instagram.com/planberry_events"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-[8px] overflow-hidden border-2 border-[rgba(255,255,255,0.3)]"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={showcaseItems[0].image} alt="audio" className="w-full h-full object-cover" />
          </a>
        </div>

        {/* Bottom left — user info + caption */}
        <div
          className="absolute bottom-0 left-0 z-10 pointer-events-none"
          style={{ padding: "0 3.5rem clamp(1.25rem, 3vh, 2rem) clamp(0.75rem, 2vw, 1rem)", maxWidth: "calc(100% - 4rem)" }}
        >
          {/* Username */}
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-[#202020] border border-[rgba(255,255,255,0.2)] overflow-hidden">
              <div className="w-full h-full flex items-center justify-center text-white text-[10px]" style={{ fontFamily: "var(--font-display)" }}>pb</div>
            </div>
            <span style={{ fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 600, color: "white" }}>
              planberry.in
            </span>
            <span
              className="px-2 py-0.5 rounded border border-white text-white text-[11px]"
              style={{ fontFamily: "var(--font-body)", fontWeight: 500 }}
            >
              Follow
            </span>
          </div>

          {/* Title */}
          <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 500, color: "white", marginBottom: "4px", lineHeight: 1.4 }}>
            {item.title}
          </p>

          {/* Caption */}
          <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: 300, color: "rgba(255,255,255,0.8)", lineHeight: 1.5, marginBottom: "6px" }}>
            {item.guests} guests · {item.category} · {item.year}
          </p>

          {/* Hashtags */}
          <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: 400, color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>
            {item.hashtags.join(" ")} #planberry #eventsbangalore
          </p>

          {/* Audio */}
          <div className="flex items-center gap-1.5 mt-2">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="white" opacity="0.7">
              <path d="M9 18V5l12-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM21 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
            </svg>
            <span style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "rgba(255,255,255,0.65)" }}>
              Original audio · planberry.in
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ParallaxShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const stRef = useRef<ScrollTrigger | null>(null);
  const [selected, setSelected] = useState<{ item: ShowcaseItem; videoSrc: string } | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => { setIsMounted(true); }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const ctx = gsap.context(() => {
      gsap.from(labelRef.current, {
        y: 15, opacity: 0, duration: 0.6, ease: "expo.out",
        scrollTrigger: { trigger: section, start: "top 85%", toggleActions: "play none none reverse" },
      });

      const build = () => {
        stRef.current?.kill();
        ScrollTrigger.getAll().filter((t) => t.vars.id === "showcase-pin").forEach((t) => t.kill());

        const vw = window.innerWidth;
        const cardW = Math.min(Math.max(vw * CARD_VW, CARD_MIN), CARD_MAX);
        const n = showcaseItems.length;
        const totalW = n * cardW + (n - 1) * GAP;
        const startX = (vw - cardW) / 2;
        const endX = startX - (totalW - cardW);
        const scrollDist = Math.abs(endX - startX);

        const tween = gsap.fromTo(track, { x: startX }, {
          x: endX, ease: "none",
          scrollTrigger: {
            id: "showcase-pin",
            trigger: section,
            start: "top top",
            end: () => `+=${scrollDist}`,
            scrub: 1, pin: true, pinSpacing: true, anticipatePin: 1, invalidateOnRefresh: true,
            onUpdate: (self) => { stRef.current = self; },
          },
        });

        track.querySelectorAll<HTMLElement>(".showcase-card").forEach((card, i) => {
          const img = card.querySelector("img");
          if (!img) return;
          gsap.fromTo(img, { x: 0 }, {
            x: -(20 + i * 4), ease: "none",
            scrollTrigger: {
              trigger: section, start: "top top", end: () => `+=${scrollDist}`,
              scrub: 1, invalidateOnRefresh: true,
            },
          });
        });

        return tween;
      };

      build();
      ScrollTrigger.addEventListener("refreshInit", () => { build(); });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <>
      {selected && isMounted && createPortal(
        <InstaReel
          item={selected.item}
          videoSrc={selected.videoSrc}
          onClose={() => setSelected(null)}
        />,
        document.body
      )}

      <section
        ref={sectionRef}
        id="portfolio"
        className="relative overflow-hidden"
        style={{ background: "var(--bg-primary)" }}
      >
        {/* Label row */}
        <div
          ref={labelRef}
          style={{ padding: "clamp(4rem, 8vh, 7rem) clamp(1.5rem, 7vw, 7rem) clamp(2rem, 4vh, 3.5rem)" }}
        >
          <div className="flex items-end justify-between">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-[#666] block mb-4" style={{ fontFamily: "var(--font-body)", fontWeight: 400 }}>
                Selected Work
              </span>
              <h2 className="tracking-tight text-[#f5f5f0]" style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "clamp(1.8rem, 3vw, 3.2rem)", fontVariationSettings: "'SOFT' 50, 'WONK' 1" }}>
                Recent{" "}
                <span className="italic" style={{ fontVariationSettings: "'SOFT' 100, 'WONK' 1" }}>projects</span>
              </h2>
            </div>
            <span className="hidden md:block text-xs text-[#555] tracking-[0.1em] uppercase pb-1" style={{ fontFamily: "var(--font-body)", fontWeight: 400 }}>
              scroll to explore →
            </span>
          </div>
        </div>

        {/* Horizontal track */}
        <div
          ref={trackRef}
          className="flex will-change-transform"
          style={{ gap: `${GAP}px`, paddingBottom: "clamp(3rem, 6vh, 5rem)" }}
        >
          {showcaseItems.map((item, i) => (
            <div
              key={item.title}
              className="showcase-card group relative shrink-0 rounded-[10px] overflow-hidden cursor-pointer"
              style={{ width: `clamp(${CARD_MIN}px, ${CARD_VW * 100}vw, ${CARD_MAX}px)`, aspectRatio: "3/4" }}
              onClick={() => setSelected({ item, videoSrc: eventVideos[i % eventVideos.length] })}
            >
              <div className="absolute inset-0 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-[-15%] w-[130%] h-[130%] object-cover transition-transform duration-[1.5s] ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
                />
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.88)] via-[rgba(0,0,0,0.12)] to-transparent" />

              {/* Index */}
              <div className="absolute top-6 left-6 text-[11px] tracking-[0.15em] text-[rgba(255,255,255,0.3)]" style={{ fontFamily: "var(--font-body)", fontWeight: 500 }}>
                {String(i + 1).padStart(2, "0")}
              </div>

              {/* Badge */}
              <div className="absolute top-6 right-6">
                <span className="text-[10px] uppercase tracking-[0.1em] text-[rgba(255,255,255,0.6)] px-3 py-1 rounded-full border border-[rgba(255,255,255,0.12)]" style={{ fontFamily: "var(--font-body)", fontWeight: 400 }}>
                  {item.category}
                </span>
              </div>

              {/* Play hint */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-14 h-14 rounded-full bg-[rgba(255,255,255,0.15)] backdrop-blur-sm flex items-center justify-center border border-[rgba(255,255,255,0.2)]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                    <polygon points="5,3 19,12 5,21" />
                  </svg>
                </div>
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0" style={{ padding: "clamp(1.5rem, 3vw, 2.25rem)" }}>
                <h3 className="text-xl md:text-[1.4rem] mb-1.5 tracking-tight text-white transition-transform duration-500 group-hover:translate-x-1"
                  style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontVariationSettings: "'SOFT' 50, 'WONK' 1", lineHeight: 1.2 }}>
                  {item.title}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-[rgba(255,255,255,0.4)]" style={{ fontFamily: "var(--font-body)", fontWeight: 300 }}>
                    {item.year}
                  </span>
                  <span className="text-[11px] text-[rgba(255,255,255,0.3)] flex items-center gap-1.5 group-hover:text-[rgba(255,255,255,0.6)] transition-colors duration-300" style={{ fontFamily: "var(--font-body)" }}>
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="white" opacity="0.7">
                      <polygon points="5,3 19,12 5,21" />
                    </svg>
                    Watch reel
                  </span>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-[2px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-[var(--ease-out-expo)]"
                style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.3) 0%, transparent 100%)" }} />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
