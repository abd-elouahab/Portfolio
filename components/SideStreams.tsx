'use client';

import { useEffect, useState, memo } from 'react';
import { STREAM_WORDS, SIGNAL_CHARS } from '@/lib/data';

// ─── Random helpers ───────────────────────────────────────

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function rand(min: number, max: number) { return min + Math.random() * (max - min); }

// ─── Stream items ─────────────────────────────────────────

function StreamWord({ id }: { id: number }) {
  const word  = pick(STREAM_WORDS);
  const x     = rand(5, 85);
  const dur   = rand(8, 22);
  const peak  = rand(0.35, 0.7);
  const delay = rand(-dur, 0);
  const drift = rand(-10, 10);

  return (
    <span
      key={id}
      className="stream-word"
      style={{
        left: `${x}%`,
        '--peak': peak.toFixed(2),
        '--drift': `${drift}px`,
        animationDuration: `${dur}s`,
        animationDelay: `${delay}s`,
      } as React.CSSProperties}
    >
      {word}
    </span>
  );
}

function SignalChar({ id }: { id: number }) {
  const ch    = pick(SIGNAL_CHARS);
  const x     = rand(5, 85);
  const dur   = rand(14, 30);
  const delay = rand(-dur, 0);
  const drift = rand(-6, 6);

  return (
    <span
      key={id}
      className="stream-word stream-signal"
      style={{
        left: `${x}%`,
        '--peak': '0.15',
        '--drift': `${drift}px`,
        animationDuration: `${dur}s`,
        animationDelay: `${delay}s`,
      } as React.CSSProperties}
    >
      {ch}
    </span>
  );
}

// ─── Side ─────────────────────────────────────────────────

function Side({ offset = 0 }: { offset?: number }) {
  return (
    <>
      {Array.from({ length: 8 }, (_, i) => <StreamWord key={`w${i + offset}`} id={i + offset} />)}
      {Array.from({ length: 6 }, (_, i) => <SignalChar key={`s${i + offset}`} id={i + offset} />)}
    </>
  );
}

// ─── Main ─────────────────────────────────────────────────

function SideStreams() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const check = () => setShow(innerWidth > 900);
    check();
    addEventListener('resize', check);
    return () => removeEventListener('resize', check);
  }, []);

  if (!show) return null;

  return (
    <>
      <div className="side-stream side-stream-left"><Side /></div>
      <div className="side-stream side-stream-right"><Side offset={100} /></div>
    </>
  );
}

export default memo(SideStreams);
