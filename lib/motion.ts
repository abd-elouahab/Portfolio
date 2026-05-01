import type { Variants } from 'framer-motion';

// ─── Section scroll-reveal ────────────────────────────────

export const sectionReveal: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.4, 0.25, 1] },
  },
};

// ─── Stagger containers ──────────────────────────────────

export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

export const staggerFast: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

// ─── Child variants ──────────────────────────────────────

export const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export const fadeLeft: Variants = {
  hidden:  { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export const scaleIn: Variants = {
  hidden:  { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] } },
};

// ─── Hero variants ───────────────────────────────────────

export const heroFrame: Variants = {
  hidden:  { opacity: 0, scale: 0.85, filter: 'blur(8px)' },
  visible: {
    opacity: 1, scale: 1, filter: 'blur(0px)',
    transition: { duration: 0.8, delay: 0.1, ease: [0.25, 0.4, 0.25, 1] },
  },
};

export const heroName: Variants = {
  hidden:  { opacity: 0, y: 30, filter: 'blur(10px)' },
  visible: {
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { duration: 0.8, delay: 0.3, ease: [0.25, 0.4, 0.25, 1] },
  },
};

export const heroSub: Variants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.6, ease: 'easeOut' } },
};

export const heroCta: Variants = {
  hidden:  { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.9, ease: 'easeOut' } },
};

export const scrollIndicator: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { delay: 1.4, duration: 0.6 } },
};
