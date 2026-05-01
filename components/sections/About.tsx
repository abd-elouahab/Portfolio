'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { sectionReveal, staggerContainer, fadeUp } from '@/lib/motion';

/* ── Animated counter hook ──────────────────────────────── */

function useCounter(target: number, duration = 1200, active = false) {
  const [val, setVal] = useState(0);
  const ran = useRef(false);
  useEffect(() => {
    if (!active || ran.current) return;
    ran.current = true;
    const start = performance.now();
    const step = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(target * ease));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [active, target, duration]);
  return val;
}

/* ── Content data ───────────────────────────────────────── */

const STATS = [
  { value: 4, suffix: '+', label: 'Projects shipped' },
  { value: 9, suffix: '', label: 'Certifications' },
  { value: 1, suffix: '', label: 'Internship' },
];

function StatCounter({ value, suffix, label, active }: { value: number; suffix: string; label: string; active: boolean }) {
  const count = useCounter(value, 1000, active);
  return (
    <div className="stat">
      <span className="stat-value">{count}{suffix}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}

/* ── About Component ────────────────────────────────────── */

export default function About() {
  const [statsVisible, setStatsVisible] = useState(false);

  const onStatsView = useCallback(() => setStatsVisible(true), []);

  return (
    <section id="about">
      <motion.div
        className="section-inner"
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        <h2 className="section-title">
          <span className="section-number">01</span>
          About
        </h2>

        <motion.div
          className="about-grid"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          {/* Main content — interactive blocks */}
          <motion.div className="about-main" variants={fadeUp}>
            <div className="about-block about-block--lead">
              <p className="about-lead">
                I&apos;M LEARNING TO BUILD ON THE{' '}
                <span className="keyword-glow" data-magnetic>AI FRONTIER</span> — TURNING IDEAS INTO SYSTEMS, AND SYSTEMS INTO SOMETHING USEFUL.
                {' '}NOT PERFECT, BUT ALWAYS IMPROVING.
              </p>
            </div>

            <div className="about-block">
              <p>
                AI & DATA ENGINEERING STUDENT AT{' '}
                <a href="https://www.uiz.ac.ma" target="_blank" rel="noopener noreferrer">ENSA AGADIR</a>,
                FOCUSED ON ONE QUESTION:{' '}
                <span className="about-highlight">HOW DO WE MOVE FROM INTERESTING DEMOS TO REAL-WORLD IMPACT?</span>
              </p>
            </div>

            <div className="about-block">
              <p>
                I BUILD, EXPERIMENT, AND ITERATE — TRYING TO SOLVE{' '}
                <span className="about-highlight">REAL PROBLEMS</span> AND UNDERSTAND WHAT MAKES SYSTEMS ACTUALLY WORK BEYOND THE NOTEBOOK.
              </p>
            </div>
          </motion.div>

          {/* Aside — quotes and stats */}
          <motion.div className="about-aside" variants={fadeUp}>
            <div className="about-quote">
              <p>&quot;The people who are crazy enough to think they can change the world are the ones who do.&quot;</p>
              <cite>— Steve Jobs</cite>
            </div>

            <div className="about-quote">
              <p>&quot;AI is the new electricity.&quot;</p>
              <cite>— Andrew Ng</cite>
            </div>

            <motion.div
              className="about-stats"
              onViewportEnter={onStatsView}
              viewport={{ once: true }}
            >
              {STATS.map((s, i) => (
                <StatCounter key={i} {...s} active={statsVisible} />
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
