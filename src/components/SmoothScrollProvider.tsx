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

    // Refresh ScrollTrigger once all images + fonts have loaded so trigger
    // start/end positions reflect the real, fully-rendered layout instead of
    // placeholder heights (otherwise below-fold animations fire late).
    const refreshOnLoad = () => ScrollTrigger.refresh();
    if (document.readyState === "complete") {
      queueMicrotask(refreshOnLoad);
    } else {
      window.addEventListener("load", refreshOnLoad, { once: true });
    }

    const mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: "(min-width: 900px) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
        isTouch: "(max-width: 899px), (pointer: coarse), (prefers-reduced-motion: reduce)",
      },
      (ctx) => {
        const { isDesktop } = ctx.conditions as { isDesktop: boolean; isTouch: boolean };

        if (!isDesktop) {
          // ── Mobile: free scroll, no snap ────────────────────────────────
          ScrollTrigger.refresh();
          return;
        }

        // ── Desktop: ScrollSmoother only, no snap ──────────────────────
        const wrapper = document.querySelector("#smooth-wrapper");
        const content = document.querySelector("#smooth-content");
        if (!wrapper || !content) {
          ScrollTrigger.refresh();
          return;
        }

        smootherRef.current = ScrollSmoother.create({
          wrapper: "#smooth-wrapper",
          content: "#smooth-content",
          smooth: 0.6,
          effects: true,
          smoothTouch: false,
          ignoreMobileResize: true,
          normalizeScroll: true,
        });

        ScrollTrigger.refresh();

        return () => {
          smootherRef.current?.kill();
          smootherRef.current = null;
        };
      }
    );

    return () => {
      window.removeEventListener("load", refreshOnLoad);
      mm.revert();
    };
  }, []);

  return <>{children}</>;
}
