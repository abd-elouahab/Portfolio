'use client';

/**
 * Tiny UI sound effects using the Web Audio API.
 * No external files needed — generates tones procedurally.
 */

let ctx: AudioContext | null = null;

function getCtx() {
  if (!ctx) ctx = new AudioContext();
  return ctx;
}

/** Short click / tick sound for hover interactions */
export function playTick() {
  try {
    const c = getCtx();
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.connect(gain);
    gain.connect(c.destination);

    osc.type = 'square';
    osc.frequency.setValueAtTime(1800, c.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, c.currentTime + 0.04);

    gain.gain.setValueAtTime(0.03, c.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.06);

    osc.start(c.currentTime);
    osc.stop(c.currentTime + 0.06);
  } catch {
    // Audio not available — silent fail
  }
}

/** Soft click for button presses */
export function playClick() {
  try {
    const c = getCtx();
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.connect(gain);
    gain.connect(c.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, c.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, c.currentTime + 0.08);

    gain.gain.setValueAtTime(0.04, c.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.1);

    osc.start(c.currentTime);
    osc.stop(c.currentTime + 0.1);
  } catch {
    // Audio not available — silent fail
  }
}
