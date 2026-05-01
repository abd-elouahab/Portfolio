'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { heroFrame, heroName, heroSub, heroCta, scrollIndicator } from '@/lib/motion';
import NeuralIdentityFrame from '../NeuralIdentityFrame';
import { useMouse } from '@/hooks/use-mouse';

/* ── Keyword-highlighted typewriter ─────────────────────── */

const TAGLINE_PARTS = [
  { text: 'I build ', glow: false },
  { text: 'intelligent', glow: true },
  { text: ' ', glow: false },
  { text: 'systems', glow: true },
  { text: ' that ', glow: false },
  { text: 'ship', glow: true },
  { text: '.', glow: false },
];
const FULL_TEXT = TAGLINE_PARTS.map(p => p.text).join('');

function useKeywordTypewriter(ready: boolean, speed = 28) {
  const [charIndex, setCharIndex] = useState(0);
  const played = useRef(false);

  useEffect(() => {
    if (!ready || played.current) {
      if (played.current) setCharIndex(FULL_TEXT.length);
      return;
    }
    played.current = true;
    let i = 0;
    const id = setInterval(() => {
      i++;
      setCharIndex(i);
      if (i >= FULL_TEXT.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [ready, speed]);

  // Build rendered spans from charIndex
  const spans: { text: string; glow: boolean }[] = [];
  let remaining = charIndex;
  for (const part of TAGLINE_PARTS) {
    if (remaining <= 0) break;
    const slice = part.text.slice(0, remaining);
    spans.push({ text: slice, glow: part.glow });
    remaining -= slice.length;
  }
  return { spans, done: charIndex >= FULL_TEXT.length };
}

/* ── Hero Component ─────────────────────────────────────── */

export default function Hero({ ready }: { ready: boolean }) {
  const { spans, done } = useKeywordTypewriter(ready, 28);
  const { mouse } = useMouse();
  const heroRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  // Parallax tilt on mouse movement
  const updateTilt = useCallback(() => {
    const m = mouse.current;
    setTilt({
      x: m.ny * 8,
      y: m.nx * -8,
    });
  }, [mouse]);

  useEffect(() => {
    if (!ready) return;
    let raf: number;
    const tick = () => {
      updateTilt();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [ready, updateTilt]);

  return (
    <section className="hero" id="hero">
      {ready && (
        <motion.div
          ref={heroRef}
          className="hero-inner"
          initial="hidden"
          animate="visible"
          style={{
            transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            transition: 'transform 0.15s ease-out',
          }}
        >
          {/* Profile frame — large and dramatic */}
          <motion.div className="hero-frame" variants={heroFrame}>
            <NeuralIdentityFrame src="/images/hack_generee.png" variant="hero" />
          </motion.div>

          {/* Name — clean professional font */}
          <motion.h1
            className="hero-name"
            variants={heroName}
            style={{ fontFamily: 'var(--font-inter, Inter, sans-serif)', textTransform: 'none' }}
          >
            <span className="hero-name-first">Abd Elouahab</span>
            <span className="hero-name-last">Boutefsout</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.div className="hero-subtitle" variants={heroSub}>
            <span className="hero-role">AI & Data Engineer</span>
            <span className="hero-divider">//</span>
            <span className="hero-school">ENSA Agadir</span>
          </motion.div>

          {/* Tagline with keyword-highlighted typewriter */}
          <motion.div className="hero-tagline-wrap" variants={heroCta}>
            <span className="hero-tagline-prefix">&gt;_</span>
            <p className="hero-tagline">
              {spans.map((s, i) =>
                s.glow ? (
                  <span key={i} className="tagline-keyword">{s.text}</span>
                ) : (
                  <span key={i}>{s.text}</span>
                )
              )}
              {!done && <span className="hero-cursor" />}
            </p>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div className="scroll-indicator" variants={scrollIndicator}>
            <div className="scroll-line" />
            <span className="scroll-text">Scroll</span>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}
