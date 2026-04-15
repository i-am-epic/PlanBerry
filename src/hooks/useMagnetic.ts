"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

type Options = {
  strength?: number;
  radius?: number;
};

export function useMagnetic<T extends HTMLElement>({
  strength = 0.35,
  radius = 90,
}: Options = {}) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist < radius + Math.max(rect.width, rect.height) / 2) {
        gsap.to(el, {
          x: dx * strength,
          y: dy * strength,
          duration: 0.6,
          ease: "power3.out",
        });
      } else {
        gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.5)" });
      }
    };

    const onLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.5)" });
    };

    window.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [strength, radius]);

  return ref;
}
