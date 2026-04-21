"use client";

import { useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { serviceImages } from "@/data/media";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    title: "Corporate Events",
    badge: "CORPORATES",
    tagline: "Strategy meets seamless execution.",
    description:
      "We partner with businesses to produce events that make an impact — conferences, brand activations, annual celebrations, and client engagement events.",
    capabilities: [
      "Meetings & Conferences",
      "Product Launches",
      "Annual Days & Awards",
      "Team-Building & Offsites",
      "Client Engagement",
      "AV & Technical Production",
    ],
    image: serviceImages.corporate,
  },
  {
    title: "Social Celebrations",
    badge: "CELEBRATIONS",
    tagline: "Every moment, beautifully orchestrated.",
    description:
      "From weddings and sangeet ceremonies to house-warmings and festive gatherings — every detail managed with care so you stay present.",
    capabilities: [
      "Weddings & Sangeet",
      "Engagements & Receptions",
      "House Warming",
      "Festive & Cultural",
      "Photo & Videography",
      "Entertainment & FX",
    ],
    image: serviceImages.social,
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
    const rx = ((e.clientY - rect.top - rect.height / 2) / rect.height) * -3;
    const ry = ((e.clientX - rect.left - rect.width / 2) / rect.width) * 3;
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
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="services"
      className="panel relative overflow-hidden"
      style={{ paddingBottom: "clamp(2rem, 4vh, 3rem)", perspective: 1200, background: "var(--bg-primary)" }}
    >
      <div className="w-full" style={{ paddingLeft: "var(--pad-x)", paddingRight: "var(--pad-x)" }}>
        <div ref={labelRef} className="mb-8 md:mb-10">
          <span
            className="text-xs uppercase tracking-[0.2em]"
            style={{ fontFamily: "var(--font-body)", fontWeight: 400, color: "var(--text-muted)" }}
          >
            What We Do
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-4 md:gap-5">
          {services.map((service, i) => (
            <div key={service.title} ref={(el) => { cardsRef.current[i] = el; }} className="flex">
              <TiltCard className="group relative rounded-[8px] overflow-hidden cursor-pointer w-full">
                {/* Image */}
                <div className="relative overflow-hidden aspect-[16/9]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    data-speed="0.82"
                    src={service.image}
                    alt={service.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
                    style={{ transform: "translateZ(0) scale(1.08)" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.85)] via-[rgba(0,0,0,0.2)] to-[rgba(0,0,0,0.05)]" />

                  {/* Badge */}
                  <div className="absolute top-4 right-4">
                    <span
                      className="inline-block px-3 py-1 rounded-full text-[9px] uppercase tracking-[0.1em] text-white bg-[rgba(255,255,255,0.1)] backdrop-blur-sm border border-[rgba(255,255,255,0.1)]"
                      style={{ fontFamily: "var(--font-body)", fontWeight: 500 }}
                    >
                      {service.badge}
                    </span>
                  </div>

                  {/* Bottom content overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                    <p className="text-[10px] uppercase tracking-[0.14em] text-[rgba(255,255,255,0.45)] mb-1.5" style={{ fontFamily: "var(--font-body)" }}>
                      {service.tagline}
                    </p>
                    <h3
                      className="text-xl md:text-2xl tracking-tight text-white mb-3"
                      style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontVariationSettings: "'SOFT' 50, 'WONK' 1", lineHeight: 1.1 }}
                    >
                      {service.title}
                    </h3>
                    <p
                      className="text-[0.8rem] leading-[1.7] mb-3 hidden sm:block"
                      style={{ fontFamily: "var(--font-body)", fontWeight: 300, color: "rgba(255,255,255,0.55)", maxWidth: "42ch" }}
                    >
                      {service.description}
                    </p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                      {service.capabilities.map((cap) => (
                        <span
                          key={cap}
                          className="text-[10px] text-[rgba(255,255,255,0.5)]"
                          style={{ fontFamily: "var(--font-body)", fontWeight: 300, letterSpacing: "0.02em" }}
                        >
                          {cap}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </TiltCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
