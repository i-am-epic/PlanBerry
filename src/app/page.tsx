import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import ValueProp from "@/components/ValueProp";
import WhyChoose from "@/components/sections/WhyChoose";
import Approach from "@/components/sections/Approach";
import MediaProductionSection from "@/components/sections/MediaProduction";
import CaseStudiesPinned from "@/components/sections/CaseStudiesPinned";
import TextReveal from "@/components/TextReveal";
import Manifesto from "@/components/Manifesto";
import Stats from "@/components/Stats";
import Testimonials from "@/components/Testimonials";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import PhotoStream from "@/components/PhotoStream";
import GalleryTeaser from "@/components/GalleryTeaser";
import MarqueeDivider from "@/components/ui/MarqueeDivider";

export default function Home() {
  return (
    <>
      <Navbar />

      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main>
            <Hero />
            <Services />
            <MarqueeDivider id="divider-1" text="Crafted with intent" accent="in Bangalore" direction="left" fullscreen />
            <WhyChoose />
            <PhotoStream />
            <ValueProp />
            <Approach />
            <CaseStudiesPinned />
            <GalleryTeaser />
            <MediaProductionSection />
            <MarqueeDivider id="divider-2" text="Moments that stay" accent="with you" direction="right" fullscreen />
            <TextReveal />
            <Manifesto />
            <Stats />
            <Testimonials />
            {/* CTA + Footer combined as one snap section */}
            <section id="contact" className="panel relative" style={{ justifyContent: "flex-start" }}>
              <CTA />
              <Footer />
            </section>
          </main>
        </div>
      </div>
    </>
  );
}
