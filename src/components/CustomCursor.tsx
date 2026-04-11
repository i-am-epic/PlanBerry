"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function CustomCursor() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const turbInnerRef = useRef<SVGFETurbulenceElement>(null);
  const turbOuterRef = useRef<SVGFETurbulenceElement>(null);

  const mouse = useRef({ x: -300, y: -300 });
  const pos = useRef({ x: -300, y: -300 });
  const vel = useRef({ x: 0, y: 0 });
  const prevMouse = useRef({ x: -300, y: -300 });
  const freqInner = useRef(0.008);
  const freqOuter = useRef(0.005);

  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;

    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    // Hide native cursor site-wide
    document.documentElement.style.cursor = "none";

    let raf: number;
    let entered = false;

    const onMove = (e: MouseEvent) => {
      if (!entered) {
        gsap.to(wrapper, { opacity: 1, duration: 0.5, ease: "power2.out" });
        entered = true;
      }
      prevMouse.current = { ...mouse.current };
      mouse.current = { x: e.clientX, y: e.clientY };
      vel.current = {
        x: mouse.current.x - prevMouse.current.x,
        y: mouse.current.y - prevMouse.current.y,
      };
    };

    const tick = () => {
      // Smooth follow — slightly lagged for organic feel
      pos.current.x += (mouse.current.x - pos.current.x) * 0.18;
      pos.current.y += (mouse.current.y - pos.current.y) * 0.18;

      const speed = Math.hypot(vel.current.x, vel.current.y);

      // Turbulence — subtle range, stays mostly round
      const targetFreq = 0.006 + Math.min(speed * 0.0006, 0.018);
      freqInner.current += (targetFreq - freqInner.current) * 0.05;

      // Idle gentle pulse — barely noticeable, keeps blob alive
      if (speed < 1) {
        const t = performance.now() / 4000;
        const breath = 0.005 + Math.sin(t) * 0.001;
        freqInner.current += (breath - freqInner.current) * 0.012;
      }

      turbInnerRef.current?.setAttribute(
        "baseFrequency",
        `${freqInner.current.toFixed(5)} ${(freqInner.current * 0.85).toFixed(5)}`
      );

      gsap.set(wrapper, { x: pos.current.x, y: pos.current.y });

      // Very gentle squish — max 15% deform
      const angle = Math.atan2(vel.current.y, vel.current.x) * (180 / Math.PI);
      const sX = 1 + Math.min(Math.abs(vel.current.x) * 0.008, 0.15);
      const sY = 1 + Math.min(Math.abs(vel.current.y) * 0.008, 0.15);

      if (speed > 2) {
        gsap.to(wrapper, {
          scaleX: sX,
          scaleY: sY,
          rotation: angle,
          duration: 0.25,
          ease: "power2.out",
          overwrite: "auto",
        });
      } else {
        gsap.to(wrapper, {
          scaleX: 1,
          scaleY: 1,
          rotation: 0,
          duration: 1.2,
          ease: "elastic.out(1, 0.5)",
          overwrite: "auto",
        });
      }

      vel.current.x *= 0.7;
      vel.current.y *= 0.7;

      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      document.documentElement.style.cursor = "";
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="fixed top-0 left-0 z-[9999] pointer-events-none hidden md:block"
      style={{
        width: 72,
        height: 72,
        marginLeft: -36,
        marginTop: -36,
        mixBlendMode: "difference",
        opacity: 0,
        willChange: "transform",
      }}
    >
      <svg
        width="72"
        height="72"
        viewBox="0 0 72 72"
        style={{ overflow: "visible" }}
      >
        <defs>
          {/* Liquid blob filter */}
          <filter
            id="cursor-liquid"
            x="-80%"
            y="-80%"
            width="260%"
            height="260%"
            colorInterpolationFilters="linearRGB"
          >
            <feTurbulence
              ref={turbInnerRef}
              type="fractalNoise"
              baseFrequency="0.008 0.006"
              numOctaves="4"
              seed="7"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="10"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
          {/* Unused but ref required by component */}
          <filter id="cursor-noop">
            <feTurbulence ref={turbOuterRef} type="fractalNoise" baseFrequency="0.001" numOctaves="1" seed="1" />
          </filter>
        </defs>
        {/* Single liquid blob — no outline ring */}
        <circle
          cx="36"
          cy="36"
          r="22"
          fill="white"
          filter="url(#cursor-liquid)"
        />
      </svg>
    </div>
  );
}
