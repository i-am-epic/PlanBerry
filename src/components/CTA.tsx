"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useContactModal } from "@/components/providers/ModalProvider";
import MagneticButton from "@/components/ui/MagneticButton";

gsap.registerPlugin(ScrollTrigger);

const HEADING_WORDS = ["Ready", "to", "plan", "something", "meaningful?"];

export default function CTA() {
  const { openContact } = useContactModal();
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const paraRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const section = sectionRef.current;
      if (!section) return;

      // Split each cta-word into character spans for per-letter reveal.
      const wordEls = headingRef.current?.querySelectorAll<HTMLElement>(".cta-word");
      const allChars: HTMLElement[] = [];
      wordEls?.forEach((w) => {
        const text = w.textContent ?? "";
        w.textContent = "";
        for (const ch of text) {
          const outer = document.createElement("span");
          outer.style.display = "inline-block";
          outer.style.overflow = "hidden";
          outer.style.lineHeight = "1";
          outer.style.verticalAlign = "top";
          const inner = document.createElement("span");
          inner.style.display = "inline-block";
          inner.style.willChange = "transform, filter, opacity";
          inner.textContent = ch;
          outer.appendChild(inner);
          w.appendChild(outer);
          allChars.push(inner);
        }
      });

      // ── Pinned scrub timeline ───────────────────────────────────────────
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          pin: true,
          start: "top top",
          end: "+=600",
          scrub: 1.4,
          invalidateOnRefresh: true,
        },
      });

      // Initial states
      gsap.set(labelRef.current, { opacity: 0, y: 12 });
      gsap.set(allChars, { yPercent: 120, rotationX: -80, opacity: 0, filter: "blur(6px)" });
      gsap.set(paraRef.current, { opacity: 0, y: 16 });
      gsap.set(buttonsRef.current, { opacity: 0, y: 18 });

      // 1. Label slides up
      tl.to(labelRef.current, { opacity: 1, y: 0, ease: "power2.out", duration: 0.22 });

      // 2. Heading — characters reveal with 3D flip + unblur, staggered
      tl.to(
        allChars,
        {
          yPercent: 0,
          rotationX: 0,
          opacity: 1,
          filter: "blur(0px)",
          ease: "expo.out",
          duration: 0.9,
          stagger: { each: 0.012, from: "start" },
        },
        "-=0.05"
      );

      // 3. Para fades in after heading
      tl.to(paraRef.current, { opacity: 1, y: 0, ease: "power2.out", duration: 0.28 }, "-=0.2");

      // 4. Buttons
      tl.to(buttonsRef.current, { opacity: 1, y: 0, ease: "expo.out", duration: 0.3 }, "-=0.1");
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative flex items-center justify-center overflow-hidden"
      style={{ height: "100dvh", minHeight: 600 }}
    >
      <div className="section-center pad-x" style={{ maxWidth: "100%" }}>

        {/* Label */}
        <span
          ref={labelRef}
          style={{
            fontFamily: "var(--font-body)",
            fontWeight: 400,
            fontSize: "0.72rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.45)",
            display: "block",
            marginBottom: "2.5rem",
          }}
        >
          Let&apos;s Create Together
        </span>

        {/* Heading — each word is a separately animated span */}
        <h2
          ref={headingRef}
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 400,
            fontSize: "clamp(2.5rem, 5.5vw, 6.5rem)",
            fontVariationSettings: "'SOFT' 50, 'WONK' 1",
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            maxWidth: "16ch",
            marginBottom: "3rem",
            textAlign: "center",
            perspective: "900px",
          }}
        >
          {HEADING_WORDS.map((word, i) => (
            <span
              key={i}
              className="cta-word"
              style={{
                display: "inline-block",
                // Last two words get italic display
                fontStyle: i >= 3 ? "italic" : "normal",
                fontVariationSettings: i >= 3 ? "'SOFT' 100, 'WONK' 1" : "'SOFT' 50, 'WONK' 1",
                marginRight: i < HEADING_WORDS.length - 1 ? "0.28em" : 0,
              }}
            >
              {word}
            </span>
          ))}
        </h2>

        {/* Para */}
        <p
          ref={paraRef}
          style={{
            fontFamily: "var(--font-body)",
            fontWeight: 300,
            fontSize: "clamp(0.9rem, 1.1vw, 1.1rem)",
            color: "rgba(255,255,255,0.55)",
            lineHeight: 1.8,
            maxWidth: "46ch",
            marginBottom: "3.5rem",
            textAlign: "center",
          }}
        >
          Whether it&apos;s a corporate conference for 500 or an intimate house-warming
          for 50 — we bring the same care, precision, and professionalism to every
          event we manage.
        </p>

        {/* Buttons */}
        <div
          ref={buttonsRef}
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            gap: "1.25rem",
          }}
        >
          <MagneticButton onClick={openContact} className="btn-primary">
            Submit Your Brief
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 17L17 7M17 7H7M17 7v10" />
            </svg>
          </MagneticButton>
          <a href="tel:+918012345678" className="btn-secondary">
            +91 80 1234 5678
          </a>
        </div>
      </div>
    </section>
  );
}
