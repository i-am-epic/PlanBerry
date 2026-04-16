"use client";

import { useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    title: "Corporate Events",
    badge: "CORPORATES",
    tagline: "Strategy meets seamless execution.",
    description:
      "We partner with businesses and organisations to produce events that make an impact — from strategic conferences and brand activations to annual celebrations and client engagement events.",
    capabilities: [
      "Corporate Meetings & Conferences",
      "Product Launches & Brand Activations",
      "Annual Days & Award Ceremonies",
      "Team-Building Events & Offsites",
      "Corporate Parties & Client Engagement",
      "AV, Stage & Technical Production",
    ],
    cta: "For corporates",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&q=80",
  },
  {
    title: "Social Celebrations",
    badge: "CELEBRATIONS",
    tagline: "Every moment, beautifully orchestrated.",
    description:
      "From weddings and sangeet ceremonies to house-warmings and festive gatherings — we manage every detail with care, so you stay present and enjoy the moment.",
    capabilities: [
      "Weddings & Sangeet Ceremonies",
      "Engagements & Receptions",
      "House Warming Ceremonies",
      "Festive & Cultural Events",
      "Photography & Videography",
      "Entertainment & Special Effects",
    ],
    cta: "For celebrations",
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1600&q=80",
  },
];

function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isTouch = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouch) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const rx = ((e.clientY - rect.top - rect.height / 2) / rect.height) * -4;
    const ry = ((e.clientX - rect.left - rect.width / 2) / rect.width) * 4;
    gsap.to(el, { rotateX: rx, rotateY: ry, duration: 0.4, ease: "power2.out", transformPerspective: 1000 });
  }, [isTouch]);

  const onLeave = useCallback(() => {
    if (isTouch) return;
    if (ref.current) gsap.to(ref.current, { rotateX: 0, rotateY: 0, duration: 0.6, ease: "power2.out" });
  }, [isTouch]);

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ transformStyle: isTouch ? "flat" : "preserve-3d" }}
    >
      {children}
    </div>
  );
}

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(labelRef.current, {
        y: 15, opacity: 0, duration: 0.6, ease: "expo.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 85%", toggleActions: "play none none reverse" },
      });

      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.from(card, {
          y: 50, opacity: 0, duration: 1, ease: "expo.out",
          scrollTrigger: { trigger: card, start: "top 90%", toggleActions: "play none none reverse" },
          delay: i * 0.12,
        });
      });

      // Image parallax is handled via data-speed="0.82" on each image wrapper
      // (ScrollSmoother effects: true) — no manual scrub needed here
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative overflow-hidden"
      style={{ padding: "clamp(6rem, 10vh, 10rem) 0", perspective: 1200, background: "#080808" }}
    >
      <div className="w-full" style={{ paddingLeft: "var(--pad-x)", paddingRight: "var(--pad-x)" }}>
        <div ref={labelRef} className="mb-10 md:mb-14">
          <span
            className="text-xs uppercase tracking-[0.2em] text-[#666]"
            style={{ fontFamily: "var(--font-body)", fontWeight: 400 }}
          >
            What We Do
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-5 md:gap-6 lg:gap-8">
          {services.map((service, i) => (
            <div key={service.title} ref={(el) => { cardsRef.current[i] = el; }} className="flex">
              <TiltCard className="group relative rounded-[10px] overflow-hidden cursor-pointer flex flex-col w-full">
                {/* Image — data-speed gives free parallax via ScrollSmoother */}
                <div className="relative overflow-hidden aspect-[4/3] md:aspect-[16/11]">
                  <img
                    data-speed="0.82"
                    src={service.image}
                    alt={service.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
                    style={{ transform: "translateZ(0) scale(1.08)" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.88)] via-[rgba(0,0,0,0.25)] to-[rgba(0,0,0,0.06)]" />

                  {/* Badge */}
                  <div className="absolute top-6 right-6 md:top-8 md:right-8" style={{ transform: "translateZ(20px)" }}>
                    <span
                      className="inline-block px-4 py-1.5 rounded-full text-[10px] uppercase tracking-[0.08em] text-white bg-[rgba(255,255,255,0.1)] backdrop-blur-sm border border-[rgba(255,255,255,0.1)]"
                      style={{ fontFamily: "var(--font-body)", fontWeight: 500 }}
                    >
                      {service.badge}
                    </span>
                  </div>

                  {/* Heading overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-7 md:p-10" style={{ transform: "translateZ(30px)" }}>
                    <p className="text-[11px] uppercase tracking-[0.14em] text-[rgba(255,255,255,0.45)] mb-2" style={{ fontFamily: "var(--font-body)" }}>
                      {service.tagline}
                    </p>
                    <h3
                      className="text-2xl md:text-3xl lg:text-[2.2rem] tracking-tight text-white transition-transform duration-500 group-hover:translate-x-1"
                      style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontVariationSettings: "'SOFT' 50, 'WONK' 1", lineHeight: 1.1 }}
                    >
                      {service.title}
                    </h3>
                  </div>
                </div>

                {/* Detail panel below image */}
                <div
                  className="bg-[#0f0f0f] border-t border-[rgba(255,255,255,0.06)] flex-1 flex flex-col"
                  style={{ padding: "clamp(1.5rem, 3vw, 2.2rem)" }}
                >
                  <p
                    className="text-sm leading-[1.85] mb-6"
                    style={{ fontFamily: "var(--font-body)", fontWeight: 300, color: "rgba(255,255,255,0.55)", maxWidth: "46ch" }}
                  >
                    {service.description}
                  </p>

                  {/* Capabilities list */}
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 mb-7">
                    {service.capabilities.map((cap) => (
                      <div key={cap} className="flex items-center gap-2.5">
                        <div className="w-[3px] h-[3px] rounded-full bg-[rgba(255,255,255,0.3)] shrink-0" />
                        <span
                          className="text-[12px] text-[rgba(255,255,255,0.55)]"
                          style={{ fontFamily: "var(--font-body)", fontWeight: 300, letterSpacing: "0.02em" }}
                        >
                          {cap}
                        </span>
                      </div>
                    ))}
                  </div>

                  <a
                    href="#contact"
                    className="inline-flex items-center gap-2 text-xs text-[rgba(255,255,255,0.5)] hover:text-white transition-colors duration-300 mt-auto"
                    style={{ fontFamily: "var(--font-body)", fontWeight: 400, letterSpacing: "0.06em", textTransform: "uppercase" }}
                  >
                    {service.cta}
                    <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </TiltCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
