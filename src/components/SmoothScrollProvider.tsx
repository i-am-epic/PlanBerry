"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const smootherRef = useRef<ScrollSmoother | null>(null);

  useEffect(() => {
    // Ensure the page always starts at the top on fresh load / refresh
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);

    // Create ScrollSmoother — must exist before child ScrollTriggers fire
    // (effects: true enables data-speed and data-lag on any element in #smooth-content)
    smootherRef.current = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1.4,
      effects: true,
      smoothTouch: 0.1,
      ignoreMobileResize: true,
      normalizeScroll: false, // leave inner overflow containers alone
    });

    // After ScrollSmoother rewraps data-speed elements, refresh all ST positions
    ScrollTrigger.refresh();

    // Magnetic snap on hero — only snaps within 10% of extremes
    const heroSection = document.getElementById("hero");
    if (heroSection) {
      ScrollTrigger.create({
        trigger: heroSection,
        start: "top top",
        end: "bottom top",
        snap: {
          snapTo: (value: number) => {
            if (value <= 0.1) return 0;
            if (value >= 0.9) return 1;
            return value;
          },
          duration: { min: 0.15, max: 0.3 },
          delay: 0.05,
          ease: "power1.inOut",
        },
      });
    }

    return () => {
      smootherRef.current?.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return <>{children}</>;
}
