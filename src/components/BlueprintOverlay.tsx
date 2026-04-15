"use client";

import { useRef, useCallback, useEffect } from "react";
import { gsap } from "gsap";

// Solid-fill mask — no radial gradient, so edges are fully opaque (no blur)
const MASK_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Cdefs%3E%3Cfilter id='m'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.014' numOctaves='3' seed='8'/%3E%3CfeDisplacementMap in='SourceGraphic' scale='40' xChannelSelector='R' yChannelSelector='G'/%3E%3C/filter%3E%3C/defs%3E%3Ccircle cx='50%25' cy='50%25' r='46%25' fill='black' filter='url(%23m)'/%3E%3C/svg%3E")`;

export default function BlueprintOverlay() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const borderRef = useRef<HTMLDivElement>(null);
  const turbRef = useRef<SVGFETurbulenceElement>(null);

  // Spring physics state (all mutable refs — no re-renders)
  const targetPos = useRef({ x: 0, y: 0 });
  const springPos = useRef({ x: 0, y: 0 });
  const springVel = useRef({ x: 0, y: 0 });
  const currentRadius = useRef({ r: 0 });
  const rafId = useRef(0);

  // Spring loop — drives both position and turbulence animation
  useEffect(() => {
    let baseFreq = 0.012;
    const STIFFNESS = 0.06;  // lower = more lag / heavier feel
    const DAMPING   = 0.76;  // lower = more oscillation

    const tick = () => {
      // ── Spring physics ──────────────────────────────────────────────────
      springVel.current.x += (targetPos.current.x - springPos.current.x) * STIFFNESS;
      springVel.current.y += (targetPos.current.y - springPos.current.y) * STIFFNESS;
      springVel.current.x *= DAMPING;
      springVel.current.y *= DAMPING;
      springPos.current.x += springVel.current.x;
      springPos.current.y += springVel.current.y;

      const speed = Math.sqrt(springVel.current.x ** 2 + springVel.current.y ** 2);

      // ── Turbulence tracks speed ──────────────────────────────────────────
      const targetFreq = 0.007 + Math.min(speed * 0.0006, 0.035);
      baseFreq += (targetFreq - baseFreq) * 0.08;
      turbRef.current?.setAttribute("baseFrequency", `${baseFreq.toFixed(4)}`);

      // ── Push spring position + radius into CSS vars on wrapper ──────────
      const w = wrapperRef.current;
      if (w) {
        const r = currentRadius.current.r;
        w.style.setProperty("--mx", `${springPos.current.x}px`);
        w.style.setProperty("--my", `${springPos.current.y}px`);
        w.style.setProperty("--radius", `${r}px`);

        // Size the border ring directly (avoids second CSS-var lookup)
        const b = borderRef.current;
        if (b) {
          b.style.width  = `${r}px`;
          b.style.height = `${r}px`;
        }
      }

      rafId.current = requestAnimationFrame(tick);
    };

    rafId.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId.current);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = wrapperRef.current?.getBoundingClientRect();
    if (!rect) return;
    targetPos.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }, []);

  const handleMouseEnter = useCallback((e: React.MouseEvent) => {
    const rect = wrapperRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Snap spring to cursor — zero lag on entry
    springPos.current = { x, y };
    targetPos.current  = { x, y };
    springVel.current  = { x: 0, y: 0 };

    // Animate radius open
    gsap.killTweensOf(currentRadius.current);
    gsap.to(currentRadius.current, { r: 420, duration: 0.75, ease: "power3.out" });

    // Fade in blueprint + border
    gsap.to(maskRef.current,   { opacity: 1, duration: 0.4,  ease: "power2.out" });
    gsap.to(borderRef.current, { opacity: 1, duration: 0.55, ease: "power2.out" });
  }, []);

  const handleMouseLeave = useCallback(() => {
    // Collapse radius
    gsap.killTweensOf(currentRadius.current);
    gsap.to(currentRadius.current, { r: 0, duration: 0.5, ease: "power2.in" });

    // Fade out
    gsap.to(maskRef.current,   { opacity: 0, duration: 0.45, ease: "power2.in" });
    gsap.to(borderRef.current, { opacity: 0, duration: 0.35, ease: "power2.in" });
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="absolute inset-0 z-[5]"
      style={
        {
          pointerEvents: "auto",
          "--mx": "50%",
          "--my": "50%",
          "--radius": "0px",
        } as React.CSSProperties
      }
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* ── SVG filter — turbulence animates in RAF loop ── */}
      <svg className="absolute w-0 h-0" aria-hidden>
        <defs>
          <filter id="amoeba-mask-filter" x="-30%" y="-30%" width="160%" height="160%">
            <feTurbulence
              ref={turbRef}
              type="fractalNoise"
              baseFrequency="0.012"
              numOctaves="4"
              seed="3"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="48"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* ── Blueprint mask layer ── */}
      <div
        ref={maskRef}
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: 0 }}
      >
        {/*
         * Solid mask (no radial gradient) → opaque hard edges.
         * The SVG's own feTurbulence distorts the circle into an amoeba.
         * translate + oversize keeps the mask centred on the cursor via CSS vars.
         */}
        <div
          className="absolute inset-0"
          style={{
            WebkitMaskImage: MASK_SVG,
            WebkitMaskSize: "var(--radius) var(--radius)",
            WebkitMaskPosition: "var(--mx) var(--my)",
            WebkitMaskRepeat: "no-repeat",
            maskImage: MASK_SVG,
            maskSize: "var(--radius) var(--radius)",
            maskPosition: "var(--mx) var(--my)",
            maskRepeat: "no-repeat",
            transform: "translate(calc(var(--radius) / -2), calc(var(--radius) / -2))",
            width: "calc(100% + var(--radius))",
            height: "calc(100% + var(--radius))",
          }}
        >
          {/* Dark overlay */}
          <div className="absolute inset-0" style={{ background: "rgba(4,12,26,0.82)" }} />

          {/* Blueprint grid — fine + coarse */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(80,160,255,0.28) 1px, transparent 1px),
                linear-gradient(90deg, rgba(80,160,255,0.28) 1px, transparent 1px),
                linear-gradient(rgba(80,160,255,0.10) 1px, transparent 1px),
                linear-gradient(90deg, rgba(80,160,255,0.10) 1px, transparent 1px)
              `,
              backgroundSize: "120px 120px, 120px 120px, 24px 24px, 24px 24px",
            }}
          />

          {/* Event venue floor plan */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 1200 680"
            preserveAspectRatio="xMidYMid slice"
            style={{ opacity: 0.55 }}
          >
            <rect x="80" y="60" width="1040" height="560" fill="none" stroke="rgba(80,160,255,0.6)" strokeWidth="2" />
            <rect x="360" y="80" width="480" height="120" fill="rgba(80,160,255,0.06)" stroke="rgba(80,160,255,0.5)" strokeWidth="1.5" />
            <text x="600" y="148" textAnchor="middle" fill="rgba(80,160,255,0.6)" fontSize="13" fontFamily="monospace" letterSpacing="3">STAGE</text>
            <rect x="380" y="196" width="440" height="8" fill="none" stroke="rgba(80,160,255,0.3)" strokeWidth="1" />
            <rect x="400" y="200" width="400" height="6" fill="none" stroke="rgba(80,160,255,0.2)" strokeWidth="1" />
            <rect x="960" y="200" width="140" height="280" fill="rgba(80,160,255,0.05)" stroke="rgba(80,160,255,0.45)" strokeWidth="1.5" />
            <text x="1030" y="344" textAnchor="middle" fill="rgba(80,160,255,0.55)" fontSize="11" fontFamily="monospace" letterSpacing="2">BAR</text>
            <line x1="970" y1="210" x2="970" y2="470" stroke="rgba(80,160,255,0.2)" strokeWidth="1" />
            <rect x="480" y="580" width="240" height="40" fill="rgba(80,160,255,0.04)" stroke="rgba(80,160,255,0.4)" strokeWidth="1.5" strokeDasharray="6 3" />
            <text x="600" y="606" textAnchor="middle" fill="rgba(80,160,255,0.5)" fontSize="11" fontFamily="monospace" letterSpacing="3">ENTRANCE</text>
            <rect x="350" y="310" width="360" height="220" fill="rgba(80,160,255,0.04)" stroke="rgba(80,160,255,0.35)" strokeWidth="1.5" strokeDasharray="8 4" />
            <text x="530" y="428" textAnchor="middle" fill="rgba(80,160,255,0.4)" fontSize="11" fontFamily="monospace" letterSpacing="2">DANCE FLOOR</text>
            {[
              [170, 280], [170, 390], [170, 500],
              [260, 320], [260, 450],
            ].map(([cx, cy], i) => (
              <g key={i}>
                <circle cx={cx} cy={cy} r="36" fill="rgba(80,160,255,0.05)" stroke="rgba(80,160,255,0.4)" strokeWidth="1.5" />
                <circle cx={cx} cy={cy} r="4" fill="rgba(80,160,255,0.3)" />
                {Array.from({ length: 8 }).map((_, j) => {
                  const a = (j / 8) * Math.PI * 2 - Math.PI / 2;
                  return <circle key={j} cx={cx + Math.cos(a) * 52} cy={cy + Math.sin(a) * 52} r="7" fill="none" stroke="rgba(80,160,255,0.3)" strokeWidth="1" />;
                })}
              </g>
            ))}
            {[
              [780, 300], [780, 410], [780, 510],
              [870, 350], [870, 470],
            ].map(([cx, cy], i) => (
              <g key={`r${i}`}>
                <circle cx={cx} cy={cy} r="34" fill="rgba(80,160,255,0.05)" stroke="rgba(80,160,255,0.38)" strokeWidth="1.5" />
                <circle cx={cx} cy={cy} r="4" fill="rgba(80,160,255,0.3)" />
                {Array.from({ length: 8 }).map((_, j) => {
                  const a = (j / 8) * Math.PI * 2 - Math.PI / 2;
                  return <circle key={j} cx={cx + Math.cos(a) * 48} cy={cy + Math.sin(a) * 48} r="6" fill="none" stroke="rgba(80,160,255,0.28)" strokeWidth="1" />;
                })}
              </g>
            ))}
            <line x1="80" y1="640" x2="1120" y2="640" stroke="rgba(80,160,255,0.25)" strokeWidth="1" />
            <line x1="80" y1="635" x2="80" y2="645" stroke="rgba(80,160,255,0.25)" strokeWidth="1" />
            <line x1="1120" y1="635" x2="1120" y2="645" stroke="rgba(80,160,255,0.25)" strokeWidth="1" />
            <text x="600" y="658" textAnchor="middle" fill="rgba(80,160,255,0.4)" fontSize="10" fontFamily="monospace">40.0m</text>
            <line x1="40" y1="60" x2="40" y2="620" stroke="rgba(80,160,255,0.25)" strokeWidth="1" />
            <line x1="35" y1="60" x2="45" y2="60" stroke="rgba(80,160,255,0.25)" strokeWidth="1" />
            <line x1="35" y1="620" x2="45" y2="620" stroke="rgba(80,160,255,0.25)" strokeWidth="1" />
            <text x="20" y="344" textAnchor="middle" fill="rgba(80,160,255,0.4)" fontSize="10" fontFamily="monospace" transform="rotate(-90, 20, 344)">22.0m</text>
            <line x1="920" y1="630" x2="1060" y2="630" stroke="rgba(80,160,255,0.35)" strokeWidth="1.5" />
            <line x1="920" y1="625" x2="920" y2="635" stroke="rgba(80,160,255,0.35)" strokeWidth="1.5" />
            <line x1="1060" y1="625" x2="1060" y2="635" stroke="rgba(80,160,255,0.35)" strokeWidth="1.5" />
            <text x="990" y="648" textAnchor="middle" fill="rgba(80,160,255,0.45)" fontSize="9" fontFamily="monospace">SCALE 1:100</text>
            <g transform="translate(108, 90)">
              <circle r="14" fill="none" stroke="rgba(80,160,255,0.3)" strokeWidth="1" />
              <path d="M0,-12 L4,6 L0,2 L-4,6 Z" fill="rgba(80,160,255,0.5)" />
              <text y="24" textAnchor="middle" fill="rgba(80,160,255,0.45)" fontSize="9" fontFamily="monospace">N</text>
            </g>
            <g stroke="rgba(80,160,255,0.3)" strokeWidth="1">
              <line x1="72" y1="52" x2="88" y2="52" /><line x1="80" y1="44" x2="80" y2="60" />
              <line x1="1112" y1="52" x2="1128" y2="52" /><line x1="1120" y1="44" x2="1120" y2="60" />
              <line x1="72" y1="618" x2="88" y2="618" /><line x1="80" y1="610" x2="80" y2="626" />
              <line x1="1112" y1="618" x2="1128" y2="618" /><line x1="1120" y1="610" x2="1120" y2="626" />
            </g>
            <rect x="80" y="60" width="200" height="36" fill="rgba(4,12,26,0.6)" />
            <text x="92" y="75" fill="rgba(80,160,255,0.7)" fontSize="10" fontFamily="monospace" letterSpacing="2">PLANBERRY EVENTS</text>
            <text x="92" y="89" fill="rgba(80,160,255,0.4)" fontSize="9" fontFamily="monospace" letterSpacing="1">VENUE LAYOUT — REV.3</text>
          </svg>

          <div className="absolute inset-0" style={{ background: "rgba(20,60,140,0.12)", mixBlendMode: "screen" }} />
        </div>
      </div>

      {/*
       * ── Border ring ──────────────────────────────────────────────────────────
       * Centred on the spring cursor position.
       * filter: url(#amoeba-mask-filter) distorts the circle into a wavy amoeba
       * shape that matches the turbulence-driven mask, giving the border a
       * fluid organic outline with hard, opaque edges.
       */}
      <div
        ref={borderRef}
        className="absolute pointer-events-none"
        style={{
          width: "0px",
          height: "0px",
          left: "var(--mx)",
          top: "var(--my)",
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          border: "1.5px solid rgba(80, 160, 255, 0.85)",
          filter: "url(#amoeba-mask-filter)",
          opacity: 0,
          willChange: "width, height, transform",
        }}
      />

      {/* Corner registration marks */}
      <svg className="absolute top-8 left-8 w-6 h-6" style={{ color: "rgba(80,160,255,0.45)" }}>
        <line x1="0" y1="0" x2="12" y2="0" stroke="currentColor" strokeWidth="1" />
        <line x1="0" y1="0" x2="0" y2="12" stroke="currentColor" strokeWidth="1" />
      </svg>
      <svg className="absolute top-8 right-8 w-6 h-6" style={{ color: "rgba(80,160,255,0.45)" }}>
        <line x1="12" y1="0" x2="24" y2="0" stroke="currentColor" strokeWidth="1" />
        <line x1="24" y1="0" x2="24" y2="12" stroke="currentColor" strokeWidth="1" />
      </svg>
      <svg className="absolute bottom-8 left-8 w-6 h-6" style={{ color: "rgba(80,160,255,0.45)" }}>
        <line x1="0" y1="12" x2="0" y2="24" stroke="currentColor" strokeWidth="1" />
        <line x1="0" y1="24" x2="12" y2="24" stroke="currentColor" strokeWidth="1" />
      </svg>
      <svg className="absolute bottom-8 right-8 w-6 h-6" style={{ color: "rgba(80,160,255,0.45)" }}>
        <line x1="24" y1="12" x2="24" y2="24" stroke="currentColor" strokeWidth="1" />
        <line x1="12" y1="24" x2="24" y2="24" stroke="currentColor" strokeWidth="1" />
      </svg>
    </div>
  );
}
