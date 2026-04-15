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
import FloralArchSceneLoader from "@/components/FloralArchSceneLoader";

export default function Home() {
  return (
    <>
      <Navbar />

      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main>
            <Hero />
            <Services />
            <WhyChoose />
            <FloralArchSceneLoader />
            <ValueProp />
            <Approach />
            <CaseStudiesPinned />
            <MediaProductionSection />
            <TextReveal />
            <Manifesto />
            <Stats />
            <Testimonials />
            <CTA />
          </main>
          <Footer />
        </div>
      </div>
    </>
  );
}
