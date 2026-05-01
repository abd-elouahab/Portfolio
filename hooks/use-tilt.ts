'use client';

import { useRef, useCallback } from 'react';

/**
 * Lightweight 3D tilt effect for cards.
 * Returns handlers to spread onto the target element.
 */
export function useTilt(maxDeg = 8, scale = 1.02) {
  const ref = useRef<HTMLElement | null>(null);

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const el = ref.current ?? (e.currentTarget as HTMLElement);
      ref.current = el;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rotX = (0.5 - y) * maxDeg;
      const rotY = (x - 0.5) * maxDeg;
      el.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${scale})`;

      // Move light reflection
      const glare = el.querySelector<HTMLElement>('.card-glare');
      if (glare) {
        glare.style.opacity = '1';
        glare.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(255,255,255,0.08) 0%, transparent 60%)`;
      }
    },
    [maxDeg, scale],
  );

  const onMouseLeave = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const el = ref.current ?? (e.currentTarget as HTMLElement);
      el.style.transform = '';
      const glare = el.querySelector<HTMLElement>('.card-glare');
      if (glare) glare.style.opacity = '0';
    },
    [],
  );

  return { onMouseMove, onMouseLeave };
}
