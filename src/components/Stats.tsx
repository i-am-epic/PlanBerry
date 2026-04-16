"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: 150, suffix: "+", label: "Events delivered", badge: "EVENTS" },
  { value: 50,  suffix: "+", label: "Trusted clients", badge: "NETWORK" },
  { value: 8,   suffix: "K+", label: "Guests experienced", badge: "REACH" },
  { value: 100, suffix: "%", label: "End-to-end managed", badge: "DELIVERY" },
];

const clientLogos = [
  "Corporate Events", "Product Launches", "Weddings", "Sangeet Ceremonies",
  "Brand Activations", "Annual Days", "Team Building", "Conferences",
  "Award Ceremonies", "House Warmings",
];

/**
 * Count-up with a brief scramble pre-roll so the final digits feel earned,
 * not interpolated. Each frame during scramble swaps random digits; once
 * progress passes ~30%, we lock in true interpolated digits for the rest
 * of the ease-out-cubic settle.
 */
function AnimatedCounter({
  value, suffix, prefix, trigger,
}: {
  value: number; suffix: string; prefix?: string; trigger: boolean;
}) {
  const [display, setDisplay] = useState<string>(() => "0");

  useEffect(() => {
    if (!trigger) return;
    const digits = String(value).length;
    const steps = 70;
    const scrambleUntil = 0.32;
    let step = 0;

    const pad = (n: string) => n.padStart(digits, "0").replace(/^0+(?=\d)/, "");
    const randDigits = () =>
      Array.from({ length: digits }, () => Math.floor(Math.random() * 10)).join("");

    const timer = setInterval(() => {
      step++;
      const t = step / steps;
      if (t < scrambleUntil) {
        setDisplay(pad(randDigits()));
      } else {
        const eased = 1 - Math.pow(1 - (t - scrambleUntil) / (1 - scrambleUntil), 3);
        setDisplay(String(Math.floor(value * eased)));
      }
      if (step >= steps) {
        setDisplay(String(value));
        clearInterval(timer);
      }
    }, 1900 / steps);

    return () => clearInterval(timer);
  }, [trigger, value]);

  return <>{prefix}{display}{suffix}</>;
}

export default function Stats() {
  const sectionRef = useRef<HTMLElement>(null);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 70%",
        onEnter: () => setTriggered(true),
        once: true,
      });

      gsap.from(".stats-label", {
        y: 20, opacity: 0, duration: 0.7, ease: "expo.out",
        scrollTrigger: {
          trigger: sectionRef.current, start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.from(".stat-item", {
        y: 35, opacity: 0, duration: 1, stagger: 0.1, ease: "expo.out",
        scrollTrigger: {
          trigger: sectionRef.current, start: "top 70%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.from(".marquee-wrap", {
        opacity: 0, duration: 1.2, ease: "power2.out",
        scrollTrigger: {
          trigger: ".marquee-wrap", start: "top 92%",
          toggleActions: "play none none reverse",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ padding: "clamp(5rem, 9vh, 8rem) 0", background: "#080808" }}
    >
      {/* Top / bottom separator lines */}
      <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: "rgba(255,255,255,0.07)" }} />
      <div className="absolute bottom-0 left-0 right-0 h-[1px]" style={{ background: "rgba(255,255,255,0.07)" }} />

      <div className="relative w-full" style={{ paddingLeft: "var(--pad-x)", paddingRight: "var(--pad-x)" }}>

        {/* Label */}
        <div className="stats-label" style={{ marginBottom: "clamp(2.5rem, 5vh, 4rem)" }}>
          <span style={{
            fontFamily: "var(--font-body)",
            fontWeight: 400,
            fontSize: "0.7rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#555",
          }}>
            By the Numbers
          </span>
        </div>

        {/* Stats grid */}
        <div
          className="stats-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            marginBottom: "clamp(3rem, 6vh, 5rem)",
          }}
        >
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="stat-item"
              style={{
                padding: "clamp(1.5rem, 3vw, 2.5rem)",
                borderLeft: i % 2 === 1 ? "1px solid rgba(255,255,255,0.07)" : "none",
                borderTop: i >= 2 ? "1px solid rgba(255,255,255,0.07)" : "none",
              }}
            >
              {/* Badge */}
              <span style={{
                display: "inline-block",
                padding: "0.3rem 0.9rem",
                borderRadius: "999px",
                fontSize: "0.62rem",
                fontFamily: "var(--font-body)",
                fontWeight: 500,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#666",
                border: "1px solid rgba(255,255,255,0.1)",
                marginBottom: "clamp(1.25rem, 3vh, 2rem)",
              }}>
                {stat.badge}
              </span>

              {/* Number */}
              <div style={{
                fontFamily: "var(--font-display)",
                fontWeight: 400,
                fontSize: "clamp(3rem, 6vw, 6.5rem)",
                fontVariationSettings: "'SOFT' 20, 'WONK' 0",
                lineHeight: 1,
                color: "#ffffff",
                letterSpacing: "-0.02em",
                marginBottom: "0.75rem",
              }}>
                <AnimatedCounter value={stat.value} suffix={stat.suffix} trigger={triggered} />
              </div>

              {/* Label */}
              <p style={{
                fontFamily: "var(--font-body)",
                fontWeight: 400,
                fontSize: "0.72rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#555",
              }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Marquee */}
        <div className="marquee-wrap" style={{ position: "relative", overflow: "hidden" }}>
          <div style={{
            position: "absolute", left: 0, top: 0, bottom: 0, width: "6rem",
            background: "linear-gradient(to right, #080808, transparent)",
            zIndex: 10, pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", right: 0, top: 0, bottom: 0, width: "6rem",
            background: "linear-gradient(to left, #080808, transparent)",
            zIndex: 10, pointerEvents: "none",
          }} />
          <div className="animate-marquee" style={{ display: "flex", alignItems: "center", gap: "5rem", whiteSpace: "nowrap" }}>
            {[...clientLogos, ...clientLogos].map((logo, i) => (
              <span key={`${logo}-${i}`} style={{
                fontFamily: "var(--font-body)",
                fontWeight: 400,
                fontSize: "0.72rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#3a3a3a",
                cursor: "default",
                userSelect: "none",
                transition: "color 0.4s",
              }}
                onMouseEnter={(e) => { (e.target as HTMLElement).style.color = "#888"; }}
                onMouseLeave={(e) => { (e.target as HTMLElement).style.color = "#3a3a3a"; }}
              >
                {logo}
              </span>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
