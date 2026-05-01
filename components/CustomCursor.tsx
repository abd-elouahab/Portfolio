'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { useMouse } from '@/hooks/use-mouse';

const MAX_PARTICLES    = 18;
const MAGNETIC_RADIUS  = 60;
const MAGNETIC_STR     = 0.3;
const LERP             = 0.15;
const SPAWN_THROTTLE   = 30;    // ms between particle spawns

export default function CustomCursor() {
  const { mouse } = useMouse();
  const [expanded, setExpanded] = useState(false);
  const [magnetic, setMagnetic] = useState(false);
  const dotRef     = useRef<HTMLDivElement>(null);
  const display    = useRef({ x: -100, y: -100 });
  const target     = useRef({ x: -100, y: -100 });
  const rafRef     = useRef(0);
  const particles  = useRef<{ el: HTMLDivElement }[]>([]);
  const lastSpawn  = useRef(0);
  const prevMouse  = useRef({ x: -100, y: -100 });

  // ── Particle spawn ──────────────────────────────────────
  const spawn = useCallback((x: number, y: number) => {
    const now = performance.now();
    if (now - lastSpawn.current < SPAWN_THROTTLE) return;
    lastSpawn.current = now;

    if (particles.current.length >= MAX_PARTICLES) {
      const old = particles.current.shift();
      old?.el.parentNode?.removeChild(old.el);
    }

    const p = document.createElement('div');
    p.className = 'cursor-particle';
    Object.assign(p.style, { left: x + 'px', top: y + 'px', opacity: '0.7' });
    const sz = 2 + Math.random() * 3;
    p.style.width = p.style.height = sz + 'px';
    document.body.appendChild(p);

    const vx = (Math.random() - 0.5) * 2;
    const vy = (Math.random() - 0.5) * 2 - 1;
    let life = 0;

    const fade = () => {
      life += 0.06;
      p.style.opacity = String(Math.max(0, 0.7 - life));
      p.style.left = parseFloat(p.style.left) + vx * 0.5 + 'px';
      p.style.top  = parseFloat(p.style.top) + vy * 0.5 + 'px';
      if (life < 1) requestAnimationFrame(fade);
      else p.parentNode?.removeChild(p);
    };
    requestAnimationFrame(fade);
    particles.current.push({ el: p });
  }, []);

  // ── Tick loop ───────────────────────────────────────────
  useEffect(() => {
    const tick = () => {
      rafRef.current = requestAnimationFrame(tick);
      const m = mouse.current;
      let tx = m.x, ty = m.y;

      // Magnetic pull
      let isMag = false;
      const magnets = document.querySelectorAll<HTMLElement>('[data-magnetic]');
      for (const el of magnets) {
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        const d = Math.hypot(m.x - cx, m.y - cy);
        if (d < MAGNETIC_RADIUS) {
          const s = (1 - d / MAGNETIC_RADIUS) * MAGNETIC_STR;
          tx += (cx - m.x) * s;
          ty += (cy - m.y) * s;
          isMag = true;
          break;
        }
      }
      target.current = { x: tx, y: ty };

      // Smooth lerp
      display.current.x += (target.current.x - display.current.x) * LERP;
      display.current.y += (target.current.y - display.current.y) * LERP;

      const dot = dotRef.current;
      if (dot) {
        dot.style.left = display.current.x + 'px';
        dot.style.top  = display.current.y + 'px';
      }

      // Interactive check
      const el = document.elementFromPoint(m.x, m.y) as HTMLElement | null;
      if (el) {
        setExpanded(
          el.tagName === 'A' || el.tagName === 'BUTTON' ||
          !!el.closest('a') || !!el.closest('button') ||
          el.classList.contains('channel-arrow') ||
          el.classList.contains('footer-right') ||
          el.classList.contains('skill-tag')
        );
      }
      setMagnetic(isMag);

      // Spawn particles on movement
      const dx = m.x - prevMouse.current.x;
      const dy = m.y - prevMouse.current.y;
      if (dx * dx + dy * dy > 4) {
        spawn(display.current.x, display.current.y);
        prevMouse.current = { x: m.x, y: m.y };
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [mouse, spawn]);

  return (
    <div
      ref={dotRef}
      className={`cursor-dot${expanded ? ' expanded' : ''}${magnetic ? ' magnetic' : ''}`}
    />
  );
}
