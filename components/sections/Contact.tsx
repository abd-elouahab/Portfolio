'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { sectionReveal, staggerContainer, fadeUp } from '@/lib/motion';
import { playTick } from '@/lib/sounds';

const LINKS = [
  { href: 'mailto:abdeloihabboutefsout@gmail.com', label: 'Email', icon: 'M2 5.5A2.5 2.5 0 0 1 4.5 3h15A2.5 2.5 0 0 1 22 5.5v13a2.5 2.5 0 0 1-2.5 2.5h-15A2.5 2.5 0 0 1 2 18.5v-13Zm2.4-.5L12 10.4 19.6 5H4.4ZM20 6.3l-7.4 5.2a1 1 0 0 1-1.2 0L4 6.3v12.2c0 .3.2.5.5.5h15c.3 0 .5-.2.5-.5V6.3Z' },
  { href: 'https://linkedin.com/in/Abd-Elouahab-Boutefsout', label: 'LinkedIn', icon: 'M6.94 8.5v11H3.5v-11h3.44Zm.22-3.4c0 1.01-.75 1.82-1.94 1.82H5.2c-1.15 0-1.9-.8-1.9-1.82 0-1.03.77-1.82 1.94-1.82 1.17 0 1.9.79 1.92 1.82ZM20.5 13.2v6.3h-3.43V13.6c0-1.5-.54-2.52-1.9-2.52-1.04 0-1.66.7-1.93 1.38-.1.24-.12.58-.12.92v6.12H9.69s.05-9.93 0-11h3.43v1.56c.45-.7 1.27-1.7 3.09-1.7 2.26 0 4.29 1.48 4.29 4.84Z', ext: true },
  { href: 'https://github.com/abd-elouahab', label: 'GitHub', icon: 'M12 .5C5.65.5.5 5.66.5 12.03c0 5.1 3.3 9.43 7.88 10.96.58.1.79-.26.79-.56v-2.1c-3.2.7-3.87-1.37-3.87-1.37-.52-1.34-1.28-1.7-1.28-1.7-1.05-.72.08-.7.08-.7 1.15.08 1.76 1.2 1.76 1.2 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.3-5.23-1.3-5.23-5.76 0-1.27.45-2.3 1.19-3.11-.12-.3-.52-1.5.11-3.12 0 0 .97-.32 3.17 1.19a10.9 10.9 0 0 1 5.77 0c2.2-1.5 3.17-1.19 3.17-1.19.63 1.62.23 2.82.12 3.12.74.8 1.19 1.84 1.19 3.1 0 4.47-2.69 5.46-5.25 5.75.41.35.78 1.04.78 2.1v3.12c0 .31.21.67.8.56A11.54 11.54 0 0 0 23.5 12c0-6.37-5.15-11.5-11.5-11.5Z', ext: true },
  { href: 'tel:+212694531023', label: 'Call', icon: 'M6.62 10.8a15.26 15.26 0 0 0 6.58 6.58l2.2-2.2a1 1 0 0 1 1.02-.24c1.11.37 2.3.57 3.58.57a1 1 0 0 1 1 1V21a1 1 0 0 1-1 1C9.3 22 2 14.7 2 5a1 1 0 0 1 1-1h4.5a1 1 0 0 1 1 1c0 1.28.2 2.47.57 3.58a1 1 0 0 1-.24 1.02l-2.2 2.2Z' },
] as const;

export default function Contact() {
  const [scanlines, setScanlines] = useState(true);

  const toggle = () => {
    const next = !scanlines;
    setScanlines(next);
    document.body.style.setProperty('--scanline-opacity', next ? '0.04' : '0');
  };

  return (
    <section id="contact">
      <motion.div
        className="section-inner contact-inner"
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        <h2 className="contact-heading">
          Let&apos;s build systems<br />
          that actually{' '}
          <span className="keyword-glow">ship</span>.
        </h2>

        <p className="contact-sub">
          I care about intelligent solutions that scale and make an impact.
          If that resonates — let&apos;s connect.
        </p>

        <motion.div
          className="contact-links"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {LINKS.map(link => (
            <motion.a
              key={link.label}
              href={link.href}
              className="contact-link"
              data-magnetic
              onMouseEnter={() => playTick()}
              variants={fadeUp}
              {...('ext' in link ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              <span className="contact-icon">
                <svg viewBox="0 0 24 24"><path d={link.icon} /></svg>
              </span>
              <span>{link.label}</span>
              <span className="contact-link-glow" aria-hidden="true" />
            </motion.a>
          ))}
        </motion.div>

        <div className="contact-footer">
          <button className="scanline-toggle" onClick={toggle} data-magnetic>
            [{scanlines ? 'X' : ' '}] Scanlines
          </button>
          <span className="contact-copy">
            &copy; {new Date().getFullYear()} Abd Elouahab Boutefsout
          </span>
        </div>
      </motion.div>
    </section>
  );
}
