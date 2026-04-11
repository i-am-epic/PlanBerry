"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import FloralArchScene from "@/components/FloralArchScene";
import ValueProp from "@/components/ValueProp";
import ParallaxShowcase from "@/components/ParallaxShowcase";
import TextReveal from "@/components/TextReveal";
import Manifesto from "@/components/Manifesto";
import Stats from "@/components/Stats";
import Testimonials from "@/components/Testimonials";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import CustomCursor from "@/components/CustomCursor";
import ContactModal from "@/components/ContactModal";

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      {/*
       * Fixed / overlay UI — lives OUTSIDE #smooth-content so ScrollSmoother
       * transforms don't affect them (per GSAP docs: "position:fixed elements
       * can go outside the smooth-wrapper").
       */}
      <ScrollProgress />
      <CustomCursor />
      <ContactModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <Navbar onCtaClick={() => setModalOpen(true)} />

      {/* ── ScrollSmoother container ── */}
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main>
            <Hero onCtaClick={() => setModalOpen(true)} />
            <Services />
            <FloralArchScene />
            <ValueProp />
            <ParallaxShowcase />
            <TextReveal />
            <Manifesto />
            <Stats />
            <Testimonials />
            <CTA onCtaClick={() => setModalOpen(true)} />
          </main>
          <Footer onCtaClick={() => setModalOpen(true)} />
        </div>
      </div>
    </>
  );
}
