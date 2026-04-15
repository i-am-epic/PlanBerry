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
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);

    const mm = gsap.matchMedia();

    mm.add(
      {
        // Desktop / pointer:fine — full ScrollSmoother
        isDesktop: "(min-width: 900px) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
        // Touch / mobile — skip smoother entirely
        isTouch: "(max-width: 899px), (pointer: coarse), (prefers-reduced-motion: reduce)",
      },
      (ctx) => {
        const { isDesktop } = ctx.conditions as { isDesktop: boolean; isTouch: boolean };
        if (!isDesktop) {
          ScrollTrigger.refresh();
          return;
        }

        // Only routes that opt in with #smooth-wrapper / #smooth-content get smoothing.
        const wrapper = document.querySelector("#smooth-wrapper");
        const content = document.querySelector("#smooth-content");
        if (!wrapper || !content) {
          ScrollTrigger.refresh();
          return;
        }

        smootherRef.current = ScrollSmoother.create({
          wrapper: "#smooth-wrapper",
          content: "#smooth-content",
          smooth: 1.4,
          effects: true,
          smoothTouch: false,
          ignoreMobileResize: true,
          normalizeScroll: false,
        });

        ScrollTrigger.refresh();

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
          smootherRef.current = null;
        };
      }
    );

    return () => {
      mm.revert();
    };
  }, []);

  return <>{children}</>;
}
