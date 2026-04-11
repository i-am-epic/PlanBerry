"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const portfolioItems = [
  {
    title: "Infosys Global Summit",
    category: "Corporate",
    image:
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&q=80",
    size: "large",
  },
  {
    title: "Royal Mysore Wedding",
    category: "Celebration",
    image:
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&q=80",
    size: "small",
  },
  {
    title: "Startup India Fest",
    category: "Festival",
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=80",
    size: "small",
  },
  {
    title: "Wipro Annual Gala",
    category: "Corporate",
    image:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&q=80",
    size: "large",
  },
];

export default function Portfolio() {
  const sectionRef = useRef<HTMLElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      itemsRef.current.forEach((item) => {
        if (!item) return;

        gsap.from(item, {
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: "expo.out",
          scrollTrigger: {
            trigger: item,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });

        const img = item.querySelector(".portfolio-img");
        if (img) {
          gsap.to(img, {
            y: -15,
            scrollTrigger: {
              trigger: item,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.5,
            },
          });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="portfolio"
      className="relative py-20 md:py-32"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        {/* Section header */}
        <div className="flex items-center gap-4 mb-6">
          <span className="text-xs uppercase tracking-[0.2em] text-[#666]">
            Selected Work
          </span>
          <div className="flex-1 h-[1px] bg-[rgba(255,255,255,0.15)]" />
        </div>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-4">
          <h2
            className="text-3xl md:text-5xl tracking-tight"
            style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}
          >
            Events that speak
            <br />
            <span className="italic">for themselves</span>
          </h2>
          <a
            href="#contact"
            className="btn-secondary self-start md:self-auto"
            style={{ padding: "10px 24px", fontSize: "0.8rem" }}
          >
            View All Work
          </a>
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {portfolioItems.map((item, i) => (
            <div
              key={item.title}
              ref={(el) => {
                itemsRef.current[i] = el;
              }}
              className={`group relative overflow-hidden rounded-[10px] cursor-pointer ${
                item.size === "large"
                  ? "h-[350px] md:h-[500px]"
                  : "h-[300px] md:h-[400px]"
              }`}
            >
              <img
                src={item.image}
                alt={item.title}
                className="portfolio-img absolute inset-0 w-full h-full object-cover scale-[1.02] transition-transform duration-[1.5s] ease-[var(--ease-out-expo)] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(26,26,26,0.9)] via-[rgba(26,26,26,0.2)] to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-90" />

              {/* Content overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10">
                <span className="text-xs uppercase tracking-[0.15em] text-[#999] mb-2 block">
                  {item.category}
                </span>
                <h3
                  className="text-xl md:text-2xl tracking-tight transition-transform duration-500 group-hover:translate-x-1"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 400,
                  }}
                >
                  {item.title}
                </h3>
                <div className="mt-4 flex items-center gap-2 opacity-0 translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
                  <span className="text-xs text-[#999] tracking-wide">
                    View Project
                  </span>
                  <svg
                    className="w-3.5 h-3.5 text-[#999]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
