'use client';

import { useState, useEffect, useRef } from 'react';

interface Props {
  text: string;
  className?: string;
  /** Play glitch animation once on mount */
  triggerOnLoad?: boolean;
}

export default function GlitchText({ text, className = '', triggerOnLoad = false }: Props) {
  const [active, setActive] = useState(false);
  const fired = useRef(false);

  useEffect(() => {
    if (!triggerOnLoad || fired.current) return;
    fired.current = true;
    setActive(true);
    const id = setTimeout(() => setActive(false), 400);
    return () => clearTimeout(id);
  }, [triggerOnLoad]);

  return (
    <span className={`glitch-name${active ? ' glitch-name--active' : ''} ${className}`} data-text={text}>
      {text}
    </span>
  );
}
