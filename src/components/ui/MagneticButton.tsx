"use client";

import { forwardRef, useImperativeHandle, useRef, useEffect, type ButtonHTMLAttributes, type ReactNode } from "react";
import { gsap } from "gsap";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  strength?: number;
  radius?: number;
};

const MagneticButton = forwardRef<HTMLButtonElement, Props>(function MagneticButton(
  { children, strength = 0.35, radius = 110, className, style, ...rest },
  forwardedRef
) {
  const innerRef = useRef<HTMLButtonElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  useImperativeHandle(forwardedRef, () => innerRef.current as HTMLButtonElement);

  useEffect(() => {
    const el = innerRef.current;
    const label = labelRef.current;
    if (!el || !label) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      const reach = radius + Math.max(rect.width, rect.height) / 2;
      if (dist < reach) {
        gsap.to(el, { x: dx * strength, y: dy * strength, duration: 0.55, ease: "power3.out" });
        gsap.to(label, { x: dx * strength * 0.4, y: dy * strength * 0.4, duration: 0.55, ease: "power3.out" });
      } else {
        gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.5)" });
        gsap.to(label, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.5)" });
      }
    };

    const onLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.5)" });
      gsap.to(label, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.5)" });
    };

    window.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [strength, radius]);

  return (
    <button
      ref={innerRef}
      className={className}
      style={{ willChange: "transform", ...style }}
      {...rest}
    >
      <span ref={labelRef} className="inline-flex items-center gap-2.5" style={{ willChange: "transform" }}>
        {children}
      </span>
    </button>
  );
});

export default MagneticButton;
