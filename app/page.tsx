'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { MouseProvider } from '@/hooks/use-mouse';
import BootScreen from '@/components/BootScreen';
import Nav from '@/components/Nav';
import CustomCursor from '@/components/CustomCursor';
import SideStreams from '@/components/SideStreams';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Projects from '@/components/sections/Projects';
import Experience from '@/components/sections/Experience';
import Skills from '@/components/sections/Skills';
import Contact from '@/components/sections/Contact';
import SectionDivider from '@/components/SectionDivider';
import BackToTop from '@/components/BackToTop';
import { useParallax } from '@/hooks/use-parallax';

const NeuralBackground = dynamic(() => import('@/components/NeuralBackground'), { ssr: false });
const NoiseOverlay     = dynamic(() => import('@/components/NoiseOverlay'),     { ssr: false });

export default function Home() {
  const [booting, setBooting] = useState(true);
  useParallax(0.03);

  return (
    <MouseProvider>
      {/* Atmosphere layers */}
      <NeuralBackground />
      <NoiseOverlay />
      <SideStreams />
      <div className="color-band" />
      <div className="color-band" />
      <div className="color-band" />
      <CustomCursor />

      {/* Boot */}
      {booting && <BootScreen onComplete={() => setBooting(false)} />}

      {/* Navigation */}
      {!booting && <Nav />}

      {/* Main content — scrollable */}
      <main className={`main${booting ? ' main--hidden' : ''}`}>
        <Hero ready={!booting} />
        <SectionDivider />
        <About />
        <SectionDivider />
        <Projects />
        <SectionDivider />
        <Experience />
        <SectionDivider />
        <Skills />
        <SectionDivider />
        <Contact />
      </main>

      {/* Back to top */}
      {!booting && <BackToTop />}
    </MouseProvider>
  );
}
