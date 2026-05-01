'use client';

import { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playClick } from '@/lib/sounds';

function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollUp = () => {
    playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          className="back-to-top"
          onClick={scrollUp}
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          data-magnetic
          aria-label="Back to top"
        >
          <span className="btt-arrow">&#8593;</span>
          <span className="btt-label">TOP</span>
          <span className="btt-glitch" aria-hidden="true" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

export default memo(BackToTop);
