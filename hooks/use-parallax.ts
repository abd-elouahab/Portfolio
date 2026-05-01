'use client';

import { useEffect } from 'react';

/**
 * Applies a subtle parallax shift to all <section> elements.
 * Sections translate upward slightly faster than the scroll,
 * creating a layered depth effect.
 */
export function useParallax(factor = 0.03) {
  useEffect(() => {
    let raf: number;
    const update = () => {
      const sections = document.querySelectorAll<HTMLElement>('section');
      const viewH = window.innerHeight;

      sections.forEach(sec => {
        const rect = sec.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const offset = (center - viewH / 2) * factor;
        sec.style.transform = `translateY(${offset}px)`;
      });

      raf = requestAnimationFrame(update);
    };

    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, [factor]);
}
