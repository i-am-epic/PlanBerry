"use client";

import { useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { caseStudies } from "@/data/caseStudies";

// Triple the list so we can loop "infinitely" by teleporting scroll from the
// edges back to the middle copy when the user drifts out of it.
const LOOPED = [...caseStudies, ...caseStudies, ...caseStudies];
const BASE_LEN = caseStudies.length;

export default function CaseStudiesPinned() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const didInit = useRef(false);

  const cardStep = () => {
    const track = trackRef.current;
    if (!track) return 0;
    const card = track.querySelector<HTMLElement>(".cs-card");
    if (!card) return 0;
    const style = getComputedStyle(track);
    const gap = parseFloat(style.columnGap || style.gap || "0") || 0;
    return card.offsetWidth + gap;
  };

  const copyWidth = () => cardStep() * BASE_LEN;

  // Coverflow: scale/opacity based on distance from viewport center
  const applyCoverflow = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const viewportCenter = window.innerWidth / 2;
    const cards = track.querySelectorAll<HTMLElement>(".cs-card");
    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const cardCenter = rect.left + rect.width / 2;
      const distance = Math.abs(viewportCenter - cardCenter);
      const range = window.innerWidth * 0.5;
      const t = Math.min(distance / range, 1);
      const scale = 1 - t * 0.22;
      const opacity = 1 - t * 0.55;
      card.style.transform = `scale(${scale.toFixed(3)})`;
      card.style.opacity = opacity.toFixed(3);
    });
  }, []);

  // Teleport scroll if user has wandered out of the middle copy so the
  // carousel feels endless.
  const rebalance = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const w = copyWidth();
    if (w <= 0) return;
    if (track.scrollLeft < w * 0.5) {
      track.scrollLeft += w;
    } else if (track.scrollLeft > w * 1.5) {
      track.scrollLeft -= w;
    }
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let raf = 0;
    const schedule = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        applyCoverflow();
        rebalance();
      });
    };

    // Initial position: middle copy, first card centered
    const init = () => {
      if (didInit.current) return;
      const w = copyWidth();
      if (w <= 0) return;
      track.scrollLeft = w;
      didInit.current = true;
      applyCoverflow();
    };

    // Defer init until images assign widths
    requestAnimationFrame(() => {
      init();
      requestAnimationFrame(applyCoverflow);
    });

    track.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      track.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [applyCoverflow, rebalance]);

  const scrollByStep = (dir: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: dir * cardStep(), behavior: "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      id="work"
      className="panel relative overflow-hidden"
      style={{ background: "var(--bg-primary)", justifyContent: "flex-start" }}
    >
      {/* Heading */}
      <div
        className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 lg:gap-20"
        style={{
          paddingLeft: "var(--pad-x)",
          paddingRight: "var(--pad-x)",
          paddingBottom: "clamp(1.5rem, 3vh, 2.5rem)",
        }}
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
              marginBottom: "0.85rem",
            }}
          >
            Selected Work
          </span>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              fontSize: "clamp(1.6rem, 3vw, 2.8rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              maxWidth: "18ch",
              fontVariationSettings: "'SOFT' 50, 'WONK' 1",
              color: "var(--accent-cream)",
            }}
          >
            Recent{" "}
            <span className="italic" style={{ fontVariationSettings: "'SOFT' 100, 'WONK' 1" }}>
              events
            </span>{" "}
            we&apos;ve delivered.
          </h2>
        </div>
        <p
          className="hidden lg:block max-w-sm"
          style={{
            fontFamily: "var(--font-body)",
            fontWeight: 300,
            fontSize: "clamp(0.8rem, 0.95vw, 0.95rem)",
            lineHeight: 1.7,
            color: "var(--text-secondary)",
          }}
        >
          Use the arrows or drag to browse — the carousel loops endlessly.
        </p>
      </div>

      {/* Carousel wrapper hosts arrows */}
      <div className="relative">
        {/* Coverflow horizontal track */}
        <div
          ref={trackRef}
          className="flex flex-row items-center overflow-x-auto no-scrollbar"
          style={{
            gap: "clamp(1rem, 2vw, 1.75rem)",
            paddingLeft: "max(var(--pad-x), calc(50vw - min(42vw, 190px)))",
            paddingRight: "max(var(--pad-x), calc(50vw - min(42vw, 190px)))",
            paddingTop: "clamp(1rem, 2vh, 1.75rem)",
            paddingBottom: "clamp(1.25rem, 2.5vh, 2rem)",
            scrollbarWidth: "none",
            WebkitOverflowScrolling: "touch",
            scrollSnapType: "x mandatory",
          }}
        >
          {LOOPED.map((cs, i) => (
            <Link
              key={`${cs.slug}-${i}`}
              href={`/work/${cs.slug}`}
              className="cs-card group shrink-0 relative overflow-hidden rounded-[14px] block"
              style={{
                width: "clamp(240px, 72vw, 360px)",
                aspectRatio: "4 / 5",
                background: "#111917",
                border: "1px solid rgba(255,255,255,0.08)",
                transition:
                  "transform 0.35s var(--ease-out-expo), opacity 0.35s var(--ease-out-expo), box-shadow 0.35s var(--ease-out-expo)",
                willChange: "transform, opacity",
                boxShadow: "0 18px 48px rgba(0,0,0,0.35)",
                scrollSnapAlign: "center",
              }}
            >
              <div className="absolute inset-0 overflow-hidden">
                <Image
                  src={cs.image}
                  alt={cs.title}
                  fill
                  sizes="(min-width: 1024px) 360px, 72vw"
                  className="cs-card-img object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.05]"
                />
              </div>
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[rgba(0,0,0,0.88)] via-[rgba(0,0,0,0.1)] to-[rgba(0,0,0,0.4)]" />

              <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
                <span
                  className="px-2.5 py-1 rounded-full text-[9px] uppercase tracking-[0.15em] text-white backdrop-blur-sm"
                  style={{
                    fontFamily: "var(--font-body)",
                    border: "1px solid rgba(255,255,255,0.22)",
                    background: "rgba(0,0,0,0.38)",
                  }}
                >
                  {cs.category}
                </span>
                <span
                  className="text-[10px] tracking-[0.12em]"
                  style={{ fontFamily: "var(--font-body)", color: "rgba(255,255,255,0.7)" }}
                >
                  {cs.year}
                </span>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                <span
                  className="block mb-1"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.58rem",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.55)",
                  }}
                >
                  {cs.client}
                </span>
                <h3
                  className="text-white"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 400,
                    fontSize: "clamp(1rem, 1.3vw, 1.2rem)",
                    lineHeight: 1.18,
                    letterSpacing: "-0.01em",
                    fontVariationSettings: "'SOFT' 50, 'WONK' 1",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {cs.title}
                </h3>
                <div
                  className="flex items-center gap-4 mt-3 pt-3"
                  style={{ borderTop: "1px solid rgba(255,255,255,0.12)" }}
                >
                  {cs.metrics.slice(0, 2).map((m) => (
                    <div key={m.label}>
                      <div
                        className="text-white"
                        style={{ fontFamily: "var(--font-display)", fontSize: "0.95rem", lineHeight: 1 }}
                      >
                        {m.value}
                      </div>
                      <div
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "0.54rem",
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          color: "rgba(255,255,255,0.55)",
                          marginTop: "0.25rem",
                        }}
                      >
                        {m.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Arrow controls */}
        <button
          type="button"
          aria-label="Previous"
          onClick={() => scrollByStep(-1)}
          className="cs-arrow cs-arrow-left"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </button>
        <button
          type="button"
          aria-label="Next"
          onClick={() => scrollByStep(1)}
          className="cs-arrow cs-arrow-right"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>
      </div>

    </section>
  );
}
