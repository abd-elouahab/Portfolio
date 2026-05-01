'use client';

import { useRef, useEffect } from 'react';

export default function NoiseOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef  = useRef(0);

  useEffect(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext('2d');
    if (!ctx) return;

    let w = (cvs.width = innerWidth);
    let h = (cvs.height = innerHeight);
    let img = ctx.createImageData(w, h);
    let fc = 0;

    const onResize = () => {
      w = cvs.width = innerWidth;
      h = cvs.height = innerHeight;
      img = ctx.createImageData(w, h);
    };

    const draw = () => {
      frameRef.current = requestAnimationFrame(draw);
      if (++fc % 3 !== 0) return;           // 20 fps is enough at 3.5% opacity

      const d = img.data;
      for (let i = 0; i < d.length; i += 16) {
        const v = (Math.random() * 255) | 0;
        d[i]=d[i+4]=d[i+8]=d[i+12]= v;
        d[i+1]=d[i+5]=d[i+9]=d[i+13]= v;
        d[i+2]=d[i+6]=d[i+10]=d[i+14]= v;
        d[i+3]=d[i+7]=d[i+11]=d[i+15]= 255;
      }
      ctx.putImageData(img, 0, 0);
    };

    addEventListener('resize', onResize);
    draw();

    return () => {
      cancelAnimationFrame(frameRef.current);
      removeEventListener('resize', onResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="noise-canvas" />;
}
