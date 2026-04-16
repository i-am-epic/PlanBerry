"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { caseStudies } from "@/data/caseStudies";

gsap.registerPlugin(ScrollTrigger);

export default function CaseStudiesPinned() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.matchMedia().add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
        const track = trackRef.current;
        const section = sectionRef.current;
        if (!track || !section) return;

        // Track is padded so first card starts centered and last card ends centered.
        // Travel = full track width minus one viewport width.
        const scrollLen = () => Math.max(0, track.scrollWidth - window.innerWidth);

        gsap.to(track, {
          x: () => -scrollLen(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            pin: true,
            start: "top top",
            end: () => `+=${scrollLen()}`,
            scrub: 1,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });

        gsap.to(".cs-progress-fill", {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${scrollLen()}`,
            scrub: 0.5,
          },
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="work"
      className="relative overflow-hidden grid content-center"
      style={{ background: "#080808", height: "100dvh", minHeight: 640 }}
    >
      {/* Intro row — compact top strip */}
      <div
        className="absolute top-0 left-0 right-0 z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-4 lg:gap-20"
        style={{
          paddingLeft: "var(--pad-x)",
          paddingRight: "var(--pad-x)",
          paddingTop: "clamp(2rem, 3.5vh, 3rem)",
          paddingBottom: "clamp(0.75rem, 1.5vh, 1.25rem)",
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
              color: "#555",
              marginBottom: "0.85rem",
            }}
          >
            Selected Work
          </span>
          <h2
            className="text-white"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              fontSize: "clamp(1.6rem, 3vw, 2.8rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              maxWidth: "18ch",
              fontVariationSettings: "'SOFT' 50, 'WONK' 1",
            }}
          >
            Recent{" "}
            <span
              className="italic"
              style={{ fontVariationSettings: "'SOFT' 100, 'WONK' 1" }}
            >
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
            color: "rgba(255,255,255,0.5)",
          }}
        >
          A selection of corporate and celebration work. Scroll to browse — click any card to open the story.
        </p>
      </div>

      {/* Track — grid content-center on section handles vertical centering */}
      <div
        ref={trackRef}
        className="flex items-center gap-6 md:gap-8 will-change-transform"
        style={{
          paddingLeft: "max(var(--pad-x), calc(50vw - min(32vw, 230px)))",
          paddingRight: "max(var(--pad-x), calc(50vw - min(32vw, 230px)))",
        }}
      >
          {caseStudies.map((cs) => (
            <Link
              key={cs.slug}
              href={`/work/${cs.slug}`}
              className="cs-card shrink-0 group block relative"
              style={{
                width: "min(64vw, 460px)",
                height: "min(58vh, 500px)",
                background: "#0c0c0c",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "6px",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                className="relative w-full shrink-0 overflow-hidden"
                style={{ height: "52%" }}
              >
                <Image
                  src={cs.image}
                  alt={cs.title}
                  fill
                  sizes="(max-width: 900px) 64vw, 460px"
                  className="object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.05]"
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 45%)",
                  }}
                />
                <div className="absolute top-4 left-4 flex items-center gap-2.5">
                  <span
                    style={{
                      padding: "0.3rem 0.7rem",
                      borderRadius: "999px",
                      border: "1px solid rgba(255,255,255,0.25)",
                      background: "rgba(0,0,0,0.4)",
                      backdropFilter: "blur(6px)",
                      fontFamily: "var(--font-body)",
                      fontSize: "0.56rem",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.9)",
                    }}
                  >
                    {cs.category}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.62rem",
                      letterSpacing: "0.12em",
                      color: "rgba(255,255,255,0.7)",
                    }}
                  >
                    {cs.year}
                  </span>
                </div>
              </div>

              <div
                className="flex-1 min-h-0 flex flex-col"
                style={{
                  padding: "clamp(1.25rem, 1.8vw, 1.75rem) clamp(1.25rem, 1.8vw, 1.75rem) clamp(1.25rem, 1.8vw, 1.75rem)",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.6rem",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "#666",
                  }}
                >
                  {cs.client}
                </span>
                <h3
                  className="text-white"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 400,
                    fontSize: "clamp(1.05rem, 1.4vw, 1.4rem)",
                    lineHeight: 1.15,
                    letterSpacing: "-0.01em",
                    marginTop: "0.45rem",
                    marginBottom: "auto",
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
                  className="grid grid-cols-3 gap-3"
                  style={{
                    paddingTop: "0.9rem",
                    marginTop: "0.9rem",
                    borderTop: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  {cs.metrics.map((m) => (
                    <div key={m.label}>
                      <div
                        className="text-white"
                        style={{
                          fontFamily: "var(--font-display)",
                          fontWeight: 400,
                          fontSize: "clamp(0.95rem, 1.15vw, 1.15rem)",
                          lineHeight: 1,
                          fontVariationSettings: "'SOFT' 50, 'WONK' 0",
                        }}
                      >
                        {m.value}
                      </div>
                      <div
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "0.56rem",
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          color: "#666",
                          marginTop: "0.3rem",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
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

      {/* Progress bar */}
      <div
        className="hidden lg:block absolute bottom-6 left-0 right-0 z-10"
        style={{ paddingLeft: "var(--pad-x)", paddingRight: "var(--pad-x)" }}
      >
        <div
          className="relative h-[1px]"
          style={{ background: "rgba(255,255,255,0.08)" }}
        >
          <div
            className="cs-progress-fill absolute top-0 left-0 h-full w-full origin-left"
            style={{ background: "rgba(255,255,255,0.6)", transform: "scaleX(0)" }}
          />
        </div>
      </div>
    </section>
  );
}
