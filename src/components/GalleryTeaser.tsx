"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { reels, INSTA_URL } from "@/data/reels";

gsap.registerPlugin(ScrollTrigger);

const galleryImages = reels.slice(0, 8).map((r) => ({
  src: r.poster,
  title: r.title,
  caption: r.caption,
}));

export default function GalleryTeaser() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".gallery-head",
        { y: 20, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.7, ease: "expo.out",
          immediateRender: false,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 90%",
            toggleActions: "play none none none",
            once: true,
          },
        }
      );

      gsap.fromTo(".gallery-slide",
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, stagger: 0.06, ease: "expo.out",
          immediateRender: false,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
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
      id="gallery"
      className="panel pb-section relative overflow-hidden"
      style={{ background: "var(--bg-primary)", justifyContent: "flex-start" }}
    >
      {/* Header row */}
      <div
        className="gallery-head w-full flex flex-col sm:flex-row sm:items-end justify-between gap-6"
        style={{
          paddingLeft: "var(--pad-x)",
          paddingRight: "var(--pad-x)",
          marginBottom: "clamp(1.5rem, 3vh, 2.5rem)",
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
              marginBottom: "1rem",
            }}
          >
            Gallery
          </span>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              fontSize: "clamp(1.8rem, 3.2vw, 2.8rem)",
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
              color: "var(--accent-cream)",
              maxWidth: "20ch",
              fontVariationSettings: "'SOFT' 50, 'WONK' 1",
            }}
          >
            Moments from our{" "}
            <span
              className="italic"
              style={{ fontVariationSettings: "'SOFT' 100, 'WONK' 1" }}
            >
              events
            </span>
          </h2>
        </div>

        <div className="flex items-center gap-4">
          <a
            href={INSTA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.12em] transition-colors duration-300 hover:text-[var(--accent-gold)]"
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 400,
              color: "var(--text-muted)",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="2" y="2" width="20" height="20" rx="5" />
              <circle cx="12" cy="12" r="5" />
              <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
            </svg>
            @planberryevents
          </a>
          <Link href="/gallery" className="btn-primary" style={{ padding: "10px 22px", fontSize: "0.82rem" }}>
            View gallery
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Horizontal snap slider */}
      <div
        ref={trackRef}
        className="flex flex-row gap-4 md:gap-5 overflow-x-auto snap-x snap-mandatory"
        style={{
          paddingLeft: "var(--pad-x)",
          paddingRight: "var(--pad-x)",
          scrollbarWidth: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {galleryImages.map((img, i) => (
          <div
            key={i}
            className="gallery-slide group snap-center shrink-0 relative overflow-hidden rounded-[8px]"
            style={{
              width: "clamp(200px, 22vw, 280px)",
              aspectRatio: "4/5",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.src}
              alt={img.title}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.05]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.7)] via-[rgba(0,0,0,0.05)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div
              className="absolute bottom-0 left-0 right-0 p-3.5 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500"
            >
              <p
                className="text-white text-sm"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 400,
                  fontVariationSettings: "'SOFT' 50, 'WONK' 1",
                }}
              >
                {img.title}
              </p>
              <p
                className="text-[10px] uppercase tracking-[0.12em] mt-0.5"
                style={{
                  fontFamily: "var(--font-body)",
                  color: "rgba(255,255,255,0.6)",
                }}
              >
                {img.caption}
              </p>
            </div>
          </div>
        ))}

        {/* "More" card linking to gallery */}
        <Link
          href="/gallery"
          className="gallery-slide snap-center shrink-0 relative overflow-hidden rounded-[8px] flex items-center justify-center group"
          style={{
            width: "clamp(200px, 22vw, 280px)",
            aspectRatio: "4/5",
            background: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <div className="text-center">
            <div
              className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center transition-all duration-500 group-hover:scale-110"
              style={{ background: "var(--accent-gold)", color: "var(--bg-primary)" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
            <p
              className="text-sm transition-colors duration-300 group-hover:text-[var(--accent-gold)]"
              style={{
                fontFamily: "var(--font-body)",
                fontWeight: 500,
                color: "var(--accent-cream)",
                letterSpacing: "0.04em",
              }}
            >
              View All
            </p>
            <p
              className="text-[10px] mt-1 uppercase tracking-[0.12em]"
              style={{ fontFamily: "var(--font-body)", color: "var(--text-muted)" }}
            >
              Full gallery
            </p>
          </div>
        </Link>
      </div>
    </section>
  );
}
