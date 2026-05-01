'use client';

import {
  createContext,
  useContext,
  useRef,
  useEffect,
  type ReactNode,
  createElement,
} from 'react';
import type { MouseState, RippleEvent } from '@/lib/types';

// ─── Context ──────────────────────────────────────────────

interface MouseCtx {
  mouse: React.RefObject<MouseState>;
  ripple: React.RefObject<RippleEvent | null>;
}

const Ctx = createContext<MouseCtx | null>(null);

// ─── Provider ─────────────────────────────────────────────

export function MouseProvider({ children }: { children: ReactNode }) {
  const mouse = useRef<MouseState>({ x: -100, y: -100, nx: 0, ny: 0 });
  const ripple = useRef<RippleEvent | null>(null);

  useEffect(() => {
    const normalize = (e: MouseEvent) => ({
      x: e.clientX,
      y: e.clientY,
      nx: (e.clientX / window.innerWidth) * 2 - 1,
      ny: -(e.clientY / window.innerHeight) * 2 + 1,
    });

    const onMove = (e: MouseEvent) => {
      mouse.current = normalize(e);
    };

    const onDown = (e: MouseEvent) => {
      const { nx, ny } = normalize(e);
      ripple.current = { nx, ny, time: performance.now() };
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mousedown', onDown);
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mousedown', onDown);
    };
  }, []);

  return createElement(Ctx.Provider, { value: { mouse, ripple } }, children);
}

// ─── Hook ─────────────────────────────────────────────────

export function useMouse(): MouseCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useMouse must be used within <MouseProvider>');
  return ctx;
}
