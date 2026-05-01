'use client';

import { useState, useCallback, memo } from 'react';
import type { FrameVariant } from '@/lib/types';

interface Props {
  src: string;
  alt?: string;
  variant?: FrameVariant;
}

function NeuralIdentityFrame({ src, alt = '', variant = 'about' }: Props) {
  const [glitch, setGlitch] = useState(false);

  const onEnter = useCallback(() => {
    setGlitch(true);
    setTimeout(() => setGlitch(false), 200);
  }, []);

  return (
    <figure
      className={`neural-frame neural-frame--${variant}${glitch ? ' frame-glitch-active' : ''}`}
      aria-hidden="true"
      onMouseEnter={onEnter}
    >
      <div className="frame-border">
        <div className="frame-scanline" />
        <img src={src} alt={alt} />
      </div>
      <div className="frame-corner frame-corner--tl" />
      <div className="frame-corner frame-corner--tr" />
      <div className="frame-corner frame-corner--bl" />
      <div className="frame-corner frame-corner--br" />
      <div className="frame-hud-text">ANALYZING...</div>
    </figure>
  );
}

export default memo(NeuralIdentityFrame);
