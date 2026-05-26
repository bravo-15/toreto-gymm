import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import Navbar from "../../components/layout/Navbar";
import Hero from "../../components/sections/Hero";
import About from "../../components/sections/About";
import Services from "../../components/sections/Services";
import Plans from "../../components/sections/Plans";
import Trainers from "../../components/sections/Trainers";
import Testimonials from "../../components/sections/Testimonials";
import Contact from "../../components/sections/Contact";
import Stats from "../../components/sections/Stats";
import Gallery from "../../components/sections/Gallery";
import WhatsAppButton from "../../components/common/WhatsAppButton";
import Footer from "../../components/layout/Footer";

const animacionSeccion = {
  hidden: {
    opacity: 0,
    y: 70,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

function AnimatedSection({ children }) {
  return (
    <motion.div
      variants={animacionSeccion}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="app">
      <Navbar scrolled={scrolled} />

      <Hero />

      <AnimatedSection>
        <Stats />
      </AnimatedSection>

      <AnimatedSection>
        <About />
      </AnimatedSection>

      <AnimatedSection>
        <Services />
      </AnimatedSection>

      <AnimatedSection>
        <Plans />
      </AnimatedSection>

      <AnimatedSection>
        <Trainers />
      </AnimatedSection>

      <AnimatedSection>
        <Gallery />
      </AnimatedSection>

      <AnimatedSection>
        <Testimonials />
      </AnimatedSection>

      <AnimatedSection>
        <Contact />
      </AnimatedSection>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}