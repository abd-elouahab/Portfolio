'use client';

import { useState, useEffect, useRef } from 'react';

/**
 * Reveals a string character-by-character.
 * Only plays once — subsequent mounts return the full string.
 */
export function useTypewriter(text: string, speed = 22): string {
  const [display, setDisplay] = useState('');
  const played = useRef(false);

  useEffect(() => {
    if (played.current) {
      setDisplay(text);
      return;
    }
    played.current = true;

    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplay(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);

    return () => clearInterval(id);
  }, [text, speed]);

  return display;
}
