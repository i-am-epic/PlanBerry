"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Props = {
  text: string;
  /** Italic accent word that repeats between entries. */
  accent?: string;
  /** Height of the strip (CSS). Defaults to a responsive clamp. */
  height?: string;
  /** Direction the track drifts. */
  direction?: "left" | "right";
};

/**
 * MarqueeDivider — oversized italic type ribbon that drifts autonomously
 * AND speeds up with scroll direction. Between major sections it gives
 * the page a sense of cadence and craft. The giant italic accent word
 * ghosts behind (stroked outline) so the strip reads as layered, not flat.
 */
export default function MarqueeDivider({
  text,
  accent,
  height = "clamp(6rem, 14vh, 12rem)",
  direction = "left",
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    // On very small touch viewports the scroll-velocity ticker adds jank that
    // outweighs the benefit. Run a simple loop without velocity coupling.
    const isTouch = window.matchMedia("(pointer: coarse)").matches;

    const ctx = gsap.context(() => {
      const sign = direction === "left" ? -1 : 1;

      // Base autonomous drift — loops seamlessly because the track content is
      // duplicated (first half ≡ second half). We animate x from 0 → -width/2
      // then reset. GSAP handles the loop via repeat:-1.
      const halfWidth = () => track.scrollWidth / 2;
      const baseTween = gsap.fromTo(
        track,
        { x: 0 },
        {
          x: () => sign * halfWidth(),
          duration: 34,
          ease: "none",
          repeat: -1,
        }
      );

      // Desktop only: scroll velocity → speed boost. Mobile skips this to
      // keep scroll buttery.
      let ticker: ((this: unknown) => void) | null = null;
      let scrollTick: ScrollTrigger | null = null;
      if (!isTouch) {
        let targetScale = 1;
        scrollTick = ScrollTrigger.create({
          trigger: root,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            const v = Math.abs(self.getVelocity());
            targetScale = 1 + Math.min(v * 0.0008, 2.5);
          },
        });
        ticker = () => {
          const current = baseTween.timeScale();
          const next = current + (targetScale - current) * 0.08;
          baseTween.timeScale(next);
        };
        gsap.ticker.add(ticker);

        // SOFT axis scroll-scrub — subtle type breath
        gsap.fromTo(
          root,
          { "--mq-soft": 40 },
          {
            "--mq-soft": 110,
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          }
        );
      }

      // Refresh resets on resize
      const onRefresh = () => {
        baseTween.invalidate().restart();
      };
      ScrollTrigger.addEventListener("refreshInit", onRefresh);

      return () => {
        if (ticker) gsap.ticker.remove(ticker);
        if (scrollTick) scrollTick.kill();
        ScrollTrigger.removeEventListener("refreshInit", onRefresh);
      };
    }, rootRef);

    return () => ctx.revert();
  }, [direction]);

  const entry = (i: number) => (
    <span
      key={i}
      className="inline-flex items-center gap-[clamp(1.25rem,2.4vw,2.5rem)] whitespace-nowrap shrink-0"
    >
      <span
        className="text-[#f5f5f0]"
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 400,
          fontVariationSettings: "'SOFT' var(--mq-soft, 50), 'WONK' 1",
          fontSize: "clamp(3.5rem, 11vw, 11rem)",
          lineHeight: 0.85,
          letterSpacing: "-0.03em",
        }}
      >
        {text}
      </span>
      {accent && (
        <span
          className="italic"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 400,
            fontVariationSettings: "'SOFT' 100, 'WONK' 1",
            fontSize: "clamp(3.5rem, 11vw, 11rem)",
            lineHeight: 0.85,
            letterSpacing: "-0.03em",
            color: "transparent",
            WebkitTextStroke: "1px rgba(245,245,240,0.45)",
          }}
        >
          {accent}
        </span>
      )}
      <span
        aria-hidden
        className="inline-block rounded-full"
        style={{
          width: "clamp(0.4rem, 0.9vw, 0.75rem)",
          height: "clamp(0.4rem, 0.9vw, 0.75rem)",
          background: "rgba(245,245,240,0.35)",
        }}
      />
    </span>
  );

  // 8 copies: first 4 render + 4 duplicate => seamless loop at x=-halfWidth
  const copies = 4;

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="relative w-full overflow-hidden select-none"
      style={{
        height,
        background: "#080808",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        ["--mq-soft" as string]: "50",
      }}
    >
      {/* Edge fade masks */}
      <div
        className="absolute left-0 top-0 bottom-0 z-10 pointer-events-none"
        style={{
          width: "min(18vw, 14rem)",
          background: "linear-gradient(to right, #080808 0%, rgba(8,8,8,0) 100%)",
        }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 z-10 pointer-events-none"
        style={{
          width: "min(18vw, 14rem)",
          background: "linear-gradient(to left, #080808 0%, rgba(8,8,8,0) 100%)",
        }}
      />

      <div
        ref={trackRef}
        className="absolute inset-y-0 left-0 flex items-center gap-[clamp(1.25rem,2.4vw,2.5rem)] will-change-transform"
        style={{ paddingLeft: "2rem", paddingRight: "2rem" }}
      >
        {Array.from({ length: copies * 2 }).map((_, i) => entry(i))}
      </div>
    </div>
  );
}
