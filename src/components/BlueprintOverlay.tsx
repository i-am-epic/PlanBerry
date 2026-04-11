"use client";

import { useRef, useCallback, useEffect } from "react";
import { gsap } from "gsap";

export default function BlueprintOverlay() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const turbRef = useRef<SVGFETurbulenceElement>(null);
  const vel = useRef({ x: 0, y: 0 });
  const prev = useRef({ x: 0, y: 0 });
  const rafId = useRef(0);

  // Animate turbulence based on mouse velocity
  useEffect(() => {
    let baseFreq = 0.012;

    const tick = () => {
      const speed = Math.sqrt(vel.current.x ** 2 + vel.current.y ** 2);
      const target = 0.007 + Math.min(speed * 0.0008, 0.04);
      baseFreq += (target - baseFreq) * 0.06;

      if (turbRef.current) {
        turbRef.current.setAttribute("baseFrequency", `${baseFreq.toFixed(4)}`);
      }

      vel.current.x *= 0.9;
      vel.current.y *= 0.9;

      rafId.current = requestAnimationFrame(tick);
    };

    rafId.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId.current);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const el = wrapperRef.current;
    const mask = maskRef.current;
    if (!el || !mask) return;

    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    vel.current = { x: x - prev.current.x, y: y - prev.current.y };
    prev.current = { x, y };

    gsap.to(mask, {
      "--mx": `${x}px`,
      "--my": `${y}px`,
      duration: 0.15,
      ease: "power2.out",
      overwrite: "auto",
    });
  }, []);

  const handleMouseEnter = useCallback((e: React.MouseEvent) => {
    const rect = wrapperRef.current?.getBoundingClientRect();
    if (rect) prev.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    if (maskRef.current) {
      gsap.to(maskRef.current, {
        "--radius": "420px",
        opacity: 1,
        duration: 0.7,
        ease: "power3.out",
      });
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (maskRef.current) {
      gsap.to(maskRef.current, {
        "--radius": "0px",
        opacity: 0,
        duration: 0.45,
        ease: "power2.in",
      });
    }
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="absolute inset-0 z-[5]"
      style={{ pointerEvents: "auto" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* SVG filter for amoeba distortion */}
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

      {/* Masked blueprint layer */}
      <div
        ref={maskRef}
        className="absolute inset-0 pointer-events-none"
        style={
          {
            "--mx": "50%",
            "--my": "50%",
            "--radius": "0px",
            opacity: 0,
          } as React.CSSProperties
        }
      >
        {/* Amoeba mask inner container */}
        <div
          className="absolute inset-0"
          style={{
            WebkitMaskImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Cdefs%3E%3Cfilter id='m'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.014' numOctaves='3' seed='8'/%3E%3CfeDisplacementMap in='SourceGraphic' scale='40' xChannelSelector='R' yChannelSelector='G'/%3E%3C/filter%3E%3CradialGradient id='g'%3E%3Cstop offset='45%25' stop-color='black'/%3E%3Cstop offset='100%25' stop-color='transparent'/%3E%3C/radialGradient%3E%3C/defs%3E%3Ccircle cx='50%25' cy='50%25' r='50%25' fill='url(%23g)' filter='url(%23m)'/%3E%3C/svg%3E")`,
            WebkitMaskSize: "var(--radius) var(--radius)",
            WebkitMaskPosition: "var(--mx) var(--my)",
            WebkitMaskRepeat: "no-repeat",
            maskImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Cdefs%3E%3Cfilter id='m'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.014' numOctaves='3' seed='8'/%3E%3CfeDisplacementMap in='SourceGraphic' scale='40' xChannelSelector='R' yChannelSelector='G'/%3E%3C/filter%3E%3CradialGradient id='g'%3E%3Cstop offset='45%25' stop-color='black'/%3E%3Cstop offset='100%25' stop-color='transparent'/%3E%3C/radialGradient%3E%3C/defs%3E%3Ccircle cx='50%25' cy='50%25' r='50%25' fill='url(%23g)' filter='url(%23m)'/%3E%3C/svg%3E")`,
            maskSize: "var(--radius) var(--radius)",
            maskPosition: "var(--mx) var(--my)",
            maskRepeat: "no-repeat",
            transform: "translate(calc(var(--radius) / -2), calc(var(--radius) / -2))",
            width: "calc(100% + var(--radius))",
            height: "calc(100% + var(--radius))",
          }}
        >
          {/* Dark overlay to push video back */}
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

          {/* Event venue floor plan SVG */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 1200 680"
            preserveAspectRatio="xMidYMid slice"
            style={{ opacity: 0.55 }}
          >
            {/* Outer venue boundary */}
            <rect x="80" y="60" width="1040" height="560" fill="none" stroke="rgba(80,160,255,0.6)" strokeWidth="2" />

            {/* Stage area — top centre */}
            <rect x="360" y="80" width="480" height="120" fill="rgba(80,160,255,0.06)" stroke="rgba(80,160,255,0.5)" strokeWidth="1.5" />
            <text x="600" y="148" textAnchor="middle" fill="rgba(80,160,255,0.6)" fontSize="13" fontFamily="monospace" letterSpacing="3">STAGE</text>
            {/* Stage steps */}
            <rect x="380" y="196" width="440" height="8" fill="none" stroke="rgba(80,160,255,0.3)" strokeWidth="1" />
            <rect x="400" y="200" width="400" height="6" fill="none" stroke="rgba(80,160,255,0.2)" strokeWidth="1" />

            {/* Bar — right side */}
            <rect x="960" y="200" width="140" height="280" fill="rgba(80,160,255,0.05)" stroke="rgba(80,160,255,0.45)" strokeWidth="1.5" />
            <text x="1030" y="344" textAnchor="middle" fill="rgba(80,160,255,0.55)" fontSize="11" fontFamily="monospace" letterSpacing="2">BAR</text>
            <line x1="970" y1="210" x2="970" y2="470" stroke="rgba(80,160,255,0.2)" strokeWidth="1" />

            {/* Entrance — bottom centre */}
            <rect x="480" y="580" width="240" height="40" fill="rgba(80,160,255,0.04)" stroke="rgba(80,160,255,0.4)" strokeWidth="1.5" strokeDasharray="6 3" />
            <text x="600" y="606" textAnchor="middle" fill="rgba(80,160,255,0.5)" fontSize="11" fontFamily="monospace" letterSpacing="3">ENTRANCE</text>
            {/* Entry arrows */}
            <line x1="580" y1="575" x2="580" y2="555" stroke="rgba(80,160,255,0.35)" strokeWidth="1" markerEnd="url(#arrow)" />
            <line x1="620" y1="575" x2="620" y2="555" stroke="rgba(80,160,255,0.35)" strokeWidth="1" />

            {/* Dance floor — centre */}
            <rect x="350" y="310" width="360" height="220" fill="rgba(80,160,255,0.04)" stroke="rgba(80,160,255,0.35)" strokeWidth="1.5" strokeDasharray="8 4" />
            <text x="530" y="428" textAnchor="middle" fill="rgba(80,160,255,0.4)" fontSize="11" fontFamily="monospace" letterSpacing="2">DANCE FLOOR</text>

            {/* Round dining tables — left cluster */}
            {[
              [170, 280], [170, 390], [170, 500],
              [260, 320], [260, 450],
            ].map(([cx, cy], i) => (
              <g key={i}>
                <circle cx={cx} cy={cy} r="36" fill="rgba(80,160,255,0.05)" stroke="rgba(80,160,255,0.4)" strokeWidth="1.5" />
                <circle cx={cx} cy={cy} r="4" fill="rgba(80,160,255,0.3)" />
                {/* 8 chairs around each table */}
                {Array.from({ length: 8 }).map((_, j) => {
                  const a = (j / 8) * Math.PI * 2 - Math.PI / 2;
                  const tx = cx + Math.cos(a) * 52;
                  const ty = cy + Math.sin(a) * 52;
                  return <circle key={j} cx={tx} cy={ty} r="7" fill="none" stroke="rgba(80,160,255,0.3)" strokeWidth="1" />;
                })}
              </g>
            ))}

            {/* Round dining tables — right cluster (between dance floor and bar) */}
            {[
              [780, 300], [780, 410], [780, 510],
              [870, 350], [870, 470],
            ].map(([cx, cy], i) => (
              <g key={`r${i}`}>
                <circle cx={cx} cy={cy} r="34" fill="rgba(80,160,255,0.05)" stroke="rgba(80,160,255,0.38)" strokeWidth="1.5" />
                <circle cx={cx} cy={cy} r="4" fill="rgba(80,160,255,0.3)" />
                {Array.from({ length: 8 }).map((_, j) => {
                  const a = (j / 8) * Math.PI * 2 - Math.PI / 2;
                  const tx = cx + Math.cos(a) * 48;
                  const ty = cy + Math.sin(a) * 48;
                  return <circle key={j} cx={tx} cy={ty} r="6" fill="none" stroke="rgba(80,160,255,0.28)" strokeWidth="1" />;
                })}
              </g>
            ))}

            {/* Dimension lines */}
            {/* Width */}
            <line x1="80" y1="640" x2="1120" y2="640" stroke="rgba(80,160,255,0.25)" strokeWidth="1" />
            <line x1="80" y1="635" x2="80" y2="645" stroke="rgba(80,160,255,0.25)" strokeWidth="1" />
            <line x1="1120" y1="635" x2="1120" y2="645" stroke="rgba(80,160,255,0.25)" strokeWidth="1" />
            <text x="600" y="658" textAnchor="middle" fill="rgba(80,160,255,0.4)" fontSize="10" fontFamily="monospace">40.0m</text>

            {/* Height */}
            <line x1="40" y1="60" x2="40" y2="620" stroke="rgba(80,160,255,0.25)" strokeWidth="1" />
            <line x1="35" y1="60" x2="45" y2="60" stroke="rgba(80,160,255,0.25)" strokeWidth="1" />
            <line x1="35" y1="620" x2="45" y2="620" stroke="rgba(80,160,255,0.25)" strokeWidth="1" />
            <text x="20" y="344" textAnchor="middle" fill="rgba(80,160,255,0.4)" fontSize="10" fontFamily="monospace" transform="rotate(-90, 20, 344)">22.0m</text>

            {/* Scale indicator */}
            <line x1="920" y1="630" x2="1060" y2="630" stroke="rgba(80,160,255,0.35)" strokeWidth="1.5" />
            <line x1="920" y1="625" x2="920" y2="635" stroke="rgba(80,160,255,0.35)" strokeWidth="1.5" />
            <line x1="1060" y1="625" x2="1060" y2="635" stroke="rgba(80,160,255,0.35)" strokeWidth="1.5" />
            <text x="990" y="648" textAnchor="middle" fill="rgba(80,160,255,0.45)" fontSize="9" fontFamily="monospace">SCALE 1:100</text>

            {/* North arrow */}
            <g transform="translate(108, 90)">
              <circle r="14" fill="none" stroke="rgba(80,160,255,0.3)" strokeWidth="1" />
              <path d="M0,-12 L4,6 L0,2 L-4,6 Z" fill="rgba(80,160,255,0.5)" />
              <text y="24" textAnchor="middle" fill="rgba(80,160,255,0.45)" fontSize="9" fontFamily="monospace">N</text>
            </g>

            {/* Corner cross-hairs */}
            <g stroke="rgba(80,160,255,0.3)" strokeWidth="1">
              <line x1="72" y1="52" x2="88" y2="52" /><line x1="80" y1="44" x2="80" y2="60" />
              <line x1="1112" y1="52" x2="1128" y2="52" /><line x1="1120" y1="44" x2="1120" y2="60" />
              <line x1="72" y1="618" x2="88" y2="618" /><line x1="80" y1="610" x2="80" y2="626" />
              <line x1="1112" y1="618" x2="1128" y2="618" /><line x1="1120" y1="610" x2="1120" y2="626" />
            </g>

            {/* Title block */}
            <rect x="80" y="60" width="200" height="36" fill="rgba(4,12,26,0.6)" />
            <text x="92" y="75" fill="rgba(80,160,255,0.7)" fontSize="10" fontFamily="monospace" letterSpacing="2">PLANBERRY EVENTS</text>
            <text x="92" y="89" fill="rgba(80,160,255,0.4)" fontSize="9" fontFamily="monospace" letterSpacing="1">VENUE LAYOUT — REV.3</text>
          </svg>

          {/* Subtle blue tint — brightens video slightly where visible */}
          <div className="absolute inset-0" style={{ background: "rgba(20,60,140,0.12)", mixBlendMode: "screen" }} />
        </div>

        {/* Corner registration marks — outside the mask */}
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
    </div>
  );
}
