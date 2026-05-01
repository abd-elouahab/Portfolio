'use client';

import { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  onComplete: () => void;
}

/* ── Letter-by-letter assembler with chromatic aberration ── */

function GlitchText({
  text,
  startDelay,
  className,
}: {
  text: string;
  startDelay: number;
  className?: string;
}) {
  const [revealed, setRevealed] = useState(0);
  const [aberration, setAberration] = useState<Set<number>>(new Set());
  const GLITCH_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*!?<>/\\|{}[]~^';

  const [display, setDisplay] = useState<string[]>(Array(text.length).fill(''));

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    const LETTER_INTERVAL = 60;
    const SCRAMBLE_COUNT = 4;
    const SCRAMBLE_SPEED = 40;

    text.split('').forEach((char, i) => {
      if (char === ' ') {
        timers.push(
          setTimeout(() => {
            setDisplay(prev => {
              const next = [...prev];
              next[i] = ' ';
              return next;
            });
            setRevealed(prev => Math.max(prev, i + 1));
          }, startDelay + i * LETTER_INTERVAL),
        );
        return;
      }

      // Scramble phase
      for (let s = 0; s < SCRAMBLE_COUNT; s++) {
        timers.push(
          setTimeout(() => {
            setDisplay(prev => {
              const next = [...prev];
              next[i] = GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
              return next;
            });
          }, startDelay + i * LETTER_INTERVAL + s * SCRAMBLE_SPEED),
        );
      }

      // Settle — trigger chromatic aberration briefly
      timers.push(
        setTimeout(() => {
          setDisplay(prev => {
            const next = [...prev];
            next[i] = char;
            return next;
          });
          setRevealed(prev => Math.max(prev, i + 1));

          // Chromatic aberration flash on settle
          setAberration(prev => new Set(prev).add(i));
          timers.push(
            setTimeout(() => {
              setAberration(prev => {
                const next = new Set(prev);
                next.delete(i);
                return next;
              });
            }, 150),
          );
        }, startDelay + i * LETTER_INTERVAL + SCRAMBLE_COUNT * SCRAMBLE_SPEED),
      );
    });

    return () => timers.forEach(clearTimeout);
  }, [text, startDelay]);

  return (
    <span className={className}>
      {display.map((char, i) => {
        const settled = i < revealed && char === text[i];
        const hasAberration = aberration.has(i);
        return (
          <span
            key={i}
            className={`${settled ? 'glitch-settled' : 'glitch-scramble'}${hasAberration ? ' glitch-aberration' : ''}`}
          >
            {char || '\u00A0'}
          </span>
        );
      })}
    </span>
  );
}

/* ── Boot / Welcome Screen ─────────────────────────────── */

function BootScreen({ onComplete }: Props) {
  const [phase, setPhase] = useState<'name' | 'subtitle' | 'pulse' | 'exit'>('name');
  const [scanActive, setScanActive] = useState(false);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    // Scan line sweeps as name starts
    timers.push(setTimeout(() => setScanActive(true), 100));

    // Phase 2: Subtitle fades in
    timers.push(setTimeout(() => setPhase('subtitle'), 1400));

    // Phase 3: Background pulse
    timers.push(setTimeout(() => setPhase('pulse'), 2600));

    // Phase 4: Exit — slide up
    timers.push(setTimeout(() => setPhase('exit'), 3400));

    // Complete
    timers.push(setTimeout(onComplete, 4100));

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== 'exit' ? (
        <motion.div
          className="boot-screen"
          exit={{ y: '-100%' }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Perspective grid background */}
          <div className="boot-grid" />

          {/* Horizontal scan line */}
          <div className={`boot-scanline${scanActive ? ' active' : ''}`} />

          {/* Background pulse */}
          <div className={`boot-pulse${phase === 'pulse' ? ' active' : ''}`} />

          {/* Vertical accent lines */}
          <div className="boot-vline boot-vline--left" />
          <div className="boot-vline boot-vline--right" />

          {/* Center content */}
          <div className="boot-center">
            {/* Name */}
            <h1 className="boot-name">
              <GlitchText text="ABD ELOUAHAB" startDelay={200} className="boot-name-first" />
              <GlitchText text="BOUTEFSOUT" startDelay={800} className="boot-name-last" />
            </h1>

            {/* Subtitle */}
            <motion.div
              className="boot-subtitle"
              initial={{ opacity: 0, y: 10 }}
              animate={
                phase === 'subtitle' || phase === 'pulse'
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 10 }
              }
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <span className="boot-divider-line" />
              <span className="boot-role">AI & Data Engineer</span>
              <span className="boot-separator">//</span>
              <span className="boot-school">ENSA Agadir</span>
              <span className="boot-divider-line" />
            </motion.div>

            {/* Tagline */}
            <motion.p
              className="boot-tagline"
              initial={{ opacity: 0 }}
              animate={
                phase === 'pulse'
                  ? { opacity: 1 }
                  : { opacity: 0 }
              }
              transition={{ duration: 0.4 }}
            >
              WELCOME TO MY PORTFOLIO
            </motion.p>
          </div>

          {/* Corner decorations */}
          <span className="boot-corner boot-corner--tl" />
          <span className="boot-corner boot-corner--tr" />
          <span className="boot-corner boot-corner--bl" />
          <span className="boot-corner boot-corner--br" />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default memo(BootScreen);
