"use client";

import { useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const WORDS = [
  "We", "don't", "just", "organise", "events.", "We", "design",
  "experiences", "that", "reflect", "your", "vision,", "coordinate",
  "every", "detail", "with", "care,", "and", "deliver", "moments",
  "that", "stay", "with", "you.",
];

const PARTICLE_COUNT = 80;
const SCATTER_RADIUS = 180;

const BG_IMAGE_URL =
  "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=900&q=70";

type Particle = {
  el: HTMLDivElement;
  homeX: number;
  homeY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
};

export default function TextReveal() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const particleLayerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const isTouch = useRef(false);

  useEffect(() => {
    isTouch.current = window.matchMedia("(pointer: coarse)").matches;
  }, []);

  /*
   * Two-scroll pinned reveal:
   *   Scroll 1 → section pins, text stays dim/placed (user sees the layout)
   *   Scroll 2 → words reveal one-by-one + background widens
   *   Scroll 3 → unpin, move to next section
   *
   * Total pin distance = 2 × viewport height (two full "scroll pages").
   */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const section = sectionRef.current;
      const bg = bgRef.current;
      const wordEls = section?.querySelectorAll<HTMLElement>(".reveal-word");
      if (!section || !bg || !wordEls?.length) return;

      const mm = gsap.matchMedia();

      // Desktop: pinned scrubbed timeline
      mm.add("(min-width: 768px) and (pointer: fine)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            pin: true,
            start: "top 72px",
            end: "+=200%",
            scrub: 0.8,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });

        tl.to({}, { duration: 0.5 });
        tl.to(Array.from(wordEls), { opacity: 1, stagger: 0.02, duration: 0.4, ease: "power2.out" }, 0.5);
        tl.fromTo(bg,
          { clipPath: "inset(0 35% 0 35%)" },
          { clipPath: "inset(0 0% 0 0%)", ease: "power1.inOut", duration: 0.45 },
          0.5
        );
        tl.to({}, { duration: 0.05 });
      });

      // Mobile / touch: simple on-enter reveal, no pin, no scrub
      mm.add("(max-width: 767px), (pointer: coarse)", () => {
        gsap.fromTo(Array.from(wordEls),
          { opacity: 0.08 },
          {
            opacity: 1,
            stagger: 0.04,
            duration: 0.6,
            ease: "power2.out",
            immediateRender: false,
            scrollTrigger: {
              trigger: section,
              start: "top 75%",
              toggleActions: "play none none none",
              once: true,
            },
          }
        );
        gsap.fromTo(bg,
          { clipPath: "inset(0 20% 0 20%)" },
          {
            clipPath: "inset(0 0% 0 0%)",
            duration: 1.1,
            ease: "power1.inOut",
            immediateRender: false,
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              toggleActions: "play none none none",
              once: true,
            },
          }
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // Spawn sparkle particles + run RAF physics
  useEffect(() => {
    if (isTouch.current) return;
    const layer = particleLayerRef.current;
    const section = sectionRef.current;
    if (!layer || !section) return;

    const rect = section.getBoundingClientRect();
    const particles: Particle[] = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const el = document.createElement("div");
      const size = 2 + Math.random() * 3;
      const homeX = Math.random() * rect.width;
      const homeY = Math.random() * rect.height;
      Object.assign(el.style, {
        position: "absolute",
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "50%",
        background: `rgba(255,255,255,${0.15 + Math.random() * 0.25})`,
        left: `${homeX}px`,
        top: `${homeY}px`,
        pointerEvents: "none",
        willChange: "transform",
      });
      layer.appendChild(el);
      particles.push({ el, homeX, homeY, x: homeX, y: homeY, vx: 0, vy: 0, size });
    }
    particlesRef.current = particles;

    let raf: number;
    const tick = () => {
      const sRect = section.getBoundingClientRect();
      const mx = mouseRef.current.x - sRect.left;
      const my = mouseRef.current.y - sRect.top;

      for (const p of particles) {
        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.hypot(dx, dy);

        if (dist < SCATTER_RADIUS && dist > 1) {
          const force = Math.pow(1 - dist / SCATTER_RADIUS, 2) * 6;
          const angle = Math.atan2(dy, dx);
          p.vx += Math.cos(angle) * force;
          p.vy += Math.sin(angle) * force;
        }

        p.vx += (p.homeX - p.x) * 0.012;
        p.vy += (p.homeY - p.y) * 0.012;
        p.vx *= 0.92;
        p.vy *= 0.92;
        p.x += p.vx;
        p.y += p.vy;

        const speed = Math.hypot(p.vx, p.vy);
        const alpha = Math.min(1, 0.2 + speed * 0.12);

        p.el.style.transform = `translate(${p.x - p.homeX}px, ${p.y - p.homeY}px)`;
        p.el.style.opacity = `${alpha}`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      particles.forEach((p) => p.el.remove());
    };
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    mouseRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current = { x: -9999, y: -9999 };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="textreveal"
      className="panel relative flex items-center justify-center overflow-hidden"
      style={{ minHeight: 600 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Scroll-widening background */}
      <div
        ref={bgRef}
        className="absolute inset-0 pointer-events-none"
        style={{ clipPath: "inset(0 35% 0 35%)", willChange: "clip-path", borderRadius: "clamp(0px, 1.5vw, 16px)" }}
      >
        <img
          src={BG_IMAGE_URL}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ userSelect: "none" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, rgba(20,30,28,0.78) 0%, rgba(20,30,28,0.68) 50%, rgba(20,30,28,0.82) 100%)",
          }}
        />
      </div>

      {/* Sparkle particle layer */}
      <div ref={particleLayerRef} className="absolute inset-0 pointer-events-none z-[1]" />

      {/* Text */}
      <div
        className="relative z-10 w-full flex justify-center"
        style={{ paddingLeft: "var(--pad-x)", paddingRight: "var(--pad-x)" }}
      >
        <p
          className="text-center"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 400,
            fontSize: "clamp(1.6rem, 3.2vw, 3.4rem)",
            fontVariationSettings: "'SOFT' 60, 'WONK' 1",
            lineHeight: 1.55,
            maxWidth: "18ch",
          }}
        >
          {WORDS.flatMap((word, i) => {
            const el = (
              <span
                key={i}
                className="reveal-word"
                style={{ opacity: 0.08, display: "inline-block", color: "var(--accent-cream)" }}
              >
                {word}
              </span>
            );
            return i < WORDS.length - 1 ? [el, " "] : [el];
          })}
        </p>
      </div>
    </section>
  );
}
