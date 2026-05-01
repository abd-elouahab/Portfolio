'use client';

import { useEffect, useState, memo } from 'react';
import { motion } from 'framer-motion';
import { NAV_ITEMS } from '@/lib/data';
import GlitchText from './GlitchText';
import { playTick, playClick } from '@/lib/sounds';

function Nav() {
  const [active, setActive] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    const sections = NAV_ITEMS.map(n => document.getElementById(n.id)).filter(Boolean) as HTMLElement[];

    const onScroll = () => {
      setScrolled(window.scrollY > 60);

      // Scroll progress
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setScrollPercent(docH > 0 ? Math.round((window.scrollY / docH) * 100) : 0);

      // Find current section
      const y = window.scrollY + window.innerHeight * 0.35;
      let current = '';
      for (const sec of sections) {
        if (sec.offsetTop <= y) current = sec.id;
      }
      setActive(current);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.nav
      className={`nav${scrolled ? ' nav--scrolled' : ''}`}
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 2.8, duration: 0.5, ease: 'easeOut' }}
    >
      {/* Scroll progress bar */}
      <div className="nav-progress" style={{ width: `${scrollPercent}%` }} aria-hidden="true" />

      <div className="nav-inner">
        <button className="nav-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} data-magnetic>
          <GlitchText text="AB ▶" />
        </button>

        <div className="nav-links">
          {NAV_ITEMS.map((item, i) => (
            <button
              key={item.id}
              className={`nav-link${active === item.id ? ' nav-link--active' : ''}`}
              data-magnetic
              onMouseEnter={() => playTick()}
              onClick={() => { playClick(); scrollTo(item.id); }}
            >
              <span className="nav-link-index">0{i + 1}</span>
              {item.label}
            </button>
          ))}
        </div>

        <span className="nav-scroll-pct" aria-hidden="true">{scrollPercent}%</span>
      </div>
    </motion.nav>
  );
}

export default memo(Nav);
