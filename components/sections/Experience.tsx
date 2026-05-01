'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { EXPERIENCES, CERTIFICATIONS } from '@/lib/data';
import { sectionReveal, staggerContainer, fadeLeft, fadeUp } from '@/lib/motion';

export default function Experience() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [lineHeight, setLineHeight] = useState(0);
  const [activeIdx, setActiveIdx] = useState(-1);

  // Animate timeline line drawing on scroll
  const updateLine = useCallback(() => {
    const el = timelineRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const viewH = window.innerHeight;

    // How far into the timeline the viewport center is
    const center = viewH * 0.6;
    const progress = Math.min(Math.max((center - rect.top) / rect.height, 0), 1);
    setLineHeight(progress * 100);

    // Determine which timeline item is active
    const items = el.querySelectorAll<HTMLElement>('.timeline-item');
    let active = -1;
    items.forEach((item, i) => {
      const r = item.getBoundingClientRect();
      if (r.top < center) active = i;
    });
    setActiveIdx(active);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', updateLine, { passive: true });
    updateLine();
    return () => window.removeEventListener('scroll', updateLine);
  }, [updateLine]);

  return (
    <section id="experience">
      <motion.div
        className="section-inner"
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        <h2 className="section-title">
          <span className="section-number">03</span>
          Experience
        </h2>

        {/* Timeline with animated line */}
        <motion.div
          ref={timelineRef}
          className="timeline"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {/* Animated progress line */}
          <div
            className="timeline-line-progress"
            style={{ height: `${lineHeight}%` }}
            aria-hidden="true"
          />

          {EXPERIENCES.map((exp, i) => (
            <motion.div
              key={i}
              className={`timeline-item${i <= activeIdx ? ' timeline-item--active' : ''}`}
              variants={fadeLeft}
            >
              <div className={`timeline-dot${i <= activeIdx ? ' timeline-dot--active' : ''}`} />
              <div className="timeline-content">
                <span className="timeline-period">{exp.period}</span>
                <h3 className="timeline-role">{exp.role}</h3>
                <span className="timeline-org">{exp.org}</span>
                <p className="timeline-desc">{exp.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Certifications — styled like a subsection with consistent card design */}
        <motion.div
          className="certs-block"
          variants={sectionReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          <h3 className="section-title" style={{ fontSize: 'clamp(1.4rem, 3vw, 1.8rem)' }}>
            <span className="section-number">03.1</span>
            Certifications
          </h3>
          <motion.div
            className="certs-grid"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {CERTIFICATIONS.map((cert, i) => (
              <motion.div key={i} className="cert-card" variants={fadeUp} data-magnetic>
                <span className="cert-name">{cert.name}</span>
                <span className="cert-issuer">{cert.issuer}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
